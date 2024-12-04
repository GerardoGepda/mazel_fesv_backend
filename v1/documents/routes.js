import { Router } from 'express';
import { getDocumentsByRangeDate, invalidateDocument, forwardEmail, getPdf, getHanaDocumentsByRangeDate } from './controller.js';

const router = Router();

router.get('/hana/:initialDate/:finalDate', getHanaDocumentsByRangeDate);
router.get('/:initialDate/:finalDate', getDocumentsByRangeDate);
router.post('/invalidate', invalidateDocument);
router.post('/:id/forward-email', forwardEmail);
router.post('/:id/pdf', getPdf);

export default router;