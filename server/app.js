import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import calculatorRoutes from './routes/calculators.js';
import favoritesRoutes from './routes/favorites.js';
import historyRoutes from './routes/history.js';
import recentlyUsedRoutes from './routes/recentlyUsed.js';
import settingsRoutes from './routes/settings.js';
import searchRoutes from './routes/search.js';
import analyticsRoutes from './routes/analytics.js';
import adminRoutes from './routes/admin.js';
import healthRoutes from './routes/health.js';

import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

export function createApp() {
  const app = express();

  // 1. Core Middleware
  app.use(cors({
    origin: '*',
    credentials: true
  }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // 2. Disable Caching for Development Snappiness
  app.use((req, res, next) => {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    next();
  });

  // 3. Mount REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/calculators', calculatorRoutes);
  app.use('/api/favorites', favoritesRoutes);
  app.use('/api/history', historyRoutes);
  app.use('/api/recently-used', recentlyUsedRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/health', healthRoutes);

  // 4. Serve Static Frontend Files
  app.use(express.static(rootDir, {
    etag: false,
    lastModified: false,
    setHeaders: (res) => {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    }
  }));

  // 5. API 404 Fallback
  app.all('/api/*', notFoundHandler);

  // 6. SPA HTML Fallback (return index.html for frontend routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(rootDir, 'index.html'));
  });

  // 7. Central Error Handling
  app.use(errorHandler);

  return app;
}
