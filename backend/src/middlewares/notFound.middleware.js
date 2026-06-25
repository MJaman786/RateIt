import { sendError } from "../common/response.js";

const notFoundHandler = (req, res) => {
    sendError(res, {
        message: `Route ${req.method} ${req.originalUrl} not found`,
        statusCode: 404,
    });
};

export default notFoundHandler;
