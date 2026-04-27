import { Router } from 'express';
import { warehouseReport } from './controller.js';

const router = Router();

router.get('/warehouse/:docNum', warehouseReport);

export default router;