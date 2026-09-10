import { useState } from "react";

// Íconos como SVG inline, sin depender de lucide-react
const ChevronDown = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9l6 6 6-6" />
  </svg>
);
const Menu = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);
const X = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export default function Navbar() {
  const [pagesOpen, setPagesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm relative">
      {/* Barra principal — sección 4 y 3 del apunte: flex + justify-between + espaciado */}
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between md:grid md:grid-cols-3 h-20">
        {/* Logo — sección 4: flex items-center para alinear ícono y texto */}
        <div className="flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="url(#grad)" />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="24" y2="24">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-xl font-semibold text-slate-800">Enzo Huerta</span>
        </div>

        {/* Links de escritorio — grid-cols-3 en el padre + justify-self-center para centrarlos en la columna del medio */}
        <div className="hidden md:flex items-center justify-self-center gap-8 text-slate-700 font-medium">
          <a href="#" className="hover:text-blue-600 transition-colors">About</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Skills</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Projects</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Experience</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>

          {/* Dropdown — sección 8: relative en el padre, absolute en el menú */}

        </div>

        {/* CTA escritorio — sección 5, 6 y 9: color, hover, sombra/radio */}

        {/* Botón hamburguesa — visible solo en mobile (md:hidden) */}
        <button
          className="md:hidden text-slate-800"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú mobile — sección 7: flex-col, aparece solo si mobileOpen es true */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col gap-1 px-6 pb-4 text-slate-700 font-medium border-t border-slate-100">
          <a href="#" className="py-2 hover:text-teal-600">About Us</a>
          <a href="#" className="py-2 hover:text-teal-600">Skills</a>
          <a href="#" className="py-2 hover:text-teal-600">Projects</a>
          <a href="#" className="py-2 hover:text-teal-600">Experience</a>
          <a href="#" className="py-2 hover:text-teal-600">Contact</a>
        </div>
      )}
    </nav>
  );
}
