import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { dateIST } from "@/lib/time";
import { Star, BookOpen, ShoppingBag, Megaphone } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user }  = useAuth();
  const [myBooks, setMyBooks] = useState([]);
  const [deals,   setDeals]   = useState([]);
  const [ratings, setRatings] = useState({ average: 0, count: 0, ratings: [] });
  const [tab,       setTab]       = useState("listings");
  const [rateModal, setRateModal] = useState(null);

  useEffect(() => {
    (async () => {
      const [{ data: mb }, { data: ds }, { data: r }] = await Promise.all([
        api.get("/my/books"),
        api.get("/deals"),
        api.get(`/ratings/user/${user.id}`),
      ]);
      setMyBooks(mb); setDeals(ds); setRatings(r);
    })();
  }, [user.id]);

  return (
    <div className="grain max-w-6xl mx-auto px-6 lg:px-8 py-12">
      <div className="text-xs tracking-[0.3em] uppercase text-[#E27D60] mb-3">Your space</div>
      <h1 className="editorial-heading text-5xl mb-2">Hello, {user.name?.split(" ")[0] || "scholar"}.</h1>
      <p className="text-[#A1A1AA] mb-8">{user.college}{user.city ? ` · ${user.city}` : ""}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <Stat label="Books listed" value={myBooks.length}        icon={BookOpen} />
        <Stat label="Deals"        value={deals.length}          icon={ShoppingBag} />
        <Stat label="Rating"       value={ratings.average || "—"} icon={Star} />
        <Stat label="Reviews"      value={ratings.count}         icon={Star} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#27272A] mb-6 overflow-x-auto">
        {[["listings","My Listings"],["deals","Deal History"],["ratings","Reviews"]].map(([k, l]) => (
          <button key={k} data-testid={`tab-${k}`} onClick={() => setTab(k)}
            className={`px-5 py-3 text-sm border-b-2 whitespace-nowrap transition ${tab === k ? "border-[#E27D60] text-white" : "border-transparent text-[#A1A1AA] hover:text-white"}`}>
            {l}
          </button>
        ))}
        <Link to="/ads" data-testid="tab-ads" className="ml-auto px-5 py-3 text-sm text-[#A1A1AA] hover:text-white inline-flex items-center gap-2 whitespace-nowrap">
          <Megaphone className="w-4 h-4" /> Manage Ads
        </Link>
      </div>

      {/* Listings tab */}
      {tab === "listings" && (
        <div>
          {myBooks.length === 0 ? (
            <div className="text-[#A1A1AA] py-8">You haven't listed any books yet.{" "}
              <Link to="/list-book" className="text-[#E27D60] hover:underline">List one →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {myBooks.map((b) => (
                <Link to={`/books/${b.id}`} key={b.id} className="card-edge p-4 flex justify-between items-center">
                  <div>
                    <div className="font-serif text-xl">{b.title}</div>
                    <div className="text-xs text-[#A1A1AA]">{b.subject} · {b.condition} · {b.status}</div>
                  </div>
                  <div className="font-mono text-[#E27D60]">{b.is_donation ? "FREE" : `₹${b.price}`}</div>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-6">
            <Link to="/list-book" className="btn-primary text-sm">+ List a new book</Link>
          </div>
        </div>
      )}

      {/* Deals tab */}
      {tab === "deals" && (
        <div>
          {deals.length === 0 ? (
            <div className="text-[#A1A1AA] py-8">No deal history yet.</div>
          ) : (
            <div className="space-y-2">
              {deals.map((d) => {
                const role      = d.buyer_id === user.id ? "Bought" : "Sold";
                const otherUid  = d.buyer_id === user.id ? d.seller_id : d.buyer_id;
                return (
                  <div key={d.id} className="border border-[#27272A] p-4 flex justify-between items-center" data-testid={`deal-${d.id}`}>
                    <div>
                      <div className="font-serif text-lg">{d.book_title}</div>
                      <div className="text-xs text-[#A1A1AA]">{role} · {dateIST(d.created_at)} · ₹{d.price}</div>
                    </div>
                    <button data-testid={`rate-${d.id}`} onClick={() => setRateModal({ deal: d, rated_user_id: otherUid })}
                      className="text-sm text-[#E27D60] hover:underline">Rate</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Ratings tab */}
      {tab === "ratings" && (
        <div className="space-y-3">
          {(!ratings.ratings || ratings.ratings.length === 0) ? (
            <div className="text-[#A1A1AA] py-8">No reviews yet.</div>
          ) : ratings.ratings.map((r) => (
            <div key={r.id} className="border border-[#27272A] p-4">
              <div className="flex items-center gap-1 text-[#E27D60]">
                {Array.from({ length: r.stars }).map((_, i) => <Star key={i} className="w-3 h-3 fill-[#E27D60]" />)}
              </div>
              <div className="text-sm mt-2 text-[#d4d4d8]">{r.comment}</div>
              <div className="text-xs text-[#A1A1AA] mt-1">— {r.rater_name} · {dateIST(r.created_at)}</div>
            </div>
          ))}
        </div>
      )}

      {rateModal && (
        <RateModal
          dealId={rateModal.deal.id}
          ratedUserId={rateModal.rated_user_id}
          onClose={() => setRateModal(null)}
        />
      )}
    </div>
  );
}

function Stat({ label, value, icon: Icon }) {
  return (
    <div className="border border-[#27272A] p-5">
      <Icon className="w-5 h-5 text-[#E27D60] mb-3" />
      <div className="font-mono text-2xl">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#A1A1AA] mt-1">{label}</div>
    </div>
  );
}

function RateModal({ dealId, ratedUserId, onClose }) {
  const [stars,   setStars]   = useState(5);
  const [comment, setComment] = useState("");

  const submit = async () => {
    try {
      await api.post("/ratings", { deal_id: dealId, rated_user_id: ratedUserId, stars, comment });
      toast.success("Rating submitted");
      onClose();
    } catch { toast.error("Failed to submit rating"); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-[#141417] border border-[#27272A] p-6 w-full max-w-md" data-testid="rate-modal">
        <h3 className="font-serif text-2xl mb-4">Rate this deal</h3>
        <div className="flex gap-2 mb-4">
          {[1,2,3,4,5].map((n) => (
            <button key={n} data-testid={`star-${n}`} onClick={() => setStars(n)}>
              <Star className={`w-8 h-8 transition ${n <= stars ? "fill-[#E27D60] text-[#E27D60]" : "text-[#27272A]"}`} />
            </button>
          ))}
        </div>
        <textarea
          data-testid="rate-comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional comment…"
          className="w-full bg-[#0A0A0B] border border-[#27272A] px-3 py-2 text-sm outline-none focus:border-[#E27D60]"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 text-sm text-[#A1A1AA] hover:text-white">Cancel</button>
          <button data-testid="rate-submit" onClick={submit} className="btn-primary text-sm">Submit</button>
        </div>
      </div>
    </div>
  );
}
