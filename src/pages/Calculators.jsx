import { useState, useId } from "react"
import { motion } from "framer-motion"
import {
    Calculator,
    Activity,
    HeartPulse,
    Gauge,
    Trophy,
    TrendingUp,
    Sparkles,
    Flame,
    Zap,
} from "lucide-react"

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
}

export function Calculators() {
    const bwInputId = useId()
    const totalWeightInputId = useId()
    const ageInputId = useId()
    const rhrInputId = useId()
    const benchmarkDistanceSelectId = useId()
    const benchmarkMinsInputId = useId()
    const benchmarkSecsInputId = useId()
    const oneRepMaxInputId = useId()

    const [activeTab, setActiveTab] = useState("Wilks") // 'Wilks' | 'HeartRate' | 'Pace' | '1RM'

    // 1. Wilks & DOTS State
    const [bodyweight, setBodyweight] = useState(80)
    const [totalLifted, setTotalLifted] = useState(500) // kg
    const [gender, setGender] = useState("male")

    // Wilks formula calculation
    const calculateWilks = (bw, total, gen) => {
        if (bw <= 0 || total <= 0) return { wilks: 0, dots: 0 }
        let a, b, c, d, e, f
        if (gen === "male") {
            a = -216.0475144
            b = 16.2606339
            c = -0.002388645
            d = -0.00113732
            e = 7.01863e-6
            f = -1.291e-8
        } else {
            a = 594.31747775582
            b = -27.23842536447
            c = 0.82112226871
            d = -0.00930733913
            e = 4.731582e-5
            f = -9.054e-8
        }
        const coeff = 500 / (a + b * bw + c * Math.pow(bw, 2) + d * Math.pow(bw, 3) + e * Math.pow(bw, 4) + f * Math.pow(bw, 5))
        const wilks = Math.round(total * coeff * 100) / 100

        // DOTS formula
        let da = -307.272, db = 24.3724, dc = -0.191875, dd = 0.0007391293, de = -0.000001093
        if (gen === "female") {
            da = -57.96288; db = 13.617503; dc = -0.11266554; dd = 0.0005158568; de = -0.0000010706
        }
        const dotsCoeff = 500 / (da + db * bw + dc * Math.pow(bw, 2) + dd * Math.pow(bw, 3) + de * Math.pow(bw, 4))
        const dots = Math.round(total * dotsCoeff * 100) / 100

        return { wilks, dots }
    }

    const { wilks, dots } = calculateWilks(bodyweight, totalLifted, gender)

    // 2. Heart Rate Zones (Karvonen) State
    const [age, setAge] = useState(25)
    const [restingHR, setRestingHR] = useState(60)

    const maxHR = 220 - age
    const hrr = maxHR - restingHR // Heart Rate Reserve

    const hrZones = [
        { zone: "Zone 1", label: "Active Recovery", minPct: 50, maxPct: 60, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
        { zone: "Zone 2", label: "Aerobic Base / Fat Burn", minPct: 60, maxPct: 70, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
        { zone: "Zone 3", label: "Tempo / Aerobic Power", minPct: 70, maxPct: 80, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
        { zone: "Zone 4", label: "Threshold / Lactate", minPct: 80, maxPct: 90, color: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
        { zone: "Zone 5", label: "VO2 Max / Neuromuscular", minPct: 90, maxPct: 100, color: "text-red-400 bg-red-500/10 border-red-500/30" },
    ].map((z) => {
        const minBpm = Math.round(restingHR + hrr * (z.minPct / 100))
        const maxBpm = Math.round(restingHR + hrr * (z.maxPct / 100))
        return { ...z, minBpm, maxBpm }
    })

    // 3. Race Pace & Predictor State
    const [benchmarkDistanceKm, setBenchmarkDistanceKm] = useState(5)
    const [benchmarkMins, setBenchmarkMins] = useState(22)
    const [benchmarkSecs, setBenchmarkSecs] = useState(30)

    const totalSeconds = benchmarkMins * 60 + benchmarkSecs
    const pacePerKmSec = benchmarkDistanceKm > 0 ? totalSeconds / benchmarkDistanceKm : 0
    const paceMins = Math.floor(pacePerKmSec / 60)
    const paceSecs = Math.round(pacePerKmSec % 60)

    // Riegel's formula for race predictions: T2 = T1 * (D2/D1)^1.06
    const predictRaceTime = (targetDistKm) => {
        const t2Sec = totalSeconds * Math.pow(targetDistKm / benchmarkDistanceKm, 1.06)
        const h = Math.floor(t2Sec / 3600)
        const m = Math.floor((t2Sec % 3600) / 60)
        const s = Math.round(t2Sec % 60)
        return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`
    }

    // 4. 1RM Percentages State
    const [oneRepMax, setOneRepMax] = useState(140)
    const percentages = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50].map((pct) => ({
        percent: pct,
        weightKg: Math.round((oneRepMax * (pct / 100)) * 2) / 2, // Round to nearest 0.5kg
        repsEst: pct === 100 ? 1 : pct >= 95 ? 2 : pct >= 90 ? 3 : pct >= 85 ? 5 : pct >= 80 ? 8 : pct >= 75 ? 10 : 12,
    }))

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
                        <Calculator className="h-8 w-8 text-brand-500" />
                        Sports Science & Performance Calculators
                    </h1>
                    <p className="text-foreground/60 text-sm mt-1">
                        Precision athletic calculations for powerlifting coefficients, HR training zones, and endurance pacing.
                    </p>
                </div>
            </motion.div>

            {/* Navigation Tabs */}
            <motion.div variants={itemVariants} className="flex items-center gap-2 p-1.5 glass rounded-2xl border border-border/40 max-w-2xl mx-auto overflow-x-auto">
                {[
                    { id: "Wilks", label: "Wilks & DOTS (Strength)", icon: Trophy },
                    { id: "HeartRate", label: "Karvonen HR Zones", icon: HeartPulse },
                    { id: "Pace", label: "Race Pace & Splits", icon: Activity },
                    { id: "1RM", label: "1RM Percentage Chart", icon: Gauge },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 whitespace-nowrap transition-all ${
                            activeTab === tab.id
                                ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                                : "text-foreground/60 hover:text-foreground"
                        }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </motion.div>

            {/* Tab 1: Wilks & DOTS */}
            {activeTab === "Wilks" && (
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-5 glass rounded-3xl p-6 sm:p-8 border border-border/40 shadow-xl space-y-5">
                        <h3 className="font-bold text-lg border-b border-border/30 pb-3">Strength Parameters</h3>

                        <div>
                            <span className="text-xs font-bold text-foreground/70 block mb-1">Gender</span>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setGender("male")}
                                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                                        gender === "male"
                                            ? "bg-brand-500 text-white border-brand-500"
                                            : "border-border/30 text-foreground/60 hover:bg-foreground/5"
                                    }`}
                                >
                                    Male
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setGender("female")}
                                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                                        gender === "female"
                                            ? "bg-brand-500 text-white border-brand-500"
                                            : "border-border/30 text-foreground/60 hover:bg-foreground/5"
                                    }`}
                                >
                                    Female
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor={bwInputId} className="text-xs font-bold text-foreground/70 block mb-1">
                                Bodyweight (kg)
                            </label>
                            <input
                                id={bwInputId}
                                type="number"
                                step="0.1"
                                value={bodyweight}
                                onChange={(e) => setBodyweight(Number(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm font-bold font-mono"
                            />
                        </div>

                        <div>
                            <label htmlFor={totalWeightInputId} className="text-xs font-bold text-foreground/70 block mb-1">
                                Powerlifting Total (Squat + Bench + Deadlift kg)
                            </label>
                            <input
                                id={totalWeightInputId}
                                type="number"
                                step="2.5"
                                value={totalLifted}
                                onChange={(e) => setTotalLifted(Number(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm font-bold font-mono"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-7 glass rounded-3xl p-6 sm:p-8 border border-border/40 shadow-xl space-y-6 flex flex-col justify-between">
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg">Official Strength Coefficients</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Wilks Score</span>
                                    <h4 className="text-4xl font-black font-mono text-foreground">{wilks}</h4>
                                    <span className="text-[10px] text-foreground/50 block">Points</span>
                                </div>

                                <div className="p-6 rounded-3xl bg-brand-500/10 border border-brand-500/30 text-center space-y-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-brand-400">DOTS Score</span>
                                    <h4 className="text-4xl font-black font-mono text-foreground">{dots}</h4>
                                    <span className="text-[10px] text-foreground/50 block">Points</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-foreground/5 border border-border/20 space-y-2 text-xs text-foreground/70">
                            <strong className="text-brand-400 block font-bold">What this means:</strong>
                            <p className="leading-relaxed">
                                Wilks and DOTS normalize powerlifting strength relative to body mass. A score above <strong>350</strong> indicates strong intermediate strength, while <strong>450+</strong> represents elite competitive powerlifter level.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Tab 2: Heart Rate Zones */}
            {activeTab === "HeartRate" && (
                <motion.div variants={itemVariants} className="space-y-6">
                    <div className="glass rounded-3xl p-6 sm:p-8 border border-border/40 shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor={ageInputId} className="text-xs font-bold text-foreground/70 block mb-1">
                                Age (Years)
                            </label>
                            <input
                                id={ageInputId}
                                type="number"
                                value={age}
                                onChange={(e) => setAge(Number(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-base font-bold font-mono"
                            />
                        </div>
                        <div>
                            <label htmlFor={rhrInputId} className="text-xs font-bold text-foreground/70 block mb-1">
                                Resting Heart Rate (bpm)
                            </label>
                            <input
                                id={rhrInputId}
                                type="number"
                                value={restingHR}
                                onChange={(e) => setRestingHR(Number(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-base font-bold font-mono"
                            />
                        </div>
                        <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-center flex flex-col justify-center">
                            <span className="text-[10px] font-bold uppercase text-brand-400 tracking-wider">Estimated Max HR</span>
                            <h4 className="text-2xl font-black font-mono text-foreground">{maxHR} bpm</h4>
                        </div>
                    </div>

                    {/* HR Zones Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {hrZones.map((z) => (
                            <div
                                key={z.zone}
                                className={`p-5 rounded-3xl border shadow-md space-y-3 ${z.color} flex flex-col justify-between`}
                            >
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest block opacity-70">
                                        {z.zone}
                                    </span>
                                    <h4 className="font-bold text-sm text-foreground mt-0.5">{z.label}</h4>
                                </div>

                                <div className="py-2">
                                    <h5 className="text-2xl font-black font-mono text-foreground">
                                        {z.minBpm} - {z.maxBpm}
                                    </h5>
                                    <span className="text-[10px] text-foreground/50 block font-semibold">bpm ({z.minPct}%–{z.maxPct}%)</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Tab 3: Race Pace & Splits */}
            {activeTab === "Pace" && (
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-5 glass rounded-3xl p-6 sm:p-8 border border-border/40 shadow-xl space-y-5">
                        <h3 className="font-bold text-lg border-b border-border/30 pb-3">Benchmark Result</h3>

                        <div>
                            <label htmlFor={benchmarkDistanceSelectId} className="text-xs font-bold text-foreground/70 block mb-1">
                                Distance
                            </label>
                            <select
                                id={benchmarkDistanceSelectId}
                                value={benchmarkDistanceKm}
                                onChange={(e) => setBenchmarkDistanceKm(Number(e.target.value))}
                                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border/40 text-sm font-semibold"
                            >
                                <option value="1">1 km</option>
                                <option value="5">5 km</option>
                                <option value="10">10 km</option>
                                <option value="21.0975">Half Marathon (21.1 km)</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor={benchmarkMinsInputId} className="text-xs font-bold text-foreground/70 block mb-1">
                                    Minutes
                                </label>
                                <input
                                    id={benchmarkMinsInputId}
                                    type="number"
                                    value={benchmarkMins}
                                    onChange={(e) => setBenchmarkMins(Number(e.target.value))}
                                    className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-border/40 text-sm font-bold font-mono text-center"
                                />
                            </div>
                            <div>
                                <label htmlFor={benchmarkSecsInputId} className="text-xs font-bold text-foreground/70 block mb-1">
                                    Seconds
                                </label>
                                <input
                                    id={benchmarkSecsInputId}
                                    type="number"
                                    value={benchmarkSecs}
                                    onChange={(e) => setBenchmarkSecs(Number(e.target.value))}
                                    className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-border/40 text-sm font-bold font-mono text-center"
                                />
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-center">
                            <span className="text-xs font-bold text-brand-400 block">Calculated Average Pace</span>
                            <h4 className="text-3xl font-black font-mono text-foreground mt-1">
                                {paceMins}:{paceSecs < 10 ? "0" : ""}{paceSecs} <span className="text-sm font-bold">/ km</span>
                            </h4>
                        </div>
                    </div>

                    <div className="md:col-span-7 glass rounded-3xl p-6 sm:p-8 border border-border/40 shadow-xl space-y-4">
                        <h3 className="font-bold text-lg">Projected Race Finishes (Riegel Formula)</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="p-4 rounded-2xl bg-card/60 border border-border/30">
                                <span className="text-xs text-foreground/50 font-bold block">5 Kilometer Race</span>
                                <h4 className="text-2xl font-black font-mono text-brand-400 mt-1">{predictRaceTime(5)}</h4>
                            </div>
                            <div className="p-4 rounded-2xl bg-card/60 border border-border/30">
                                <span className="text-xs text-foreground/50 font-bold block">10 Kilometer Race</span>
                                <h4 className="text-2xl font-black font-mono text-orange-400 mt-1">{predictRaceTime(10)}</h4>
                            </div>
                            <div className="p-4 rounded-2xl bg-card/60 border border-border/30">
                                <span className="text-xs text-foreground/50 font-bold block">Half Marathon (21.1 km)</span>
                                <h4 className="text-2xl font-black font-mono text-cyan-400 mt-1">{predictRaceTime(21.0975)}</h4>
                            </div>
                            <div className="p-4 rounded-2xl bg-card/60 border border-border/30">
                                <span className="text-xs text-foreground/50 font-bold block">Full Marathon (42.2 km)</span>
                                <h4 className="text-2xl font-black font-mono text-amber-400 mt-1">{predictRaceTime(42.195)}</h4>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Tab 4: 1RM Percentage Chart */}
            {activeTab === "1RM" && (
                <motion.div variants={itemVariants} className="space-y-6">
                    <div className="glass rounded-3xl p-6 border border-border/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-bold text-lg">1-Rep Max Training Matrix</h3>
                            <p className="text-xs text-foreground/60">Generate exact working set loads from 50% to 100% of your 1RM.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <label htmlFor={oneRepMaxInputId} className="text-xs font-bold text-foreground/70">
                                Enter 1RM:
                            </label>
                            <input
                                id={oneRepMaxInputId}
                                type="number"
                                value={oneRepMax}
                                onChange={(e) => setOneRepMax(Number(e.target.value))}
                                className="w-28 px-4 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-lg font-black font-mono text-center"
                            />
                            <span className="font-bold text-sm text-foreground/50">kg</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {percentages.map((p) => (
                            <div
                                key={p.percent}
                                className={`p-4 rounded-2xl border text-center space-y-1 transition-all ${
                                    p.percent === 100
                                        ? "bg-amber-500/20 border-amber-500/40 shadow-lg shadow-amber-500/10"
                                        : "bg-card/60 border-border/30"
                                }`}
                            >
                                <span className="text-xs font-black text-brand-400 block">{p.percent}%</span>
                                <h4 className="text-2xl font-black font-mono text-foreground">{p.weightKg} <span className="text-xs font-bold text-foreground/40">kg</span></h4>
                                <span className="text-[10px] text-foreground/50 font-semibold block">~{p.repsEst} reps</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}
export default Calculators
