import portfolioImg from "../assets/proyecto-portfolio.png";
import ventasAppImg from "../assets/proyecto-ventasapp.png";
import trucoImg from "../assets/proyecto-truco.png";

const LinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3h7v7M21 3l-9 9M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" />
  </svg>
);

const CodeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 5 3 12l5 7M16 5l5 7-5 7" />
  </svg>
);

const proyectos = [
  {
    titulo: "Portfolio Personal",
    descripcion:
      "Landing page de presentación construida con React, Vite y Tailwind CSS, con secciones de habilidades, experiencia y contacto.",
    tags: ["React", "Vite", "Tailwind CSS"],
    imagen: portfolioImg,
    link: "",
  },
  {
    titulo: "VentasApp",
    descripcion:
      "Aplicación web de gestion de ventas, reparto, stock y clientes. Construida con Codeigniter 4 y php, con base de datos MySQL y diseño responsive.",
    tags: ["Php", "Bootstrap", "CSS"],
    imagen: ventasAppImg,
    link: "https://www.ventasapp.site",
  },
  {
    titulo: "Anotador de Truco",
    descripcion:
      "Anotador gratuito de Truco Argentino, construido con HTML y JavaScript, con almacenamiento de datos en LocalStorage.",
    tags: ["JavaScript", "HTML5", "LocalStorage"],
    imagen: trucoImg,
    link: "https://anotador.dpdns.org",
  },
];

export default function Proyectos() {
  return (
    <section id="proyectos" className="relative w-full py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-slate-500 dark:text-slate-400 mb-2 text-center md:text-left">
          Algunos de mis trabajos
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-14 text-center md:text-left">
          Proyectos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {proyectos.map(({ titulo, descripcion, tags, imagen, link }) => (
            <div
              key={titulo}
              className="flex flex-col rounded-2xl border border-slate-100 dark:border-white/10 bg-white/90 dark:bg-white/5 shadow-sm hover:shadow-lg dark:shadow-none dark:hover:bg-white/10 transition-all overflow-hidden"
            >
              <img
                src={imagen}
                alt={titulo}
                className="h-40 w-full object-cover"
              />

              <div className="flex flex-col flex-1 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {titulo}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 flex-1">
                  {descripcion}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm font-medium">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-teal-600 hover:text-teal-700 dark:text-teal-300 dark:hover:text-teal-200 transition-colors"
                  >
                    <LinkIcon /> Ver demo
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                  >
                    <CodeIcon /> Código
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
