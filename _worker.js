const BACKEND = 'http://34.254.187.162:8080';

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
