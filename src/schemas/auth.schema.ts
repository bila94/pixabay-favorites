import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(8).pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/
  ).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'string.pattern.base': 'Password must include lowercase, uppercase, number, and special character',
    'any.required': 'Password is required'
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().required().messages({
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});