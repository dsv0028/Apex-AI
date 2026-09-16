import mongoose from 'mongoose';

const teamAssignmentSchema = new mongoose.Schema({
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    targetAthletes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    workoutRoutine: {
        name: String,
        category: String,
        targetDuration: Number,
        exercises: [{
            name: String,
            sets: Number,
            reps: String,
            notes: String,
        }],
    },
    scheduledDate: {
        type: String, // YYYY-MM-DD
        required: true,
    },
    coachInstructions: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

const TeamAssignment = mongoose.model('TeamAssignment', teamAssignmentSchema);
export default TeamAssignment;
