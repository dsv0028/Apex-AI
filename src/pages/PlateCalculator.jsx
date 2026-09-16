import { useState, useId } from "react"
import { motion } from "framer-motion"
import {
    Dumbbell,
    Layers,
    RotateCcw,
    Plus,
    Minus,
    Check,
    Sparkles,
    Scale,
} from "lucide-react"

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
}

const AVAILABLE_PLATES_KG = [
    { weight: 25, color: "bg-red-500 text-white border-red-600", height: "h-36 sm:h-44", label: "25kg", border: "border-red-600" },
    { weight: 20, color: "bg-blue-500 text-white border-blue-600", height: "h-36 sm:h-44", label: "20kg", border: "border-blue-600" },
    { weight: 15, color: "bg-yellow-400 text-black border-yellow-500", height: "h-32 sm:h-40", label: "15kg", border: "border-yellow-500" },
    { weight: 10, color: "bg-emerald-500 text-white border-emerald-600", height: "h-28 sm:h-36", label: "10kg", border: "border-emerald-600" },
    { weight: 5, color: "bg-zinc-200 text-black border-zinc-400 dark:bg-zinc-300", height: "h-24 sm:h-30", label: "5kg", border: "border-zinc-400" },
    { weight: 2.5, color: "bg-red-600 text-white border-red-700", height: "h-20 sm:h-24", label: "2.5kg", border: "border-red-700" },
    { weight: 1.25, color: "bg-blue-600 text-white border-blue-700", height: "h-16 sm:h-20", label: "1.25kg", border: "border-blue-700" },
    { weight: 0.5, color: "bg-zinc-400 text-black border-zinc-500", height: "h-14 sm:h-16", label: "0.5kg", border: "border-zinc-500" },
]

export function PlateCalculator() {
    const targetWeightInputId = useId()
    const barWeightSelectId = useId()
    const collarWeightSelectId = useId()

    const [targetWeight, setTargetWeight] = useState(140)
    const [barWeight, setBarWeight] = useState(20) // 20kg Olympic Bar
    const [collarWeight, setCollarWeight] = useState(0) // Pair of collars

    // Calculate plates needed per side
    const calculatePlates = (target, bar, collars) => {
        let weightPerSide = Math.max(0, (target - bar - collars) / 2)
        const platesPerSide = []

        AVAILABLE_PLATES_KG.forEach((p) => {
            const count = Math.floor(weightPerSide / p.weight)
            if (count > 0) {
                for (let i = 0; i < count; i++) {
                    platesPerSide.push(p)
                }
                weightPerSide -= count * p.weight
                // Round to avoid floating point precision issues
                weightPerSide = Math.round(weightPerSide * 100) / 100
            }
        })

        const totalLoaded = bar + collars + platesPerSide.reduce((sum, p) => sum + p.weight, 0) * 2
        return {
            platesPerSide,
            remainderPerSide: weightPerSide,
            actualTotal: Math.round(totalLoaded * 100) / 100,
        }
    }

    const { platesPerSide, remainderPerSide, actualTotal } = calculatePlates(
        Number(targetWeight) || 0,
        Number(barWeight) || 0,
        Number(collarWeight) || 0
    )

    // Count plate totals grouped for list view
    const plateCounts = {}
    platesPerSide.forEach((p) => {
        plateCounts[p.label] = (plateCounts[p.label] || 0) + 1
    })

    const presets = [60, 80, 100, 120, 140, 160, 180, 200, 220]

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-8 pb-24"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent flex items-center gap-3">
                        <Scale className="h-8 w-8 text-brand-500" />
                        Visual Barbell Plate Calculator & Loader
                    </h1>
                    <p className="text-foreground/60 text-sm mt-1">
                        Calculate exact Olympic bumper plate combinations with color-coded barbell graphics.
                    </p>
                </div>
            </motion.div>

            {/* Input Parameters & Presets */}
            <motion.div variants={itemVariants} className="glass rounded-3xl p-6 sm:p-8 border border-border/40 shadow-xl space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Target Weight Input */}
                    <div>
                        <label htmlFor={targetWeightInputId} className="text-xs font-bold text-foreground/70 block mb-1 uppercase tracking-wider">
                            Target Total Weight (kg)
                        </label>
                        <div className="relative">
                            <input
                                id={targetWeightInputId}
                                type="number"
                                step="0.5"
                                value={targetWeight}
                                onChange={(e) => setTargetWeight(Number(e.target.value))}
                                className="w-full pl-4 pr-12 py-3 rounded-2xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-2xl font-black font-mono"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm text-foreground/40">
                                kg
                            </span>
                        </div>
                    </div>

                    {/* Barbell Weight */}
                    <div>
                        <label htmlFor={barWeightSelectId} className="text-xs font-bold text-foreground/70 block mb-1 uppercase tracking-wider">
                            Barbell Type
                        </label>
                        <select
                            id={barWeightSelectId}
                            value={barWeight}
                            onChange={(e) => setBarWeight(Number(e.target.value))}
                            className="w-full px-4 py-3.5 rounded-2xl bg-background border border-border/40 focus:border-brand-500 focus:outline-none text-sm font-semibold"
                        >
                            <option value="20">Olympic Men's Bar (20 kg)</option>
                            <option value="15">Olympic Women's Bar (15 kg)</option>
                            <option value="10">Technique Bar (10 kg)</option>
                            <option value="0">Zero / Dumbbell Handle (0 kg)</option>
                        </select>
                    </div>

                    {/* Collars */}
                    <div>
                        <label htmlFor={collarWeightSelectId} className="text-xs font-bold text-foreground/70 block mb-1 uppercase tracking-wider">
                            Collars / Clamps
                        </label>
                        <select
                            id={collarWeightSelectId}
                            value={collarWeight}
                            onChange={(e) => setCollarWeight(Number(e.target.value))}
                            className="w-full px-4 py-3.5 rounded-2xl bg-background border border-border/40 focus:border-brand-500 focus:outline-none text-sm font-semibold"
                        >
                            <option value="0">Standard Spring Collars (0 kg)</option>
                            <option value="2.5">Competition Collars (2.5 kg pair)</option>
                            <option value="5">Heavy Steel Collars (5.0 kg pair)</option>
                        </select>
                    </div>
                </div>

                {/* Quick Weight Adjust Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/20">
                    <span className="text-xs font-bold text-foreground/50 mr-2">Quick Presets:</span>
                    {presets.map((preset) => (
                        <button
                            key={preset}
                            onClick={() => setTargetWeight(preset)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                targetWeight === preset
                                    ? "bg-brand-500 text-white shadow-md shadow-brand-500/30"
                                    : "bg-foreground/5 hover:bg-foreground/10 text-foreground/70"
                            }`}
                        >
                            {preset} kg
                        </button>
                    ))}
                    <div className="flex items-center gap-1 ml-auto">
                        <button
                            onClick={() => setTargetWeight(Math.max(barWeight, targetWeight - 2.5))}
                            className="p-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-xs font-bold"
                        >
                            -2.5 kg
                        </button>
                        <button
                            onClick={() => setTargetWeight(targetWeight + 2.5)}
                            className="p-1.5 rounded-lg bg-brand-500/20 text-brand-400 hover:bg-brand-500/30 text-xs font-bold"
                        >
                            +2.5 kg
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Visual Barbell Rendering Canvas */}
            <motion.div
                variants={itemVariants}
                className="glass rounded-3xl p-6 sm:p-10 border border-border/40 shadow-2xl text-center space-y-6 overflow-x-auto"
            >
                <div className="flex items-center justify-between border-b border-border/30 pb-4">
                    <div>
                        <span className="text-xs font-bold uppercase text-brand-500 tracking-wider">Visual Sleeve</span>
                        <h3 className="text-xl font-bold">Barbell Loading Blueprint</h3>
                    </div>
                    <div className="text-right">
                        <span className="text-xs text-foreground/50 block">Per Side Weight</span>
                        <strong className="text-lg font-black text-brand-400">
                            {((targetWeight - barWeight - collarWeight) / 2).toFixed(2)} kg / side
                        </strong>
                    </div>
                </div>

                {/* The Barbell Graphic */}
                <div className="min-w-[650px] py-12 flex items-center justify-center relative">
                    {/* Left Sleeve (Loaded Plates) */}
                    <div className="flex items-center justify-end gap-1 flex-1 pr-2">
                        {platesPerSide.map((p, idx) => (
                            <div
                                key={`left-${idx}`}
                                className={`w-6 sm:w-8 ${p.height} ${p.color} border-2 ${p.border} rounded-md shadow-lg flex items-center justify-center text-[10px] sm:text-xs font-black rotate-180 [writing-mode:vertical-rl] transition-transform hover:scale-105`}
                            >
                                {p.label}
                            </div>
                        ))}
                    </div>

                    {/* Barbell Sleeve Collar Ring */}
                    <div className="w-5 h-20 bg-zinc-400 border-2 border-zinc-600 rounded-sm shadow-md shrink-0" />

                    {/* Main Bar Shaft */}
                    <div className="w-48 sm:w-72 h-6 bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-400 dark:from-zinc-600 dark:via-zinc-400 dark:to-zinc-600 border border-zinc-500 rounded-sm shadow-inner flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-black uppercase text-zinc-800 tracking-widest">
                            {barWeight}KG OLYMPIC BAR
                        </span>
                    </div>

                    {/* Right Sleeve Collar Ring */}
                    <div className="w-5 h-20 bg-zinc-400 border-2 border-zinc-600 rounded-sm shadow-md shrink-0" />

                    {/* Right Sleeve (Loaded Plates mirrored) */}
                    <div className="flex items-center justify-start gap-1 flex-1 pl-2">
                        {platesPerSide.map((p, idx) => (
                            <div
                                key={`right-${idx}`}
                                className={`w-6 sm:w-8 ${p.height} ${p.color} border-2 ${p.border} rounded-md shadow-lg flex items-center justify-center text-[10px] sm:text-xs font-black [writing-mode:vertical-rl] transition-transform hover:scale-105`}
                            >
                                {p.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Remainder Warning */}
                {remainderPerSide > 0 && (
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-400 font-semibold">
                        ⚠️ Note: {remainderPerSide * 2} kg cannot be evenly loaded with standard bumper plates down to 0.5kg. Actual barbell weight loaded: <strong>{actualTotal} kg</strong>.
                    </div>
                )}
            </motion.div>

            {/* Plate Breakdown Checklist */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(plateCounts).map(([label, count]) => (
                    <div key={label} className="glass rounded-2xl p-4 border border-border/40 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center text-xs">
                                {label}
                            </div>
                            <span className="font-bold text-sm text-foreground">{count} × per side</span>
                        </div>
                        <span className="text-xs text-foreground/50 font-semibold">({count * 2} total)</span>
                    </div>
                ))}
            </motion.div>
        </motion.div>
    )
}
export default PlateCalculator
