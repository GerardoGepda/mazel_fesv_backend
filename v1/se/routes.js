import { Router } from 'express';
import { getSeDocsOdbcByDateRange, sendSeToMh } from './controller.js';

const router = Router();

router.get('/odbc/range/:initialDate/:finalDate/:emissionDate', getSeDocsOdbcByDateRange);
router.post('/send/:initialDate/:finalDate/:emissionDate', sendSeToMh);

export default router;