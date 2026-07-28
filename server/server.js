import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
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
app.use(cors({ origin: allowedOrigins, credentials: true }));

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
