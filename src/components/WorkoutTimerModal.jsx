import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Play,
    Pause,
    X,
    CheckCircle2,
    ChevronRight,
    Flame
} from "lucide-react"

export function WorkoutTimerModal({ isOpen, onClose, workoutName, exercises }) {
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
    const [timeLeft, setTimeLeft] = useState(0)
    const [isActive, setIsActive] = useState(false)
    const [isWorkoutComplete, setIsWorkoutComplete] = useState(false)

    const currentExercise = exercises[currentExerciseIndex]
    const totalExercises = exercises.length
    const progress = ((currentExerciseIndex) / totalExercises) * 100

    useEffect(() => {
        if (isOpen && exercises.length > 0 && !isWorkoutComplete) {
            setTimeLeft(exercises[0].duration)
            setIsActive(false)
            setCurrentExerciseIndex(0)
        }
    }, [isOpen, exercises, isWorkoutComplete])

    useEffect(() => {
        let interval
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1)
            }, 1000)
        } else if (timeLeft === 0 && isActive) {
            handleNextExercise()
        }
        return () => clearInterval(interval)
    }, [isActive, timeLeft])

    const toggleTimer = () => setIsActive(!isActive)

    const handleNextExercise = () => {
        if (currentExerciseIndex < totalExercises - 1) {
            setCurrentExerciseIndex((prev) => prev + 1)
            setTimeLeft(exercises[currentExerciseIndex + 1].duration)
            setIsActive(true)
        } else {
            setIsActive(false)
            setIsWorkoutComplete(true)
        }
    }

    const handleEndWorkout = () => {
        setIsActive(false)
        setIsWorkoutComplete(false)
        onClose()
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/90 backdrop-blur-xl"
                        onClick={handleEndWorkout}
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-border/50 glass shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border/30">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-500/10 rounded-xl">
                                    <Flame className="h-5 w-5 text-brand-500" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg">{workoutName}</h2>
                                    {!isWorkoutComplete && (
                                        <p className="text-sm text-foreground/60">
                                            Exercise {currentExerciseIndex + 1} of {totalExercises}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleEndWorkout}
                                className="p-2 text-foreground/50 hover:text-foreground hover:bg-foreground/5 rounded-full transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-foreground/5">
                            <motion.div
                                className="h-full bg-brand-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${isWorkoutComplete ? 100 : progress}%` }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        </div>

                        {/* Body */}
                        <div className="p-8">
                            {isWorkoutComplete ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center text-center py-8"
                                >
                                    <div className="h-24 w-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                                        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-2">Workout Complete!</h3>
                                    <p className="text-foreground/60 mb-8 max-w-sm">
                                        Amazing job! Your AI Performance Score will be updated shortly based on your effort.
                                    </p>
                                    <button
                                        onClick={handleEndWorkout}
                                        className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-brand-500/25"
                                    >
                                        Finish Session
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="w-full aspect-video rounded-2xl overflow-hidden bg-foreground/5 mb-8 relative group border border-border/30">
                                        <img
                                            src={currentExercise?.image || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=60"}
                                            alt={currentExercise?.name}
                                            className="w-full h-full object-cover opacity-80"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                            <h3 className="text-2xl font-bold text-white drop-shadow-md">
                                                {currentExercise?.name}
                                            </h3>
                                            {currentExercise?.sets && (
                                                <div className="bg-background/80 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-semibold border border-white/10">
                                                    Set {currentExercise?.currentSet || 1}/{currentExercise?.sets}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Timer Display */}
                                    <div className="text-7xl font-black mb-8 tracking-tighter tabular-nums text-foreground drop-shadow-sm">
                                        {formatTime(timeLeft)}
                                    </div>

                                    {/* Controls */}
                                    <div className="flex items-center gap-6 w-full justify-center">
                                        <button
                                            onClick={toggleTimer}
                                            className="h-20 w-20 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-brand-500/30"
                                        >
                                            {isActive ? (
                                                <Pause className="h-8 w-8 fill-current" />
                                            ) : (
                                                <Play className="h-8 w-8 fill-current ml-1" />
                                            )}
                                        </button>

                                        <button
                                            onClick={handleNextExercise}
                                            className="h-14 w-14 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-border/50"
                                            title="Skip / Next"
                                        >
                                            <ChevronRight className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
