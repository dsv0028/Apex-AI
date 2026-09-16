import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    HeartPulse,
    Moon,
    Flame,
    Zap,
    Activity,
    CheckCircle2,
    Sparkles,
    Calendar,
    Smile,
    Frown,
    Meh,
    AlertTriangle,
} from "lucide-react"
import axios from "axios"

const API_BASE = "http://localhost:5001/api"

const BODY_PARTS = [
    { id: "Neck", name: "Neck & Traps" },
    { id: "Shoulders", name: "Shoulders" },
    { id: "Chest", name: "Chest / Pecs" },
    { id: "UpperBack", name: "Upper Back & Lats" },
    { id: "LowerBack", name: "Lower Back" },
    { id: "Arms", name: "Biceps & Triceps" },
    { id: "Core", name: "Abs & Core" },
    { id: "Quads", name: "Quads / Thighs" },
    { id: "Hamstrings", name: "Hamstrings & Glutes" },
    { id: "Calves", name: "Calves & Ankles" },
]

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
}

export function Recovery() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    const token = userInfo?.token

    const [todayDateStr] = useState(() => new Date().toISOString().split("T")[0])
    const [sleepHours, setSleepHours] = useState(7.5)
    const [sleepQuality, setSleepQuality] = useState(4)
    const [stressLevel, setStressLevel] = useState(2)
    const [energyLevel, setEnergyLevel] = useState(4)
    const [sorenessMap, setSorenessMap] = useState({}) // { 'Quads': 2, 'LowerBack': 3 }
    const [notes, setNotes] = useState("")
    const [calculatedReadiness, setCalculatedReadiness] = useState(85)
    const [history, setHistory] = useState([])
    const [isSaved, setIsSaved] = useState(false)
    const [loading, setLoading] = useState(true)

    // Compute live readiness
    useEffect(() => {
        let score = 80
        if (sleepHours >= 8) score += 8
        else if (sleepHours >= 7) score += 4
        else if (sleepHours < 6) score -= 15
        else if (sleepHours < 7) score -= 8

        score += (sleepQuality - 3) * 4
        score += (3 - stressLevel) * 4
        score += (energyLevel - 3) * 4

        const totalSoreness = Object.values(sorenessMap).reduce((sum, lvl) => sum + (lvl || 0), 0)
        score -= Math.round(totalSoreness * 2.2)

        setCalculatedReadiness(Math.max(25, Math.min(99, Math.round(score))))
    }, [sleepHours, sleepQuality, stressLevel, energyLevel, sorenessMap])

    const fetchRecoveryData = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${API_BASE}/recovery?date=${todayDateStr}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (res.data.today) {
                const t = res.data.today
                setSleepHours(t.sleepHours)
                setSleepQuality(t.sleepQuality)
                setStressLevel(t.stressLevel)
                setEnergyLevel(t.energyLevel)
                setNotes(t.notes || "")
                const sMap = {}
                ;(t.soreness || []).forEach((s) => {
                    sMap[s.bodyPart] = s.level
                })
                setSorenessMap(sMap)
                setCalculatedReadiness(t.calculatedReadiness)
                setIsSaved(true)
            }
            setHistory(res.data.history || [])
        } catch (err) {
            console.error("Failed to load recovery logs:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) fetchRecoveryData()
    }, [token])

    const handleSorenessChange = (partId, level) => {
        setSorenessMap((prev) => ({
            ...prev,
            [partId]: level,
        }))
        setIsSaved(false)
    }

    const handleSaveRecovery = async (e) => {
        e.preventDefault()
        try {
            const sorenessArr = Object.entries(sorenessMap).map(([bodyPart, level]) => ({
                bodyPart,
                level,
            }))

            await axios.post(
                `${API_BASE}/recovery`,
                {
                    date: todayDateStr,
                    sleepHours,
                    sleepQuality,
                    stressLevel,
                    energyLevel,
                    soreness: sorenessArr,
                    notes,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            setIsSaved(true)
            fetchRecoveryData()
        } catch (err) {
            console.error("Failed to save recovery log:", err)
        }
    }

    const readinessColor =
        calculatedReadiness >= 80
            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
            : calculatedReadiness >= 65
            ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
            : "text-red-400 bg-red-500/10 border-red-500/30"

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
                        <HeartPulse className="h-8 w-8 text-brand-500" />
                        Daily Recovery & Muscle Soreness Check-in
                    </h1>
                    <p className="text-foreground/60 text-sm mt-1">
                        Track central nervous system recovery, sleep duration, and localized muscle fatigue.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground/50 flex items-center gap-1 glass px-3 py-1.5 rounded-xl border border-border/30">
                        <Calendar className="h-3.5 w-3.5 text-brand-500" />
                        Today: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                </div>
            </motion.div>

            {/* Main Score & Readiness Gauge */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Check-in Form Column */}
                <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">
                    <form onSubmit={handleSaveRecovery} className="glass rounded-3xl p-6 sm:p-8 border border-border/40 shadow-xl space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border/30 pb-4">
                            <Moon className="h-5 w-5 text-brand-500" />
                            Morning Biometric Check-in
                        </h2>

                        {/* Sleep Hours Slider */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-semibold text-foreground/80">Sleep Duration:</span>
                                <span className="font-mono font-black text-brand-400 text-base">{sleepHours} Hours</span>
                            </div>
                            <input
                                type="range"
                                min="4"
                                max="12"
                                step="0.5"
                                value={sleepHours}
                                onChange={(e) => {
                                    setSleepHours(Number(e.target.value))
                                    setIsSaved(false)
                                }}
                                className="w-full h-2 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-brand-500"
                            />
                            <div className="flex justify-between text-[10px] text-foreground/40 font-mono">
                                <span>4h (Severe Deficit)</span>
                                <span>8h (Optimal)</span>
                                <span>12h+</span>
                            </div>
                        </div>

                        {/* Sliders Grid: Sleep Quality, Stress, Energy */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            {/* Sleep Quality */}
                            <div className="p-4 rounded-2xl bg-foreground/5 border border-border/20 space-y-2 text-center">
                                <span className="text-xs font-bold text-foreground/70 block">Sleep Quality</span>
                                <div className="flex items-center justify-center gap-1 text-lg">
                                    {[1, 2, 3, 4, 5].map((val) => (
                                        <button
                                            type="button"
                                            key={val}
                                            onClick={() => {
                                                setSleepQuality(val)
                                                setIsSaved(false)
                                            }}
                                            className={`p-1 rounded-lg transition-transform ${
                                                sleepQuality >= val ? "text-amber-400 scale-110" : "text-foreground/20"
                                            }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <span className="text-[10px] text-foreground/50 font-semibold block">
                                    {sleepQuality === 5 ? "Restorative" : sleepQuality >= 3 ? "Decent" : "Restless"}
                                </span>
                            </div>

                            {/* Stress Level */}
                            <div className="p-4 rounded-2xl bg-foreground/5 border border-border/20 space-y-2 text-center">
                                <span className="text-xs font-bold text-foreground/70 block">Stress Level</span>
                                <div className="flex items-center justify-center gap-1.5">
                                    {[1, 2, 3, 4, 5].map((val) => (
                                        <button
                                            type="button"
                                            key={val}
                                            onClick={() => {
                                                setStressLevel(val)
                                                setIsSaved(false)
                                            }}
                                            className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${
                                                stressLevel === val
                                                    ? "bg-brand-500 text-white shadow-md shadow-brand-500/30"
                                                    : "bg-card hover:bg-foreground/10 text-foreground/60"
                                            }`}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                                <span className="text-[10px] text-foreground/50 font-semibold block">
                                    {stressLevel <= 2 ? "Low Stress" : stressLevel === 3 ? "Moderate" : "High Stress"}
                                </span>
                            </div>

                            {/* Energy Level */}
                            <div className="p-4 rounded-2xl bg-foreground/5 border border-border/20 space-y-2 text-center">
                                <span className="text-xs font-bold text-foreground/70 block">Energy / Drive</span>
                                <div className="flex items-center justify-center gap-1.5">
                                    {[1, 2, 3, 4, 5].map((val) => (
                                        <button
                                            type="button"
                                            key={val}
                                            onClick={() => {
                                                setEnergyLevel(val)
                                                setIsSaved(false)
                                            }}
                                            className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${
                                                energyLevel === val
                                                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                                                    : "bg-card hover:bg-foreground/10 text-foreground/60"
                                            }`}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                                <span className="text-[10px] text-foreground/50 font-semibold block">
                                    {energyLevel >= 4 ? "Energized ⚡" : energyLevel === 3 ? "Normal" : "Drained"}
                                </span>
                            </div>
                        </div>

                        {/* Muscle Soreness Heatmap Matrix */}
                        <div className="space-y-3 pt-4 border-t border-border/20">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-foreground flex items-center gap-2">
                                    <Flame className="h-4 w-4 text-orange-400" />
                                    Muscle Soreness Heatmap
                                </span>
                                <span className="text-[11px] text-foreground/50">0: None — 5: Extreme</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {BODY_PARTS.map((part) => {
                                    const lvl = sorenessMap[part.id] || 0
                                    return (
                                        <div
                                            key={part.id}
                                            className="p-3 rounded-2xl bg-card/60 border border-border/30 flex items-center justify-between"
                                        >
                                            <span className="text-xs font-semibold text-foreground/80">{part.name}</span>
                                            <div className="flex items-center gap-1">
                                                {[0, 1, 2, 3, 4, 5].map((n) => (
                                                    <button
                                                        type="button"
                                                        key={n}
                                                        onClick={() => handleSorenessChange(part.id, n)}
                                                        className={`h-6 w-6 rounded-md text-[10px] font-bold transition-all ${
                                                            lvl === n
                                                                ? n === 0
                                                                    ? "bg-foreground/10 text-foreground"
                                                                    : n <= 2
                                                                    ? "bg-amber-500 text-black font-black"
                                                                    : "bg-red-500 text-white font-black"
                                                                : "text-foreground/40 hover:bg-foreground/5"
                                                        }`}
                                                    >
                                                        {n}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            {isSaved ? "Check-in Saved for Today" : "Save Today's Recovery Log"}
                        </button>
                    </form>
                </motion.div>

                {/* Live Readiness Gauge Column */}
                <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
                    <div className="glass rounded-3xl p-6 sm:p-8 border border-border/40 shadow-xl space-y-6 text-center">
                        <span className="text-xs font-bold uppercase text-brand-500 tracking-wider">
                            Real-Time Calculated Score
                        </span>

                        <div className={`p-8 rounded-3xl border ${readinessColor} space-y-2`}>
                            <h3 className="text-6xl font-black font-mono">{calculatedReadiness}</h3>
                            <span className="text-xs font-black uppercase tracking-widest block">
                                {calculatedReadiness >= 80
                                    ? "Optimal Readiness 🚀"
                                    : calculatedReadiness >= 65
                                    ? "Moderate Readiness ⚡"
                                    : "Deload Recommended ⚠️"}
                            </span>
                        </div>

                        <div className="text-left space-y-3 p-4 rounded-2xl bg-foreground/5 border border-border/20 text-xs">
                            <strong className="text-brand-400 block font-bold flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5" /> Apex AI Training Guidance:
                            </strong>
                            <p className="text-foreground/70 leading-relaxed">
                                {calculatedReadiness >= 80
                                    ? "Your nervous system and muscles are fully recovered. Great day for heavy compound lifts, high-intensity intervals, or testing 1-Rep Max PRs."
                                    : calculatedReadiness >= 65
                                    ? "Decent recovery state. Proceed with scheduled training volume, but consider avoiding failure on auxiliary sets."
                                    : "High accumulated fatigue or sleep deficit detected. Recommend light active recovery, mobility drills, or a planned rest day."}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
export default Recovery
