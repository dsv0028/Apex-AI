import mongoose from 'mongoose';

const sorenessItemSchema = new mongoose.Schema({
    bodyPart: {
        type: String,
        required: true,
    },
    level: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
}, { _id: false });

const recoveryLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true,
        index: true,
    },
    sleepHours: {
        type: Number,
        default: 7.5,
    },
    sleepQuality: {
        type: Number,
        min: 1,
        max: 5,
        default: 4,
    },
    stressLevel: {
        type: Number,
        min: 1,
        max: 5,
        default: 2,
    },
    energyLevel: {
        type: Number,
        min: 1,
        max: 5,
        default: 4,
    },
    soreness: [sorenessItemSchema],
    calculatedReadiness: {
        type: Number,
        min: 0,
        max: 100,
        default: 85,
    },
    notes: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

const RecoveryLog = mongoose.model('RecoveryLog', recoveryLogSchema);
export default RecoveryLog;
