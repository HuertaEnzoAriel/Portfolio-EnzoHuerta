import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Habilidades from "./components/Habilidades";
import Proyectos from "./components/Proyectos";
import Experiencia from "./components/Experiencia";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 md:pt-20">
        <Home />
        <Habilidades />
        <Proyectos />
        <Experiencia />
      </main>
      <Footer />
    </div>
  );
}
