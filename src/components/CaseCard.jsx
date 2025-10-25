// src/components/CaseCard.jsx
import { Link } from "react-router-dom";

// Paleta por plan (colores suaves de hover y chapita)
const PLAN_STYLES = {
  agro: {
    badge: { text: "Plan Cosecha🌾", bg: "bg-emerald-600", ring: "ring-emerald-200" },
    hover: "hover:bg-emerald-50",
    ringHover: "hover:ring-emerald-100",
  },
  semilla: {
    badge: { text: "Plan Doble Raíz Digital🤝🏼", bg: "bg-amber-600", ring: "ring-amber-200" },
    hover: "hover:bg-amber-50",
    ringHover: "hover:ring-amber-100",
  },
  red: {
    badge: { text: "Plan Doble Raíz Digital🤝🏼", bg: "bg-amber-600", ring: "ring-amber-200" },
    hover: "hover:bg-amber-50",
    ringHover: "hover:ring-amber-100",
  },
};

function fmtCLP(n) {
  if (n == null || isNaN(n)) return "-";
  return n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}
function pct(v) {
  if (v == null || isNaN(v)) return "-";
  const sign = v > 0 ? "+" : "";
  return `${sign}${(v * 100).toFixed(0)}%`;
}

export default function CaseCard({ item }) {
  const {
    plan = "agro",
    title,
    image,
    summary,
    crop,
    region,
    client_size,
    kpis = {},
    stack = [],
    source_label,
    source_url,
  } = item || {};

  const theme = PLAN_STYLES[plan] ?? PLAN_STYLES.agro;

  return (
    <div
      className={[
        "card transition-all duration-200",
        "ring-1 ring-zinc-200",
        theme.hover,
        theme.ringHover,
        "hover:shadow-md",
      ].join(" ")}
    >
      {/* Imagen + chapita del plan */}
      <div className="relative">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover rounded-lg"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-48 rounded-lg bg-zinc-100" />
        )}

        <span
          className={[
            "absolute top-3 right-3 text-white text-xs font-medium px-2 py-1 rounded-md shadow-sm",
            theme.badge.bg,
          ].join(" ")}
        >
          {theme.badge.text}
        </span>
      </div>

      {/* Título */}
      <h3 className="font-semibold text-lg mt-3">{title}</h3>

      {/* Resumen */}
      <p className="text-zinc-600 text-sm mt-1">{summary}</p>

      {/* Chips de contexto */}
      <div className="flex flex-wrap gap-2 mt-3">
        {crop && <Chip>{crop}</Chip>}
        {region && <Chip>{region}</Chip>}
        {client_size && <Chip>{client_size}</Chip>}
      </div>

      {/* Stack */}
      {stack?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {stack.map((s) => (
            <Chip key={s} muted>
              {s}
            </Chip>
          ))}
        </div>
      )}

      {/* KPIs (muestra lo que venga) */}
      <ul className="mt-3 text-sm text-zinc-700 list-disc list-inside space-y-1">
        {"productividad" in kpis && (
          <li>
            Productividad: <strong>{pct(kpis.productividad)}</strong>
          </li>
        )}
        {"ahorro_insumos" in kpis && (
          <li>
            Ahorro en insumos: <strong>{pct(kpis.ahorro_insumos)}</strong>
          </li>
        )}
        {"merma" in kpis && (
          <li>
            Merma: <strong>{pct(kpis.merma)}</strong>
          </li>
        )}
        {"rotura_stock" in kpis && (
          <li>
            Rotura de stock: <strong>{pct(kpis.rotura_stock)}</strong>
          </li>
        )}
        {"visibilidad_costos" in kpis && (
          <li>
            Visibilidad de costos: <strong>{pct(kpis.visibilidad_costos)}</strong>
          </li>
        )}
        {"costo_anual" in kpis && (
          <li>
            Costo anual del plan: <strong>{fmtCLP(kpis.costo_anual)}</strong>
          </li>
        )}
      </ul>

      {/* Fuente (link sólo si viene URL) */}
      <div className="mt-3 text-xs text-zinc-500">
        {source_url ? (
          <a
            href={source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-zinc-700"
          >
            Fuente: {source_label}
          </a>
        ) : (
          <span>Fuente: {source_label}</span>
        )}
      </div>
    </div>
  );
}

function Chip({ children, muted = false }) {
  return (
    <span
      className={[
        "px-2 py-1 rounded-md text-xs transition-all duration-200 ease-out cursor-default select-none",
        "hover:-translate-y-[1px] hover:shadow-sm",
        muted
          // Chips contextuales (región, tipo de cliente, etc.)
          ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
          // Chips activos (tecnologías, resultados, KPIs)
          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800",
      ].join(" ")}
    >
      {children}
    </span>
  );
}


