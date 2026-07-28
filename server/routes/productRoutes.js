import express from 'express';
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleStock,
} from '../controllers/productController.js';
import { authSeller } from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.get('/',              getProducts);
router.get('/:id',           getProductById);
router.post('/',             authSeller, upload.single('image'), addProduct);
router.put('/:id',           authSeller, upload.single('image'), updateProduct);
router.delete('/:id',        authSeller, deleteProduct);
router.patch('/:id/stock',   authSeller, toggleStock);

export default router;
