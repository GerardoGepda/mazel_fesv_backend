import { Router } from 'express';
import userRoutes from '../v1/users/routes.js';
import authRoutes from '../v1/auth/routes.js';
import roleRoutes from '../v1/roles/routes.js';
import routeRoutes from '../v1/routes/routes.js';
import permissionRoutes from '../v1/permissions/routes.js';
import menuRoutes from '../v1/menus/routes.js';
import submenuRoutes from '../v1/submenus/routes.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', [authenticateToken], roleRoutes);
router.use('/routes', [authenticateToken], routeRoutes);
router.use('/permissions', [authenticateToken], permissionRoutes);
router.use('/menus', [authenticateToken], menuRoutes);
router.use('/submenus', [authenticateToken], submenuRoutes);

export default router;
