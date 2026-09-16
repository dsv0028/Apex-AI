import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import WorkoutLog from '../models/WorkoutLog.js';
import RecoveryLog from '../models/RecoveryLog.js';
import Schedule from '../models/Schedule.js';
import TeamAssignment from '../models/TeamAssignment.js';

// @desc    Get team roster with readiness and weekly load summary
// @route   GET /api/roster
// @access  Private
export const getRosterOverview = asyncHandler(async (req, res) => {
    const athletes = await User.find({ role: 'athlete' })
        .select('name email profileImage sport stats goals')
        .lean();

    const todayStr = new Date().toISOString().split('T')[0];

    const rosterData = await Promise.all(
        athletes.map(async (athlete) => {
            // Get today's recovery or fallback to stats
            const recovery = await RecoveryLog.findOne({ user: athlete._id, date: todayStr }).lean();
            const logs = await WorkoutLog.find({ user: athlete._id }).sort({ date: -1 }).limit(5).lean();

            const totalVolume = logs.reduce((sum, l) => sum + (l.totalVolumeKg || 0), 0);
            const latestSession = logs[0] || null;

            // Compute injury risk
            const stamina = athlete.stats?.stamina || 70;
            const readiness = recovery ? recovery.calculatedReadiness : Math.round(stamina * 0.9 + 15);
            const injuryRisk = readiness < 60 ? 'High' : readiness < 75 ? 'Medium' : 'Low';

            return {
                ...athlete,
                readinessScore: readiness,
                injuryRisk,
                recentVolumeKg: totalVolume,
                sessionCount: logs.length,
                latestSession: latestSession ? {
                    name: latestSession.workoutName,
                    date: latestSession.date,
                    volumeKg: latestSession.totalVolumeKg,
                } : null,
            };
        })
    );

    const pastAssignments = await TeamAssignment.find({ coach: req.user._id })
        .populate('targetAthletes', 'name email profileImage')
        .sort({ createdAt: -1 })
        .lean();

    res.json({
        athletes: rosterData,
        assignments: pastAssignments,
    });
});

// @desc    Bulk assign a workout routine to selected athletes
// @route   POST /api/roster/bulk-assign
// @access  Private
export const bulkAssignWorkout = asyncHandler(async (req, res) => {
    const { title, athleteIds, workoutRoutine, scheduledDate, coachInstructions } = req.body;

    if (!title || !athleteIds || !Array.isArray(athleteIds) || athleteIds.length === 0 || !scheduledDate) {
        res.status(400);
        throw new Error('Title, scheduled date, and at least one target athlete are required');
    }

    const assignment = await TeamAssignment.create({
        coach: req.user._id,
        title,
        targetAthletes: athleteIds,
        workoutRoutine: workoutRoutine || { name: title, category: 'Strength', targetDuration: 60, exercises: [] },
        scheduledDate,
        coachInstructions: coachInstructions || '',
    });

    // Automatically insert into each athlete's Schedule calendar
    const scheduleDocs = athleteIds.map((athId) => ({
        user: athId,
        title,
        date: scheduledDate,
        time: '08:00 AM',
        type: workoutRoutine?.category || 'Strength',
        durationMinutes: workoutRoutine?.targetDuration || 60,
        targetLoad: 500,
        notes: coachInstructions || `Assigned by Coach ${req.user.name}`,
        exercises: (workoutRoutine?.exercises || []).map((e) => ({
            name: e.name,
            sets: e.sets || 3,
            reps: e.reps || '8-10',
        })),
        assignedBy: req.user._id,
    }));

    await Schedule.insertMany(scheduleDocs);

    const populated = await TeamAssignment.findById(assignment._id)
        .populate('targetAthletes', 'name email profileImage')
        .lean();

    res.status(201).json(populated);
});
