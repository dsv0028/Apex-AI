import { useState, useEffect, useId } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    BookOpen,
    Search,
    Filter,
    Plus,
    Dumbbell,
    Layers,
    Info,
    Check,
    ArrowRight,
    Sparkles,
    Trash2,
    X,
    ChevronDown,
    ChevronUp,
} from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const API_BASE = "http://localhost:5001/api"

const MUSCLE_GROUPS = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Full Body"]
const EQUIPMENT_LIST = ["All", "Barbell", "Dumbbell", "Cable", "Bodyweight", "Machine", "Kettlebell"]
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"]

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}
const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
}

export function ExerciseLibrary() {
    const customExerciseNameInputId = useId()
    const customMuscleGroupSelectId = useId()
    const customEquipmentSelectId = useId()
    const customDifficultySelectId = useId()
    const customCategorySelectId = useId()
    const customInstructionsInputId = useId()
    const customTipsInputId = useId()

    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    const token = userInfo?.token
    const navigate = useNavigate()

    const [exercises, setExercises] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedMuscle, setSelectedMuscle] = useState("All")
    const [selectedEquipment, setSelectedEquipment] = useState("All")
    const [selectedDifficulty, setSelectedDifficulty] = useState("All")
    const [expandedCardId, setExpandedCardId] = useState(null)

    // Workout Routine Builder state
    const [routineBuilder, setRoutineBuilder] = useState([])
    const [isBuilderOpen, setIsBuilderOpen] = useState(false)
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false)

    // New Custom Exercise Form
    const [customForm, setCustomForm] = useState({
        name: "",
        muscleGroup: "Chest",
        equipment: "Dumbbell",
        difficulty: "Intermediate",
        category: "Compound",
        instructions: "",
        tips: "",
    })

    const fetchExercises = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (selectedMuscle !== "All") params.append("muscle", selectedMuscle)
            if (selectedEquipment !== "All") params.append("equipment", selectedEquipment)
            if (selectedDifficulty !== "All") params.append("difficulty", selectedDifficulty)
            if (searchQuery.trim()) params.append("search", searchQuery.trim())

            const res = await axios.get(`${API_BASE}/exercises?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setExercises(res.data)
        } catch (err) {
            console.error("Failed to load exercises:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) fetchExercises()
    }, [token, selectedMuscle, selectedEquipment, selectedDifficulty, searchQuery])

    const handleAddToRoutine = (exercise) => {
        if (!routineBuilder.some((item) => item._id === exercise._id)) {
            setRoutineBuilder([...routineBuilder, { ...exercise, sets: 3, reps: "8-12" }])
            setIsBuilderOpen(true)
        }
    }

    const handleRemoveFromRoutine = (exerciseId) => {
        setRoutineBuilder(routineBuilder.filter((item) => item._id !== exerciseId))
    }

    const handleCreateCustomExercise = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                ...customForm,
                instructions: customForm.instructions.split("\n").filter((l) => l.trim()),
                tips: customForm.tips.split("\n").filter((l) => l.trim()),
            }
            await axios.post(`${API_BASE}/exercises`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setIsCustomModalOpen(false)
            fetchExercises()
            setCustomForm({
                name: "",
                muscleGroup: "Chest",
                equipment: "Dumbbell",
                difficulty: "Intermediate",
                category: "Compound",
                instructions: "",
                tips: "",
            })
        } catch (err) {
            console.error("Failed to create custom exercise:", err)
        }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-32"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent flex items-center gap-3">
                        <BookOpen className="h-8 w-8 text-brand-500" />
                        Exercise Library & Workout Builder
                    </h1>
                    <p className="text-foreground/60 text-sm mt-1">
                        Explore verified movements, master execution technique, and assemble custom training splits.
                    </p>
                </div>

                <button
                    onClick={() => setIsCustomModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02]"
                >
                    <Plus className="h-4 w-4" />
                    Create Custom Movement
                </button>
            </motion.div>

            {/* Filter Bar */}
            <motion.div variants={itemVariants} className="glass rounded-3xl p-6 border border-border/40 shadow-lg space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    {/* Search input */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                        <input
                            type="text"
                            placeholder="Search exercise name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                        />
                    </div>

                    {/* Muscle group chips */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full py-1">
                        {MUSCLE_GROUPS.map((muscle) => (
                            <button
                                key={muscle}
                                onClick={() => setSelectedMuscle(muscle)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                    selectedMuscle === muscle
                                        ? "bg-brand-500 text-white shadow-md shadow-brand-500/30"
                                        : "bg-foreground/5 hover:bg-foreground/10 text-foreground/70"
                                }`}
                            >
                                {muscle}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Secondary Filters (Equipment & Difficulty) */}
                <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border/20 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="text-foreground/50 font-semibold">Equipment:</span>
                        <div className="flex items-center gap-1.5">
                            {EQUIPMENT_LIST.map((eq) => (
                                <button
                                    key={eq}
                                    onClick={() => setSelectedEquipment(eq)}
                                    className={`px-2.5 py-1 rounded-lg transition-all ${
                                        selectedEquipment === eq
                                            ? "bg-brand-500/20 text-brand-400 font-bold border border-brand-500/40"
                                            : "hover:bg-foreground/5 text-foreground/60"
                                    }`}
                                >
                                    {eq}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-foreground/50 font-semibold">Difficulty:</span>
                        <div className="flex items-center gap-1.5">
                            {DIFFICULTIES.map((diff) => (
                                <button
                                    key={diff}
                                    onClick={() => setSelectedDifficulty(diff)}
                                    className={`px-2.5 py-1 rounded-lg transition-all ${
                                        selectedDifficulty === diff
                                            ? "bg-brand-500/20 text-brand-400 font-bold border border-brand-500/40"
                                            : "hover:bg-foreground/5 text-foreground/60"
                                    }`}
                                >
                                    {diff}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Exercise Cards Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exercises.length === 0 ? (
                    <div className="col-span-full glass rounded-3xl p-12 text-center border border-border/40 space-y-3">
                        <Dumbbell className="h-12 w-12 mx-auto text-foreground/20" />
                        <h3 className="text-lg font-bold">No exercises matched your filters</h3>
                        <p className="text-sm text-foreground/50">
                            Try resetting your search query or muscle group filters.
                        </p>
                    </div>
                ) : (
                    exercises.map((ex) => {
                        const isExpanded = expandedCardId === ex._id
                        const isInRoutine = routineBuilder.some((item) => item._id === ex._id)

                        return (
                            <motion.div
                                key={ex._id}
                                layout
                                className="glass rounded-3xl p-5 border border-border/40 shadow-md space-y-4 hover:border-brand-500/30 transition-all flex flex-col justify-between"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                                                    {ex.muscleGroup}
                                                </span>
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/60">
                                                    {ex.equipment}
                                                </span>
                                                {ex.isCustom && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                                                        Custom
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-base text-foreground">{ex.name}</h3>
                                        </div>

                                        <span
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                ex.difficulty === "Beginner"
                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                    : ex.difficulty === "Intermediate"
                                                    ? "bg-orange-500/10 text-orange-400"
                                                    : "bg-red-500/10 text-red-400"
                                            }`}
                                        >
                                            {ex.difficulty}
                                        </span>
                                    </div>

                                    {/* Secondary Muscles */}
                                    {ex.secondaryMuscles && ex.secondaryMuscles.length > 0 && (
                                        <div className="flex items-center gap-1 text-[11px] text-foreground/50">
                                            <span>Assisting:</span>
                                            <span className="text-foreground/70 font-medium">
                                                {ex.secondaryMuscles.join(", ")}
                                            </span>
                                        </div>
                                    )}

                                    {/* Instructions Dropdown */}
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-3 pt-3 border-t border-border/20 text-xs"
                                        >
                                            {ex.instructions && ex.instructions.length > 0 && (
                                                <div>
                                                    <strong className="text-foreground/80 block mb-1">How to Perform:</strong>
                                                    <ol className="list-decimal list-inside space-y-1 text-foreground/60 leading-relaxed">
                                                        {ex.instructions.map((step, sIdx) => (
                                                            <li key={sIdx}>{step}</li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            )}

                                            {ex.tips && ex.tips.length > 0 && (
                                                <div className="p-2.5 rounded-xl bg-brand-500/5 border border-brand-500/20 text-foreground/70 space-y-1">
                                                    <strong className="text-brand-400 flex items-center gap-1 text-[11px]">
                                                        <Sparkles className="h-3 w-3" /> Pro Coaching Tip:
                                                    </strong>
                                                    <ul className="list-disc list-inside text-[11px] text-foreground/60 space-y-0.5">
                                                        {ex.tips.map((t, tIdx) => (
                                                            <li key={tIdx}>{t}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </div>

                                {/* Card Actions */}
                                <div className="flex items-center justify-between pt-3 border-t border-border/20 mt-2">
                                    <button
                                        onClick={() => setExpandedCardId(isExpanded ? null : ex._id)}
                                        className="text-xs font-semibold text-foreground/50 hover:text-foreground flex items-center gap-1 transition-colors"
                                    >
                                        {isExpanded ? (
                                            <>
                                                Hide Guide <ChevronUp className="h-3.5 w-3.5" />
                                            </>
                                        ) : (
                                            <>
                                                Technique Guide <ChevronDown className="h-3.5 w-3.5" />
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => handleAddToRoutine(ex)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                                            isInRoutine
                                                ? "bg-emerald-500 text-white"
                                                : "bg-brand-500/10 text-brand-400 hover:bg-brand-500 hover:text-white"
                                        }`}
                                    >
                                        {isInRoutine ? (
                                            <>
                                                <Check className="h-3.5 w-3.5" /> In Routine
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-3.5 w-3.5" /> Add to Routine
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )
                    })
                )}
            </motion.div>

            {/* Floating Routine Builder Drawer */}
            <AnimatePresence>
                {routineBuilder.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-[92%] glass border border-brand-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
                                <Layers className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-foreground">
                                    Custom Workout Split ({routineBuilder.length} exercises)
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5 overflow-x-auto max-w-md">
                                    {routineBuilder.map((item) => (
                                        <span
                                            key={item._id}
                                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-foreground/10 text-foreground/70 flex items-center gap-1 whitespace-nowrap"
                                        >
                                            {item.name}
                                            <button
                                                onClick={() => handleRemoveFromRoutine(item._id)}
                                                className="hover:text-red-400"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                            <button
                                onClick={() => setRoutineBuilder([])}
                                className="px-3 py-2 rounded-xl text-xs font-semibold text-foreground/50 hover:text-red-400"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => navigate("/dashboard/logs")}
                                className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-lg shadow-brand-500/30 flex items-center gap-2"
                            >
                                Proceed to Log Session
                                <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Custom Exercise Modal */}
            <AnimatePresence>
                {isCustomModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass border border-border/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Dumbbell className="h-5 w-5 text-brand-500" />
                                    Create Custom Exercise
                                </h3>
                                <button
                                    onClick={() => setIsCustomModalOpen(false)}
                                    className="p-1 rounded-lg hover:bg-foreground/10 text-foreground/60"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateCustomExercise} className="space-y-4">
                                <div>
                                    <label htmlFor={customExerciseNameInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                        Exercise Name *
                                    </label>
                                    <input
                                        id={customExerciseNameInputId}
                                        type="text"
                                        required
                                        placeholder="e.g., Incline Hammer Strength Chest Press"
                                        value={customForm.name}
                                        onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor={customMuscleGroupSelectId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                            Primary Muscle *
                                        </label>
                                        <select
                                            id={customMuscleGroupSelectId}
                                            value={customForm.muscleGroup}
                                            onChange={(e) => setCustomForm({ ...customForm, muscleGroup: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-background border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                        >
                                            <option value="Chest">Chest</option>
                                            <option value="Back">Back</option>
                                            <option value="Legs">Legs</option>
                                            <option value="Shoulders">Shoulders</option>
                                            <option value="Arms">Arms</option>
                                            <option value="Core">Core</option>
                                            <option value="Full Body">Full Body</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor={customEquipmentSelectId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                            Equipment
                                        </label>
                                        <select
                                            id={customEquipmentSelectId}
                                            value={customForm.equipment}
                                            onChange={(e) => setCustomForm({ ...customForm, equipment: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-background border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                        >
                                            <option value="Barbell">Barbell</option>
                                            <option value="Dumbbell">Dumbbell</option>
                                            <option value="Machine">Machine</option>
                                            <option value="Cable">Cable</option>
                                            <option value="Bodyweight">Bodyweight</option>
                                            <option value="Kettlebell">Kettlebell</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor={customDifficultySelectId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                            Difficulty
                                        </label>
                                        <select
                                            id={customDifficultySelectId}
                                            value={customForm.difficulty}
                                            onChange={(e) => setCustomForm({ ...customForm, difficulty: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-background border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor={customCategorySelectId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                            Category
                                        </label>
                                        <select
                                            id={customCategorySelectId}
                                            value={customForm.category}
                                            onChange={(e) => setCustomForm({ ...customForm, category: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-background border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                        >
                                            <option value="Compound">Compound</option>
                                            <option value="Isolation">Isolation</option>
                                            <option value="Olympic">Olympic</option>
                                            <option value="Plyometric">Plyometric</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor={customInstructionsInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                        Execution Instructions (1 per line)
                                    </label>
                                    <textarea
                                        id={customInstructionsInputId}
                                        rows={2}
                                        placeholder="Set handles to mid chest level&#10;Press explosively without locking elbows"
                                        value={customForm.instructions}
                                        onChange={(e) => setCustomForm({ ...customForm, instructions: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm resize-none"
                                    />
                                </div>

                                <div>
                                    <label htmlFor={customTipsInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                        Pro Tips
                                    </label>
                                    <input
                                        id={customTipsInputId}
                                        type="text"
                                        placeholder="e.g., Maintain scapular retraction throughout"
                                        value={customForm.tips}
                                        onChange={(e) => setCustomForm({ ...customForm, tips: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsCustomModalOpen(false)}
                                        className="px-4 py-2 rounded-xl border border-border/40 text-sm font-semibold hover:bg-foreground/5"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-lg shadow-brand-500/20"
                                    >
                                        Add to Library
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
export default ExerciseLibrary
