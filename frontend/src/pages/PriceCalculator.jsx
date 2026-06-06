import { useState } from "react";
import api from "@/lib/api";
import {
  Calculator, Star, Clock, BookMarked, BookCopy, FileX, BookX,
} from "lucide-react";

const CONDITIONS = [
  { label: "Like New",  value: "Like New",  desc: "No marks, no damage, looks fresh", pct: "+70% of MRP" },
  { label: "Good",      value: "Good",      desc: "Minor notes, all pages intact",     pct: "~55% of MRP" },
  { label: "Fair",      value: "Fair",      desc: "Some highlights/notes, usable",     pct: "~35% of MRP" },
  { label: "Poor",      value: "Poor",      desc: "Heavy use, cover damage",           pct: "~20% of MRP" },
];

const HOW_CARDS = [
  { icon: Star,       title: "Base Condition",      desc: "Like New 70%, Good 55%, Fair 35%, Poor 20% of MRP" },
  { icon: Clock,      title: "Age Factor",          desc: "Older books lose value — 8% per year after year one" },
  { icon: BookMarked, title: "Notes & Highlights",  desc: "Written notes reduce value by 5%" },
  { icon: BookCopy,   title: "Competitive Books",   desc: "High demand adds 10% bonus value" },
  { icon: FileX,      title: "Missing Pages",       desc: "Any missing pages reduce by 15%" },
  { icon: BookX,      title: "Cover Damage",        desc: "Damaged cover reduces by 7%" },
];

export default function PriceCalculator() {
  const [form,      setForm]      = useState({ mrp: "", age_years: "0", condition: "Good" });
  const [extras,    setExtras]    = useState({ notes: false, competitive: false, missing: false, cover: false });
  const [result,    setResult]    = useState(null);
  const [busy,      setBusy]      = useState(false);

  const toggleExtra = (key) => setExtras((p) => ({ ...p, [key]: !p[key] }));

  const calc = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post("/price/calculate", {
        mrp:       parseFloat(form.mrp || 0),
        condition: form.condition,
        age_years: parseFloat(form.age_years || 0),
      });

      // Apply extra factors locally
      let suggested = data.suggested_price;
      if (extras.notes)       suggested = suggested * 0.95;
      if (extras.competitive) suggested = suggested * 1.10;
      if (extras.missing)     suggested = suggested * 0.85;
      if (extras.cover)       suggested = suggested * 0.93;

      setResult({
        ...data,
        suggested_price: Math.round(suggested),
        min_price: Math.round(data.min_price),
        max_price: Math.round(data.max_price),
      });
    } catch {} finally { setBusy(false); }
  };

  return (
    <div className="grain max-w-4xl mx-auto px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Calculator className="w-5 h-5 text-[#E27D60]" />
        <span className="text-xs tracking-[0.3em] uppercase text-[#E27D60]">Tool</span>
      </div>
      <h1 className="editorial-heading text-5xl mb-2">Fair price, calculated.</h1>
      <p className="text-[#A1A1AA] mb-10">Get a fair price estimate based on your book's condition, age, and market demand.</p>

      {/* How We Calculate */}
      <div className="border border-[#27272A] bg-[#141417] p-6 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-base">📊</span>
          <h2 className="font-serif text-xl">How We Calculate Price</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {HOW_CARDS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="border border-[#27272A] bg-[#0A0A0B] p-3 flex gap-3">
              <Icon className="w-4 h-4 text-[#E27D60] mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs font-semibold text-white mb-0.5">{title}</div>
                <div className="text-[11px] text-[#A1A1AA] leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calculator Form */}
      <div className="border border-[#27272A] bg-[#141417] p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-base">🧮</span>
          <h2 className="font-serif text-xl">Calculate Your Book's Value</h2>
        </div>

        <form onSubmit={calc} data-testid="price-form">

          {/* MRP + Age row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-2">
                Original MRP / Purchase Price (₹) *
              </label>
              <input
                data-testid="price-mrp"
                type="number"
                required
                placeholder="e.g. 650"
                value={form.mrp}
                onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                className="w-full bg-[#0A0A0B] border border-[#27272A] px-4 py-3 outline-none focus:border-[#E27D60] text-white"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-2">
                Book Age (years)
              </label>
              <input
                data-testid="price-age"
                type="number"
                step="0.5"
                placeholder="e.g. 2"
                value={form.age_years}
                onChange={(e) => setForm({ ...form, age_years: e.target.value })}
                className="w-full bg-[#0A0A0B] border border-[#27272A] px-4 py-3 outline-none focus:border-[#E27D60] text-white"
              />
            </div>
          </div>

          {/* Condition cards */}
          <div className="mb-5">
            <label className="block text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-3">
              Book Condition *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CONDITIONS.map(({ label, value, desc, pct }) => {
                const active = form.condition === value;
                return (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setForm({ ...form, condition: value })}
                    className={`text-left p-3 border transition-all duration-200 ${
                      active
                        ? "border-[#E27D60] bg-[#E27D60]/10"
                        : "border-[#27272A] bg-[#0A0A0B] hover:border-[#52525B]"
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${active ? "text-[#E27D60]" : "text-white"}`}>
                      {label}
                    </div>
                    <div className="text-[11px] text-[#A1A1AA] leading-relaxed mb-2">{desc}</div>
                    <div className={`text-[11px] font-mono ${active ? "text-[#E27D60]" : "text-[#71717A]"}`}>
                      {pct}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Factors */}
          <div className="mb-6">
            <label className="block text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-3">
              Additional Factors
            </label>
            <div className="space-y-2">
              {[
                { key: "notes",       label: "Has handwritten notes or highlights" },
                { key: "missing",     label: "Has missing or torn pages" },
                { key: "cover",       label: "Cover is damaged or missing" },
                { key: "competitive", label: "It's a competitive exam book (high demand)" },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-3 border border-[#27272A] bg-[#0A0A0B] px-4 py-3 cursor-pointer hover:border-[#52525B] transition"
                >
                  <input
                    type="checkbox"
                    checked={extras[key]}
                    onChange={() => toggleExtra(key)}
                    className="accent-[#E27D60] w-4 h-4"
                  />
                  <span className="text-sm text-[#d4d4d8]">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            data-testid="price-calc"
            disabled={busy}
            className="w-full py-3 bg-[#E27D60] text-black font-semibold uppercase tracking-[0.15em] text-sm hover:bg-[#d4694a] transition disabled:opacity-50"
          >
            {busy ? "Calculating…" : "Calculate Fair Price"}
          </button>
        </form>
      </div>

      {/* Result */}
      {result && (
        <div
          data-testid="price-result"
          className="border border-[#E27D60] bg-[#E27D60]/5 p-8 grid grid-cols-3 gap-4 text-center"
        >
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-2">Min Price</div>
            <div className="font-mono text-3xl text-white">₹{result.min_price}</div>
          </div>
          <div className="border-x border-[#27272A]">
            <div className="text-xs uppercase tracking-[0.2em] text-[#E27D60] mb-2">Suggested</div>
            <div className="font-mono text-4xl text-[#E27D60] font-bold">₹{result.suggested_price}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-2">Max Price</div>
            <div className="font-mono text-3xl text-white">₹{result.max_price}</div>
          </div>
        </div>
      )}
    </div>
  );
}