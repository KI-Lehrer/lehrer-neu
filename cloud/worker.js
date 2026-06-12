export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.headers.get('Authorization') !== `Bearer ${env.SYNC_TOKEN}`) {
      return Response.json({ error: 'Nicht autorisiert' }, { status: 401, headers: cors });
    }

    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    if (request.method === 'GET') {
      if (!key) return Response.json({ error: 'Schlüssel fehlt' }, { status: 400, headers: cors });
      const value = await env.PLANNER_DATA.get(key);
      return value
        ? new Response(value, { headers: { ...cors, 'Content-Type': 'application/json' } })
        : Response.json({ error: 'Nicht gefunden' }, { status: 404, headers: cors });
    }
    if (request.method === 'PUT') {
      const record = await request.json();
      if (!record.key || typeof record.updatedAt !== 'number') {
        return Response.json({ error: 'Ungültige Daten' }, { status: 400, headers: cors });
      }
      await env.PLANNER_DATA.put(record.key, JSON.stringify({ value: record.value, updatedAt: record.updatedAt }));
      return Response.json({ ok: true }, { headers: cors });
    }
    return Response.json({ error: 'Methode nicht erlaubt' }, { status: 405, headers: cors });
  },
};
