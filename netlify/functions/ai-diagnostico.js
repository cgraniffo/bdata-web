// /netlify/functions/ai-diagnostico.js
// ESM (package.json tiene "type":"module")

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Pequeña ayuda para armar el prompt con lo que llega del front
function renderPrompt({
  cultivo,
  superficieHa,
  nivelDigital,
  escenario,
  beneficioMensual,
  ahorroMensual,
  incrementoMensual,
  inversionInicial,
  paybackMeses,
  horizonteMeses,
  diagnosticoReglas,
}) {
  const fmt = (n) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(n || 0));

  // Texto corto a partir de las reglas para que el modelo “no se pierda”.
  const reglas = diagnosticoReglas
    ? `Intensidad: ${diagnosticoReglas.intensidad}.
Reparto: ${diagnosticoReglas.reparto?.operativo ?? "?"} operativo / ${
        diagnosticoReglas.reparto?.insumos ?? "?"
      } insumos.
Lead: ${diagnosticoReglas.lead}
Interpretación: ${diagnosticoReglas.interpretacion}
Recomendaciones: ${(diagnosticoReglas.recomendacion || []).join("; ")}`.trim()
    : "Sin reglas detalladas.";

  return `
Eres un consultor agrícola especializado en transformación digital. Redacta **1–2 párrafos (80–120 palabras)** con tono profesional y cercano.
Objetivo: diagnóstico claro y accionable para un productor enfocado en digitalización de su campo.

Contexto:
- Cultivo: ${cultivo}. Superficie: ${superficieHa} ha. Nivel digital: ${nivelDigital}. Escenario: ${escenario}.
- Ganancia extra mensual: ${fmt(beneficioMensual)} (ahorro: ${fmt(ahorroMensual)}, productividad: ${fmt(incrementoMensual)}).
- Inversión inicial: ${fmt(inversionInicial)}. Payback aprox.: ${
    Number.isFinite(paybackMeses) ? `${paybackMeses.toFixed(1)} meses` : "N/A"
  }.
- Horizonte: ${horizonteMeses} meses.

Hallazgos por reglas:
${reglas}

Incluye:
1) Foco (operativo vs. insumos) con una frase clara.
2) Tres recomendaciones puntuales (entre comas).
3) Cierre con resultado esperado (payback/beneficio) sin prometer imposibles.
Evita adjetivos vacíos y tecnicismos innecesarios.
`.trim();
}

// Netlify (ESM): exporta handler
export async function handler(event) {
  // CORS simple para dev (mismo origen en Netlify dev, pero por si acaso)
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  };

  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: "Method Not Allowed" }) };
    }

    const body = JSON.parse(event.body || "{}");

    const prompt = renderPrompt({
      cultivo: body.cultivo,
      superficieHa: body.superficieHa,
      nivelDigital: body.nivelDigital,
      escenario: body.escenario,
      beneficioMensual: body.beneficioMensual,
      ahorroMensual: body.ahorroMensual,
      incrementoMensual: body.incrementoMensual,
      inversionInicial: body.inversionInicial,
      paybackMeses: body.paybackMeses,
      horizonteMeses: body.horizonteMeses,
      diagnosticoReglas: body.diagnosticoReglas,
    });

    const resp = await client.responses.create({
      model: process.env.OPENAI_TEXT_MODEL || "gpt-4.1-mini",
      input: prompt,
    });

    const text = resp.output_text?.trim?.() || "";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, text }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: (err && (err.message || err.toString())) || "Unknown error" }),
    };
  }
}

