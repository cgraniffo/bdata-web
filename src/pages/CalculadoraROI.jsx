// src/pages/CalculadoraROI.jsx
import { useState, useMemo, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  Cell,
} from "recharts";
import { fmtCLP } from "../utils/format.js";

/* ─────────────────────────────────────────────────────────
   CULTIVOS tradicionales (sur): TRIGO, MAIZ, AVENA, CEBADA, RAPS
   % de ahorro/productividad conservadores por cultivo
   ───────────────────────────────────────────────────────── */
const CULTIVOS = ["TRIGO", "MAIZ", "AVENA", "CEBADA", "RAPS"];

const AGRO_BASES = {
  TRIGO:  { ahorroPct: 10, prodPct: 10 },
  MAIZ:   { ahorroPct: 10, prodPct: 10 },
  AVENA:  { ahorroPct: 9,  prodPct: 8  },
  CEBADA: { ahorroPct: 9,  prodPct: 8  },
  RAPS:   { ahorroPct: 10, prodPct: 9  },
};

const FACTOR_DIGITAL = { BAJO: 1.10, MEDIO: 1.00, ALTO: 0.90 };

const SCENARIOS = {
  CONSERVADOR: { label: "Conservador", mult: 0.8 },
  REALISTA:    { label: "Realista",    mult: 1.0 },
  OPTIMISTA:   { label: "Optimista",   mult: 1.2 },
};

/* ─────────────────────────────────────────────────────────
   Escala por superficie (CONTINUA, sin saltos)
   Economías de escala suaves: f(ha) = 1 + s * ln(1 + ha/H), tope 1.15
   ───────────────────────────────────────────────────────── */
function factorPorSuperficieSuave(ha) {
  const H = 50;   // escala característica
  const s = 0.12; // ganancia asintótica ~12%
  const top = 1.15;
  const h = Math.max(0, Number(ha) || 0);
  const f = 1 + s * Math.log(1 + h / H);
  return Math.min(top, f);
}

/* ─────────────────────────────────────────────────────────
   BASELINE OFICIAL (CLP/ha) por cultivo (fuentes clicables)
   - “Sin digitalización (ref.)” = margen/ha × superficie
   - TRIGO con margen/ha publicado; otros con fuentes listas y margen en preparación.
   ───────────────────────────────────────────────────────── */
const BASE_OFICIAL_POR_HA = {
  TRIGO: {
    label: "Trigo (sur de Chile)",
    // SNA con datos ODEPA 2023/24: costos $1.437.607/ha vs ingresos $1.260.000/ha → margen -$177.607/ha
    margenNetoHa: -177_607,
    fuentes: [
      {
        t: "SNA (con ODEPA): costos/ingresos trigo; margen -$177.607/ha (2023/24)",
        url: "https://www.sna.cl/2024/05/10/sna-detallo-razones-de-la-crisis-en-los-productores-de-trigo-chilenos/",
      },
      {
        t: "SNA • Boletín Cereales 2024 (contexto precios/trigo)",
        url: "https://www.sna.cl/wp-content/uploads/2024/09/2024-09-10-Cereales_1.pdf",
      },
    ],
  },

  MAIZ: {
    label: "Maíz grano (sur)",
    margenNetoHa: null, // en preparación: se calculará con ficha ODEPA + precios
    fuentes: [
      {
        t: "Chile Agrícola (ODEPA): Fichas de costo Maíz",
        url: "https://www.chileagricola.cl/ficha_de_costos/maiz/",
      },
      {
        t: "Boletín Cereales (cap. Maíz: costos por ha según rendimiento)",
        url: "https://opia.fia.cl/601/articles-128385_archivo_01.pdf",
      },
    ],
  },

  AVENA: {
    label: "Avena (sur)",
    margenNetoHa: null, // en preparación
    fuentes: [
      {
        t: "Chile Agrícola (ODEPA): Fichas de costo Avena",
        url: "https://www.chileagricola.cl/ficha_de_costos/avena/",
      },
      {
        t: "INDAP: planilla costo Avena (Excel)",
        url: "https://www.indap.gob.cl/sites/default/files/2023-06/avena-grano_1.xlsx",
      },
      {
        t: "Boletín Avena (contexto de mercado)",
        url: "https://opia.fia.cl/601/articles-128371_archivo_02.pdf",
      },
    ],
  },

  CEBADA: {
    label: "Cebada (sur)",
    margenNetoHa: null, // en preparación
    fuentes: [
      {
        t: "INDAP: planilla costo Cebada (Excel)",
        url: "https://www.indap.gob.cl/sites/default/files/2022-10/CEBADA.xlsx",
      },
      {
        t: "INIA: publicaciones técnicas (cebada/avena)",
        url: "https://biblioteca.inia.cl/bitstreams/0c3212b6-2f45-4fde-a461-de710e50c45d/download",
      },
    ],
  },

  RAPS: {
    label: "Raps/Canola (sur)",
    margenNetoHa: null, // en preparación
    fuentes: [
      {
        t: "INDAP: planilla costo Raps (Excel)",
        url: "https://www.indap.gob.cl/sites/default/files/2023-06/raps.xlsx",
      },
      {
        t: "Artículo ODEPA (contexto mercado raps/canola)",
        url: "https://colegioingenierosagronomoschile.cl/el-mercado-del-raps-canola/",
      },
    ],
  },
};

/* ─────────────────────────────────────────────────────────
   Compartir estado por URL
   ───────────────────────────────────────────────────────── */
function encodeStateToQuery(state) {
  const params = new URLSearchParams();
  Object.entries(state).forEach(([k, v]) => params.set(k, String(v)));
  return params.toString();
}
function decodeQueryToState(search) {
  const q = new URLSearchParams(search);
  const getN = (k, d = 0) => Number(q.get(k) ?? d);
  return {
    superficieHa: getN("ha", 30),
    cultivo: (q.get("cultivo") ?? "TRIGO").toUpperCase(),
    gastoAnualGestionable: getN("gasto", 12_000_000),
    nivelDigital: q.get("nivel") ?? "BAJO",
    escenario: q.get("escenario") ?? "REALISTA",
  };
}

/* ─────────────────────────────────────────────────────────
   Página principal
   ───────────────────────────────────────────────────────── */
export default function CalculadoraROI() {
  // Entradas
  const [superficieHa, setSuperficieHa] = useState(30);
  const [cultivo, setCultivo] = useState("TRIGO");
  const [gastoAnualGestionable, setGastoAnualGestionable] = useState(12_000_000);
  const [nivelDigital, setNivelDigital] = useState("BAJO");
  const [escenario, setEscenario] = useState("REALISTA");

  // Opciones visuales / referencia
  const [usarBaseOficial, setUsarBaseOficial] = useState(true);
  const [evitarNegativosGrafico, setEvitarNegativosGrafico] = useState(true);

  // Cargar desde URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const s = decodeQueryToState(window.location.search);
    if (window.location.search) {
      if (CULTIVOS.includes(s.cultivo)) setCultivo(s.cultivo);
      setSuperficieHa(s.superficieHa);
      setGastoAnualGestionable(s.gastoAnualGestionable);
      setNivelDigital(s.nivelDigital);
      setEscenario(s.escenario);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Cálculo de mejora por digitalización ───────────────────────────── */
  const base = AGRO_BASES[cultivo] || { ahorroPct: 10, prodPct: 10 };
  const fDigital = FACTOR_DIGITAL[nivelDigital] ?? 1.0;
  const fHa = factorPorSuperficieSuave(superficieHa); // continuo
  const multEscenario = SCENARIOS[escenario]?.mult ?? 1;

  const ahorroPctEfectivo = base.ahorroPct * fDigital * fHa;
  const prodPctEfectivo   = base.prodPct   * fDigital * fHa;

  const gastoVal = Number.isFinite(gastoAnualGestionable) ? Math.max(0, gastoAnualGestionable) : 0;

  const ahorroMensual     = (gastoVal * (ahorroPctEfectivo / 100)) / 12;
  const incrementoMensual = (gastoVal * (prodPctEfectivo   / 100)) / 12;
  const beneficioMensual  = Math.max(0, (ahorroMensual + incrementoMensual) * multEscenario);

  // KPIs inversión (simplificados)
  const inversionInicial = 1_500_000;
  const beneficioTotal   = beneficioMensual * 12;
  const roi              = inversionInicial > 0 ? ((beneficioTotal - inversionInicial) / inversionInicial) * 100 : 0;
  const paybackMeses     = beneficioMensual > 0 ? inversionInicial / beneficioMensual : Infinity;

  /* ── Baseline oficial anual (por ha × superficie) ───────────────────── */
  const refCultivo = BASE_OFICIAL_POR_HA[cultivo];
  const baselineOficialAnualReal = useMemo(() => {
    if (!usarBaseOficial || !refCultivo || refCultivo.margenNetoHa == null) return 0;
    const ha = Math.max(0, Number(superficieHa) || 0);
    return (refCultivo.margenNetoHa || 0) * ha;
  }, [usarBaseOficial, refCultivo, superficieHa]);

  // Mejora anual por digitalización (lo que calcula el simulador)
  const mejoraAnual = beneficioMensual * 12;

  // Gráfico: opción para “recortar” negativos en la visual
  const baselineParaGrafico = evitarNegativosGrafico
    ? Math.max(0, baselineOficialAnualReal)
    : baselineOficialAnualReal;

  const conDigitalParaGrafico = evitarNegativosGrafico
    ? Math.max(0, baselineOficialAnualReal + mejoraAnual)
    : baselineOficialAnualReal + mejoraAnual;

  const dataChart = [
    { name: "Sin digitalización (ref.)", value: baselineParaGrafico },
    { name: "Con digitalización", value: conDigitalParaGrafico },
  ];

  /* ───────────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[color:var(--color-fondo-claro,#f9fafb)] text-[color:var(--color-texto,#0f172a)]">
      {/* HERO */}
      <section className="bg-[color:var(--color-primario,#047857)] text-white py-10 text-center">
        <h1 className="text-4xl font-extrabold">Calculadora de ROI agrícola</h1>
        <p className="mt-2 text-white/80">Zona sur (Maule → Los Lagos) • CLP</p>
      </section>

      <main className="container-bd max-w-6xl mx-auto p-4 md:p-8">
        {/* ───────── BLOQUE DE INPUTS ───────── */}
        <section className="bg-white rounded-2xl border p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-emerald-800 mb-2">Simula tu escenario digital</h2>
          <p className="text-sm text-emerald-900/80 mb-5">
            Ingresa tus datos. Las mejoras se estiman con % de ahorro y productividad por cultivo,
            ajustados por <b>nivel de digitalización</b> y <b>superficie</b> (escala continua).
          </p>

          <div className="bg-emerald-50/60 rounded-xl p-5 border border-emerald-100">
            <div className="grid md:grid-cols-4 gap-4">
              <InputNumber
                label="Superficie (ha)"
                tip="Superficie útil para el cálculo (hectáreas). La escala se aplica de forma continua, sin saltos."
                value={superficieHa}
                onChange={(v) => setSuperficieHa(v)}
              />

              <SelectField
                label="Cultivo"
                tip="Cultivos tradicionales del sur (Maule–Los Lagos)."
                value={cultivo}
                onChange={(v) => setCultivo(v)}
                options={CULTIVOS.map((c) => [c, c.charAt(0) + c.slice(1).toLowerCase()])}
              />

              <InputMoney
                label="Gasto anual gestionable (CLP)"
                tip="Insumos, mano de obra y servicios optimizables; base para calcular ahorro/incremento."
                value={gastoAnualGestionable}
                onChange={(v) => setGastoAnualGestionable(v)}
              />

              <SelectField
                label="Nivel de digitalización"
                tip="Bajo = mayor potencial; Alto = ya optimizado."
                value={nivelDigital}
                onChange={(v) => setNivelDigital(v)}
                options={[
                  ["BAJO", "Bajo (alto potencial)"],
                  ["MEDIO", "Medio"],
                  ["ALTO", "Alto (optimizado)"],
                ]}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <SelectField
                label="Escenario"
                tip="Sensibilidad de resultados: Conservador/Realista/Optimista."
                value={escenario}
                onChange={(v) => setEscenario(v)}
                options={[
                  ["CONSERVADOR", "Conservador"],
                  ["REALISTA", "Realista"],
                  ["OPTIMISTA", "Optimista"],
                ]}
              />

              <div className="flex flex-col gap-2 justify-center">
                <label className="inline-flex items-center gap-2 text-sm text-emerald-900">
                  <input
                    type="checkbox"
                    className="size-4"
                    checked={usarBaseOficial}
                    onChange={(e) => setUsarBaseOficial(e.target.checked)}
                  />
                  Usar referencia oficial para “sin digitalización”
                  <InfoMinor text="Multiplica el margen oficial por ha × tu superficie." />
                  {usarBaseOficial && refCultivo && refCultivo.margenNetoHa == null && (
                    <span className="ml-1 text-xs text-amber-700 bg-amber-100 rounded px-2 py-0.5">
                      Próximamente para {refCultivo.label}
                    </span>
                  )}
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-emerald-900">
                  <input
                    type="checkbox"
                    className="size-4"
                    checked={evitarNegativosGrafico}
                    onChange={(e) => setEvitarNegativosGrafico(e.target.checked)}
                  />
                  Evitar negativos en el gráfico (solo visual)
                  <InfoMinor text="No altera los KPIs; solo facilita la lectura si el baseline es < 0." />
                </label>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="bg-white rounded-xl border border-zinc-200 p-5 mt-6">
            <h3 className="text-emerald-800 font-semibold mb-2">Resultados del cálculo</h3>
            <p className="text-sm text-zinc-600 mb-4">
              Estimaciones según tu escenario. Ajusta los valores para ver cambios inmediatos.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <KPI
                label="Ganancia extra mensual"
                tip="Ahorro + incremento por digitalizar (CLP/mes) aplicado a tu gasto gestionable."
                value={fmtCLP(beneficioMensual)}
              />
              <KPI
                label="ROI (12 meses)"
                tip="((Beneficio neto - Inversión) / Inversión) sobre 12 meses; usa inversión de referencia."
                value={`${roi.toFixed(1)} %`}
              />
              <KPI
                label="Recuperas inversión en"
                tip="Meses necesarios para recuperar la inversión inicial con la ganancia extra mensual estimada."
                value={Number.isFinite(paybackMeses) ? `${paybackMeses.toFixed(1)} meses` : "N/A"}
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-3">
              Nota metodológica: el factor de superficie <b>es continuo</b> (sin saltos). Modela economías de escala suaves y acotadas.
            </p>
          </div>

          {/* Aviso si baseline real < 0 */}
          {usarBaseOficial && baselineOficialAnualReal < 0 && (
            <div className="mt-3 text-xs inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-2 rounded">
              ⚠️ Baseline oficial negativo según fuente. Revisa los enlaces de referencia más abajo.
            </div>
          )}

          {/* Gráfico */}
          <h3 className="mt-8 text-[color:var(--color-primario,#047857)] font-semibold">
            Comparación anual: sin digitalización (referencia oficial) vs con digitalización
          </h3>
          <p className="text-xs text-zinc-600">
            {usarBaseOficial
              ? "La barra base usa margen oficial (CLP/ha) × hectáreas. La barra verde suma la mejora anual estimada por digitalización."
              : "Sin referencia oficial: se muestra solo la mejora anual estimada por digitalización sobre una base 0 en el gráfico."}
          </p>

          <div className="h-72 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataChart} barSize={80}>
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(v) => abreviaCLP(v)} domain={["auto", "auto"]} />
                <Tooltip formatter={(v) => fmtCLP(v)} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {/* Rojo para valores negativos, verde para no negativos */}
                  {dataChart.map((d, i) => (
                    <Cell key={i} fill={d.value < 0 ? "#dc2626" : "#047857"} />
                  ))}
                  <LabelList dataKey="value" position="top" formatter={(v) => fmtCLP(v)} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Fuentes oficiales (por cultivo) */}
          {usarBaseOficial && refCultivo && (
            <div className="mt-3 text-sm bg-white border rounded-lg p-3">
              <div className="font-medium text-emerald-800">
                Fuentes oficiales {refCultivo.margenNetoHa == null ? "(en preparación)" : ""} para {refCultivo.label}
              </div>

              {refCultivo.fuentes?.length > 0 ? (
                <>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {refCultivo.fuentes.map((f, i) => (
                      <li key={i}>
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:underline"
                        >
                          {f.t}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-zinc-500 mt-2">
                    “Sin digitalización” usa el margen anual por hectárea de la(s) fuente(s) citada(s),
                    multiplicado por tu superficie.
                  </p>
                </>
              ) : (
                <p className="text-xs text-zinc-600 mt-1">
                  Estamos integrando las fuentes oficiales para este cultivo (ODEPA/INIA/SNA). Muy pronto verás aquí
                  el enlace directo a la ficha o boletín.
                </p>
              )}
            </div>
          )}

          {/* Compartir escenario */}
          <div className="mt-4 flex flex-wrap gap-3 justify-end">
            <button
              onClick={() => {
                const q = encodeStateToQuery({
                  ha: superficieHa,
                  cultivo,
                  gasto: gastoAnualGestionable,
                  nivel: nivelDigital,
                  escenario,
                });
                const url = `${window.location.origin}${window.location.pathname}?${q}`;
                navigator.clipboard.writeText(url);
                alert("✅ Enlace copiado. Puedes compartir este escenario.");
              }}
              className="px-4 py-2 rounded-lg border text-sm hover:bg-zinc-50 transition"
              title="Copia un enlace con este escenario para compartirlo o auditarlo"
            >
              Copiar enlace del escenario
            </button>

            <a
              href={`https://wa.me/56944645774?text=${encodeURIComponent(
                `👋 Hola! Usé la Calculadora ROI de BData.\n\n` +
                `Cultivo: ${cultivo}\n` +
                `Superficie: ${superficieHa} ha\n` +
                `Nivel: ${nivelDigital}\n` +
                `Escenario: ${escenario}\n\n` +
                `ROI 12m: ${roi.toFixed(1)} %\n` +
                `Payback: ${Number.isFinite(paybackMeses) ? `${paybackMeses.toFixed(1)} meses` : "N/A"}\n` +
                `Ganancia mensual extra: ${fmtCLP(beneficioMensual)}\n\n` +
                `🔗 ${window.location.origin}${window.location.pathname}?` +
                encodeStateToQuery({ ha: superficieHa, cultivo, gasto: gastoAnualGestionable, nivel: nivelDigital, escenario })
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-green-700 transition"
            >
              Enviar por WhatsApp
            </a>
          </div>

          {/* === PANEL DE METODOLOGÍA / FUENTES GENERALES === */}
          <CredibilityPanel
            cultivo={cultivo}
            superficieHa={superficieHa}
            gastoAnualGestionable={gastoAnualGestionable}
            ahorroPctEfectivo={ahorroPctEfectivo}
            prodPctEfectivo={prodPctEfectivo}
            nivelDigital={nivelDigital}
            escenario={escenario}
            beneficioMensual={beneficioMensual}
            inversionInicial={inversionInicial}
          />
        </section>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SUBCOMPONENTES Y UTILIDADES
   ───────────────────────────────────────────────────────── */
function FieldLabel({ children, tip }) {
  return (
    <label className="flex items-center gap-1 text-sm font-medium text-emerald-900">
      {children}
      <span className="cursor-pointer text-emerald-600 hover:text-emerald-800" title={tip}>ⓘ</span>
    </label>
  );
}
function InfoMinor({ text }) {
  return (
    <span className="text-[11px] text-zinc-500" title={text}>ⓘ</span>
  );
}
function InputNumber({ label, tip, value, onChange }) {
  return (
    <div>
      <FieldLabel tip={tip}>{label}</FieldLabel>
      <input
        type="number"
        min="0"
        className="w-full border rounded-lg p-2"
        value={value}
        onChange={(e) => {
          const n = +e.target.value;
          onChange(Number.isFinite(n) ? Math.max(0, n) : 0);
        }}
      />
    </div>
  );
}
function InputMoney({ label, tip, value, onChange }) {
  const view = useMemo(() => fmtCLP(value), [value]);
  return (
    <div>
      <FieldLabel tip={tip}>{label}</FieldLabel>
      <input
        type="text"
        className="w-full border rounded-lg p-2 text-right"
        value={view}
        onChange={(e) => {
          const clean = (e.target.value || "")
            .toString()
            .replace(/\./g, "")
            .replace(/\D/g, "");
          const n = Number(clean) || 0;
          onChange(Math.max(0, n));
        }}
      />
    </div>
  );
}
function SelectField({ label, tip, value, onChange, options }) {
  return (
    <div>
      <FieldLabel tip={tip}>{label}</FieldLabel>
      <select
        className="w-full border rounded-lg p-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(([val, txt]) => (
          <option key={val} value={val}>{txt}</option>
        ))}
      </select>
    </div>
  );
}
function KPI({ label, value, tip }) {
  return (
    <div className="border rounded-xl p-4 text-center bg-emerald-50">
      <div className="text-xs text-emerald-800/70 mb-1 flex items-center justify-center gap-1">
        {label} <span title={tip}>ⓘ</span>
      </div>
      <div className="text-lg font-bold text-emerald-800">{value}</div>
    </div>
  );
}
function abreviaCLP(n) {
  if (Math.abs(n) >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(n) >= 1_000_000)     return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000)         return `$${(n / 1_000).toFixed(0)}K`;
  return fmtCLP(n);
}

/* ====================== PANEL DE CREDIBILIDAD / METODOLOGÍA ====================== */
function CredibilityPanel({
  cultivo,
  superficieHa,
  gastoAnualGestionable,
  ahorroPctEfectivo,
  prodPctEfectivo,
  nivelDigital,
  escenario,
  beneficioMensual,
  inversionInicial,
}) {
  const ahorroMensual = (gastoAnualGestionable * (ahorroPctEfectivo / 100)) / 12;
  const incrementoMensual = (gastoAnualGestionable * (prodPctEfectivo / 100)) / 12;

  return (
    <div className="mt-10 rounded-xl border p-5 bg-emerald-50/60">
      <h4 className="font-semibold text-emerald-800 mb-2">
        Metodología, supuestos y fuentes generales
      </h4>

      {/* Formulación */}
      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <TinyBox
          title="Fórmula ROI"
          value="(Beneficio neto − Inversión) / Inversión"
          tip="ROI: mide retorno sobre la inversión, expresado en porcentaje."
        />
        <TinyBox
          title="Beneficio mensual"
          value="Ahorro + Incremento"
          tip="Suma de ahorros e incrementos esperados por digitalización."
        />
        <TinyBox
          title="Payback"
          value="Inversión / Beneficio mensual"
          tip="Meses necesarios para recuperar la inversión inicial."
        />
      </div>

      {/* Datos de contexto */}
      <div className="grid md:grid-cols-3 gap-4 mt-4 text-sm">
        <KeyValue label="Cultivo" value={cultivo} />
        <KeyValue label="Superficie (ha)" value={superficieHa} />
        <KeyValue label="Nivel digitalización" value={nivelDigital} />
        <KeyValue label="Escenario" value={escenario} />
        <KeyValue label="Gasto gestionable" value={fmtCLP(gastoAnualGestionable)} />
        <KeyValue label="Ahorro efectivo" value={`${ahorroPctEfectivo.toFixed(1)} %`} />
        <KeyValue label="Productividad efectiva" value={`${prodPctEfectivo.toFixed(1)} %`} />
      </div>

      <div className="mt-3 grid md:grid-cols-3 gap-4">
        <KeyValue label="Ahorro mensual estimado" value={fmtCLP(ahorroMensual)} />
        <KeyValue label="Incremento mensual estimado" value={fmtCLP(incrementoMensual)} />
        <KeyValue label="Beneficio mensual total" value={fmtCLP(beneficioMensual)} />
      </div>

      {/* REFERENCIAS SOBRE DIGITALIZACIÓN */}
      <div className="mt-6 text-sm bg-white border rounded-lg p-4">
        <div className="font-semibold text-emerald-800 mb-2">
          Estudios y casos reales de digitalización agrícola que demuestran la importancia de la digitalización en los campos
        </div>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <a
              href="https://www.sag.gob.cl/noticias/sag-logra-primer-registro-fitosanitario-100-digital"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:underline"
            >
              SAG: primer registro fitosanitario 100 % digital — trazabilidad y gestión sin papel.
            </a>
          </li>
          <li>
            <a
              href="https://redagricola.com/el-ecosistema-de-la-agricultura-digital-en-america-latina-acelerado-sin-querer-por-la-pandemia/"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:underline"
            >
              RedAgrícola: ecosistema digital latinoamericano acelerado por la pandemia.
            </a>
          </li>
          <li>
            <a
              href="https://www.sag.gob.cl/noticias/sag-implementa-digitalizacion-que-disminuye-hasta-un-80-los-tiempos-en-vigilancias-fitosanitarias"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:underline"
            >
              SAG: digitalización reduce hasta 80 % los tiempos en vigilancias fitosanitarias.
            </a>
          </li>
          <li>
            <a
              href="https://www.canr.msu.edu/farm_management/"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:underline"
            >
              Michigan State University: herramientas de gestión de predios (Farm Management).
            </a>
          </li>
          <li>
            <a
              href="https://www.fao.org/family-farming/detail/en/c/1738911/"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:underline"
            >
              FAO: digitalización para agricultura familiar — eficiencia y reducción de pérdidas.
            </a>
          </li>
          <li>
            <a
              href="https://opia.fia.cl/601/articles-120616_archivo_15.pdf"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:underline"
            >
              FIA / OPIA: innovación tecnológica en la gestión agrícola chilena.
            </a>
          </li>
          <li>
            <a
              href="https://www.aces.edu/blog/topics/farm-management/spreadsheets-vs-farm-management-software/"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:underline"
            >
              ACES: hojas de cálculo vs software de gestión agrícola.
            </a>
          </li>
          <li>
            <a
              href="https://www.researchgate.net/publication/380191673_Understanding_Farmers'_Data_Collection_Practices_on_Small-to-Medium_Farms_for_the_Design_of_Future_Farm_Management_Information_Systems"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:underline"
            >
              ResearchGate: recolección de datos en fincas pymes para diseñar FMIS.
            </a>
          </li>
        </ul>
        <p className="text-xs text-zinc-500 mt-2">
          Estas fuentes sustentan los supuestos de ahorro, eficiencia y retorno aplicados en la simulación.
        </p>
      </div>

      <p className="text-xs text-emerald-900/70 mt-3">
        Fuente: Casos de éxito BData, FIA, SAG, FAO, INIA, SNA y universidades internacionales.
        Resultados aproximados; deben ajustarse a datos reales del predio.
      </p>
    </div>
  );
}

function TinyBox({ title, value, tip }) {
  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="text-zinc-600 flex items-center gap-1">{title} <span title={tip}>ⓘ</span></div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function KeyValue({ label, value }) {
  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
