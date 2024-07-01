import { Router } from 'express';
import { getDocumentTypesActive } from './controller.js';

const router = Router();

router.get('/active', getDocumentTypesActive);

export default router;