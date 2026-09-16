import { useState, useEffect, useId } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ClipboardList,
    Plus,
    Trophy,
    Flame,
    Clock,
    Dumbbell,
    Trash2,
    CheckCircle2,
    TrendingUp,
    Sparkles,
    Calendar,
    X,
    Award,
} from "lucide-react"
import axios from "axios"
import confetti from "canvas-confetti"

const API_BASE = "http://localhost:5001/api"

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
}

export function WorkoutLogs() {
    const workoutNameInputId = useId()
    const categorySelectId = useId()
    const durationInputId = useId()
    const feelingSelectId = useId()
    const notesInputId = useId()

    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    const token = userInfo?.token

    const [logs, setLogs] = useState([])
    const [summary, setSummary] = useState({
        totalWorkouts: 0,
        totalVolumeKg: 0,
        totalMinutes: 0,
        allTimePRs: [],
    })
    const [achievementsData, setAchievementsData] = useState({ achievements: [], stats: {} })
    const [loading, setLoading] = useState(true)
    const [isLogModalOpen, setIsLogModalOpen] = useState(false)

    // New Log Form State
    const [newLog, setNewLog] = useState({
        workoutName: "",
        category: "Strength",
        durationMinutes: 45,
        feeling: "Good",
        notes: "",
        exercises: [
            {
                name: "Barbell Back Squat",
                muscleGroup: "Legs",
                sets: [
                    { setNumber: 1, weightKg: 80, reps: 8, rpe: 7, completed: true },
                    { setNumber: 2, weightKg: 90, reps: 6, rpe: 8, completed: true },
                    { setNumber: 3, weightKg: 100, reps: 5, rpe: 9, completed: true },
                ],
            },
        ],
    })

    const fetchLogs = async () => {
        try {
            setLoading(true)
            const [logsRes, achRes] = await Promise.all([
                axios.get(`${API_BASE}/logs`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_BASE}/achievements`, { headers: { Authorization: `Bearer ${token}` } }),
            ])
            setLogs(logsRes.data.logs || [])
            setSummary(logsRes.data.summary || {})
            setAchievementsData(achRes.data || { achievements: [], stats: {} })
        } catch (err) {
            console.error("Failed to load workout logs or achievements:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) fetchLogs()
    }, [token])

    const handleAddExercise = () => {
        setNewLog({
            ...newLog,
            exercises: [
                ...newLog.exercises,
                {
                    name: "Barbell Bench Press",
                    muscleGroup: "Chest",
                    sets: [{ setNumber: 1, weightKg: 60, reps: 10, rpe: 7, completed: true }],
                },
            ],
        })
    }

    const handleRemoveExercise = (idx) => {
        setNewLog({
            ...newLog,
            exercises: newLog.exercises.filter((_, i) => i !== idx),
        })
    }

    const handleAddSet = (exerciseIdx) => {
        const updated = [...newLog.exercises]
        const lastSet = updated[exerciseIdx].sets[updated[exerciseIdx].sets.length - 1]
        updated[exerciseIdx].sets.push({
            setNumber: updated[exerciseIdx].sets.length + 1,
            weightKg: lastSet ? lastSet.weightKg : 50,
            reps: lastSet ? lastSet.reps : 8,
            rpe: lastSet ? lastSet.rpe : 8,
            completed: true,
        })
        setNewLog({ ...newLog, exercises: updated })
    }

    const handleRemoveSet = (exerciseIdx, setIdx) => {
        const updated = [...newLog.exercises]
        updated[exerciseIdx].sets = updated[exerciseIdx].sets.filter((_, i) => i !== setIdx)
        setNewLog({ ...newLog, exercises: updated })
    }

    const handleSetChange = (exerciseIdx, setIdx, field, value) => {
        const updated = [...newLog.exercises]
        updated[exerciseIdx].sets[setIdx][field] = Number(value) || 0
        setNewLog({ ...newLog, exercises: updated })
    }

    const handleExerciseNameChange = (exerciseIdx, val) => {
        const updated = [...newLog.exercises]
        updated[exerciseIdx].name = val
        setNewLog({ ...newLog, exercises: updated })
    }

    // Compute live volume for modal
    const liveVolume = newLog.exercises.reduce((sum, ex) => {
        return sum + ex.sets.reduce((sSum, s) => sSum + (s.weightKg * s.reps), 0)
    }, 0)

    const handleSaveLog = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${API_BASE}/logs`, newLog, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setIsLogModalOpen(false)
            fetchLogs()

            // Trigger celebratory confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            })

            // Reset modal
            setNewLog({
                workoutName: "",
                category: "Strength",
                durationMinutes: 45,
                feeling: "Good",
                notes: "",
                exercises: [
                    {
                        name: "Barbell Back Squat",
                        muscleGroup: "Legs",
                        sets: [{ setNumber: 1, weightKg: 80, reps: 8, rpe: 7, completed: true }],
                    },
                ],
            })
        } catch (err) {
            console.error("Failed to save workout log:", err)
        }
    }

    const handleDeleteLog = async (id) => {
        try {
            await axios.delete(`${API_BASE}/logs/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            fetchLogs()
        } catch (err) {
            console.error("Failed to delete log:", err)
        }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="p-6 md:p-8 max-w-7xl mx-auto space-y-8"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent flex items-center gap-3">
                        <ClipboardList className="h-8 w-8 text-brand-500" />
                        Workout Log & PR Tracker
                    </h1>
                    <p className="text-foreground/60 text-sm mt-1">
                        Log weight room volume, calculate 1-Rep Max benchmarks, and celebrate new Personal Records.
                    </p>
                </div>

                <button
                    onClick={() => setIsLogModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02]"
                >
                    <Plus className="h-4 w-4" />
                    Log Completed Session
                </button>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass rounded-2xl p-5 border border-border/40 shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400">
                        <Dumbbell className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-foreground/60">Sessions Logged</p>
                        <h3 className="text-2xl font-black">{summary.totalWorkouts || 0}</h3>
                    </div>
                </div>

                <div className="glass rounded-2xl p-5 border border-border/40 shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-foreground/60">Total Tonnage</p>
                        <h3 className="text-2xl font-black">
                            {((summary.totalVolumeKg || 0) / 1000).toFixed(1)} <span className="text-sm font-semibold">tonnes</span>
                        </h3>
                    </div>
                </div>

                <div className="glass rounded-2xl p-5 border border-border/40 shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-foreground/60">Time in Training</p>
                        <h3 className="text-2xl font-black">
                            {Math.round((summary.totalMinutes || 0) / 60)} <span className="text-sm font-semibold">hrs</span>
                        </h3>
                    </div>
                </div>

                <div className="glass rounded-2xl p-5 border border-border/40 shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                        <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-foreground/60">PRs Unlocked</p>
                        <h3 className="text-2xl font-black">{summary.allTimePRs?.length || 0}</h3>
                    </div>
                </div>
            </motion.div>

            {/* All-Time PR Badges Showcase */}
            {summary.allTimePRs && summary.allTimePRs.length > 0 && (
                <motion.div variants={itemVariants} className="glass rounded-3xl p-6 border border-border/40 shadow-lg space-y-4">
                    <div className="flex items-center gap-2 text-lg font-bold">
                        <Trophy className="h-5 w-5 text-amber-500" />
                        <span>All-Time Personal Records (Est. 1-Rep Max)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {summary.allTimePRs.map((pr, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-card to-card border border-amber-500/30 space-y-2 relative overflow-hidden"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-foreground/60 truncate max-w-[140px]">{pr.exercise}</span>
                                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                        PR
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <h4 className="text-2xl font-black text-amber-400">{pr.est1RM} <span className="text-sm font-bold">kg</span></h4>
                                    <span className="text-xs text-foreground/50">Est. 1RM</span>
                                </div>
                                <p className="text-[11px] text-foreground/60">
                                    Best Set: <strong>{pr.weightKg}kg</strong> × <strong>{pr.reps} reps</strong>
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Achievements & Streaks Rack */}
            {achievementsData.achievements && achievementsData.achievements.length > 0 && (
                <motion.div variants={itemVariants} className="glass rounded-3xl p-6 border border-border/40 shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-lg font-bold">
                            <Award className="h-5 w-5 text-brand-500" />
                            <span>Milestone Achievements & Streaks</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold">
                            <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/30">
                                {achievementsData.stats?.unlockedCount || 0} / {achievementsData.stats?.totalCount || 0} Unlocked
                            </span>
                            <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center gap-1">
                                <Flame className="h-3.5 w-3.5 fill-orange-500" />
                                {achievementsData.stats?.streakDays || 0}-Day Streak
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {achievementsData.achievements.map((ach) => (
                            <div
                                key={ach._id || ach.code}
                                className={`p-4 rounded-2xl border transition-all text-center space-y-2 flex flex-col justify-between ${
                                    ach.unlocked
                                        ? "bg-brand-500/10 border-brand-500/40 shadow-md shadow-brand-500/10"
                                        : "bg-card/30 border-border/20 opacity-40 grayscale"
                                }`}
                            >
                                <div className="mx-auto h-10 w-10 rounded-full flex items-center justify-center bg-brand-500/20 text-brand-400 text-lg">
                                    {ach.category === "Strength" ? "🏋️" : ach.category === "Consistency" ? "🔥" : "🏆"}
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs text-foreground">{ach.title}</h4>
                                    <p className="text-[10px] text-foreground/60 line-clamp-2 mt-0.5">{ach.description}</p>
                                </div>
                                <span className="text-[10px] font-extrabold text-brand-400 block pt-1">
                                    {ach.unlocked ? "✓ UNLOCKED" : `+${ach.points} pts`}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Logged Workouts Feed */}
            <motion.div variants={itemVariants} className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-brand-500" />
                    Training History & Logs
                </h2>

                {logs.length === 0 ? (
                    <div className="glass rounded-3xl p-12 text-center border border-border/40 space-y-3">
                        <ClipboardList className="h-12 w-12 mx-auto text-foreground/20" />
                        <h3 className="text-lg font-bold">No workout logs found</h3>
                        <p className="text-sm text-foreground/50 max-w-md mx-auto">
                            You haven't logged any weight room or cardio workouts yet. Click the button above to log your first training session!
                        </p>
                        <button
                            onClick={() => setIsLogModalOpen(true)}
                            className="mt-2 px-5 py-2 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-all"
                        >
                            Log First Workout
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {logs.map((log) => (
                            <div
                                key={log._id}
                                className="glass rounded-3xl p-6 border border-border/40 shadow-md space-y-5 hover:border-brand-500/30 transition-all"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/30 pb-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                                                {log.category}
                                            </span>
                                            <span className="text-xs text-foreground/50 flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {new Date(log.date).toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground mt-1">{log.workoutName}</h3>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <span className="text-xs text-foreground/50 block">Total Volume</span>
                                            <span className="text-sm font-black text-brand-400">{log.totalVolumeKg} kg</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-foreground/50 block">Duration</span>
                                            <span className="text-sm font-bold text-foreground">{log.durationMinutes} min</span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteLog(log._id)}
                                            className="p-2 rounded-xl text-foreground/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                            title="Delete Log"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* PRs unlocked in this specific session */}
                                {log.personalRecords && log.personalRecords.length > 0 && (
                                    <div className="space-y-1">
                                        {log.personalRecords.map((pr, pIdx) => (
                                            <div
                                                key={pIdx}
                                                className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold"
                                            >
                                                <Trophy className="h-4 w-4 shrink-0" />
                                                <span>{pr.metric}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Exercises Breakdown Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {(log.exercises || []).map((ex, eIdx) => (
                                        <div key={eIdx} className="p-4 rounded-2xl bg-card/60 border border-border/30 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-sm text-foreground">{ex.name}</h4>
                                                <span className="text-[10px] text-foreground/50 font-semibold">{ex.muscleGroup}</span>
                                            </div>
                                            <div className="space-y-1 text-xs">
                                                {ex.sets.map((s, sIdx) => (
                                                    <div key={sIdx} className="flex items-center justify-between text-foreground/70 py-0.5 border-b border-border/10 last:border-0">
                                                        <span>Set {s.setNumber}:</span>
                                                        <span className="font-semibold text-foreground">
                                                            {s.weightKg} kg × {s.reps} reps
                                                        </span>
                                                        <span className="text-[10px] text-foreground/40">RPE {s.rpe}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {log.notes && (
                                    <p className="text-xs text-foreground/70 italic bg-foreground/5 p-3 rounded-2xl border border-border/20">
                                        "{log.notes}" — Feeling: <strong>{log.feeling}</strong>
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Log Modal */}
            <AnimatePresence>
                {isLogModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass border border-border/50 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 my-8"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Dumbbell className="h-5 w-5 text-brand-500" />
                                        Log Completed Training Session
                                    </h3>
                                    <p className="text-xs text-foreground/60 mt-0.5">
                                        Calculated Volume: <strong className="text-brand-400">{liveVolume} kg</strong>
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsLogModalOpen(false)}
                                    className="p-1 rounded-lg hover:bg-foreground/10 text-foreground/60"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveLog} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor={workoutNameInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                            Workout Name *
                                        </label>
                                        <input
                                            id={workoutNameInputId}
                                            type="text"
                                            required
                                            placeholder="e.g., Chest & Back Hypertrophy"
                                            value={newLog.workoutName}
                                            onChange={(e) => setNewLog({ ...newLog, workoutName: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={categorySelectId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                            Category
                                        </label>
                                        <select
                                            id={categorySelectId}
                                            value={newLog.category}
                                            onChange={(e) => setNewLog({ ...newLog, category: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-background border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                        >
                                            <option value="Strength">Strength</option>
                                            <option value="Hypertrophy">Hypertrophy</option>
                                            <option value="Endurance">Endurance</option>
                                            <option value="Speed">Speed</option>
                                            <option value="HIIT">HIIT</option>
                                            <option value="Recovery">Recovery</option>
                                            <option value="Custom">Custom</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor={durationInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                            Duration (min)
                                        </label>
                                        <input
                                            id={durationInputId}
                                            type="number"
                                            value={newLog.durationMinutes}
                                            onChange={(e) => setNewLog({ ...newLog, durationMinutes: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={feelingSelectId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                            How Did You Feel?
                                        </label>
                                        <select
                                            id={feelingSelectId}
                                            value={newLog.feeling}
                                            onChange={(e) => setNewLog({ ...newLog, feeling: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-background border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                        >
                                            <option value="Great">Great ⚡</option>
                                            <option value="Good">Good 👍</option>
                                            <option value="Moderate">Moderate 😐</option>
                                            <option value="Tired">Tired 🥱</option>
                                            <option value="Exhausted">Exhausted 🥵</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Exercise List Builder */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold">Exercises & Sets</span>
                                        <button
                                            type="button"
                                            onClick={handleAddExercise}
                                            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            Add Exercise
                                        </button>
                                    </div>

                                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                                        {newLog.exercises.map((ex, exIdx) => (
                                            <div key={exIdx} className="p-4 rounded-2xl bg-foreground/5 border border-border/30 space-y-3">
                                                <div className="flex items-center justify-between gap-2">
                                                    <input
                                                        type="text"
                                                        value={ex.name}
                                                        onChange={(e) => handleExerciseNameChange(exIdx, e.target.value)}
                                                        className="px-3 py-1.5 rounded-lg bg-background border border-border/40 text-xs font-bold w-full max-w-xs focus:outline-none"
                                                        placeholder="Exercise Name"
                                                    />
                                                    {newLog.exercises.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveExercise(exIdx)}
                                                            className="text-foreground/40 hover:text-red-400 p-1 text-xs"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Sets */}
                                                <div className="space-y-2">
                                                    {ex.sets.map((s, sIdx) => (
                                                        <div key={sIdx} className="flex items-center gap-2 text-xs">
                                                            <span className="w-12 text-foreground/50 font-semibold">Set {s.setNumber}</span>
                                                            <input
                                                                type="number"
                                                                placeholder="kg"
                                                                value={s.weightKg}
                                                                onChange={(e) => handleSetChange(exIdx, sIdx, "weightKg", e.target.value)}
                                                                className="w-20 px-2 py-1 rounded-md bg-background border border-border/40 text-center"
                                                            />
                                                            <span className="text-foreground/40">kg ×</span>
                                                            <input
                                                                type="number"
                                                                placeholder="reps"
                                                                value={s.reps}
                                                                onChange={(e) => handleSetChange(exIdx, sIdx, "reps", e.target.value)}
                                                                className="w-16 px-2 py-1 rounded-md bg-background border border-border/40 text-center"
                                                            />
                                                            <span className="text-foreground/40">reps (RPE:</span>
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                max={10}
                                                                value={s.rpe}
                                                                onChange={(e) => handleSetChange(exIdx, sIdx, "rpe", e.target.value)}
                                                                className="w-14 px-2 py-1 rounded-md bg-background border border-border/40 text-center"
                                                            />
                                                            <span className="text-foreground/40">)</span>

                                                            {ex.sets.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveSet(exIdx, sIdx)}
                                                                    className="text-foreground/30 hover:text-red-400 p-1"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAddSet(exIdx)}
                                                        className="text-[11px] font-semibold text-brand-500 hover:underline pt-1 block"
                                                    >
                                                        + Add Set
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor={notesInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                        Session Notes
                                    </label>
                                    <textarea
                                        id={notesInputId}
                                        rows={2}
                                        placeholder="e.g., Felt strong on squat lockout, paused reps on bench."
                                        value={newLog.notes}
                                        onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm resize-none"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsLogModalOpen(false)}
                                        className="px-4 py-2 rounded-xl border border-border/40 text-sm font-semibold hover:bg-foreground/5"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-lg shadow-brand-500/20"
                                    >
                                        Save Workout Log
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
export default WorkoutLogs
