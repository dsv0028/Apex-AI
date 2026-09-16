import { useState, useEffect, useId } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Users,
    Shield,
    CheckSquare,
    Square,
    Calendar,
    Plus,
    Activity,
    AlertTriangle,
    CheckCircle2,
    Dumbbell,
    Send,
    Sparkles,
    Flame,
    X,
} from "lucide-react"
import axios from "axios"

const API_BASE = "http://localhost:5001/api"

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
}

export function CoachRoster() {
    const routineTitleInputId = useId()
    const scheduledDateInputId = useId()
    const categorySelectId = useId()
    const durationInputId = useId()
    const coachInstructionsInputId = useId()

    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    const token = userInfo?.token

    const [athletes, setAthletes] = useState([])
    const [assignments, setAssignments] = useState([])
    const [selectedAthletes, setSelectedAthletes] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)

    // Bulk Assignment Form
    const [newAssignment, setNewAssignment] = useState({
        title: "Team Power & Endurance Protocol",
        scheduledDate: new Date().toISOString().split("T")[0],
        category: "Strength",
        targetDuration: 60,
        coachInstructions: "Focus on controlled eccentrics and explosive concentric drive.",
        exercises: [
            { name: "Barbell Back Squat", sets: 4, reps: "6-8" },
            { name: "Romanian Deadlift", sets: 3, reps: "8-10" },
            { name: "Box Jumps", sets: 3, reps: "10" },
        ],
    })

    const fetchRoster = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${API_BASE}/roster`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setAthletes(res.data.athletes || [])
            setAssignments(res.data.assignments || [])
        } catch (err) {
            console.error("Failed to load coach roster:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) fetchRoster()
    }, [token])

    const toggleSelectAthlete = (id) => {
        if (selectedAthletes.includes(id)) {
            setSelectedAthletes(selectedAthletes.filter((aId) => aId !== id))
        } else {
            setSelectedAthletes([...selectedAthletes, id])
        }
    }

    const selectAll = () => {
        if (selectedAthletes.length === athletes.length) {
            setSelectedAthletes([])
        } else {
            setSelectedAthletes(athletes.map((a) => a._id))
        }
    }

    const handleBulkAssign = async (e) => {
        e.preventDefault()
        if (selectedAthletes.length === 0) return

        try {
            const payload = {
                title: newAssignment.title,
                athleteIds: selectedAthletes,
                scheduledDate: newAssignment.scheduledDate,
                coachInstructions: newAssignment.coachInstructions,
                workoutRoutine: {
                    name: newAssignment.title,
                    category: newAssignment.category,
                    targetDuration: newAssignment.targetDuration,
                    exercises: newAssignment.exercises,
                },
            }

            await axios.post(`${API_BASE}/roster/bulk-assign`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            })

            setIsAssignModalOpen(false)
            setSelectedAthletes([])
            fetchRoster()
        } catch (err) {
            console.error("Failed to deploy bulk assignment:", err)
        }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-24"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent flex items-center gap-3">
                        <Shield className="h-8 w-8 text-brand-500" />
                        Coach Command & Team Roster Hub
                    </h1>
                    <p className="text-foreground/60 text-sm mt-1">
                        Monitor athlete readiness scores, track fatigue benchmarks, and bulk-dispatch training cycles.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsAssignModalOpen(true)}
                        disabled={selectedAthletes.length === 0}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02]"
                    >
                        <Send className="h-4 w-4" />
                        Bulk Assign Workout ({selectedAthletes.length})
                    </button>
                </div>
            </motion.div>

            {/* Roster Overview Table */}
            <motion.div variants={itemVariants} className="glass rounded-3xl p-6 border border-border/40 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-border/30 pb-4">
                    <div className="flex items-center gap-3">
                        <button onClick={selectAll} className="text-foreground/60 hover:text-foreground">
                            {selectedAthletes.length === athletes.length && athletes.length > 0 ? (
                                <CheckSquare className="h-5 w-5 text-brand-500" />
                            ) : (
                                <Square className="h-5 w-5" />
                            )}
                        </button>
                        <h3 className="text-lg font-bold">Registered Athlete Roster ({athletes.length})</h3>
                    </div>

                    <span className="text-xs font-semibold text-foreground/50">
                        {selectedAthletes.length} Athletes Selected
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-border/20 text-foreground/50 uppercase tracking-wider font-semibold">
                                <th className="py-3 px-2 w-10"></th>
                                <th className="py-3 px-4">Athlete</th>
                                <th className="py-3 px-4">Sport / Discipline</th>
                                <th className="py-3 px-4 text-center">AI Readiness</th>
                                <th className="py-3 px-4 text-center">Injury Risk</th>
                                <th className="py-3 px-4 text-right">Recent Volume</th>
                                <th className="py-3 px-4">Latest Session</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {athletes.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-foreground/40 italic">
                                        No registered athletes found in database.
                                    </td>
                                </tr>
                            ) : (
                                athletes.map((ath) => {
                                    const isSelected = selectedAthletes.includes(ath._id)
                                    return (
                                        <tr
                                            key={ath._id}
                                            className={`hover:bg-foreground/5 transition-colors ${
                                                isSelected ? "bg-brand-500/5" : ""
                                            }`}
                                        >
                                            <td className="py-3 px-2">
                                                <button
                                                    onClick={() => toggleSelectAthlete(ath._id)}
                                                    className="text-foreground/60 hover:text-foreground"
                                                >
                                                    {isSelected ? (
                                                        <CheckSquare className="h-4 w-4 text-brand-500" />
                                                    ) : (
                                                        <Square className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    {ath.profileImage ? (
                                                        <img
                                                            src={ath.profileImage}
                                                            alt={ath.name}
                                                            className="h-9 w-9 rounded-full object-cover border border-border/30"
                                                        />
                                                    ) : (
                                                        <div className="h-9 w-9 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center text-xs">
                                                            {ath.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h4 className="font-bold text-sm text-foreground">{ath.name}</h4>
                                                        <span className="text-[10px] text-foreground/50">{ath.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 font-semibold text-foreground/80">
                                                {ath.sport || "All-Around"}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span
                                                    className={`inline-block font-mono font-black text-xs px-2.5 py-1 rounded-full border ${
                                                        ath.readinessScore >= 80
                                                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                                                            : ath.readinessScore >= 65
                                                            ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                                                            : "bg-red-500/20 text-red-400 border-red-500/40"
                                                    }`}
                                                >
                                                    {ath.readinessScore}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span
                                                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                                        ath.injuryRisk === "Low"
                                                            ? "bg-emerald-500/10 text-emerald-400"
                                                            : ath.injuryRisk === "Medium"
                                                            ? "bg-amber-500/10 text-amber-400"
                                                            : "bg-red-500/10 text-red-400"
                                                    }`}
                                                >
                                                    {ath.injuryRisk}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono font-bold text-brand-400">
                                                {ath.recentVolumeKg ? `${ath.recentVolumeKg} kg` : "0 kg"}
                                            </td>
                                            <td className="py-3 px-4 text-foreground/70">
                                                {ath.latestSession ? (
                                                    <div>
                                                        <strong className="block text-foreground truncate max-w-[140px]">
                                                            {ath.latestSession.name}
                                                        </strong>
                                                        <span className="text-[10px] text-foreground/40">
                                                            {new Date(ath.latestSession.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-foreground/30 italic">No logs yet</span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Past Team Assignments */}
            {assignments.length > 0 && (
                <motion.div variants={itemVariants} className="glass rounded-3xl p-6 border border-border/40 shadow-xl space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-brand-500" />
                        Dispatched Team Assignments ({assignments.length})
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {assignments.map((asg) => (
                            <div key={asg._id} className="p-4 rounded-2xl bg-card/60 border border-border/30 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400">
                                            {asg.workoutRoutine?.category || "Strength"}
                                        </span>
                                        <h4 className="font-bold text-sm text-foreground mt-1">{asg.title}</h4>
                                    </div>
                                    <span className="text-[10px] text-foreground/50 font-mono">{asg.scheduledDate}</span>
                                </div>

                                <div className="text-xs text-foreground/60">
                                    <span>Assigned to {asg.targetAthletes?.length || 0} Athletes:</span>
                                    <div className="flex items-center gap-1 mt-1 overflow-x-auto">
                                        {asg.targetAthletes?.map((ath) => (
                                            <span key={ath._id} className="text-[9px] px-1.5 py-0.5 rounded-md bg-foreground/10 text-foreground/70 truncate">
                                                {ath.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {asg.coachInstructions && (
                                    <p className="text-[11px] text-foreground/70 italic bg-foreground/5 p-2 rounded-xl border border-border/20">
                                        "{asg.coachInstructions}"
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Bulk Assign Modal */}
            <AnimatePresence>
                {isAssignModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass border border-border/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Send className="h-5 w-5 text-brand-500" />
                                    Bulk Assign Routine
                                </h3>
                                <button
                                    onClick={() => setIsAssignModalOpen(false)}
                                    className="p-1 rounded-lg hover:bg-foreground/10 text-foreground/60"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleBulkAssign} className="space-y-4">
                                <div>
                                    <label htmlFor={routineTitleInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                        Routine Title *
                                    </label>
                                    <input
                                        id={routineTitleInputId}
                                        type="text"
                                        required
                                        value={newAssignment.title}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor={scheduledDateInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                            Scheduled Date *
                                        </label>
                                        <input
                                            id={scheduledDateInputId}
                                            type="date"
                                            required
                                            value={newAssignment.scheduledDate}
                                            onChange={(e) => setNewAssignment({ ...newAssignment, scheduledDate: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/40 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={categorySelectId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                            Category
                                        </label>
                                        <select
                                            id={categorySelectId}
                                            value={newAssignment.category}
                                            onChange={(e) => setNewAssignment({ ...newAssignment, category: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-background border border-border/40 text-sm"
                                        >
                                            <option value="Strength">Strength</option>
                                            <option value="Cardio">Cardio</option>
                                            <option value="HIIT">HIIT</option>
                                            <option value="Mobility">Mobility</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor={durationInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                        Target Duration (Minutes)
                                    </label>
                                    <input
                                        id={durationInputId}
                                        type="number"
                                        value={newAssignment.targetDuration}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, targetDuration: Number(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/40 text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor={coachInstructionsInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                        Coach Directives / Notes for Team
                                    </label>
                                    <textarea
                                        id={coachInstructionsInputId}
                                        rows={2}
                                        value={newAssignment.coachInstructions}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, coachInstructions: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm resize-none"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAssignModalOpen(false)}
                                        className="px-4 py-2 rounded-xl border border-border/40 text-sm font-semibold hover:bg-foreground/5"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-lg shadow-brand-500/20"
                                    >
                                        Deploy to {selectedAthletes.length} Athletes
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
export default CoachRoster
