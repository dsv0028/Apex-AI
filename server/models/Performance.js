import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    aiScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    trainingLoad: {
        type: Number,
        required: true,
    },
    injuryRisk: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low',
    },
}, {
    timestamps: true,
});

const Performance = mongoose.model('Performance', performanceSchema);

export default Performance;
