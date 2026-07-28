import express from 'express';
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { authUser, authSeller } from '../middleware/auth.js';

const router = express.Router();

router.post('/',              authUser,   placeOrder);
router.get('/my',             authUser,   getMyOrders);
router.get('/',               authSeller, getAllOrders);
router.put('/:id/status',     authSeller, updateOrderStatus);

export default router;
