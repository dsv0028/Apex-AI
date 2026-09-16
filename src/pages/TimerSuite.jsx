import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Timer,
    Play,
    Pause,
    RotateCcw,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
    Flame,
    Zap,
    Plus,
    Minus,
    CheckCircle2,
    Clock,
    Activity,
} from "lucide-react"

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
}

// ── Web Audio API sound synthesizer ───────────────────────────────────────────
const playBeep = (freq = 880, duration = 0.15, isMuted = false) => {
    if (isMuted) return
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext
        if (!AudioCtx) return
        const ctx = new AudioCtx()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = "sine"
        osc.frequency.setValueAtTime(freq, ctx.currentTime)

        gain.gain.setValueAtTime(0.3, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start()
        osc.stop(ctx.currentTime + duration)
    } catch (e) {
        // AudioContext may be blocked before user gesture
    }
}

export function TimerSuite() {
    const [timerMode, setTimerMode] = useState("Tabata") // 'Tabata' | 'EMOM' | 'AMRAP' | 'Stopwatch'
    const [isRunning, setIsRunning] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)

    // Tabata Config
    const [tabataWorkSec, setTabataWorkSec] = useState(20)
    const [tabataRestSec, setTabataRestSec] = useState(10)
    const [tabataTotalRounds, setTabataTotalRounds] = useState(8)
    const [tabataCurrentRound, setTabataCurrentRound] = useState(1)
    const [tabataPhase, setTabataPhase] = useState("WORK") // 'WORK' | 'REST' | 'PREPARE'
    const [tabataSecondsLeft, setTabataSecondsLeft] = useState(20)

    // EMOM Config
    const [emomTotalMins, setEmomTotalMins] = useState(10)
    const [emomCurrentMin, setEmomCurrentMin] = useState(1)
    const [emomSecondsLeft, setEmomSecondsLeft] = useState(60)

    // AMRAP Config
    const [amrapTotalMins, setAmrapTotalMins] = useState(15)
    const [amrapSecondsLeft, setAmrapSecondsLeft] = useState(15 * 60)
    const [amrapCompletedRounds, setAmrapCompletedRounds] = useState(0)

    // Stopwatch Config
    const [stopwatchMs, setStopwatchMs] = useState(0)
    const [stopwatchLaps, setStopwatchLaps] = useState([])

    const intervalRef = useRef(null)

    // Reset current active timer
    const resetTimer = () => {
        setIsRunning(false)
        clearInterval(intervalRef.current)

        if (timerMode === "Tabata") {
            setTabataCurrentRound(1)
            setTabataPhase("WORK")
            setTabataSecondsLeft(tabataWorkSec)
        } else if (timerMode === "EMOM") {
            setEmomCurrentMin(1)
            setEmomSecondsLeft(60)
        } else if (timerMode === "AMRAP") {
            setAmrapSecondsLeft(amrapTotalMins * 60)
            setAmrapCompletedRounds(0)
        } else if (timerMode === "Stopwatch") {
            setStopwatchMs(0)
            setStopwatchLaps([])
        }
    }

    // Toggle start/stop
    const toggleStart = () => {
        setIsRunning(!isRunning)
    }

    useEffect(() => {
        resetTimer()
    }, [timerMode])

    // Main Timer Loop
    useEffect(() => {
        if (!isRunning) {
            clearInterval(intervalRef.current)
            return
        }

        if (timerMode === "Tabata") {
            intervalRef.current = setInterval(() => {
                setTabataSecondsLeft((prev) => {
                    if (prev <= 4 && prev > 1) {
                        playBeep(660, 0.1, isMuted) // 3, 2, 1 warning beeps
                    }

                    if (prev <= 1) {
                        if (tabataPhase === "WORK") {
                            // Switch to REST or Finish
                            if (tabataCurrentRound >= tabataTotalRounds) {
                                playBeep(1200, 0.5, isMuted) // Victory buzzer
                                setIsRunning(false)
                                return 0
                            }
                            playBeep(440, 0.3, isMuted) // Rest buzzer
                            setTabataPhase("REST")
                            return tabataRestSec
                        } else {
                            // Switch back to WORK
                            playBeep(880, 0.3, isMuted) // Work start buzzer
                            setTabataCurrentRound((r) => r + 1)
                            setTabataPhase("WORK")
                            return tabataWorkSec
                        }
                    }
                    return prev - 1
                })
            }, 1000)
        } else if (timerMode === "EMOM") {
            intervalRef.current = setInterval(() => {
                setEmomSecondsLeft((prev) => {
                    if (prev <= 4 && prev > 1) {
                        playBeep(660, 0.1, isMuted)
                    }

                    if (prev <= 1) {
                        if (emomCurrentMin >= emomTotalMins) {
                            playBeep(1200, 0.5, isMuted)
                            setIsRunning(false)
                            return 0
                        }
                        playBeep(880, 0.3, isMuted)
                        setEmomCurrentMin((m) => m + 1)
                        return 60
                    }
                    return prev - 1
                })
            }, 1000)
        } else if (timerMode === "AMRAP") {
            intervalRef.current = setInterval(() => {
                setAmrapSecondsLeft((prev) => {
                    if (prev <= 4 && prev > 1) {
                        playBeep(660, 0.1, isMuted)
                    }
                    if (prev <= 1) {
                        playBeep(1200, 0.5, isMuted)
                        setIsRunning(false)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        } else if (timerMode === "Stopwatch") {
            const start = Date.now() - stopwatchMs
            intervalRef.current = setInterval(() => {
                setStopwatchMs(Date.now() - start)
            }, 10)
        }

        return () => clearInterval(intervalRef.current)
    }, [isRunning, timerMode, tabataPhase, tabataCurrentRound, tabataTotalRounds, emomCurrentMin, emomTotalMins, isMuted])

    const formatMinsSecs = (totalSec) => {
        const m = Math.floor(totalSec / 60)
        const s = totalSec % 60
        return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`
    }

    const formatStopwatch = (ms) => {
        const minutes = Math.floor(ms / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        const centis = Math.floor((ms % 1000) / 10)
        return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}.${centis < 10 ? "0" : ""}${centis}`
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-8 pb-24 ${
                isFullscreen ? "fixed inset-0 z-50 bg-background overflow-y-auto p-8" : ""
            }`}
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent flex items-center gap-3">
                        <Timer className="h-8 w-8 text-brand-500" />
                        Interval & Conditioning Timer Suite
                    </h1>
                    <p className="text-foreground/60 text-sm mt-1">
                        Professional gym timers for Tabata, EMOM, AMRAP, and precision circuit training.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2.5 rounded-xl border border-border/40 hover:bg-foreground/5 text-foreground/70 transition-colors"
                        title={isMuted ? "Unmute Audio Beeps" : "Mute Audio Beeps"}
                    >
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5 text-brand-400" />}
                    </button>
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2.5 rounded-xl border border-border/40 hover:bg-foreground/5 text-foreground/70 transition-colors"
                        title="Toggle Fullscreen Mode"
                    >
                        {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                    </button>
                </div>
            </motion.div>

            {/* Mode Select Tabs */}
            <motion.div variants={itemVariants} className="flex items-center gap-2 p-1.5 glass rounded-2xl border border-border/40 max-w-xl mx-auto">
                {["Tabata", "EMOM", "AMRAP", "Stopwatch"].map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setTimerMode(mode)}
                        className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                            timerMode === mode
                                ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                                : "text-foreground/60 hover:text-foreground"
                        }`}
                    >
                        {mode}
                    </button>
                ))}
            </motion.div>

            {/* Main Timer Display Hero */}
            <motion.div
                variants={itemVariants}
                className="glass rounded-3xl p-8 sm:p-12 border border-border/40 shadow-2xl text-center space-y-8 max-w-2xl mx-auto relative overflow-hidden"
            >
                {/* Status Badge */}
                {timerMode === "Tabata" && (
                    <div className="flex items-center justify-center gap-3">
                        <span
                            className={`text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full border transition-all ${
                                tabataPhase === "WORK"
                                    ? "bg-brand-500/20 text-brand-400 border-brand-500/40 animate-pulse"
                                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                            }`}
                        >
                            {tabataPhase} PHASE
                        </span>
                        <span className="text-xs font-bold text-foreground/60">
                            Round {tabataCurrentRound} / {tabataTotalRounds}
                        </span>
                    </div>
                )}

                {timerMode === "EMOM" && (
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40">
                            EMOM MINUTE {emomCurrentMin} / {emomTotalMins}
                        </span>
                    </div>
                )}

                {timerMode === "AMRAP" && (
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                            AMRAP COUNTDOWN
                        </span>
                        <span className="text-xs font-bold text-brand-400">
                            {amrapCompletedRounds} Rounds Completed
                        </span>
                    </div>
                )}

                {/* Main Digits Display */}
                <div className="py-4">
                    {timerMode === "Tabata" && (
                        <h2 className="text-7xl sm:text-9xl font-mono font-black tracking-tight text-foreground">
                            {tabataSecondsLeft}
                            <span className="text-2xl sm:text-3xl text-foreground/40 font-normal">s</span>
                        </h2>
                    )}
                    {timerMode === "EMOM" && (
                        <h2 className="text-7xl sm:text-9xl font-mono font-black tracking-tight text-foreground">
                            {emomSecondsLeft}
                            <span className="text-2xl sm:text-3xl text-foreground/40 font-normal">s</span>
                        </h2>
                    )}
                    {timerMode === "AMRAP" && (
                        <h2 className="text-6xl sm:text-8xl font-mono font-black tracking-tight text-foreground">
                            {formatMinsSecs(amrapSecondsLeft)}
                        </h2>
                    )}
                    {timerMode === "Stopwatch" && (
                        <h2 className="text-5xl sm:text-7xl font-mono font-black tracking-tight text-foreground">
                            {formatStopwatch(stopwatchMs)}
                        </h2>
                    )}
                </div>

                {/* AMRAP Round Counter Quick Taps */}
                {timerMode === "AMRAP" && (
                    <div className="flex items-center justify-center gap-4 pt-2">
                        <button
                            onClick={() => setAmrapCompletedRounds(Math.max(0, amrapCompletedRounds - 1))}
                            className="p-3 rounded-2xl bg-foreground/5 hover:bg-foreground/10 border border-border/30 text-sm font-bold flex items-center gap-1"
                        >
                            <Minus className="h-4 w-4" /> Round
                        </button>
                        <span className="text-2xl font-black text-brand-400 px-4">{amrapCompletedRounds}</span>
                        <button
                            onClick={() => setAmrapCompletedRounds(amrapCompletedRounds + 1)}
                            className="p-3 rounded-2xl bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/40 text-brand-400 text-sm font-bold flex items-center gap-1"
                        >
                            <Plus className="h-4 w-4" /> Round
                        </button>
                    </div>
                )}

                {/* Timer Control Buttons */}
                <div className="flex items-center justify-center gap-4 pt-4">
                    <button
                        onClick={resetTimer}
                        className="p-4 rounded-2xl border border-border/40 hover:bg-foreground/5 text-foreground/60 transition-colors"
                        title="Reset"
                    >
                        <RotateCcw className="h-6 w-6" />
                    </button>

                    <button
                        onClick={toggleStart}
                        className={`px-10 py-4 rounded-3xl font-black text-lg flex items-center gap-3 shadow-2xl transition-all hover:scale-105 ${
                            isRunning
                                ? "bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/30"
                                : "bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/30"
                        }`}
                    >
                        {isRunning ? (
                            <>
                                <Pause className="h-6 w-6" /> PAUSE
                            </>
                        ) : (
                            <>
                                <Play className="h-6 w-6" /> START
                            </>
                        )}
                    </button>

                    {timerMode === "Stopwatch" && isRunning && (
                        <button
                            onClick={() => setStopwatchLaps([stopwatchMs, ...stopwatchLaps])}
                            className="px-5 py-4 rounded-2xl bg-foreground/10 hover:bg-foreground/20 font-bold text-sm"
                        >
                            Lap
                        </button>
                    )}
                </div>

                {/* Stopwatch Lap Times */}
                {timerMode === "Stopwatch" && stopwatchLaps.length > 0 && (
                    <div className="pt-4 border-t border-border/20 max-h-48 overflow-y-auto space-y-1.5 text-xs text-left">
                        {stopwatchLaps.map((lap, idx) => (
                            <div key={idx} className="flex items-center justify-between py-1 border-b border-border/10">
                                <span className="text-foreground/50">Lap {stopwatchLaps.length - idx}</span>
                                <span className="font-mono font-bold text-brand-400">{formatStopwatch(lap)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Config Panel (when stopped) */}
            {!isRunning && (
                <motion.div variants={itemVariants} className="glass rounded-3xl p-6 border border-border/40 max-w-2xl mx-auto space-y-4">
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                        <Activity className="h-4 w-4 text-brand-500" />
                        Interval Parameters Configuration
                    </h3>

                    {timerMode === "Tabata" && (
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="p-3 rounded-2xl bg-foreground/5 border border-border/20">
                                <span className="text-[10px] uppercase font-bold text-foreground/50 block">Work Time</span>
                                <input
                                    type="number"
                                    value={tabataWorkSec}
                                    onChange={(e) => setTabataWorkSec(Number(e.target.value))}
                                    className="w-16 text-center font-mono font-bold bg-transparent text-lg focus:outline-none"
                                />
                                <span className="text-xs text-foreground/40">sec</span>
                            </div>
                            <div className="p-3 rounded-2xl bg-foreground/5 border border-border/20">
                                <span className="text-[10px] uppercase font-bold text-foreground/50 block">Rest Time</span>
                                <input
                                    type="number"
                                    value={tabataRestSec}
                                    onChange={(e) => setTabataRestSec(Number(e.target.value))}
                                    className="w-16 text-center font-mono font-bold bg-transparent text-lg focus:outline-none"
                                />
                                <span className="text-xs text-foreground/40">sec</span>
                            </div>
                            <div className="p-3 rounded-2xl bg-foreground/5 border border-border/20">
                                <span className="text-[10px] uppercase font-bold text-foreground/50 block">Rounds</span>
                                <input
                                    type="number"
                                    value={tabataTotalRounds}
                                    onChange={(e) => setTabataTotalRounds(Number(e.target.value))}
                                    className="w-16 text-center font-mono font-bold bg-transparent text-lg focus:outline-none"
                                />
                                <span className="text-xs text-foreground/40">rounds</span>
                            </div>
                        </div>
                    )}

                    {timerMode === "EMOM" && (
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-foreground/5 border border-border/20">
                            <span className="text-xs font-semibold text-foreground/70">Total EMOM Duration:</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={emomTotalMins}
                                    onChange={(e) => setEmomTotalMins(Number(e.target.value))}
                                    className="w-16 px-2 py-1 rounded-lg bg-background border border-border/40 font-mono font-bold text-center text-sm"
                                />
                                <span className="text-xs text-foreground/60">minutes</span>
                            </div>
                        </div>
                    )}

                    {timerMode === "AMRAP" && (
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-foreground/5 border border-border/20">
                            <span className="text-xs font-semibold text-foreground/70">AMRAP Time Cap:</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={amrapTotalMins}
                                    onChange={(e) => setAmrapTotalMins(Number(e.target.value))}
                                    className="w-16 px-2 py-1 rounded-lg bg-background border border-border/40 font-mono font-bold text-center text-sm"
                                />
                                <span className="text-xs text-foreground/60">minutes</span>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </motion.div>
    )
}
export default TimerSuite
