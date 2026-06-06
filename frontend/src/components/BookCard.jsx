import { Link } from "react-router-dom";
import { fileUrl } from "@/lib/api";

export default function BookCard({ book, testid }) {
  return (
    <Link
      to={`/books/${book.id}`}
      data-testid={testid || `book-card-${book.id}`}
      className="card-edge block group relative overflow-hidden"
    >
      <div className="aspect-[3/4] overflow-hidden bg-[#1c1c20]">
        {book.photo_url ? (
          <img src={fileUrl(book.photo_url)} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#3a3a3f] font-serif text-5xl select-none">📖</div>
        )}
        {book.is_donation && (
          <div className="absolute top-3 left-3 px-2 py-1 text-[10px] tracking-[0.2em] uppercase bg-[#658354] text-black font-semibold">Free</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-serif text-xl leading-tight tracking-tight line-clamp-2">{book.title}</h3>
        <p className="text-xs text-[#A1A1AA] mt-1">by {book.author}</p>
        <div className="mt-3 flex items-end justify-between">
          <span className="text-xs text-[#A1A1AA]">{book.subject}{book.semester ? ` · Sem ${book.semester}` : ""}</span>
          {!book.is_donation
            ? <span className="font-mono text-lg text-[#E27D60]">₹{book.price}</span>
            : <span className="font-mono text-sm text-[#658354]">DONATION</span>
          }
        </div>
        <div className="mt-2 text-[10px] uppercase tracking-wider text-[#71717a]">
          {book.seller_city || "—"} · {book.condition}
        </div>
      </div>
    </Link>
  );
}
