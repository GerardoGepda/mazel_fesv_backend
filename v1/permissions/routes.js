import { Router } from 'express';
import { createPermission, updatePermission, changePermissionState } from './controller.js';
import schema from './schemas.js';
import { checkSchema } from 'express-validator';

const router = Router();

router.post('/', checkSchema(schema.create), createPermission);
router.put('/:id', checkSchema(schema.update), updatePermission);
router.put('/change_state/:id', checkSchema(schema.changeState), changePermissionState);

export default router; 