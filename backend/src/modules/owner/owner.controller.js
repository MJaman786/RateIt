import asyncHandler from '../../common/asyncHandler.js';
import { sendSuccess } from '../../common/response.js';
import ownerService from './owner.service.js';

export const getOwnerDashboardInfo = asyncHandler(async (req, res) => {
    const dashboardData = await ownerService.getOwnerDashboardInfo(req.user.id);
    sendSuccess(res, {
        message: 'Owner dashboard metrics loaded',
        data: dashboardData
    });
});

export const getOwnerStoreRatings = asyncHandler(async (req, res) => {
    const ratingsData = await ownerService.getOwnerStoreRatings(req.user.id, req.query);
    sendSuccess(res, {
        message: 'Store ratings loaded',
        data: ratingsData.ratings,
        pagination: {
            page: ratingsData.page,
            limit: ratingsData.limit,
            totalItems: ratingsData.totalRatings,
            totalPages: ratingsData.totalPages
        }
    });
});
