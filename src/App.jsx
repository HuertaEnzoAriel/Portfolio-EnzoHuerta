import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 md:pt-20">
        <Home />
      </main>
      <Footer />
    </div>
  );
}
