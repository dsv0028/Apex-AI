import mongoose from 'mongoose';

const setSchema = new mongoose.Schema({
    setNumber: { type: Number, required: true },
    weightKg: { type: Number, default: 0 },
    reps: { type: Number, default: 0 },
    rpe: { type: Number, min: 1, max: 10, default: 7 },
    completed: { type: Boolean, default: true },
}, { _id: false });

const exerciseLogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    muscleGroup: { type: String, default: 'General' },
    sets: [setSchema],
}, { _id: false });

const workoutLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    workoutName: {
        type: String,
        required: true,
        default: 'Training Session',
    },
    category: {
        type: String,
        enum: ['Strength', 'Hypertrophy', 'Endurance', 'Speed', 'HIIT', 'Recovery', 'Custom'],
        default: 'Strength',
    },
    date: {
        type: Date,
        default: Date.now,
        index: true,
    },
    durationMinutes: {
        type: Number,
        default: 45,
    },
    exercises: [exerciseLogSchema],
    totalVolumeKg: {
        type: Number,
        default: 0,
    },
    personalRecords: [{
        exercise: String,
        metric: String, // e.g., '120 kg x 5 reps (Est. 1RM: 135 kg)'
    }],
    notes: {
        type: String,
        default: '',
    },
    feeling: {
        type: String,
        enum: ['Great', 'Good', 'Moderate', 'Tired', 'Exhausted'],
        default: 'Good',
    },
}, {
    timestamps: true,
});

const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);
export default WorkoutLog;
