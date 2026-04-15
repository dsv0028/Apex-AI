import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Performance from '../models/Performance.js';
import Workout from '../models/Workout.js';

// @desc    Get leaderboard — ranked athletes
// @route   GET /api/leaderboard
// @access  Private
const getLeaderboard = asyncHandler(async (req, res) => {
    // Get all athletes
    const athletes = await User.find({ role: 'athlete' }).select('-password');

    // For each athlete, compute their ranking stats
    const leaderboardData = await Promise.all(
        athletes.map(async (athlete) => {
            // Get last 30 days of performance
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const performances = await Performance.find({
                user: athlete._id,
                date: { $gte: thirtyDaysAgo },
            }).sort({ date: -1 });

            // Get completed workouts count
            const completedWorkouts = await Workout.countDocuments({
                user: athlete._id,
                status: 'Completed',
            });

            // Calculate stats
            const totalSessions = performances.length;
            const avgScore = totalSessions
                ? Math.round(performances.reduce((s, p) => s + p.aiScore, 0) / totalSessions)
                : 0;
            const bestScore = totalSessions
                ? Math.max(...performances.map((p) => p.aiScore))
                : 0;
            const totalCalories = totalSessions
                ? performances.reduce((s, p) => s + p.trainingLoad, 0)
                : 0;

            // Streak: count consecutive days with performance entries (from most recent)
            let streak = 0;
            if (performances.length > 0) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                let checkDate = new Date(today);

                for (let i = 0; i < 30; i++) {
                    const found = performances.some((p) => {
                        const pDate = new Date(p.date);
                        pDate.setHours(0, 0, 0, 0);
                        return pDate.getTime() === checkDate.getTime();
                    });
                    if (found) {
                        streak++;
                        checkDate.setDate(checkDate.getDate() - 1);
                    } else {
                        break;
                    }
                }
            }

            // Composite score for ranking (weighted formula)
            const compositeScore = Math.round(
                avgScore * 0.4 +
                bestScore * 0.2 +
                Math.min(totalSessions * 3, 30) +
                Math.min(streak * 2, 20) +
                Math.min(completedWorkouts * 1.5, 15)
            );

            return {
                _id: athlete._id,
                name: athlete.name,
                email: athlete.email,
                sport: athlete.sport || 'General',
                profileImage: athlete.profileImage || '',
                stats: athlete.stats,
                avgScore,
                bestScore,
                totalSessions,
                totalCalories,
                completedWorkouts,
                streak,
                compositeScore,
            };
        })
    );

    // Sort by composite score descending
    leaderboardData.sort((a, b) => b.compositeScore - a.compositeScore);

    // Add rank
    const ranked = leaderboardData.map((entry, index) => ({
        ...entry,
        rank: index + 1,
    }));

    res.status(200).json(ranked);
});

export { getLeaderboard };
