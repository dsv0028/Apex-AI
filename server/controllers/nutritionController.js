import asyncHandler from 'express-async-handler';
import Nutrition from '../models/Nutrition.js';

// @desc    Get nutrition summary and meals for a date
// @route   GET /api/nutrition?date=YYYY-MM-DD
// @access  Private
export const getNutrition = asyncHandler(async (req, res) => {
    const date = req.query.date || new Date().toISOString().split('T')[0];

    let entry = await Nutrition.findOne({ user: req.user._id, date }).lean();

    if (!entry) {
        // Return default day template
        entry = {
            date,
            targetCalories: 2600,
            targetProteinG: 160,
            targetCarbsG: 280,
            targetFatsG: 70,
            targetWaterMl: 3500,
            waterConsumedMl: 0,
            meals: [],
        };
    }

    // Compute totals
    const consumedCalories = (entry.meals || []).reduce((sum, m) => sum + (m.calories || 0), 0);
    const consumedProtein = (entry.meals || []).reduce((sum, m) => sum + (m.proteinG || 0), 0);
    const consumedCarbs = (entry.meals || []).reduce((sum, m) => sum + (m.carbsG || 0), 0);
    const consumedFats = (entry.meals || []).reduce((sum, m) => sum + (m.fatsG || 0), 0);

    res.json({
        ...entry,
        totals: {
            calories: consumedCalories,
            proteinG: consumedProtein,
            carbsG: consumedCarbs,
            fatsG: consumedFats,
        },
    });
});

// @desc    Log a meal
// @route   POST /api/nutrition/meal
// @access  Private
export const logMeal = asyncHandler(async (req, res) => {
    const { date, name, mealType, calories, proteinG, carbsG, fatsG, time } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];

    let entry = await Nutrition.findOne({ user: req.user._id, date: targetDate });

    if (!entry) {
        entry = await Nutrition.create({
            user: req.user._id,
            date: targetDate,
            meals: [],
        });
    }

    entry.meals.push({
        name: name || 'Meal Entry',
        mealType: mealType || 'Breakfast',
        calories: Number(calories) || 0,
        proteinG: Number(proteinG) || 0,
        carbsG: Number(carbsG) || 0,
        fatsG: Number(fatsG) || 0,
        time: time || '12:00 PM',
    });

    await entry.save();
    res.status(201).json(entry);
});

// @desc    Update water intake
// @route   POST /api/nutrition/water
// @access  Private
export const updateWater = asyncHandler(async (req, res) => {
    const { date, deltaMl } = req.body; // e.g., +250 or -250
    const targetDate = date || new Date().toISOString().split('T')[0];

    let entry = await Nutrition.findOne({ user: req.user._id, date: targetDate });

    if (!entry) {
        entry = await Nutrition.create({
            user: req.user._id,
            date: targetDate,
            waterConsumedMl: Math.max(0, Number(deltaMl) || 0),
        });
    } else {
        entry.waterConsumedMl = Math.max(0, (entry.waterConsumedMl || 0) + Number(deltaMl));
        await entry.save();
    }

    res.json(entry);
});

// @desc    Delete a meal
// @route   DELETE /api/nutrition/meal/:mealId?date=YYYY-MM-DD
// @access  Private
export const deleteMeal = asyncHandler(async (req, res) => {
    const { mealId } = req.params;
    const date = req.query.date || new Date().toISOString().split('T')[0];

    const entry = await Nutrition.findOne({ user: req.user._id, date });
    if (!entry) {
        res.status(404);
        throw new Error('Nutrition record not found');
    }

    entry.meals = entry.meals.filter((m) => m._id.toString() !== mealId);
    await entry.save();

    res.json(entry);
});
