import asyncHandler from 'express-async-handler';
import Workout from '../models/Workout.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ─── Exercise image pool ───────────────────────────────────────────────────────
const EXERCISE_IMAGES = {
    warmup:   'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=60',
    cardio:   'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop&q=60',
    strength: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&auto=format&fit=crop&q=60',
    hiit:     'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&auto=format&fit=crop&q=60',
    cooldown: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=60',
    running:  'https://images.unsplash.com/photo-1461896836934-bd45ba20b519?w=800&auto=format&fit=crop&q=60',
    yoga:     'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=60',
    default:  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=60',
};

// Pick a relevant image based on exercise name keywords
function pickImage(exerciseName) {
    const name = exerciseName.toLowerCase();
    if (name.includes('warm') || name.includes('stretch'))    return EXERCISE_IMAGES.warmup;
    if (name.includes('cool') || name.includes('rest'))        return EXERCISE_IMAGES.cooldown;
    if (name.includes('run') || name.includes('jog'))          return EXERCISE_IMAGES.running;
    if (name.includes('sprint') || name.includes('hiit'))      return EXERCISE_IMAGES.hiit;
    if (name.includes('yoga') || name.includes('mobility'))    return EXERCISE_IMAGES.yoga;
    if (name.includes('squat') || name.includes('deadlift') ||
        name.includes('press') || name.includes('lift') ||
        name.includes('curl'))                                 return EXERCISE_IMAGES.strength;
    if (name.includes('jump') || name.includes('burpee'))      return EXERCISE_IMAGES.cardio;
    return EXERCISE_IMAGES.default;
}

// ─── Gemini AI workout generation ──────────────────────────────────────────────
async function generateWithGemini(stamina, speed, strength, userName) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an elite sports AI coach. Generate a personalized training plan for an athlete with these stats (each 0-100):
- Stamina: ${stamina}
- Speed: ${speed}  
- Strength: ${strength}
${userName ? `- Athlete name: ${userName}` : ''}

RESPOND ONLY WITH VALID JSON (no markdown, no code fences). Use this exact format:
{
  "todayWorkout": {
    "name": "Workout name (creative, specific)",
    "duration": 45,
    "intensity": "High",
    "calories": 500,
    "description": "2-3 sentence personalized description explaining why this workout is optimal for these stats",
    "tags": ["Tag1", "Tag2", "AI Generated"],
    "exercises": [
      { "name": "Exercise Name", "duration": 300, "sets": 3 },
      { "name": "Exercise Name", "duration": 600, "sets": 4 },
      { "name": "Exercise Name", "duration": 300, "sets": 3 },
      { "name": "Exercise Name", "duration": 450, "sets": 3 },
      { "name": "Cool Down & Stretching", "duration": 300, "sets": 1 }
    ]
  },
  "upcomingWorkouts": [
    {
      "name": "Workout name for tomorrow",
      "day": "Tomorrow",
      "duration": 30,
      "intensity": "Low",
      "calories": 200,
      "tags": ["Recovery", "Stretching"]
    },
    {
      "name": "Workout name for day after",
      "day": "Day After Tomorrow",
      "duration": 45,
      "intensity": "Medium",
      "calories": 350,
      "tags": ["Tag1", "Tag2"]
    }
  ]
}

Rules:
- Generate 4-6 exercises for today's workout (include warm-up and cool-down)
- Exercise duration is in SECONDS (e.g., 300 = 5 min, 60 = 1 min)
- Focus the workout on the athlete's WEAKEST area to improve balance
- If all stats are similar, create a balanced full-body workout
- Make exercise names specific and actionable (e.g., "Barbell Back Squats" not just "Squats")
- Intensity should be "Low", "Medium", or "High"
- Be creative with workout names — don't use generic names
- Calories should be realistic for the workout duration and intensity`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        // Clean up response — remove markdown code fences if present
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleaned);
        
        return parsed;
    } catch (error) {
        console.error('Gemini AI error:', error.message);
        return null;
    }
}

// ─── Fallback: original algorithmic logic ──────────────────────────────────────
function generateFallbackPlan(stamina, speed, strength) {
    let focus = 'Balanced';
    if (stamina > speed && stamina > strength) focus = 'Endurance';
    if (strength > speed && strength > stamina) focus = 'Strength';
    if (speed > stamina && speed > strength) focus = 'Speed';

    return {
        todayWorkout: {
            name: `${focus} Focus Training`,
            duration: focus === 'Endurance' ? 60 : 45,
            intensity: focus === 'Speed' ? 'High' : 'Medium',
            calories: focus === 'Endurance' ? 600 : 450,
            description: `AI optimized routine based on your latest stats. Focuses on ${focus.toLowerCase()} development.`,
            tags: [focus, 'Full Body', 'AI Generated'],
            exercises: [
                { name: 'Warm Up / Stretching', duration: 300, sets: 1 },
                { name: focus === 'Speed' ? 'Sprints' : focus === 'Strength' ? 'Heavy Lifts' : 'Long Run', duration: 1800, sets: 3 },
                { name: 'Cool Down', duration: 300, sets: 1 },
            ],
        },
        upcomingWorkouts: [
            { name: 'Active Recovery & Mobility', day: 'Tomorrow', duration: 30, intensity: 'Low', calories: 200, tags: ['Recovery', 'Stretching'] },
            { name: 'Core Stability', day: 'Wednesday', duration: 40, intensity: 'Medium', calories: 300, tags: ['Core', 'Stability'] },
        ],
    };
}

// ─── Main Controller ───────────────────────────────────────────────────────────

// @desc    Generate a new training plan based on stats (Gemini AI + fallback)
// @route   POST /api/training/generate
// @access  Private
const generateTrainingPlan = asyncHandler(async (req, res) => {
    const { stamina, speed, strength } = req.body;
    const userName = req.user?.name || '';

    // Clear old pending workouts
    await Workout.deleteMany({ user: req.user._id, status: 'Pending' });

    // Try Gemini AI first, fall back to algorithmic logic
    let plan = await generateWithGemini(stamina, speed, strength, userName);
    let usedAI = true;

    if (!plan) {
        plan = generateFallbackPlan(stamina, speed, strength);
        usedAI = false;
    }

    // Save today's workout to DB
    const todayData = plan.todayWorkout;
    const todayWorkout = await Workout.create({
        user: req.user._id,
        name: todayData.name,
        day: 'Today',
        duration: todayData.duration,
        intensity: todayData.intensity,
        calories: todayData.calories,
        description: todayData.description || '',
        tags: [...(todayData.tags || []), ...(usedAI ? ['Gemini AI'] : [])],
        exercises: (todayData.exercises || []).map((ex, i) => ({
            name: ex.name,
            duration: ex.duration,
            sets: ex.sets || 1,
            image: pickImage(ex.name),
        })),
        status: 'Pending',
    });

    // Save upcoming workouts
    const upcomingWorkouts = await Promise.all(
        (plan.upcomingWorkouts || []).map((w) =>
            Workout.create({
                user: req.user._id,
                name: w.name,
                day: w.day || 'Tomorrow',
                duration: w.duration,
                intensity: w.intensity,
                calories: w.calories,
                tags: w.tags || [],
                exercises: [],
                status: 'Pending',
            })
        )
    );

    res.status(201).json({
        todayWorkout,
        upcomingWorkouts,
        generatedBy: usedAI ? 'Gemini AI' : 'Algorithmic Fallback',
    });
});

// @desc    Get current training plan
// @route   GET /api/training/:userId
// @access  Private
const getTrainingPlan = asyncHandler(async (req, res) => {
    const workouts = await Workout.find({ user: req.params.userId, status: 'Pending' });

    const todayWorkout = workouts.find(w => w.day === 'Today');
    const upcomingWorkouts = workouts.filter(w => w.day !== 'Today');

    res.status(200).json({
        todayWorkout: todayWorkout || null,
        upcomingWorkouts
    });
});

// @desc    Update workout progress
// @route   PUT /api/training/progress
// @access  Private
const updateTrainingProgress = asyncHandler(async (req, res) => {
    const { workoutId, status } = req.body;

    const workout = await Workout.findById(workoutId);

    if (workout) {
        // Ensure the logged in user matches the workout user
        if (workout.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this workout');
        }

        workout.status = status || workout.status;
        
        const updatedWorkout = await workout.save();
        res.json(updatedWorkout);
    } else {
        res.status(404);
        throw new Error('Workout not found');
    }
});

export { generateTrainingPlan, getTrainingPlan, updateTrainingProgress };
