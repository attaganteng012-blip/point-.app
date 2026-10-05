import { Router } from 'express';
import {
  adminLogin,
  adminLogout,
  getAdminMe,
  getStatistics,
  getOrders,
  getOrderDetail,
  approveOrder,
  rejectOrder,
  processOrder,
  completeOrder,
  getUsers,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getActivityLogs,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct
} from '../controllers/admin.controller.ts';
import { requireAdmin } from '../middleware/auth.ts';

const router = Router();

// Public auth routes
router.post('/login', adminLogin);
router.post('/logout', adminLogout);

// Protected routes (Admin Auth Required)
router.use(requireAdmin);

router.get('/me', getAdminMe);
router.get('/statistics', getStatistics);
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderDetail);
router.post('/orders/:id/approve', approveOrder);
router.post('/orders/:id/reject', rejectOrder);
router.post('/orders/:id/process', processOrder);
router.post('/orders/:id/complete', completeOrder);
router.get('/users', getUsers);
router.get('/notifications', getNotifications);
router.post('/notifications/:id/read', markNotificationRead);
router.post('/notifications/read-all', markAllNotificationsRead);
router.get('/activity', getActivityLogs);

// Products management
router.get('/products', getAdminProducts);
router.post('/products', createAdminProduct);
router.put('/products/:id', updateAdminProduct);
router.delete('/products/:id', deleteAdminProduct);

export default router;
