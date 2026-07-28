import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  removeItem,
  clearCart,
  syncCart,
} from '../controllers/cartController.js';
import { authUser } from '../middleware/auth.js';

const router = express.Router();

// All cart routes require login
router.use(authUser);

router.get('/',              getCart);
router.post('/add',          addToCart);
router.post('/remove',       removeFromCart);
router.delete('/item/:itemId', removeItem);
router.delete('/',           clearCart);
router.put('/',              syncCart);

export default router;
