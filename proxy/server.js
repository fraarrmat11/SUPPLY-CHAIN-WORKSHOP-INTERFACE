const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

app.use('/map', createProxyMiddleware({
  target: 'http://52.49.33.24:8080',
  changeOrigin: true,
}));

app.use('/tick', createProxyMiddleware({
  target: 'http://18.201.141.240:8081',
  changeOrigin: true,
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
