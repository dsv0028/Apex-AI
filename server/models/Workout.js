import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    duration: { type: Number, required: true }, // in seconds
    sets: { type: Number, default: 1 },
    currentSet: { type: Number, default: 1 },
    image: { type: String },
});

const workoutSchema = new mongoose.Schema({
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
    name: { type: String, required: true },
    day: { type: String, default: 'Today' },
    duration: { type: Number, required: true }, // in minutes
    intensity: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true,
    },
    calories: { type: Number, required: true },
    description: { type: String },
    tags: [{ type: String }],
    exercises: [exerciseSchema],
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending',
    }
}, {
    timestamps: true,
});

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;
