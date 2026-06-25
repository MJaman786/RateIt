import Joi from 'joi';

export const submitRatingSchema = Joi.object({
    storeId: Joi.string().guid({ version: 'uuidv4' }).required(),
    rating: Joi.number().integer().min(1).max(5).required().messages({
        'number.min': 'Rating must be at least 1 star',
        'number.max': 'Rating cannot exceed 5 stars'
    })
});