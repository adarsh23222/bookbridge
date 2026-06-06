"""
BookBridge Backend — FastAPI + PostgreSQL
"""
import os, uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import create_tables, AsyncSessionLocal
from models import User
from auth import hash_password

load_dotenv()

FRONTEND_URL   = os.getenv("FRONTEND_URL", "http://localhost:5173")
ADMIN_EMAIL    = os.getenv("ADMIN_EMAIL",   "admin@bookbridge.in")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD","Admin@1234")


async def seed_admin():
    """Create admin user if not exists."""
    from sqlalchemy import select
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(User).where(User.email == ADMIN_EMAIL))
        if not res.scalar_one_or_none():
            admin = User(
                id       = str(uuid.uuid4()),
                name     = "BookBridge Admin",
                email    = ADMIN_EMAIL,
                password = hash_password(ADMIN_PASSWORD),
                role     = "admin",
                college  = "BookBridge HQ",
                city     = "Delhi",
            )
            db.add(admin)
            await db.commit()
            print(f"[BookBridge] Admin seeded: {ADMIN_EMAIL}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    await seed_admin()
    yield


app = FastAPI(title="BookBridge API", version="2.0.0", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────────────────────────
from routers.auth     import router as auth_router
from routers.books    import router as books_router
from routers.messages import router as msg_router
from routers.deals    import router as deals_router, router2 as ratings_router
from routers.wall     import router as wall_router
from routers.misc     import (
    upload_router, ads_router, stats_router,
    price_router,  users_router, my_router,
)

PREFIX = "/api"
app.include_router(auth_router,    prefix=PREFIX)
app.include_router(books_router,   prefix=PREFIX)
app.include_router(msg_router,     prefix=PREFIX)
app.include_router(deals_router,   prefix=PREFIX)
app.include_router(ratings_router, prefix=PREFIX)
app.include_router(wall_router,    prefix=PREFIX)
app.include_router(upload_router,  prefix=PREFIX)
app.include_router(ads_router,     prefix=PREFIX)
app.include_router(stats_router,   prefix=PREFIX)
app.include_router(price_router,   prefix=PREFIX)
app.include_router(users_router,   prefix=PREFIX)
app.include_router(my_router,      prefix=PREFIX)

# WebSocket (no prefix strip needed — already /api/ws/chat in router)
from routers.messages import router as ws_router
app.include_router(ws_router, prefix=PREFIX)


@app.get("/")
async def root():
    return {"status": "BookBridge API v2.0 running", "docs": "/docs"}
