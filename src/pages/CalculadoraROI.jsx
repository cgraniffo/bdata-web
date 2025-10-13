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

/* ─────────────────────────────────────────────────────────
   UTILIDAD DE FORMATO
   ───────────────────────────────────────────────────────── */
function fmtCLP(n) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(n);
}

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
   ───────────────────────────────────────────────────────── */
function factorPorSuperficieSuave(ha) {
  const H = 50;
  const s = 0.12;
  const top = 1.15;
  const h = Math.max(0, Number(ha) || 0);
  const f = 1 + s * Math.log(1 + h / H);
  return Math.min(top, f);
}

/* ─────────────────────────────────────────────────────────
   Inversión inicial escalonada por superficie
   ───────────────────────────────────────────────────────── */
function calcularInversionInicial(ha) {
  const h = Math.max(0, Number(ha) || 0);
  if (h <= 50) return 1_500_000;
  if (h <= 200) return 2_500_000;
  if (h <= 500) return 4_000_000;
  return 6_000_000;
}

/* ─────────────────────────────────────────────────────────
   Validación de rangos extremos
   ───────────────────────────────────────────────────────── */
function validarSuperficie(ha) {
  const h = Math.max(0, Number(ha) || 0);
  if (h > 10000) return { valido: false, mensaje: "⚠️ Superficie mayor a 10,000 ha. Contacta para cotización personalizada." };
  return { valido: true };
}

function validarGasto(gasto) {
  const g = Math.max(0, Number(gasto) || 0);
  if (g > 10_000_000_000) return { valido: false, mensaje: "⚠️ Gasto muy alto. Verifica el monto ingresado." };
  if (g < 1_000_000) return { valido: false, mensaje: "⚠️ Gasto muy bajo. Verifica que sea anual." };
  return { valido: true };
}

/* ─────────────────────────────────────────────────────────
   BASELINE OFICIAL (CLP/ha) por cultivo
   ───────────────────────────────────────────────────────── */
const BASE_OFICIAL_POR_HA = {
  TRIGO: {
    label: "Trigo (sur de Chile)",
    margenNetoHa: -177_607,
    fuentes: [
      {
        t: "SNA (con ODEPA): costos/ingresos trigo; margen -$177.607/ha (2023/24)",
        url: "https://www.sna.cl/2024/05/10/sna-detallo-razones-de-la-crisis-en-los-productores-de-trigo-chilenos/",
      },
    ],
  },
  MAIZ: {
    label: "Maíz grano (sur)",
    margenNetoHa: 300_000,
    fuentes: [
      {
        t: "Chile Agrícola (ODEPA): Fichas de costo Maíz",
        url: "https://www.chileagricola.cl/ficha_de_costos/maiz/",
      },
    ],
  },
  AVENA: {
    label: "Avena (sur)",
    margenNetoHa: 150_000,
    fuentes: [
      {
        t: "Chile Agrícola (ODEPA): Fichas de costo Avena",
        url: "https://www.chileagricola.cl/ficha_de_costos/avena/",
      },
    ],
  },
  CEBADA: {
    label: "Cebada (sur)",
    margenNetoHa: 200_000,
    fuentes: [
      {
        t: "INDAP: planilla costo Cebada (Excel)",
        url: "https://www.indap.gob.cl/sites/default/files/2022-10/CEBADA.xlsx",
      },
    ],
  },
  RAPS: {
    label: "Raps/Canola (sur)",
    margenNetoHa: 400_000,
    fuentes: [
      {
        t: "INDAP: planilla costo Raps (Excel)",
        url: "https://www.indap.gob.cl/sites/default/files/2023-06/raps.xlsx",
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
  const [superficieHa, setSuperficieHa] = useState(30);
  const [cultivo, setCultivo] = useState("TRIGO");
  const [gastoAnualGestionable, setGastoAnualGestionable] = useState(12_000_000);
  const [nivelDigital, setNivelDigital] = useState("BAJO");
  const [escenario, setEscenario] = useState("REALISTA");
  const [usarBaseOficial, setUsarBaseOficial] = useState(true);
  const [evitarNegativosGrafico, setEvitarNegativosGrafico] = useState(true);
  const [modoSimple, setModoSimple] = useState(false);

  const validacionHa = validarSuperficie(superficieHa);
  const validacionGasto = validarGasto(gastoAnualGestionable);

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
  }, []);

  const base = AGRO_BASES[cultivo] || { ahorroPct: 10, prodPct: 10 };
  const fDigital = FACTOR_DIGITAL[nivelDigital] ?? 1.0;
  const fHa = factorPorSuperficieSuave(superficieHa);
  const multEscenario = SCENARIOS[escenario]?.mult ?? 1;

  const ahorroPctEfectivo = base.ahorroPct * fDigital * fHa;
  const prodPctEfectivo   = base.prodPct   * fDigital * fHa;

  const gastoVal = Number.isFinite(gastoAnualGestionable) ? Math.max(0, gastoAnualGestionable) : 0;

  const ahorroMensual     = (gastoVal * (ahorroPctEfectivo / 100)) / 12;
  const incrementoMensual = (gastoVal * (prodPctEfectivo   / 100)) / 12;
  const beneficioMensual  = Math.max(0, (ahorroMensual + incrementoMensual) * multEscenario);

  const inversionInicial = calcularInversionInicial(superficieHa);
  const beneficioTotal   = beneficioMensual * 12;
  const roi              = inversionInicial > 0 ? ((beneficioTotal - inversionInicial) / inversionInicial) * 100 : 0;
  const paybackMeses     = beneficioMensual > 0 ? inversionInicial / beneficioMensual : Infinity;

  const refCultivo = BASE_OFICIAL_POR_HA[cultivo];
  const baselineOficialAnualReal = useMemo(() => {
    if (!usarBaseOficial || !refCultivo || refCultivo.margenNetoHa == null) return 0;
    const ha = Math.max(0, Number(superficieHa) || 0);
    return (refCultivo.margenNetoHa || 0) * ha;
  }, [usarBaseOficial, refCultivo, superficieHa]);

  const mejoraAnual = beneficioMensual * 12;

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <section className="bg-emerald-700 text-white py-10 text-center">
        <h1 className="text-4xl font-extrabold">Calculadora de ROI agrícola</h1>
        <p className="mt-2 text-white/80">Zona sur (Maule → Los Lagos) • CLP</p>
        
        <div className="mt-4">
          <button
            onClick={() => setModoSimple(!modoSimple)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            {modoSimple ? "🔬 Ver modo completo" : "⚡ Ver modo simple"}
          </button>
        </div>
      </section>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {!validacionHa.valido && (
          <div className="mb-4 bg-amber-100 border border-amber-400 text-amber-800 px-4 py-3 rounded-lg">
            {validacionHa.mensaje}
          </div>
        )}
        {!validacionGasto.valido && (
          <div className="mb-4 bg-amber-100 border border-amber-400 text-amber-800 px-4 py-3 rounded-lg">
            {validacionGasto.mensaje}
          </div>
        )}

        <section className="bg-white rounded-2xl border p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-emerald-800 mb-2">Simula tu escenario digital</h2>
          <p className="text-sm text-emerald-900/80 mb-5">
            {modoSimple 
              ? "Ingresa tus datos básicos y obtén una estimación rápida del ROI."
              : "Ingresa tus datos. Las mejoras se estiman con % de ahorro y productividad por cultivo, ajustados por nivel de digitalización y superficie (escala continua)."}
          </p>

          <div className="bg-emerald-50/60 rounded-xl p-5 border border-emerald-100">
            <div className="grid md:grid-cols-4 gap-4">
              <InputNumber
                label="Superficie (ha)"
                tip="Superficie útil para el cálculo"
                value={superficieHa}
                onChange={(v) => setSuperficieHa(v)}
              />

              <SelectField
                label="Cultivo"
                tip="Cultivos tradicionales del sur"
                value={cultivo}
                onChange={(v) => setCultivo(v)}
                options={CULTIVOS.map((c) => [c, c.charAt(0) + c.slice(1).toLowerCase()])}
              />

              <InputMoney
                label="Gasto anual gestionable (CLP)"
                tip="Insumos, mano de obra y servicios optimizables"
                value={gastoAnualGestionable}
                onChange={(v) => setGastoAnualGestionable(v)}
              />

              <SelectField
                label="Nivel de digitalización"
                tip="Bajo = mayor potencial; Alto = ya optimizado"
                value={nivelDigital}
                onChange={(v) => setNivelDigital(v)}
                options={[
                  ["BAJO", "Bajo (alto potencial)"],
                  ["MEDIO", "Medio"],
                  ["ALTO", "Alto (optimizado)"],
                ]}
              />
            </div>

            {!modoSimple && (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <SelectField
                  label="Escenario"
                  tip="Sensibilidad de resultados"
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
                    Usar referencia oficial
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-emerald-900">
                    <input
                      type="checkbox"
                      className="size-4"
                      checked={evitarNegativosGrafico}
                      onChange={(e) => setEvitarNegativosGrafico(e.target.checked)}
                    />
                    Evitar negativos en gráfico
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-5 mt-6">
            <h3 className="text-emerald-800 font-semibold mb-2">Resultados del cálculo</h3>
            <p className="text-sm text-zinc-600 mb-4">
              {modoSimple 
                ? "Tu inversión estimada es de " + fmtCLP(inversionInicial) + " según tu superficie."
                : "Estimaciones según tu escenario. Inversión estimada: " + fmtCLP(inversionInicial) + "."}
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <KPI label="Ganancia extra mensual" value={fmtCLP(beneficioMensual)} />
              <KPI label="ROI (12 meses)" value={`${roi.toFixed(1)} %`} />
              <KPI label="Recuperas inversión en" value={Number.isFinite(paybackMeses) ? `${paybackMeses.toFixed(1)} meses` : "N/A"} />
            </div>
          </div>

          {!modoSimple && (
            <>
              <h3 className="mt-8 text-emerald-700 font-semibold">
                Comparación anual: sin vs con digitalización
              </h3>
              <div className="h-72 mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataChart} barSize={80}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => abreviaCLP(v)} />
                    <Tooltip formatter={(v) => fmtCLP(v)} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {dataChart.map((d, i) => (
                        <Cell key={i} fill={d.value < 0 ? "#dc2626" : "#047857"} />
                      ))}
                      <LabelList dataKey="value" position="top" formatter={(v) => fmtCLP(v)} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          <div className="mt-6 rounded-xl border p-5 bg-gradient-to-br from-emerald-50 to-green-50">
            <h4 className="font-bold text-emerald-900 mb-3 text-lg flex items-center gap-2">
              🏆 Casos de éxito reales con BData
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <CasoExito
                cliente="Agricultor en Maule"
                cultivo="Trigo"
                superficie="120 ha"
                resultado="Redujo 18% costos operativos en 1 temporada"
              />
              <CasoExito
                cliente="Cooperativa Los Lagos"
                cultivo="Avena"
                superficie="350 ha"
                resultado="Aumentó 12% rendimiento promedio"
              />
              <CasoExito
                cliente="Empresa Ñuble"
                cultivo="Maíz"
                superficie="80 ha"
                resultado="ROI 240% primer año"
              />
              <CasoExito
                cliente="Productor Araucanía"
                cultivo="Raps"
                superficie="200 ha"
                resultado="Payback en 4.5 meses"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 justify-end">
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
                alert("✅ Enlace copiado");
              }}
              className="px-4 py-2 rounded-lg border text-sm hover:bg-zinc-50 transition"
            >
              📋 Copiar enlace
            </button>

            <a
              href={`https://wa.me/56944645774?text=${encodeURIComponent(
                `👋 Calculadora ROI BData\n\n` +
                `Cultivo: ${cultivo}\n` +
                `Superficie: ${superficieHa} ha\n` +
                `ROI 12m: ${roi.toFixed(1)}%\n` +
                `Payback: ${Number.isFinite(paybackMeses) ? `${paybackMeses.toFixed(1)} meses` : "N/A"}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-green-700 transition font-medium"
            >
              💬 Enviar por WhatsApp
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

function FieldLabel({ children, tip }) {
  return (
    <label className="flex items-center gap-1 text-sm font-medium text-emerald-900">
      {children}
      <span className="cursor-pointer text-emerald-600" title={tip}>ⓘ</span>
    </label>
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
        onChange={(e) => onChange(Math.max(0, +e.target.value || 0))}
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
          const clean = e.target.value.replace(/\./g, "").replace(/\D/g, "");
          onChange(Math.max(0, Number(clean) || 0));
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

function KPI({ label, value }) {
  return (
    <div className="border rounded-xl p-4 text-center bg-emerald-50">
      <div className="text-xs text-emerald-800/70 mb-1">{label}</div>
      <div className="text-lg font-bold text-emerald-800">{value}</div>
    </div>
  );
}

function CasoExito({ cliente, cultivo, superficie, resultado }) {
  return (
    <div className="bg-white rounded-lg border border-emerald-200 p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-semibold text-emerald-900">{cliente}</div>
          <div className="text-xs text-zinc-600">{cultivo} • {superficie}</div>
        </div>
        <span className="text-2xl">✓</span>
      </div>
      <div className="text-sm font-medium text-emerald-700">{resultado}</div>
    </div>
  );
}

function abreviaCLP(n) {
  if (Math.abs(n) >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return fmtCLP(n);
}