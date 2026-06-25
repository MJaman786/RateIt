import AppError from "../common/AppError.js";

const restrictTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        throw new AppError('You do not have permission', 403);
    }
    next();
};

export default restrictTo;
