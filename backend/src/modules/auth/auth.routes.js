import { Router } from 'express';
import validate from '../../middlewares/validate.middleware.js';
import protect from '../../middlewares/auth.middleware.js';
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
} from './auth.validation.js';
import * as ctrl from './auth.controller.js';

const router = Router();

// ─── Public Routes ─────────────────────────────
router.post('/register',         validate(registerSchema),       ctrl.register);
router.post('/login',            validate(loginSchema),          ctrl.login);
router.post('/refresh',                                          ctrl.refresh);
router.get('/verify-email/:token',                               ctrl.verifyEmail);
router.post('/forgot-password',  validate(forgotPasswordSchema), ctrl.forgotPassword);
router.post('/reset-password',   validate(resetPasswordSchema),  ctrl.resetPassword);

// ─── Protected Routes (token required) ─────────
router.get('/me',                protect,                        ctrl.getMe);
router.patch('/change-password', protect, validate(changePasswordSchema), ctrl.changePassword);
router.post('/logout',           protect,                        ctrl.logout);

export default router;
