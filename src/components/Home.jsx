import profilePic from "../assets/profile-caricatura.png";

export default function Home() {
  return (
    <section className="relative w-full overflow-hidden"  id="home">
      {/* Formas decorativas sueltas, como en la referencia */}
      <span className="hidden md:block absolute top-10 left-8 w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-400" />
      <svg
        className="hidden md:block absolute top-14 right-16 w-6 h-6 text-indigo-400 dark:text-indigo-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 2 L22 12 L12 22 L2 12 Z" />
      </svg>
      <svg
        className="hidden md:block absolute bottom-16 left-[38%] w-10 h-10 text-indigo-300 dark:text-indigo-400/60"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 16 C4 8 20 8 20 16 C20 20 4 20 4 16 Z" />
      </svg>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 items-center gap-12">
        {/* Columna de texto */}
        <div>
          <p className="text-slate-500 dark:text-slate-300 mb-4">
            Hola, mi nombre es <span className="font-medium text-slate-700 dark:text-white">Enzo Huerta</span>
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
            Descubrí Mi Trabajo con Soluciones Creativas
          </h1>
          <p className="text-slate-500 dark:text-slate-300 max-w-md mb-8">
            Soy un desarrollador web apasionado por crear experiencias digitales únicas y funcionales.
            Mi enfoque se centra en combinar diseño atractivo con un rendimiento excepcional,
            asegurando que cada proyecto no solo se vea bien, sino que también funcione de manera eficiente.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#contacto"
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
            >
              Contratame
            </a>
          </div>
        </div>

        {/* Columna de imagen */}
        <div className="flex justify-center md:justify-end">
          <div className="relative isolate w-72 md:w-80">
            {/* Manchas de gradiente detrás de la foto */}
            <svg
              className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 -z-10"
              viewBox="0 0 420 420"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient
                  id="brush"
                  gradientUnits="userSpaceOnUse"
                  x1="10"
                  y1="30"
                  x2="400"
                  y2="380"
                >
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              <path
                d="M40 260 C10 190 90 90 190 60 C280 30 380 90 390 180 C400 270 320 340 220 360 C120 380 70 330 40 260 Z"
                fill="url(#brush)"
                opacity="0.85"
              />
            </svg>

            <img
              src={profilePic}
              alt="Retrato caricaturesco de Enzo Huerta"
              className="relative w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
