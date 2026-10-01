# Reporte de evaluación — Enzo Huerta (HuertaEnzoAriel)

| Campo | Valor |
|---|---|
| Alumno | Enzo Huerta |
| Usuario GitHub | HuertaEnzoAriel |
| Repositorio | https://github.com/HuertaEnzoAriel/Portfolio-EnzoHuerta |
| Ruta del proyecto en el repo | raíz del repo |
| Stack | React 19.2 · Vite 8.2 · Tailwind CSS 4 (plugin @tailwindcss/vite) · ogl (WebGL) · llama.cpp (asistente IA) · sin router · oxlint |
| Build (`npm run build`) | ✅ pasa (npm install sin vulnerabilidades; build OK en 399ms, bundle JS 285.77 kB / 90 kB gzip, CSS 33.73 kB) |
| Commits | 28 (último: 2026-09-24 18:38 -0300) |

## Resumen ejecutivo
Portfolio de una sola página con un nivel de acabado alto: asistente IA local con llama.cpp (streaming, estados de conexión, anti-inyección), fondo WebGL (ogl), dark mode con persistencia, formulario modal y diseño responsive. `npm install` + `npm run build` pasan sin errores; el código es limpio, comentado y con buenas prácticas de React (hooks con cleanup, estado inmutable, Context, async/await con manejo de errores completo en el fetch). Cumple **189 de 195** puntos aplicables del checklist (usa Tailwind, así que el fragmento T-* aplica; ningún punto resultó no aplicable). Hallazgos: 0 🔴 / 6 🟡 / 7 🟢. Nota: **Excelente**.

## Estado general del repositorio
- **Estructura:** muy ordenada. `src/components/` con un componente por sección (Navbar, Home, Habilidades, Proyectos, Experiencia, Footer, Aurora) + subcarpeta `LlmAvatarAssistant/` con separación UI/cliente/prompt/scanner/utils; `src/context/` para el tema; assets en `src/assets/` (webp, chicos) y `public/` (favicon + gif del asistente). `.gitignore` correcto (node_modules, dist, .env, *.local).
- **Commits:** 28, en general descriptivos en español y con granularidad razonable; dos excepciones: `2b93296 .` (mensaje vacío) y `2532073 clase jueves pasado` (vago).
- **README:** excelente — describe funcionalidades, requisitos, cómo correrlo, cómo levantar llama-server, tabla de scripts, estructura de carpetas y tecnologías. `.env.example` presente (bien).
- **Extravíos:** sin `.env` commitado (verificado con `git ls-files`: solo `.env.example`), sin `node_modules/` ni `dist/` versionados. `public/models/soporte.gif` pesa **190 kB** (solo el gif, ningún GGUF en el repo — el modelo GGUF corre en la máquina del usuario): dentro del umbral, no se puntúa.

## Hallazgos

### 🔴 Críticos
Sin hallazgos críticos.

### 🟡 Importantes
- **Falta skip link** — `src/App.jsx:40`
  - Problema: no hay enlace "Saltar al contenido"; el nav fijo con 5 links + botones obliga a un usuario de teclado a tabular varios elementos antes de llegar al contenido.
  - Corrección sugerida: `<a href="#contenido" className="sr-only focus:not-sr-only ...">Saltar al contenido</a>` como primer hijo del body, con `id` en el `<main>`.
  - Checklist: H-51 · Apunte HTML, sección 3.3
- **Nav sin lista de enlaces (ul/li)** — `src/components/Navbar.jsx:108` y `:140`
  - Problema: los enlaces del nav están en `<div>` con `<a>` sueltos, no en `<ul>`/`<li>`; el apunte: "si la duda, es lo seguro".
  - Corrección sugerida: envolver los `.map` de `NAV_LINKS` en `<ul>`/`<li>` (con `list-none` para el look actual).
  - Checklist: H-09 · Apunte HTML, sección 1.2
- **Labels del formulario ocultos con sr-only** — `src/components/Footer.jsx:155`, `:168`, `:180`
  - Problema: los 3 campos del modal de contacto tienen `<label className="sr-only">` + `placeholder`; el criterio del apunte pide etiqueta *visible* (el placeholder no reemplaza al label).
  - Corrección sugerida: mostrar los labels visibles (o al menos en el campo con mayor confusión); el diseño del modal tiene espacio para ello.
  - Checklist: H-37 / H-39 · Apunte HTML, sección 2.3
- **Enlaces target="_blank" sin avisar que abren en pestaña nueva** — `src/components/Footer.jsx:232`, `:255` y `src/components/Proyectos.jsx:99`, `:110`
  - Problema: los 4 enlaces externos (WhatsApp, redes, "Ver sitio", "Código") abren pestaña nueva sin que el texto o aria-label lo indique; desorienta en móvil y el botón de retroceso puede no funcionar.
  - Corrección sugerida: añadir "(se abre en una pestaña nueva)" al aria-label/texto, o usar el mismo destino sin `target="_blank"`.
  - Checklist: H-22 · Apunte HTML, sección 1.5
- **Modal de contacto sin restaurar el foco al cerrar** — `src/components/Footer.jsx:98-112`
  - Problema: el modal hace foco inicial (`autoFocus` en el primer input, OK) y captura Escape (OK), pero al cerrar devuelve el foco al `body` en vez del botón que abrió el modal.
  - Corrección sugerida: guardar `document.activeElement` al abrir y `focus()` ese elemento en el cleanup.
  - Checklist: H-53 (accesibilidad de diálogos) · Apunte HTML, sección 3.4
- **Sin mensajes de error propios en el formulario (solo validación nativa)** — `src/components/Footer.jsx:154-197`
  - Problema: `handleSubmit` asume que `required`+`type="email"` del navegador son suficientes; el apunte advierte que no se debe depender solo de la validación nativa (mensajes no editables, lectores de pantalla inconsistentes).
  - Corrección sugerida: validar en el submit y renderizar mensajes por campo con `aria-invalid="true"` + `aria-describedby`.
  - Checklist: H-48 / H-49 · Apunte HTML, sección 2.5

### 🟢 Deseables
- **Canvas WebGL decorativo sin `aria-hidden`** — `src/components/Aurora.jsx:213`
  - Problema: el canvas del fondo no está marcado como decorativo (sin `aria-hidden="true"` ni `role="presentation"`), ni el contenedor fijo en `App.jsx:40`.
  - Corrección sugerida: `aria-hidden="true"` en el contenedor del Aurora.
  - Checklist: H-53 · Apunte HTML, sección 3.4
- **Animación continua del fondo sin respetar prefers-reduced-motion** — `src/components/Aurora.jsx:184-198`
  - Problema: el loop WebGL corre siempre (y consume GPU en segundo plano de pestañas); solo el `scroll-behavior: smooth` de `index.css:10` respeta la preferencia.
  - Corrección sugerida: con `matchMedia('(prefers-reduced-motion: reduce)')` pausar el rAF o reducir la amplitud.
  - Checklist: C-23 · Apunte CSS, sección 3.4
- **Foco de inputs con ring (box-shadow) solo** — `src/components/Footer.jsx:96`
  - Problema: `focus:outline-none focus:ring-2` usa ring (box-shadow) sin outline; en modo de colores forzados del sistema el box-shadow puede desaparecer.
  - Corrección sugerida: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-500` o ambos.
  - Checklist: C-20 · Apunte CSS, sección 3.2
- **Color hex arbitrario en dark mode** — `src/App.jsx:38`
  - Problema: `dark:bg-[#050414]` es un hex fuera del tema; el apunte pide tokens de tema, no valores arbitrarios.
  - Corrección sugerida: definir el color con `@theme { --color-aurora-dark: #050414; }` (Tailwind v4) y usar `dark:bg-aurora-dark`.
  - Checklist: C-08 / T-05 · Apunte Tailwind, sección 1.4
- **Estilo propio del asistente con CSS variables en vez de clases `dark:`** — `src/styles.css:4-33`
  - Problema: el widget del asistente usa `.dark .lav-container { --lav-* }` con hex propios; el patrón del apunte es `bg-white dark:bg-slate-950` con la paleta de Tailwind. Es coherente y funcional (dark mode correcto), pero mezcla dos sistemas de theming.
  - Corrección sugerida: migrar las superficies del asistente a clases `dark:` de Tailwind (o documentar la decisión en el README).
  - Checklist: T-15 · Apunte Tailwind, sección 3.3
- **Sin tests** — `package.json`
  - Problema: no hay `@testing-library/react` ni archivos `.test.jsx`; el asistente (llmClient, cleanAnswer, sectionScanner) tiene lógica pura que es muy testeable.
  - Corrección sugerida: empezar con tests de `utils.js` y `llmClient.js` (mockeando `fetch`) y del estado offline/online del asistente.
  - Checklist: R-43 · Apunte React, sección 10.2
- **Comma ortográfico en CTA** — `src/components/Home.jsx:46`
  - Problema: "Contactame" falta la tilde ("Contáctame").
  - Corrección sugerida: corregir el texto.
  - Checklist: H-14 (calidad del contenido) · Apunte HTML, sección 1.3

## Secciones sugeridas para agregar
Basado en tendencias actuales de portfolios de desarrolladores frontend (2025-2026):

1. **Demo en vivo del asistente IA (sección o badge)** — un recuadro con terminal animada (tipo `tui` fake) mostrando una pregunta/resuesta real del asistente con llama.cpp. Por qué suma: es la feature diferenciadora del repo y hoy no se ve sin levantar llama-server; mostrarla en vivo convierte una lectura del README en una demostración.
2. **Proceso / cómo construyo** — mini timeline o tarjetas con el flujo de trabajo (plan → código → lint/test → deploy) y las herramientas del día a día. Por qué suma: los empleadores 2025-2026 evalúan proceso y no solo stack; diferencia portfolios de "listas de tecnologías".
3. **Sección "Escrito / Notas"** — links a posts, apuntes o READMEs técnicos del propio alumno (p. ej. cómo se integró llama.cpp). Por qué suma: el "build in public" / escribir es la señal de seniority más pedida en frontend senior.
4. **Detalles técnicos de los proyectos (details/summary o modal)** — por cada proyecto: stack, responsabilidad del alumno, decisión técnica, resultado medible. Por qué suma: hoy se espera "qué hiciste vos" por proyecto, no una descripción genérica; y `<details>` suma semántica nativa de accesibilidad.
5. **Métricas / resultados medibles** — 2-3 números por proyecto (tamaño de bundle, Lighthouse, usuarios, uptime del site publicado). Por qué suma: portfolios cuantificados rinden mejor en screening; el repo ya tiene `npm run build` con números reales que podría exhibir.
6. **Sección "Sobre el stack local/IA"** — explicación corta de por qué llama.cpp local (privacidad, offline, costo 0) y requisitos de hardware. Por qué suma: el asistente IA local es una tendencia fuerte 2026 (local-first AI) y justificarlo muestra criterio técnico más allá de copiar un demo.
7. **Testimoniales o logros** — si existe feedback de clientes freelance (el Experiencia menciona freelance 2024) o logros académicos. Por qué suma: la prueba social sigue siendo de las secciones más buscadas por recruiters en portfolios junior/mid.

> Evalúese contra el checklist de Evaluaciones React 2026 (checklist_evaluacion_react.md).
