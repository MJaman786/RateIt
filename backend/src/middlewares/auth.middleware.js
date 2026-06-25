// Auth Middleware

import jwt from 'jsonwebtoken';
import AppError from "../common/AppError.js";
import envConfig from '../config/env.config.js';

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No token provided', 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, envConfig.JWT_SECRET);
        req.user = decoded; // { id, email, role }
        next();
    } catch (error) {
        next(error);
    }
}

export default protect;
