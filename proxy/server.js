const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

const MAP_SERVICE  = process.env.MAP_URL  || 'http://18.201.124.29:8080';
const TICK_SERVICE = process.env.TICK_URL || 'http://54.75.38.39:8081';

// filter as first arg (v2 API) avoids Express path stripping — keeps /tick and /map in the forwarded URL
app.use(createProxyMiddleware(
  (path) => path.startsWith('/tick'),
  { target: TICK_SERVICE, changeOrigin: true }
));
app.use(createProxyMiddleware(
  (path) => path.startsWith('/map'),
  { target: MAP_SERVICE, changeOrigin: true }
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
