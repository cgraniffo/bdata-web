import EnfoqueEstrategico from "../EnfoqueEstrategico.jsx";
import Section from "../components/Section.jsx";
import CaseCard from "../components/CaseCard.jsx";
import { cases } from "../data/cases.js";
import { Link } from "react-router-dom";
import SectionDivider from "../components/SectionDivider.jsx";
import { Users, Sprout, Network, BarChart3, Workflow, CheckCircle2, TrendingUp, ShieldCheck, Key, GraduationCap, FileSpreadsheet, Smartphone, LayoutDashboard, Settings2, Handshake } from "lucide-react";

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

          <p className="text-2xl md:text-3xl opacity-95 max-w-4xl mx-auto leading-relaxed">
            Te acompañamos <span className="font-semibold text-white/95">en terreno</span> para que tu campo gane
            <span className="font-semibold text-white/95"> eficiencia</span>,{" "}
            <span className="font-semibold text-white/95">orden</span> y
            <span className="font-semibold text-white/95"> datos útiles</span> — sin enredos ni herramientas innecesarias.
          </p>

          <p className="mt-3 text-lg md:text-xl opacity-90 font-medium">
            Diagnóstico real, mejoras simples y <span className="font-semibold text-white/95">retorno medible</span>.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-white/30">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 17h18M3 13h18M3 9h18M4 5h16" strokeWidth="2" />
              </svg>
              <span>Trabajo en terreno</span>
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-white/30">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 12l6 6L20 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Mejoras simples</span>
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-white/30">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 12a8 8 0 1016 0" strokeWidth="2" />
                <path
                  d="M12 8v8M12 8l-3 3M12 8l3 3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Retorno medible</span>
            </span>
          </div>

          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex justify-center">
              <svg
                className="w-6 h-6 text-white/90 animate-bounce"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <p className="text-white/90 text-sm max-w-lg leading-relaxed text-center">
              Tu campo tiene su propio ritmo y realidad. Nosotros te ayudamos a dar el próximo paso correcto, sin enredos,
              y con foco en lo que realmente importa: que funcione en terreno y que siembre la digitalización de tu campo.
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

      <SectionDivider variant="white-to-mint" className="h-4 md:h-6" />

      {/* METODOLOGÍA */}
      <section id="metodologia" className="bg-emerald-50 scroll-mt-28 md:scroll-mt-32">
        <div className="container-bd py-8 md:py-8">
          <EnfoqueEstrategico />
        </div>
      </section>

      <SectionDivider variant="mint-to-white" className="h-4 md:h-6" />

      {/* ¿POR QUÉ BDATA? */}
      <section
        id="porque"
        className="bg-white scroll-mt-28 md:scroll-mt-32"
      >
        <Section
          compact
          title="¿Por qué BData?"
          subtitle="Consultoría tecnológica agrícola hecha en Chile, con los pies en la tierra y la mirada en los datos."
        >
          <div className="grid md:grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="card">
              <h3 className="font-semibold text-lg mb-2">🤝 Trabajamos contigo, no te dejamos solo</h3>
              <p className="text-zinc-600 text-sm">
                Nos metemos en el campo, entendemos tu forma de trabajar y definimos juntos dónde la tecnología realmente
                aporta. No vendemos “la herramienta de moda”, somos parte de tu equipo.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold text-lg mb-2">🌾 Conocemos el agro</h3>
              <p className="text-zinc-600 text-sm">
                Hablamos tu idioma porque venimos del campo. Sabemos lo que es una helada, una cosecha apurada o una
                temporada mala.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold text-lg mb-2">⚙️ Implementamos rápido, sin enredar</h3>
              <p className="text-zinc-600 text-sm">
                Usamos herramientas simples y de rápida adopción —AppSheet, Make y otras— sólo cuando son necesarias
                (y evitamos las palabras raras 😁).
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold text-lg mb-2">🧠 IA sólo cuando tiene sentido</h3>
              <p className="text-zinc-600 text-sm">
                No todo se soluciona con IA. Muchas veces basta eliminar, delegar o automatizar bien; o mejorar cómo usas
                los datos.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold text-lg mb-2">📊 Medimos todo</h3>
              <p className="text-zinc-600 text-sm">
                Cada proyecto parte con métricas claras y termina con resultados comprobables. Si no genera valor, no se
                implementa. El ROI guía nuestras decisiones.
              </p>
            </div>
          </div>
        </Section>
      </section>

 {/* PLANES BDATA */}
      <section id="planes" className="container-bd my-16 scroll-mt-28 md:scroll-mt-32">
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Planes BData... Elige el control que necesitas
          </h2>
          <p className="mt-3 text-lg text-slate-600 max-w-3xl">
            Desde la autonomía de una herramienta potente hasta la tranquilidad de un socio estratégico.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          
          {/* PLAN PARTNER (Pag 6 PDF) - DESTACADO */}
          <article className="group relative overflow-hidden rounded-3xl border-2 border-emerald-500 bg-white shadow-xl transform md:scale-[1.02] z-10 transition-all hover:shadow-2xl">
            
            {/* Badge Recomendado */}
            <div className="absolute top-0 right-0 z-20 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider shadow-sm">
              Recomendado
            </div>

            <div className="grid md:grid-cols-2">
              {/* Lado Izquierdo: Texto */}
              <div className="p-8 order-2 md:order-1 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-emerald-800 text-xs font-bold uppercase tracking-wide w-fit">
                  <Handshake className="w-3.5 h-3.5" /> ¡NUEVO! Gestión Garantizada
                </div>
                
                <h3 className="mt-4 text-3xl font-bold text-slate-900">Gerencia de Control de Gestión Externa</h3>
                <p className="mt-2 text-emerald-700 font-medium">
                  Nosotros nos aseguramos de que tu administración funcione.
                </p>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                  Sustituimos el costo fijo de una gerencia interna por un servicio experto que se paga solo. Digitalizamos la operación y auditamos para detectar fugas de dinero (caja, inventarios, cobros duplicados).
                </p>

                {/* Precios Partner */}
                <div className="mt-6 flex flex-wrap gap-4 items-end border-t border-slate-100 pt-6">
                  <div className="relative">
                     <span className="absolute -top-3 left-0 text-[10px] bg-red-100 text-red-600 px-1.5 rounded-md font-bold border border-red-200">SUBSIDIADO</span>
                    <span className="text-xs text-slate-500 font-bold uppercase block">Habilitación</span>
                    <span className="text-2xl font-bold text-emerald-600">5 UF</span>
                  </div>
                  <div className="h-8 w-px bg-slate-200"></div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold uppercase block">Mensualidad</span>
                    <span className="text-xl md:text-2xl font-bold text-slate-900">1 Sueldo Mínimo</span>
                    <span className="text-xs text-slate-400 ml-1">/ mes</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-sm text-slate-700"><strong>Todo lo del Plan Autonomía +</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-sm text-slate-700"><strong>Ahorra 90%</strong> vs. Gerencia Interna.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-sm text-slate-700"><strong>Reunión Mensual de Control:</strong> Análisis de resultados contigo.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Settings2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-sm text-slate-700"><strong>Personalización:</strong> Centros de costos a medida.</span>
                  </li>
                </ul>

                <div className="mt-8">
                  <a href="https://wa.me/56944645774?text=Hola%20BData,%20quiero%20el%20Plan%20Partner." 
                     className="block w-full rounded-xl bg-emerald-600 py-3 text-center font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition transform hover:-translate-y-0.5">
                    Quiero ser Partner
                  </a>
                </div>
              </div>

              {/* Lado Derecho: IMAGEN PARTNER */}
              <div className="relative order-1 md:order-2 min-h-[300px] md:min-h-full">
                {/* 1. La Imagen de Fondo */}
                <img 
                  src="/images/siembra-appsheet.png" /* ⚠️ CAMBIA ESTO POR TU FOTO DE CAMPO/REUNION */
                  alt="Reunión en terreno BData" 
                  className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
                
                {/* 2. Capa oscura para que resalte el texto (Overlay) */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/20 to-transparent"></div>

                {/* 3. Tarjeta Flotante (Glassmorphism) */}
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20 flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                             <TrendingUp className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="font-bold text-emerald-900 leading-tight">Control Total</p>
                            <p className="text-xs text-emerald-700 mt-0.5">Tu Socio Estratégico en Terreno</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </article>


          {/* PLAN AUTONOMÍA (Pag 5 PDF) */}
          <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl">
            <div className="grid md:grid-cols-2">
              
              {/* Lado Izquierdo: Texto */}
              <div className="p-8 order-2 md:order-1 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700 text-xs font-bold uppercase tracking-wide w-fit">
                  <Smartphone className="w-3.5 h-3.5" /> Para Equipos Consolidados
                </div>
                
                <h3 className="mt-4 text-3xl font-bold text-slate-900">Plan Autonomía</h3>
                <p className="mt-2 text-slate-600 font-medium">
                  Tu equipo opera, nosotros ponemos la tecnología.
                </p>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  Ideal si ya tienes un administrador proactivo. Te entregamos la herramienta completa para carga de XML ilimitada, conciliación y control.
                </p>

                {/* Precios Autonomía */}
                <div className="mt-6 flex flex-wrap gap-4 items-end border-t border-slate-100 pt-6">
                  <div>
                    <span className="text-xs text-slate-500 font-bold uppercase block">Habilitación</span>
                    <span className="text-2xl font-bold text-slate-900">15 UF</span>
                    <span className="text-xs text-slate-400 ml-1">(Pago Único)</span>
                  </div>
                  <div className="h-8 w-px bg-slate-200"></div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold uppercase block">Mensualidad</span>
                    <span className="text-2xl font-bold text-slate-900">2 UF</span>
                    <span className="text-xs text-slate-400 ml-1">/ mes</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-3">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-sm text-slate-700"><strong>Carga XML Ilimitada:</strong> Automatiza tus compras.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <LayoutDashboard className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-sm text-slate-700"><strong>Dashboards Estándar:</strong> Control visual inmediato.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-sm text-slate-700">Acceso App Web y Móvil completo.</span>
                  </li>
                </ul>

                <div className="mt-8">
                  <a href="https://wa.me/56944645774?text=Hola%20BData,%20me%20interesa%20el%20Plan%20Autonom%C3%ADa." 
                     className="block w-full rounded-xl border-2 border-slate-900 py-3 text-center font-bold text-slate-900 hover:bg-slate-50 transition">
                    Elegir Autonomía
                  </a>
                </div>
              </div>

              {/* Lado Derecho: IMAGEN AUTONOMIA */}
              <div className="relative order-1 md:order-2 min-h-[300px] md:min-h-full">
                 {/* 1. La Imagen de Fondo */}
                 <img 
                  src="/images/Whisk_8077ae17360c055bfe249d154992a6bbeg.png" /* ⚠️ CAMBIA ESTO POR UN PANTALLAZO DE LA APP */
                  alt="App BData en celular" 
                  className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />

                {/* 2. Capa oscura (Overlay) */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent"></div>

                {/* 3. Tarjeta Flotante */}
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20 flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                             <Settings2 className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 leading-tight">Herramienta Pura</p>
                            <p className="text-xs text-slate-600 mt-0.5">Gestión por tu cuenta</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>   

      {/* CASOS */}
      <section id="casos" className="bg-emerald-50 scroll-mt-28 md:scroll-mt-32">
        <Section
          compact
          title="Casos de éxito destacados"
          subtitle="Resultados medibles, trazabilidad real y ahorro en CLP comprobado."
        >
          <div className="grid md:grid-cols-3 gap-6">
            {destacados.map(item => (
              <CaseCard key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center mt-6 space-y-1">
            <Link
              to="/planes"
              className="text-green-700 font-semibold underline hover:text-green-800 block"
            >
              Ver todos los planes BData →
            </Link>
            <p className="text-xs text-zinc-500">
              Descubre cuál se adapta mejor al tamaño y madurez digital de tu campo.
            </p>
          </div>
        </Section>
      </section>

      <SectionDivider variant="mint-to-white" className="h-4 md:h-6" />
    </div>
  );
}
