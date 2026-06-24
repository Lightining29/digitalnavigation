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

  // Serve uploaded gallery images
  const uploadDir = path.resolve(config.uploadDir);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  app.use('/uploads', express.static(uploadDir));
  app.use('/uploads/resumes', express.static(path.resolve('uploads/resumes')));

  // Serve the built React client in production
  const clientDist = path.resolve(__dirname, '../../client/dist');
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    // SPA fallback — client-side routing handles the rest
    app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
  }

  // 404 + error handling (must be last)
  app.use('/api/*', notFound);
  app.use(errorHandler);

  return app;
}

export default createApp;
