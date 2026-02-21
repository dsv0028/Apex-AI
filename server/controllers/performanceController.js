import asyncHandler from 'express-async-handler';
import Performance from '../models/Performance.js';
import Workout from '../models/Workout.js';

// @desc    Add a daily performance log
// @route   POST /api/performance
// @access  Private
const addPerformance = asyncHandler(async (req, res) => {
    const { date, aiScore, trainingLoad, injuryRisk } = req.body;

    if (!aiScore || !trainingLoad) {
        res.status(400);
        throw new Error('Please include aiScore and trainingLoad');
    }

    const performance = await Performance.create({
        user: req.user._id,
        date: date || Date.now(),
        aiScore,
        trainingLoad,
        injuryRisk: injuryRisk || 'Low',
    });

    res.status(201).json(performance);
});

// @desc    Get weekly performance data for dashboard chart
// @route   GET /api/performance/:userId
// @access  Private
const getPerformance = asyncHandler(async (req, res) => {
    // Basic implementation: fetch last 7 entries
    const performances = await Performance.find({ user: req.params.userId })
        .sort({ date: -1 })
        .limit(7);

    // Frontend expects: { day: 'Mon', score: 65, load: 400 }
    // Sort chronologically for the chart
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

// @desc    Get the latest summary context for Dashboard widgets
// @route   GET /api/performance/summary/:userId
// @access  Private
const getPerformanceSummary = asyncHandler(async (req, res) => {
    const latest = await Performance.findOne({ user: req.params.userId })
        .sort({ date: -1 });

    if (latest) {
        res.status(200).json({
            aiScore: latest.aiScore,
            trainingLoad: latest.trainingLoad,
            injuryRisk: latest.injuryRisk,
            lastUpdated: latest.date,
        });
    } else {
        res.status(404);
        throw new Error('No performance data found for this user');
    }
});

// @desc    Monthly comparison stats (current vs previous month)
// @route   GET /api/performance/monthly/:userId
// @access  Private
const getMonthlyComparison = asyncHandler(async (req, res) => {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [thisMonth, lastMonth] = await Promise.all([
        Performance.find({ user: req.params.userId, date: { $gte: startOfThisMonth } }),
        Performance.find({ user: req.params.userId, date: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
    ]);

    const avg = (arr, key) =>
        arr.length ? Math.round(arr.reduce((s, p) => s + p[key], 0) / arr.length) : 0;

    const pctChange = (cur, prev) => {
        if (!prev) return 0;
        return Math.round(((cur - prev) / prev) * 100);
    };

    const thisAvgScore = avg(thisMonth, 'aiScore');
    const prevAvgScore = avg(lastMonth, 'aiScore');
    const thisAvgLoad  = avg(thisMonth, 'trainingLoad');
    const prevAvgLoad  = avg(lastMonth, 'trainingLoad');

    // Injury risk mapping for average
    const riskMap = { Low: 1, Medium: 2, High: 3 };
    const riskRevMap = { 1: 'Low', 2: 'Medium', 3: 'High' };
    const avgRisk = (arr) => {
        if (!arr.length) return 'Low';
        const avg = arr.reduce((s, p) => s + (riskMap[p.injuryRisk] || 1), 0) / arr.length;
        return riskRevMap[Math.round(avg)] || 'Low';
    };

    res.status(200).json({
        thisMonth: {
            sessions: thisMonth.length,
            avgScore: thisAvgScore,
            avgLoad: thisAvgLoad,
            injuryRisk: avgRisk(thisMonth),
        },
        lastMonth: {
            sessions: lastMonth.length,
            avgScore: prevAvgScore,
            avgLoad: prevAvgLoad,
            injuryRisk: avgRisk(lastMonth),
        },
        changes: {
            sessions: pctChange(thisMonth.length, lastMonth.length),
            avgScore: pctChange(thisAvgScore, prevAvgScore),
            avgLoad: pctChange(thisAvgLoad, prevAvgLoad),
        },
    });
});

// @desc    Skill radar data derived from workouts + performance
// @route   GET /api/performance/radar/:userId
// @access  Private
const getSkillRadar = asyncHandler(async (req, res) => {
    const [workouts, performances] = await Promise.all([
        Workout.find({ user: req.params.userId }).sort({ date: -1 }).limit(30),
        Performance.find({ user: req.params.userId }).sort({ date: -1 }).limit(30),
    ]);

    // Derive skill scores from workout tags and intensity
    let endurance = 0, strength = 0, speed = 0, enduranceCount = 0, strengthCount = 0, speedCount = 0;

    workouts.forEach(w => {
        const tags = w.tags.map(t => t.toLowerCase());
        if (tags.some(t => t.includes('endurance') || t.includes('cardio') || t.includes('full body'))) {
            endurance += w.intensity === 'High' ? 85 : w.intensity === 'Medium' ? 70 : 55;
            enduranceCount++;
        }
        if (tags.some(t => t.includes('strength') || t.includes('power') || t.includes('elite'))) {
            strength += w.intensity === 'High' ? 85 : w.intensity === 'Medium' ? 70 : 55;
            strengthCount++;
        }
        if (tags.some(t => t.includes('speed') || t.includes('agility') || t.includes('sprint'))) {
            speed += w.intensity === 'High' ? 85 : w.intensity === 'Medium' ? 70 : 55;
            speedCount++;
        }
    });

    const avgPerf = performances.length
        ? Math.round(performances.reduce((s, p) => s + p.aiScore, 0) / performances.length)
        : 60;

    const avgLoad = performances.length
        ? Math.round(performances.reduce((s, p) => s + p.trainingLoad, 0) / performances.length)
        : 400;

    res.status(200).json([
        { skill: 'Endurance', value: enduranceCount ? Math.min(100, Math.round(endurance / enduranceCount)) : Math.round(avgPerf * 0.9) },
        { skill: 'Strength',  value: strengthCount  ? Math.min(100, Math.round(strength / strengthCount))   : Math.round(avgPerf * 0.75) },
        { skill: 'Speed',     value: speedCount     ? Math.min(100, Math.round(speed / speedCount))         : Math.round(avgPerf * 0.8) },
        { skill: 'Recovery',  value: Math.min(100, Math.round((100 - (avgLoad / 15))) ) },
        { skill: 'Consistency', value: Math.min(100, performances.length * 5 + 40) },
        { skill: 'Mental Focus', value: Math.min(100, Math.round(avgPerf * 0.95)) },
    ]);
});

export { addPerformance, getPerformance, getPerformanceSummary, getMonthlyComparison, getSkillRadar };
