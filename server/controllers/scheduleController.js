import asyncHandler from 'express-async-handler';
import Schedule from '../models/Schedule.js';

// @desc    Get user training schedule (with optional month filtering)
// @route   GET /api/schedule
// @access  Private
export const getSchedule = asyncHandler(async (req, res) => {
    const { month } = req.query; // e.g., '2026-09'

    const filter = { user: req.user._id };
    if (month) {
        filter.date = { $regex: `^${month}` };
    }

    const events = await Schedule.find(filter)
        .sort({ date: 1, time: 1 })
        .lean();

    res.json(events);
});

// @desc    Add a training schedule event
// @route   POST /api/schedule
// @access  Private
export const createSchedule = asyncHandler(async (req, res) => {
    const { title, date, time, type, durationMinutes, targetLoad, notes, exercises } = req.body;

    if (!title || !date) {
        res.status(400);
        throw new Error('Title and date are required');
    }

    const schedule = await Schedule.create({
        user: req.user._id,
        title,
        date, // 'YYYY-MM-DD'
        time: time || '08:00 AM',
        type: type || 'Strength',
        durationMinutes: Number(durationMinutes) || 60,
        targetLoad: Number(targetLoad) || 400,
        notes: notes || '',
        exercises: exercises || [],
    });

    res.status(201).json(schedule);
});

// @desc    Update schedule status (completed / skipped / scheduled)
// @route   PATCH /api/schedule/:id/status
// @access  Private
export const updateScheduleStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const schedule = await Schedule.findOne({ _id: req.params.id, user: req.user._id });

    if (!schedule) {
        res.status(404);
        throw new Error('Schedule item not found');
    }

    if (status) schedule.status = status;
    await schedule.save();

    res.json(schedule);
});

// @desc    Delete schedule event
// @route   DELETE /api/schedule/:id
// @access  Private
export const deleteSchedule = asyncHandler(async (req, res) => {
    const schedule = await Schedule.findOne({ _id: req.params.id, user: req.user._id });

    if (!schedule) {
        res.status(404);
        throw new Error('Schedule item not found');
    }

    await schedule.deleteOne();
    res.json({ message: 'Scheduled event removed' });
});
