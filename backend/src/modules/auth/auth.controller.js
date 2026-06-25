import asyncHandler from '../../common/asyncHandler.js';
import { sendSuccess } from '../../common/response.js';
import authService from './auth.service.js';

// POST /auth/register
const register = asyncHandler(async (req, res) => {
    // FIXED: Swapped 'phone' out for 'address' to match database and service expectations
    const { name, email, password, address, role } = req.body; 
    const user = await authService.register({ name, email, password, address, role });
    sendSuccess(res, {
        statusCode: 201,
        message: 'Registration successful. Please verify your email.',
        data: user,
    });
});

// POST /auth/login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    // ✅ Set refresh token as httpOnly cookie (more secure than returning it)
    res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendSuccess(res, {
        message: 'Login successful',
        data: {
            accessToken: result.accessToken,
            user: result.user,
        },
    });
});

// POST /auth/refresh
const refresh = asyncHandler(async (req, res) => {
    // Get from cookie OR body (mobile apps send in body)
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    const result = await authService.refreshAccessToken(refreshToken);

    // Rotate cookie too
    res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, {
        message: 'Token refreshed successfully',
        data: { accessToken: result.accessToken },
    });
});

// POST /auth/logout
const logout = asyncHandler(async (req, res) => {
    await authService.logout(req.user.id);
    res.clearCookie('refreshToken');
    sendSuccess(res, { message: 'Logged out successfully', data: null });
});

// GET /auth/me
const getMe = asyncHandler(async (req, res) => {
    const user = await authService.getMe(req.user.id);
    sendSuccess(res, { message: 'Profile fetched successfully', data: user });
});

// GET /auth/verify-email/:token
const verifyEmail = asyncHandler(async (req, res) => {
    const result = await authService.verifyEmail(req.params.token);
    sendSuccess(res, { message: 'Email verified successfully', data: result });
});

// POST /auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
    await authService.forgotPassword(req.body.email);
    // ✅ Always same message — don't reveal if email exists
    sendSuccess(res, {
        message: 'If this email exists, a reset link has been sent.',
        data: null,
    });
});

// POST /auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
    const result = await authService.resetPassword(req.body);
    sendSuccess(res, { message: 'Password reset successfully', data: result });
});

// PATCH /auth/change-password
const changePassword = asyncHandler(async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body; 
    
    // Pass extracted body parameters into the service layer
    await authService.changePassword(userId, { currentPassword, newPassword });
    
    sendSuccess(res, { message: 'Password changed successfully', data: null });
});

export {
    register,
    login,
    refresh,
    logout,
    getMe,
    verifyEmail,
    forgotPassword,
    resetPassword,
    changePassword,
};
