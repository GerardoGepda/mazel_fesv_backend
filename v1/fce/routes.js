import { Router } from 'express';
import { getInvoicesOdbcByDateRange, sendFceToMh } from './controller.js';

const router = Router();

router.get('/odbc/range/:initialDate/:finalDate/:emissionDate', getInvoicesOdbcByDateRange)
router.post('/send/:initialDate/:finalDate/:emissionDate', sendFceToMh)

export default router;