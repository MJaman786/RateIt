import asyncHandler from '../../common/asyncHandler.js';
import { sendSuccess } from '../../common/response.js';
import ratingService from './rating.service.js';

export const getStoresForUser = asyncHandler(async (req, res) => {
    const stores = await ratingService.getStoresForUser(req.user.id, req.query.search);
    sendSuccess(res, {
        message: 'Stores collection parsed successfully',
        data: stores
    });
});

export const upsertRating = asyncHandler(async (req, res) => {
    const { storeId, rating } = req.body;
    const savedRating = await ratingService.upsertRating({
        userId: req.user.id,
        storeId,
        rating
    });
    sendSuccess(res, {
        message: 'Rating saved successfully',
        data: savedRating
    });
});

export const getUserRatingsLog = asyncHandler(async (req, res) => {
    const { search, sortBy, order } = req.query;
    const logs = await ratingService.getUserRatingsLog(req.user.id, { search, sortBy, order });
    sendSuccess(res, {
        message: 'Personal consumer evaluation logs fetched successfully',
        data: logs
    });
});