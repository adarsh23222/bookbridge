import { useEffect, useState } from "react";
import api from "@/lib/api";
import BookCard from "@/components/BookCard";
import { Heart, Upload } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Donate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [form,  setForm]  = useState({ title: "", author: "", subject: "", description: "", condition: "Good" });
  const [photoId,   setPhotoId]   = useState("");
  const [busy,      setBusy]      = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await api.get("/books", { params: { is_donation: true } });
    setBooks(data);
  };
  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setPhotoId(data.id); toast.success("Photo added");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    setBusy(true);
    try {
      await api.post("/books", { ...form, price: 0, is_donation: true, photo_url: photoId, semester: null });
      toast.success("Book donated. Thank you ♥");
      setForm({ title: "", author: "", subject: "", description: "", condition: "Good" });
      setPhotoId("");
      load();
    } catch { toast.error("Failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="grain">
      <div className="border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <Heart className="w-8 h-8 text-[#E27D60] mb-4" />
            <h1 className="editorial-heading text-5xl md:text-6xl">Give a book.<br />Become a footnote in someone's story.</h1>
            <p className="text-[#A1A1AA] mt-5 max-w-lg">Donate the books you no longer need to juniors who can use them.</p>
          </div>

          <form onSubmit={submit} data-testid="donate-form" className="border border-[#27272A] bg-[#141417] p-6 space-y-3">
            <DField label="Book title" testid="don-title"   value={form.title}       onChange={(v) => setForm({...form, title: v})}       required />
            <DField label="Author"     testid="don-author"  value={form.author}      onChange={(v) => setForm({...form, author: v})}      required />
            <DField label="Subject"    testid="don-subject" value={form.subject}     onChange={(v) => setForm({...form, subject: v})}     required />
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-2">Condition</label>
              <select data-testid="don-condition" value={form.condition} onChange={(e) => setForm({...form, condition: e.target.value})}
                className="w-full bg-[#0A0A0B] border border-[#27272A] px-3 py-2 outline-none focus:border-[#E27D60]">
                {["New","Like New","Good","Fair","Poor"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <DField label="Why donating? (optional)" testid="don-desc" value={form.description} onChange={(v) => setForm({...form, description: v})} />
            <label className="inline-flex items-center gap-2 border border-[#27272A] hover:border-[#E27D60] px-4 py-2 cursor-pointer text-sm transition">
              <Upload className="w-4 h-4" />
              <span>{uploading ? "Uploading…" : photoId ? "Photo added ✓" : "Upload book photo"}</span>
              <input data-testid="don-photo" type="file" accept="image/*" onChange={upload} className="hidden" />
            </label>
            <button data-testid="don-submit" disabled={busy} className="btn-primary w-full">{busy ? "…" : "Donate this book"}</button>
            {!user && <Link to="/login" className="block text-center text-sm text-[#A1A1AA] hover:text-white">Login required →</Link>}
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-xs tracking-[0.3em] uppercase text-[#A1A1AA] mb-3">Available donations</div>
        <h2 className="editorial-heading text-4xl mb-8">Free books, looking for a home.</h2>
        {books.length === 0
          ? <div className="text-[#A1A1AA] py-8">No donations yet. Be the first.</div>
          : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{books.map(b => <BookCard key={b.id} book={b} />)}</div>
        }
      </div>
    </div>
  );
}

function DField({ label, testid, value, onChange, required }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-1">{label}</label>
      <input data-testid={testid} value={value} required={required} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0A0A0B] border border-[#27272A] px-3 py-2 outline-none focus:border-[#E27D60]" />
    </div>
  );
}
