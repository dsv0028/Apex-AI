import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        default: 'Trophy',
    },
    category: {
        type: String,
        enum: ['Strength', 'Consistency', 'Endurance', 'Milestone', 'Social'],
        default: 'Milestone',
    },
    points: {
        type: Number,
        default: 50,
    },
}, {
    timestamps: true,
});

const userAchievementSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    achievementCode: {
        type: String,
        required: true,
    },
    unlockedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

export const Achievement = mongoose.model('Achievement', achievementSchema);
export const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);
