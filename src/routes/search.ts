import express, { RequestHandler } from 'express';
import * as searchController from '../controllers/searchController';
import auth from '../middleware/auth';
import { validate } from '../middleware/validate';
import { searchSchema } from '../schemas/search.schema';

const router = express.Router();

router.get('/', 
  auth as RequestHandler, 
  validate(searchSchema, 'query') as RequestHandler,
  searchController.searchContent as RequestHandler
);

export default router;