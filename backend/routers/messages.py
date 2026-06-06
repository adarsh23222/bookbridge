"""
Messages router: /api/messages/* + WebSocket /api/ws/chat
"""
import uuid, json
from typing import Dict, Set
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_, func, case

from database import get_db, AsyncSessionLocal
from models import Message, User
from auth import get_current_user, decode_token

router = APIRouter(tags=["messages"])

# ── WebSocket connection manager ──────────────────────────────────────────────
class ConnectionManager:
    def __init__(self):
        self.active: Dict[str, Set[WebSocket]] = {}

    async def connect(self, user_id: str, ws: WebSocket):
        await ws.accept()
        self.active.setdefault(user_id, set()).add(ws)

    def disconnect(self, user_id: str, ws: WebSocket):
        self.active.get(user_id, set()).discard(ws)

    async def send_to(self, user_id: str, data: dict):
        for ws in list(self.active.get(user_id, [])):
            try:
                await ws.send_text(json.dumps(data))
            except Exception:
                self.active.get(user_id, set()).discard(ws)


manager = ConnectionManager()


@router.websocket("/ws/chat")
async def ws_chat(websocket: WebSocket, token: str = Query(...)):
    # Authenticate
    try:
        payload = decode_token(token)
        uid     = payload.get("sub")
    except Exception:
        await websocket.close(code=1008)
        return

    await manager.connect(uid, websocket)
    try:
        while True:
            await websocket.receive_text()   # keep alive; actual sends via REST
    except WebSocketDisconnect:
        manager.disconnect(uid, websocket)


# ── REST endpoints ─────────────────────────────────────────────────────────────

class MsgIn(BaseModel):
    receiver_id: str
    content:     str


def msg_out(m: Message) -> dict:
    return {
        "id":          m.id,
        "sender_id":   m.sender_id,
        "receiver_id": m.receiver_id,
        "content":     m.content,
        "is_read":     m.is_read,
        "created_at":  m.created_at.isoformat() if m.created_at else None,
    }


@router.post("/messages")
async def send_message(body: MsgIn, current: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    msg = Message(
        id          = str(uuid.uuid4()),
        sender_id   = current.id,
        receiver_id = body.receiver_id,
        content     = body.content,
    )
    db.add(msg)
    await db.flush()

    out = msg_out(msg)
    # Push via WebSocket to both parties
    payload = {"type": "message", "data": out}
    await manager.send_to(body.receiver_id, payload)
    await manager.send_to(current.id,       payload)

    return out


@router.get("/messages/conversations")
async def conversations(current: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Return one entry per unique conversation partner."""
    stmt = select(Message).where(
        or_(Message.sender_id == current.id, Message.receiver_id == current.id)
    ).order_by(Message.created_at.desc())
    rows = await db.execute(stmt)
    msgs = rows.scalars().all()

    seen: Dict[str, dict] = {}
    for m in msgs:
        other = m.receiver_id if m.sender_id == current.id else m.sender_id
        if other not in seen:
            seen[other] = {
                "user_id":      other,
                "last_message": m.content,
                "last_time":    m.created_at.isoformat(),
                "unread":       0,
            }
        if not m.is_read and m.receiver_id == current.id:
            seen[other]["unread"] = seen[other].get("unread", 0) + 1

    # Fetch names
    user_ids = list(seen.keys())
    if user_ids:
        res   = await db.execute(select(User).where(User.id.in_(user_ids)))
        users = {u.id: u for u in res.scalars().all()}
        for uid, conv in seen.items():
            u = users.get(uid)
            conv["name"]    = u.name    if u else "Unknown"
            conv["college"] = u.college if u else ""

    return list(seen.values())


@router.get("/messages/{other_user_id}")
async def get_thread(other_user_id: str, current: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Message).where(
        or_(
            and_(Message.sender_id == current.id,       Message.receiver_id == other_user_id),
            and_(Message.sender_id == other_user_id,    Message.receiver_id == current.id),
        )
    ).order_by(Message.created_at.asc())
    rows = await db.execute(stmt)
    msgs = rows.scalars().all()

    # Mark as read
    for m in msgs:
        if m.receiver_id == current.id and not m.is_read:
            m.is_read = True
    await db.flush()

    return [msg_out(m) for m in msgs]
