import AppError from "../common/AppError.js";

// Pass a Joi schema to validate req.body
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const message = error.details.map(d => d.message).join(', ');
        throw new AppError(message, 400);
    }
    next();
};

export default validate;
