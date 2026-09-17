const HtmlIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M4 3h16l-1.5 15L12 21l-6.5-3L4 3z" stroke="#E34F26" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M9 9l-2 3 2 3M15 9l2 3-2 3M10.5 15h3" stroke="#E34F26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CssIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M4 3h16l-1.5 15L12 21l-6.5-3L4 3z" stroke="#1572B6" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M14.5 9h-5l.3 2.2h4.4l-.4 3-2.8.9-2.8-.9-.15-1.4" stroke="#1572B6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const JsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="3" fill="#F7DF1E" />
    <text x="12" y="16.5" textAnchor="middle" fontSize="9.5" fontWeight="700" fontFamily="sans-serif" fill="#1a1a1a">
      JS
    </text>
  </svg>
);

const ReactIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="2.2" fill="#61DAFB" />
    <g stroke="#61DAFB" strokeWidth="1.3">
      <ellipse cx="12" cy="12" rx="10" ry="4.2" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
    </g>
  </svg>
);

const TailwindIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <path
      d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.11 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.48 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.11 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.48 12 7 12z"
      fill="#38BDF8"
    />
  </svg>
);

const GitIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F05033" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="7" cy="6" r="2" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="12" r="2" />
    <path d="M7 8v8M7 9c0 3 3 3 8 3" fill="none" />
  </svg>
);

const ViteIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="vite-grad" x1="4" y1="2" x2="20" y2="22">
        <stop offset="0%" stopColor="#646CFF" />
        <stop offset="100%" stopColor="#FFDD35" />
      </linearGradient>
    </defs>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="url(#vite-grad)" />
  </svg>
);

const ResponsiveIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="14" height="10" rx="1" />
    <path d="M6 18h6" />
    <rect x="17" y="8" width="5" height="10" rx="1" />
  </svg>
);

const habilidades = [
  { nombre: "HTML5", Icon: HtmlIcon },
  { nombre: "CSS3", Icon: CssIcon },
  { nombre: "JavaScript", Icon: JsIcon },
  { nombre: "React", Icon: ReactIcon },
  { nombre: "Tailwind CSS", Icon: TailwindIcon },
  { nombre: "Git & GitHub", Icon: GitIcon },
  { nombre: "Vite", Icon: ViteIcon },
  { nombre: "Diseño Responsive", Icon: ResponsiveIcon },
];

export default function Habilidades() {
  return (
    <section id="habilidades" className="relative w-full py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-slate-500 dark:text-slate-400 mb-2 text-center md:text-left" id="habilidades">
          Lo que sé hacer
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-14 text-center md:text-left">
          Habilidades
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {habilidades.map(({ nombre, Icon }) => (
            <div
              key={nombre}
              className="flex flex-col items-center text-center gap-3 rounded-2xl border border-slate-100 dark:border-white/10 bg-white/60 dark:bg-white/5 shadow-sm hover:shadow-md dark:shadow-none dark:hover:bg-white/10 transition-all p-6"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 dark:bg-white/10">
                <Icon />
              </span>
              <h3 className="font-semibold text-slate-900 dark:text-white">{nombre}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
