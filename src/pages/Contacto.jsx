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
        className="relative min-h-[46vh] md:min-h-[50vh] flex items-end pb-12 md:pb-20"
        style={heroStyle}
      >
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-emerald-900/25 to-transparent" />
        <div className="container-bd relative z-10 py-10 md:py-14">
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] max-w-3xl">
            Rentabiliza tu campo con datos e inteligencia
          </h1>
        </div>
      </section>

      {/* === Tarjeta con el formulario (una sola instancia) === */}
      {/* Evita que el hero se superponga: quita margen negativo y asegura stacking */}
      <div className="container-bd mt-8 md:mt-12 pb-16 relative z-10">
        <ContactoForm />
      </div>
    </div>
  );
}
