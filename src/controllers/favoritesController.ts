import { Response } from 'express';
import { Favorite } from '../models';
import { 
  RequestWithUser, 
  FavoriteAttributes, 
  FavoritesResponse,
  FavoritedIdsResponse 
} from '../types/interfaces';

// Add to favorites
export const addFavorite = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const { contentId, contentType, contentData } = req.body as Partial<FavoriteAttributes>;
    
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const userId = req.user.id;

    if (!contentId || !contentType || !contentData) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ 
      where: { 
        userId, 
        contentId 
      } 
    });
    
    if (existingFavorite) {
      res.status(400).json({ message: 'Content already in favorites' });
      return;
    }

    // Create new favorite
    const favorite = await Favorite.create({
      userId,
      contentId,
      contentType,
      contentData
    });

    res.status(201).json(favorite);
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove from favorites
export const removeFavorite = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const { contentId } = req.params;
    
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const userId = req.user.id;

    // Find and remove favorite
    const rowsDeleted = await Favorite.destroy({ 
      where: { 
        userId, 
        contentId 
      } 
    });
    
    if (rowsDeleted === 0) {
      res.status(404).json({ message: 'Favorite not found' });
      return;
    }

    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user favorites with pagination
export const getFavorites = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const per_page = parseInt(req.query.per_page as string) || 20;
    
    // Calculate offset for pagination
    const offset = (page - 1) * per_page;

    // Get total count for pagination info
    const totalCount = await Favorite.count({ 
      where: { userId } 
    });

    // Get paginated favorites for user
    const favorites = await Favorite.findAll({ 
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: per_page,
      offset: offset
    });

    const response: FavoritesResponse = {
      total: totalCount,
      totalPages: Math.ceil(totalCount / per_page),
      currentPage: page,
      results: favorites
    };

    res.json(response);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get only the IDs of favorited content for a user
export const getFavoritedIds = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const userId = req.user.id;

    // Get only contentIds for user's favorites
    const favorites = await Favorite.findAll({ 
      attributes: ['contentId'],
      where: { userId }
    });

    // Extract IDs into an array
    const favoritedIds = favorites.map(fav => fav.contentId);

    const response: FavoritedIdsResponse = { 
      favoritedIds 
    };
    
    res.json(response);
  } catch (error) {
    console.error('Get favorited IDs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};