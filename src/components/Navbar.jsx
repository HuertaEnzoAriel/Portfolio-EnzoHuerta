import { useState, useEffect } from "react";
import { useTheme } from "../context/theme";

// Textos y tiempos del efecto de escritura del nombre en el navbar.
// Modificá estos valores para cambiar los textos, la velocidad y las pausas del efecto.
const NAV_TEXTS = ["Enzo Huerta", "Desarrollador Web"]; // agregá o quitá frases acá
const TYPING_SPEED_MS = 80; // ms entre cada letra al escribir
const DELETING_SPEED_MS = 25; // ms entre cada letra al borrar
const PAUSE_AFTER_TYPING_MS = 2000; // tiempo que queda el texto completo antes de empezar a borrar
const PAUSE_AFTER_DELETING_MS = 500; // tiempo vacío antes de volver a escribir

// Links de navegación, compartidos entre el menú de escritorio y el mobile
const NAV_LINKS = [
  { href: "#home", label: "Sobre mí" },
  { href: "#habilidades", label: "Habilidades" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#experiencia", label: "Experiencia" },
  { href: "#contacto", label: "Contacto" },
];

// Íconos como SVG inline, sin depender de lucide-react
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
// Logo "</>"
const CodeLogo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M8 7 3 12l5 5" stroke="url(#logo-grad)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 7l5 5-5 5" stroke="url(#logo-grad)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.5 4.5l-3 15" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round" />
    <defs>
      <linearGradient id="logo-grad" x1="0" y1="0" x2="24" y2="24">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
  </svg>
);

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const [displayedName, setDisplayedName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const currentText = NAV_TEXTS[textIndex];

  useEffect(() => {
    let timeoutId;

    if (!isDeleting && displayedName === currentText) {
      // Terminó de escribir: espera antes de empezar a borrar
      timeoutId = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPING_MS);
    } else if (isDeleting && displayedName === "") {
      // Terminó de borrar: espera, pasa al siguiente texto y vuelve a escribir
      timeoutId = setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % NAV_TEXTS.length);
        setIsDeleting(false);
      }, PAUSE_AFTER_DELETING_MS);
    } else {
      const nextName = isDeleting
        ? currentText.slice(0, displayedName.length - 1)
        : currentText.slice(0, displayedName.length + 1);
      timeoutId = setTimeout(
        () => setDisplayedName(nextName),
        isDeleting ? DELETING_SPEED_MS : TYPING_SPEED_MS
      );
    }

    return () => clearTimeout(timeoutId);
  }, [displayedName, isDeleting, currentText]);

  return (
    <nav className="w-full bg-white/90 dark:bg-slate-950/70 backdrop-blur-md shadow-sm dark:shadow-none dark:border-b dark:border-white/10 fixed top-0 left-0 z-50 transition-colors duration-500">
      {/* Barra principal — sección 4 y 3 del apunte: flex + justify-between + espaciado */}
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between md:grid md:grid-cols-3 h-20">
        {/* Logo — sección 4: flex items-center para alinear ícono y texto */}
        <div className="flex items-center gap-2">
          <CodeLogo size={26} />
          <span className="text-xl font-semibold text-slate-800 dark:text-white">
            {displayedName}
            <span className="animate-pulse">|</span>
          </span>
        </div>

        {/* Links de escritorio — grid-cols-3 en el padre + justify-self-center para centrarlos en la columna del medio */}
        <div className="hidden md:flex items-center justify-self-center gap-8 text-slate-700 dark:text-slate-200 font-medium">
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href} className="whitespace-nowrap hover:text-blue-600 dark:hover:text-teal-300 transition-colors">
              {label}
            </a>
          ))}
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
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú mobile — sección 7: flex-col, aparece solo si mobileOpen es true */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden flex flex-col gap-1 px-6 pb-4 text-slate-700 dark:text-slate-200 font-medium border-t border-slate-100 dark:border-white/10">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="py-2 hover:text-teal-600 dark:hover:text-teal-300"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
