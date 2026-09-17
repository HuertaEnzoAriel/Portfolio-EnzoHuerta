const experiencias = [
  {
    periodo: "2023 — Actualidad",
    titulo: "Estudiante de Desarrollo Web",
    lugar: "Facultad — Tercer año",
    descripcion:
      "Formándome en el desarrollo Fullstack Moderno: HTML, CSS, JavaScript, React, Python, Laravel aplicando buenas prácticas de componentización y diseño responsive en cada proyecto de la carrera.",
    tags: ["React", "JavaScript", "Tailwind CSS","Python","Laravel","Git"],
  },
  {
    periodo: "2024",
    titulo: "Desarrollador Freelance",
    lugar: "Proyectos independientes",
    descripcion:
      "Diseño y desarrollo de landing pages y sitios a medida para emprendimientos locales, enfocándome en interfaces limpias, tiempos de carga rápidos y una experiencia agradable en cualquier dispositivo.",
    tags: ["React", "Vite", "UI/UX"],
  },
  {
    periodo: "2026",
    titulo: "Proyectos Personales",
    lugar: "Portafolio propio",
    descripcion:
      "Construcción de aplicaciones y componentes propios para seguir profundizando en React, manejo de estado y consumo de APIs, documentando el proceso en un portafolio en constante crecimiento.",
    tags: ["React", "JavaScript", "APIs"],
  },
];

export default function Experiencia() {
  return (
    <section id="experiencia" className="relative w-full py-20 md:py-28" id="experiencia">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-slate-500 dark:text-slate-400 mb-2 text-center md:text-left">
          Mi trayectoria
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-14 text-center md:text-left">
          Experiencia
        </h2>

        <ol className="relative border-l-2 border-indigo-100 dark:border-indigo-400/20 pl-8 space-y-12">
          {experiencias.map(({ periodo, titulo, lugar, descripcion, tags }) => (
            <li key={titulo} className="relative">
              <span className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-teal-400 ring-4 ring-white dark:ring-slate-950" />

              <span className="inline-block text-sm font-medium text-teal-600 dark:text-teal-300 bg-teal-50 dark:bg-teal-500/10 px-3 py-1 rounded-full mb-3">
                {periodo}
              </span>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{titulo}</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-3">{lugar}</p>

              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mb-4">{descripcion}</p>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
