import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { query } from '../../config/db.config.js';
import AppError from '../../common/AppError.js';

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });
};

const generateRandomToken = () => crypto.randomBytes(32).toString('hex');

const register = async ({ name, email, password, address, role = 'USER' }) => {
    // 1. Check if user already exists
    const existingRes = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existingRes.rows.length > 0) {
        throw new AppError('Email already registered', 409);
    }

    // 2. Security Setup & Hash Configuration
    const emailVerifyToken = generateRandomToken();
    const emailVerifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Persistent Row Insertion
    const insertSQL = `
        INSERT INTO users (name, email, password, address, email_verify_token, email_verify_expiry, role)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, email, role, is_email_verified;
    `;
    const result = await query(insertSQL, [name, email.toLowerCase(), hashedPassword, address, emailVerifyToken, emailVerifyExpiry, role]);
    const newUser = result.rows[0];

    console.log(`📧 Simulation Email Verification Link Token: ${emailVerifyToken}`);

    // Map `id` to `_id` to remain fully consistent with your original frontend architecture
    return {
        _id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: newUser.is_email_verified
    };
};

const login = async ({ email, password }) => {
    // 1. Fetch record containing explicit password payload matching destination
    const userRes = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = userRes.rows[0];

    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    // 2. Validate password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError('Invalid email or password', 401);
    }

    // 3. Status checks
    if (user.status === 'BANNED') throw new AppError('Your account has been banned', 403);
    if (user.status === 'INACTIVE') throw new AppError('Your account is inactive', 403);

    // 4. Token generation
    const tokenPayload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // 5. Update session states within DB
    const currentLoginTime = new Date();
    await query('UPDATE users SET refresh_token = $1, last_login = $2 WHERE id = $3', [accessToken, currentLoginTime, user.id]);

    return {
        accessToken,
        refreshToken,
        user: {
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isEmailVerified: user.is_email_verified,
            lastLogin: currentLoginTime
        }
    };
};

const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) throw new AppError('Refresh token is required', 401);

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
        throw new AppError('Invalid or expired refresh token', 401);
    }

    const userRes = await query('SELECT id, email, role, refresh_token FROM users WHERE id = $1', [decoded.id]);
    const user = userRes.rows[0];

    if (!user || user.refresh_token !== refreshToken) {
        throw new AppError('Refresh token is invalid or revoked', 401);
    }

    const tokenPayload = { id: user.id, email: user.email, role: user.role };
    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    await query('UPDATE users SET refresh_token = $1 WHERE id = $2', [newRefreshToken, user.id]);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const logout = async (userId) => {
    await query('UPDATE users SET refresh_token = NULL WHERE id = $1', [userId]);
};

const getMe = async (userId) => {
    const userRes = await query('SELECT id, name, email, address, role, is_email_verified, created_at FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];
    if (!user) throw new AppError('User not found', 404);

    const baseProfile = {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        isEmailVerified: user.is_email_verified,
        createdAt: user.created_at
    };

    // Auto-fetch corporate assets summary parameters if account matches a store manager context
    if (user.role === 'STORE_OWNER') {
        const storeRes = await query('SELECT name, address FROM stores WHERE owner_id = $1', [user.id]);
        if (storeRes.rows.length > 0) {
            baseProfile.linkedStoreName = storeRes.rows[0].name;
            baseProfile.storeAddress = storeRes.rows[0].address;
        } else {
            baseProfile.linkedStoreName = 'No Store Allocated';
            baseProfile.storeAddress = 'N/A';
        }
    }

    return baseProfile;
};

const verifyEmail = async (token) => {
    const userRes = await query(
        'SELECT id, email FROM users WHERE email_verify_token = $1 AND email_verify_expiry > $2',
        [token, new Date()]
    );
    const user = userRes.rows[0];

    if (!user) throw new AppError('Invalid or expired verification token', 400);

    await query(
        'UPDATE users SET is_email_verified = TRUE, email_verify_token = NULL, email_verify_expiry = NULL WHERE id = $1',
        [user.id]
    );

    return { email: user.email };
};

const forgotPassword = async (email) => {
    const userRes = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = userRes.rows[0];
    if (!user) return; // Silent return for security

    const resetToken = generateRandomToken();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await query(
        'UPDATE users SET reset_password_token = $1, reset_password_expiry = $2 WHERE id = $3',
        [resetToken, resetExpiry, user.id]
    );

    console.log(`🔑 Security Action Required - Reset Token: ${resetToken}`);
};

const resetPassword = async ({ token, password }) => {
    const userRes = await query(
        'SELECT id FROM users WHERE reset_password_token = $1 AND reset_password_expiry > $2',
        [token, new Date()]
    );
    const user = userRes.rows[0];
    if (!user) throw new AppError('Invalid or expired reset token', 400);

    const hashedPassword = await bcrypt.hash(password, 12);
    await query(
        'UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expiry = NULL, refresh_token = NULL WHERE id = $2',
        [hashedPassword, user.id]
    );

    return { email: user.email };
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
    const userRes = await query('SELECT password FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new AppError('Current password is incorrect', 400);

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await query('UPDATE users SET password = $1, refresh_token = NULL WHERE id = $2', [hashedPassword, userId]);
};

const authServices = {
    register,
    login,
    refreshAccessToken,
    logout,
    getMe,
    verifyEmail,
    forgotPassword,
    resetPassword,
    changePassword,
};

export default authServices;
