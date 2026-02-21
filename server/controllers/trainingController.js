import asyncHandler from 'express-async-handler';
import Workout from '../models/Workout.js';

// @desc    Generate a new training plan based on stats
// @route   POST /api/training/generate
// @access  Private
const generateTrainingPlan = asyncHandler(async (req, res) => {
    const { stamina, speed, strength } = req.body;

    // Very simple algorithmic logic to decide workout focus
    let focus = 'Balanced';
    if (stamina > speed && stamina > strength) focus = 'Endurance';
    if (strength > speed && strength > stamina) focus = 'Strength';
    if (speed > stamina && speed > strength) focus = 'Speed';

    // Clear old pending workouts for this user before generating new ones (optional, depending on business logic)
    await Workout.deleteMany({ user: req.user._id, status: 'Pending' });

    // Generate "Today's" Workout
    const todayWorkout = await Workout.create({
        user: req.user._id,
        name: `${focus} Focus Training`,
        day: 'Today',
        duration: focus === 'Endurance' ? 60 : 45,
        intensity: focus === 'Speed' ? 'High' : 'Medium',
        calories: focus === 'Endurance' ? 600 : 450,
        description: `AI optimized routine based on your latest stats. Focuses on ${focus.toLowerCase()} development.`,
        tags: [focus, 'Full Body', 'AI Generated'],
        exercises: [
            {
                name: 'Warm Up / Stretching',
                duration: 300,
                sets: 1,
                image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=60'
            },
            {
                name: focus === 'Speed' ? 'Sprints' : focus === 'Strength' ? 'Heavy Lifts' : 'Long Run',
                duration: 1800,
                sets: 3,
                image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&auto=format&fit=crop&q=60'
            },
            {
                name: 'Cool Down',
                duration: 300,
                sets: 1,
                image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop&q=60'
            }
        ],
        status: 'Pending'
    });

    // Generate Upcoming Workouts
    const upcoming1 = await Workout.create({
        user: req.user._id,
        name: 'Active Recovery & Mobility',
        day: 'Tomorrow',
        duration: 30,
        intensity: 'Low',
        calories: 200,
        tags: ['Recovery', 'Stretching'],
        exercises: [],
        status: 'Pending'
    });

    const upcoming2 = await Workout.create({
        user: req.user._id,
        name: 'Core Stability',
        day: 'Wednesday',
        duration: 40,
        intensity: 'Medium',
        calories: 300,
        tags: ['Core', 'Stability'],
        exercises: [],
        status: 'Pending'
    });

    res.status(201).json({
        todayWorkout,
        upcomingWorkouts: [upcoming1, upcoming2]
    });
});

// @desc    Get current training plan
// @route   GET /api/training/:userId
// @access  Private
const getTrainingPlan = asyncHandler(async (req, res) => {
    const workouts = await Workout.find({ user: req.params.userId, status: 'Pending' });

    const todayWorkout = workouts.find(w => w.day === 'Today');
    const upcomingWorkouts = workouts.filter(w => w.day !== 'Today');

    res.status(200).json({
        todayWorkout: todayWorkout || null,
        upcomingWorkouts
    });
});

// @desc    Update workout progress
// @route   PUT /api/training/progress
// @access  Private
const updateTrainingProgress = asyncHandler(async (req, res) => {
    const { workoutId, status } = req.body;

    const workout = await Workout.findById(workoutId);

    if (workout) {
        // Ensure the logged in user matches the workout user
        if (workout.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this workout');
        }

        workout.status = status || workout.status;
        
        const updatedWorkout = await workout.save();
        res.json(updatedWorkout);
    } else {
        res.status(404);
        throw new Error('Workout not found');
    }
});

export { generateTrainingPlan, getTrainingPlan, updateTrainingProgress };
