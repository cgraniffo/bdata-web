// netlify/functions/ai-diagnostico.js
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/** Tabla fija de factores por nivel digital x cultivo */
const FACTOR_INTENSIDAD = {
  BAJO:  { default: 1.30, TRIGO: 1.40, MAIZ: 1.35, PAPA: 1.32, CEREZOS: 1.20, ARANDANOS: 1.22, AVENA: 1.35, RAPS: 1.28 },
  MEDIO: { default: 1.15, TRIGO: 1.20, MAIZ: 1.18, PAPA: 1.15, CEREZOS: 1.10, ARANDANOS: 1.12, AVENA: 1.18, RAPS: 1.15 },
  ALTO:  { default: 1.05, TRIGO: 1.05, MAIZ: 1.06, PAPA: 1.05, CEREZOS: 1.03, ARANDANOS: 1.03, AVENA: 1.05, RAPS: 1.05 }
};

function getFactor(nivel = "MEDIO", cultivo = "") {
  const lvl = String(nivel || "").toUpperCase();
  const crop = String(cultivo || "").toUpperCase();
  const table = FACTOR_INTENSIDAD[lvl] || FACTOR_INTENSIDAD.MEDIO;
  return Number(table[crop] ?? table.default ?? 1.0);
}

function fmtCLP(n) {
  try {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(n) || 0);
  } catch {
    return `$${Number(n || 0).toLocaleString("es-CL")}`;
  }
}

/** Redondeo amigable para CLP mensuales */
const round0 = (n) => Math.round(Number(n || 0));

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: "Method not allowed" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const {
      cultivo,                // ej: "TRIGO"
      superficieHa,          // ej: 120
      nivelDigital,          // ej: "BAJO" | "MEDIO" | "ALTO"
      escenario,             // ej: "REALISTA"
      beneficioMensual,      // CLP/mes (puede venir calculado por tu lógica)
      ahorroMensual,         // opcional
      incrementoMensual,     // opcional
      inversionInicial,      // CLP (one-off)
      paybackMeses,          // puede venir calculado por tu flujo
      horizonteMeses,        // ej: 24
      diagnosticoReglas: diag
    } = body;

    if (!diag || !cultivo || superficieHa == null) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: "Faltan campos requeridos" }) };
    }

    // 1) Factor por intensidad digital (fijo, previo al prompt)
    const factor = getFactor(nivelDigital, cultivo);

    // 2) Ajustar beneficios (mantener null/undefined si no venían)
    const beneficioMensualAdj  = beneficioMensual != null ? round0(beneficioMensual * factor) : null;
    const ahorroMensualAdj     = ahorroMensual    != null ? round0(ahorroMensual    * factor) : null;
    const incrementoMensualAdj = incrementoMensual!= null ? round0(incrementoMensual* factor) : null;

    // 3) Recalcular payback si tenemos inversión y beneficio ajustado
    let paybackMesesAdj = paybackMeses;
    if (inversionInicial != null && beneficioMensualAdj && beneficioMensualAdj > 0) {
      paybackMesesAdj = +(inversionInicial / beneficioMensualAdj).toFixed(1);
    }

    // 4) Construir prompt con cifras ya ajustadas (IA solo redacta)
    const paybackTxt = Number.isFinite(paybackMesesAdj) ? `${paybackMesesAdj.toFixed(1)} meses` : "N/A";
    const beneficioTxt = beneficioMensualAdj != null ? fmtCLP(beneficioMensualAdj) : "s/i";
    const ahorroTxt    = ahorroMensualAdj    != null ? fmtCLP(ahorroMensualAdj)    : "s/i";
    const incrTxt      = incrementoMensualAdj!= null ? fmtCLP(incrementoMensualAdj): "s/i";

    const prompt = `
Eres consultor agrícola. Redacta un diagnóstico breve (1–2 párrafos, máx. 120 palabras).
Estilo: TÁCTICO (viñetas cortas, verbos de acción, sin relleno).

Contexto:
- Cultivo: ${cultivo}. Superficie: ${superficieHa} ha. Nivel digital: ${nivelDigital || "desconocido"}. Escenario: ${escenario || "N/A"}.
- Beneficio mensual ajustado (mapa intensidad): ${beneficioTxt}. Ahorro: ${ahorroTxt}. Incremento: ${incrTxt}.
- Inversión: ${fmtCLP(inversionInicial)}. Payback aprox.: ${paybackTxt}. Horizonte: ${horizonteMeses ?? "N/A"} meses.
- Diagnóstico por reglas: Intensidad ${diag.intensidad}. Reparto: ${diag.reparto?.operativo} operativo / ${diag.reparto?.insumos} insumos.
- Lead: ${diag.lead}
- Recomendaciones sugeridas: ${Array.isArray(diag.recomendacion) ? diag.recomendacion.join("; ") : ""}

Redacta con foco en: foco principal (operativo/insumos), 3 acciones concretas y cierre con resultado esperado.
No repitas números innecesarios. No uses títulos. Sin emojis. Español neutro.
`.trim();

    // 5) Llamada a OpenAI (Responses API) sin temperature/top_p
    const resp = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const text = resp.output_text ?? (resp.output?.[0]?.content?.[0]?.text || "");
    if (!text) {
      return { statusCode: 502, body: JSON.stringify({ ok: false, error: "La IA no devolvió texto" }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        text,
        // útil si quieres ver el ajuste (puedes quitarlo si no quieres exponerlo)
        meta: {
          factor_intensidad: factor,
          beneficioMensual_ajustado: beneficioMensualAdj,
          ahorroMensual_ajustado: ahorroMensualAdj,
          incrementoMensual_ajustado: incrementoMensualAdj,
          paybackMeses_ajustado: paybackMesesAdj
        }
      }),
    };
  } catch (err) {
    console.error("ai-diagnostico error:", err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(err.message || err) }) };
  }
}
