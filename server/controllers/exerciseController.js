import asyncHandler from 'express-async-handler';
import Exercise from '../models/Exercise.js';

const DEFAULT_EXERCISES = [
    {
        name: 'Barbell Back Squat',
        muscleGroup: 'Legs',
        secondaryMuscles: ['Core', 'Lower Back', 'Glutes'],
        equipment: 'Barbell',
        difficulty: 'Intermediate',
        category: 'Compound',
        instructions: [
            'Set bar across upper traps and unrack with a solid stance.',
            'Descend by bending at hips and knees simultaneously until thighs are parallel or lower.',
            'Drive up explosively through mid-foot while keeping chest proud.',
        ],
        tips: ['Keep knees tracking over toes', 'Brace core before descending'],
        isCustom: false,
    },
    {
        name: 'Barbell Bench Press',
        muscleGroup: 'Chest',
        secondaryMuscles: ['Triceps', 'Front Delts'],
        equipment: 'Barbell',
        difficulty: 'Intermediate',
        category: 'Compound',
        instructions: [
            'Lie flat on bench with eyes directly under the racked bar.',
            'Grip slightly wider than shoulder width and unrack with elbows locked.',
            'Lower the bar controlled to mid-chest, then press forcefully back up.',
        ],
        tips: ['Keep feet planted firmly on ground', 'Maintain slight arch in lower back'],
        isCustom: false,
    },
    {
        name: 'Conventional Deadlift',
        muscleGroup: 'Back',
        secondaryMuscles: ['Hamstrings', 'Glutes', 'Forearms', 'Core'],
        equipment: 'Barbell',
        difficulty: 'Advanced',
        category: 'Compound',
        instructions: [
            'Stand with mid-foot under barbell with hip-width stance.',
            'Hinge at hips to grip the bar just outside knees.',
            'Pull slack out of bar, flatten back, and drive floor away.',
        ],
        tips: ['Do not round lower back', 'Keep bar dragging close to shins'],
        isCustom: false,
    },
    {
        name: 'Overhead Shoulder Press',
        muscleGroup: 'Shoulders',
        secondaryMuscles: ['Triceps', 'Upper Chest', 'Core'],
        equipment: 'Barbell',
        difficulty: 'Intermediate',
        category: 'Compound',
        instructions: [
            'Hold bar at collarbone height with elbows forward.',
            'Press the bar vertically upwards, moving head back slightly to clear path.',
            'Lockout overhead with arms aligned with spine.',
        ],
        tips: ['Squeeze glutes and brace core for stability', 'Avoid excessive backward lean'],
        isCustom: false,
    },
    {
        name: 'Pull-Ups / Chin-Ups',
        muscleGroup: 'Back',
        secondaryMuscles: ['Biceps', 'Forearms', 'Rear Delts'],
        equipment: 'Bodyweight',
        difficulty: 'Intermediate',
        category: 'Compound',
        instructions: [
            'Hang from pull-up bar with overhand or underhand grip.',
            'Initiate by depressing scapulae and pulling chest toward bar.',
            'Lower with control until arms are fully extended.',
        ],
        tips: ['Avoid swinging or kipping', 'Engage lats at bottom of movement'],
        isCustom: false,
    },
    {
        name: 'Dumbbell Incline Bench Press',
        muscleGroup: 'Chest',
        secondaryMuscles: ['Front Delts', 'Triceps'],
        equipment: 'Dumbbell',
        difficulty: 'Intermediate',
        category: 'Compound',
        instructions: [
            'Set bench to 30-45 degree incline.',
            'Kick dumbbells up to shoulders and lie back.',
            'Press up and inward over upper chest without clicking weights together.',
        ],
        tips: ['Maintain a controlled 2-second negative', 'Keep wrists neutral'],
        isCustom: false,
    },
    {
        name: 'Bulgarian Split Squat',
        muscleGroup: 'Legs',
        secondaryMuscles: ['Glutes', 'Hamstrings', 'Core'],
        equipment: 'Dumbbell',
        difficulty: 'Intermediate',
        category: 'Compound',
        instructions: [
            'Place one foot behind you on a bench and stand tall.',
            'Lower back knee toward the ground while keeping front knee stable.',
            'Drive through front heel to return to top.',
        ],
        tips: ['Lean forward slightly to target glutes more', 'Keep front knee tracking straight'],
        isCustom: false,
    },
    {
        name: 'Romanian Deadlift (RDL)',
        muscleGroup: 'Legs',
        secondaryMuscles: ['Hamstrings', 'Glutes', 'Lower Back'],
        equipment: 'Barbell',
        difficulty: 'Intermediate',
        category: 'Compound',
        instructions: [
            'Hold bar at hips with slight soft bend in knees.',
            'Hinge hips backward as far as possible while lowering bar below knees.',
            'Squeeze glutes and snap hips forward to return.',
        ],
        tips: ['Keep bar in contact with thighs', 'Feel deep stretch in hamstrings'],
        isCustom: false,
    },
    {
        name: 'Chest-Supported Dumbbell Row',
        muscleGroup: 'Back',
        secondaryMuscles: ['Rhomboids', 'Rear Delts', 'Biceps'],
        equipment: 'Dumbbell',
        difficulty: 'Beginner',
        category: 'Compound',
        instructions: [
            'Lie face down on incline bench set to 45 degrees.',
            'Pull dumbbells up toward hip creases while retracting shoulder blades.',
            'Squeeze top contraction for 1 second before lowering slowly.',
        ],
        tips: ['Eliminate momentum from torso', 'Focus on elbow pull rather than hands'],
        isCustom: false,
    },
    {
        name: 'Lateral Dumbbell Raises',
        muscleGroup: 'Shoulders',
        secondaryMuscles: ['Traps'],
        equipment: 'Dumbbell',
        difficulty: 'Beginner',
        category: 'Isolation',
        instructions: [
            'Stand tall with dumbbells resting at your sides.',
            'Raise arms laterally with slight bend in elbows until parallel to floor.',
            'Pause briefly at peak before lowering with control.',
        ],
        tips: ['Lead with elbows, not wrists', 'Avoid shrugging shoulders up to ears'],
        isCustom: false,
    },
    {
        name: 'Barbell Bicep Curls',
        muscleGroup: 'Arms',
        secondaryMuscles: ['Forearms'],
        equipment: 'Barbell',
        difficulty: 'Beginner',
        category: 'Isolation',
        instructions: [
            'Stand upright with underhand shoulder-width grip.',
            'Curl bar upwards toward chest while keeping elbows pinned at ribs.',
            'Lower bar slowly through full range of motion.',
        ],
        tips: ['Do not swing torso for momentum', 'Squeeze biceps at the top'],
        isCustom: false,
    },
    {
        name: 'Triceps Rope Pushdowns',
        muscleGroup: 'Arms',
        secondaryMuscles: ['Forearms'],
        equipment: 'Cable',
        difficulty: 'Beginner',
        category: 'Isolation',
        instructions: [
            'Attach rope to high pulley and grip both ends.',
            'Push rope downward, spreading ends apart at the bottom for peak squeeze.',
            'Return up to 90 degree elbow bend under control.',
        ],
        tips: ['Keep upper arms stationary', 'Lock out triceps completely at bottom'],
        isCustom: false,
    },
    {
        name: 'Hanging Leg Raises',
        muscleGroup: 'Core',
        secondaryMuscles: ['Hip Flexors'],
        equipment: 'Bodyweight',
        difficulty: 'Intermediate',
        category: 'Compound',
        instructions: [
            'Hang from pull-up bar with relaxed shoulders.',
            'Engage core and raise legs straight or bent knees up to chest level.',
            'Lower slowly without swinging body.',
        ],
        tips: ['Posteriorly tilt pelvis at top', 'Control eccentric descent'],
        isCustom: false,
    },
    {
        name: 'Cable Woodchoppers',
        muscleGroup: 'Core',
        secondaryMuscles: ['Obliques', 'Shoulders'],
        equipment: 'Cable',
        difficulty: 'Intermediate',
        category: 'Compound',
        instructions: [
            'Set cable high or low, grip with both hands sideways to pulley.',
            'Rotate torso diagonally across body in a controlled chopping motion.',
            'Pivot back foot and engage core throughout rotation.',
        ],
        tips: ['Keep arms extended but not locked', 'Generate power from core rotation'],
        isCustom: false,
    },
    {
        name: 'Kettlebell Swings',
        muscleGroup: 'Full Body',
        secondaryMuscles: ['Hamstrings', 'Glutes', 'Lower Back', 'Shoulders'],
        equipment: 'Kettlebell',
        difficulty: 'Intermediate',
        category: 'Plyometric',
        instructions: [
            'Hinge at hips with kettlebell between legs.',
            'Explosively snap hips forward to swing bell up to chest height.',
            'Guide bell back into hip hinge and repeat continuously.',
        ],
        tips: ['Hinge, do not squat', 'Power comes from hips and glutes, not arms'],
        isCustom: false,
    },
];

// @desc    Get all exercises (seeds defaults if collection empty)
// @route   GET /api/exercises
// @access  Private
export const getExercises = asyncHandler(async (req, res) => {
    let count = await Exercise.countDocuments();
    if (count === 0) {
        await Exercise.insertMany(DEFAULT_EXERCISES);
    }

    const { muscle, equipment, difficulty, search } = req.query;

    const filter = {
        $or: [
            { isCustom: false },
            { createdBy: req.user._id },
        ],
    };

    if (muscle && muscle !== 'All') {
        filter.muscleGroup = muscle;
    }
    if (equipment && equipment !== 'All') {
        filter.equipment = equipment;
    }
    if (difficulty && difficulty !== 'All') {
        filter.difficulty = difficulty;
    }
    if (search) {
        filter.name = { $regex: search, $options: 'i' };
    }

    const exercises = await Exercise.find(filter).sort({ name: 1 }).lean();
    res.json(exercises);
});

// @desc    Create a custom exercise
// @route   POST /api/exercises
// @access  Private
export const createCustomExercise = asyncHandler(async (req, res) => {
    const { name, muscleGroup, secondaryMuscles, equipment, difficulty, category, instructions, tips } = req.body;

    if (!name || !muscleGroup) {
        res.status(400);
        throw new Error('Name and muscle group are required');
    }

    const exercise = await Exercise.create({
        name: name.trim(),
        muscleGroup,
        secondaryMuscles: secondaryMuscles || [],
        equipment: equipment || 'Bodyweight',
        difficulty: difficulty || 'Intermediate',
        category: category || 'Compound',
        instructions: instructions || [],
        tips: tips || [],
        isCustom: true,
        createdBy: req.user._id,
    });

    res.status(201).json(exercise);
});
