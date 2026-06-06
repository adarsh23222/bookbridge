import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { ArrowRight, BookOpen, MessageCircle, Heart, Users, Calculator, Sparkles } from "lucide-react";

export default function Home() {
  const [stats, setStats] = useState({ users: 0, books: 0, deals: 0, donations: 0, wall_posts: 0, colleges: 0 });

  useEffect(() => {
    api.get("/stats").then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  return (
    <div className="grain">
      {/* Hero */}
      <section id="hero" className="relative overflow-hidden border-b border-[#27272A]">
        <div className="absolute inset-0 opacity-30">
          <img src="https://images.pexels.com/photos/256477/pexels-photo-256477.jpeg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-36 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-7 fade-up">
            <div className="text-xs tracking-[0.3em] uppercase text-[#E27D60] mb-6">India · Campus · Books</div>
            <h1 className="editorial-heading text-5xl md:text-7xl lg:text-8xl">
              The library<br />
              <em className="text-[#E27D60] not-italic font-normal">your seniors</em><br />
              left behind.
            </h1>
            <p className="mt-8 text-base md:text-lg text-[#A1A1AA] max-w-xl leading-relaxed">
              Buy, sell, donate and discuss college textbooks with students from your city and college — without the markup, without the middlemen.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/browse"   data-testid="hero-browse"   className="btn-primary inline-flex items-center gap-2">Browse Books <ArrowRight className="w-4 h-4" /></Link>
              <Link to="/register" data-testid="hero-register" className="text-sm tracking-wide text-white border border-[#27272A] px-6 py-3 hover:bg-[#141417] transition">Join the community</Link>
            </div>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-3 fade-up">
            <div className="card-edge p-6 row-span-2">
              <BookOpen className="w-6 h-6 text-[#E27D60] mb-4" />
              <div className="font-mono text-3xl" data-testid="stat-books">{stats.books}</div>
              <div className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mt-1">Books listed</div>
            </div>
            <div className="card-edge p-5">
              <Users className="w-5 h-5 text-[#658354] mb-2" />
              <div className="font-mono text-2xl" data-testid="stat-users">{stats.users}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#A1A1AA]">Students</div>
            </div>
            <div className="card-edge p-5">
              <Heart className="w-5 h-5 text-[#E27D60] mb-2" />
              <div className="font-mono text-2xl" data-testid="stat-donations">{stats.donations}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#A1A1AA]">Donations</div>
            </div>
            <div className="card-edge p-5 col-span-2">
              <div className="flex justify-between items-end">
                <div>
                  <div className="font-mono text-2xl" data-testid="stat-deals">{stats.deals}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#A1A1AA]">Deals closed</div>
                </div>
                <div>
                  <div className="font-mono text-2xl" data-testid="stat-colleges">{stats.colleges}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#A1A1AA]">Colleges</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="text-xs tracking-[0.3em] uppercase text-[#A1A1AA] mb-3">The Ritual</div>
          <h2 className="editorial-heading text-4xl md:text-5xl mb-12">How BookBridge works.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#27272A]">
            {[
              { n: "01", t: "Find your book",  d: "Filter by subject, semester, college and city. Books from your campus appear first." },
              { n: "02", t: "Chat the seller", d: "WhatsApp-style direct messages — in real time, IST timestamps, no third-party app needed." },
              { n: "03", t: "Close the deal",  d: "Meet in person, exchange the book, and rate each other. Build a trustworthy campus rep." },
            ].map((s) => (
              <div key={s.n} className="bg-[#0A0A0B] p-10">
                <div className="font-mono text-[#E27D60] mb-6 text-sm">{s.n}</div>
                <h3 className="font-serif text-3xl mb-3">{s.t}</h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="stats" className="border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="text-xs tracking-[0.3em] uppercase text-[#A1A1AA] mb-3">More than a marketplace</div>
            <h2 className="editorial-heading text-4xl md:text-5xl mb-6">A small town for your campus, online.</h2>
            <p className="text-[#A1A1AA] leading-relaxed">
              Beyond books — a Student Wall to post, comment, like and share. A donation channel for those who want to give books a second life. And a price calculator that won't let you under-sell or overpay.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: MessageCircle, t: "Real-time chat",   d: "WhatsApp-style, IST timed" },
              { icon: Heart,         t: "Donation feed",    d: "Books that need a home" },
              { icon: Calculator,    t: "Price calculator", d: "Condition × MRP × age" },
              { icon: Sparkles,      t: "Smart sort",       d: "Your campus, first" },
            ].map((f, i) => (
              <div key={i} className="card-edge p-5">
                <f.icon className="w-5 h-5 text-[#E27D60] mb-3" />
                <div className="font-serif text-xl">{f.t}</div>
                <div className="text-xs text-[#A1A1AA] mt-1">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="editorial-heading text-4xl md:text-6xl mb-6">Your shelf, somebody's saviour.</h2>
          <p className="text-[#A1A1AA] mb-8 max-w-2xl mx-auto">List the books you no longer need. Help a junior. Make a few hundred rupees, or just the warm feeling of giving.</p>
          <Link to="/register" data-testid="cta-bottom-register" className="btn-primary inline-block">Create your account</Link>
        </div>
      </section>
    </div>
  );
}
