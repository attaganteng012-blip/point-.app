import express from 'express';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db.ts';
import orderRoutes from './routes/order.routes.ts';
import adminRoutes from './routes/admin.routes.ts';
import gameRoutes from './routes/game.routes.ts';

dotenv.config();

const app = express();

const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);
const uploadsDir = isServerless ? path.resolve('/tmp/uploads') : path.resolve(process.cwd(), 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  // Ignore filesystem errors in read-only environments
}

// CORS Middleware - allow Netlify frontend, Vercel frontend, and local dev
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all origins (reflection) or requests without origin (like mobile/curl)
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

// Global middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static uploads serving
app.use('/uploads', express.static(uploadsDir));
if (isServerless && fs.existsSync(path.resolve(process.cwd(), 'uploads'))) {
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
}

// Download project zip route
app.get('/point-plus-project.zip', (req, res) => {
  const filePath = path.resolve(process.cwd(), 'public/point-plus-project.zip');
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'point-plus-project.zip');
  } else {
    res.status(404).send('Berkas zip tidak ditemukan');
  }
});

// Auto-initialize DB middleware (crucial for serverless cold starts on Vercel)
app.use(async (req, res, next) => {
  try {
    await db.init();
    next();
  } catch (err) {
    console.error('[DB Middleware] Initialization error:', err);
    next(err);
  }
});

// API routes
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/games', gameRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'POINT+ API',
    mode: isServerless ? 'serverless-vercel' : 'standard-node',
    timestamp: new Date().toISOString(),
  });
});

export { app, db };
export default app;
