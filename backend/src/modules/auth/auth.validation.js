import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(60).required().messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 60 characters',
        'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email structure',
        'any.required': 'Email field is mandatory'
    }),
    address: Joi.string().max(400).required().messages({
        'string.max': 'Address must be under 400 characters',
        'any.required': 'Address is required'
    }),
    password: Joi.string().min(8).max(16).pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/).required().messages({
        'string.min': 'Password requires a minimum of 8 characters',
        'string.max': 'Password limit is 16 characters',
        'string.pattern.base': 'Password must include at least one uppercase letter and one special character',
        'any.required': 'Password is required'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match'
    }),
    role: Joi.string().valid('USER', 'ADMIN', 'STORE_OWNER').required()
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const forgotPasswordSchema = Joi.object({ email: Joi.string().email().required() });

export const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(8).max(16).pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
});

export const changePasswordSchema = Joi.object({
    userId: Joi.string().required().messages({
        'any.required': 'userId field is mandatory'
    }),
    currentPassword: Joi.string().required().messages({
        'any.required': 'currentPassword field is mandatory'
    }),
    newPassword: Joi.string().min(8).max(16).pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/).required().messages({
        'string.min': 'Password requires a minimum of 8 characters',
        'string.max': 'Password limit is 16 characters',
        'string.pattern.base': 'Password must include at least one uppercase letter and one special character',
        'any.required': 'newPassword field is mandatory'
    })
});