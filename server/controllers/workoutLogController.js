import asyncHandler from 'express-async-handler';
import WorkoutLog from '../models/WorkoutLog.js';

// Helper: Estimate 1-Rep Max using Epley formula
const estimate1RM = (weight, reps) => {
    if (reps <= 1) return weight;
    return Math.round(weight * (1 + reps / 30));
};

// @desc    Log a completed workout session
// @route   POST /api/logs
// @access  Private
export const createWorkoutLog = asyncHandler(async (req, res) => {
    const { workoutName, category, date, durationMinutes, exercises, notes, feeling } = req.body;

    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
        res.status(400);
        throw new Error('At least one exercise is required to log a workout');
    }

    // Calculate total volume
    let totalVolumeKg = 0;
    const personalRecords = [];

    // Find previous logs to detect new PRs
    const pastLogs = await WorkoutLog.find({ user: req.user._id }).lean();

    // Map of highest recorded 1RM for each exercise
    const previousBest1RM = {};
    pastLogs.forEach((log) => {
        (log.exercises || []).forEach((ex) => {
            (ex.sets || []).forEach((s) => {
                if (s.weightKg > 0 && s.reps > 0) {
                    const estimated = estimate1RM(s.weightKg, s.reps);
                    if (!previousBest1RM[ex.name] || estimated > previousBest1RM[ex.name]) {
                        previousBest1RM[ex.name] = estimated;
                    }
                }
            });
        });
    });

    // Process new exercises
    exercises.forEach((ex) => {
        let exerciseMax1RM = 0;
        let bestSet = null;

        (ex.sets || []).forEach((s) => {
            const w = Number(s.weightKg) || 0;
            const r = Number(s.reps) || 0;
            totalVolumeKg += w * r;

            if (w > 0 && r > 0) {
                const est1RM = estimate1RM(w, r);
                if (est1RM > exerciseMax1RM) {
                    exerciseMax1RM = est1RM;
                    bestSet = { weight: w, reps: r, est1RM };
                }
            }
        });

        if (bestSet) {
            const prevBest = previousBest1RM[ex.name] || 0;
            if (exerciseMax1RM > prevBest && prevBest > 0) {
                personalRecords.push({
                    exercise: ex.name,
                    metric: `New PR! ${bestSet.weight} kg × ${bestSet.reps} reps (Est. 1RM: ${bestSet.est1RM} kg — +${bestSet.est1RM - prevBest} kg increase)`,
                });
            } else if (prevBest === 0 && exerciseMax1RM > 0) {
                personalRecords.push({
                    exercise: ex.name,
                    metric: `First Benchmark: ${bestSet.weight} kg × ${bestSet.reps} reps (Est. 1RM: ${bestSet.est1RM} kg)`,
                });
            }
        }
    });

    const workoutLog = await WorkoutLog.create({
        user: req.user._id,
        workoutName: workoutName || 'Custom Training Session',
        category: category || 'Strength',
        date: date ? new Date(date) : new Date(),
        durationMinutes: Number(durationMinutes) || 45,
        exercises,
        totalVolumeKg: Math.round(totalVolumeKg),
        personalRecords,
        notes: notes || '',
        feeling: feeling || 'Good',
    });

    res.status(201).json(workoutLog);
});

// @desc    Get all workout logs for authenticated user
// @route   GET /api/logs
// @access  Private
export const getWorkoutLogs = asyncHandler(async (req, res) => {
    const logs = await WorkoutLog.find({ user: req.user._id })
        .sort({ date: -1 })
        .lean();

    // Summary statistics
    const totalWorkouts = logs.length;
    const totalVolume = logs.reduce((sum, log) => sum + (log.totalVolumeKg || 0), 0);
    const totalMinutes = logs.reduce((sum, log) => sum + (log.durationMinutes || 0), 0);

    // Calculate all-time PRs
    const prs = {};
    logs.forEach((log) => {
        (log.exercises || []).forEach((ex) => {
            (ex.sets || []).forEach((s) => {
                if (s.weightKg > 0 && s.reps > 0) {
                    const est = estimate1RM(s.weightKg, s.reps);
                    if (!prs[ex.name] || est > prs[ex.name].est1RM) {
                        prs[ex.name] = {
                            exercise: ex.name,
                            weightKg: s.weightKg,
                            reps: s.reps,
                            est1RM: est,
                            date: log.date,
                        };
                    }
                }
            });
        });
    });

    res.json({
        logs,
        summary: {
            totalWorkouts,
            totalVolumeKg: totalVolume,
            totalMinutes,
            allTimePRs: Object.values(prs),
        },
    });
});

// @desc    Delete a workout log
// @route   DELETE /api/logs/:id
// @access  Private
export const deleteWorkoutLog = asyncHandler(async (req, res) => {
    const log = await WorkoutLog.findOne({ _id: req.params.id, user: req.user._id });
    if (!log) {
        res.status(404);
        throw new Error('Workout log not found');
    }
    await log.deleteOne();
    res.json({ message: 'Workout log deleted successfully' });
});
