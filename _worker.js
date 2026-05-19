const BACKEND = 'http://taller-deploy-aws-2026-nlb-pulz-adee7212e878911f.elb.eu-west-1.amazonaws.com:8080';

function proxyHeaders(request) {
  const headers = new Headers(request.headers);
  headers.delete('host');
  return headers;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname, search } = url;

    if (pathname === '/healthz') {
      return new Response(JSON.stringify({ version: 'v3-no-host-header', backend: BACKEND }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (pathname === '/debug') {
      try {
        const res = await fetch(`${BACKEND}/map`, { method: 'GET', headers: proxyHeaders(request) });
        const body = await res.text();
        return new Response(JSON.stringify({ status: res.status, headers: Object.fromEntries(res.headers), body }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    }

    if (pathname.startsWith('/api/tick') || pathname.startsWith('/api/map')) {
      const target = pathname.replace('/api', '') + search;
      return fetch(`${BACKEND}${target}`, {
        method: request.method,
        headers: proxyHeaders(request),
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      });
    }

    // Servir Angular; si la ruta no existe como fichero, devolver index.html (SPA fallback)
    const response = await env.ASSETS.fetch(request);
    if (response.status === 404) {
      return env.ASSETS.fetch(new Request(new URL('/index.html', request.url)));
    }
    return response;
  },
};
