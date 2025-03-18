import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema, source: 'body' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = source === 'query' ? req.query : req.body;
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });
    
    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      res.status(400).json({ message });
      return;
    }
    
    // Replace request data with validated data
    if (source === 'query') {
      req.query = value;
    } else {
      req.body = value;
    }
    
    next();
  };
};