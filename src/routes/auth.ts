import express, { RequestHandler } from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

router.post('/register', authController.register as RequestHandler);
router.post('/login', authController.login as RequestHandler);

export default router;