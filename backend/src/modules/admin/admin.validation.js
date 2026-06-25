import Joi from 'joi';

export const createStoreSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    address: Joi.string().max(400).required().messages({
        'string.max': 'Address cannot exceed 400 characters'
    }),
    ownerId: Joi.string().guid({ version: 'uuidv4' }).optional().allow(null)
});

export const createUserSchema = Joi.object({
    name: Joi.string().min(2).max(60).required().messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 60 characters'
    }),
    email: Joi.string().email().required(),
    address: Joi.string().max(400).required(),
    password: Joi.string().min(8).max(16).pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/).required().messages({
        'string.pattern.base': 'Password must contain 8-16 characters, 1 uppercase letter, and 1 special character'
    }),
    role: Joi.string().valid('USER','ADMIN', 'STORE_OWNER').required()
});