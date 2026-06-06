"""
Auth router: /api/auth/*
"""
import uuid
from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models import User
from auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterIn(BaseModel):
    name:     str
    email:    EmailStr
    password: str
    phone:    str | None = None
    college:  str | None = None
    city:     str | None = None
    degree:   str | None = None
    semester: int | None = None


class LoginIn(BaseModel):
    email:    EmailStr
    password: str


def user_out(u: User) -> dict:
    return {
        "id":       u.id,
        "name":     u.name,
        "email":    u.email,
        "phone":    u.phone,
        "college":  u.college,
        "city":     u.city,
        "degree":   u.degree,
        "semester": u.semester,
        "role":     u.role,
    }


@router.post("/register")
async def register(body: RegisterIn, response: Response, db: AsyncSession = Depends(get_db)):
    exists = await db.execute(select(User).where(User.email == body.email))
    if exists.scalar_one_or_none():
        raise HTTPException(400, "Email already registered")

    user = User(
        id       = str(uuid.uuid4()),
        name     = body.name,
        email    = body.email,
        password = hash_password(body.password),
        phone    = body.phone,
        college  = body.college,
        city     = body.city,
        degree   = body.degree,
        semester = body.semester,
        role     = "student",
    )
    db.add(user)
    await db.flush()

    token = create_access_token({"sub": user.id})
    response.set_cookie("bb_token", token, httponly=True, samesite="lax", max_age=604800)
    return {"token": token, "user": user_out(user)}


@router.post("/login")
async def login(body: LoginIn, response: Response, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user   = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.password):
        raise HTTPException(401, "Invalid credentials")

    token = create_access_token({"sub": user.id})
    response.set_cookie("bb_token", token, httponly=True, samesite="lax", max_age=604800)
    return {"token": token, "user": user_out(user)}


@router.get("/me")
async def me(current: User = Depends(get_current_user)):
    return user_out(current)


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("bb_token")
    return {"ok": True}
