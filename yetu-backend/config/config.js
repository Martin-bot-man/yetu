require('dotenv').config();

const config = {
  port: process.env.PORT || 8000,
  db: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/yetu-pos',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'your-access-token-secret',
  
  // Razorpay Configuration
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'your_razorpay_key_id',
  razorpaySecretKey: process.env.RAZORPAY_SECRET_KEY || 'your_razorpay_secret_key',
  razorpyWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'your_razorpay_webhook_secret',
  
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigins: (process.env.CLIENT_ORIGINS ||
    'http://localhost:5173,http://127.0.0.1:5173,http://localhost:8080,http://127.0.0.1:8080')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  mongoRetryDelayMs: Number(process.env.MONGO_RETRY_DELAY_MS || 5000),
  apiRateLimitWindowMs: Number(process.env.API_RATE_LIMIT_WINDOW_MS || 60000),
  apiRateLimitMaxRequests: Number(process.env.API_RATE_LIMIT_MAX_REQUESTS || 120),
};

module.exports = config;
