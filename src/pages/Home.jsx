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
      <div
        className="relative text-white py-16 md:py-20 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0c6b42 0%, #128750 45%, #1a9856 100%)" }}
      >
        {/* textura orgánica sutil (no intercepta clics y queda atrás) */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none -z-10"
          preserveAspectRatio="none"
          viewBox="0 0 400 400"
        >
          <path d="M0 350 Q100 300 200 350 T400 350 V400 H0 Z" fill="white" />
          <path d="M0 300 Q100 250 200 300 T400 300 V400 H0 Z" fill="white" opacity="0.35" />
          <path d="M0 250 Q120 210 200 260 T400 250 V400 H0 Z" fill="white" opacity="0.25" />
        </svg>

        <div className="container-bd text-center relative z-10">
          {/* Título con doble halo */}
          <div className="relative inline-block mb-5">
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-30 scale-150 pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)" }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-20 scale-150 pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(38,162,105,0.9) 0%, rgba(38,162,105,0) 70%)" }}
              aria-hidden="true"
            />
            <h1 className="relative text-5xl md:text-7xl font-extrabold tracking-tight">
              Digitalizamos el campo Chileno
            </h1>
          </div>

          {/* Subtítulo (jerarquía mayor) */}
          <p className="text-2xl md:text-3xl opacity-95 max-w-4xl mx-auto leading-relaxed">
            Te acompañamos <span className="font-semibold text-white/95">en terreno</span> para que tu campo gane
            <span className="font-semibold text-white/95"> eficiencia</span>, <span className="font-semibold text-white/95">orden</span> y
            <span className="font-semibold text-white/95"> datos útiles</span> — sin enredos ni herramientas innecesarias.
          </p>

          {/* Mini-promesa */}
          <p className="mt-3 text-lg md:text-xl opacity-90 font-medium">
            Diagnóstico real, mejoras simples y <span className="font-semibold text-white/95">retorno medible</span>.
          </p>

          {/* Píldoras visuales */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-white/30">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 17h18M3 13h18M3 9h18M4 5h16" strokeWidth="2"/></svg>
              <span>Trabajo en terreno</span>
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-white/30">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 12l6 6L20 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>Mejoras simples</span>
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-white/30">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 12a8 8 0 1016 0" strokeWidth="2"/><path d="M12 8v8M12 8l-3 3M12 8l3 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>Retorno medible</span>
            </span>
          </div>

          {/* Flecha + texto cálido + CTA */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex justify-center">
              <svg className="w-6 h-6 text-white/90 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <p className="text-white/90 text-sm max-w-lg leading-relaxed text-center">
              Tu campo tiene su propio ritmo y realidad. Nosotros te ayudamos a dar el próximo paso correcto —sin enredos, y con foco en lo que realmente importa: que funcione en terreno.
            </p>

            <div className="mt-6 flex justify-center">
              <Link
                to="/camino-digital"
                className="px-7 py-3.5 rounded-xl bg-white text-emerald-700 font-semibold shadow-sm hover:shadow-lg hover:bg-white/90 transition focus:outline-none focus:ring-2 focus:ring-white/60"
              >
                Descubre tu Camino Digital
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* separador sutil */}
      <SectionDivider variant="white-to-mint" className="h-4 md:h-6" />

      {/* METODOLOGÍA */}
      <section id="metodologia" className="bg-emerald-50 scroll-mt-28 md:scroll-mt-32">
        <div className="container-bd py-8 md:py-8">
          <EnfoqueEstrategico />
        </div>
      </section>
      <SectionDivider variant="mint-to-white" className="h-4 md:h-6" />

      {/* ¿POR QUÉ BDATA? */}
      <section id="porque" className="bg-white scroll-mt-28 md:scroll-mt-32">
        <Section compact title="¿Por qué BData?" subtitle="Consultoría tecnológica agrícola hecha en Chile, con los pies en la tierra y la mirada en los datos.">
          <div className="grid md:grid-cols-1 lg:grid-cols-5 gap-4">
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
    </div>
  );
}
