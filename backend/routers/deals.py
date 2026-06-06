"""
Deals + Ratings routers
"""
import uuid
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from database import get_db
from models import Deal, Rating, Book, User
from auth import get_current_user

router = APIRouter(tags=["deals"])


class DealIn(BaseModel):
    book_id:   str
    seller_id: str


class RatingIn(BaseModel):
    deal_id:       str
    rated_user_id: str
    stars:         int
    comment:       str | None = None


# ── Deals ─────────────────────────────────────────────────────────────────────

@router.post("/deals")
async def create_deal(body: DealIn, current: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Fetch book
    res  = await db.execute(select(Book).where(Book.id == body.book_id))
    book = res.scalar_one_or_none()
    if not book:
        raise HTTPException(404, "Book not found")

    deal = Deal(
        id        = str(uuid.uuid4()),
        book_id   = body.book_id,
        buyer_id  = current.id,
        seller_id = body.seller_id,
        price     = book.price,
    )
    db.add(deal)

    # Mark book sold
    book.status = "sold"
    await db.flush()

    return {
        "id":         deal.id,
        "book_id":    deal.book_id,
        "buyer_id":   deal.buyer_id,
        "seller_id":  deal.seller_id,
        "price":      deal.price,
        "created_at": deal.created_at.isoformat(),
    }


@router.get("/deals")
async def my_deals(current: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = (
        select(Deal, Book)
        .outerjoin(Book, Deal.book_id == Book.id)
        .where((Deal.buyer_id == current.id) | (Deal.seller_id == current.id))
        .order_by(Deal.created_at.desc())
    )
    rows = await db.execute(stmt)
    out  = []
    for deal, book in rows.all():
        out.append({
            "id":         deal.id,
            "book_id":    deal.book_id,
            "book_title": book.title if book else "—",
            "buyer_id":   deal.buyer_id,
            "seller_id":  deal.seller_id,
            "price":      deal.price,
            "created_at": deal.created_at.isoformat(),
        })
    return out


# ── Ratings ────────────────────────────────────────────────────────────────────

router2 = APIRouter(tags=["ratings"])


@router2.post("/ratings")
async def create_rating(body: RatingIn, current: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not (1 <= body.stars <= 5):
        raise HTTPException(400, "Stars must be 1-5")

    # Prevent duplicate
    existing = await db.execute(
        select(Rating).where(Rating.deal_id == body.deal_id, Rating.rater_id == current.id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(400, "Already rated this deal")

    rating = Rating(
        id            = str(uuid.uuid4()),
        deal_id       = body.deal_id,
        rater_id      = current.id,
        rated_user_id = body.rated_user_id,
        stars         = body.stars,
        comment       = body.comment,
    )
    db.add(rating)
    await db.flush()
    return {"ok": True}


@router2.get("/ratings/user/{user_id}")
async def user_ratings(user_id: str, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(Rating, User)
        .join(User, Rating.rater_id == User.id)
        .where(Rating.rated_user_id == user_id)
        .order_by(Rating.created_at.desc())
    )
    rows    = await db.execute(stmt)
    results = rows.all()

    if not results:
        return {"average": 0, "count": 0, "ratings": []}

    total   = sum(r.stars for r, _ in results)
    average = round(total / len(results), 1)

    return {
        "average": average,
        "count":   len(results),
        "ratings": [
            {
                "id":         r.id,
                "stars":      r.stars,
                "comment":    r.comment,
                "rater_name": u.name,
                "created_at": r.created_at.isoformat(),
            }
            for r, u in results
        ],
    }
