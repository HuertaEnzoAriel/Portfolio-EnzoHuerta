const CodeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 5 3 12l5 7M16 5l5 7-5 7" />
  </svg>
);

const habilidades = [
  { nombre: "HTML5", nivel: 60 },
  { nombre: "CSS3", nivel: 55 },
  { nombre: "JavaScript", nivel: 45 },
  { nombre: "React", nivel: 10 },
  { nombre: "Tailwind CSS", nivel: 10 },
  { nombre: "Git & GitHub", nivel: 68 },
  { nombre: "Vite", nivel: 15 },
  { nombre: "Diseño Responsive", nivel: 65 },
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
          {habilidades.map(({ nombre, nivel }) => (
            <div
              key={nombre}
              className="flex flex-col items-center text-center gap-3 rounded-2xl border border-slate-100 dark:border-white/10 bg-white/60 dark:bg-white/5 shadow-sm hover:shadow-md dark:shadow-none dark:hover:bg-white/10 transition-all p-6"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                <CodeIcon />
              </span>
              <h3 className="font-semibold text-slate-900 dark:text-white">{nombre}</h3>

              <div className="w-full">
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-400"
                    style={{ width: `${nivel}%` }}
                  />
                </div>
                <span className="mt-2 inline-block text-xs font-medium text-slate-500 dark:text-slate-400">
                  {nivel}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
