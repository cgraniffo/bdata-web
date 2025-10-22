// src/pages/AutoDiagnostico.jsx
import { useMemo, useRef, useState } from "react";

/** ====== BRAND / ESTILOS ====== **/
const BRAND = {
  name: "BDATA",
  logoSrc: "/images/Logo_Final_Transparente.png", // deja tu logo en /public/images/
  colorPrimary: "#26a269",
  colorInk: "#0f172a",
  colorMuted: "#475569",
  colorCard: "#ffffff",
  colorBg: "#f8fafc",
};

/** ====== NIVELES (4) ====== **/
const NIVELES = [
  { id: "inicial",    label: "Inicial",    min: 0,  max: 40,       pill: "bg-violet-50 text-violet-700 ring-violet-300" },
  { id: "basico",     label: "Básico",     min: 40, max: 70,       pill: "bg-amber-50  text-amber-700  ring-amber-300" },
  { id: "intermedio", label: "Intermedio", min: 70, max: 90,       pill: "bg-emerald-50 text-emerald-700 ring-emerald-300" },
  { id: "avanzado",   label: "Avanzado",   min: 90, max: 100.001,  pill: "bg-sky-50 text-sky-700 ring-sky-300" },
];

const MENSAJES = {
  inicial: "Estás dando los primeros pasos. Parte por ordenar registros básicos, definir presupuesto y asegurar conectividad mínima.",
  basico: "Ya tienes base. Siguiente salto: centralizar la información y automatizar reportes simples.",
  intermedio: "Buen avance. Es momento de integrar sensores/IoT y automatizar riego/alertas, conectando sistemas.",
  avanzado: "Excelente nivel. Puedes ir por analítica avanzada, modelos predictivos y orquestación end-to-end.",
};

/** ====== Íconos mini (SVG inline, livianos) ====== **/
const Icon = {
  plan:   (props)=>(<svg {...props} viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h10M4 17h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>),
  tool:   (props)=>(<svg {...props} viewBox="0 0 24 24" fill="none"><path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4-6.5 4 2-7L2 9h7l3-7z" stroke="currentColor" strokeWidth="1.6" fill="none"/></svg>),
  net:    (props)=>(<svg {...props} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" stroke="currentColor" strokeWidth="1.5"/></svg>),
  data:   (props)=>(<svg {...props} viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 12v4M12 8v8M17 10v6" stroke="currentColor" strokeWidth="2"/></svg>),
  heart:  (props)=>(<svg {...props} viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.35-9-8.5C1.4 9 3.5 6 6.5 6 8.24 6 9.5 7 12 9c2.5-2 3.76-3 5.5-3 3 0 5.1 3 3.5 6.5C19 16.65 12 21 12 21z" stroke="currentColor" strokeWidth="1.8" fill="none"/></svg>)
};
const fieldBase =
  "mt-1 w-full rounded-xl border px-3 py-2 bg-white " +
  "focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900";

/** ====== SECCIONES + PREGUNTAS (1 = muy bajo, 5 = muy alto) ====== **/
const SECCIONES = [
  {
    id: "gestion",
    icon: "plan",
    titulo: "1.-Gestión y planificación",
    preguntas: [
      "Planifica la temporada antes de iniciarla.",
      "Cuenta con un presupuesto definido para la temporada.",
      "Centraliza la información en un sistema único.",
      "Usa reportes o dashboards automáticos para revisar datos.",
      "Confía en la calidad de los datos que utiliza para decidir.",
    ],
  },
  {
    id: "herramientas",
    icon: "tool",
    titulo: "2.-Tecnologías y herramientas",
    preguntas: [
      "Utiliza software agrícola o de gestión del campo.",
      "Registra las labores del campo en un sistema o app (no solo papel).",
      "Comparte información digitalmente con asesor o administración.",
      "Automatiza tareas (riego, informes, alertas, etc.).",
      "Le resulta fácil aprender y adoptar nuevas herramientas.",
    ],
  },
  {
    id: "conectividad",
    icon: "net",
    titulo: "3.-Conectividad e infraestructura",
    preguntas: [
      "Cuenta con señal de internet en la mayoría de los sectores del campo.",
      "La señal permite usar aplicaciones o enviar datos desde terreno.",
      "El personal en terreno puede usar apps o sistemas directamente.",
      "Los problemas de conexión son raros u ocasionales.",
      "Dispone de dispositivos adecuados (smartphones / tablet / PC).",
    ],
  },
  {
    id: "datos",
    icon: "data",
    titulo: "4.-Uso de datos y automatización",
    preguntas: [
      "Registra datos productivos (rendimientos, costos, aplicaciones, riego, etc.).",
      "Analiza los datos antes de tomar decisiones.",
      "Compara temporadas o lotes para mejorar resultados.",
      "Utiliza sensores / IoT / estaciones meteorológicas.",
      "Recibe alertas o recomendaciones automáticas (clima, plagas, riego, etc.).",
      "La información del campo llega a la oficina durante el mismo día.",
    ],
  },
  {
    id: "adopcion",
    icon: "heart",
    titulo: "5.-Disposición y adopción",
    preguntas: [
      "Existe interés real en incorporar más herramientas digitales.",
      "Se sienten preparados para avanzar en digitalización.",
      "Cuentan con apoyo interno para implementar cambios.",
      "Hay disposición a capacitarse (tiempo y ganas).",
      "El factor resultados/retorno pesa más que el costo al decidir.",
    ],
  },
];

/** ====== Likert mejorado ====== **/
function Likert({ name, value, onChange }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {[1,2,3,4,5].map(v => {
        const active = value===v;
        return (
          <label
            key={v}
            className={`text-center cursor-pointer rounded-xl px-2 py-3 select-none border
              ${active
                ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50"}
            `}
          >
            <input className="hidden" type="radio" name={name} value={v} checked={active} onChange={()=>onChange(v)} />
            <span className="font-semibold">{v}</span>
          </label>
        );
      })}
      <div className="col-span-5 flex justify-between text-xs text-slate-500 mt-1">
        <span>1 = Muy bajo / Nunca</span><span>5 = Muy alto / Siempre</span>
      </div>
    </div>
  );
}

/** ====== Envío a Netlify Functions ====== **/
async function enviarResultadoNetlify(payload) {
  try {
    const res = await fetch('/.netlify/functions/diagnostico-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) console.warn('No se guardó el diagnóstico:', json);
    return json;
  } catch (e) {
    console.warn('Error enviando diagnóstico:', e);
    return { ok: false };
  }
}

/** ====== Componente principal ====== **/
export default function AutoDiagnostico() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [region, setRegion] = useState("");
  const [rubro, setRubro] = useState("");
  const [respuestas, setRespuestas] = useState({}); // key: `${secId}-${idx}` -> 1..5
  const [resultado, setResultado] = useState(null);
   // todas abiertas
  const [guardadoOK, setGuardadoOK] = useState(false);
  const refResultado = useRef(null);
  const [abiertas, setAbiertas] = useState(() => new Set([SECCIONES[0].id]));
  const totalPreguntas = useMemo(
    () => SECCIONES.reduce((acc, s) => acc + s.preguntas.length, 0),
    []
  );
  const telValido = useMemo(() => /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/.test(telefono.trim()), [telefono]);
  const allAnswered = useMemo(() => Object.keys(respuestas).length === totalPreguntas, [respuestas, totalPreguntas]);

  const pctPorSeccion = useMemo(() => {
    const map = {};
    for (const sec of SECCIONES) {
      const vals = sec.preguntas.map((_, i) => respuestas[`${sec.id}-${i}`]).filter(Boolean);
      const s = vals.reduce((a,b)=>a+b,0);
      const pct = Math.round((s / (sec.preguntas.length*5)) * 100 || 0);
      map[sec.id] = { id: sec.id, titulo: sec.titulo, pct };
    }
    return map;
  }, [respuestas]);

  const toggle = (id)=>setAbiertas(prev=>{
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });

  function recomendacionesPorSeccion(pct, id) {
    if (pct >= 50) return null;
    const tip = {
      gestion:     "Parte por presupuesto y reportes básicos mensuales. Un tablero simple ya te ordena decisiones.",
      herramientas:"Formaliza registro en app/sistema y estandariza. Evita papel suelto.",
      conectividad:"Asegura señal en los puntos críticos y define un “lugar con internet” para sincronizar.",
      datos:       "Define qué registrar sí o sí (rendimiento, costos, aplicaciones) y revísalo 1 vez por semana.",
      adopcion:    "Alinea equipo y agenda 1 capacitación breve. Muestra resultados rápidos (ganancias visibles).",
    };
    return tip[id] || "Enfócate en subir esta sección con mejoras simples y medibles.";
  }

  async function calcular() {
    if (!nombre.trim() || !telValido) {
      alert("Para ver el resultado ingrese Nombre y un teléfono válido (+56 9 XXXX XXXX).");
      return;
    }
    if (!allAnswered) {
      alert("Te faltan preguntas por responder.");
      return;
    }

    const suma = Object.values(respuestas).reduce((a,b)=>a+b,0);
    const max = totalPreguntas * 5;
    const pct = (suma / max) * 100;
    const nivel = NIVELES.find(n => pct >= n.min && pct < n.max) ?? NIVELES[NIVELES.length-1];

    const porSeccionArr = Object.values(pctPorSeccion);

    const data = {
      suma, max, pct: Math.round(pct),
      nivel,
      mensaje: MENSAJES[nivel.id],
      porSeccion: porSeccionArr,
    };
    setResultado(data);

    // Guardar (no bloquear UI)
    const payload = {
      nombre, telefono, region, rubro,
      score: suma, max, pct: Math.round(pct),
      nivel: { id: nivel.id, label: nivel.label },
      porSeccion: porSeccionArr,
      respuestas, // si no quieres auditoría, quítalo
    };
    const r = await enviarResultadoNetlify(payload);
    if (r?.ok) { setGuardadoOK(true); setTimeout(()=>setGuardadoOK(false), 2200); }

    setTimeout(() => refResultado.current?.scrollIntoView({behavior:"smooth", block:"start"}), 80);
  }

  function limpiar() {
    setRespuestas({}); setResultado(null);
  }

  // Cálculo para barra de progreso global
  const progresoPct = Math.round((Object.keys(respuestas).length / totalPreguntas) * 100);

  return (
    <div style={{background: BRAND.colorBg}}>
      <style>{`
        .bd-pill { border-radius:9999px; padding:.1rem .6rem; font-weight:700; display:inline-block; border:1px solid rgba(0,0,0,.06) }
        @media print {
          .no-print { display:none !important; }
          .page { box-shadow:none !important; border:0 !important; }
          body { background:white !important; }
        }
        @keyframes fadeIn{from{opacity:0; transform:translateY(4px)} to{opacity:1; transform:none}}
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* ===== Header con degradado y textura ===== */}
        <div
          className="page rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden"
          style={{background: "linear-gradient(180deg,#e8f6ee 0%, #fff 60%)"}}
        >
          <div className="relative p-5 sm:p-7">
            <svg aria-hidden="true" className="absolute -top-10 -right-10 opacity-10 w-[220px] h-[220px]">
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#62c48a" offset="0" />
                  <stop stopColor="#26a269" offset="1" />
                </linearGradient>
              </defs>
              <path fill="url(#g1)" d="M110 0c45 35 85 85 90 135-40 10-95-5-135-45S-5 30 10 5C45-10 80-5 110 0Z"/>
            </svg>

            <div className="flex items-center gap-4 relative z-10">
              <img src={BRAND.logoSrc} alt={`${BRAND.name} logo`} className="w-16 h-16 object-contain" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Paso 1: Auto-diagnóstico de Digitalización Agrícola
                </h1>
                <p className="text-slate-600 mt-1">
                  Queremos conocer cómo estás trabajando hoy en tu campo para poder acompañarte mejor.
                  Esta encuesta es corta y nos ayuda a crear la mejor ruta hacia la digitalización de tu campo.
                </p>
              </div>
            </div>

            {/* Datos productor */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              <div>
                <label className="text-sm text-slate-600">Nombre del productor / contacto<span className="text-rose-500"> *</span></label>
                <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Ej: Juan Pérez"
                      className={`${fieldBase} border-slate-300`}
                      type="text" />
              </div>
              <div>
                <label className="text-sm text-slate-600">Teléfono (+56 9 XXXX XXXX)<span className="text-rose-500"> *</span></label>
                <input value={telefono} onChange={e=>setTelefono(e.target.value)} placeholder="+56 9 1234 5678"
                      className={`${fieldBase} ${telValido ? "border-rose-300" : "border-slate-300"}`}
                      type="tel" />
              </div>
              <div>
                <label className="text-sm text-slate-600">Región</label>
                <select value={region} onChange={e=>setRegion(e.target.value)} className={`${fieldBase} border-slate-300`}>
                  <option value="">Seleccione…</option>
                  {["Arica y Parinacota","Tarapacá","Antofagasta","Atacama","Coquimbo","Valparaíso","Metropolitana","O’Higgins","Maule","Ñuble","Biobío","Araucanía","Los Ríos","Los Lagos","Aysén","Magallanes"].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-600">Rubro principal</label>
                <select value={rubro} onChange={e=>setRubro(e.target.value)} className={`${fieldBase} border-slate-300`}>
                  <option value="">Seleccione…</option>
                  {["Frutales","Hortalizas","Cereales / Granos","Ganadería","Mixto"].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Barra de progreso ===== */}
        <div className="sticky top-[64px] z-40 mt-3">
          <div className="bg-white/80 backdrop-blur-md border rounded-xl p-3 shadow-sm">
            <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
              <span>Progreso</span>
              <span>{Object.keys(respuestas).length} / {totalPreguntas}</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${progresoPct}%`, background: "linear-gradient(90deg,#26a269,#62c48a)" }}
              />
            </div>
          </div>
        </div>

        {/* ===== Secciones colapsables ===== */}
        {SECCIONES.map((sec) => {
          const answered = sec.preguntas.filter((_, i)=> respuestas[`${sec.id}-${i}`]).length;
          const Icono = Icon[sec.icon] || Icon.plan;
          const abierta = abiertas.has(sec.id);

          return (
            <div key={sec.id} className="page mt-5 bg-white rounded-2xl shadow-sm ring-1 ring-emerald-100">
              <button
                onClick={()=>toggle(sec.id)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100">
                    <Icono className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-base sm:text-lg font-semibold text-slate-900">{sec.titulo}</div>
                    <div className="text-xs text-slate-500">{answered}/{sec.preguntas.length} respondidas</div>
                  </div>
                </div>
                <span className="text-slate-500">{abierta ? "▲" : "▼"}</span>
              </button>

              {abierta && (
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-4">
                  {sec.preguntas.map((texto, qIdx) => {
                    const key = `${sec.id}-${qIdx}`;
                    return (
                      <div key={key} className="p-3 rounded-xl ring-1 ring-emerald-100 bg-emerald-50/30">
                        <p className="mb-2 font-medium text-slate-800">{qIdx+1}. {texto}</p>
                        <Likert
                          name={key}
                          value={respuestas[key] ?? 0}
                          onChange={(v)=>setRespuestas(prev=>({...prev, [key]: v}))}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* ===== Acciones + Resultado ===== */}
        <div className="page mt-5 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 sm:p-7">
          <div className="flex flex-wrap gap-3 no-print">
            <button
              onClick={calcular}
              className="px-5 py-2.5 rounded-xl text-white shadow-sm hover:shadow transition"
              style={{background: "linear-gradient(90deg,#26a269,#62c48a)"}}
            >
              Calcular resultado
            </button>
            <button onClick={limpiar} className="px-5 py-2.5 rounded-xl ring-1 ring-slate-300 hover:bg-slate-50">
              Limpiar
            </button>
            <button onClick={() => window.print()} className="px-5 py-2.5 rounded-xl ring-1 ring-slate-300 hover:bg-slate-50">
              Imprimir / Guardar PDF
            </button>
          </div>

          {resultado && (
            <div ref={refResultado} className="mt-5 animate-[fadeIn_.4s_ease]">
              <h3 className="text-xl font-bold text-slate-800 mb-1">Resultado del auto-diagnóstico</h3>
              <p className="text-slate-700">
                Puntaje: <strong>{resultado.suma}</strong> de {resultado.max} ({resultado.pct}%)
              </p>
              <p className="mt-1">
                Nivel:{" "}
                <span className={`bd-pill ring ${resultado.nivel.pill}`}>
                  {resultado.nivel.label}
                </span>
              </p>

              {/* Barra de nivel */}
              <div className="mt-3">
                <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{ width: `${resultado.pct}%`, background: "linear-gradient(90deg,#26a269,#62c48a)" }}
                  />
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {resultado.nivel.id !== "avanzado"
                    ? `Te faltan ${Math.max(0, Math.ceil(((NIVELES.find(n=>n.id==="avanzado").min) - resultado.pct)))} puntos para llegar a Avanzado.`
                    : "¡Felicitaciones! Estás en el nivel más alto."}
                </div>
              </div>

              <p className="mt-3 text-slate-700">{resultado.mensaje}</p>

              {/* Resumen por sección + recomendaciones */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {resultado.porSeccion.map((s) => (
                  <div key={s.titulo} className="p-3 rounded-xl ring-1 ring-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{s.titulo}</span>
                      <span className="text-slate-700">{s.pct}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full"
                        style={{ width: `${s.pct}%`, background: s.pct >= 50 ? "#26a269" : "#f59e0b" }}
                      />
                    </div>
                    {s.pct < 50 && (
                      <p className="text-xs text-amber-700 mt-2">
                        Sugerencia: {recomendacionesPorSeccion(s.pct, s.id)}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* CTA contacto */}
              <div className="mt-5 p-4 rounded-xl ring-1 ring-slate-200 bg-slate-50">
                <p className="text-slate-700">
                  ¿Quiere recibir recomendaciones para su campo? Escríbanos:
                </p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <a href="mailto:christian@bdata.cl" className="px-3 py-2 rounded-lg text-white"
                    style={{background: BRAND.colorPrimary}}>christian@bdata.cl</a>
                  <a href="https://wa.me/56944645774" target="_blank" rel="noreferrer"
                    className="px-3 py-2 rounded-lg ring-1 ring-slate-300">WhatsApp: +56 9 4464 5774</a>
                </div>
                <p className="text-slate-500 text-sm mt-2">
                  Gracias por responder. Esta información nos ayudará a acompañarlo mejor en su campo y proponerle mejoras simples y útiles para su trabajo diario.
                </p>
              </div>
            </div>
          )}

          {!resultado && (
            <p className="text-center text-slate-500 mt-6">
              El resultado se mostrará cuando ingrese <strong>Nombre</strong> y <strong>Teléfono válidos</strong>, y complete todas las preguntas.
            </p>
          )}
        </div>
      </div>

      {/* Toast guardado */}
      {guardadoOK && (
        <div className="fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl text-white shadow"
            style={{background:"#26a269"}}>
          ✅ Resultado guardado
        </div>
      )}
    </div>
  );
}
