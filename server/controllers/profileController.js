import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Get current user profile
// @route   GET /api/profile/me
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.status(200).json(user);
});

// @desc    Update user profile
// @route   PUT /api/profile/me
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const { name, bio, sport, goals, profileImage, stats, notifications } = req.body;

    if (name !== undefined)          user.name          = name;
    if (bio  !== undefined)          user.bio           = bio;
    if (sport !== undefined)         user.sport         = sport;
    if (Array.isArray(goals))        user.goals         = goals;
    if (profileImage !== undefined)  user.profileImage  = profileImage;

    if (stats) {
        // Safe merge — avoid calling .toObject() on potentially-undefined subdoc
        const existing = user.stats ? {
            stamina:  user.stats.stamina  ?? 70,
            speed:    user.stats.speed    ?? 65,
            strength: user.stats.strength ?? 60,
        } : { stamina: 70, speed: 65, strength: 60 };
        user.stats = { ...existing, ...stats };
    }

    if (notifications) {
        const existing = user.notifications ? {
            workoutReminders:  user.notifications.workoutReminders  ?? true,
            performanceAlerts: user.notifications.performanceAlerts ?? true,
            coachMessages:     user.notifications.coachMessages     ?? true,
            weeklyReport:      user.notifications.weeklyReport      ?? false,
        } : { workoutReminders: true, performanceAlerts: true, coachMessages: true, weeklyReport: false };
        user.notifications = { ...existing, ...notifications };
    }

    const updated = await user.save();

    res.status(200).json({
        _id:           updated._id,
        name:          updated.name,
        email:         updated.email,
        role:          updated.role,
        bio:           updated.bio,
        sport:         updated.sport,
        goals:         updated.goals,
        profileImage:  updated.profileImage,
        stats:         updated.stats,
        notifications: updated.notifications,
    });
});

// @desc    Change password
// @route   PUT /api/profile/password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user || !(await user.matchPassword(currentPassword))) {
        res.status(401);
        throw new Error('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    // Mark password as modified so pre-save hook is skipped (we already hashed)
    user.markModified('password');
    // Actually, since we hash manually above, skip the hook by using update directly
    await User.findByIdAndUpdate(user._id, { password: user.password });

    res.status(200).json({ message: 'Password updated successfully' });
});

export { getProfile, updateProfile, changePassword };
