import { useEffect, useState } from "react";
import api from "@/lib/api";
import BookCard from "@/components/BookCard";
import { Search, SlidersHorizontal } from "lucide-react";

export default function Browse() {
  const [books,       setBooks]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ q: "", subject: "", semester: "", degree: "", city: "", college: "" });

  const load = async () => {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    try {
      const { data } = await api.get("/books", { params });
      setBooks(data);
    } catch { setBooks([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  return (
    <div className="grain">
      <div className="border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="text-xs tracking-[0.3em] uppercase text-[#E27D60] mb-3">Catalogue</div>
          <h1 className="editorial-heading text-5xl md:text-6xl">Browse books.</h1>
          <p className="text-[#A1A1AA] mt-3">Books from your city and college appear first.</p>

          <div className="mt-8 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center bg-[#141417] border border-[#27272A] px-4">
              <Search className="w-4 h-4 text-[#A1A1AA] mr-3" />
              <input
                data-testid="browse-search"
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && load()}
                placeholder="Search title, author, subject…"
                className="bg-transparent w-full py-3 outline-none"
              />
            </div>
            <button data-testid="browse-toggle-filters" onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border border-[#27272A] hover:border-[#E27D60] transition inline-flex items-center gap-2 text-sm">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <button data-testid="browse-apply" onClick={load} className="btn-primary text-sm">Apply</button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
              <Filter label="Subject"  testid="filter-subject"  value={filters.subject}  onChange={(v) => setFilters({ ...filters, subject: v })} />
              <Filter label="Semester" testid="filter-semester" value={filters.semester} onChange={(v) => setFilters({ ...filters, semester: v })} type="number" />
              <Filter label="Degree"   testid="filter-degree"   value={filters.degree}   onChange={(v) => setFilters({ ...filters, degree: v })} />
              <Filter label="City"     testid="filter-city"     value={filters.city}     onChange={(v) => setFilters({ ...filters, city: v })} />
              <Filter label="College"  testid="filter-college"  value={filters.college}  onChange={(v) => setFilters({ ...filters, college: v })} />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-[#A1A1AA]">Loading…</div>
        ) : books.length === 0 ? (
          <div className="text-[#A1A1AA] py-20 text-center">
            <div className="font-serif text-3xl mb-2">Nothing here yet.</div>
            <div className="text-sm">Be the first to list a book.</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {books.map((b, i) => <BookCard key={b.id} book={b} testid={`book-card-${i}`} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function Filter({ label, testid, value, onChange, type = "text" }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#A1A1AA] mb-1">{label}</div>
      <input type={type} data-testid={testid} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#141417] border border-[#27272A] px-3 py-2 text-sm outline-none focus:border-[#E27D60]" />
    </div>
  );
}
