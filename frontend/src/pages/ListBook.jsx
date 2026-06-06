// ListBook.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "sonner";
import { Upload } from "lucide-react";

export default function ListBook() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", author: "", subject: "", semester: "", degree: "",
    condition: "Good", price: "", mrp: "", age_years: "", description: "", is_donation: false
  });
  const [photoId,   setPhotoId]   = useState("");
  const [uploading, setUploading] = useState(false);
  const [busy,      setBusy]      = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const uploadPhoto = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setPhotoId(data.id); toast.success("Photo uploaded");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try {
      const payload = {
        ...form,
        semester:  form.semester  ? parseInt(form.semester)   : null,
        price:     form.is_donation ? 0 : parseFloat(form.price  || 0),
        mrp:       form.mrp       ? parseFloat(form.mrp)      : null,
        age_years: form.age_years ? parseFloat(form.age_years): 0,
        photo_url: photoId,
      };
      const { data } = await api.post("/books", payload);
      toast.success("Book listed");
      navigate(`/books/${data.id}`);
    } catch { toast.error("Failed to list book"); }
    finally { setBusy(false); }
  };

  return (
    <div className="grain max-w-3xl mx-auto px-6 lg:px-8 py-12">
      <div className="text-xs tracking-[0.3em] uppercase text-[#E27D60] mb-3">List a book</div>
      <h1 className="editorial-heading text-5xl mb-3">{form.is_donation ? "Donate a book" : "Sell your book"}.</h1>
      <p className="text-[#A1A1AA] mb-10">Be honest about the condition — your campus reputation depends on it.</p>

      <form onSubmit={submit} data-testid="list-book-form" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Title*"               testid="lb-title"     value={form.title}       onChange={set("title")}       required />
        <Field label="Author*"              testid="lb-author"    value={form.author}      onChange={set("author")}      required />
        <Field label="Subject*"             testid="lb-subject"   value={form.subject}     onChange={set("subject")}     required />
        <Field label="Semester"             testid="lb-semester"  value={form.semester}    onChange={set("semester")}    type="number" />
        <Field label="Degree (e.g. B.Tech)" testid="lb-degree"    value={form.degree}      onChange={set("degree")} />
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-2">Condition</label>
          <select data-testid="lb-condition" value={form.condition} onChange={set("condition")}
            className="w-full bg-[#141417] border border-[#27272A] px-3 py-3 outline-none focus:border-[#E27D60]">
            {["New","Like New","Good","Fair","Poor"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {!form.is_donation && (
          <>
            <Field label="Price (₹)*"           testid="lb-price" type="number" value={form.price}     onChange={set("price")}     required />
            <Field label="MRP (₹) (optional)"   testid="lb-mrp"   type="number" value={form.mrp}       onChange={set("mrp")} />
            <Field label="Age in years"          testid="lb-age"   type="number" value={form.age_years} onChange={set("age_years")} />
          </>
        )}

        <label className="col-span-full flex items-center gap-3 text-sm cursor-pointer">
          <input data-testid="lb-donation" type="checkbox" checked={form.is_donation}
            onChange={(e) => setForm({ ...form, is_donation: e.target.checked, price: "0" })} />
          List as a donation (free)
        </label>

        <div className="col-span-full">
          <label className="block text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-2">Description</label>
          <textarea data-testid="lb-desc" value={form.description} onChange={set("description")} rows={4}
            className="w-full bg-[#141417] border border-[#27272A] px-4 py-3 outline-none focus:border-[#E27D60]" />
        </div>

        <div className="col-span-full">
          <label className="block text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-2">Photo</label>
          <label className="inline-flex items-center gap-2 border border-[#27272A] hover:border-[#E27D60] px-4 py-3 cursor-pointer text-sm transition">
            <Upload className="w-4 h-4" />
            <span>{uploading ? "Uploading…" : photoId ? "Photo selected ✓" : "Upload photo"}</span>
            <input data-testid="lb-photo" type="file" accept="image/*" onChange={uploadPhoto} className="hidden" />
          </label>
        </div>

        <div className="col-span-full">
          <button data-testid="lb-submit" disabled={busy} className="btn-primary">{busy ? "Listing…" : "List Book"}</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, testid, type = "text", ...props }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-2">{label}</label>
      <input data-testid={testid} type={type} {...props}
        className="w-full bg-[#141417] border border-[#27272A] px-4 py-3 outline-none focus:border-[#E27D60]" />
    </div>
  );
}
