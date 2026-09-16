import express from 'express';
import {
    getVideoReviews,
    createVideoReview,
    addAnnotation,
    deleteVideoReview,
} from '../controllers/videoReviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getVideoReviews)
    .post(createVideoReview);

router.post('/:id/annotations', addAnnotation);
router.delete('/:id', deleteVideoReview);

export default router;
