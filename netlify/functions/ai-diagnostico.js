// netlify/functions/ai-diagnostico.js
// Modo sencillo: usa fetch directo a la API de OpenAI (sin dependencias).
// Responde:
//  - GET  -> ping (para probar que la función está viva)
//  - POST -> genera redacción con IA en "chileno", con fallback de reglas si falla

export async function handler(event) {
  // --- Healthcheck / prueba rápida en el navegador ---
  if (event.httpMethod === "GET") {
    return json({ ok: true, ping: "ai-diagnostico vivo 🟢" });
  }

  if (event.httpMethod !== "POST") {
    return json({ ok: false, error: "Método no permitido" }, 405);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // No reventamos la UI: devolvemos un mensaje claro
    return json({
      ok: false,
      error: "Falta OPENAI_API_KEY en .env",
    }, 200);
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return json({ ok: false, error: "JSON inválido" }, 400);
  }

  // Datos que vienen del front (adecuados a lo que ya envías)
  const {
    cultivo = "RAPS",
    superficieHa = 0,
    nivelDigital = "BAJO",
    escenario = "REALISTA",
    beneficioMensual = 0,
    inversionInicial = 0,
    paybackMeses = null,
    horizonteMeses = 24,
    diagnosticoReglas = null, // { intensidad, reparto, lead, interpretacion, recomendacion[] , estimacion? }
  } = payload;

  // Armamos un prompt breve, “en chileno”, con tope de 120 palabras
  const leadReglas = diagnosticoReglas?.lead || "";
  const interpReglas = diagnosticoReglas?.interpretacion || "";
  const repartoOp = diagnosticoReglas?.reparto?.operativo || "";
  const repartoIns = diagnosticoReglas?.reparto?.insumos || "";
  const recos = (diagnosticoReglas?.recomendacion || []).join("; ");

  const prompt = `
Eres un asesor agrícola chileno especializado en Transformación digital. Redacta un diagnóstico corto (máx 120 palabras), claro y aterrizado, en español de Chile.
Tono: profesional y directo. Incluye foco principal, 3 recomendaciones concretas y cierre con resultado esperado, orientado a digitalización.

Contexto del campo:
- Cultivo: ${cultivo}. Superficie: ${superficieHa} ha. Nivel digital: ${nivelDigital}. Escenario: ${escenario}.
- Ganancia extra mensual estimada: ${formatCLP(beneficioMensual)}. Inversión: ${formatCLP(inversionInicial)}.
- Payback aprox: ${Number.isFinite(paybackMeses) ? `${paybackMeses.toFixed(1)} meses` : "N/A"}. Horizonte: ${horizonteMeses} meses.

Señales de reglas (guía, no repitas textualmente):
- Reparto oportunidad: ${repartoOp} operativo / ${repartoIns} insumos.
- Lead: ${leadReglas}
- Interpretación: ${interpReglas}
- Recomendaciones sugeridas: ${recos}

Formato de salida:
- 1–2 párrafos, 80–120 palabras.
- “En chileno”, sin florituras, sin tecnicismos innecesarios.
- Debe terminar con una recomendación accionable de siguiente paso.
`;

  try {
    // Llamado simple a Chat Completions
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",        // liviano y barato; cámbialo si prefieres otro
        temperature: 0.7,
        max_tokens: 260,
        messages: [
          { role: "system", content: "Eres un asesor agrícola chileno, claro y práctico." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!resp.ok) {
      const errTxt = await resp.text().catch(() => "");
      // devolvemos fallback si OpenAI no respondió bien
      return json({
        ok: false,
        error: `OpenAI no respondió (${resp.status}).`,
        detail: errTxt?.slice(0, 400),
        // fallback corto con reglas para no romper la UX:
        text: redactarFallback({
          cultivo,
          superficieHa,
          nivelDigital,
          beneficioMensual,
          inversionInicial,
          paybackMeses,
          diagnosticoReglas,
        }),
      }, 200);
    }

    const data = await resp.json();
    const text =
      data?.choices?.[0]?.message?.content?.trim() ||
      redactarFallback({
        cultivo,
        superficieHa,
        nivelDigital,
        beneficioMensual,
        inversionInicial,
        paybackMeses,
        diagnosticoReglas,
      });

    return json({ ok: true, text }, 200);
  } catch (e) {
    // Timeout / conexión / etc. → devolvemos fallback
    return json({
      ok: false,
      error: "TypeError: fetch failed",
      text: redactarFallback({
        cultivo,
        superficieHa,
        nivelDigital,
        beneficioMensual,
        inversionInicial,
        paybackMeses,
        diagnosticoReglas,
      }),
    }, 200);
  }
}

/* ----------------- Helpers ----------------- */
function json(body, status = 200) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  };
}

function formatCLP(n) {
  try {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(Number(n) || 0);
  } catch {
    return `$${Number(n) || 0}`;
  }
}

// Fallback con reglas (por si falla OpenAI). Mantiene la UX andando.
function redactarFallback({ cultivo, superficieHa, nivelDigital, beneficioMensual, inversionInicial, paybackMeses, diagnosticoReglas }) {
  const repOp = diagnosticoReglas?.reparto?.operativo || "—";
  const repIns = diagnosticoReglas?.reparto?.insumos || "—";
  const lead = diagnosticoReglas?.lead || "";
  const recos = diagnosticoReglas?.recomendacion || [];
  const rec1 = recos[0] || "Estandarizar bitácoras y órdenes de trabajo";
  const rec2 = recos[1] || "Visibilidad diaria del avance vs. plan";
  const rec3 = recos[2] || "Conectar registros a costos reales";

  const payTxt = Number.isFinite(paybackMeses) ? `${paybackMeses.toFixed(1)} meses` : "N/A";

  return `Para ${cultivo.toLowerCase()} en ${superficieHa} ha y nivel ${nivelDigital.toLowerCase()}, la oportunidad se reparte ${repOp} en lo operativo y ${repIns} en insumos. ${lead}
Sugerencias: ${rec1}; ${rec2}; ${rec3}. Ganancia mensual estimada: ${formatCLP(beneficioMensual)} con inversión ${formatCLP(inversionInicial)}. Payback aprox: ${payTxt}. Siguiente paso: define KPIs simples (costo/ha, avance semanal) y parte con bitácoras digitales en terreno.`;
}
