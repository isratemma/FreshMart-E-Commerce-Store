import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './configs/db.js';
import dotenv from 'dotenv';
import path from 'path';

import userRoutes    from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes   from './routes/orderRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import cartRoutes    from './routes/cartRoutes.js';
import connectCloudinary from './configs/cloudinary.js'

dotenv.config({ path: path.resolve('server/.env') });

const app = express();
const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary()

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL, // add your production frontend URL
].filter(Boolean);

app.use(express.json());
app.use(cookieParser());
app.use(helmet()); // Security headers: XSS, clickjacking, MIME sniffing protection
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // max 100 requests per IP per window
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,                   // max 50 login/register attempts per IP
  message: { success: false, message: 'Too many attempts, please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limits
app.use('/api/', generalLimiter);
app.use('/api/user/login',        authLimiter);
app.use('/api/user/register',     authLimiter);
app.use('/api/user/seller-login', authLimiter);

// Routes
app.use('/api/user',     userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/address',  addressRoutes);
app.use('/api/cart',     cartRoutes);

app.get('/', (req, res) => res.send('FreshMart API is running'));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
