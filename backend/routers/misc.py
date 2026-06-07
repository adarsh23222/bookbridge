"""
Misc routers: ads, stats, price calculator, users, file upload
"""
import uuid, os
import cloudinary
import cloudinary.uploader
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from dotenv import load_dotenv

from database import get_db
from models import Ad, User, Book, Deal, WallPost
from auth import get_current_user

load_dotenv()

cloudinary.config(
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key    = os.getenv("CLOUDINARY_API_KEY"),
    api_secret = os.getenv("CLOUDINARY_API_SECRET"),
)

# ── File upload ────────────────────────────────────────────────────────────────
upload_router = APIRouter(tags=["upload"])

@upload_router.post("/upload")
async def upload_file(file: UploadFile = File(...), current: User = Depends(get_current_user)):
    ext     = Path(file.filename).suffix.lower()
    allowed = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    if ext not in allowed:
        raise HTTPException(400, "Only image files allowed")
    contents = await file.read()
    result   = cloudinary.uploader.upload(contents, folder="bookbridge")
    return {"id": result["secure_url"]}


# ── Ads ────────────────────────────────────────────────────────────────────────
ads_router = APIRouter(prefix="/ads", tags=["ads"])

class AdIn(BaseModel):
    title:       str
    author:      str
    description: str | None = None
    image_url:   str | None = None
    link_url:    str | None = None

def ad_out(a: Ad) -> dict:
    return {
        "id":          a.id,
        "title":       a.title,
        "author":      a.author,
        "description": a.description,
        "image_url":   a.image_url,
        "link_url":    a.link_url,
        "is_featured": a.is_featured,
        "created_at":  a.created_at.isoformat(),
    }

@ads_router.get("/featured")
async def featured_ad(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Ad).where(Ad.is_featured == True).order_by(func.random()).limit(1)
    )
    ad = result.scalar_one_or_none()
    if not ad:
        raise HTTPException(404, "No featured ad")
    return ad_out(ad)

@ads_router.get("")
async def list_ads(current: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Ad).where(Ad.author_id == current.id).order_by(Ad.created_at.desc()))
    return [ad_out(a) for a in result.scalars().all()]

@ads_router.post("")
async def create_ad(body: AdIn, current: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    ad = Ad(
        id          = str(uuid.uuid4()),
        author_id   = current.id,
        title       = body.title,
        author      = body.author,
        description = body.description,
        image_url   = body.image_url,
        link_url    = body.link_url,
        is_featured = True,
    )
    db.add(ad)
    await db.flush()
    return ad_out(ad)


# ── Stats ──────────────────────────────────────────────────────────────────────
stats_router = APIRouter(tags=["stats"])

@stats_router.get("/stats")
async def get_stats(db: AsyncSession = Depends(get_db)):
    users     = await db.execute(select(func.count()).select_from(User))
    books     = await db.execute(select(func.count()).select_from(Book))
    deals     = await db.execute(select(func.count()).select_from(Deal))
    donations = await db.execute(select(func.count()).where(Book.is_donation == True))
    wall      = await db.execute(select(func.count()).select_from(WallPost))
    colleges  = await db.execute(select(func.count(func.distinct(User.college))).select_from(User))

    return {
        "users":      users.scalar()     or 0,
        "books":      books.scalar()     or 0,
        "deals":      deals.scalar()     or 0,
        "donations":  donations.scalar() or 0,
        "wall_posts": wall.scalar()      or 0,
        "colleges":   colleges.scalar()  or 0,
    }


# ── Price calculator ───────────────────────────────────────────────────────────
price_router = APIRouter(prefix="/price", tags=["price"])

CONDITION_MULTIPLIERS = {
    "New":      0.85,
    "Like New": 0.70,
    "Good":     0.55,
    "Fair":     0.35,
    "Poor":     0.20,
}

class PriceIn(BaseModel):
    mrp:        float
    condition:  str = "Good"
    age_years:  float = 0

@price_router.post("/calculate")
async def calculate_price(body: PriceIn):
    cond_mult = CONDITION_MULTIPLIERS.get(body.condition, 0.55)
    age_decay = max(0.5, 1 - (body.age_years * 0.08))
    suggested = round(body.mrp * cond_mult * age_decay)
    return {
        "suggested_price": max(10, suggested),
        "min_price":       max(10, round(suggested * 0.80)),
        "max_price":       round(suggested * 1.20),
    }


# ── Users public profile ───────────────────────────────────────────────────────
users_router = APIRouter(prefix="/users", tags=["users"])

@users_router.get("/{user_id}")
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    u      = result.scalar_one_or_none()
    if not u:
        raise HTTPException(404, "User not found")
    return {
        "id":      u.id,
        "name":    u.name,
        "college": u.college,
        "city":    u.city,
        "degree":  u.degree,
    }


# ── My books ───────────────────────────────────────────────────────────────────
my_router = APIRouter(prefix="/my", tags=["my"])

@my_router.get("/books")
async def my_books(current: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Book).where(Book.seller_id == current.id).order_by(Book.created_at.desc())
    )
    books = result.scalars().all()
    return [
        {
            "id":          b.id,
            "title":       b.title,
            "subject":     b.subject,
            "condition":   b.condition,
            "price":       b.price,
            "is_donation": b.is_donation,
            "status":      b.status,
            "photo_url":   b.photo_url,
        }
        for b in books
    ]
