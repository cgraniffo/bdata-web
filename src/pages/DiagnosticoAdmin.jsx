// src/pages/DiagnosticoAdmin.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

function toCSV(rows) {
  const headers = [
    "fecha_iso","nombre","telefono","region","rubro","score","max","pct","nivel","por_seccion"
  ];
  const escape = (v="") => `"${String(v).replaceAll('"','""')}"`;
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push([
      r.ts, r.nombre, r.telefono, r.region, r.rubro,
      r.score, r.max, r.pct,
      r.nivel?.label || r.nivel?.id || "",
      (r.porSeccion||[]).map(s=>`${s.titulo}:${s.pct}%`).join(" | ")
    ].map(escape).join(","));
  }
  return lines.join("\n");
}

export default function DiagnosticoAdmin() {
  // ⚠️ Candado sencillo por query: /diagnostico-admin?key=TU_CLAVE
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const ok = params.get("key") === import.meta.env.VITE_ADMIN_KEY;
  if (!ok) {
    return <div className="p-6">No autorizado.</div>;
  }

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [nivel, setNivel] = useState("");
  const [region, setRegion] = useState("");
  const [rubro, setRubro] = useState("");
  const [searchTxt, setSearchTxt] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await fetch("/.netlify/functions/diagnostico-list?limit=300");
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.error || "Error listando");
        if (live) setData(json.items || []);
      } catch (e) {
        setErr(e.message);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
  }, []);

  const regiones = useMemo(() => Array.from(new Set(data.map(d=>d.region).filter(Boolean))).sort(), [data]);
  const rubros   = useMemo(() => Array.from(new Set(data.map(d=>d.rubro).filter(Boolean))).sort(), [data]);

  const filtrados = useMemo(() => {
    return data
      .filter(d => !nivel  || (d.nivel?.id===nivel || d.nivel?.label===nivel))
      .filter(d => !region || d.region===region)
      .filter(d => !rubro  || d.rubro===rubro)
      .filter(d => {
        if (!searchTxt.trim()) return true;
        const q = searchTxt.trim().toLowerCase();
        return [d.nombre,d.telefono,d.region,d.rubro,d.nivel?.label]
          .filter(Boolean).some(v => String(v).toLowerCase().includes(q));
      });
  }, [data, nivel, region, rubro, searchTxt]);

  const kpis = useMemo(() => {
    const total = filtrados.length;
    const prom  = total ? Math.round(filtrados.reduce((a,b)=>a+(b.pct||0),0)/total) : 0;
    const porNivel = filtrados.reduce((acc,d)=>{
      const key = d.nivel?.label || d.nivel?.id || "N/D";
      acc[key] = (acc[key]||0)+1; return acc;
    }, {});
    return { total, prom, porNivel };
  }, [filtrados]);

  const exportarCSV = () => {
    const blob = new Blob([toCSV(filtrados)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "diagnosticos_bdata.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-2xl font-bold text-emerald-700">Panel Diagnóstico Digital</h1>
      <p className="text-slate-600 mb-4">Vista interna para revisar respuestas guardadas.</p>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
        <select className="rounded-lg border-slate-300" value={nivel} onChange={e=>setNivel(e.target.value)}>
          <option value="">Nivel (todos)</option>
          <option value="Inicial">Inicial</option>
          <option value="Básico">Básico</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
        <select className="rounded-lg border-slate-300" value={region} onChange={e=>setRegion(e.target.value)}>
          <option value="">Región (todas)</option>
          {regiones.map(r => <option key={r}>{r}</option>)}
        </select>
        <select className="rounded-lg border-slate-300" value={rubro} onChange={e=>setRubro(e.target.value)}>
          <option value="">Rubro (todos)</option>
          {rubros.map(r => <option key={r}>{r}</option>)}
        </select>
        <input className="rounded-lg border-slate-300" placeholder="Buscar nombre/teléfono…" value={searchTxt} onChange={e=>setSearchTxt(e.target.value)} />
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-lg text-white bg-emerald-600" onClick={exportarCSV}>Exportar CSV</button>
          <button className="px-3 py-2 rounded-lg ring-1 ring-slate-300" onClick={()=>{setNivel("");setRegion("");setRubro("");setSearchTxt("");}}>Limpiar</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="p-4 rounded-xl ring-1 ring-slate-200 bg-white">
          <div className="text-sm text-slate-500">Respuestas</div>
          <div className="text-2xl font-semibold">{kpis.total}</div>
        </div>
        <div className="p-4 rounded-xl ring-1 ring-slate-200 bg-white">
          <div className="text-sm text-slate-500">% Promedio</div>
          <div className="text-2xl font-semibold">{kpis.prom}%</div>
        </div>
        <div className="p-4 rounded-xl ring-1 ring-slate-200 bg-white">
          <div className="text-sm text-slate-500">Distribución por nivel</div>
          <div className="flex gap-2 flex-wrap mt-1">
            {Object.entries(kpis.porNivel).map(([k,v])=>(
              <span key={k} className="px-2 py-1 text-sm rounded-full ring-1 ring-slate-200 bg-slate-50">{k}: {v}</span>
            ))}
            {!Object.keys(kpis.porNivel).length && <span className="text-slate-400">—</span>}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl ring-1 ring-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="p-3">Fecha</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3">Región</th>
              <th className="p-3">Rubro</th>
              <th className="p-3">% / Nivel</th>
              <th className="p-3">Secciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td className="p-3" colSpan={7}>Cargando…</td></tr>}
            {err && !loading && <tr><td className="p-3 text-rose-600" colSpan={7}>Error: {err}</td></tr>}
            {!loading && !err && filtrados.map((r)=>(
              <tr key={r.key} className="border-t">
                <td className="p-3">{new Date(r.ts).toLocaleString("es-CL")}</td>
                <td className="p-3">{r.nombre}</td>
                <td className="p-3">{r.telefono}</td>
                <td className="p-3">{r.region || "—"}</td>
                <td className="p-3">{r.rubro  || "—"}</td>
                <td className="p-3 font-medium">{r.pct}% · {r.nivel?.label || r.nivel?.id}</td>
                <td className="p-3 text-slate-600">
                  {(r.porSeccion||[]).map(s=>`${s.titulo}:${s.pct}%`).join(" | ")}
                </td>
              </tr>
            ))}
            {!loading && !err && !filtrados.length && (
              <tr><td className="p-3 text-slate-500" colSpan={7}>Sin resultados con esos filtros.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
