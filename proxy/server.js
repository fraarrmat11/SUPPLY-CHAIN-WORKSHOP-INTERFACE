const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

const MAP_SERVICE  = process.env.MAP_URL  || 'http://18.201.124.29:8080';
const TICK_SERVICE = process.env.TICK_URL || 'http://54.75.38.39:8081';

app.use((req, _res, next) => { console.log(`[proxy] ${req.method} ${req.url}`); next(); });

// filter as 1st arg avoids Express path stripping — pathRewrite sees the full /api/... path
app.use(createProxyMiddleware(
  (pathname) => pathname.startsWith('/api/tick'),
  { target: TICK_SERVICE, changeOrigin: true, pathRewrite: { '^/api': '' },
    on: { error: (err) => console.error('[proxy] tick error:', err.message) } }
));
app.use(createProxyMiddleware(
  (pathname) => pathname.startsWith('/api/map'),
  { target: MAP_SERVICE, changeOrigin: true, pathRewrite: { '^/api': '' },
    on: { error: (err) => console.error('[proxy] map error:', err.message) } }
));

// TODO: uncomment when these services are deployed
// const REPORTS_SERVICE = process.env.REPORTS_URL || 'http://<pending>';
// app.use('/blockedOrders', createProxyMiddleware({ target: REPORTS_SERVICE, changeOrigin: true }));
// app.use('/reports',       createProxyMiddleware({ target: REPORTS_SERVICE, changeOrigin: true }));
// app.use('/trucks',        createProxyMiddleware({ target: MAP_SERVICE, changeOrigin: true }));
// app.use('/warehouses',    createProxyMiddleware({ target: MAP_SERVICE, changeOrigin: true }));
// app.use('/factories',     createProxyMiddleware({ target: MAP_SERVICE, changeOrigin: true }));
// app.use('/recipes',       createProxyMiddleware({ target: MAP_SERVICE, changeOrigin: true }));

// Serve Angular build
const distPath = path.join(__dirname, '..', 'dist', 'MAP-INTERFACE', 'browser');
app.use(express.static(distPath));
app.get('*', (req, res) =>
  res.sendFile(path.join(distPath, 'index.html'))
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
