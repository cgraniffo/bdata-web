// /src/components/Plans.jsx
// Nota: no necesitas importar React para un componente de función moderno.

export function PlanRecommendation({ nivel, pct, className = "" }) {
  // Regla simple: si pct < 60 -> Doble Raíz; si no -> Cosecha
  const plan =
    typeof pct === "number"
      ? pct < 60
        ? "raiz"
        : "cosecha"
      : (String(nivel).toLowerCase().includes("inicial") ||
          String(nivel).toLowerCase().includes("básico") ||
          String(nivel).toLowerCase().includes("basico"))
      ? "raiz"
      : "cosecha";

  const isRaiz = plan === "raiz";

  return (
    <div className={`rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm ${className}`}>
      <div className="text-sm text-slate-600">Sugerencia BData</div>
      <h4 className="mt-1 text-lg font-bold text-slate-900">
        {isRaiz ? "Doble Raíz Digital" : "Plan Cosecha"}
      </h4>
      <p className="mt-2 text-sm text-slate-700">
        {isRaiz
          ? "Comienza con adopción real en comunidad junto a consultor senior + método BData."
          : "Acompañamiento 1:1 con KPI en CLP y orquestación de datos para decisiones con ROI."}
      </p>

      <div className="mt-3 flex gap-2">
        <a
          href={isRaiz ? "/planes#raiz" : "/planes#cosecha"}
          className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Ver {isRaiz ? "Doble Raíz" : "Cosecha"}
        </a>
        <a
          href="#contacto"
          className="rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Consultar
        </a>
      </div>

      {(typeof pct === "number" || nivel) && (
        <div className="mt-2 text-xs text-slate-500">
          {typeof pct === "number" ? `Diagnóstico: ${pct}%` : `Nivel: ${String(nivel)}`}
        </div>
      )}
    </div>
  );
}
