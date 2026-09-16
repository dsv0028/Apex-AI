import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    Play,
    Clock,
    Flame,
    TrendingUp,
    Activity,
    CheckCircle2,
    Sparkles,
    RefreshCw,
    Zap,
} from "lucide-react"
import axios from "axios"
import { WorkoutTimerModal } from "../components/WorkoutTimerModal"

const API_BASE = "http://localhost:5001/api"

// ─── Fallback mock data (used when no workout exists yet) ──────────────────────
const MOCK_TODAY = {
    _id: "mock",
    name: "High-Intensity Interval Training (HIIT)",
    duration: 45,
    intensity: "High",
    calories: 450,
    description: "Click 'Generate AI Workout' to get a personalized plan powered by Gemini AI based on your stats.",
    tags: ["Cardio", "Full Body", "Endurance"],
    exercises: [
        { name: "Jumping Jacks", duration: 60, sets: 1, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=60" },
        { name: "Burpees", duration: 45, sets: 3, image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&auto=format&fit=crop&q=60" },
        { name: "Mountain Climbers", duration: 60, sets: 3, image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&auto=format&fit=crop&q=60" },
        { name: "Rest", duration: 30, sets: 1, image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=60" },
        { name: "High Knees", duration: 45, sets: 3, image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop&q=60" },
    ],
}

const MOCK_UPCOMING = [
    { _id: "m1", name: "Active Recovery & Mobility", day: "Tomorrow", duration: 30, intensity: "Low", tags: ["Stretching", "Recovery"] },
    { _id: "m2", name: "Strength & Power (Lower Body)", day: "Wednesday", duration: 60, intensity: "Medium", tags: ["Strength", "Legs"] },
]

// ─── Animation Variants ────────────────────────────────────────────────────────
const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton({ className }) {
    return <div className={`animate-pulse bg-foreground/10 rounded-2xl ${className}`} />
}

export function Workouts() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    const userId = userInfo?._id
    const token = userInfo?.token
    const headers = { Authorization: `Bearer ${token}` }

    const [todayWorkout, setTodayWorkout] = useState(null)
    const [upcomingWorkouts, setUpcomingWorkouts] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedBy, setGeneratedBy] = useState("")
    const [loading, setLoading] = useState(true)

    // Fetch existing workouts on mount
    useEffect(() => {
        if (!userId || !token) {
            setLoading(false)
            return
        }
        axios
            .get(`${API_BASE}/training/${userId}`, { headers })
            .then((res) => {
                if (res.data.todayWorkout) {
                    setTodayWorkout(res.data.todayWorkout)
                    setUpcomingWorkouts(res.data.upcomingWorkouts || [])
                    // Check if it was AI generated
                    const tags = res.data.todayWorkout.tags || []
                    if (tags.includes("Gemini AI")) setGeneratedBy("Gemini AI")
                    else if (tags.includes("AI Generated")) setGeneratedBy("AI Generated")
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [userId])

    // Generate a new AI workout
    const handleGenerate = async () => {
        if (!token) return
        setIsGenerating(true)
        setGeneratedBy("")

        try {
            // Get user's stats from profile
            let stats = { stamina: 70, speed: 65, strength: 60 }
            try {
                const profileRes = await axios.get(`${API_BASE}/profile/me`, { headers })
                if (profileRes.data?.stats) {
                    stats = profileRes.data.stats
                }
            } catch (e) {
                // Use defaults if profile fetch fails
            }

            const res = await axios.post(
                `${API_BASE}/training/generate`,
                stats,
                { headers }
            )

            setTodayWorkout(res.data.todayWorkout)
            setUpcomingWorkouts(res.data.upcomingWorkouts || [])
            setGeneratedBy(res.data.generatedBy || "AI Generated")
        } catch (err) {
            console.error("Failed to generate workout:", err)
        } finally {
            setIsGenerating(false)
        }
    }

    // Use real data or fallback to mock
    const workout = todayWorkout || MOCK_TODAY
    const upcoming = upcomingWorkouts.length > 0 ? upcomingWorkouts : MOCK_UPCOMING
    const exercises = workout.exercises || MOCK_TODAY.exercises

    return (
        <>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-5xl mx-auto space-y-8"
            >
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Training Plan</h1>
                        <p className="text-foreground/60 mt-1">Your personalized, AI-generated schedule.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Generate AI Workout Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/25 disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {isGenerating ? (
                                <>
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4" />
                                    Generate AI Workout
                                </>
                            )}
                        </button>

                        {generatedBy && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                <Zap className="h-3.5 w-3.5 text-purple-500" />
                                <span className="text-xs font-bold text-purple-500">{generatedBy}</span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Loading Skeleton */}
                {isGenerating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        <div className="glass rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4 border border-purple-500/20">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                <Sparkles className="h-8 w-8 text-white animate-pulse" />
                            </div>
                            <h3 className="text-xl font-bold">Gemini AI is crafting your workout...</h3>
                            <p className="text-foreground/50 text-sm">Analyzing your stats and generating a personalized plan</p>
                            <div className="flex gap-1 mt-2">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="h-2 w-2 rounded-full bg-purple-500"
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Today's Workout Hero Card */}
                {!isGenerating && (
                    <motion.div
                        variants={itemVariants}
                        className="relative overflow-hidden rounded-[2.5rem] glass border border-brand-500/20 shadow-2xl shadow-brand-500/10 group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent z-0 pointer-events-none" />
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity z-0 pointer-events-none">
                            <Activity className="h-64 w-64 text-brand-500 -rotate-12" />
                        </div>

                        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 md:items-center">
                            <div className="flex-1 space-y-6">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 text-brand-500 font-bold text-sm border border-brand-500/20">
                                        <Flame className="h-4 w-4" />
                                        Recommended for Today
                                    </div>
                                    {generatedBy === "Gemini AI" && (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-500 font-bold text-sm border border-purple-500/20">
                                            <Sparkles className="h-3.5 w-3.5" />
                                            Powered by Gemini AI
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{workout.name}</h2>
                                    <p className="text-lg text-foreground/70 leading-relaxed max-w-2xl">
                                        {workout.description}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4 pt-2">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground/5 border border-border/50">
                                        <Clock className="h-5 w-5 text-foreground/60" />
                                        <span className="font-semibold">{workout.duration} min</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
                                        <TrendingUp className="h-5 w-5 text-red-500" />
                                        <span className="font-semibold text-red-500">{workout.intensity} Intensity</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                        <Flame className="h-5 w-5 text-orange-500" />
                                        <span className="font-semibold text-orange-500">~{workout.calories} kcal</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 pt-2">
                                    {(workout.tags || []).map(tag => (
                                        <span key={tag} className={`px-3 py-1 rounded-lg text-sm font-medium ${tag === "Gemini AI"
                                                ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                                                : "bg-foreground/5 text-foreground/70"
                                            }`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="pt-6">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-full sm:w-auto px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-brand-500/25"
                                    >
                                        <Play className="h-6 w-6 fill-current" />
                                        Start Workout
                                    </button>
                                </div>
                            </div>

                            {/* Exercise Preview Thumbnails */}
                            {exercises.length > 0 && (
                                <div className="hidden lg:flex flex-col gap-3 w-64 shrink-0">
                                    <h3 className="font-bold text-sm text-foreground/50 uppercase tracking-wider mb-2">
                                        {exercises.length} Exercises
                                    </h3>
                                    {exercises.slice(0, 3).map((ex, i) => (
                                        <div key={ex._id || i} className="relative h-20 rounded-xl overflow-hidden group/thumb cursor-pointer">
                                            <div className="absolute inset-0 bg-foreground/20 z-10 group-hover/thumb:bg-transparent transition-colors" />
                                            <img
                                                src={ex.image || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=60'}
                                                alt={ex.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=60';
                                                }}
                                            />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 z-20">
                                                <p className="text-white text-xs font-bold truncate">{ex.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {exercises.length > 3 && (
                                        <div className="h-20 rounded-xl border-2 border-dashed border-border/50 flex items-center justify-center text-foreground/50 font-bold text-sm bg-foreground/5">
                                            + {exercises.length - 3} more
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Upcoming Schedule */}
                {!isGenerating && (
                    <motion.div variants={itemVariants} className="pt-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold">Upcoming Schedule</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {upcoming.map((w) => (
                                <div key={w._id} className="glass p-6 rounded-3xl border border-border/50 flex flex-col justify-between hover:bg-foreground/5 transition-colors group cursor-pointer">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="font-bold text-brand-500 bg-brand-500/10 px-3 py-1 rounded-lg text-sm">
                                                {w.day}
                                            </span>
                                            <div className={`text-xs font-bold px-2 py-1 rounded-md ${w.intensity === 'High' ? 'bg-red-500/10 text-red-500' :
                                                    w.intensity === 'Medium' ? 'bg-orange-500/10 text-orange-500' : 'bg-emerald-500/10 text-emerald-500'
                                                }`}>
                                                {w.intensity}
                                            </div>
                                        </div>
                                        <h4 className="text-xl font-bold mb-2 group-hover:text-brand-500 transition-colors">{w.name}</h4>
                                    </div>

                                    <div className="mt-6 flex items-center gap-4 text-sm text-foreground/60 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4" />
                                            <span>{w.duration} min</span>
                                        </div>
                                        <div className="flex gap-2">
                                            {(w.tags || []).map(tag => (
                                                <span key={tag} className="text-xs border border-border/50 px-2 py-0.5 rounded-md">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>

            <WorkoutTimerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                workoutName={workout.name}
                exercises={exercises}
            />
        </>
    )
}
