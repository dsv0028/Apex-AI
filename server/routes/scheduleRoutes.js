import express from 'express';
import {
    getSchedule,
    createSchedule,
    updateScheduleStatus,
    deleteSchedule,
} from '../controllers/scheduleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getSchedule)
    .post(createSchedule);

router.patch('/:id/status', updateScheduleStatus);
router.delete('/:id', deleteSchedule);

export default router;
