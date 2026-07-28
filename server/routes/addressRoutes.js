import express from 'express';
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefault,
} from '../controllers/addressController.js';
import { authUser } from '../middleware/auth.js';

const router = express.Router();

// All address routes require login
router.use(authUser);

router.get('/',                getAddresses);
router.post('/',               addAddress);
router.put('/:id',             updateAddress);
router.delete('/:id',          deleteAddress);
router.patch('/:id/default',   setDefault);

export default router;
