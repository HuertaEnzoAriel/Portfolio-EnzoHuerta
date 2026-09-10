import { useState } from "react";
import { ChevronDown, ShoppingCart } from "lucide-react";

export default function Navbar() {
  const [pagesOpen, setPagesOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="url(#grad)" />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="24" y2="24">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-xl font-semibold text-slate-800">Airfolio</span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-slate-700 font-medium">
          <a href="#" className="hover:text-teal-600 transition-colors">About Us</a>
          <a href="#" className="hover:text-teal-600 transition-colors">Services</a>
          <a href="#" className="hover:text-teal-600 transition-colors">Portfolio</a>

          <div
            className="relative"
            onMouseEnter={() => setPagesOpen(true)}
            onMouseLeave={() => setPagesOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-teal-600 transition-colors">
              Pages <ChevronDown size={16} />
            </button>
            {pagesOpen && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 z-10">
                <a href="#" className="block px-4 py-2 hover:bg-slate-50">Page 1</a>
                <a href="#" className="block px-4 py-2 hover:bg-slate-50">Page 2</a>
                <a href="#" className="block px-4 py-2 hover:bg-slate-50">Page 3</a>
              </div>
            )}
          </div>

          <a href="#" className="flex items-center gap-1 hover:text-teal-600 transition-colors">
            <ShoppingCart size={18} />
            Cart(0)
          </a>
        </div>

        {/* CTA */}
        <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-2.5 rounded-md transition-colors">
          Hire Me
        </button>
      </div>
    </nav>
  );
}