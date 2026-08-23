import dotenv from 'dotenv';
// Load environment variables first
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { isDbFallback } from './db';
import { isRedisFallback } from './redis';
import { FallbackStore } from './services/fallbackStore';
import { ingestData } from './rag/ingest';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Fallback Store in case DB is offline
FallbackStore.initialize().then(() => {
  console.log('🤖 Fallback in-memory store initialized.');
  // Auto-run mock ingestion
  ingestData();
});

// Security Middleware
app.use(helmet());
app.use(cookieParser());

// CORS config - restrict to specific origin or allow dev localhosts
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:4173', 'http://127.0.0.1:4173'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting (Memory based fallback if Redis is offline)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later.',
    data: null,
    meta: null,
  },
});

// Apply rate limiter to all API routes
app.use('/api', apiLimiter);

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    databaseFallback: isDbFallback,
    redisFallback: isRedisFallback,
  });
});

// Register versioned API router
app.use('/api/v1', routes);

// Centralized error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('🔥 Server Error Event:', err.stack || err.message || err);
  
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'An unexpected error occurred' 
    : err.message || 'An unexpected error occurred';

  res.status(status).json({
    error: message,
    data: null,
    meta: null,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Saksham AI Backend is active on port ${PORT}`);
  console.log(`⚙️  Node Environment: ${process.env.NODE_ENV}`);
});

export default app;
