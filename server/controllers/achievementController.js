import asyncHandler from 'express-async-handler';
import { Achievement, UserAchievement } from '../models/Achievement.js';
import WorkoutLog from '../models/WorkoutLog.js';
import Nutrition from '../models/Nutrition.js';

const INITIAL_ACHIEVEMENTS = [
    {
        code: 'FIRST_WORKOUT',
        title: 'First Step',
        description: 'Completed and logged your very first training session in ApexAI.',
        icon: 'Dumbbell',
        category: 'Milestone',
        points: 50,
    },
    {
        code: 'STREAK_7',
        title: '7-Day Iron Will',
        description: 'Maintained an active training streak across 7 workout logs.',
        icon: 'Flame',
        category: 'Consistency',
        points: 150,
    },
    {
        code: 'CENTURY_100',
        title: 'Century Club 100kg',
        description: 'Achieved an estimated 1-Rep Max of 100 kg or higher on a major lift.',
        icon: 'Trophy',
        category: 'Strength',
        points: 200,
    },
    {
        code: 'VOLUME_10K',
        title: '10 Tonne Club',
        description: 'Accumulated over 10,000 kg of total training volume lifted.',
        icon: 'TrendingUp',
        category: 'Strength',
        points: 175,
    },
    {
        code: 'HYDRATION_MASTER',
        title: 'Hydration Champion',
        description: 'Hit your full daily water hydration target (3,500 ml).',
        icon: 'Sparkles',
        category: 'Milestone',
        points: 75,
    },
    {
        code: 'TEAM_COMMUNICATOR',
        title: 'Team Player',
        description: 'Active participant in coach messaging and community channels.',
        icon: 'MessageSquare',
        category: 'Social',
        points: 50,
    },
];

// @desc    Get all achievements with user unlock status
// @route   GET /api/achievements
// @access  Private
export const getAchievements = asyncHandler(async (req, res) => {
    // Seed definitions if empty
    const count = await Achievement.countDocuments();
    if (count === 0) {
        await Achievement.insertMany(INITIAL_ACHIEVEMENTS);
    }

    const allAchievements = await Achievement.find().lean();
    const userUnlocks = await UserAchievement.find({ user: req.user._id }).lean();

    const unlockedCodes = new Set(userUnlocks.map((u) => u.achievementCode));

    // Evaluate auto-unlocks based on athlete logs
    const logs = await WorkoutLog.find({ user: req.user._id }).lean();
    const totalVolume = logs.reduce((sum, l) => sum + (l.totalVolumeKg || 0), 0);

    const newlyUnlocked = [];

    // Check FIRST_WORKOUT
    if (logs.length >= 1 && !unlockedCodes.has('FIRST_WORKOUT')) {
        await UserAchievement.create({ user: req.user._id, achievementCode: 'FIRST_WORKOUT' });
        unlockedCodes.add('FIRST_WORKOUT');
        newlyUnlocked.push('FIRST_WORKOUT');
    }

    // Check VOLUME_10K
    if (totalVolume >= 10000 && !unlockedCodes.has('VOLUME_10K')) {
        await UserAchievement.create({ user: req.user._id, achievementCode: 'VOLUME_10K' });
        unlockedCodes.add('VOLUME_10K');
        newlyUnlocked.push('VOLUME_10K');
    }

    // Check CENTURY_100
    let has100kg = false;
    logs.forEach((l) => {
        (l.exercises || []).forEach((e) => {
            (e.sets || []).forEach((s) => {
                if (s.weightKg >= 100) has100kg = true;
            });
        });
    });
    if (has100kg && !unlockedCodes.has('CENTURY_100')) {
        await UserAchievement.create({ user: req.user._id, achievementCode: 'CENTURY_100' });
        unlockedCodes.add('CENTURY_100');
        newlyUnlocked.push('CENTURY_100');
    }

    // Check STREAK_7
    if (logs.length >= 7 && !unlockedCodes.has('STREAK_7')) {
        await UserAchievement.create({ user: req.user._id, achievementCode: 'STREAK_7' });
        unlockedCodes.add('STREAK_7');
        newlyUnlocked.push('STREAK_7');
    }

    const result = allAchievements.map((ach) => ({
        ...ach,
        unlocked: unlockedCodes.has(ach.code),
    }));

    const totalPoints = result
        .filter((r) => r.unlocked)
        .reduce((sum, r) => sum + (r.points || 0), 0);

    res.json({
        achievements: result,
        stats: {
            unlockedCount: unlockedCodes.size,
            totalCount: allAchievements.length,
            totalPoints,
            streakDays: Math.min(logs.length, 7),
        },
        newlyUnlocked,
    });
});
