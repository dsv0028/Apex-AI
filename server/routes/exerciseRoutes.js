import express from 'express';
import {
    getExercises,
    createCustomExercise,
} from '../controllers/exerciseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getExercises)
    .post(createCustomExercise);

export default router;
