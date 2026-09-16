import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Performance from '../models/Performance.js';
import Workout from '../models/Workout.js';
import Feedback from '../models/Feedback.js';

// @desc    Get all athletes
// @route   GET /api/coach/athletes
// @access  Private/Coach
const getAthletes = asyncHandler(async (req, res) => {
    // Return all users with role 'athlete'
    const athletes = await User.find({ role: 'athlete' }).select('-password');
    res.status(200).json(athletes);
});

// @desc    Get specific athlete performance
// @route   GET /api/coach/performance/:athleteId
// @access  Private/Coach
const getAthletePerformance = asyncHandler(async (req, res) => {
    const { athleteId } = req.params;

    // Verify the athlete exists and has role 'athlete'
    const athlete = await User.findById(athleteId);
    if (!athlete || athlete.role !== 'athlete') {
        res.status(404);
        throw new Error('Athlete not found');
    }

    // Reuse performance logic
    const performances = await Performance.find({ user: athleteId })
        .sort({ date: -1 })
        .limit(7);

    const sorted = performances.sort((a, b) => new Date(a.date) - new Date(b.date));

    const weeklyData = sorted.map((p) => {
        const dateObj = new Date(p.date);
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return {
            id: p._id,
            day: dayNames[dateObj.getDay()],
            score: p.aiScore,
            load: p.trainingLoad,
        };
    });

    res.status(200).json(weeklyData);
});

// @desc    Assign training plan to an athlete
// @route   POST /api/coach/assign-training
// @access  Private/Coach
const assignTraining = asyncHandler(async (req, res) => {
    const { athleteId, name, day, duration, intensity, calories, description, tags, exercises } = req.body;

    // Verify athlete
    const athlete = await User.findById(athleteId);
    if (!athlete || athlete.role !== 'athlete') {
        res.status(404);
        throw new Error('Athlete not found');
    }

    const workout = await Workout.create({
        user: athleteId,
        name,
        day: day || 'Today',
        duration,
        intensity,
        calories,
        description,
        tags: tags || [],
        exercises: exercises || [],
        status: 'Pending'
    });

    res.status(201).json(workout);
});

// @desc    Submit feedback for an athlete
// @route   POST /api/coach/feedback
// @access  Private/Coach
const submitFeedback = asyncHandler(async (req, res) => {
    const { athleteId, rating, comments } = req.body;

    const athlete = await User.findById(athleteId);
    if (!athlete || athlete.role !== 'athlete') {
        res.status(404);
        throw new Error('Athlete not found');
    }

    const feedback = await Feedback.create({
        coach: req.user._id,
        athlete: athleteId,
        rating,
        comments
    });

    res.status(201).json(feedback);
});

export { getAthletes, getAthletePerformance, assignTraining, submitFeedback };
