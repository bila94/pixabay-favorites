import Joi from 'joi';

export const searchSchema = Joi.object({
  query: Joi.string().required().max(100).messages({
    'any.required': 'Search query is required',
    'string.max': 'Search query cannot exceed 100 characters'
  }),
  type: Joi.string().valid('photo', 'video').default('photo'),
  page: Joi.number().integer().min(1).default(1),
  per_page: Joi.number().integer().min(1).max(100).default(20)
});