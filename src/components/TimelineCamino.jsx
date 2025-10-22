import { Link } from "react-router-dom";

function Paso({ num, title, desc, badge }) {
  return (
    <div className="relative flex-1 min-w-[220px]">
      {/* número en círculo con borde fino */}
      <div className="mx-auto w-10 h-10 rounded-full bg-white ring-2 ring-emerald-600 text-emerald-700 grid place-items-center font-semibold">
        {num}
      </div>

      <div className="mt-3 text-center px-3">
        {badge && (
          <div className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 mb-2">
            {badge}
          </div>
        )}
        <h3 className="font-semibold text-emerald-900">{title}</h3>
        <p className="text-sm text-zinc-600 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default function TimelineCamino() {
  return (
    <section className="container-bd py-10">
      {/* encabezado */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-2xl font-bold text-emerald-900">
          ¿Cómo lo hacemos? Nos adaptamos a la forma de trabajar de tu campo y vamos paso a paso.
        </h2>
        <p className="text-zinc-600 mt-1">
          <span className="font-medium text-emerald-700">Avanzamos contigo</span> — sin humo, con señales claras de progreso.
        </p>
      </div>

      {/* línea continua */}
      <div className="relative">
        <div className="hidden md:block absolute inset-x-0 top-5 h-[2px] bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-200" />
        <div className="flex flex-col md:flex-row items-stretch gap-8 md:gap-12">
          <Paso
            num="1"
            badge="Encuesta (3 a 5 min)"
            title="Mide tu punto de partida"
            desc="Evaluamos operación, registros, coordinación y uso de datos. Cero palabreo: señales de madurez y brechas accionables."
          />
          <Paso
            num="2"
            badge="Calculadora ROI (3 a 5 min)"
            title="Estimamos el impacto"
            desc="Simulamos ahorros y mejoras en CLP: payback y ROI acumulado con datos BData y supuestos transparentes."
          />
          <Paso
            num="3"
            badge="Diagnóstico + Plan (Variable según evaluación)"
            title="Bajamos a acciones e implementamos"
            desc="Bitácoras claras, KPIs semanales y compras. Empezamos simple y crecemos según tu realidad."
          />
        </div>
      </div>

      <p className="text-center text-xs text-zinc-500 mt-6">
        ¡Importante! No todos los campos llegan al paso 3 el primer día. Avanzamos al ritmo de tu equipo y tu temporada,¡Tu eres el protagonista del cambio, nosotros ponemos la pala y la picota!.
      </p>

      <div className="mt-6 flex justify-center">
        <Link
          to="/diagnostico-digital"  /* ajusta si usas otra ruta */
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 text-white font-semibold shadow-sm hover:bg-emerald-800 transition"
        >
          Empezar el camino
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="opacity-90">
            <path d="M5 12h14M13 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
