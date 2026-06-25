// Wraps async functions — no need for try/catch in every controller
const asyncHandler = (asyncOperation) => {
    return async (req, res, next) => {
        try {
            await asyncOperation(req, res, next);
        } catch (error) {
            next(error)
        }
    }
}

export default asyncHandler;
