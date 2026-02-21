import { useState } from "react"
import { motion } from "framer-motion"
import {
    Play,
    Clock,
    Flame,
    TrendingUp,
    Activity,
    CheckCircle2
} from "lucide-react"
import { WorkoutTimerModal } from "../components/WorkoutTimerModal"

// Mock Data
const todayWorkout = {
    id: "w1",
    name: "High-Intensity Interval Training (HIIT)",
    duration: 45, // minutes
    intensity: "High",
    calories: 450,
    description: "AI optimized routine based on your recovery score of 95/100. Focuses on explosive power and cardiovascular endurance.",
    tags: ["Cardio", "Full Body", "Endurance"],
    exercises: [
        {
            id: "e1",
            name: "Jumping Jacks",
            duration: 60,
            sets: 1,
            currentSet: 1,
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=60"
        },
        {
            id: "e2",
            name: "Burpees",
            duration: 45,
            sets: 3,
            currentSet: 1,
            image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&auto=format&fit=crop&q=60"
        },
        {
            id: "e3",
            name: "Mountain Climbers",
            duration: 60,
            sets: 3,
            currentSet: 1,
            image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&auto=format&fit=crop&q=60"
        },
        {
            id: "e4",
            name: "Rest",
            duration: 30,
            image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=60"
        },
        {
            id: "e5",
            name: "High Knees",
            duration: 45,
            sets: 3,
            currentSet: 1,
            image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop&q=60"
        }
    ]
}

const upcomingWorkouts = [
    {
        id: "w2",
        name: "Active Recovery & Mobility",
        day: "Tomorrow",
        duration: 30,
        intensity: "Low",
        tags: ["Stretching", "Recovery"]
    },
    {
        id: "w3",
        name: "Strength & Power (Lower Body)",
        day: "Wednesday",
        duration: 60,
        intensity: "Medium",
        tags: ["Strength", "Legs"]
    }
]


const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
}

export function Workouts() {
    const [isModalOpen, setIsModalOpen] = useState(false)

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
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4, 5].map((day) => (
                                <div
                                    key={day}
                                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-background z-[${6 - day}] ${day <= 3 ? 'bg-brand-500 text-white' : 'bg-foreground/10 text-foreground/50'
                                        }`}
                                >
                                    {day <= 3 ? <CheckCircle2 className="h-4 w-4" /> : day}
                                </div>
                            ))}
                        </div>
                        <span className="text-sm font-semibold text-foreground/70">3/5 Days Complete</span>
                    </div>
                </motion.div>

                {/* Today's Workout Hero Card */}
                <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2.5rem] glass border border-brand-500/20 shadow-2xl shadow-brand-500/10 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent z-0 pointer-events-none" />
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity z-0 pointer-events-none">
                        <Activity className="h-64 w-64 text-brand-500 -rotate-12" />
                    </div>

                    <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 md:items-center">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 text-brand-500 font-bold text-sm border border-brand-500/20">
                                <Flame className="h-4 w-4" />
                                Recommended for Today
                            </div>

                            <div>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{todayWorkout.name}</h2>
                                <p className="text-lg text-foreground/70 leading-relaxed max-w-2xl">
                                    {todayWorkout.description}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground/5 border border-border/50">
                                    <Clock className="h-5 w-5 text-foreground/60" />
                                    <span className="font-semibold">{todayWorkout.duration} min</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
                                    <TrendingUp className="h-5 w-5 text-red-500" />
                                    <span className="font-semibold text-red-500">{todayWorkout.intensity} Intensity</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                    <Flame className="h-5 w-5 text-orange-500" />
                                    <span className="font-semibold text-orange-500">~{todayWorkout.calories} kcal</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                {todayWorkout.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-lg bg-foreground/5 text-sm font-medium text-foreground/70">
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
                        <div className="hidden lg:flex flex-col gap-3 w-64 shrink-0">
                            <h3 className="font-bold text-sm text-foreground/50 uppercase tracking-wider mb-2">Preview</h3>
                            {todayWorkout.exercises.slice(0, 3).map((ex) => (
                                <div key={ex.id} className="relative h-20 rounded-xl overflow-hidden group/thumb cursor-pointer">
                                    <div className="absolute inset-0 bg-foreground/20 z-10 group-hover/thumb:bg-transparent transition-colors" />
                                    <img src={ex.image} alt={ex.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 z-20">
                                        <p className="text-white text-xs font-bold truncate">{ex.name}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="h-20 rounded-xl border-2 border-dashed border-border/50 flex items-center justify-center text-foreground/50 font-bold text-sm bg-foreground/5">
                                + {todayWorkout.exercises.length - 3} more
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Upcoming Schedule */}
                <motion.div variants={itemVariants} className="pt-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold">Upcoming Schedule</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upcomingWorkouts.map((workout) => (
                            <div key={workout.id} className="glass p-6 rounded-3xl border border-border/50 flex flex-col justify-between hover:bg-foreground/5 transition-colors group cursor-pointer">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="font-bold text-brand-500 bg-brand-500/10 px-3 py-1 rounded-lg text-sm">
                                            {workout.day}
                                        </span>
                                        <div className={`text-xs font-bold px-2 py-1 rounded-md ${workout.intensity === 'Medium' ? 'bg-orange-500/10 text-orange-500' : 'bg-emerald-500/10 text-emerald-500'
                                            }`}>
                                            {workout.intensity}
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-bold mb-2 group-hover:text-brand-500 transition-colors">{workout.name}</h4>
                                </div>

                                <div className="mt-6 flex items-center gap-4 text-sm text-foreground/60 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        <span>{workout.duration} min</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {workout.tags.map(tag => (
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

            </motion.div>

            <WorkoutTimerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                workoutName={todayWorkout.name}
                exercises={todayWorkout.exercises}
            />
        </>
    )
}
