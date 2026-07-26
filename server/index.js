import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/aiRoutes.js';
import { aiApiLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.set('trust proxy', 1);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'healthy',
    application: ' AI Local Business Growth Advisor API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// AI Routes with rate limiting
app.use(['/api/ai', '/ai', '/'], aiApiLimiter, aiRoutes);

// Catch-all 404 handler for API routes
app.use(['/api/*', '/ai/*'], (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API Endpoint not found.',
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Express Backend Server Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Unable to generate recommendations. Please try again.';
  res.status(status).json({
    success: false,
    message,
  });
});

// Listen on port in development / non-Vercel environment
if (process.env.VERCEL !== '1' && process.env.NODE_ENV !== 'test') {
  const startServer = (port) => {
    const server = app
      .listen(port, () => {
        console.log(`🚀 Express AI API Server running on port ${port}`);
      })
      .on('error', (error) => {
        if (error.code === 'EADDRINUSE' && port < PORT + 10) {
          console.warn(`Port ${port} in use, trying ${port + 1}...`);
          startServer(port + 1);
        } else {
          console.error('Failed to start Express server:', error);
          process.exit(1);
        }
      });

    return server;
  };

  startServer(PORT);
}

export default app;
