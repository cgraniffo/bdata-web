// src/pages/CaminoDigital.jsx
import { Link } from "react-router-dom";
import { useEffect } from "react";
import TimelineCamino from "../components/TimelineCamino.jsx";

export default function CaminoDigital() {
  useEffect(() => {
    document.title = "Camino Digital — Tu punto de partida | BData";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* HERO */}
      <header className="relative bg-gradient-to-b from-emerald-700 via-emerald-600 to-emerald-500 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(ellipse_at_top,white_0.5px,transparent_0.5px)] [background-size:16px_16px]" />
        <div className="container-bd py-12 relative">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Tu campo es único, tu camino hacia la digitalización también.
          </h1>
          <p className="mt-2 text-emerald-50 text-lg font-semibold">
            Pasamos de intuición a gestión con datos, sin humo. 
          </p>
          <p className="mt-1 text-emerald-100 max-w-5xl">
            Primero analizamos dónde estás, luego
            estimamos impacto y finalmente implementamos acciones concretas.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
            //  to="/diagnostico-digital"
            //  className="inline-flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 px-5 py-2.5 rounded-lg font-semibold shadow-sm"
            //</div>>
            //</div>  🚜 Realizar encuesta de digitalización
            //</header></Link>
            //<Link
            //  to="/calculadora-roi"
            //  className="inline-flex items-center gap-2 bg-emerald-50/20 hover:bg-emerald-50/30 border border-white/40 px-5 py-2.5 rounded-lg"
            >
            
            </Link>
            <a
              href={`https://wa.me/56944645774?text=${encodeURIComponent(
                "Hola, quiero iniciar mi Camino Digital y revisar encuesta/ROI."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-50/10 hover:bg-emerald-50/20 border border-white/40 px-5 py-2.5 rounded-lg"
            >
              💬 ¿Quieres saber más?, Hablemos por WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="container-bd py-1">
        {/* PASO A PASO */}
        <section>
             <section className="mt-2">
              <TimelineCamino />
            </section>
 
        </section>

        {/* QUÉ OBTIENES */}
        <section className="mt-8 bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-emerald-800">
            ¿Qué obtienes con el Camino Digital?
          </h2>
          <ul className="mt-3 grid md:grid-cols-2 gap-3 text-sm text-zinc-800">
            <li className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3">
              • Un **diagnóstico claro** de tu madurez digital, por práctica real.
            </li>
            <li className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3">
              • **ROI estimado** con payback y ROI acumulado a 24/36 meses.
            </li>
            <li className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3">
              • **Recomendaciones accionables** (operación vs insumos) con foco semanal.
            </li>
            <li className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3">
              • Base para implementar **herramientas concretas** (no promesas vagas).
            </li>
          </ul>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/diagnostico-digital"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium"
            >
              Empezar por la encuesta
            </Link>
            <Link
              to="/calculadora-roi"
              className="border px-5 py-2 rounded-lg font-medium hover:bg-zinc-50"
            >
              Estimar mi ROI
            </Link>
          </div>
        </section>

        {/* PARA QUIÉN ES */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-emerald-800">¿Para quién es?</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Chip>Productores con real interés de digitalizarse y adaptarse a la realidad actual</Chip>
            <Chip>Equipos con fricción operativa</Chip>
            <Chip>Compra de insumos descentralizada</Chip>
            <Chip>Datos dispersos que no generan valor</Chip>
            <Chip>Falta de planificación en la temporada</Chip>
            <Chip>Necesidad de visibilidad de información en tiempo y forma</Chip>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-8 grid md:grid-cols-2 gap-4">
          <Faq
            q="¿Esto reemplaza la asesoría?"
            a="No. El Camino ordena y da foco. La asesoría entra a implementar y sostener el cambio en terreno."
          />
          <Faq
            q="¿De dónde salen los números?"
            a="De costos/ingresos por cultivo (BData + fuentes públicas) y supuestos claros ajustables por ti."
          />
          <Faq
            q="¿Y si ya tengo sistemas?"
            a="Mejor. El objetivo es alinear registro→costos→decisión. Si ya tienes algo, integramos y priorizamos capturas rápidas."
          />
          <Faq
            q="¿Cuándo aparece el Diagnóstico IA?"
            a="Después de la encuesta + ROI. La IA toma tu contexto y sugiere acciones prácticas. Primero criterio, después herramienta."
          />
        </section>

        {/* CTA FINAL */}
        <section className="mt-10 text-center">
          <h3 className="text-lg font-semibold text-emerald-800">
            Partimos en 5 minutos y sin humo
          </h3>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <Link
              to="/encuesta-digitalizacion"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium"
            >
              🚜 Hacer encuesta ahora
            </Link>
            <Link
              to="/calculadora-roi"
              className="border px-5 py-2 rounded-lg font-medium hover:bg-zinc-50"
            >
              💰 Ver mi ROI estimado
            </Link>
            <a
              href={`https://wa.me/56944645774?text=${encodeURIComponent(
                "Quiero iniciar el Camino Digital y revisar encuesta/ROI con ustedes."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium"
            >
              💬 Prefiero WhatsApp
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ——— Componentes UI simples ——— */
function Card({ n, title, badge, text, ctaLabel, to, disabled }) {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs inline-flex px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-800">
          {badge}
        </div>
        <div className="text-emerald-700 font-bold">{n}</div>
      </div>
      <h3 className="mt-2 font-semibold text-emerald-900">{title}</h3>
      <p className="mt-1 text-sm text-zinc-700">{text}</p>
      <div className="mt-3">
        {disabled ? (
          <button
            disabled
            className="px-4 py-2 rounded-lg border text-sm opacity-60 cursor-not-allowed"
            title="Disponible después de completar encuesta/ROI"
          >
            {ctaLabel}
          </button>
        ) : (
          <Link
            to={to}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white border text-zinc-700">
      {children}
    </span>
  );
}

function Faq({ q, a }) {
  return (
    <div className="bg-white border rounded-2xl p-5">
      <div className="font-medium text-emerald-900">{q}</div>
      <div className="text-sm text-zinc-700 mt-1">{a}</div>
    </div>
  );
}
