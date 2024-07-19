import { Router } from 'express';
import { getInvoicesOdbcByDateRange, sendFceToMh } from './controller.js';
import schema from './schemas.js';
import { checkSchema } from 'express-validator';

const router = Router();

router.get('/odbc/range/:initialDate/:finalDate/:emissionDate', getInvoicesOdbcByDateRange)
router.post('/odbc/send/:initialDate/:finalDate/:emissionDate', sendFceToMh)

export default router;