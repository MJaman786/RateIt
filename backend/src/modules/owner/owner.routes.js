import { Router } from 'express';
import protect from '../../middlewares/auth.middleware.js';
import restrictTo from '../../middlewares/roles.middleware.js';
import * as ctrl from './owner.controller.js';

const router = Router();

router.use(protect);
router.use(restrictTo('STORE_OWNER')); // Security gate for Store Owners [cite: 55]

router.get('/dashboard', ctrl.getOwnerDashboardInfo); // Shows profile averages and feedback list [cite: 59, 60]
router.get('/ratings', ctrl.getOwnerStoreRatings); // Shows the users who rated the store

export default router;
