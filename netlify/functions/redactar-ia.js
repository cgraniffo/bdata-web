// netlify/functions/redactar-ia.js
// Función Netlify clásica (Node/Lambda). JS puro, sin tipos.

// Nota: en Netlify Functions la firma es (event, context) y se responde con { statusCode, body }

export async function handler(event, context) {
  try {
    if (event.httpMethod !== "POST") {
      return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return json({ ok: false, error: "MISSING_KEY" }, 500);
    }

    let payload = {};
    try {
      payload = JSON.parse(event.body || "{}");
    } catch (_) {
      return json({ ok: false, error: "BAD_JSON" }, 400);
    }

    const { diag, context: ctx } = payload;

    // Guardas básicos
    const cultivo = ctx?.cultivo ?? "Cultivo";
    const ha = ctx?.superficieHa ?? 0;
    const nivel = ctx?.nivelDigital ?? "BAJO";
    const escenario = ctx?.escenario ?? "REALISTA";

    const kpiMensual = numCLP(ctx?.beneficioMensual ?? 0);
    const kpiRoi12 = ctx?.roiRed ?? "0.0";
    const kpiPayback = ctx?.paybackTxt ?? "N/A";

    const intensidad = diag?.intensidad ?? "medio";
    const repartoOp = diag?.reparto?.operativo ?? "—";
    const repartoIns = diag?.reparto?.insumos ?? "—";
    const interpretacion = diag?.interpretacion ?? "";
    const lead = diag?.lead ?? "";
    const estimacion = diag?.estimacion ?? "";
    const recomendaciones = Array.isArray(diag?.recomendacion) ? diag.recomendacion : [];

    const prompt = [
      `Eres un consultor agrícola. Redacta un diagnóstico breve, claro y empático para un productor.`,
      ``,
      `Datos:`,
      `• Cultivo: ${cultivo}`,
      `• Superficie: ${ha} ha`,
      `• Nivel de digitalización: ${nivel}`,
      `• Escenario: ${escenario.toLowerCase()}`,
      `• Intensidad estimada: ${intensidad}`,
      `• Reparto de oportunidad: ${repartoOp} operativo · ${repartoIns} insumos`,
      `• Interpretación base: ${interpretacion}`,
      `• Lead: ${lead}`,
      `• Estimación: ${estimacion}`,
      `• KPIs: Ganancia/mes ${kpiMensual} · ROI 12m ${kpiRoi12}% · Payback ${kpiPayback}`,
      `• Recomendaciones sugeridas: ${recomendaciones.map((r, i) => `${i + 1}. ${r}`).join(" ")}`,
      ``,
      `Redacta en español chileno, sin promesas grandilocuentes.`,
      `Formato EXACTO de salida (sin encabezados, sin emojis):`,
      `1) Párrafo de 2–3 oraciones con el diagnóstico y el porqué.`,
      `2) Lista corta (3–4 viñetas) de acciones concretas.`,
      `3) Cierre con un rango realista de mejora (una sola línea).`,
    ].join("\n");

    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: prompt,
        temperature: 0.7,
        max_output_tokens: 450,
      }),
    });

    if (!resp.ok) {
      const errTxt = await resp.text().catch(() => "");
      console.error("OpenAI error:", resp.status, errTxt);
      return json({ ok: false, error: "OPENAI_HTTP_" + resp.status }, 502);
    }

    const data = await resp.json();
    const texto = (data?.output_text ?? "").toString().trim();

    if (!texto) return json({ ok: false, error: "EMPTY_OUTPUT" }, 502);

    return json({ ok: true, texto }, 200);
  } catch (e) {
    console.error("fn redactar-ia error", e);
    return json({ ok: false, error: "FUNCTION_EXCEPTION" }, 500);
  }
}

function json(obj, statusCode = 200) {
  return {
    statusCode,
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(obj),
  };
}

function numCLP(n) {
  try {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n || 0);
  } catch {
    return `$${Math.round(n || 0)}`;
  }
}
