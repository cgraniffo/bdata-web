// src/components/CTA.jsx
import { useLocation } from "react-router-dom";
import { getThemeForPath } from "../theme.js";

export default function CTA({ title = "¿Listo para partir?", bullets = [], planLabel = "" }) {
  const { pathname } = useLocation();
  const theme = getThemeForPath(pathname);

  // -------- Personaliza aquí tus datos de contacto --------
  const email = "christian@bdata.cl";          // cámbialo si usas otro
  const whatsapp = "+56944645774";            // pon tu número real
  // --------------------------------------------------------

  const mensajeWA = `Hola BData, quiero agendar diagnóstico para ${planLabel || "su plan"}.`;
  const urlWA = `https://api.whatsapp.com/send?phone=${whatsapp}&text=${encodeURIComponent(mensajeWA)}`;

  return (
    <section className="container-bd py-12 md:py-16">
      <div className={`rounded-2xl p-8 md:p-10 bg-white border shadow-sm`}>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className={`text-2xl md:text-3xl font-extrabold mb-3 ${theme.active}`}>
              {title}
            </h2>
            {bullets?.length > 0 && (
              <ul className="list-disc list-inside text-zinc-700 space-y-1 mb-6">
                {bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            )}
            <p className="text-zinc-600 text-sm">
              Tiempo de respuesta máximo: <strong>24 horas</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 sm:items-center md:items-start">
            <a
              href={`mailto:${email}?subject=${encodeURIComponent("Quiero información de " + (planLabel || "BData"))}`}
              className={`btn ${theme.btn} text-white w-full sm:w-auto`}
            >
              Escribir por correo
            </a>
            <a
              href={urlWA}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn ${theme.btn} text-white w-full sm:w-auto`}
            >
              Hablar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
