import { useState, useEffect, useId } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Utensils,
    Flame,
    Droplets,
    Plus,
    Trash2,
    Calendar as CalendarIcon,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Beef,
    Wheat,
    Activity,
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

export function Nutrition() {
    const mealNameInputId = useId()
    const mealTypeSelectId = useId()
    const caloriesInputId = useId()
    const proteinInputId = useId()
    const carbsInputId = useId()
    const fatsInputId = useId()
    const timeInputId = useId()

    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    const token = userInfo?.token

    const [currentDateStr, setCurrentDateStr] = useState(() => new Date().toISOString().split("T")[0])
    const [nutritionData, setNutritionData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isMealModalOpen, setIsMealModalOpen] = useState(false)
    const [newMeal, setNewMeal] = useState({
        name: "",
        mealType: "Breakfast",
        calories: 550,
        proteinG: 40,
        carbsG: 60,
        fatsG: 15,
        time: "08:30 AM",
    })

    const fetchNutrition = async (date) => {
        try {
            setLoading(true)
            const res = await axios.get(`${API_BASE}/nutrition?date=${date}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setNutritionData(res.data)
        } catch (err) {
            console.error("Failed to load nutrition data:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) fetchNutrition(currentDateStr)
    }, [token, currentDateStr])

    const handleWaterUpdate = async (deltaMl) => {
        try {
            const res = await axios.post(
                `${API_BASE}/nutrition/water`,
                { date: currentDateStr, deltaMl },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setNutritionData((prev) => ({ ...prev, waterConsumedMl: res.data.waterConsumedMl }))
        } catch (err) {
            console.error("Failed to update water:", err)
        }
    }

    const handleLogMeal = async (e) => {
        e.preventDefault()
        if (!newMeal.name.trim()) return

        try {
            await axios.post(
                `${API_BASE}/nutrition/meal`,
                { ...newMeal, date: currentDateStr },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setIsMealModalOpen(false)
            fetchNutrition(currentDateStr)
            setNewMeal({
                name: "",
                mealType: "Lunch",
                calories: 600,
                proteinG: 45,
                carbsG: 65,
                fatsG: 18,
                time: "01:00 PM",
            })
        } catch (err) {
            console.error("Failed to log meal:", err)
        }
    }

    const handleDeleteMeal = async (mealId) => {
        try {
            await axios.delete(`${API_BASE}/nutrition/meal/${mealId}?date=${currentDateStr}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            fetchNutrition(currentDateStr)
        } catch (err) {
            console.error("Failed to delete meal:", err)
        }
    }

    const changeDate = (days) => {
        const d = new Date(currentDateStr + "T00:00:00")
        d.setDate(d.getDate() + days)
        setCurrentDateStr(d.toISOString().split("T")[0])
    }

    const totals = nutritionData?.totals || { calories: 0, proteinG: 0, carbsG: 0, fatsG: 0 }
    const targets = nutritionData || { targetCalories: 2600, targetProteinG: 160, targetCarbsG: 280, targetFatsG: 70, targetWaterMl: 3500 }
    const waterConsumed = nutritionData?.waterConsumedMl || 0
    const waterPct = Math.min(100, Math.round((waterConsumed / (targets.targetWaterMl || 3500)) * 100))

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
                        <Utensils className="h-8 w-8 text-brand-500" />
                        Nutrition & Macro Target Tracker
                    </h1>
                    <p className="text-foreground/60 text-sm mt-1">
                        Fuel athletic performance with precision macronutrient tracking and hydration monitoring.
                    </p>
                </div>

                {/* Date Navigator */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 glass px-3 py-1.5 rounded-2xl border border-border/40">
                        <button onClick={() => changeDate(-1)} className="p-1 hover:bg-foreground/5 rounded-lg">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-xs font-bold px-2">
                            {new Date(currentDateStr + "T00:00:00").toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                        <button onClick={() => changeDate(1)} className="p-1 hover:bg-foreground/5 rounded-lg">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    <button
                        onClick={() => setIsMealModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02]"
                    >
                        <Plus className="h-4 w-4" />
                        Log Meal
                    </button>
                </div>
            </motion.div>

            {/* Macro Summary Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Calories Card */}
                <div className="glass rounded-3xl p-6 border border-border/40 shadow-md space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground/60">Calories</span>
                        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                            <Flame className="h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-black">{totals.calories}</h3>
                            <span className="text-xs text-foreground/50">/ {targets.targetCalories} kcal</span>
                        </div>
                        <div className="w-full bg-foreground/10 h-2 rounded-full mt-3 overflow-hidden">
                            <div
                                className="bg-orange-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.round((totals.calories / targets.targetCalories) * 100))}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Protein Card */}
                <div className="glass rounded-3xl p-6 border border-border/40 shadow-md space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground/60">Protein</span>
                        <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
                            <Beef className="h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-black text-brand-400">{totals.proteinG}g</h3>
                            <span className="text-xs text-foreground/50">/ {targets.targetProteinG}g goal</span>
                        </div>
                        <div className="w-full bg-foreground/10 h-2 rounded-full mt-3 overflow-hidden">
                            <div
                                className="bg-brand-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.round((totals.proteinG / targets.targetProteinG) * 100))}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Carbs Card */}
                <div className="glass rounded-3xl p-6 border border-border/40 shadow-md space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground/60">Carbohydrates</span>
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                            <Wheat className="h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-black text-amber-400">{totals.carbsG}g</h3>
                            <span className="text-xs text-foreground/50">/ {targets.targetCarbsG}g goal</span>
                        </div>
                        <div className="w-full bg-foreground/10 h-2 rounded-full mt-3 overflow-hidden">
                            <div
                                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.round((totals.carbsG / targets.targetCarbsG) * 100))}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Fats Card */}
                <div className="glass rounded-3xl p-6 border border-border/40 shadow-md space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground/60">Healthy Fats</span>
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                            <Activity className="h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-black text-emerald-400">{totals.fatsG}g</h3>
                            <span className="text-xs text-foreground/50">/ {targets.targetFatsG}g goal</span>
                        </div>
                        <div className="w-full bg-foreground/10 h-2 rounded-full mt-3 overflow-hidden">
                            <div
                                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.round((totals.fatsG / targets.targetFatsG) * 100))}%` }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Hydration & Meal Stream Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Water Hydration Card */}
                <motion.div variants={itemVariants} className="glass rounded-3xl p-6 border border-border/40 shadow-xl space-y-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Droplets className="h-5 w-5 text-cyan-400" />
                                Hydration Tracker
                            </h3>
                            <span className="text-xs font-black text-cyan-400">{waterPct}%</span>
                        </div>

                        <div className="p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center space-y-3">
                            <div className="relative inline-block">
                                <Droplets className="h-16 w-16 text-cyan-400 mx-auto animate-pulse" />
                            </div>
                            <h4 className="text-3xl font-black text-foreground">
                                {waterConsumed} <span className="text-sm font-semibold text-foreground/50">/ {targets.targetWaterMl} ml</span>
                            </h4>
                            <p className="text-xs text-foreground/60">
                                {waterConsumed >= targets.targetWaterMl
                                    ? "🎉 Hydration goal achieved! Great recovery support."
                                    : `${targets.targetWaterMl - waterConsumed} ml remaining for optimal athletic endurance.`}
                            </p>
                        </div>
                    </div>

                    {/* Quick Add Water Buttons */}
                    <div className="space-y-2">
                        <span className="text-xs font-semibold text-foreground/50 block">Quick Log Water:</span>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => handleWaterUpdate(250)}
                                className="px-3 py-2 rounded-xl bg-foreground/5 hover:bg-cyan-500/20 text-xs font-bold transition-all border border-border/30 hover:border-cyan-500/40"
                            >
                                +250 ml
                            </button>
                            <button
                                onClick={() => handleWaterUpdate(500)}
                                className="px-3 py-2 rounded-xl bg-foreground/5 hover:bg-cyan-500/20 text-xs font-bold transition-all border border-border/30 hover:border-cyan-500/40"
                            >
                                +500 ml
                            </button>
                            <button
                                onClick={() => handleWaterUpdate(750)}
                                className="px-3 py-2 rounded-xl bg-foreground/5 hover:bg-cyan-500/20 text-xs font-bold transition-all border border-border/30 hover:border-cyan-500/40"
                            >
                                +750 ml
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Logged Meals List */}
                <motion.div variants={itemVariants} className="lg:col-span-2 glass rounded-3xl p-6 border border-border/40 shadow-xl space-y-6">
                    <div className="flex items-center justify-between border-b border-border/30 pb-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Utensils className="h-5 w-5 text-brand-500" />
                            Meals Logged Today
                        </h3>
                        <button
                            onClick={() => setIsMealModalOpen(true)}
                            className="p-2 rounded-xl bg-brand-500/10 text-brand-400 hover:bg-brand-500 hover:text-white transition-all text-xs font-semibold flex items-center gap-1"
                        >
                            <Plus className="h-3.5 w-3.5" /> Add Meal
                        </button>
                    </div>

                    <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                        {!nutritionData?.meals || nutritionData.meals.length === 0 ? (
                            <div className="text-center py-16 space-y-3">
                                <Utensils className="h-10 w-10 mx-auto text-foreground/20" />
                                <p className="text-sm text-foreground/50">No meals logged for this date.</p>
                                <button
                                    onClick={() => setIsMealModalOpen(true)}
                                    className="text-xs font-semibold text-brand-500 hover:underline"
                                >
                                    + Log your first meal
                                </button>
                            </div>
                        ) : (
                            nutritionData.meals.map((meal) => (
                                <div
                                    key={meal._id}
                                    className="p-4 rounded-2xl bg-card/60 border border-border/30 flex items-center justify-between gap-4 hover:border-brand-500/30 transition-all"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                                                {meal.mealType}
                                            </span>
                                            <span className="text-xs text-foreground/40">{meal.time}</span>
                                        </div>
                                        <h4 className="font-bold text-sm text-foreground mt-1">{meal.name}</h4>
                                        <div className="flex items-center gap-3 text-xs text-foreground/60 mt-1">
                                            <span><strong>{meal.proteinG}g</strong> Protein</span>
                                            <span><strong>{meal.carbsG}g</strong> Carbs</span>
                                            <span><strong>{meal.fatsG}g</strong> Fats</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <span className="text-sm font-black text-orange-400">{meal.calories}</span>
                                            <span className="text-[10px] text-foreground/40 block">kcal</span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteMeal(meal._id)}
                                            className="p-1.5 rounded-xl text-foreground/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Log Meal Modal */}
            <AnimatePresence>
                {isMealModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass border border-border/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Utensils className="h-5 w-5 text-brand-500" />
                                    Log Meal & Macros
                                </h3>
                                <button
                                    onClick={() => setIsMealModalOpen(false)}
                                    className="p-1 rounded-lg hover:bg-foreground/10 text-foreground/60"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleLogMeal} className="space-y-4">
                                <div>
                                    <label htmlFor={mealNameInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                        Meal Description *
                                    </label>
                                    <input
                                        id={mealNameInputId}
                                        type="text"
                                        required
                                        placeholder="e.g., Grilled Chicken Breast with Brown Rice & Avocado"
                                        value={newMeal.name}
                                        onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor={mealTypeSelectId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                            Meal Category
                                        </label>
                                        <select
                                            id={mealTypeSelectId}
                                            value={newMeal.mealType}
                                            onChange={(e) => setNewMeal({ ...newMeal, mealType: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-background border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                        >
                                            <option value="Breakfast">Breakfast</option>
                                            <option value="Lunch">Lunch</option>
                                            <option value="Dinner">Dinner</option>
                                            <option value="Snack">Snack</option>
                                            <option value="Pre-Workout">Pre-Workout</option>
                                            <option value="Post-Workout">Post-Workout Shake</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor={caloriesInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                            Calories (kcal)
                                        </label>
                                        <input
                                            id={caloriesInputId}
                                            type="number"
                                            value={newMeal.calories}
                                            onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label htmlFor={proteinInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                            Protein (g)
                                        </label>
                                        <input
                                            id={proteinInputId}
                                            type="number"
                                            value={newMeal.proteinG}
                                            onChange={(e) => setNewMeal({ ...newMeal, proteinG: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm text-center"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={carbsInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                            Carbs (g)
                                        </label>
                                        <input
                                            id={carbsInputId}
                                            type="number"
                                            value={newMeal.carbsG}
                                            onChange={(e) => setNewMeal({ ...newMeal, carbsG: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm text-center"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={fatsInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                            Fats (g)
                                        </label>
                                        <input
                                            id={fatsInputId}
                                            type="number"
                                            value={newMeal.fatsG}
                                            onChange={(e) => setNewMeal({ ...newMeal, fatsG: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm text-center"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor={timeInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                        Time
                                    </label>
                                    <input
                                        id={timeInputId}
                                        type="text"
                                        value={newMeal.time}
                                        onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsMealModalOpen(false)}
                                        className="px-4 py-2 rounded-xl border border-border/40 text-sm font-semibold hover:bg-foreground/5"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-lg shadow-brand-500/20"
                                    >
                                        Save Meal
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
export default Nutrition
