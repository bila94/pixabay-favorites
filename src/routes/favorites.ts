import express, { RequestHandler } from 'express';
import * as favoritesController from '../controllers/favoritesController';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/', auth as RequestHandler, favoritesController.addFavorite as RequestHandler);
router.delete('/:contentId', auth as RequestHandler, favoritesController.removeFavorite as RequestHandler);
router.get('/', auth as RequestHandler, favoritesController.getFavorites as RequestHandler);
router.get('/ids', auth as RequestHandler, favoritesController.getFavoritedIds as RequestHandler);

export default router;