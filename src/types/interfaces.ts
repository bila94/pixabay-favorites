import { Request } from 'express';
import { Model, Optional } from 'sequelize';
import Joi from 'joi';

// User Interfaces
export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Favorite Interfaces
export interface FavoriteAttributes {
  id: number;
  userId: number;
  contentId: string;
  contentType: 'photo' | 'video';
  contentData: any; // JSON data from Pixabay
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FavoriteCreationAttributes extends Optional<FavoriteAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface FavoriteInstance extends Model<FavoriteAttributes, FavoriteCreationAttributes>, FavoriteAttributes {}

// Auth Interfaces
export interface RegisterPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface JwtPayload {
  userId: number;
}

// Request Interface with User
export interface RequestWithUser extends Request {
  user?: UserInstance;
}

// Pixabay API Interfaces
export interface PixabayPhoto {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  views: number;
  downloads: number;
  collections: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}

export interface PixabayVideoFile {
  url: string;
  width: number;
  height: number;
  size: number;
  thumbnail: string;
}

export interface PixabayVideoFiles {
  large: PixabayVideoFile;
  medium: PixabayVideoFile;
  small: PixabayVideoFile;
  tiny: PixabayVideoFile;
}

export interface PixabayVideo {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  duration: number;
  picture_id: string;
  videos: PixabayVideoFiles;
  views: number;
  downloads: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}

export interface PixabayPhotoResponse {
  total: number;
  totalHits: number;
  hits: PixabayPhoto[];
}

export interface PixabayVideoResponse {
  total: number;
  totalHits: number;
  hits: PixabayVideo[];
}

// Search Response Interface
export interface ContentItem {
  id: number;
  type: 'photo' | 'video';
  thumbnail: string;
  fullSize: string;
  user: string;
  tags: string[];
  downloads: number;
  likes: number;
  comments: number;
  original: PixabayPhoto | PixabayVideo;
}

export interface SearchResponse {
  total: number;
  totalPages: number;
  currentPage: number;
  results: ContentItem[];
}

// Favorites Response Interface
export interface FavoritesResponse {
  total: number;
  totalPages: number;
  currentPage: number;
  results: FavoriteInstance[];
}

export interface FavoritedIdsResponse {
  favoritedIds: string[];
}

export interface ValidatedRequest extends Request {
  value: any;
}