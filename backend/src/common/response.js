// ✅ Success response — matches ApiResponse<T>
export const sendSuccess = (res, { message = 'Request successful', data = null, statusCode = 200, pagination = null, summary = null } = {}) => {
    const response = {
        success: true,
        statusCode,
        message,
        data,
        timestamp: new Date().toISOString(),
    };
    if (pagination) response.pagination = pagination;
    if (summary) response.summary = summary;

    return res.status(statusCode).json(response);
};

// ❌ Error response — matches what your makeRequest catch block expects
export const sendError = (res, { message = 'Something went wrong', statusCode = 500, data = null } = {}) => {
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        data,
        timestamp: new Date().toISOString(),
    });
};
