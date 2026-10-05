import path from 'path';
import dotenv from 'dotenv';
import { app, db } from './backend/src/serverApp.ts';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  // Initialize Database
  try {
    await db.init();
    console.log('✅ POINT+ Database Engine ready.');
  } catch (err) {
    console.error('❌ Failed to initialize database:', err);
  }

  // Vite integration in development
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('⚡ Vite Dev Middleware mounted.');
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    const express = (await import('express')).default;
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 POINT+ Server is listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
