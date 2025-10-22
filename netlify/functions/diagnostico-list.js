import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };
  if (req.method === 'OPTIONS') return new Response('', { status: 200, headers });
  if (req.method !== 'GET')     return new Response('Method Not Allowed', { status: 405, headers });

  try {
    const limit = Math.min(Number(new URL(req.url).searchParams.get('limit') || 100), 500);

    const store = getStore('diagnostico');
    // lista objetos bajo el prefijo "diagnostico/"
    const { objects = [] } = await store.list({ prefix: 'diagnostico/' });

    const keys = objects
      .sort((a, b) => (b.last_modified || '').localeCompare(a.last_modified || ''))
      .slice(0, limit)
      .map(o => o.key);

    const items = [];
    for (const k of keys) {
      const data = await store.get(k, { type: 'json' });
      items.push({ key: k, ...data });
    }

    return new Response(JSON.stringify({ ok: true, items }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers });
  }
};
