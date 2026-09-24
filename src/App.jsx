import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Habilidades from "./components/Habilidades";
import Proyectos from "./components/Proyectos";
import Experiencia from "./components/Experiencia";
import Footer from "./components/Footer";
import Aurora from "./components/Aurora";
import { useTheme } from "./context/theme";
import LlmAvatarAssistant from "./components/LlmAvatarAssistant";
import "./styles.css";

const DARK_COLOR_STOPS = ["#5227FF", "#7cff67", "#5227FF"];
const LIGHT_COLOR_STOPS = ["#6366f1", "#14b8a6", "#ec4899"];

// Fuera del componente para que no se recree en cada render
const ASSISTANT_CONFIG = {
  // Baja para que el modelo copie los datos tal cual y no invente
  temperature: 0.1,
  offlineText:
    "El asistente IA no está disponible en este momento. Mientras tanto, podés recorrer el portfolio o escribirle a Enzo desde la sección Contacto.",
  // Los alias son palabras que, si aparecen en la pregunta, llevan a esa sección.
  // Además, al modelo se le manda solo el contenido de las secciones nombradas:
  // cuantas más preguntas coincidan con un alias, más rápido responde.
  // Van como palabras completas: "proyecto" no coincide con "proyectos".
  sectionDiscovery: [
    { id: "home", title: "Inicio", aliases: ["Sobre mí", "quién es", "sobre Enzo"] },
    { id: "habilidades", title: "Habilidades", aliases: ["tecnologías", "tecnología", "lenguajes", "herramientas", "stack", "skills", "sabe hacer"] },
    { id: "proyectos", title: "Proyectos", aliases: ["proyecto", "trabajos", "aplicaciones", "VentasApp", "Anotador de Truco", "truco", "Portfolio Personal"] },
    { id: "experiencia", title: "Experiencia", aliases: ["trayectoria", "estudios", "estudia", "estudió", "facultad", "carrera", "universidad", "freelance"] },
    { id: "contacto", title: "Contacto", aliases: ["Hablemos", "contactar", "contactarlo", "email", "mail", "correo", "WhatsApp", "teléfono", "celular", "redes", "GitHub", "Instagram", "Facebook"] },
  ],
};

export default function App() {
  const { theme } = useTheme();

  return (
    <div className="relative isolate min-h-screen flex flex-col bg-slate-50 dark:bg-[#050414] transition-colors duration-500">

      <div className="fixed inset-0 -z-10 h-screen w-screen">
        <Aurora
          colorStops={theme === "dark" ? DARK_COLOR_STOPS : LIGHT_COLOR_STOPS}
          lightMode={theme === "light"}
          amplitude={1.2}
          blend={theme === "dark" ? 0.55 : 4.0}
        />
      </div>

      <Navbar />

      <main className="flex-1 pt-20">
        <Home />
        <Habilidades />
        <Proyectos />
        <Experiencia />
      </main>

      <Footer />

      <LlmAvatarAssistant config={ASSISTANT_CONFIG} />

    </div>
  );
}