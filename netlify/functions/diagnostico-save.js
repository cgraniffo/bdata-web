// Guarda resultados del diagnóstico en Netlify Blobs
import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
  if (req.method === 'OPTIONS') return new Response('', { status: 200, headers });
  if (req.method !== 'POST')   return new Response('Method Not Allowed', { status: 405, headers });

  try {
    const payload = await req.json();
    const { nombre, telefono, region, rubro, score, max, pct, nivel, porSeccion, respuestas } = payload || {};
    const telRegex = /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/;

    if (!nombre || !telRegex.test((telefono || '').trim()))
      return new Response(JSON.stringify({ ok: false, error: 'Nombre/teléfono inválidos' }), { status: 400, headers });

    if (typeof score !== 'number' || typeof max !== 'number' || typeof pct !== 'number' || !nivel?.id)
      return new Response(JSON.stringify({ ok: false, error: 'Payload incompleto' }), { status: 400, headers });

    const ts = new Date().toISOString();
    const key = `${ts}_${(telefono || '').replace(/\D/g, '').slice(-8)}`;

    const record = {
      ts, nombre, telefono, region: region || '', rubro: rubro || '',
      score, max, pct, nivel, porSeccion, respuestas,
      ua: req.headers.get('user-agent') || '',
      ip: req.headers.get('x-nf-client-connection-ip') || req.headers.get('client-ip') || '',
      source: 'diagnostico-digital-bdata'
    };

    // 👉 abrir store a nivel de sitio (nombre libre, p.ej. "diagnostico")
    const store = getStore('diagnostico');
    await store.setJSON(`diagnostico/${key}`, record);

    return new Response(JSON.stringify({ ok: true, key: `diagnostico/${key}` }), { status: 200, headers });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message || 'Error inesperado' }), { status: 500, headers });
  }
};
