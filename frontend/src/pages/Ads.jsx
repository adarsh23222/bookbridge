import { useEffect, useState } from "react";
import api, { fileUrl } from "@/lib/api";
import { toast } from "sonner";
import { Megaphone, Upload } from "lucide-react";

export default function Ads() {
  const [ads,     setAds]     = useState([]);
  const [form,    setForm]    = useState({ title: "", author: "", description: "", link_url: "" });
  const [imageId, setImageId] = useState("");
  const [busy,    setBusy]    = useState(false);

  const load = async () => {
    const { data } = await api.get("/ads");
    setAds(data);
  };
  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    try {
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setImageId(data.id); toast.success("Image uploaded");
    } catch { toast.error("Upload failed"); }
  };

  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try {
      await api.post("/ads", { ...form, image_url: imageId });
      setForm({ title: "", author: "", description: "", link_url: "" });
      setImageId("");
      sessionStorage.removeItem("bb_ad_shown");
      load(); toast.success("Ad created. Will appear on homepage.");
    } catch { toast.error("Failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="grain max-w-5xl mx-auto px-6 lg:px-8 py-12">
      <Megaphone className="w-7 h-7 text-[#E27D60] mb-3" />
      <div className="text-xs tracking-[0.3em] uppercase text-[#A1A1AA] mb-3">Author Ads</div>
      <h1 className="editorial-heading text-5xl mb-3">Promote your book.</h1>
      <p className="text-[#A1A1AA] mb-10">Your ad will appear as a popup on the homepage once per visitor session.</p>

      <form onSubmit={submit} data-testid="ad-form" className="border border-[#27272A] bg-[#141417] p-6 grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <AField label="Book title" testid="ad-title"  value={form.title}   onChange={(v) => setForm({...form, title: v})}   required />
        <AField label="Author"     testid="ad-author" value={form.author}  onChange={(v) => setForm({...form, author: v})}  required />
        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-2">Description</label>
          <textarea data-testid="ad-desc" rows={3} value={form.description} required
            onChange={(e) => setForm({...form, description: e.target.value})}
            className="w-full bg-[#0A0A0B] border border-[#27272A] px-3 py-2 outline-none focus:border-[#E27D60]" />
        </div>
        <AField label="Link URL (optional)" testid="ad-link" value={form.link_url} onChange={(v) => setForm({...form, link_url: v})} />
        <label className="inline-flex items-center gap-2 border border-[#27272A] hover:border-[#E27D60] px-4 py-2 cursor-pointer text-sm self-end transition">
          <Upload className="w-4 h-4" /> {imageId ? "Image added ✓" : "Upload cover image"}
          <input data-testid="ad-image" type="file" accept="image/*" className="hidden" onChange={upload} />
        </label>
        <div className="md:col-span-2">
          <button data-testid="ad-submit" disabled={busy} className="btn-primary">{busy ? "…" : "Publish ad"}</button>
        </div>
      </form>

      <h2 className="editorial-heading text-3xl mb-6">Your active campaigns</h2>
      {ads.length === 0 ? (
        <div className="text-[#A1A1AA] border border-[#27272A] p-8 text-center">
          <Megaphone className="w-8 h-8 mx-auto mb-3 text-[#27272A]" />
          No ads yet. Publish your first campaign above.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ads.map((a) => (
            <div key={a.id} className="border border-[#27272A] bg-[#141417] overflow-hidden" data-testid={`ad-card-${a.id}`}>
              {a.image_url && <img src={fileUrl(a.image_url)} alt={a.title} className="w-full h-44 object-cover" />}
              <div className="p-5">
                <div className="text-xs tracking-[0.2em] uppercase text-[#E27D60] mb-1">Sponsored</div>
                <div className="font-serif text-2xl">{a.title}</div>
                <div className="text-xs text-[#A1A1AA] mb-2">by {a.author}</div>
                <div className="text-sm text-[#d4d4d8] line-clamp-3">{a.description}</div>
                {a.link_url && (
                  <a href={a.link_url} target="_blank" rel="noreferrer"
                    className="text-xs text-[#E27D60] hover:underline mt-2 inline-block">{a.link_url}</a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AField({ label, testid, value, onChange, required }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-2">{label}</label>
      <input data-testid={testid} value={value} required={required} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0A0A0B] border border-[#27272A] px-3 py-2 outline-none focus:border-[#E27D60]" />
    </div>
  );
}
