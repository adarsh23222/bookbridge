import { Link } from "react-router-dom";
import { BookOpen, Github, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#27272A] bg-[#0A0A0B] mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-[#E27D60]" />
            <span className="font-serif text-2xl">BookBridge</span>
          </div>
          <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6">
            A peer-to-peer secondhand book exchange crafted for India's college students.
          </p>
          {/* Social Icons */}
          <div className="flex gap-4">
            <a href="https://github.com/adarsh23222" target="_blank" rel="noreferrer"
              className="w-9 h-9 border border-[#27272A] flex items-center justify-center hover:border-[#E27D60] hover:text-[#E27D60] transition-all duration-300">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://instagram.com/i.adarsh_pal" target="_blank" rel="noreferrer"
              className="w-9 h-9 border border-[#27272A] flex items-center justify-center hover:border-[#E27D60] hover:text-[#E27D60] transition-all duration-300">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com/in/adarsh-pal-5428b9324" target="_blank" rel="noreferrer"
              className="w-9 h-9 border border-[#27272A] flex items-center justify-center hover:border-[#E27D60] hover:text-[#E27D60] transition-all duration-300">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="mailto:adarsh2430343@gmail.com"
              className="w-9 h-9 border border-[#27272A] flex items-center justify-center hover:border-[#E27D60] hover:text-[#E27D60] transition-all duration-300">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-5">Explore</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/browse"           className="hover:text-[#E27D60] transition">Browse Books</Link></li>
            <li><Link to="/wall"             className="hover:text-[#E27D60] transition">Student Wall</Link></li>
            <li><Link to="/donate"           className="hover:text-[#E27D60] transition">Donate a Book</Link></li>
            <li><Link to="/price-calculator" className="hover:text-[#E27D60] transition">Price Calculator</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-5">Company</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/about"     className="hover:text-[#E27D60] transition">About Us</Link></li>
            <li><Link to="/about#faq" className="hover:text-[#E27D60] transition">FAQ</Link></li>
            <li><Link to="/developer" className="hover:text-[#E27D60] transition">Developer</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-5">Contact</h4>
          <ul className="space-y-3 text-sm text-[#A1A1AA]">
            <li><a href="mailto:adarsh2430343@gmail.com" className="hover:text-[#E27D60] transition">adarsh2430343@gmail.com</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#27272A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between text-xs text-[#A1A1AA]">
          <span>© {new Date().getFullYear()} BookBridge — All rights reserved.</span>
          <span className="mt-2 md:mt-0 tracking-widest uppercase text-[10px]">Crafted for India's Campuses</span>
        </div>
      </div>
    </footer>
  );
}