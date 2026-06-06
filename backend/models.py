"""
SQLAlchemy ORM models for BookBridge (PostgreSQL)
"""
import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, Text,
    DateTime, ForeignKey, UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

def gen_uuid():
    return str(uuid.uuid4())

def now_utc():
    return datetime.utcnow()


class User(Base):
    __tablename__ = "users"

    id         = Column(String, primary_key=True, default=gen_uuid)
    name       = Column(String(120), nullable=False)
    email      = Column(String(200), unique=True, nullable=False, index=True)
    password   = Column(String(200), nullable=False)
    phone      = Column(String(20))
    college    = Column(String(200))
    city       = Column(String(100))
    degree     = Column(String(100))
    semester   = Column(Integer)
    role       = Column(String(20), default="student")   # student | admin
    created_at = Column(DateTime, default=now_utc)

    books      = relationship("Book",    back_populates="seller",  cascade="all, delete-orphan")
    sent_msgs  = relationship("Message", foreign_keys="Message.sender_id",   back_populates="sender")
    recv_msgs  = relationship("Message", foreign_keys="Message.receiver_id", back_populates="receiver")


class Book(Base):
    __tablename__ = "books"

    id          = Column(String, primary_key=True, default=gen_uuid)
    seller_id   = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title       = Column(String(300), nullable=False)
    author      = Column(String(200), nullable=False)
    subject     = Column(String(200))
    semester    = Column(Integer)
    degree      = Column(String(100))
    condition   = Column(String(30), default="Good")
    price       = Column(Float, default=0)
    mrp         = Column(Float)
    age_years   = Column(Float, default=0)
    description = Column(Text)
    photo_url   = Column(String(500))
    is_donation = Column(Boolean, default=False)
    status      = Column(String(30), default="available")   # available | sold | donated
    created_at  = Column(DateTime, default=now_utc)

    seller      = relationship("User", back_populates="books")
    deals       = relationship("Deal", back_populates="book", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id          = Column(String, primary_key=True, default=gen_uuid)
    sender_id   = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    receiver_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    content     = Column(Text, nullable=False)
    is_read     = Column(Boolean, default=False)
    created_at  = Column(DateTime, default=now_utc)

    sender      = relationship("User", foreign_keys=[sender_id],   back_populates="sent_msgs")
    receiver    = relationship("User", foreign_keys=[receiver_id], back_populates="recv_msgs")


class Deal(Base):
    __tablename__ = "deals"

    id         = Column(String, primary_key=True, default=gen_uuid)
    book_id    = Column(String, ForeignKey("books.id", ondelete="SET NULL"), nullable=True)
    buyer_id   = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    seller_id  = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    price      = Column(Float, default=0)
    created_at = Column(DateTime, default=now_utc)

    book       = relationship("Book", back_populates="deals")


class Rating(Base):
    __tablename__ = "ratings"

    id             = Column(String, primary_key=True, default=gen_uuid)
    deal_id        = Column(String, ForeignKey("deals.id", ondelete="CASCADE"))
    rater_id       = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    rated_user_id  = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    stars          = Column(Integer, nullable=False)
    comment        = Column(Text)
    created_at     = Column(DateTime, default=now_utc)

    __table_args__ = (UniqueConstraint("deal_id", "rater_id", name="uq_deal_rater"),)


class OTPCode(Base):
    __tablename__ = "otp_codes"

    id         = Column(String, primary_key=True, default=gen_uuid)
    email      = Column(String(200), nullable=False, index=True)
    code       = Column(String(10), nullable=False)
    used       = Column(Boolean, default=False)
    created_at = Column(DateTime, default=now_utc)


class WallPost(Base):
    __tablename__ = "wall_posts"

    id            = Column(String, primary_key=True, default=gen_uuid)
    author_id     = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content       = Column(Text, nullable=False)
    image_url     = Column(String(500))
    created_at    = Column(DateTime, default=now_utc)

    author        = relationship("User")
    comments      = relationship("WallComment", back_populates="post", cascade="all, delete-orphan")
    likes         = relationship("WallLike",    back_populates="post", cascade="all, delete-orphan")


class WallComment(Base):
    __tablename__ = "wall_comments"

    id         = Column(String, primary_key=True, default=gen_uuid)
    post_id    = Column(String, ForeignKey("wall_posts.id", ondelete="CASCADE"), nullable=False)
    author_id  = Column(String, ForeignKey("users.id",      ondelete="CASCADE"), nullable=False)
    content    = Column(Text, nullable=False)
    created_at = Column(DateTime, default=now_utc)

    post       = relationship("WallPost", back_populates="comments")
    author     = relationship("User")


class WallLike(Base):
    __tablename__ = "wall_likes"

    id         = Column(String, primary_key=True, default=gen_uuid)
    post_id    = Column(String, ForeignKey("wall_posts.id", ondelete="CASCADE"), nullable=False)
    user_id    = Column(String, ForeignKey("users.id",      ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=now_utc)

    __table_args__ = (UniqueConstraint("post_id", "user_id", name="uq_post_like"),)

    post   = relationship("WallPost", back_populates="likes")
    user   = relationship("User")


class Ad(Base):
    __tablename__ = "ads"

    id          = Column(String, primary_key=True, default=gen_uuid)
    author_id   = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title       = Column(String(300), nullable=False)
    author      = Column(String(200), nullable=False)
    description = Column(Text)
    image_url   = Column(String(500))
    link_url    = Column(String(500))
    is_featured = Column(Boolean, default=True)
    created_at  = Column(DateTime, default=now_utc)

    creator     = relationship("User")
