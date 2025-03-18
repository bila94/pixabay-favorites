import Joi from 'joi';

export const favoriteListSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  per_page: Joi.number().integer().min(1).max(100).default(20)
});

export const addFavoriteSchema = Joi.object({
  contentId: Joi.string().required(),
  contentType: Joi.string().valid('photo', 'video').required(),
  contentData: Joi.object().required()
});