import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['Workout', 'PR Milestone', 'Nutrition', 'General', 'Announcement'],
        default: 'General',
    },
    workoutStats: {
        workoutName: String,
        volumeKg: Number,
        durationMinutes: Number,
        prMetric: String,
    },
    reactions: {
        fire: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        clap: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        lightning: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        trophy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    comments: [commentSchema],
    pinned: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const Post = mongoose.model('Post', postSchema);
export default Post;
