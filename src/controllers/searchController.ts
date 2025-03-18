import { Request, Response } from 'express';
import axios from 'axios';
import { 
  PixabayPhotoResponse, 
  PixabayVideoResponse, 
  ContentItem, 
  SearchResponse 
} from '../types/interfaces';

export const searchContent = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validated query params - note these are already the correct types!
    const { query, type, page, per_page } = req.query as unknown as { 
      query: string;
      type: 'photo' | 'video';
      page: number;
      per_page: number;
    };

    // Determine API endpoint based on content type
    const endpoint = type === 'photo' ? 'https://pixabay.com/api/' : 'https://pixabay.com/api/videos/';

    // Make request to Pixabay API
    const response = await axios.get(endpoint, {
      params: {
        key: process.env.PIXABAY_API_KEY,
        q: query,
        page,
        per_page,
        safesearch: true
      }
    });

    const data = response.data as PixabayPhotoResponse | PixabayVideoResponse;

    // Format and send response
    const searchResponse: SearchResponse = {
      total: data.totalHits || 0,
      totalPages: Math.ceil((data.totalHits || 0) / per_page),
      currentPage: page,
      results: data.hits.map(item => {
        const contentItem: ContentItem = {
          id: item.id,
          type: type,
          thumbnail: type === 'photo' 
            ? (item as any).previewURL 
            : (item as any).videos?.medium?.thumbnail,
          fullSize: type === 'photo' 
            ? (item as any).webformatURL 
            : (item as any).videos?.medium?.url,
          user: item.user,
          tags: item.tags.split(',').map(tag => tag.trim()),
          downloads: item.downloads,
          likes: item.likes,
          comments: item.comments,
          original: item
        };
        return contentItem;
      })
    };

    res.json(searchResponse);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error fetching search results' });
  }
};