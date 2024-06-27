import { Router } from 'express';
import { getRoles, getRolePermissions, createRole, updateRole, changeRoleState } from './controller.js';
import schema from './schemas.js';
import { checkSchema } from 'express-validator';

const router = Router();

router.get('/', getRoles);
router.get('/:id/permissions', checkSchema(schema.getRolePermissions), getRolePermissions);
router.post('/', checkSchema(schema.create), createRole);
router.put('/:id', checkSchema(schema.update), updateRole);
router.put('/change_state/:id', checkSchema(schema.changeState), changeRoleState);

export default router;