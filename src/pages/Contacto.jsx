// src/pages/Contacto.jsx
import { useEffect } from "react";
import heroImg from "../assets/hero-contacto.jpg"; // pon el .jpg dentro de src/assets/
import ContactoForm from "../components/ContactoForm.jsx";

export default function Contacto() {
  useEffect(() => {
    document.title = "Contacto — BData";
  }, []);

  const heroStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(4,47,46,0.55), rgba(4,47,46,0.25)), url(${heroImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div className="bg-white">
      {/* === HERO con imagen + overlay === */}
      <section
        className="relative min-h-[42vh] md:min-h-[46vh] flex items-end"
        style={heroStyle}
      >
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-emerald-900/25 to-transparent" />
        <div className="container-bd relative z-10 py-10 md:py-14">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] max-w-4xl">
            Rentabiliza tu campo con datos e inteligencia
          </h1>
        </div>
      </section>

      {/* === Tarjeta con el formulario (una sola instancia) === */}
      <div className="container-bd -mt-8 md:-mt-10 pb-16">
        <ContactoForm />
      </div>
    </div>
  );
}
