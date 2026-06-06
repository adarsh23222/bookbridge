"""
Books router: /api/books/*
"""
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func

from database import get_db
from models import Book, User
from auth import get_current_user, get_optional_user

router = APIRouter(prefix="/books", tags=["books"])


class BookIn(BaseModel):
    title:       str
    author:      str
    subject:     str | None = None
    semester:    int | None = None
    degree:      str | None = None
    condition:   str = "Good"
    price:       float = 0
    mrp:         float | None = None
    age_years:   float = 0
    description: str | None = None
    photo_url:   str | None = None
    is_donation: bool = False


def book_out(b: Book, seller: User | None = None) -> dict:
    s = seller or b.seller
    return {
        "id":           b.id,
        "seller_id":    b.seller_id,
        "seller_name":  s.name if s else "",
        "seller_city":  s.city if s else "",
        "seller_college": s.college if s else "",
        "title":        b.title,
        "author":       b.author,
        "subject":      b.subject,
        "semester":     b.semester,
        "degree":       b.degree,
        "condition":    b.condition,
        "price":        b.price,
        "mrp":          b.mrp,
        "age_years":    b.age_years,
        "description":  b.description,
        "photo_url":    b.photo_url,
        "is_donation":  b.is_donation,
        "status":       b.status,
        "created_at":   b.created_at.isoformat() if b.created_at else None,
    }


@router.get("")
async def list_books(
    q:          Optional[str]  = Query(None),
    subject:    Optional[str]  = Query(None),
    semester:   Optional[int]  = Query(None),
    degree:     Optional[str]  = Query(None),
    city:       Optional[str]  = Query(None),
    college:    Optional[str]  = Query(None),
    is_donation: Optional[bool] = Query(None),
    current:    Optional[User] = Depends(get_optional_user),
    db:         AsyncSession   = Depends(get_db),
):
    stmt = (
        select(Book, User)
        .join(User, Book.seller_id == User.id)
        .where(Book.status == "available")
    )

    if q:
        like = f"%{q}%"
        stmt = stmt.where(
            or_(Book.title.ilike(like), Book.author.ilike(like), Book.subject.ilike(like))
        )
    if subject:
        stmt = stmt.where(Book.subject.ilike(f"%{subject}%"))
    if semester:
        stmt = stmt.where(Book.semester == semester)
    if degree:
        stmt = stmt.where(Book.degree.ilike(f"%{degree}%"))
    if city:
        stmt = stmt.where(User.city.ilike(f"%{city}%"))
    if college:
        stmt = stmt.where(User.college.ilike(f"%{college}%"))
    if is_donation is not None:
        stmt = stmt.where(Book.is_donation == is_donation)

    stmt = stmt.order_by(Book.created_at.desc())
    rows = await db.execute(stmt)
    books = rows.all()

    # Smart sort — same city/college first
    result = [book_out(b, s) for b, s in books]
    if current:
        def priority(bk):
            score = 0
            if bk["seller_city"] == current.city: score += 2
            if bk["seller_college"] == current.college: score += 3
            return -score
        result.sort(key=priority)

    return result


@router.get("/{book_id}")
async def get_book(book_id: str, db: AsyncSession = Depends(get_db)):
    stmt   = select(Book, User).join(User, Book.seller_id == User.id).where(Book.id == book_id)
    row    = await db.execute(stmt)
    result = row.one_or_none()
    if not result:
        raise HTTPException(404, "Book not found")
    b, s = result
    return book_out(b, s)


@router.post("")
async def create_book(body: BookIn, current: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    book = Book(
        id          = str(uuid.uuid4()),
        seller_id   = current.id,
        title       = body.title,
        author      = body.author,
        subject     = body.subject,
        semester    = body.semester,
        degree      = body.degree,
        condition   = body.condition,
        price       = 0 if body.is_donation else body.price,
        mrp         = body.mrp,
        age_years   = body.age_years,
        description = body.description,
        photo_url   = body.photo_url,
        is_donation = body.is_donation,
        status      = "available",
    )
    db.add(book)
    await db.flush()
    return book_out(book, current)


@router.delete("/{book_id}")
async def delete_book(book_id: str, current: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Book).where(Book.id == book_id))
    book   = result.scalar_one_or_none()
    if not book:
        raise HTTPException(404, "Not found")
    if book.seller_id != current.id and current.role != "admin":
        raise HTTPException(403, "Forbidden")
    await db.delete(book)
    return {"ok": True}
