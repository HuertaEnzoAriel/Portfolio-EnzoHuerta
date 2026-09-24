# Portfolio — Enzo Huerta

Portfolio personal hecho con React, Vite y Tailwind CSS. Incluye un **asistente IA** que responde preguntas sobre el contenido de la página usando un modelo local servido con [llama.cpp](https://github.com/ggml-org/llama.cpp).

## Funcionalidades

- Secciones: Sobre mí, Habilidades, Proyectos, Experiencia y Contacto.
- Modo claro/oscuro que recuerda la preferencia del usuario.
- Fondo animado con WebGL (componente `Aurora`, hecho con `ogl`).
- Formulario de contacto (abre el cliente de correo) y link directo a WhatsApp.
- Diseño responsive con menú para celulares.

### Asistente IA

- Responde **solo** con el contenido de la página: en cada pregunta lee el texto y los links de cada sección desde el DOM y los manda como contexto al modelo.
- Recuerda los últimos intercambios, así entiende preguntas de seguimiento ("¿y el link?").
- Si la respuesta trata sobre una sección, desplaza la página hasta ella.
- Muestra las respuestas en tiempo real (streaming).
- Indica el estado de la conexión (En línea / Sin conexión). Si `llama-server` no está en ejecución, avisa con un mensaje claro y ofrece reintentar.
- El system prompt incluye reglas contra la invención de datos y contra intentos de *prompt injection*.
- Se puede minimizar; en celulares arranca minimizado para no tapar el contenido.

## Requisitos

- [Node.js](https://nodejs.org/) 20.19 o superior.
- `llama-server` de llama.cpp y un modelo `.gguf` (solo para el asistente; el resto del portfolio funciona sin él).

## Cómo correrlo

```bash
npm install
npm run dev
```

La página queda en http://localhost:5173.

### Levantar el asistente IA

En otra terminal, iniciar el servidor de llama.cpp con cualquier modelo de chat:

```bash
llama-server -m ruta/al/modelo.gguf --port 8080
```

El asistente se conecta a `http://127.0.0.1:8080/v1` (API compatible con OpenAI). Para usar otra dirección, copiar `.env.example` como `.env.local` y cambiar `VITE_LLM_URL`.

Si el servidor se inicia después de abrir la página, alcanza con tocar **Reintentar conexión** en el asistente.

## Scripts

| Comando           | Descripción                                   |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con recarga en caliente |
| `npm run build`   | Build de producción en `dist/`                |
| `npm run preview` | Sirve el build de producción localmente        |
| `npm run lint`    | Revisa el código con oxlint                   |

## Estructura

```
src/
├── components/
│   ├── Navbar.jsx, Home.jsx, Habilidades.jsx, Proyectos.jsx,
│   │   Experiencia.jsx, Footer.jsx     Secciones de la página
│   ├── Aurora.jsx                      Fondo animado (WebGL)
│   └── LlmAvatarAssistant/
│       ├── LlmAvatarAssistant.jsx      Interfaz del asistente
│       ├── llmClient.js                Cliente de la API (con streaming y manejo de errores)
│       ├── systemPrompt.js             Reglas + base de conocimiento leída de la página
│       ├── sectionScanner.js           Detección de secciones y desplazamiento
│       └── utils.js                    Helpers de texto
├── context/                            Tema claro/oscuro
├── App.jsx                             Composición de la página y config del asistente
└── main.jsx
public/models/soporte.gif               Avatar del asistente
```

## Tecnologías

React 19 · Vite 8 · Tailwind CSS 4 · ogl · llama.cpp · oxlint
