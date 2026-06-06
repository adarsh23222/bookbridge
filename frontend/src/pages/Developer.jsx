import { useState } from "react";
import {
  Github, Linkedin, Mail, Code, Coffee,
  Globe, Layers, Shield, Zap, Database,
  MessageCircle, BookOpen, Heart, Copy, Check
} from "lucide-react";

export default function Developer() {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const copyUPI = () => {
    navigator.clipboard.writeText("paladars071@okaxis");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

 const skills = [
  { category: "Frontend", items: ["React.js", "Vite", "Tailwind CSS", "HTML5", "CSS3", "JavaScript (ES6+)"] },
  { category: "Backend", items: ["Python", "FastAPI", "REST APIs", "WebSockets", "JWT Auth"] },
  { category: "Database", items: ["PostgreSQL", "MySQL"] },
  { category: "CS Fundamentals", items: ["DSA", "OOP Concepts", "DBMS", "OS Basics", "Computer Networks"] },
  { category: "Tools", items: ["Git", "GitHub", "VS Code"] },
];
  const techStack = [
    { icon: Globe,       name: "React + Vite",      role: "Frontend",         color: "text-[#61DAFB]" },
    { icon: Layers,      name: "FastAPI",            role: "Backend API",      color: "text-[#009688]" },
    { icon: Database,    name: "PostgreSQL",         role: "Database",         color: "text-[#336791]" },
    { icon: Shield,      name: "JWT + bcrypt",       role: "Auth & Security",  color: "text-[#E27D60]" },
    { icon: MessageCircle, name: "WebSockets",       role: "Realtime Chat",    color: "text-[#658354]" },
    { icon: Zap,         name: "SQLAlchemy 2.x",    role: "ORM (Async)",      color: "text-[#E27D60]" },
    { icon: Code,        name: "Tailwind CSS",       role: "Styling",          color: "text-[#38BDF8]" },
    { icon: BookOpen,    name: "shadcn/ui + Radix",  role: "UI Components",    color: "text-[#A1A1AA]" },
  ];

  return (
    <div className="grain">
      {/* ── Hero ──────────────────────────────────── */}
      <section className="border-b border-[#27272A]">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-20">
          <div className="flex flex-col md:flex-row items-start gap-10">

            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-none bg-gradient-to-br from-[#E27D60] via-[#c96b4e] to-[#658354] flex items-center justify-center font-serif text-5xl md:text-6xl text-black font-bold shadow-2xl">
                AP
              </div>
              <div className="mt-3 text-center">
                <div className="inline-block px-2 py-0.5 text-[10px] tracking-[0.2em] uppercase bg-[#658354]/20 text-[#658354] border border-[#658354]/30">
                  Available for work
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="text-xs tracking-[0.3em] uppercase text-[#E27D60] mb-2">Developer · Creator</div>
              <h1 className="editorial-heading text-5xl md:text-6xl mb-2">Adarsh Pal</h1>
              <p className="text-[#A1A1AA] text-lg mb-1">BCA 3rd Year &nbsp;·&nbsp; PSIT Kanpur</p>
              <p className="text-[#A1A1AA] text-sm mb-6">Aspiring Software Development Engineer (SDE)</p>

              <p className="text-[#d4d4d8] leading-relaxed max-w-xl mb-6">
                A self-taught developer from Kanpur who built <span className="text-[#E27D60] font-medium">BookBridge</span> — a full-stack peer-to-peer textbook exchange platform for Indian college students — because paying full MRP for one-semester books never made sense. I turn late nights and caffeine into working software.
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/adarsh23222"
                  target="_blank" rel="noreferrer"
                  data-testid="dev-github"
                  className="inline-flex items-center gap-2 border border-[#27272A] hover:border-[#E27D60] px-4 py-2 text-sm transition group"
                >
                  <Github className="w-4 h-4 group-hover:text-[#E27D60] transition" />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/adarsh-pal-5428b9324"
                  target="_blank" rel="noreferrer"
                  data-testid="dev-linkedin"
                  className="inline-flex items-center gap-2 border border-[#27272A] hover:border-[#E27D60] px-4 py-2 text-sm transition group"
                >
                  <Linkedin className="w-4 h-4 group-hover:text-[#E27D60] transition" />
                  LinkedIn
                </a>
                <a
                  href="https://instagram.com/i.adarsh_pal"
                  target="_blank" rel="noreferrer"
                  data-testid="dev-insta"
                  className="inline-flex items-center gap-2 border border-[#27272A] hover:border-[#E27D60] px-4 py-2 text-sm transition group"
                >
                  {/* Instagram SVG */}
                  <svg className="w-4 h-4 group-hover:text-[#E27D60] transition" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </a>
                <a
                  href="mailto:adarsh2430343@gmail.com"
                  data-testid="dev-mail"
                  className="inline-flex items-center gap-2 border border-[#27272A] hover:border-[#E27D60] px-4 py-2 text-sm transition group"
                >
                  <Mail className="w-4 h-4 group-hover:text-[#E27D60] transition" />
                  Email Me
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Vision & Mission ───────────────────────── */}
      <section className="border-b border-[#27272A]">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card-edge p-8">
            <div className="text-xs tracking-[0.3em] uppercase text-[#E27D60] mb-4">Vision</div>
            <h3 className="font-serif text-3xl mb-4">A campus where no book goes to waste.</h3>
            <p className="text-[#A1A1AA] leading-relaxed text-sm">
              Every year, lakhs of students buy textbooks they use for a single semester — then those books collect dust on shelves. I envision a future where every Indian college has a living, breathing book ecosystem where knowledge flows freely from senior to junior, semester after semester.
            </p>
          </div>
          <div className="card-edge p-8">
            <div className="text-xs tracking-[0.3em] uppercase text-[#658354] mb-4">Mission</div>
            <h3 className="font-serif text-3xl mb-4">Build real things that solve real problems.</h3>
            <p className="text-[#A1A1AA] leading-relaxed text-sm">
              As a BCA student at PSIT Kanpur, I don't just want to study software — I want to ship it. BookBridge is my commitment to that: a production-ready, full-stack app built entirely by one student, for millions of students. No fluff. No tutorials. Just real code solving a real problem.
            </p>
          </div>
        </div>
      </section>

      {/* ── Skills ────────────────────────────────── */}
      <section className="border-b border-[#27272A]">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-xs tracking-[0.3em] uppercase text-[#A1A1AA] mb-3">What I know</div>
          <h2 className="editorial-heading text-4xl mb-10">Skills & Technologies.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {skills.map((s) => (
              <div key={s.category} className="border border-[#27272A] bg-[#141417] p-5">
                <div className="text-xs tracking-[0.2em] uppercase text-[#E27D60] mb-4">{s.category}</div>
                <ul className="space-y-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-[#d4d4d8]">
                      <span className="w-1.5 h-1.5 bg-[#658354] flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Currently learning */}
          <div className="mt-6 border border-[#27272A] bg-[#141417] p-5">
            <div className="text-xs tracking-[0.2em] uppercase text-[#A1A1AA] mb-3">Currently learning 📚</div>
            <div className="flex flex-wrap gap-2">
              {["Data Structures & Algorithms", "System Design Basics"].map((item) => (
                <span key={item} className="text-xs px-3 py-1 border border-[#27272A] text-[#A1A1AA]">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

    

      {/* ── About This Project ────────────────────── */}
      <section className="border-b border-[#27272A]">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-xs tracking-[0.3em] uppercase text-[#A1A1AA] mb-3">The story</div>
          <h2 className="editorial-heading text-4xl mb-6">Why I built BookBridge.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                n: "01",
                title: "The Problem",
                desc: "Every semester at PSIT, I saw students spending ₹500–₹2000 on textbooks they'd use once. Seniors had stacks of unused books. Juniors had empty wallets. Nobody connected them."
              },
              {
                n: "02",
                title: "The Build",
                desc: "I built the entire app alone — FastAPI backend, React frontend, PostgreSQL database, real-time WebSocket chat, JWT auth, file uploads — over weeks of nights and weekends between classes."
              },
              {
                n: "03",
                title: "The Goal",
                desc: "Make it free, make it fast, make it for every Indian campus. No commissions, no shipping, no middlemen. Just students helping students, one book at a time."
              }
            ].map((s) => (
              <div key={s.n} className="bg-[#141417] border border-[#27272A] p-6">
                <div className="font-mono text-[#E27D60] text-sm mb-4">{s.n}</div>
                <h3 className="font-serif text-2xl mb-3">{s.title}</h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Support / Buy Me a coffee ───────────────── */}
      <section className="border-b border-[#27272A]">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs tracking-[0.3em] uppercase text-[#E27D60] mb-3">Support My Work</div>
              <h2 className="editorial-heading text-4xl md:text-5xl mb-5">
                Buy me a coffee. ☕
              </h2>
              <p className="text-[#A1A1AA] leading-relaxed mb-4">
                BookBridge is completely free — no ads, no commissions, no nonsense. I built it as a 3rd year BCA student at PSIT Kanpur because I genuinely believe students shouldn't pay full MRP for books they'll use one semester.
              </p>
              <p className="text-[#A1A1AA] leading-relaxed mb-6">
                If BookBridge helped you find a book, save some money, or just made campus life a little easier — consider sending a coffee my way. It keeps me going and helps me build more things like this. 🙏
              </p>
              <div className="text-xs text-[#A1A1AA] italic">No pressure at all. Just knowing you used it is enough.</div>
            </div>

            {/* UPI Payment Card */}
            <div className="border border-[#27272A] bg-[#141417] p-6">
              <div className="flex items-center gap-2 mb-5">
                <Heart className="w-4 h-4 text-[#E27D60]" />
                <span className="text-xs tracking-[0.2em] uppercase text-[#A1A1AA]">Pay with UPI</span>
              </div>

              {/* QR Code */}
              <div
                className="border border-[#27272A] bg-white p-3 mb-4 cursor-pointer hover:border-[#E27D60] transition"
                onClick={() => setShowQR(!showQR)}
              >
                <img
                  src="/upi-qr.jpg"
                  alt="UPI QR Code - Adarsh Pal"
                  className="w-full max-w-[200px] mx-auto block"
                />
              </div>

              <p className="text-xs text-[#A1A1AA] text-center mb-4">
                Scan with GPay, PhonePe, Paytm, or any UPI app
              </p>

              {/* UPI ID Copy */}
              <div className="flex items-center gap-2 bg-[#0A0A0B] border border-[#27272A] px-4 py-3">
                <span className="font-mono text-sm text-[#d4d4d8] flex-1">paladars071@okaxis</span>
                <button
                  onClick={copyUPI}
                  className="text-[#A1A1AA] hover:text-[#E27D60] transition flex-shrink-0"
                  title="Copy UPI ID"
                >
                  {copied
                    ? <Check className="w-4 h-4 text-[#658354]" />
                    : <Copy className="w-4 h-4" />
                  }
                </button>
              </div>
              {copied && (
                <p className="text-xs text-[#658354] mt-2 text-center">UPI ID copied! ✓</p>
              )}

              <div className="mt-4 text-center">
                <div className="text-xs text-[#A1A1AA]">Uttar Pradesh Gramin Bank</div>
                <div className="text-xs text-[#71717a] mt-0.5">Adarsh Pal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="text-xs tracking-[0.3em] uppercase text-[#A1A1AA] mb-3">Let's connect</div>
          <h2 className="editorial-heading text-4xl mb-4">Got an opportunity? Let's talk.</h2>
          <p className="text-[#A1A1AA] mb-8 max-w-xl mx-auto">
            I'm actively looking for internships and SDE roles. If you have an opportunity, a collab idea, or just want to talk tech — my inbox is always open.
          </p>
          <a
            href="mailto:adarsh2430343@gmail.com"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            adarsh2430343@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
}