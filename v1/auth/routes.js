import { Router } from 'express';
import { authenticate } from './controller.js';

const router = Router();

router.post('/', authenticate);

export default router;