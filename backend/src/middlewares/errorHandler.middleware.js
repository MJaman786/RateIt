import AppError from "../common/AppError.js";
import { sendError } from "../common/response.js";

const errorHandler = (error, req, res, next) => {
    if (error.name === 'TokenExpiredError') {
        return sendError(res, {
            message: 'JWT expired',
            statusCode: 401,
        });
    }

    if (error.name === 'JsonWebTokenError') {
        return sendError(res, {
            message: 'Invalid token',
            statusCode: 401,
        });
    }

    if (error instanceof AppError) {
        return sendError(res, {
            message: error.message,
            statusCode: error.statusCode,
        });
    }

    return sendError(res, {
        message: error.message || 'Internal server error',
        statusCode: 500,
    });
};

export default errorHandler;
