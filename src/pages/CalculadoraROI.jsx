import { useState, useMemo, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, Cell,
  PieChart, Pie, Legend,
  LineChart, Line, CartesianGrid, ReferenceLine,
} from "recharts";

/* ===================== Util formateo ===================== */
function fmtCLP(n) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n || 0);
}
function abreviaCLP(n) {
  if (Math.abs(n) >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return fmtCLP(n);
}

/* ===================== Parámetros del modelo ===================== */
// % base por cultivo cuando NO se usan sliders (fallback)
const AGRO_BASES = {
  RAPS: { ahorroPct: 10, prodPct: 9 },
  TRIGO: { ahorroPct: 10, prodPct: 10 },
  MAIZ: { ahorroPct: 10, prodPct: 10 },
  AVENA: { ahorroPct: 9, prodPct: 8 },
  CEBADA: { ahorroPct: 9, prodPct: 8 },
};

// factor por nivel de digitalización inicial del cliente
const FACTOR_DIGITAL = { BAJO: 1.1, MEDIO: 1.0, ALTO: 0.9 };

// escenarios de sensibilidad
const SCENARIOS = {
  CONSERVADOR: { label: "Conservador", mult: 0.8 },
  REALISTA: { label: "Realista", mult: 1.0 },
  OPTIMISTA: { label: "Optimista", mult: 1.2 },
};

// escala continua por superficie
function factorPorSuperficieSuave(ha) {
  const H = 50, s = 0.12, top = 1.15;
  const h = Math.max(0, Number(ha) || 0);
  const f = 1 + s * Math.log(1 + h / H);
  return Math.min(top, f);
}

// inversión por tramos de superficie (modo AUTO)
function calcularInversionInicial(ha) {
  const h = Math.max(0, Number(ha) || 0);
  if (h <= 50) return 1_500_000;
  if (h <= 200) return 2_500_000;
  if (h <= 500) return 4_000_000;
  return 6_000_000;
}

// Presets de planes (ajústalos a lo de bdata.cl/planes)
const PLANES = [
  { id: "BASICO", nombre: "Plan Básico", monto: 1_200_000 },
  { id: "PRO",    nombre: "Plan Pro",    monto: 2_500_000 },
  { id: "FULL",   nombre: "Plan Full",   monto: 4_000_000 },
];

/* ===================== URL helpers ===================== */
function encodeStateToQuery(state) {
  const params = new URLSearchParams();
  Object.entries(state).forEach(([k, v]) => params.set(k, String(v)));
  return params.toString();
}
function decodeQueryToState(search, cultivosDisponibles) {
  const q = new URLSearchParams(search);
  const getN = (k, d = 0) => Number(q.get(k) ?? d);
  const fallback = (cultivosDisponibles[0] ?? "RAPS").toUpperCase();
  const cultQ = (q.get("cultivo") ?? fallback).toUpperCase();

  // horizonte
  const hzQ = getN("hz", 24);
  const hz = hzQ === 36 ? 36 : 24;

  // inversión
  const invModeQ = (q.get("invMode") ?? "AUTO").toUpperCase();
  const planQ = (q.get("plan") ?? "PRO").toUpperCase();
  const invQ = getN("inv", 1_500_000);

  return {
    superficieHa: getN("ha", 30),
    cultivo: cultivosDisponibles.includes(cultQ) ? cultQ : fallback,
    nivelDigital: q.get("nivel") ?? "BAJO",
    escenario: q.get("escenario") ?? "REALISTA",
    usarSliders: (q.get("sliders") ?? "0") === "1",
    ahorroUserPct: getN("ahorro", 10),
    prodUserPct: getN("prod", 10),
    hz,
    invMode: ["AUTO", "PLAN", "MANUAL"].includes(invModeQ) ? invModeQ : "AUTO",
    plan: planQ,
    inv: invQ,
  };
}

/* ===================== TIPS — glosario embebido ===================== */
const TIPS = {
  superficie: "Hectáreas productivas consideradas. Siembra útil; excluye barbechos o superficies sin manejo.",
  cultivo: "Cultivo con datos BData disponibles para esta temporada.",
  nivelDigital: "Bajo = mayor potencial de mejora. Alto = operación ya optimizada. Ajusta el potencial de ahorro/productividad.",
  escenario: "Sensibilidad del cálculo: Conservador (−20%), Realista (base) u Optimista (+20%).",
  invMode: "Cómo definimos la inversión inicial: automática por superficie, plan BData o monto manual.",
  invPlan: "Selecciona un plan predefinido para simular la inversión (editable luego desde JSON).",
  invManual: "Monto de inversión que quieres evaluar. Útil para ofertas a medida o pilotos.",
  slidersToggle: "Activa para ajustar manualmente el % de ahorro de costos y el % de productividad.",
  ahorroPct: "Porcentaje de reducción de costos totales. Se aplica sobre costos BData.",
  prodPct: "Porcentaje de mejora valorizada (más kilos vendibles, mejor precio o menos pérdidas).",
  evitarNegativos: "Si el margen base es negativo, esta opción evita dibujar barras negativas en la comparación anual.",
  horizonte: "Período para ROI acumulado y verificar si el payback cae dentro del rango (24 o 36 meses).",
  kpiGananciaMensual: "Ahorro mensual + ingreso mensual extra (tras nivel digital, superficie y escenario).",
  kpiRoi12: "ROI neto del primer año. Puede ser negativo si la inversión se recupera después del mes 12.",
  kpiPayback: "Mes en que el flujo acumulado supera la inversión inicial (aprox., constante mes a mes).",
  resumenResultadoBase: "Margen actual estimado: (ingresos/ha − costos/ha) × superficie.",
  resumenMejora: "Mejora anual por digitalización: ganancia extra mensual × 12.",
  resumenConDigital: "Resultado anual considerando mejoras y supuestos.",
  resumenRoiHorizonte: "ROI acumulado al horizonte: (beneficio acumulado − inversión) / inversión.",
  tortaCostos: "Desglose de costos BData por tipo de labor (CLP/ha) para identificar focos de ahorro.",
};
export default function CalculadoraROI() {
  /* --- hooks (siempre arriba) --- */
  // datos BData
  const [bdData, setBdData] = useState(null);
  const [bdStatus, setBdStatus] = useState("idle"); // idle|loading|ok|error

  // estado UI
  const [superficieHa, setSuperficieHa] = useState(30);
  const [cultivo, setCultivo] = useState("RAPS");
  const [nivelDigital, setNivelDigital] = useState("BAJO");
  const [escenario, setEscenario] = useState("REALISTA");
  const [evitarNegativosGrafico, setEvitarNegativosGrafico] = useState(true);
  const [modoSimple, setModoSimple] = useState(false);

  // sliders paramétricos
  const [usarSliders, setUsarSliders] = useState(false);
  const [ahorroUserPct, setAhorroUserPct] = useState(10); // 0–40
  const [prodUserPct, setProdUserPct] = useState(10);     // 0–40

  // horizonte 24/36 meses
  const [horizonteMeses, setHorizonteMeses] = useState(24);

  // inversión variable
  const [modoInversion, setModoInversion] = useState("AUTO"); // "AUTO" | "PLAN" | "MANUAL"
  const [planId, setPlanId] = useState("PRO");
  const [inversionManual, setInversionManual] = useState(1_500_000);

  // Modal de ayuda / glosario
  const [showHelp, setShowHelp] = useState(false);



  // cargar JSON una sola vez
  useEffect(() => {
    let alive = true;
    setBdStatus("loading");
    fetch(`/data/costos-bdata.json?v=${Date.now()}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (!alive) return;
        setBdData(json);
        setBdStatus("ok");
      })
      .catch(() => alive && setBdStatus("error"));
    return () => { alive = false; };
  }, []);

  // cultivos disponibles
  const CULTIVOS = useMemo(
    () => (bdData?.cultivos ? Object.keys(bdData.cultivos) : ["RAPS"]),
    [bdData]
  );

  // aplicar estado desde URL cuando ya hay datos
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!bdData?.cultivos) return;
    const s = decodeQueryToState(window.location.search, CULTIVOS);
    setCultivo(s.cultivo);
    setSuperficieHa(s.superficieHa);
    setNivelDigital(s.nivelDigital);
    setEscenario(s.escenario);
    setUsarSliders(s.usarSliders);
    setAhorroUserPct(s.ahorroUserPct);
    setProdUserPct(s.prodUserPct);
    setHorizonteMeses(s.hz);
    setModoInversion(s.invMode);
    setPlanId(s.plan);
    setInversionManual(s.inv);
  }, [bdData, CULTIVOS]);

  /* --- cálculos --- */
  const bd = bdData?.cultivos?.[cultivo] ?? null;
  const haNum = Math.max(0, Number(superficieHa) || 0);

  const costosHa = bd ? Number(bd.costos_totales_ha_clp) || 0 : 0;
  const ingresosHa = bd ? Number(bd.ingresos_ha_clp) || 0 : 0;

  // referencia anual base
  const gastoBase = costosHa * haNum;           // aproxima “gestionable” total por ha
  const margenHa = ingresosHa - costosHa;
  const baselineBase = margenHa * haNum;

  // % base vs sliders
  const base = AGRO_BASES[cultivo] || { ahorroPct: 10, prodPct: 10 };
  const ahorroBase = usarSliders ? ahorroUserPct : base.ahorroPct;
  const prodBase   = usarSliders ? prodUserPct   : base.prodPct;

  const fDigital = FACTOR_DIGITAL[nivelDigital] ?? 1.0;
  const fHa = factorPorSuperficieSuave(superficieHa);
  const multEscenario = SCENARIOS[escenario]?.mult ?? 1;

  const ahorroPctEfectivo = ahorroBase * fDigital * fHa;
  const prodPctEfectivo   = prodBase   * fDigital * fHa;

  // beneficios
  const ahorroMensual     = (gastoBase * (ahorroPctEfectivo / 100)) / 12;
  const incrementoMensual = (gastoBase * (prodPctEfectivo   / 100)) / 12;
  const beneficioMensual  = Math.max(0, (ahorroMensual + incrementoMensual) * multEscenario);

  // Inversión: auto vs plan vs manual
  const inversionAuto = calcularInversionInicial(superficieHa);
  const inversionPlan = (PLANES.find(p => p.id === planId)?.monto) ?? inversionAuto;
  const inversionInicial = modoInversion === "AUTO"
    ? inversionAuto
    : modoInversion === "PLAN"
      ? inversionPlan
      : Math.max(0, Number(inversionManual) || 0);

  // ROI año 1 / Payback
  const beneficioTotal   = beneficioMensual * 12;
  const roi              = inversionInicial > 0 ? ((beneficioTotal - inversionInicial) / inversionInicial) * 100 : 0;
  const paybackMeses     = beneficioMensual > 0 ? inversionInicial / beneficioMensual : Infinity;

  // comparación anual
  const mejoraAnual = beneficioMensual * 12;
  const baselineParaGrafico = evitarNegativosGrafico ? Math.max(0, baselineBase) : baselineBase;
  const conDigitalParaGrafico = evitarNegativosGrafico ? Math.max(0, baselineBase + mejoraAnual) : baselineBase + mejoraAnual;
  const dataChart = [
    { name: "Sin digitalización (ref.)", value: baselineParaGrafico },
    { name: "Con digitalización", value: conDigitalParaGrafico },
  ];

  // curva de payback según horizonte
  const HORIZONTE = horizonteMeses; // 24 o 36
  const curvaPayback = Array.from({ length: HORIZONTE + 1 }, (_, m) => ({
    mes: m,
    acumulado: -inversionInicial + beneficioMensual * m,
  }));
  const mesCruce = curvaPayback.find(d => d.acumulado >= 0)?.mes ?? null;

  // ROI acumulado al horizonte seleccionado
  const beneficioAcumHorizonte = beneficioMensual * horizonteMeses;
  const roiHorizonte = inversionInicial > 0
    ? ((beneficioAcumHorizonte - inversionInicial) / inversionInicial) * 100
    : 0;

  // datos para torta por tipo de labor
  const pieData = useMemo(() => {
    const d = bd?.desglose || {};
    return Object.entries(d)
      .filter(([k]) => k !== "TOTAL COSTOS")
      .map(([name, value]) => ({ name, value: Number(value) || 0 }))
      .filter((x) => x.value > 0);
  }, [bd]);

  const COLOR_MAP = {
    INSUMOS: "#16a34a",
    MAQUINARIAS: "#0ea5e9",
    ARRIENDO: "#f59e0b",
    FLETES: "#8b5cf6",
    "MANO DE OBRA": "#ef4444",
    "GENERALES (5%)": "#10b981",
    "COSTO FINANCIERO (12%)": "#64748b",
  };
  const FALLBACK_COLORS = ["#16a34a","#0ea5e9","#f59e0b","#8b5cf6","#ef4444","#10b981","#64748b"];
  const COLORS = pieData.map((p, i) => COLOR_MAP[p.name] || FALLBACK_COLORS[i % FALLBACK_COLORS.length]);

  // UX flags
  const isLoading = bdStatus === "loading";
  const isError   = bdStatus === "error" || !bdData?.cultivos;

  /* --- extras para Resumen Ejecutivo --- */
  const beneficioAnual = beneficioMensual * 12;
  const margenBaseAnual = baselineBase;
  const margenConDigital = baselineBase + beneficioAnual;
  const paybackMesesRed = Number.isFinite(paybackMeses) ? Math.max(0, Math.round(paybackMeses)) : null;
  const roiRed = isFinite(roi) ? roi.toFixed(1) : "0.0";

  /* ===================== UI ===================== */
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <section className="bg-emerald-700 text-white py-10 text-center">
        <h1 className="text-4xl font-extrabold">Calculadora de ROI agrícola</h1>
        <p className="mt-2 text-white/80">
          {bdData?.periodo
            ? `Fuente: Datos reales temporada ${bdData.periodo} — clientes BData`
            : "Cargando datos BData…"}
        </p>
        <div className="mt-4 flex items-center gap-2 justify-center">
          <button
            onClick={() => setModoSimple(!modoSimple)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            {modoSimple ? "🔬 Ver modo completo" : "⚡ Ver modo simple"}
          </button>
          {/* NUEVO: Botón ayuda */}
  <button
    onClick={() => setShowHelp(true)}
    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm transition"
  >
    📘 Ayuda / Glosario
  </button>
        </div>
      </section>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {isLoading && (
          <div className="p-8 text-center text-emerald-800">Cargando datos BData…</div>
        )}
        {isError && !isLoading && (
          <div className="p-8 text-center text-red-700">No se pudieron cargar los datos BData.</div>
        )}

        {!isLoading && !isError && (
          <section className="bg-white rounded-2xl border p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-emerald-800 mb-2">Simula tu escenario digital</h2>
            <p className="text-sm text-emerald-900/80 mb-5">
              {modoSimple
                ? "Ingresa tus datos básicos y obtén una estimación rápida del ROI."
                : "Mejoras estimadas con % de ahorro y productividad por cultivo, ajustadas por nivel de digitalización y superficie (escala continua)."}
            </p>

            {/* Controles */}
            <div className="bg-emerald-50/60 rounded-xl p-5 border border-emerald-100">
  {/* ── Fila principal de 4 campos ── */}
  <div className="grid md:grid-cols-4 gap-4">
    <InputNumber
      label="Superficie (ha)"
      tip={TIPS.superficie}
      value={superficieHa}
      onChange={(v) => setSuperficieHa(v)}
    />

    <SelectField
      label="Cultivo"
      tip={TIPS.cultivo}
      value={cultivo}
      onChange={(v) => setCultivo(v)}
      options={CULTIVOS.map((c) => [c, c.charAt(0) + c.slice(1).toLowerCase()])}
    />

    <SelectField
      label="Nivel de digitalización"
      tip={TIPS.nivelDigital}
      value={nivelDigital}
      onChange={(v) => setNivelDigital(v)}
      options={[
        ["BAJO", "Bajo (alto potencial)"],
        ["MEDIO", "Medio"],
        ["ALTO", "Alto (optimizado)"],
      ]}
    />

    <SelectField
      label="Escenario"
      tip={TIPS.escenario}
      value={escenario}
      onChange={(v) => setEscenario(v)}
      options={[
        ["CONSERVADOR", "Conservador"],
        ["REALISTA", "Realista"],
        ["OPTIMISTA", "Optimista"],
      ]}
    />
  </div>

  {/* ── Inversión inicial: modos y valor ── */}
  <div className="mt-4 bg-white rounded-lg border p-4">
    <div className="text-sm font-medium text-emerald-900 mb-2">
      <FieldLabel tip={TIPS.invMode}>Inversión inicial</FieldLabel>
    </div>

    <div className="flex flex-wrap items-center gap-4 text-sm">
      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          name="invMode"
          value="AUTO"
          checked={modoInversion === "AUTO"}
          onChange={() => setModoInversion("AUTO")}
        />
        Automática por superficie (actual:{" "}
        <span className="font-semibold">{fmtCLP(calcularInversionInicial(superficieHa))}</span>)
      </label>

      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          name="invMode"
          value="PLAN"
          checked={modoInversion === "PLAN"}
          onChange={() => setModoInversion("PLAN")}
        />
        Seleccionar plan
      </label>

      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          name="invMode"
          value="MANUAL"
          checked={modoInversion === "MANUAL"}
          onChange={() => setModoInversion("MANUAL")}
        />
        Monto manual
      </label>
    </div>

    {modoInversion === "PLAN" && (
      <div className="mt-3 grid md:grid-cols-2 gap-4">
        <SelectField
          label="Plan"
          tip={TIPS.invPlan}
          value={planId}
          onChange={(v) => setPlanId(v)}
          options={PLANES.map((p) => [p.id, `${p.nombre} — ${fmtCLP(p.monto)}`])}
        />
        <div className="self-end text-sm text-zinc-600">
          Inversión seleccionada:{" "}
          <span className="font-semibold text-emerald-700">
            {fmtCLP(PLANES.find((p) => p.id === planId)?.monto ?? 0)}
          </span>
        </div>
      </div>
    )}

    {modoInversion === "MANUAL" && (
      <div className="mt-3 md:w-1/2">
        <InputMoney
          label="Inversión (CLP)"
          tip={TIPS.invManual}
          value={inversionManual}
          onChange={(v) => setInversionManual(v)}
        />
      </div>
    )}
  </div>

  {/* ── Sliders paramétricos ── */}
  <div className="mt-4 bg-white rounded-lg border p-4">
    <label className="inline-flex items-center gap-2 text-sm text-emerald-900">
      <input
        type="checkbox"
        className="size-4"
        checked={usarSliders}
        onChange={(e) => setUsarSliders(e.target.checked)}
      />
      <span title={TIPS.slidersToggle}>Ajustar manualmente % de ahorro/productividad</span>
    </label>

    {usarSliders && (
      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <div>
          <FieldLabel tip={TIPS.ahorroPct}>% Ahorro (costos)</FieldLabel>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={ahorroUserPct}
            onChange={(e) => setAhorroUserPct(+e.target.value)}
            className="w-full"
          />
          <div className="text-sm text-emerald-800 mt-1">
            {ahorroUserPct}% • Ahorro mensual:{" "}
            {fmtCLP((costosHa * superficieHa * (ahorroUserPct / 100)) / 12)}
          </div>
        </div>

        <div>
          <FieldLabel tip={TIPS.prodPct}>% Productividad (valor)</FieldLabel>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={prodUserPct}
            onChange={(e) => setProdUserPct(+e.target.value)}
            className="w-full"
          />
          <div className="text-sm text-emerald-800 mt-1">
            {prodUserPct}% • Ingreso mensual extra:{" "}
            {fmtCLP((costosHa * superficieHa * (prodUserPct / 100)) / 12)}
          </div>
        </div>
      </div>
    )}

    {!modoSimple && (
      <div className="flex items-center gap-3 mt-4">
        <label className="inline-flex items-center gap-2 text-sm text-emerald-900">
          <input
            type="checkbox"
            className="size-4"
            checked={evitarNegativosGrafico}
            onChange={(e) => setEvitarNegativosGrafico(e.target.checked)}
          />
          <span title={TIPS.evitarNegativos}>Evitar negativos en gráfico</span>
        </label>
      </div>
    )}
  </div>
</div>


            {/* KPIs */}
            <div className="bg-white rounded-xl border border-zinc-200 p-5 mt-6">
              <h3 className="text-emerald-800 font-semibold mb-2">Resultados del cálculo</h3>
              <p className="text-sm text-zinc-600 mb-4">
                {modoSimple
                  ? "Tu inversión estimada es de " + fmtCLP(inversionInicial) + " según tu configuración."
                  : "Estimaciones según tu escenario. Inversión: " + fmtCLP(inversionInicial) + "."}
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <KPI label={<span title={TIPS.kpiGananciaMensual}>Ganancia extra mensual</span>} value={fmtCLP(beneficioMensual)} />
                <KPI label={<span title={TIPS.kpiRoi12}>ROI neto (12 meses)</span>} value={`${roiRed} %`} />
                <KPI label={<span title={TIPS.kpiPayback}>Recuperas inversión en</span>} value={Number.isFinite(paybackMeses) ? `${paybackMeses.toFixed(1)} meses` : "N/A"} />
              </div>
              {usarSliders && (
                <div className="text-xs text-emerald-700 mt-2">
                  Modelo ajustado por usuario: ahorro {ahorroUserPct}% · productividad {prodUserPct}%.
                </div>
              )}
            </div>

            {/* Resumen Ejecutivo */}
            <div className="mt-6 rounded-xl border p-5 bg-white">
              <h3 className="text-emerald-800 font-semibold mb-3">Resumen ejecutivo</h3>
              <div className="space-y-2 text-sm text-zinc-800">
                <p>
                  Para <strong>{cultivo.toLowerCase()}</strong> en <strong>{superficieHa} ha</strong>, con nivel de digitalización <strong>{nivelDigital.toLowerCase()}</strong> y escenario <strong>{SCENARIOS[escenario].label.toLowerCase()}</strong>:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li title={TIPS.resumenResultadoBase}><strong>Resultado anual actual (referencia):</strong> {fmtCLP(margenBaseAnual)}</li>
                  <li title={TIPS.resumenMejora}>
                    <strong>Mejora anual estimada por digitalización:</strong> {fmtCLP(beneficioAnual)}
                    {usarSliders && (
                      <span className="text-xs text-emerald-700"> — (ajustes: ahorro {ahorroUserPct}%, productividad {prodUserPct}%)</span>
                    )}
                  </li>
                  <li title={TIPS.resumenConDigital}><strong>Resultado anual con digitalización:</strong> {fmtCLP(margenConDigital)}</li>
                  <li><strong>Inversión inicial (modo {modoInversion.toLowerCase()}):</strong> {fmtCLP(inversionInicial)}</li>
                  <li><strong>Payback aproximado:</strong> {Number.isFinite(paybackMeses) ? `${Math.max(0, Math.round(paybackMeses))} meses` : "N/A"}</li>
                  <li><strong>ROI neto a 12 meses:</strong> {roiRed}%</li>
                  <li title={TIPS.resumenRoiHorizonte}><strong>Beneficio/ROI acumulado a {horizonteMeses} meses:</strong> {fmtCLP(beneficioAcumHorizonte)} • {isFinite(roiHorizonte) ? roiHorizonte.toFixed(1) : "0.0"}%</li>
                </ul>
                <p className="text-[12px] text-zinc-600">
                  El ROI anual puede ser negativo si la inversión se recupera después de 12 meses; para eso mostramos ROI acumulado (24/36m) y la curva de payback.
                </p>
              </div>
            </div>

            {/* Barras y Curva */}
            {!modoSimple && (
              <>
                <h3 className="mt-8 text-emerald-700 font-semibold">Comparación anual: sin vs con digitalización</h3>
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

                {/* Curva de payback */}
                <h3 className="mt-8 text-emerald-700 font-semibold">Curva de payback (flujo acumulado mensual)</h3>

                {/* Toggle horizonte */}
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-sm text-emerald-900" title={TIPS.horizonte}>Horizonte:</span>
                  <div className="inline-flex rounded-lg border overflow-hidden">
                    <button
                      onClick={() => setHorizonteMeses(24)}
                      className={`px-3 py-1 text-sm ${horizonteMeses === 24 ? "bg-emerald-600 text-white" : "bg-white hover:bg-zinc-50"}`}
                    >
                      24 meses
                    </button>
                    <button
                      onClick={() => setHorizonteMeses(36)}
                      className={`px-3 py-1 text-sm border-l ${horizonteMeses === 36 ? "bg-emerald-600 text-white" : "bg-white hover:bg-zinc-50"}`}
                    >
                      36 meses
                    </button>
                  </div>
                  <div className="text-xs text-zinc-600">
                    {Number.isFinite(paybackMeses)
                      ? (paybackMeses <= horizonteMeses
                          ? "Se recupera dentro del horizonte seleccionado."
                          : "No se recupera dentro del horizonte seleccionado.")
                      : "Payback no definido."}
                  </div>
                </div>

                {/* Chips informativos */}
                <div className="mt-2 text-sm text-emerald-900">
                  {Number.isFinite(paybackMeses) && (
                    <span className="inline-block bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 mr-2">
                      Payback ~ {Math.ceil(paybackMeses)} meses
                    </span>
                  )}
                  <span className="inline-block bg-indigo-50 border border-indigo-200 rounded-full px-3 py-1">
                    ROI acumulado a {horizonteMeses} meses: {isFinite(roiHorizonte) ? roiHorizonte.toFixed(1) : "0.0"}%
                  </span>
                </div>

                <div className="h-80 mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={curvaPayback}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis tickFormatter={(v) => abreviaCLP(v)} />
                      <Tooltip formatter={(v) => fmtCLP(v)} labelFormatter={(l) => `Mes ${l}`} />
                      <Line
                        type="monotone"
                        dataKey="acumulado"
                        stroke="#0ea5e9"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 5 }}
                      />
                      <ReferenceLine y={0} stroke="#64748b" strokeDasharray="4 4" />
                      {Number.isInteger(mesCruce) && (
                        <ReferenceLine
                          x={mesCruce}
                          stroke="#10b981"
                          strokeDasharray="4 4"
                          label={{ value: `Payback ~ mes ${mesCruce}`, position: "top", fill: "#065f46" }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Fuente + torta */}
                {bdData && (
                  <div className="mt-4 text-sm bg-white border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="font-medium text-emerald-800">
                        Fuente: Datos reales temporada {bdData.periodo} — clientes BData
                      </div>
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-medium">
                        v{bdData.version} • act. {bdData.updated_at}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600">
                      Metodología: costos totales por ha (incluye generales y costo financiero); ingresos separados; margen = ingresos − costos.
                    </p>
                  </div>
                )}

                {pieData.length > 0 && (
                  <>
                    <h3 className="mt-8 text-emerald-700 font-semibold" title={TIPS.tortaCostos}>Desglose de costos BData (CLP/ha)</h3>
                    <div className="h-80 mt-3">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {pieData.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={COLORS[idx]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v) => fmtCLP(v)} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Compartir */}
            <div className="mt-6 flex flex-wrap gap-3 justify-end">
              <button
                onClick={() => {
                  const q = encodeStateToQuery({
                    ha: superficieHa,
                    cultivo,
                    nivel: nivelDigital,
                    escenario,
                    sliders: usarSliders ? 1 : 0,
                    ahorro: ahorroUserPct,
                    prod: prodUserPct,
                    hz: horizonteMeses,
                    invMode: modoInversion,
                    plan: planId,
                    inv: inversionManual,
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
                    `Inversión: ${fmtCLP(inversionInicial)} (modo ${modoInversion.toLowerCase()})\n` +
                    `ROI neto (12 m): ${roiRed}%\n` +
                    `Payback: ${Number.isFinite(paybackMeses) ? `${paybackMeses.toFixed(1)} meses` : "N/A"}\n` +
                    `ROI acumulado a ${horizonteMeses} m: ${isFinite(roiHorizonte) ? roiHorizonte.toFixed(1) : "0.0"}%\n\n` +
                    `Link: ${window.location.origin}${window.location.pathname}?` +
                    encodeStateToQuery({
                      ha: superficieHa,
                      cultivo,
                      nivel: nivelDigital,
                      escenario,
                      sliders: usarSliders ? 1 : 0,
                      ahorro: ahorroUserPct,
                      prod: prodUserPct,
                      hz: horizonteMeses,
                      invMode: modoInversion,
                      plan: planId,
                      inv: inversionManual,
                    })
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-green-700 transition font-medium"
              >
                💬 Enviar por WhatsApp
              </a>
            </div>
          </section>
        )}
      </main>
      <HelpModal
        open={showHelp}
        onClose={() => setShowHelp(false)}
        tips={TIPS}
      />
    </div>
  );
}

/* ===================== UI helpers ===================== */
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
      <select className="w-full border rounded-lg p-2" value={value} onChange={(e) => onChange(e.target.value)}>
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


function HelpModal({ open, onClose, tips }) {
  const [tab, setTab] = useState("glosario"); // glosario | entradas | salidas | conceptos

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const ENTRADAS = [
    { k: "Superficie (ha)", d: "Hectáreas productivas consideradas. Base para escalar costos/ingresos." },
    { k: "Cultivo", d: "Selecciona el cultivo para traer costos/ingresos BData de la temporada." },
    { k: "Nivel de digitalización", d: "Ajusta el potencial de mejora. Bajo = mayor techo de ahorro/productividad." },
    { k: "Escenario", d: "Sensibilidad: Conservador/Realista/Optimista aplica un multiplicador a la mejora." },
    { k: "Inversión inicial", d: "Automática por superficie, por Plan BData o Manual para propuestas a medida." },
    { k: "Sliders de ahorro/productividad", d: "Modo avanzado para simular mejoras específicas (%)." },
  ];

  const SALIDAS = [
    { k: "Ganancia extra mensual", d: "Ahorro mensual + ingreso mensual extra tras mejoras." },
    { k: "ROI neto (12 meses)", d: "((beneficio 12m − inversión) / inversión). Puede ser negativo si el payback > 12m." },
    { k: "Payback", d: "Mes aproximado en que el flujo acumulado supera la inversión." },
    { k: "Curva de payback", d: "Flujo acumulado mensual. El cruce con 0 es el payback." },
    { k: "ROI acumulado a 24/36 meses", d: "Misma fórmula de ROI pero acumulando el horizonte elegido." },
    { k: "Torta de costos", d: "Desglose CLP/ha por tipo de labor para detectar focos de eficiencia." },
  ];

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className="absolute inset-x-0 top-8 mx-auto w-[min(900px,92vw)] rounded-2xl bg-white shadow-xl border">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-emerald-800">Ayuda / Glosario</h3>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-emerald-800 hover:bg-emerald-50"
          >
            ✕ Cerrar
          </button>
        </div>

        <div className="px-4 pt-3">
          <div className="inline-flex rounded-lg border overflow-hidden text-sm">
            <button
              className={`px-3 py-1 ${tab === "glosario" ? "bg-emerald-600 text-white" : "bg-white hover:bg-zinc-50"}`}
              onClick={() => setTab("glosario")}
            >
              Glosario rápido
            </button>
            <button
              className={`px-3 py-1 border-l ${tab === "entradas" ? "bg-emerald-600 text-white" : "bg-white hover:bg-zinc-50"}`}
              onClick={() => setTab("entradas")}
            >
              Entradas
            </button>
            <button
              className={`px-3 py-1 border-l ${tab === "salidas" ? "bg-emerald-600 text-white" : "bg-white hover:bg-zinc-50"}`}
              onClick={() => setTab("salidas")}
            >
              Salidas
            </button>
            <button
              className={`px-3 py-1 border-l ${tab === "conceptos" ? "bg-emerald-600 text-white" : "bg-white hover:bg-zinc-50"}`}
              onClick={() => setTab("conceptos")}
            >
              Conceptos clave
            </button>
          </div>
        </div>

        <div className="p-4 max-h-[70vh] overflow-auto text-sm text-zinc-800">
          {tab === "glosario" && (
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries({
                "Superficie (ha)": tips.superficie,
                "Cultivo": tips.cultivo,
                "Nivel de digitalización": tips.nivelDigital,
                "Escenario": tips.escenario,
                "Inversión inicial": tips.invMode,
                "Plan (inversión)": tips.invPlan,
                "Inversión manual": tips.invManual,
                "Sliders ahorro/productividad": tips.slidersToggle,
                "% Ahorro (costos)": tips.ahorroPct,
                "% Productividad (valor)": tips.prodPct,
                "Evitar negativos en gráfico": tips.evitarNegativos,
              }).map(([k, v]) => (
                <div key={k} className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3">
                  <div className="font-medium text-emerald-900">{k}</div>
                  <div className="text-zinc-700 mt-1">{v}</div>
                </div>
              ))}
            </div>
          )}

          {tab === "entradas" && (
            <ul className="space-y-2">
              {ENTRADAS.map((i) => (
                <li key={i.k} className="bg-white border rounded-lg p-3">
                  <div className="font-medium text-emerald-900">{i.k}</div>
                  <div className="text-zinc-700">{i.d}</div>
                </li>
              ))}
            </ul>
          )}

          {tab === "salidas" && (
            <ul className="space-y-2">
              {SALIDAS.map((i) => (
                <li key={i.k} className="bg-white border rounded-lg p-3">
                  <div className="font-medium text-emerald-900">{i.k}</div>
                  <div className="text-zinc-700">{i.d}</div>
                </li>
              ))}
            </ul>
          )}

          {tab === "conceptos" && (
            <div className="space-y-3">
              <ItemConcepto
                t="¿Por qué puede salir ROI negativo a 12 meses y aun así tener payback?"
                d="Si el payback ocurre después de los 12 meses, el beneficio del primer año no alcanza a cubrir la inversión. Por eso el ROI anual puede ser negativo — pero el ROI acumulado a 24/36 meses y la curva de payback cuentan la historia completa."
              />
              <ItemConcepto
                t="Ahorro vs. Productividad"
                d="Ahorro reduce costos; Productividad agrega valor (más kilos, mejor precio, menos pérdidas). Ambas se calculan como % sobre el gasto base y se convierten a CLP/mes."
              />
              <ItemConcepto
                t="Horizonte de evaluación"
                d="Usa 24 o 36 meses para alinear expectativas. Para proyectos con estacionalidad, el acumulado es más representativo que el eje anual."
              />
              <ItemConcepto
                t="Costos incluidos"
                d="Trabajamos con costos totales (insumos, mano de obra, fletes, maquinarias, arriendo, generales, costo financiero). Así el 'Número total' le hace sentido al agricultor."
              />
            </div>
          )}
        </div>

        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-[12px] text-zinc-500">
            Fuente: Datos reales temporada 2024–2025 — clientes BData. La realidad puede variar por manejo, clima y mercado.
          </div>
          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 text-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

function ItemConcepto({ t, d }) {
  return (
    <div className="bg-emerald-50/40 border border-emerald-100 rounded-lg p-3">
      <div className="font-semibold text-emerald-900">{t}</div>
      <div className="text-zinc-700">{d}</div>
    </div>
  );
}
