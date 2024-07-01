import { Router } from 'express';
import { getDepartmentsActive } from './controller.js';

const router = Router();

router.get('/active', getDepartmentsActive);

export default router;