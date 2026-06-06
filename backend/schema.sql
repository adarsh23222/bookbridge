-- BookBridge PostgreSQL Schema
-- Run this manually OR let SQLAlchemy auto-create on startup

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id         TEXT PRIMARY KEY,
    name       VARCHAR(120)  NOT NULL,
    email      VARCHAR(200)  NOT NULL UNIQUE,
    password   VARCHAR(200)  NOT NULL,
    phone      VARCHAR(20),
    college    VARCHAR(200),
    city       VARCHAR(100),
    degree     VARCHAR(100),
    semester   INTEGER,
    role       VARCHAR(20)   DEFAULT 'student',
    created_at TIMESTAMP     DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS books (
    id          TEXT PRIMARY KEY,
    seller_id   TEXT          REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(300)  NOT NULL,
    author      VARCHAR(200)  NOT NULL,
    subject     VARCHAR(200),
    semester    INTEGER,
    degree      VARCHAR(100),
    condition   VARCHAR(30)   DEFAULT 'Good',
    price       FLOAT         DEFAULT 0,
    mrp         FLOAT,
    age_years   FLOAT         DEFAULT 0,
    description TEXT,
    photo_url   VARCHAR(500),
    is_donation BOOLEAN       DEFAULT FALSE,
    status      VARCHAR(30)   DEFAULT 'available',
    created_at  TIMESTAMP     DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id          TEXT PRIMARY KEY,
    sender_id   TEXT          REFERENCES users(id) ON DELETE CASCADE,
    receiver_id TEXT          REFERENCES users(id) ON DELETE CASCADE,
    content     TEXT          NOT NULL,
    is_read     BOOLEAN       DEFAULT FALSE,
    created_at  TIMESTAMP     DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deals (
    id         TEXT PRIMARY KEY,
    book_id    TEXT          REFERENCES books(id) ON DELETE SET NULL,
    buyer_id   TEXT          REFERENCES users(id) ON DELETE SET NULL,
    seller_id  TEXT          REFERENCES users(id) ON DELETE SET NULL,
    price      FLOAT         DEFAULT 0,
    created_at TIMESTAMP     DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ratings (
    id             TEXT PRIMARY KEY,
    deal_id        TEXT    REFERENCES deals(id)  ON DELETE CASCADE,
    rater_id       TEXT    REFERENCES users(id)  ON DELETE CASCADE,
    rated_user_id  TEXT    REFERENCES users(id)  ON DELETE CASCADE,
    stars          INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
    comment        TEXT,
    created_at     TIMESTAMP DEFAULT NOW(),
    UNIQUE(deal_id, rater_id)
);

CREATE TABLE IF NOT EXISTS otp_codes (
    id         TEXT PRIMARY KEY,
    email      VARCHAR(200) NOT NULL,
    code       VARCHAR(10)  NOT NULL,
    used       BOOLEAN      DEFAULT FALSE,
    created_at TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wall_posts (
    id         TEXT PRIMARY KEY,
    author_id  TEXT  REFERENCES users(id) ON DELETE CASCADE,
    content    TEXT  NOT NULL,
    image_url  VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wall_comments (
    id         TEXT PRIMARY KEY,
    post_id    TEXT  REFERENCES wall_posts(id) ON DELETE CASCADE,
    author_id  TEXT  REFERENCES users(id)     ON DELETE CASCADE,
    content    TEXT  NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wall_likes (
    id         TEXT PRIMARY KEY,
    post_id    TEXT  REFERENCES wall_posts(id) ON DELETE CASCADE,
    user_id    TEXT  REFERENCES users(id)     ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS ads (
    id          TEXT PRIMARY KEY,
    author_id   TEXT  REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(300) NOT NULL,
    author      VARCHAR(200) NOT NULL,
    description TEXT,
    image_url   VARCHAR(500),
    link_url    VARCHAR(500),
    is_featured BOOLEAN   DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_books_seller    ON books(seller_id);
CREATE INDEX IF NOT EXISTS idx_books_status    ON books(status);
CREATE INDEX IF NOT EXISTS idx_msgs_sender     ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_msgs_receiver   ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_wall_author     ON wall_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_wall_comments   ON wall_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_wall_likes      ON wall_likes(post_id);
