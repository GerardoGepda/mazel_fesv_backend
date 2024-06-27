import { Router } from 'express';
import { createSubmenu, updateSubmenu, deletesubmenu } from './controller.js';
import schema from './schemas.js';
import { checkSchema } from 'express-validator';

const router = Router();

router.post('/', checkSchema(schema.create), createSubmenu);
router.put('/:id', checkSchema(schema.update), updateSubmenu);
router.delete('/:id', checkSchema(schema.delete), deletesubmenu);

export default router; 