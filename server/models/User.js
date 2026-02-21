import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
    role: {
        type: String,
        enum: ['athlete', 'coach'],
        default: 'athlete',
    },
    bio: { type: String, default: '' },
    sport: { type: String, default: '' },
    goals: [{ type: String }],
    profileImage: { type: String, default: '' }, // base64 or URL
    stats: {
        stamina:  { type: Number, default: 70, min: 0, max: 100 },
        speed:    { type: Number, default: 65, min: 0, max: 100 },
        strength: { type: Number, default: 60, min: 0, max: 100 },
    },
    notifications: {
        workoutReminders:    { type: Boolean, default: true },
        performanceAlerts:   { type: Boolean, default: true },
        coachMessages:       { type: Boolean, default: true },
        weeklyReport:        { type: Boolean, default: false },
    },
}, {
    timestamps: true,
});


// Setup pre-save hook for password hashing
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
