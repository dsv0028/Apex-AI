import express from 'express';
import {
    getNutrition,
    logMeal,
    updateWater,
    deleteMeal,
} from '../controllers/nutritionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getNutrition);
router.post('/meal', logMeal);
router.post('/water', updateWater);
router.delete('/meal/:mealId', deleteMeal);

export default router;
