import { Router } from 'express';
import protect from '../../middlewares/auth.middleware.js';
import restrictTo from '../../middlewares/roles.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { submitRatingSchema } from './rating.validation.js';
import * as ctrl from './rating.controller.js';

const router = Router();

router.use(protect);
router.use(restrictTo('USER')); // Restricts strictly to Normal Users [cite: 36]

router.get('/stores', ctrl.getStoresForUser); // Handles search by Name & Address [cite: 45]
router.post('/submit', validate(submitRatingSchema), ctrl.upsertRating); // Handles initial or updated scores [cite: 51, 52, 53]
router.get('/history-log', ctrl.getUserRatingsLog);

export default router;