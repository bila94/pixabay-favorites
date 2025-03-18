import Joi from 'joi';

export const searchSchema = Joi.object({
  query: Joi.string().required().messages({
    'any.required': 'Search query is required'
  }),
  type: Joi.string().valid('photo', 'video').default('photo'),
  page: Joi.number().integer().min(1).default(1),
  per_page: Joi.number().integer().min(1).max(100).default(20)
});