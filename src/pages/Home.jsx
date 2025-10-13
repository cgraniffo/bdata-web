import EnfoqueEstrategico from "../EnfoqueEstrategico.jsx";
import Section from "../components/Section.jsx";
import CaseCard from "../components/CaseCard.jsx";
import { cases } from "../data/cases.js";
import { Link } from "react-router-dom";
import SectionDivider from "../components/SectionDivider.jsx";

export default function Home() {
  const PLAN_ORDER = [
    { key: "agro",    alias: ["agro", "agro digital", "plan agro digital", "agrodigital"] },
    { key: "semilla", alias: ["semilla", "plan semilla"] },
    { key: "red",     alias: ["red", "red de profesionales", "profesionales"] },
  ];
  const norm = (s = "") => s.toString().toLowerCase().replace(/\s+/g, " ").trim();
  const destacados = PLAN_ORDER
    .map(p => cases.find(c => p.alias.some(a => norm(c.plan ?? c.planName ?? c.category ?? "").includes(norm(a)))) || null)
    .filter(Boolean);
  const faltantes = cases.filter(c => !destacados.includes(c));
  while (destacados.length < 3 && faltantes.length) destacados.push(faltantes.shift());

  return (
    <div className="bg-white">
      {/* HERO */}
      <div className="relative bg-green-700 text-white py-16 md:py-20">
        <div className="container-bd text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-2">
            Digitalizamos el campo Chileno<br />
            <br />
          </h1>

          <p className="text-lg md:text-xl opacity-90 max-w-6xl mx-auto mb-4 leading-relaxed">
            Somos tu aliado en la digitalización de <strong> tu campo </strong>🌾,<br /> ayudamos a agricultores de todos los tamaños a <strong>gestionar mejor con datos, no con promesas.</strong><br />
            <br />            
          </p>



          <div className="mt-6">
            <Link
              to="/calculadora-roi"
              className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors shadow-lg"
            >
              Calcular tu ROI por trabajar con nosotros
            </Link>
          </div>

          <p className="text-sm mt-6 opacity-80 max-w-xxl mx-auto">
            ¿Sabías que el ROI es el <em>Retorno sobre la Inversión</em> y sirve para saber objetivamente (en $ y %) cuánto inviertes y cuánto ganas gracias a la implementación de nuestra metodología?<br />
            Usamos <strong>ROI (Retorno sobre la Inversión)</strong> en todos nuestros proyectos,
            medimos 
            cuánto ganas con la mejora digital respecto a lo que invertiste.<br />
            <strong>Simple: si no genera retorno, no lo implementamos</strong>.<br />
            <br />
          </p>

        </div>
      </div>

      {/* separador sutil */}
      <SectionDivider variant="white-to-mint" className="h-4 md:h-" />

      {/* METODOLOGÍA */}
      <section id="metodologia" className="bg-emerald-50 scroll-mt-28 md:scroll-mt-32">
        <div className="container-bd py-8 md:py-8">
          <EnfoqueEstrategico />
        </div>
      </section>

      <SectionDivider variant="mint-to-white" className="h-4 md:h-6" />

      {/* PLANES */}
      <section id="planes" className="bg-white scroll-mt-28 md:scroll-mt-32">
        <Section
          compact
          title="Planes BData: soluciones a tu medida"
          subtitle={
            <>Cada agricultor tiene un punto de partida distinto. Nuestros planes se adaptan a tu nivel de digitalización,
            el tamaño de tu campo y tus metas productivas. Todos comparten algo en común:
            <strong> acompañamiento, métricas y retorno real.</strong></>
          }
        >
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {/* Plan Semilla */}
            <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 hover:shadow-md transition-all">
              <h3 className="text-xl font-semibold text-emerald-800 mb-2">🌱 Plan Semilla</h3>
              <p className="text-zinc-700 text-sm mb-3">
                Para productores que recién comienzan la transformación digital. Implementaciones simples, acompañadas
                y medibles desde el primer mes.
              </p>
              <ul className="text-sm text-zinc-600 list-disc list-inside mb-4">
                <li><strong>Recomendado para:</strong> pequeños agricultores o cooperativas en etapa inicial.</li>
              </ul>
              <div className="text-right">
                <Link to="/plan-semilla" className="text-emerald-700 font-semibold text-sm hover:underline">Ver más →</Link>
              </div>
            </div>

            {/* Plan Agro Digital */}
            <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 hover:shadow-md transition-all">
              <h3 className="text-xl font-semibold text-emerald-800 mb-2">🚜 Plan Agro Digital</h3>
              <p className="text-zinc-700 text-sm mb-3">
                Para campos en crecimiento que buscan optimizar la gestión diaria. Automatizaciones, reportería y control
                de costos en tiempo real, sin desarrollo complejo.
              </p>
              <ul className="text-sm text-zinc-600 list-disc list-inside mb-4">
                <li><strong>Recomendado para:</strong> medianos productores con equipos de trabajo en terreno.</li>
              </ul>
              <div className="text-right">
                <Link to="/plan-agro-digital" className="text-emerald-700 font-semibold text-sm hover:underline">Ver más →</Link>
              </div>
            </div>

            {/* Red de Profesionales */}
            <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 hover:shadow-md transition-all">
              <h3 className="text-xl font-semibold text-emerald-800 mb-2">🤝 Red de Profesionales</h3>
              <p className="text-zinc-700 text-sm mb-3">
                Acceso a un equipo multidisciplinario de expertos en agro, datos y gestión. Ideal para proyectos que
                requieren soporte técnico continuo o análisis avanzado.
              </p>
              <ul className="text-sm text-zinc-600 list-disc list-inside mb-4">
                <li><strong>Recomendado para:</strong> empresas agrícolas o cooperativas que buscan asesoría continua y ROI sostenible.</li>
              </ul>
              <div className="text-right">
                <Link to="/red-de-profesionales" className="text-emerald-700 font-semibold text-sm hover:underline">Ver más →</Link>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/planes"
              className="inline-block bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-emerald-800 transition-all shadow-sm"
            >
              Ver todos los planes BData
            </Link>
          </div>
        </Section>
      </section>

      <SectionDivider variant="white-to-mint" className="h-4 md:h-6" />

      {/* CASOS */}
      <section id="casos" className="bg-emerald-50 scroll-mt-28 md:scroll-mt-32">
        <Section compact title="Casos de éxito destacados" subtitle="Resultados medibles, trazabilidad real y ahorro en CLP comprobado.">
          <div className="grid md:grid-cols-3 gap-6">
            {destacados.map(item => <CaseCard key={item.id} item={item} />)}
          </div>

          <div className="text-center mt-6 space-y-1">
            <Link to="/planes" className="text-green-700 font-semibold underline hover:text-green-800 block">
              Ver todos los planes BData →
            </Link>
            <p className="text-xs text-zinc-500">Descubre cuál se adapta mejor al tamaño y madurez digital de tu campo.</p>
          </div>
        </Section>
      </section>

      <SectionDivider variant="mint-to-white" className="h-4 md:h-6" />

      {/* ¿POR QUÉ BDATA? */}
      <section id="porque" className="bg-white scroll-mt-28 md:scroll-mt-32">
        <Section compact title="¿Por qué BData?" subtitle="Consultoría tecnológica agrícola hecha en Chile, con los pies en la tierra y la mirada en los datos.">
          <div className="grid md:grid-cols-1 lg:grid-cols-5 gap-4">
            {/* 5 tarjetas */}
            <div className="card">
              <h3 className="font-semibold text-lg mb-2">🤝 Trabajamos contigo, no te dejamos solo</h3>
              <p className="text-zinc-600 text-sm">Nos metemos en el campo, entendemos tu forma de trabajar y definimos juntos dónde la tecnología realmente aporta. No vendemos “la herramienta de moda”, somos parte de tu equipo.</p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-lg mb-2">🧠 IA sólo cuando tiene sentido</h3>
              <p className="text-zinc-600 text-sm">No todo se soluciona con IA. Muchas veces basta eliminar, delegar o automatizar bien; o mejorar cómo usas los datos.</p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-lg mb-2">🌾 Conocemos el agro</h3>
              <p className="text-zinc-600 text-sm">Hablamos tu idioma porque venimos del campo. Sabemos lo que es una helada, una cosecha apurada o una temporada mala.</p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-lg mb-2">⚙️ Implementamos rápido, sin enredar</h3>
              <p className="text-zinc-600 text-sm">Usamos herramientas simples y de rápida adopción —AppSheet, Make y otras— sólo cuando son necesarias (y evitamos las palabras raras 😁).</p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-lg mb-2">📊 Medimos todo</h3>
              <p className="text-zinc-600 text-sm">Cada proyecto parte con métricas claras y termina con resultados comprobables. Si no genera valor, no se implementa. El ROI guía nuestras decisiones.</p>
            </div>
          </div>
        </Section>
      </section>
    </div>
  );
}
