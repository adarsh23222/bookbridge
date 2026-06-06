// ── Navbar ────────────────────────────────────────────────────────────────────
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, MessageCircle, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const loc      = useLocation();
  const [open, setOpen] = useState(false);

  const link = (to, label, testid) => {
    const active = loc.pathname === to;
    return (
      <Link
        to={to}
        data-testid={testid}
        onClick={() => setOpen(false)}
        className={`text-sm tracking-wide transition-colors ${active ? "text-white" : "text-[#A1A1AA] hover:text-white"}`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/70 border-b border-[#27272A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" data-testid="logo-link" className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#E27D60]" />
          <span className="font-serif text-2xl tracking-tight">BookBridge</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {link("/browse", "Browse", "nav-browse")}
          {link("/wall",   "Student Wall", "nav-wall")}
          {link("/donate", "Donate", "nav-donate")}
          {link("/price-calculator", "Price Calc", "nav-price")}
          {link("/about",  "About", "nav-about")}
          {link("/developer", "Developer", "nav-developer")}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/chat"      data-testid="nav-chat"      className="text-[#A1A1AA] hover:text-white transition"><MessageCircle className="w-5 h-5" /></Link>
              <Link to="/dashboard" data-testid="nav-dashboard" className="text-[#A1A1AA] hover:text-white transition"><User className="w-5 h-5" /></Link>
              <button data-testid="logout-btn" onClick={async () => { await logout(); navigate("/"); }} className="text-[#A1A1AA] hover:text-white transition" title="Logout"><LogOut className="w-5 h-5" /></button>
              <Link to="/list-book" data-testid="cta-list-book" className="ml-2 btn-primary text-sm">List a Book</Link>
            </>
          ) : (
            <>
              <Link to="/login"    data-testid="nav-login"    className="text-sm text-[#A1A1AA] hover:text-white">Login</Link>
              <Link to="/register" data-testid="nav-register" className="btn-primary text-sm">Get Started</Link>
            </>
          )}
        </div>

        <button data-testid="mobile-menu" onClick={() => setOpen(!open)} className="md:hidden text-white">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#27272A] bg-[#0A0A0B] px-6 py-6 flex flex-col gap-4">
          {link("/browse", "Browse", "m-nav-browse")}
          {link("/wall",   "Student Wall", "m-nav-wall")}
          {link("/donate", "Donate", "m-nav-donate")}
          {link("/price-calculator", "Price Calc", "m-nav-price")}
          {link("/about",  "About", "m-nav-about")}
          {link("/developer", "Developer", "m-nav-developer")}
          <div className="divider" />
          {user ? (
            <>
              {link("/chat",      "Chat",      "m-nav-chat")}
              {link("/dashboard", "Dashboard", "m-nav-dashboard")}
              <Link to="/list-book" data-testid="m-cta-list" className="btn-primary text-sm text-center" onClick={() => setOpen(false)}>List a Book</Link>
              <button data-testid="m-logout" onClick={async () => { await logout(); setOpen(false); navigate("/"); }} className="text-left text-sm text-[#A1A1AA]">Logout</button>
            </>
          ) : (
            <>
              {link("/login",    "Login",       "m-nav-login")}
              <Link to="/register" data-testid="m-nav-register" className="btn-primary text-sm text-center" onClick={() => setOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
