const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

const MAP_SERVICE     = process.env.MAP_URL  || 'http://34.241.189.20:8080';
const TICK_SERVICE    = process.env.TICK_URL || 'http://3.254.200.29:8081';
const REPORTS_SERVICE = process.env.REPORTS_URL || 'http://localhost:8082';

// /api/tick/* → tick service (strips /api prefix)
app.use('/api/tick', createProxyMiddleware({
  target: TICK_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
}));

// /api/blockedOrders → reports service
app.use('/api/blockedOrders', createProxyMiddleware({
  target: REPORTS_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
}));

// /api/reports → reports service data endpoints
app.use('/api/reports', createProxyMiddleware({
  target: REPORTS_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
}));

// /api/* → map service (trucks, warehouses, factories, recipes, map)
app.use('/api', createProxyMiddleware({
  target: MAP_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
}));

// Direct routes — filter as first arg (v2 API) avoids Express path stripping
app.use(createProxyMiddleware(
  (path) => path.startsWith('/map'),
  { target: MAP_SERVICE, changeOrigin: true }
));
app.use(createProxyMiddleware(
  (path) => path.startsWith('/tick'),
  { target: TICK_SERVICE, changeOrigin: true }
));

// Serve Angular build
const distPath = path.join(__dirname, '..', 'dist', 'MAP-INTERFACE', 'browser');
app.use(express.static(distPath));
app.get('*', (req, res) =>
  res.sendFile(path.join(distPath, 'index.html'))
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
