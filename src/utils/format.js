export const fmtCLP = (n) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);

export const fmtPct = (n) =>
  `${(n*100).toFixed(0)}%`;
