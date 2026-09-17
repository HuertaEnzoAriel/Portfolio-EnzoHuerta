import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

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
const Sun = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);
const Moon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
);

export default function Navbar() {
  const [pagesOpen, setPagesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="w-full bg-white/90 dark:bg-slate-950/70 backdrop-blur-md shadow-sm dark:shadow-none dark:border-b dark:border-white/10 fixed top-0 left-0 z-50 transition-colors duration-500">
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
          <span className="text-xl font-semibold text-slate-800 dark:text-white">Enzo Huerta</span>
        </div>

        {/* Links de escritorio — grid-cols-3 en el padre + justify-self-center para centrarlos en la columna del medio */}
        <div className="hidden md:flex items-center justify-self-center gap-8 text-slate-700 dark:text-slate-200 font-medium">
          <a href="#home" className="hover:text-blue-600 dark:hover:text-teal-300 transition-colors">About</a>
          <a href="#habilidades" className="hover:text-blue-600 dark:hover:text-teal-300 transition-colors">Skills</a>
          <a href="#proyectos" className="hover:text-blue-600 dark:hover:text-teal-300 transition-colors">Projects</a>
          <a href="#experiencia" className="hover:text-blue-600 dark:hover:text-teal-300 transition-colors">Experience</a>
          <a href="#footer" className="hover:text-blue-600 dark:hover:text-teal-300 transition-colors">Contact</a>

          {/* Dropdown — sección 8: relative en el padre, absolute en el menú */}

        </div>

        {/* Toggle de tema + botón hamburguesa (mobile) */}
        <div className="flex items-center gap-3 justify-self-end">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
            aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>

          <button
            className="md:hidden text-slate-800 dark:text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú mobile — sección 7: flex-col, aparece solo si mobileOpen es true */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col gap-1 px-6 pb-4 text-slate-700 dark:text-slate-200 font-medium border-t border-slate-100 dark:border-white/10">
          <a href="#" className="py-2 hover:text-teal-600 dark:hover:text-teal-300">About Me</a>
          <a href="#" className="py-2 hover:text-teal-600 dark:hover:text-teal-300">Skills</a>
          <a href="#" className="py-2 hover:text-teal-600 dark:hover:text-teal-300">Projects</a>
          <a href="#" className="py-2 hover:text-teal-600 dark:hover:text-teal-300">Experience</a>
          <a href="#" className="py-2 hover:text-teal-600 dark:hover:text-teal-300">Contact</a>
        </div>
      )}
    </nav>
  );
}
