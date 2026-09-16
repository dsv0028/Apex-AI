import asyncHandler from 'express-async-handler';
import RecoveryLog from '../models/RecoveryLog.js';

// Helper: Calculate AI readiness score from recovery check-in
const calculateReadinessScore = (sleepHours, sleepQuality, stressLevel, energyLevel, soreness = []) => {
    let score = 80;

    // Sleep hours impact
    if (sleepHours >= 8) score += 8;
    else if (sleepHours >= 7) score += 4;
    else if (sleepHours < 6) score -= 15;
    else if (sleepHours < 7) score -= 8;

    // Quality, stress, energy (1-5 scales)
    score += (sleepQuality - 3) * 4;
    score += (3 - stressLevel) * 4;
    score += (energyLevel - 3) * 4;

    // Soreness penalty (sum of levels 1-5 across body parts)
    const totalSoreness = soreness.reduce((sum, s) => sum + (s.level || 0), 0);
    score -= Math.round(totalSoreness * 2.2);

    return Math.max(25, Math.min(99, Math.round(score)));
};

// @desc    Get recovery logs (or today's check-in)
// @route   GET /api/recovery?date=YYYY-MM-DD
// @access  Private
export const getRecovery = asyncHandler(async (req, res) => {
    const targetDate = req.query.date || new Date().toISOString().split('T')[0];

    const todayLog = await RecoveryLog.findOne({ user: req.user._id, date: targetDate }).lean();
    const history = await RecoveryLog.find({ user: req.user._id })
        .sort({ date: -1 })
        .limit(14)
        .lean();

    res.json({
        today: todayLog || null,
        history,
    });
});

// @desc    Submit daily recovery check-in
// @route   POST /api/recovery
// @access  Private
export const logRecovery = asyncHandler(async (req, res) => {
    const { date, sleepHours, sleepQuality, stressLevel, energyLevel, soreness, notes } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const readiness = calculateReadinessScore(
        Number(sleepHours) || 7.5,
        Number(sleepQuality) || 3,
        Number(stressLevel) || 2,
        Number(energyLevel) || 3,
        soreness || []
    );

    let log = await RecoveryLog.findOne({ user: req.user._id, date: targetDate });

    if (log) {
        log.sleepHours = Number(sleepHours) || log.sleepHours;
        log.sleepQuality = Number(sleepQuality) || log.sleepQuality;
        log.stressLevel = Number(stressLevel) || log.stressLevel;
        log.energyLevel = Number(energyLevel) || log.energyLevel;
        log.soreness = soreness || log.soreness;
        log.calculatedReadiness = readiness;
        log.notes = notes !== undefined ? notes : log.notes;
        await log.save();
    } else {
        log = await RecoveryLog.create({
            user: req.user._id,
            date: targetDate,
            sleepHours: Number(sleepHours) || 7.5,
            sleepQuality: Number(sleepQuality) || 4,
            stressLevel: Number(stressLevel) || 2,
            energyLevel: Number(energyLevel) || 4,
            soreness: soreness || [],
            calculatedReadiness: readiness,
            notes: notes || '',
        });
    }

    res.status(201).json(log);
});
