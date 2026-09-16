import express from 'express';
import { getRecovery, logRecovery } from '../controllers/recoveryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getRecovery)
    .post(logRecovery);

export default router;
