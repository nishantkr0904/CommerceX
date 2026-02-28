import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/mongodb.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure dotenv to look for .env file in the backend directory
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';


const app = express();
app.disable('x-powered-by');

if (process.env.NODE_ENV === 'production') {
  // Helps Express correctly identify client IPs behind a reverse proxy (Render/Nginx/etc.)
  app.set('trust proxy', 1);
}

// Basic production middleware (must run before routes)
const helmetCspDirectives = helmet.contentSecurityPolicy.getDefaultDirectives();
helmetCspDirectives['script-src'] = [
  ...new Set([...(helmetCspDirectives['script-src'] || ["'self'"]), 'https://checkout.razorpay.com'])
];

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: helmetCspDirectives
    }
  })
);
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use(limiter);

const parseAllowedOrigins = (value) =>
  (value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = parseAllowedOrigins(process.env.FRONTEND_URL);

// In development, provide a sensible default if FRONTEND_URL is missing.
// In production, require explicit allowlist via FRONTEND_URL.
const effectiveAllowedOrigins =
  allowedOrigins.length > 0
    ? allowedOrigins
    : process.env.NODE_ENV === 'production'
      ? []
      : ['http://localhost:5173', 'http://localhost:5174'];

app.use(
  cors((req, callback) => {
    const origin = req.header('Origin');

    // Allow non-browser requests (no Origin header), e.g., curl/health checks.
    if (!origin) {
      return callback(null, { origin: false, credentials: true });
    }

    // Always allow same-origin requests (backend serving its own frontend/static assets).
    const requestOrigin = `${req.protocol}://${req.get('host')}`;
    if (origin === requestOrigin) {
      return callback(null, { origin: true, credentials: true });
    }

    // Strict allowlist for cross-origin requests.
    if (effectiveAllowedOrigins.includes(origin)) {
      return callback(null, { origin: true, credentials: true });
    }

    return callback(new Error('Not allowed by CORS'));
  })
);
const port = process.env.PORT || 4000;
connectDB()
connectCloudinary()

//middleware
app.use(express.json());

// Health check (for uptime monitoring / load balancers)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});


//api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

// Root route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

// Centralized error handler (keep after all routes)
app.use((err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';

  // Default to 500; treat common CORS denials as 403.
  const statusCode = err?.message === 'Not allowed by CORS' ? 403 : (err?.statusCode || 500);

  if (!isProduction) {
    console.error(err);
    return res.status(statusCode).json({
      success: false,
      message: err?.message || 'Internal Server Error',
      stack: err?.stack
    });
  }

  if (statusCode >= 500) {
    console.error('Internal Server Error');
  }

  return res.status(statusCode).json({
    success: false,
    message: statusCode === 403 ? 'CORS forbidden' : 'Internal Server Error'
  });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})







