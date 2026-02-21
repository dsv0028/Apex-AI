import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    athlete: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comments: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
