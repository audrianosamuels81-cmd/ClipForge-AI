import dotenv from 'dotenv';
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Database
  DATABASE_URL: requireEnv('DATABASE_URL'),

  // JWT
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Encryption
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'default-dev-key-change-me',

  // Auth Providers
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',

  // AI Providers
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  ASSEMBLYAI_API_KEY: process.env.ASSEMBLYAI_API_KEY || '',
  REPLICATE_API_KEY: process.env.REPLICATE_API_KEY || '',
  RUNWAY_API_KEY: process.env.RUNWAY_API_KEY || '',

  // Storage
  STORAGE_PROVIDER: process.env.STORAGE_PROVIDER || 'local',
  S3_BUCKET: process.env.S3_BUCKET || '',
  S3_REGION: process.env.S3_REGION || '',
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID || '',
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || '',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),

  // Billing
  BILLING_PROVIDER: process.env.BILLING_PROVIDER || 'lemonsqueezy',
  LEMONSQUEEZY_API_KEY: process.env.LEMONSQUEEZY_API_KEY || '',
  LEMONSQUEEZY_WEBHOOK_SECRET: process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '',

  // Video
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5368709120', 10),

  // Is Production
  get isProduction(): boolean {
    return this.NODE_ENV === 'production';
  },
};
