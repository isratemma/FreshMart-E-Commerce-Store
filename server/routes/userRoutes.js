import express from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  updateCart,
  sellerLogin,
  sellerLogout,
  checkAuth,
  checkSeller,
  googleLogin,
} from '../controllers/userController.js';
import { authUser, authSeller } from '../middleware/auth.js';

const router = express.Router();

router.post('/register',       register);
router.post('/login',          login);
router.post('/logout',         logout);
router.get('/profile',         authUser,   getProfile);
router.put('/cart',            authUser,   updateCart);
router.post('/seller-login',   sellerLogin);
router.post('/seller-logout',  sellerLogout);
router.get('/check-auth',      authUser,   checkAuth);
router.get('/check-seller',    authSeller, checkSeller);
router.post('/google-login',   googleLogin);

export default router;
