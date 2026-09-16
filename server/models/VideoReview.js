import mongoose from 'mongoose';

const annotationSchema = new mongoose.Schema({
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    timestampSeconds: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    severity: {
        type: String,
        enum: ['info', 'warning', 'correction', 'praise'],
        default: 'correction',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const videoReviewSchema = new mongoose.Schema({
    athlete: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
    },
    exercise: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['Pending Review', 'Reviewed', 'In Progress'],
        default: 'Pending Review',
    },
    annotations: [annotationSchema],
}, {
    timestamps: true,
});

const VideoReview = mongoose.model('VideoReview', videoReviewSchema);
export default VideoReview;
