import { Router } from 'express';
import { getActivitiesActive } from './controller.js';

const router = Router();

router.get('/active', getActivitiesActive);

export default router;