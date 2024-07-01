import { Router } from 'express';
import { getMunicipalitiesActive } from './controller.js';

const router = Router();

router.get('/active', getMunicipalitiesActive);

export default router;