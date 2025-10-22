// netlify/functions/ai-diagnostico.js
// ESM ✅ — Usa OPENAI_API_KEY (+ opcional OPENAI_MODEL) desde .env

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const TIMEOUT_MS = 25_000;

/* ------------- CORS helpers ------------- */
const allowCors = (res) => ({
  ...res,
  headers: {
    ...(res.headers || {}),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  },
});

const badReq = (msg) =>
  allowCors({
    statusCode: 400,
    body: JSON.stringify({ ok: false, text: msg }),
  });

/* ------------- Handler ------------- */
export async function handler(event) {
  // Preflight
  if (event.httpMethod === "OPTIONS") {
    return allowCors({ statusCode: 204, body: "" });
  }
  if (event.httpMethod !== "POST") {
    return badReq("Método no permitido. Usa POST.");
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return badReq("Falta OPENAI_API_KEY en variables de entorno.");

  // Parse payload
  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return badReq("JSON inválido.");
  }

  const {
    cultivo,
    superficieHa,
    nivelDigital,
    escenario,
    beneficioMensual = 0,
    inversionInicial = 0,
    paybackMeses,
    horizonteMeses,
    diagnosticoReglas, // objeto generado por tu motor de reglas
    persona,           // "A" | "B" | "C" | "D" (opcional)
  } = payload;

  if (!diagnosticoReglas || !cultivo || !superficieHa || !nivelDigital) {
    return badReq(
      "Faltan campos: diagnosticoReglas, cultivo, superficieHa, nivelDigital."
    );
  }

  // Prompt con tono por persona y énfasis sutil en digitalización
  const prompt = buildPrompt({
    cultivo,
    superficieHa,
    nivelDigital,
    escenario,
    beneficioMensual,
    inversionInicial,
    paybackMeses,
    horizonteMeses,
    diag: diagnosticoReglas,
    persona,
  });

  // Timeout control
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // Llamada a OpenAI
    const resp = await fetch(OPENAI_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.65,
        presence_penalty: 0.2,
        frequency_penalty: 0.2,
        max_tokens: 350,
        messages: [
          {
            role: "system",
            content:
              "Eres un asesor agrícola chileno. Habla claro, directo y práctico. Español chileno natural cuando calce. No inventes cifras; usa las entregadas. Da 1–2 párrafos con 2–3 acciones concretas.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });
    clearTimeout(timer);

    if (!resp.ok) {
      const errTxt = await resp.text().catch(() => "");
      return allowCors({
        statusCode: 200,
        body: JSON.stringify({
          ok: false,
          text:
            "No pudimos generar la recomendación con IA ahora. Puedes intentarlo de nuevo en unos minutos.",
          debug: `HTTP ${resp.status}: ${errTxt.slice(0, 600)}`,
        }),
      });
    }

    const data = await resp.json().catch(() => null);
    const text = data?.choices?.[0]?.message?.content?.trim() || "";

    if (!text) {
      return allowCors({
        statusCode: 200,
        body: JSON.stringify({
          ok: false,
          text: "La IA respondió sin contenido. Inténtalo de nuevo.",
          debug: JSON.stringify(data?.choices?.[0] ?? data ?? "no-json"),
        }),
      });
    }

    return allowCors({
      statusCode: 200,
      body: JSON.stringify({ ok: true, text }),
    });
  } catch (err) {
    clearTimeout(timer);
    return allowCors({
      statusCode: 200,
      body: JSON.stringify({
        ok: false,
        text:
          "No pudimos generar la recomendación con IA ahora. Puedes intentarlo de nuevo en unos minutos.",
        debug: String(err?.message || err).slice(0, 200),
      }),
    });
  }
}

/* ---------- Prompt builder (con tono por persona + “digitalización entre líneas”) ---------- */
function buildPrompt({
  cultivo,
  superficieHa,
  nivelDigital,
  escenario,
  beneficioMensual,
  inversionInicial,
  paybackMeses,
  horizonteMeses,
  diag,
  persona, // A | B | C | D (opcional)
}) {
  // formato CLP
  const clp = (n) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(n) || 0);

  // payback legible
  const pay =
    Number.isFinite(Number(paybackMeses)) && Number(paybackMeses) < 999
      ? `${Number(paybackMeses).toFixed(1)} meses`
      : "N/A";

  // personas (tono + foco + cierre) — con énfasis “entre líneas” distinto por perfil
  const PERSONAS = {
    A: {
      nombre: "Ordena pero no mide",
      tono: "control de gestión, directo",
      foco: "medición por lote, tablero semanal, costos por labor",
      cierre:
        "Parte con tableros por lote y costos conectados; con eso el resto se ordena solo.",
      subtexto:
        "Deja entre líneas que sin trazabilidad y datos consistentes, BI y control de gestión no logran capturar la mejora (la decisión se vuelve ciega).",
    },
    B: {
      nombre: "Ejecución es el cuello",
      tono: "pragmático de terreno",
      foco: "bitácoras, órdenes de trabajo, responsables y cierre diario",
      cierre:
        "Implementa órdenes de trabajo digitales y cierre diario: verás el salto al tiro.",
      subtexto:
        "Insinúa que lo que no se registra en la jornada no se corrige: sin registro simple, la mejora se pierde en ejecución.",
    },
    C: {
      nombre: "Explorador / Curioso",
      tono: "didáctico y tranquilizador",
      foco: "ROI simple, ‘vale la pena’, primeros pasos sin sensores caros",
      cierre: "Parte chico, mide simple (CLP/ha) y escala lo que funcione.",
      subtexto:
        "Sugiere que la digitalización básica es el piso para ver el beneficio (no un fin en sí mismo): solo con registro simple la mejora se hace visible.",
    },
    D: {
      nombre: "Grande / Descentralizado",
      tono: "ejecutivo, estandarizador",
      foco: "modelo de datos único, KPIs comparables, visibilidad multi-sitio",
      cierre:
        "Define estándar único y metas comparables; luego suma analítica avanzada.",
      subtexto:
        "Insinúa que sin estándar y datos comparables entre equipos, no hay visibilidad real ni captura de valor a escala.",
    },
  };
  const P = PERSONAS[persona] || PERSONAS.C; // default C

  // hint por cultivo (suave)
  const cultivoHint =
    {
      TRIGO: "Menciona lotes y ventanas de aplicación.",
      RAPS: "Enfócate en coordinación de aplicaciones y riego.",
      MAIZ: "Sincroniza labores con planificación de insumos.",
      AVENA: "Prioriza eficiencia operativa simple.",
      CEBADA: "Mantén foco en ejecución y costos por labor.",
    }[cultivo] || "Mantén foco práctico para el rubro.";

  const recomendaciones = Array.isArray(diag?.recomendacion)
    ? diag.recomendacion.join("; ")
    : "";

  // prompt final
  return `
Redacta 1–2 párrafos (120–160 palabras) para un productor chileno. Sé concreto y aplicable.
No inventes cifras. Usa estos datos tal cual. Entrega 2–3 acciones inmediatas.
${/* inserción clave: “digitalización entre líneas” por persona */""}
Entre líneas, deja claro (sin decir “compra software”) que la mejora solo se captura si hay trazabilidad/registro y estándar operativo.
Para este perfil, aplica este subtexto: ${P.subtexto}

Perfil del productor: ${P.nombre}. Tono: ${P.tono}. Enfoque: ${P.foco}.
Rubro: ${cultivo}. ${cultivoHint}

Contexto:
- Cultivo: ${cultivo}. Superficie: ${superficieHa} ha. Nivel digital: ${nivelDigital}. Escenario: ${escenario}.
- Ganancia extra mensual estimada: ${clp(beneficioMensual)}. Inversión inicial: ${clp(inversionInicial)}.
- Payback aprox.: ${pay}. Horizonte: ${horizonteMeses || 24} meses.

Dictamen por reglas:
- Intensidad: ${diag?.intensidad || "-"}
- Reparto de oportunidad: ${diag?.reparto?.operativo || "-"} operativo / ${diag?.reparto?.insumos || "-"} insumos
- Lead: ${diag?.lead || "-"}
- Interpretación: ${diag?.interpretacion || "-"}
- Recomendaciones sugeridas: ${recomendaciones}
- Estimación de captura: ${diag?.estimacion || "-"}

Cierra con una frase de acción clara para el productor: "${P.cierre}".
Evita tecnicismos innecesarios. Español chileno natural, directo y útil.
`.trim();
}
