import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import { env } from './config/env';
import { apiLimiter } from './middleware/rateLimit';
import authRoutes from './routes/auth';
import subscriptionRoutes from './routes/subscriptions';
import videoRoutes from './routes/videos';
import adminRoutes from './routes/admin';

const app = express();

// ============================================================================
// Security Middleware
// ============================================================================

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Signature'],
}));

app.use(compression());
app.use(morgan(env.isProduction ? 'combined' : 'dev'));

// ============================================================================
// Body Parsing
// ============================================================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================================
// Rate Limiting
// ============================================================================

app.use('/api', apiLimiter);

// ============================================================================
// API Routes
// ============================================================================

app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/admin', adminRoutes);

// ============================================================================
// Health Check
// ============================================================================

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: env.NODE_ENV,
  });
});

// ============================================================================
// Static Files (Uploads)
// ============================================================================

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ============================================================================
// Error Handling
// ============================================================================

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);

  if (err instanceof multerError) {
    res.status(400).json({ error: err.message });
    return;
  }

  res.status(err.status || 500).json({
    error: env.isProduction ? 'Internal server error' : err.message,
  });
});

// ============================================================================
// Start Server
// ============================================================================

app.listen(env.PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║           ViralFlux AI - API             ║
║───────────────────────────────────────────║
║  Status:   Running                       ║
║  Port:     ${env.PORT.toString().padEnd(33)}║
║  Env:      ${env.NODE_ENV.padEnd(33)}║
║  CORS:     ${env.FRONTEND_URL.padEnd(33)}║
╚═══════════════════════════════════════════╝
  `);
});

interface multerError extends Error {
  code?: string;
  field?: string;
}
