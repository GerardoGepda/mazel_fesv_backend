import { Router } from 'express';
import { getRoutes, createRoute, updateRoute, changeState } from './controller.js';
import schema from './schemas.js';
import { checkSchema } from 'express-validator';

const router = Router();

router.get('/', getRoutes);
router.post('/', checkSchema(schema.create), createRoute);
router.put('/:id', checkSchema(schema.update), updateRoute);
router.put('/change_state/:id', checkSchema(schema.changeState), changeState);

export default router;