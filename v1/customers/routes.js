import { Router } from 'express';
import { getCustomers, createCustomer, getCustomerOdbcByDocument } from './controller.js';
import schema from './schemas.js';
import { checkSchema } from 'express-validator';

const router = Router();

router.get('/', getCustomers);
router.get('/odbc/:id', getCustomerOdbcByDocument)
router.post('/', checkSchema(schema.create), createCustomer);

export default router;