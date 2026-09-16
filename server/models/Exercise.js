import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    muscleGroup: {
        type: String,
        enum: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'],
        required: true,
        index: true,
    },
    secondaryMuscles: [{
        type: String,
    }],
    equipment: {
        type: String,
        enum: ['Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Kettlebell', 'Band', 'Cardio'],
        default: 'Bodyweight',
        index: true,
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Intermediate',
    },
    category: {
        type: String,
        enum: ['Compound', 'Isolation', 'Olympic', 'Plyometric', 'Cardio', 'Mobility'],
        default: 'Compound',
    },
    instructions: [{
        type: String,
    }],
    tips: [{
        type: String,
    }],
    isCustom: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
export default Exercise;
