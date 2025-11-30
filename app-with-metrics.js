const express = require('express');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 8080;

// === PROMETHEUS METRICS (ADD TO ANY PROJECT) ===
const register = new client.Registry();
client.collectDefaultMetrics({ register });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
// === END PROMETHEUS ===

app.use(express.json());

// === YOUR PROJECT ROUTES START HERE ===
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Add your routes below...

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
  console.log(`Metrics: http://localhost:${PORT}/metrics`);
});
