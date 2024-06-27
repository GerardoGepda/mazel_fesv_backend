import { Router } from 'express';
import { getAllUsers, createUser, sendEmailForgotPassword, confirmCode, changePassword } from './controller.js';
import { schema } from './schema.js';
import { checkSchema } from 'express-validator';
import { authenticateToken } from '../../middleware/authMiddleware.js';


const router = Router();

router.get('/', [authenticateToken], getAllUsers);
router.post('/' , [authenticateToken], checkSchema(schema), createUser);
router.post('/forgot_password', sendEmailForgotPassword);
router.get('/confirm_code/:code', confirmCode);
router.put('/change_password/:code', changePassword);

export default router;