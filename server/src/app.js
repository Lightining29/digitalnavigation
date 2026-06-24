import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import config from './config.js';
import { errorHandler, notFound } from './middleware/error.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import jobRoutes from './routes/jobs.js';
import leadRoutes from './routes/leads.js';
import galleryRoutes from './routes/gallery.js';
import applicationRoutes from './routes/applications.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  // Trust proxy (needed for correct IPs behind Docker / load balancers)
  app.set('trust proxy', 1);

  // Security & utility middleware
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors({
      origin: (origin, cb) => {
        // allow same-origin (no origin) and the configured client origin
        if (!origin || origin === config.clientOrigin) return cb(null, true);
        return cb(null, true); // permissive in dev; tighten in prod via CLIENT_ORIGIN
      },
      credentials: true,
    })
  );
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  if (config.nodeEnv !== 'test') app.use(morgan('dev'));

  // Health check
  app.get('/api/health', (_req, res) =>
    res.json({ ok: true, env: config.nodeEnv, time: new Date().toISOString() })
  );

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/leads', leadRoutes);
  app.use('/api/gallery', galleryRoutes);
  app.use('/api/applications', applicationRoutes);

  // ── Upload directories (always relative to THIS file so CWD doesn't matter) ──
  const UPLOADS_ROOT = path.resolve(__dirname, '../uploads');

  const uploadDir    = path.join(UPLOADS_ROOT);
  const resumeDir    = path.join(UPLOADS_ROOT, 'resumes');
  const productsDir  = path.join(UPLOADS_ROOT, 'products');
  const galleryDir   = path.join(UPLOADS_ROOT, 'gallery');

  for (const dir of [uploadDir, resumeDir, productsDir, galleryDir]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  console.log(`[uploads] serving from: ${UPLOADS_ROOT}`);
  app.use('/uploads', express.static(UPLOADS_ROOT));

  // 404 for unknown /api/* routes (before SPA fallback)
  app.use('/api/*', notFound);

  // Serve the built React client in production (SPA fallback)
  // Try multiple possible paths (local dev vs Render deployment)
  const possibleDistPaths = [
    path.resolve(__dirname, '../../client/dist'),   // running from server/src/
    path.resolve('client/dist'),                     // running from project root
    path.resolve(__dirname, '../../../client/dist'), // deep nesting fallback
  ];
  const clientDist = possibleDistPaths.find(fs.existsSync);

  if (clientDist) {
    console.log(`[static] Serving React client from: ${clientDist}`);
    app.use(express.static(clientDist));
    // SPA fallback — send index.html for all non-API routes
    app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
  } else {
    console.warn('[static] client/dist not found — React frontend will NOT be served.');
    console.warn('[static] Searched:', possibleDistPaths);
    // Fallback message so "Cannot GET /" shows something useful
    app.get('/', (_req, res) => res.status(200).send(
      '<h2>API is running ✅</h2><p>Frontend build not found. Run <code>npm run build</code> first.</p>'
    ));
  }

  app.use(errorHandler);

  return app;
}

export default createApp;
