import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
    },
    date: {
        type: String, // Stored as YYYY-MM-DD for reliable day matching
        required: true,
        index: true,
    },
    time: {
        type: String,
        default: '08:00 AM',
    },
    type: {
        type: String,
        enum: ['Strength', 'Cardio', 'HIIT', 'Mobility', 'Speed', 'Rest', 'Competition'],
        default: 'Strength',
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'skipped'],
        default: 'scheduled',
    },
    durationMinutes: {
        type: Number,
        default: 60,
    },
    targetLoad: {
        type: Number,
        default: 400,
    },
    notes: {
        type: String,
        default: '',
    },
    exercises: [{
        name: String,
        sets: Number,
        reps: String,
    }],
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
export default Schedule;
