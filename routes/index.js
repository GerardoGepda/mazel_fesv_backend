import { Router } from 'express';
import userRoutes from '../v1/users/routes.js';
import authRoutes from '../v1/auth/routes.js';
import roleRoutes from '../v1/roles/routes.js';
import routeRoutes from '../v1/routes/routes.js';
import permissionRoutes from '../v1/permissions/routes.js';
import menuRoutes from '../v1/menus/routes.js';
import submenuRoutes from '../v1/submenus/routes.js';
import documenTypeRoutes from '../v1/documentTypes/routes.js';
import departmentRoutes from '../v1/departments/routes.js';
import municipalityRoutes from '../v1/municipalities/routes.js';
import activityRoutes from '../v1/activities/routes.js';
import customerRoutes from '../v1/customers/routes.js';
import fceRoutes from '../v1/fce/routes.js';
import seRoutes from '../v1/se/routes.js';
import DocumentRoutes from '../v1/documents/routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/routes', routeRoutes);
router.use('/permissions', permissionRoutes);
router.use('/menus', menuRoutes);
router.use('/submenus', submenuRoutes);
router.use('/document_types', documenTypeRoutes);
router.use('/departments', departmentRoutes);
router.use('/municipalities', municipalityRoutes);
router.use('/activities', activityRoutes);
router.use('/customers', customerRoutes);
router.use('/fce', fceRoutes);
router.use('/se', seRoutes);
router.use('/documents', DocumentRoutes);

export default router;
