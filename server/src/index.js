import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'node:path';
import { config } from './config.js';
import { apiRoutes } from './routes/index.js';
import { seedDemoData } from './seedData.js';
import { ensureStorage, uploadsDir } from './storage/jsonStore.js';

await ensureStorage();
await seedDemoData();

const app = express();

app.use(cors({ origin: config.clientUrl }));
app.use(morgan('dev'));

app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use('/uploads', express.static(uploadsDir, {
  dotfiles: 'deny',
  index: false,
  setHeaders(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
  },
}));

app.use((req, res, next) => {
  if (req.originalUrl === '/api/stripe/webhook') return next();
  express.json()(req, res, next);
});
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.use('/api/*', (_req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

app.use((error, _req, res, _next) => {
  const status = error.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Something went wrong' : error.message,
    details: error.details,
  });
});

app.listen(config.port, () => {
  console.log(`QuoteGate API running on ${config.serverUrl}`);
  console.log(`Uploads served from ${path.relative(process.cwd(), uploadsDir) || uploadsDir}`);
});
