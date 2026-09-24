# Cambios del portfolio

Este documento explica todos los cambios que entran en este commit: **qué hace cada uno y para qué lo necesitás**. Están agrupados por tema, y en cada punto figura el archivo donde está el cambio. Al final hay una tabla por archivo para buscar rápido.

## Índice

1. [Asistente IA](#1-asistente-ia)
2. [Modo claro / oscuro](#2-modo-claro--oscuro)
3. [Rendimiento: imágenes más livianas](#3-rendimiento-imágenes-más-livianas)
4. [Accesibilidad](#4-accesibilidad)
5. [Navegación](#5-navegación)
6. [Contenido de la página](#6-contenido-de-la-página)
7. [Archivos borrados](#7-archivos-borrados)
8. [Configuración del proyecto](#8-configuración-del-proyecto)
9. [Cosas para tener en cuenta](#9-cosas-para-tener-en-cuenta)
10. [Tabla por archivo](#10-tabla-por-archivo)

---

## 1. Asistente IA

El asistente es el que tuvo más cambios. Se reescribió para que sea más claro para el visitante, más robusto ante errores y para que responda mejor.

### 1.1 Interfaz y comportamiento

Archivos: `src/components/LlmAvatarAssistant/LlmAvatarAssistant.jsx` y `src/styles.css`

| Cambio | Qué hace | Para qué lo necesitás |
| --- | --- | --- |
| **Abajo a la derecha** | Antes estaba centrado verticalmente (`top: 50%`); ahora está pegado abajo (`bottom: 24px`). | En el medio de la pantalla tapaba el contenido que la persona estaba leyendo. Abajo en la esquina es donde todos esperan un chat de ayuda. |
| **`z-index: 40`** (antes `9999`) | Define qué elemento queda arriba cuando se superponen. | Con `9999` el asistente quedaba **encima** del navbar (`z-50`) y del modal de contacto (`z-100`). Con `40` queda debajo de los dos. |
| **Minimizar** | El botón `×` y un clic en el avatar lo abren y lo cierran (estado `open`). | Permite sacarlo del medio si molesta. |
| **Arranca minimizado en celulares** | `window.matchMedia('(min-width: 768px)')` decide el estado inicial. | En una pantalla chica, abierto ocupaba gran parte de la vista. |
| **Indicador de estado** | Muestra *Conectando… / En línea / Sin conexión / Escribiendo…* con un punto de color. | El visitante sabe si vale la pena preguntar antes de escribir. |
| **Reintentar conexión** | Botón que aparece si no hay conexión. | Si prendés `llama-server` después de abrir la página, no hace falta recargar. |
| **Muestra la pregunta** | La pregunta aparece en cursiva arriba de la respuesta. | Se entiende a qué está respondiendo. |
| **Links clickeables** | La función `linkify` convierte las URLs y los emails de la respuesta en `<a>`. | Si el asistente da el link de un proyecto o tu email, se puede hacer clic. |
| **Botón "Ir a *sección* →"** | Reemplaza a la vieja función `renderResponse`, que buscaba el título de la sección dentro del texto para subrayarlo. | La versión vieja fallaba si el modelo escribía el título distinto. El botón siempre aparece cuando se detecta una sección. |
| **Memoria de la conversación** | `historyRef` guarda los últimos 6 mensajes (3 preguntas con sus respuestas) y los reenvía al modelo. | Así entiende preguntas de seguimiento como "¿y el link?". Se limita a 6 porque cada mensaje ocupa lugar en el contexto del modelo, y un modelo local tiene poco lugar y se vuelve más lento con más texto. |
| **Errores claros** | La función `errorMessage` elige el mensaje según el tipo de error (ver 1.3). | Antes se mostraba el error técnico en inglés (`llmClient: request failed...`). |
| **Busca la sección primero en la pregunta** | Si preguntás "¿cómo lo contacto?", va a *Contacto* aunque la respuesta no la nombre. | Lo que escribe el usuario es más confiable que lo que genera el modelo. |
| **Burbuja con altura máxima `min(240px, 35vh)`** | Nunca pasa de 240px ni del 35% de la altura de la pantalla. | En pantallas bajas (celular acostado) la burbuja no tapa todo. |
| **`scrollOffset: 80`** | Al desplazarse a una sección, deja 80px arriba. | Sin eso, el navbar fijo tapa el título de la sección. |
| **Textos en español** | Placeholder "Haceme una pregunta…", `aria-label` y errores. | Antes había partes en inglés. |

**Avatar nuevo:** `public/models/soporte.gif` reemplaza a `clippy.gif`. En modo oscuro se aplica:

```css
.dark .lav-avatar-image {
  filter: invert(1) hue-rotate(180deg);
}
```

`invert(1)` convierte el contorno negro en blanco para que se vea sobre el fondo oscuro, pero también invierte los colores (el azul pasa a naranja). `hue-rotate(180deg)` gira el tono 180° y devuelve el azul original.

**Se quitó lo que no se usaba:** las props `onScrollToSection` y `onSend`, la opción `corner` y el `import React` (desde React 17 ya no hace falta importarlo para escribir JSX).

### 1.2 Colores según el tema claro u oscuro

Archivo: `src/styles.css`

Antes, la burbuja y el campo de texto tenían colores oscuros fijos (`#10111b`, `white`), así que en modo claro quedaba una caja negra sobre una página blanca.

Ahora los colores son **variables CSS** (*custom properties*). Se definen una vez con los valores del modo claro y se redefinen cuando la página está en modo oscuro:

```css
.lav-container {
  --lav-surface: #ffffff;   /* fondo en modo claro */
  --lav-text: #0f172a;
}

.dark .lav-container {
  --lav-surface: #10111b;   /* fondo en modo oscuro */
  --lav-text: #ffffff;
}

.lav-bubble {
  background: var(--lav-surface);
  color: var(--lav-text);
}
```

**Por qué funciona:** tu `ThemeProvider` agrega la clase `dark` al `<html>` cuando el tema es oscuro. En ese caso `.dark .lav-container` se aplica y pisa las variables. Todos los elementos que usan `var(--lav-...)` cambian solos, sin tocar el código React.

**Para qué te sirve:** si querés cambiar un color, lo cambiás en un solo lugar (arriba de todo en `styles.css`) y no en cada regla. Los valores del modo claro son los mismos grises e índigos (paleta *slate* de Tailwind) que usan el navbar y las tarjetas, para que todo combine.

También se agregó:
- Una sombra suave en modo claro (`--lav-shadow`) para que la burbuja se despegue del fondo blanco. En modo oscuro es `none` porque ahí no se nota.
- Un color para el placeholder del input (`.lav-input::placeholder`).
- Una transición de 0.5 s en los colores, igual a la del resto de la página (`duration-500`), para que el cambio de tema sea parejo.

### 1.3 Conexión con el modelo

Archivo: `src/components/LlmAvatarAssistant/llmClient.js`

**Errores con código.** Ahora cada error lleva un `code` para que la interfaz sepa qué pasó:

| `code` | Cuándo ocurre | Qué ve el visitante |
| --- | --- | --- |
| `network` | No hay nada escuchando en la URL (`llama-server` apagado). | "No me pude conectar con el modelo de IA…" |
| `timeout` | El servidor no respondió a tiempo. | "El modelo tardó demasiado en responder…" |
| `http` | El servidor respondió con un error (500, 503…). Trae `status`. | Con 503: "El modelo todavía se está cargando…" |

**`ping()`** reemplaza a `getModelInfo()`. Hace un `GET /models` con 4 segundos de límite para saber si el servidor está prendido. Cualquier respuesta HTTP, incluso un error, cuenta como "en línea", porque significa que hay un servidor contestando. Es lo que alimenta el indicador de estado.

**El timeout solo cubre hasta que llega la respuesta inicial.** Con *streaming*, la respuesta se va escribiendo durante varios segundos. Si el timeout siguiera corriendo, cortaría respuestas largas a la mitad.

**Bug corregido en el modo streaming.** Si el servidor ignoraba `stream: true` y devolvía un JSON normal, la condición anterior era:

```js
if (!ct.includes('text/event-stream') && !res.body)   // antes: casi nunca se cumplía
if (!ct.includes('text/event-stream') || !res.body)   // ahora
```

Con `&&` solo entraba si además no había body, que es casi imposible. Entonces intentaba leer el JSON como si fuera streaming y la respuesta quedaba vacía. Con `||` alcanza con que no sea streaming.

**URL configurable:** la dirección del servidor sale de `import.meta.env.VITE_LLM_URL` (ver sección 8). Si no está definida, usa `http://127.0.0.1:8080/v1`.

**Se quitó lo que no se usaba:** la inyección de `fetch` para tests (`fetchImpl`) y el soporte de `signal` externo para cancelar.

### 1.4 Qué sabe el asistente

Archivo: `src/components/LlmAvatarAssistant/systemPrompt.js`

- **Límite por sección de 1200 a 3000 caracteres.** Con 1200 se cortaba el final de las secciones largas, y a veces se perdían datos (como los de contacto, que están al final).
- **Ahora lee los links (`readLinks`).** El texto visible de un `<a>` no incluye su `href`: el modelo veía "Ver sitio" pero no la URL, y entonces la inventaba o decía que no la tenía. Ahora cada sección manda un bloque así:

  ```
  Enlaces:
  - Ver VentasApp en línea: https://www.ventasapp.site
  - Email: enzo.a.h75@gmail.com
  ```

  Como nombre del link usa primero el `aria-label` o el `title`, porque describen mejor el destino ("Ver el código de VentasApp") que el texto del botón ("Código"). Por eso se agregaron `aria-label` en los proyectos y `title` en el link de WhatsApp: sirven para accesibilidad **y** para el asistente.
- **Reglas nuevas en el system prompt:**
  - **7. Links:** copiar los links tal cual figuran en "Enlaces" y, si no figura, decir que no está publicado.
  - **8. Seguimiento:** usar los mensajes anteriores para entender preguntas como "¿y el link?".
  - Las reglas de seguridad pasaron a ser la 9 a la 12 (cambió solo el número).

### 1.5 Detección de secciones

Archivos: `src/components/LlmAvatarAssistant/sectionScanner.js` y `src/App.jsx`

**Bug corregido en `indexOfWord` (antes `indexOfDiacriticInsensitive`).** La función busca si el texto menciona una sección como palabra completa. La versión anterior solo miraba la **primera** aparición: si esa aparición estaba dentro de otra palabra, devolvía "no encontrado" aunque más adelante estuviera la palabra suelta. Ahora sigue buscando con un `while` hasta encontrar una aparición válida.

**Más alias en `App.jsx`.** Los alias son palabras que, si aparecen en la pregunta, llevan a esa sección. Por ejemplo, "email", "WhatsApp" o "redes" llevan a *Contacto*, y "VentasApp" lleva a *Proyectos*.

**Simplificación:** `slugify` y `slugToTitle` dejaron de exportarse porque solo se usan dentro del archivo. `scrollToSection` quedó en 4 líneas.

### 1.6 Limpieza de respuestas

Archivo: `src/components/LlmAvatarAssistant/utils.js`

- **`cleanAnswer` (nueva)** quita dos cosas que ensucian la respuesta:
  - Los bloques `<think>...</think>`: algunos modelos de "razonamiento" (como Qwen o DeepSeek) escriben lo que piensan antes de responder.
  - Los encabezados `[SECCIÓN: ...]`: los modelos chicos a veces copian el formato de la base de conocimiento.
- **`displayMarkdown`** ahora convierte `[texto](url)` en `texto (url)`. Antes dejaba solo el texto y la URL se perdía.
- Se borraron `stripCodeFence` y `plainMarkdown`, que no se usaban.

### 1.7 Otros archivos del asistente

- `index.js`: antes exportaba más de 15 cosas, incluidas algunas de archivos borrados. Ahora exporta solo el componente, que es lo único que usa `App.jsx`.
- `App.jsx`: se agregó un `offlineText` propio que, si el asistente no está disponible, invita a recorrer el portfolio o a escribir desde *Contacto*.

---

## 2. Modo claro / oscuro

### 2.1 Sin parpadeo al cargar

Archivo: `index.html`

Se agregó un `<script>` chico en el `<head>`:

```js
const theme = localStorage.getItem("theme");
if (theme === "dark" || (!theme && matchMedia("(prefers-color-scheme: dark)").matches)) {
  document.documentElement.classList.add("dark");
}
```

**Problema que resuelve:** React tarda unos milisegundos en cargar. Hasta que `ThemeProvider` ponía la clase `dark`, la página se veía en modo claro, así que alguien con modo oscuro veía un **destello blanco** en cada recarga (en inglés se le dice *FOUC*, "flash of unstyled content"). Este script corre antes de que se dibuje la página y pone el tema correcto desde el primer momento.

Está dentro de un `try/catch` porque algunos navegadores bloquean `localStorage` (por ejemplo, en modo privado con ciertas configuraciones).

### 2.2 El contexto separado del Provider

Archivos: `src/context/theme.js` (nuevo) y `src/context/ThemeContext.jsx`

`ThemeContext` y el hook `useTheme` se mudaron a `theme.js`. `ThemeContext.jsx` quedó solo con el componente `ThemeProvider`. Por eso `App.jsx` y `Navbar.jsx` ahora importan desde `"./context/theme"`.

**Por qué:** el *Fast Refresh* de Vite (lo que actualiza la página al guardar sin perder el estado) solo funciona si un archivo `.jsx` exporta **únicamente componentes**. Como `ThemeContext.jsx` exportaba también un hook, cada cambio en ese archivo recargaba la página entera. El linter (`oxlint`) avisa esto con la regla `react/only-export-components`, configurada en `.oxlintrc.json`.

---

## 3. Rendimiento: imágenes más livianas

Archivos: `src/assets/*.webp`, `Home.jsx` y `Proyectos.jsx`

**PNG → WebP.** WebP es un formato de imagen que pesa mucho menos con la misma calidad visible:

| Imagen | Antes (PNG) | Ahora (WebP) |
| --- | --- | --- |
| `profile-caricatura` | 639 KB | 43 KB |
| `proyecto-portfolio` | 132 KB | 25 KB |
| `proyecto-truco` | 121 KB | 6 KB |
| `proyecto-ventasapp` | 79 KB | 15 KB |
| **Total** | **~971 KB** | **~89 KB** |

La página descarga alrededor de un 90% menos en imágenes, algo que se nota mucho con datos móviles.

**En la foto de perfil (`Home.jsx`):**
- `width={640} height={854}`: el navegador reserva el espacio antes de que la imagen cargue. Sin esto, el texto se "salta" cuando aparece la imagen (se llama *layout shift*, y Google lo tiene en cuenta para posicionar la página). Con `h-auto` la imagen se sigue achicando en pantallas chicas.
- `fetchPriority="high"`: le dice al navegador que la descargue primero, porque es lo más grande que se ve al entrar.

**En las capturas de proyectos (`Proyectos.jsx`):**
- `loading="lazy"`: se descargan recién cuando el usuario se acerca a esa sección.
- `decoding="async"`: la imagen se procesa sin trabar el resto de la página.

---

## 4. Accesibilidad

Estos cambios hacen que la página se pueda usar con un **lector de pantalla** (software que lee la página en voz alta a personas ciegas) y con teclado.

| Cambio | Archivo | Para qué |
| --- | --- | --- |
| `<html lang="es">` (antes `en`) | `index.html` | El lector de pantalla pronuncia en español y el navegador no ofrece traducir la página. |
| `<label className="sr-only">` en el formulario | `Footer.jsx` | Un placeholder no sirve como etiqueta: desaparece al escribir y no todos los lectores lo leen. `sr-only` (de Tailwind) esconde la etiqueta a la vista pero la deja para el lector de pantalla. |
| `autoComplete="name"` / `"email"` | `Footer.jsx` | El navegador ofrece autocompletar con los datos guardados. |
| `autoFocus` en "Tu nombre" | `Footer.jsx` | Al abrir el modal, el cursor ya está en el primer campo. |
| `alt="Captura de pantalla de …"` | `Proyectos.jsx` | Un `alt` igual al título no aportaba nada: el título ya está escrito abajo. |
| `aria-label` en "Ver sitio" y "Código" | `Proyectos.jsx` | Con tres tarjetas, el lector leía "Código, Código, Código". Ahora dice "Ver el código de VentasApp". |
| `aria-expanded` y `aria-controls` en el menú hamburguesa | `Navbar.jsx` | El lector anuncia si el menú está abierto o cerrado. |
| `aria-live="polite"` en la burbuja | `LlmAvatarAssistant.jsx` | El lector lee la respuesta del asistente cuando llega. |
| Contorno visible con `:focus-visible` | `styles.css` | Quien navega con Tab ve en qué botón está parado. |
| Scroll suave solo con `prefers-reduced-motion: no-preference` | `index.css` | A algunas personas las animaciones les causan mareo. Si configuraron el sistema para reducir movimiento, el scroll es instantáneo. |

---

## 5. Navegación

Archivos: `Navbar.jsx`, `index.css` y `Habilidades.jsx`

- **El menú de celular no funcionaba.** Sus links tenían `href="#"` y textos en inglés ("About Me", "Skills"…), así que tocarlos no llevaba a ninguna sección. Ahora usa los mismos links que el menú de escritorio.
- **Un solo arreglo `NAV_LINKS`** para los dos menús. Si agregás una sección, la agregás en un solo lugar y aparece en ambos.
- **El menú de celular se cierra al tocar un link** (`onClick={() => setMobileOpen(false)}`). Antes quedaba abierto tapando la sección.
- **`scroll-padding-top: 5rem`** en `index.css`: al tocar un link del navbar, la sección queda debajo del navbar fijo y no tapada por él.
- **Se borró código muerto:** el ícono `ChevronDown` y el estado `pagesOpen`, que eran de un dropdown que ya no existe.
- **`id` duplicado en `Habilidades.jsx`:** el `<p>` y el `<section>` tenían los dos `id="habilidades"`. Un `id` tiene que ser único en la página, y el asistente y los links buscan por `id`.

---

## 6. Contenido de la página

### Redes sociales (`Footer.jsx`)
- Se cargaron los links reales de GitHub, Instagram y Facebook.
- `activeSocials` filtra las redes que todavía tienen `href: "#"` (LinkedIn y X) para que no aparezcan íconos que no llevan a ningún lado. Cuando tengas el perfil, cambiás el `"#"` por la URL y el ícono aparece solo.
- Los links se abren en otra pestaña con `target="_blank" rel="noopener noreferrer"`. El `rel` es por **seguridad**: sin él, la página que se abre puede acceder a tu pestaña mediante `window.opener` y, por ejemplo, redirigirla a un sitio falso. Los navegadores modernos ya lo bloquean por defecto, pero se pone igual para cubrir los más viejos.

### Proyectos (`Proyectos.jsx`)
- Cada proyecto tiene dos campos: `link` (el sitio publicado) y `repo` (el código en GitHub). **Si alguno está vacío, su botón no se muestra.** Antes "Ir" y "Código" aparecían siempre, aunque apuntaran a `""` o a `"#"`.
- "Ir" pasó a llamarse "Ver sitio", que es más claro.
- Descripciones y tags corregidos: el portfolio menciona el asistente IA, y VentasApp lista PHP, CodeIgniter 4, MySQL y Bootstrap (además de arreglar "gestion" → "gestión").

### Habilidades (`Habilidades.jsx`)
- Se agregaron Bootstrap, PHP, CodeIgniter, Laravel, MySQL y Python, cada una con su ícono SVG.
- La grilla pasó de `grid` a `flex flex-wrap justify-center`. Con `grid`, si la última fila tiene menos tarjetas, quedan pegadas a la izquierda; con `flex-wrap` + `justify-center`, quedan centradas. El ancho de cada tarjeta (`w-[calc(25%-18px)]`) descuenta el espacio entre tarjetas para que entren 4 por fila en escritorio y 2 en celular.

### Textos (`Experiencia.jsx` y `Home.jsx`)
- Correcciones de redacción: "Fullstack Moderno" → "fullstack moderno", "Python, Laravel" → "Python y Laravel", y espacios entre los tags.
- "Portafolio" → "portfolio", para usar la misma palabra en toda la página.
- El título principal pasó a mayúsculas normales ("Descubrí mi trabajo…"). En español no se escribe con mayúscula cada palabra de un título.

### Pestaña del navegador y vista previa (`index.html` y `public/favicon.svg`)
- `<title>Enzo Huerta</title>` en vez de "mi-app".
- `<meta name="description">`: el texto que muestra Google debajo del título en los resultados.
- Etiquetas `og:` (Open Graph): el título y la descripción que muestran WhatsApp, LinkedIn o Facebook cuando alguien comparte el link.
- Favicon nuevo: un `</>` con degradado índigo-rosa en vez del logo de Vite.

---

## 7. Archivos borrados

Ninguno se importaba desde ningún lado, así que borrarlos no cambia nada visible. Solo quita ruido del proyecto.

| Archivo | Qué era |
| --- | --- |
| `src/App.css`, `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`, `public/icons.svg` | Restos de la plantilla inicial de Vite. |
| `src/components/ParticleText.jsx` y `.css` | Efecto de texto con partículas que no se usaba. |
| `src/components/UseCard.jsx` | Componente `UserCard` de un ejercicio anterior. |
| `LlmAvatarAssistant/AvatarCanvas.jsx` y `autoFit.js` | El avatar 3D anterior hecho con three.js. Se reemplazó por el GIF. |
| `src/assets/*.png` | Reemplazados por sus versiones `.webp` (sección 3). |

---

## 8. Configuración del proyecto

### `package.json` y `package-lock.json`
- Nombre `portfolio-enzo-huerta` en vez de `mi-app`, versión `1.0.0` y una descripción.
- **Se quitó la dependencia `three`.** Solo la usaba el avatar 3D borrado. Es una librería grande, así que `npm install` descarga bastante menos. `package-lock.json` cambió solo por esto.

### `.env.example` y `.gitignore`
- `.env.example` es una **plantilla** que muestra qué variables de entorno acepta el proyecto. Para cambiar la URL del asistente, lo copiás como `.env.local` y editás el valor:

  ```
  VITE_LLM_URL=http://127.0.0.1:8080/v1
  ```

- `.gitignore` ahora ignora `.env` (ya ignoraba `*.local`). Así tu configuración real no se sube a GitHub; lo que se sube es solo la plantilla.
- **Importante sobre `VITE_`:** Vite solo deja leer desde el código del navegador las variables que empiezan con `VITE_`, y esas variables **quedan escritas en el JavaScript público** del build. Nunca pongas una contraseña o una API key en una variable `VITE_`: cualquiera podría leerla con F12.

### `README.md`
Se reescribió desde cero (antes era el README genérico de la plantilla de Vite). Ahora explica qué es el proyecto, qué hace el asistente, cómo correrlo, cómo levantar `llama-server`, los scripts disponibles y la estructura de carpetas.

---

## 9. Cosas para tener en cuenta

- **`public/models/clippy.gif` ya no se usa**, pero aparece como modificado y entra en el commit (pasó de 113 KB a 645 KB). Si no lo vas a usar, lo podés borrar con `git rm public/models/clippy.gif`.
- **El asistente solo funciona donde corre `llama-server`.** La URL `127.0.0.1` significa "esta misma computadora". Si publicás el portfolio, cada visitante va a ver *Sin conexión* (con el mensaje amable de `offlineText`), porque el servidor está en tu PC y no en la de ellos. Para que funcione para todos haría falta un servidor accesible desde internet.
- **Este archivo (`CAMBIOS.md`) queda en el repositorio.** Si no querés que sea público en GitHub, lo sacás con `git rm CAMBIOS.md` y hacés otro commit.

---

## 10. Tabla por archivo

| Archivo | Sección |
| --- | --- |
| `.env.example` (nuevo), `.gitignore` | [8](#8-configuración-del-proyecto) |
| `README.md`, `package.json`, `package-lock.json` | [8](#8-configuración-del-proyecto) |
| `index.html` | [2.1](#21-sin-parpadeo-al-cargar), [4](#4-accesibilidad), [6](#6-contenido-de-la-página) |
| `public/favicon.svg` | [6](#6-contenido-de-la-página) |
| `public/models/soporte.gif` (nuevo), `clippy.gif` | [1.1](#11-interfaz-y-comportamiento), [9](#9-cosas-para-tener-en-cuenta) |
| `src/App.jsx` | [1.5](#15-detección-de-secciones), [1.7](#17-otros-archivos-del-asistente), [2.2](#22-el-contexto-separado-del-provider) |
| `src/index.css` | [4](#4-accesibilidad), [5](#5-navegación) |
| `src/styles.css` | [1.1](#11-interfaz-y-comportamiento), [1.2](#12-colores-según-el-tema-claro-u-oscuro) |
| `src/context/theme.js` (nuevo), `ThemeContext.jsx` | [2.2](#22-el-contexto-separado-del-provider) |
| `src/components/Navbar.jsx` | [4](#4-accesibilidad), [5](#5-navegación) |
| `src/components/Home.jsx` | [3](#3-rendimiento-imágenes-más-livianas), [6](#6-contenido-de-la-página) |
| `src/components/Habilidades.jsx` | [5](#5-navegación), [6](#6-contenido-de-la-página) |
| `src/components/Proyectos.jsx` | [3](#3-rendimiento-imágenes-más-livianas), [4](#4-accesibilidad), [6](#6-contenido-de-la-página) |
| `src/components/Experiencia.jsx` | [6](#6-contenido-de-la-página) |
| `src/components/Footer.jsx` | [4](#4-accesibilidad), [6](#6-contenido-de-la-página) |
| `LlmAvatarAssistant/LlmAvatarAssistant.jsx` | [1.1](#11-interfaz-y-comportamiento) |
| `LlmAvatarAssistant/llmClient.js` | [1.3](#13-conexión-con-el-modelo) |
| `LlmAvatarAssistant/systemPrompt.js` | [1.4](#14-qué-sabe-el-asistente) |
| `LlmAvatarAssistant/sectionScanner.js` | [1.5](#15-detección-de-secciones) |
| `LlmAvatarAssistant/utils.js` | [1.6](#16-limpieza-de-respuestas) |
| `LlmAvatarAssistant/index.js` | [1.7](#17-otros-archivos-del-asistente) |
| Archivos borrados | [7](#7-archivos-borrados) |
