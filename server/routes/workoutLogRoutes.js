import express from 'express';
import {
    createWorkoutLog,
    getWorkoutLogs,
    deleteWorkoutLog,
} from '../controllers/workoutLogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getWorkoutLogs)
    .post(createWorkoutLog);

router.route('/:id')
    .delete(deleteWorkoutLog);

export default router;
