import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/Users.js';

const isProd = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,                          // JS cannot access cookie
  secure: isProd,                          // HTTPS only in production
  sameSite: isProd ? 'none' : 'strict',   // 'none' needed for cross-origin in prod, 'strict' in dev
  maxAge: 7 * 24 * 60 * 60 * 1000,        // 7 days
};

// POST /api/user/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.json({ success: false, message: 'All fields are required' });

    if (await User.findOne({ email }))
      return res.json({ success: false, message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('userToken', token, cookieOptions);
    res.json({ success: true, user: { name: user.name, email: user.email, _id: user._id } });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// POST /api/user/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('userToken', token, cookieOptions);
    res.json({ success: true, user: { name: user.name, email: user.email, _id: user._id } });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// POST /api/user/logout
export const logout = (req, res) => {
  res.clearCookie('userToken');
  res.clearCookie('sellerToken'); // also clear seller cookie on customer logout
  res.json({ success: true, message: 'Logged out' });
};

// GET /api/user/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// PUT /api/user/cart
export const updateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;
    await User.findByIdAndUpdate(req.userId, { cartItems });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// GET /api/user/check-auth — verify if user is still logged in
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.json({ success: false });
    res.json({ success: true, user });
  } catch {
    res.json({ success: false });
  }
};

// GET /api/user/check-seller — verify if seller is still logged in
export const checkSeller = (req, res) => {
  // authSeller middleware already verified the token — if we reach here, it's valid
  res.json({ success: true });
};

// POST /api/user/google-login — Firebase Google auth
export const googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!email) return res.json({ success: false, message: 'Email required' });

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      // Create with a random password (Google users won't use it)
      const hashed = await bcrypt.hash(Math.random().toString(36), 10);
      user = await User.create({ name: name || email.split('@')[0], email, password: hashed });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('userToken', token, cookieOptions);
    res.json({ success: true, user: { name: user.name, email: user.email, _id: user._id } });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// POST /api/user/seller-login
export const sellerLogin = (req, res) => {
  try {
    const { email, password } = req.body;
    const SELLER_EMAIL = process.env.SELLER_EMAIL || 'seller@freshmart.com';
    const SELLER_PASS  = process.env.SELLER_PASS  || 'seller123';

    if (email !== SELLER_EMAIL || password !== SELLER_PASS)
      return res.json({ success: false, message: 'Invalid seller credentials' });

    const token = jwt.sign({ isSeller: true }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('sellerToken', token, cookieOptions);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// POST /api/user/seller-logout
export const sellerLogout = (req, res) => {
  res.clearCookie('sellerToken');
  res.json({ success: true });
};
