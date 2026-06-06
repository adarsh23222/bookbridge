import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api, { fileUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { dateIST } from "@/lib/time";
import { Star, MessageCircle, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function BookDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuth();
  const [book,   setBook]   = useState(null);
  
  const [rating, setRating] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/books/${id}`);
      setBook(data);
      try {
        
        
        const { data: r } = await api.get(`/ratings/user/${data.seller_id}`);
        setRating(r);
      } catch {}
    })().catch(() => navigate("/browse"));
  }, [id, navigate]);

  if (!book) return (
    <div className="min-h-[60vh] flex items-center justify-center text-[#A1A1AA]">
      <div className="font-serif text-2xl">Loading…</div>
    </div>
  );

  const isOwn = user?.id === book.seller_id;

  const buy = async () => {
    if (!user) { navigate("/login"); return; }
    if (isOwn) return;
    try {
      await api.post("/deals", { book_id: book.id, seller_id: book.seller_id });
      toast.success("Deal recorded. Don't forget to rate the seller.");
      navigate("/dashboard");
    } catch { toast.error("Failed to record deal"); }
  };

  const deleteBook = async () => {
    if (!window.confirm("Delete this listing?")) return;
    await api.delete(`/books/${book.id}`);
    toast.success("Book removed");
    navigate("/dashboard");
  };

  return (
    <div className="grain max-w-6xl mx-auto px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-[3/4] bg-[#141417] border border-[#27272A] overflow-hidden">
          {book.photo_url
            ? <img src={fileUrl(book.photo_url)} alt={book.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-7xl text-[#3a3a3f]">📖</div>
          }
        </div>

        <div>
          <div className="text-xs tracking-[0.3em] uppercase text-[#E27D60] mb-3">{book.subject}{book.semester ? ` · Sem ${book.semester}` : ""}</div>
          <h1 className="editorial-heading text-4xl md:text-5xl">{book.title}</h1>
          <p className="text-[#A1A1AA] mt-2 text-lg">by {book.author}</p>

          <div className="mt-6 flex items-baseline gap-4">
            {book.is_donation
              ? <span className="font-mono text-3xl text-[#658354]">FREE · DONATION</span>
              : <>
                  <span className="font-mono text-4xl text-[#E27D60]">₹{book.price}</span>
                  {book.mrp && <span className="text-[#A1A1AA] line-through text-sm">₹{book.mrp}</span>}
                </>
            }
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <Info label="Condition" value={book.condition} />
            <Info label="Degree"    value={book.degree || "—"} />
            <Info label="Listed"    value={dateIST(book.created_at)} />
            <Info label="Status"    value={book.status} />
          </div>

          {book.description && (
            <p className="mt-6 text-[#d4d4d8] leading-relaxed border-l-2 border-[#E27D60] pl-4">{book.description}</p>
          )}

          <div className="mt-8 p-5 border border-[#27272A] bg-[#141417]">
            <div className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-2">Seller</div>
            <div className="font-serif text-2xl">{book.seller_name}</div>
            <div className="text-sm text-[#A1A1AA] mt-1">{book.seller_college} {book.seller_city ? `· ${book.seller_city}` : ""}</div>
            {rating && rating.count > 0 && (
              <div className="flex items-center gap-1 mt-2 text-sm">
                <Star className="w-4 h-4 text-[#E27D60] fill-[#E27D60]" />
                {rating.average} <span className="text-[#A1A1AA]">({rating.count} reviews)</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {isOwn ? (
              <button data-testid="book-delete" onClick={deleteBook} className="border border-red-700 text-red-400 px-5 py-3 hover:bg-red-950 transition inline-flex items-center gap-2 text-sm">
                <Trash2 className="w-4 h-4" /> Delete listing
              </button>
            ) : (
              <>
                <button data-testid="book-chat" onClick={() => user ? navigate(`/chat/${book.seller_id}`) : navigate("/login")}
                  className="btn-primary inline-flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Message Seller
                </button>
                {!book.is_donation && (
                  <button data-testid="book-buy" onClick={buy}
                    className="border border-[#27272A] hover:border-[#E27D60] px-5 py-3 inline-flex items-center gap-2 text-sm transition">
                    <ShoppingBag className="w-4 h-4" /> Mark Purchased
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="border-t border-[#27272A] pt-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#A1A1AA]">{label}</div>
      <div className="mt-1">{value}</div>
    </div>
  );
}
