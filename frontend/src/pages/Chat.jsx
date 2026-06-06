import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { timeIST, dateIST } from "@/lib/time";
import { Send, MessageCircle } from "lucide-react";

export default function Chat() {
  const { user }    = useAuth();
  const { userId }  = useParams();
  const navigate    = useNavigate();
  const [convos,    setConvos]    = useState([]);
  const [activeId,  setActiveId]  = useState(userId || null);
  const [thread,    setThread]    = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [text,      setText]      = useState("");
  const wsRef       = useRef(null);
  const scrollRef   = useRef(null);

  const loadConvos = async () => {
    try {
      const { data } = await api.get("/messages/conversations");
      setConvos(data);
    } catch {}
  };

  const loadThread = async (uid) => {
    setActiveId(uid);
    try {
      const { data: msgs } = await api.get(`/messages/${uid}`);
      setThread(msgs);
      const { data: u }    = await api.get(`/users/${uid}`);
      setOtherUser(u);
    } catch {}
  };

  useEffect(() => { loadConvos(); }, []);

  useEffect(() => {
    if (activeId) loadThread(activeId);
  }, [activeId]);  // eslint-disable-line

  useEffect(() => {
    if (userId && userId !== activeId) setActiveId(userId);
  }, [userId]);  // eslint-disable-line

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thread]);

  // WebSocket connection
  useEffect(() => {
    if (!user) return;
    const token   = localStorage.getItem("bb_token");
    if (!token) return;

    const proto   = window.location.protocol === "https:" ? "wss" : "ws";
    const backend = (import.meta.env.VITE_BACKEND_URL || "").replace(/^https?:\/\//, "");
    const ws      = new WebSocket(`${proto}://${backend}/api/ws/chat?token=${token}`);
    wsRef.current = ws;

    ws.onmessage = (e) => {
      try {
        const m = JSON.parse(e.data);
        if (m.type === "message") {
          const msg = m.data;
          if (
            (msg.sender_id === activeId   && msg.receiver_id === user.id) ||
            (msg.sender_id === user.id    && msg.receiver_id === activeId)
          ) {
            setThread((t) => t.find((x) => x.id === msg.id) ? t : [...t, msg]);
          }
          loadConvos();
        }
      } catch {}
    };
    ws.onerror = () => {};
    return () => { try { ws.close(); } catch {} };
  }, [user, activeId]);  // eslint-disable-line

  // NAYA CODE
const send = async (e) => {
  e.preventDefault();
  if (!text.trim() || !activeId) return;
  try {
    await api.post("/messages", { receiver_id: activeId, content: text });
    setText(""); loadConvos();
  } catch {}
};

  if (!user) { navigate("/login"); return null; }

  return (
    <div className="grain max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="text-xs tracking-[0.3em] uppercase text-[#E27D60] mb-2">Messages</div>
      <h1 className="editorial-heading text-4xl md:text-5xl mb-8">Conversations.</h1>

      <div className="grid grid-cols-12 gap-px bg-[#27272A] border border-[#27272A] min-h-[70vh]">

        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-4 lg:col-span-3 bg-[#0A0A0B] overflow-y-auto max-h-[70vh]">
          {convos.length === 0 ? (
            <div className="p-6 text-sm text-[#A1A1AA]">No conversations yet. Start by messaging a seller.</div>
          ) : convos.map((c) => (
            <button
              key={c.user_id}
              data-testid={`convo-${c.user_id}`}
              onClick={() => navigate(`/chat/${c.user_id}`)}
              className={`w-full text-left p-4 border-b border-[#27272A] hover:bg-[#141417] transition ${activeId === c.user_id ? "bg-[#141417]" : ""}`}
            >
              <div className="flex justify-between items-baseline">
                <div className="font-serif text-lg">{c.name}</div>
                <div className="text-[10px] text-[#A1A1AA]">{timeIST(c.last_time)}</div>
              </div>
              <div className="text-xs text-[#A1A1AA] mt-1 line-clamp-1">{c.last_message}</div>
              {c.unread > 0 && (
                <div className="mt-1 inline-block bg-[#E27D60] text-black text-[10px] px-1.5 font-semibold">{c.unread}</div>
              )}
            </button>
          ))}
        </aside>

        {/* Thread */}
        <section className="col-span-12 md:col-span-8 lg:col-span-9 bg-[#0A0A0B] flex flex-col">
          {!activeId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-[#A1A1AA] p-8">
              <MessageCircle className="w-12 h-12 mb-4 text-[#27272A]" />
              <div className="font-serif text-2xl">Select a conversation</div>
              <div className="text-sm mt-2">or message a seller from a book listing</div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="border-b border-[#27272A] p-4">
                <div className="font-serif text-xl">{otherUser?.name || "User"}</div>
                <div className="text-xs text-[#A1A1AA]">
                  {otherUser?.college || ""}{otherUser?.city ? ` · ${otherUser.city}` : ""}
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3 max-h-[55vh]">
                {thread.length === 0 ? (
                  <div className="text-center text-[#A1A1AA] text-sm py-8">No messages yet. Say hello.</div>
                ) : thread.map((m) => {
                  const me = m.sender_id === user.id;
                  return (
                    <div key={m.id} className={`flex ${me ? "justify-end" : "justify-start"}`}>
                      <div data-testid={`msg-${m.id}`} className={`max-w-[72%] px-4 py-2.5 ${me ? "bubble-me" : "bubble-them"}`}>
                        <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</div>
                        <div className="text-[10px] text-[#A1A1AA] mt-1 text-right">{timeIST(m.created_at)} IST</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <form onSubmit={send} className="border-t border-[#27272A] p-3 flex gap-2">
                <input
                  data-testid="chat-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 bg-[#141417] border border-[#27272A] px-4 py-3 outline-none focus:border-[#E27D60]"
                />
                <button data-testid="chat-send" className="btn-primary inline-flex items-center gap-2 px-5">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
