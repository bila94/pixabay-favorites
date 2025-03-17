import express, { RequestHandler } from 'express';
import * as searchController from '../controllers/searchController';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth as RequestHandler, searchController.searchContent as RequestHandler);

export default router;