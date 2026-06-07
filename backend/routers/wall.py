"""
Student Wall router: /api/wall/*
"""
import uuid
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database import get_db
from models import WallPost, WallComment, WallLike, User
from auth import get_current_user, get_optional_user

router = APIRouter(prefix="/wall", tags=["wall"])

class PostIn(BaseModel):
    content:   str
    image_url: str | None = None

class CommentIn(BaseModel):
    post_id: str
    content: str

@router.get("/posts")
async def get_posts(db: AsyncSession = Depends(get_db)):
    stmt = (
        select(WallPost, User)
        .join(User, WallPost.author_id == User.id)
        .order_by(WallPost.created_at.desc())
    )
    rows = await db.execute(stmt)
    out = []
    for post, author in rows.all():
        lc = await db.execute(select(func.count()).where(WallLike.post_id    == post.id))
        cc = await db.execute(select(func.count()).where(WallComment.post_id == post.id))
        out.append({
            "id":             post.id,
            "author_id":      post.author_id,
            "author_name":    author.name,
            "author_college": author.college or "",
            "content":        post.content,
            "image_url":      post.image_url,
            "likes_count":    lc.scalar() or 0,
            "comments_count": cc.scalar() or 0,
            "created_at":     post.created_at.isoformat(),
        })
    return out

@router.post("/posts")
async def create_post(body: PostIn, current: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    post = WallPost(
        id        = str(uuid.uuid4()),
        author_id = current.id,
        content   = body.content,
        image_url = body.image_url,
    )
    db.add(post)
    await db.flush()
    return {"id": post.id, "ok": True}

@router.delete("/posts/{post_id}")
async def delete_post(post_id: str, current: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(WallPost).where(WallPost.id == post_id))
    post   = result.scalar_one_or_none()
    if not post:
        raise HTTPException(404, "Post not found")
    if post.author_id != current.id and current.role != "admin":
        raise HTTPException(403, "Forbidden")
    await db.delete(post)
    return {"ok": True}

@router.post("/posts/{post_id}/like")
async def toggle_like(post_id: str, current: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    res  = await db.execute(select(WallLike).where(WallLike.post_id == post_id, WallLike.user_id == current.id))
    like = res.scalar_one_or_none()
    if like:
        await db.delete(like)
        return {"liked": False}
    else:
        db.add(WallLike(id=str(uuid.uuid4()), post_id=post_id, user_id=current.id))
        return {"liked": True}

@router.get("/posts/{post_id}/likes/me")
async def my_like(post_id: str, current: User = Depends(get_optional_user), db: AsyncSession = Depends(get_db)):
    if not current:
        return {"liked": False}
    res  = await db.execute(select(WallLike).where(WallLike.post_id == post_id, WallLike.user_id == current.id))
    like = res.scalar_one_or_none()
    return {"liked": bool(like)}

@router.get("/posts/{post_id}/comments")
async def get_comments(post_id: str, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(WallComment, User)
        .join(User, WallComment.author_id == User.id)
        .where(WallComment.post_id == post_id)
        .order_by(WallComment.created_at.asc())
    )
    rows = await db.execute(stmt)
    return [
        {
            "id":          c.id,
            "author_name": u.name,
            "content":     c.content,
            "created_at":  c.created_at.isoformat(),
        }
        for c, u in rows.all()
    ]

@router.post("/comments")
async def add_comment(body: CommentIn, current: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    c = WallComment(
        id        = str(uuid.uuid4()),
        post_id   = body.post_id,
        author_id = current.id,
        content   = body.content,
    )
    db.add(c)
    await db.flush()
    return {"id": c.id, "ok": True}
