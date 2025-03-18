import express, { RequestHandler } from 'express';
import * as authController from '../controllers/authController';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

const router = express.Router();

router.post('/register', 
  validate(registerSchema) as RequestHandler,
  authController.register as RequestHandler
);

router.post('/login', 
  validate(loginSchema) as RequestHandler, 
  authController.login as RequestHandler
);

export default router;