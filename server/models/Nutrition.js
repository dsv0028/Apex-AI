import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mealType: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-Workout', 'Post-Workout'],
        default: 'Breakfast',
    },
    calories: { type: Number, default: 0 },
    proteinG: { type: Number, default: 0 },
    carbsG: { type: Number, default: 0 },
    fatsG: { type: Number, default: 0 },
    time: { type: String, default: '12:00 PM' },
}, { _id: true });

const nutritionSchema = new mongoose.Schema({
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
    targetCalories: {
        type: Number,
        default: 2600,
    },
    targetProteinG: {
        type: Number,
        default: 160,
    },
    targetCarbsG: {
        type: Number,
        default: 280,
    },
    targetFatsG: {
        type: Number,
        default: 70,
    },
    targetWaterMl: {
        type: Number,
        default: 3500,
    },
    waterConsumedMl: {
        type: Number,
        default: 0,
    },
    meals: [mealSchema],
}, {
    timestamps: true,
});

const Nutrition = mongoose.model('Nutrition', nutritionSchema);
export default Nutrition;
