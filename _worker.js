const NLB = 'taller-deploy-aws-2026-nlb-pulz-adee7212e878911f.elb.eu-west-1.amazonaws.com';
const MAP_SERVICE  = `http://${NLB}:8080`;
const TICK_SERVICE = `http://${NLB}:8081`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname, search } = url;

    if (pathname.startsWith('/api/tick')) {
      const target = pathname.replace('/api', '') + search;
      return fetch(`${TICK_SERVICE}${target}`, {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      });
    }

    if (pathname.startsWith('/api/map')) {
      const target = pathname.replace('/api', '') + search;
      return fetch(`${MAP_SERVICE}${target}`, {
        method: request.method,
        headers: request.headers,
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
