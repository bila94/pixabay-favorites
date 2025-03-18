import express, { RequestHandler } from 'express';
import * as favoritesController from '../controllers/favoritesController';
import auth from '../middleware/auth';
import { validate } from '../middleware/validate';
import { favoriteListSchema, addFavoriteSchema } from '../schemas/favorites.schema';

const router = express.Router();

router.post('/', 
  auth as RequestHandler, 
  validate(addFavoriteSchema) as RequestHandler,
  favoritesController.addFavorite as RequestHandler
);

router.delete('/:contentId', 
  auth as RequestHandler, 
  favoritesController.removeFavorite as RequestHandler
);

router.get('/', 
  auth as RequestHandler, 
  validate(favoriteListSchema, 'query') as RequestHandler,
  favoritesController.getFavorites as RequestHandler
);

router.get('/ids', 
  auth as RequestHandler, 
  favoritesController.getFavoritedIds as RequestHandler
);

export default router;