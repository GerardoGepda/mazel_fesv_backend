import { Router } from 'express';
import { getCustomers, createCustomer, getCustomerOdbcByDocument, updateCustomer, deleteCustomer } from './controller.js';
import schema from './schemas.js';
import { checkSchema } from 'express-validator';

const router = Router();

router.get('/', getCustomers);
router.get('/odbc/:id', getCustomerOdbcByDocument);
router.post('/', checkSchema(schema.create), createCustomer);
router.put('/:id', checkSchema(schema.update), updateCustomer);
router.delete('/:id', checkSchema(schema.delete), deleteCustomer);

export default router;