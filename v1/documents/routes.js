import { Router } from 'express';
import { getDocumentsByRangeDate, invalidateDocument } from './controller.js';

const router = Router();

router.get('/:initialDate/:finalDate', getDocumentsByRangeDate);
router.post('/invalidate', invalidateDocument);

export default router;