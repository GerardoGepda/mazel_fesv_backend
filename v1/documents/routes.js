import { Router } from 'express';
import { getDocumentsByRangeDate, invalidateDocument, forwardEmail } from './controller.js';

const router = Router();

router.get('/:initialDate/:finalDate', getDocumentsByRangeDate);
router.post('/invalidate', invalidateDocument);
router.post('/:id/forward-email', forwardEmail);

export default router;