import asyncHandler from '../../common/asyncHandler.js';
import { sendSuccess } from '../../common/response.js';
import adminService from './admin.service.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await adminService.getDashboardStats();
    sendSuccess(res, {
        message: 'Admin metrics computed successfully',
        data: stats
    });
});

export const createStore = asyncHandler(async (req, res) => {
    const store = await adminService.createStore(req.body);
    sendSuccess(res, {
        statusCode: 201,
        message: 'Store created successfully',
        data: store
    });
});

export const createUser = asyncHandler(async (req, res) => {
    const user = await adminService.createUser(req.body);
    sendSuccess(res, {
        statusCode: 201,
        message: 'User profile registered successfully',
        data: user
    });
});

export const getAllStores = asyncHandler(async (req, res) => {
    const { search, sortBy, order } = req.query;
    const stores = await adminService.getAllStores({ search, sortBy, order });
    sendSuccess(res, {
        message: 'Store listings fetched successfully',
        data: stores
    });
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const { search, role, sortBy, order } = req.query;
    const users = await adminService.getAllUsers({ search, role, sortBy, order });
    sendSuccess(res, {
        message: 'User listings fetched successfully',
        data: users
    });
});

export const getUserDetails = asyncHandler(async (req, res) => {
    const details = await adminService.getUserDetails(req.params.id);
    sendSuccess(res, {
        message: 'Detailed user demographics loaded successfully',
        data: details
    });
});

export const getUnassignedOwners = asyncHandler(async (req, res) => {
    const owners = await adminService.getUnassignedOwners();
    sendSuccess(res, {
        message: 'Unassigned system store owners loaded successfully',
        data: owners
    });
});

export const getAllRatings = asyncHandler(async (req, res) => {
    const { search, scoreFilter, sortBy, order } = req.query;
    const ratings = await adminService.getAllRatings({ search, rating: scoreFilter, sortBy, order });
    sendSuccess(res, {
        message: 'Global ratings ledger registry parsed successfully',
        data: ratings
    });
});