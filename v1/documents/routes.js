import { Router } from 'express';
import { getDocumentsByRangeDate, invalidateDocument, forwardEmail, getPdf } from './controller.js';

const router = Router();

router.get('/:initialDate/:finalDate', getDocumentsByRangeDate);
router.post('/invalidate', invalidateDocument);
router.post('/:id/forward-email', forwardEmail);
router.post('/:id/pdf', getPdf);

export default router;