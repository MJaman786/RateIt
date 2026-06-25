import { Router } from 'express';
import protect from '../../middlewares/auth.middleware.js';
import restrictTo from '../../middlewares/roles.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { createStoreSchema, createUserSchema } from './admin.validation.js';
import * as ctrl from './admin.controller.js';

const router = Router();

// Apply global security restrictions to all admin endpoints
router.use(protect);
router.use(restrictTo('ADMIN'));

router.get('/dashboard-stats', ctrl.getDashboardStats);
router.post('/stores', validate(createStoreSchema), ctrl.createStore);
router.post('/users', validate(createUserSchema), ctrl.createUser);
router.get('/stores', ctrl.getAllStores);
router.get('/users', ctrl.getAllUsers);
router.get('/users/:id', ctrl.getUserDetails);
router.get('/unassigned-owners', ctrl.getUnassignedOwners);
router.get('/ratings', ctrl.getAllRatings);

export default router;