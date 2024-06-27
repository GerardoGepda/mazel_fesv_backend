import { Router } from 'express';
import { createMenu, updateMenu, deleteMenu, getMenus, modifyOrders, getMenusByRole } from './controller.js';
import schema from './schemas.js';
import { checkSchema } from 'express-validator';

const router = Router();

router.get('/', getMenus);
router.get('/role/:roleId', checkSchema(schema.menusByRoleId), getMenusByRole);
router.post('/', checkSchema(schema.create), createMenu);
router.put('/:id', checkSchema(schema.update), updateMenu);
router.delete('/:id', checkSchema(schema.delete), deleteMenu);
router.post('/modifyorders', checkSchema(schema.modifyOrders), modifyOrders);

export default router; 