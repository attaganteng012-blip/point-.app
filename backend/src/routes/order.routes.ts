import { Router } from 'express';
import { createOrder, getOrderById, uploadProof, checkOrder } from '../controllers/order.controller.ts';
import { uploadPaymentProof } from '../middleware/upload.ts';

const router = Router();

router.post('/', createOrder);
router.get('/check', checkOrder);
router.get('/:id', getOrderById);
router.post('/:id/payment-proof', uploadPaymentProof.single('proof'), uploadProof);

export default router;
