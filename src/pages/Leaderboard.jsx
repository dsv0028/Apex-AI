import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
    Trophy,
    Medal,
    Flame,
    TrendingUp,
    Zap,
    Crown,
    Target,
    ChevronUp,
    Star,
} from "lucide-react"
import axios from "axios"

const API_BASE = "http://localhost:5001/api"

// ─── Mock Demo Data ────────────────────────────────────────────────────────────
const MOCK_LEADERBOARD = [
    { rank: 1, _id: "1", name: "Divyanshu Verma", sport: "Running", profileImage: "", avgScore: 94, bestScore: 99, totalSessions: 22, totalCalories: 14800, completedWorkouts: 18, streak: 7, compositeScore: 96, stats: { stamina: 90, speed: 85, strength: 78 } },
    { rank: 2, _id: "2", name: "Sarah Chen", sport: "Swimming", profileImage: "", avgScore: 91, bestScore: 97, totalSessions: 20, totalCalories: 13200, completedWorkouts: 16, streak: 5, compositeScore: 89, stats: { stamina: 88, speed: 80, strength: 72 } },
    { rank: 3, _id: "3", name: "Arjun Patel", sport: "Basketball", profileImage: "", avgScore: 87, bestScore: 95, totalSessions: 18, totalCalories: 12100, completedWorkouts: 14, streak: 4, compositeScore: 83, stats: { stamina: 82, speed: 88, strength: 75 } },
    { rank: 4, _id: "4", name: "Maya Rodriguez", sport: "Tennis", profileImage: "", avgScore: 84, bestScore: 93, totalSessions: 16, totalCalories: 10800, completedWorkouts: 12, streak: 3, compositeScore: 78, stats: { stamina: 78, speed: 82, strength: 70 } },
    { rank: 5, _id: "5", name: "James Wilson", sport: "Cycling", profileImage: "", avgScore: 80, bestScore: 90, totalSessions: 14, totalCalories: 9500, completedWorkouts: 10, streak: 2, compositeScore: 72, stats: { stamina: 85, speed: 75, strength: 68 } },
    { rank: 6, _id: "6", name: "Priya Sharma", sport: "Yoga", profileImage: "", avgScore: 76, bestScore: 88, totalSessions: 12, totalCalories: 7200, completedWorkouts: 9, streak: 6, compositeScore: 68, stats: { stamina: 70, speed: 60, strength: 65 } },
    { rank: 7, _id: "7", name: "Lucas Brown", sport: "Football", profileImage: "", avgScore: 72, bestScore: 85, totalSessions: 10, totalCalories: 6800, completedWorkouts: 7, streak: 1, compositeScore: 62, stats: { stamina: 75, speed: 80, strength: 82 } },
    { rank: 8, _id: "8", name: "Emma Davis", sport: "Gymnastics", profileImage: "", avgScore: 68, bestScore: 82, totalSessions: 8, totalCalories: 5400, completedWorkouts: 5, streak: 0, compositeScore: 55, stats: { stamina: 72, speed: 70, strength: 78 } },
]

// ─── Animation Variants ────────────────────────────────────────────────────────
const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
}

// ─── Rank Badge ────────────────────────────────────────────────────────────────
function RankBadge({ rank }) {
    if (rank === 1) {
        return (
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Crown className="h-6 w-6 text-white" />
            </div>
        )
    }
    if (rank === 2) {
        return (
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-lg shadow-gray-400/30">
                <Medal className="h-6 w-6 text-white" />
            </div>
        )
    }
    if (rank === 3) {
        return (
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-700/30">
                <Medal className="h-6 w-6 text-white" />
            </div>
        )
    }
    return (
        <div className="h-12 w-12 rounded-2xl bg-foreground/5 border border-border/50 flex items-center justify-center">
            <span className="text-lg font-bold text-foreground/60">{rank}</span>
        </div>
    )
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton({ className }) {
    return <div className={`animate-pulse bg-foreground/10 rounded-2xl ${className}`} />
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function Leaderboard() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    const token = userInfo?.token
    const currentUserId = userInfo?._id

    const headers = { Authorization: `Bearer ${token}` }

    const [leaderboard, setLeaderboard] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!token) {
            setLoading(false)
            return
        }
        axios
            .get(`${API_BASE}/leaderboard`, { headers })
            .then((res) => setLeaderboard(res.data))
            .catch(() => {
                // API unavailable — will use mock data
            })
            .finally(() => setLoading(false))
    }, [])

    const data = leaderboard.length > 0 ? leaderboard : MOCK_LEADERBOARD

    // Find current user's rank
    const currentUserEntry = data.find((e) => e._id === currentUserId)

    // Top 3 podium
    const podium = data.slice(0, 3)
    // Rest of the list
    const rest = data.slice(3)

    // Stats summary
    const totalAthletes = data.length
    const avgAllScores = data.length
        ? Math.round(data.reduce((s, e) => s + e.avgScore, 0) / data.length)
        : 0
    const topStreak = data.length ? Math.max(...data.map((e) => e.streak)) : 0

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-6xl mx-auto space-y-8"
        >
            {/* ── Header ── */}
            <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Trophy className="h-8 w-8 text-amber-500" />
                        Leaderboard
                    </h1>
                    <p className="text-foreground/60 mt-1">
                        Top athletes ranked by composite performance score
                    </p>
                </div>
                {currentUserEntry && (
                    <div className="flex items-center gap-3 glass px-5 py-3 rounded-2xl border border-brand-500/20">
                        <span className="text-sm text-foreground/60">Your Rank</span>
                        <span className="text-2xl font-black text-brand-500">#{currentUserEntry.rank}</span>
                        <span className="text-sm text-foreground/50">of {totalAthletes}</span>
                    </div>
                )}
            </motion.div>

            {/* ── Quick Stats Row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div variants={item} className="glass p-5 rounded-3xl flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-xl">
                        <Trophy className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-sm text-foreground/60 font-medium">Total Athletes</p>
                        <p className="text-2xl font-bold">{totalAthletes}</p>
                    </div>
                </motion.div>
                <motion.div variants={item} className="glass p-5 rounded-3xl flex items-center gap-4">
                    <div className="p-3 bg-brand-500/10 rounded-xl">
                        <Target className="h-6 w-6 text-brand-500" />
                    </div>
                    <div>
                        <p className="text-sm text-foreground/60 font-medium">Avg AI Score</p>
                        <p className="text-2xl font-bold">{avgAllScores}<span className="text-sm text-foreground/50 ml-1">/100</span></p>
                    </div>
                </motion.div>
                <motion.div variants={item} className="glass p-5 rounded-3xl flex items-center gap-4">
                    <div className="p-3 bg-orange-500/10 rounded-xl">
                        <Flame className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-sm text-foreground/60 font-medium">Top Streak</p>
                        <p className="text-2xl font-bold">{topStreak} <span className="text-sm text-foreground/50">days</span></p>
                    </div>
                </motion.div>
            </div>

            {/* ── Podium (Top 3) ── */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <motion.div key={i} variants={item}>
                            <Skeleton className="h-64 w-full" />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className={`grid gap-4 ${podium.length === 1 ? "grid-cols-1 max-w-sm mx-auto" : podium.length === 2 ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto" : "grid-cols-1 md:grid-cols-3"}`}>
                    {/* Visual arrangement based on length so 1st place is always prominent */}
                    {(() => {
                        let visualPodium = [];
                        if (podium.length === 1) {
                            visualPodium = [ { entry: podium[0], place: 'first' } ];
                        } else if (podium.length === 2) {
                            visualPodium = [ { entry: podium[1], place: 'second' }, { entry: podium[0], place: 'first' } ];
                        } else {
                            visualPodium = [ { entry: podium[1], place: 'second' }, { entry: podium[0], place: 'first' }, { entry: podium[2], place: 'third' } ];
                        }

                        return visualPodium.map(({ entry, place }) => {
                            const isFirst = place === 'first';
                            
                            let colors = "";
                            let glowColors = "";
                            
                            if (place === 'first') {
                                colors = "from-amber-400/20 to-yellow-500/5 border-amber-500/40";
                                glowColors = "shadow-amber-500/20";
                            } else if (place === 'second') {
                                colors = "from-gray-300/20 to-gray-400/5 border-gray-400/30";
                                glowColors = "shadow-gray-400/10";
                            } else {
                                colors = "from-amber-700/15 to-amber-800/5 border-amber-700/30";
                                glowColors = "shadow-amber-700/10";
                            }

                            return (
                                <motion.div
                                    key={entry._id}
                                    variants={item}
                                    className={`glass p-6 rounded-3xl bg-gradient-to-b ${colors} border shadow-xl ${glowColors} flex flex-col items-center text-center ${isFirst && podium.length === 3 ? "md:-mt-4 md:scale-105" : ""} relative overflow-hidden`}
                                >
                                    {isFirst && (
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400" />
                                    )}
                                    <RankBadge rank={entry.rank} />
                                    <div className="mt-4 mb-2">
                                        {entry.profileImage ? (
                                            <img
                                                src={entry.profileImage}
                                                alt={entry.name}
                                                className="h-16 w-16 rounded-full object-cover border-2 border-background shadow-lg mx-auto"
                                            />
                                        ) : (
                                            <div className="h-16 w-16 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-500 font-bold text-xl mx-auto border-2 border-background shadow-lg">
                                                {entry.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold mt-1">{entry.name}</h3>
                                    <p className="text-sm text-foreground/50 mb-4">{entry.sport}</p>
                                    <div className="text-3xl font-black text-brand-500">
                                        {entry.compositeScore}
                                        <span className="text-sm text-foreground/50 font-medium ml-1">pts</span>
                                    </div>
                                    <div className="mt-4 grid grid-cols-3 gap-3 w-full">
                                        <div className="text-center">
                                            <p className="text-xs text-foreground/50">Avg Score</p>
                                            <p className="font-bold text-sm">{entry.avgScore}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-foreground/50">Sessions</p>
                                            <p className="font-bold text-sm">{entry.totalSessions}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-foreground/50">Streak</p>
                                            <p className="font-bold text-sm flex items-center justify-center gap-1">
                                                {entry.streak} <Flame className="h-3 w-3 text-orange-500" />
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })
                    })}
                </div>
            )}

            {/* ── Full Rankings Table ── */}
            <motion.div variants={item} className="glass rounded-3xl overflow-hidden mt-0 lg:-mt-4 relative z-10">
                <div className="p-6 border-b border-border/30">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Star className="h-5 w-5 text-brand-500" />
                        Full Rankings
                    </h2>
                </div>

                {loading ? (
                    <div className="p-6 space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                    </div>
                ) : (
                    <div className="divide-y divide-border/20">
                        {/* Header */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                            <div className="col-span-1">Rank</div>
                            <div className="col-span-3">Athlete</div>
                            <div className="col-span-1 text-center">Score</div>
                            <div className="col-span-1 text-center">Best</div>
                            <div className="col-span-2 text-center">Sessions</div>
                            <div className="col-span-1 text-center">Streak</div>
                            <div className="col-span-1 text-center">Calories</div>
                            <div className="col-span-2 text-center">Composite</div>
                        </div>

                        {data.map((entry) => {
                            const isCurrentUser = entry._id === currentUserId
                            return (
                                <motion.div
                                    key={entry._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: entry.rank * 0.04 }}
                                    className={`grid grid-cols-2 md:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-foreground/5 transition-colors ${isCurrentUser
                                        ? "bg-brand-500/5 border-l-4 border-brand-500"
                                        : ""
                                        }`}
                                >
                                    {/* Rank */}
                                    <div className="col-span-1 flex items-center">
                                        <RankBadge rank={entry.rank} />
                                    </div>

                                    {/* Athlete Info */}
                                    <div className="col-span-1 md:col-span-3 flex items-center gap-3">
                                        {entry.profileImage ? (
                                            <img
                                                src={entry.profileImage}
                                                alt={entry.name}
                                                className="h-10 w-10 rounded-full object-cover border border-border/50 flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-brand-500/15 flex items-center justify-center text-brand-500 font-bold text-sm flex-shrink-0">
                                                {entry.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm truncate">
                                                {entry.name}
                                                {isCurrentUser && (
                                                    <span className="ml-2 text-xs bg-brand-500/10 text-brand-500 px-2 py-0.5 rounded-full font-semibold">
                                                        You
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-xs text-foreground/50 truncate">{entry.sport}</p>
                                        </div>
                                    </div>

                                    {/* Stats (visible on md+) */}
                                    <div className="hidden md:flex col-span-1 justify-center">
                                        <span className="font-bold text-emerald-500">{entry.avgScore}</span>
                                    </div>
                                    <div className="hidden md:flex col-span-1 justify-center">
                                        <span className="font-semibold text-foreground/70">{entry.bestScore}</span>
                                    </div>
                                    <div className="hidden md:flex col-span-2 justify-center">
                                        <span className="text-foreground/70">{entry.totalSessions}</span>
                                    </div>
                                    <div className="hidden md:flex col-span-1 justify-center items-center gap-1">
                                        <span className="font-semibold">{entry.streak}</span>
                                        {entry.streak > 0 && <Flame className="h-3.5 w-3.5 text-orange-500" />}
                                    </div>
                                    <div className="hidden md:flex col-span-1 justify-center">
                                        <span className="text-foreground/70">{(entry.totalCalories / 1000).toFixed(1)}k</span>
                                    </div>
                                    <div className="hidden md:flex col-span-2 justify-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-2 bg-foreground/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${entry.compositeScore}%` }}
                                                    transition={{ duration: 1, delay: entry.rank * 0.05 }}
                                                />
                                            </div>
                                            <span className="font-black text-sm text-brand-500 w-8">{entry.compositeScore}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </motion.div>

            {/* ── Scoring Info ── */}
            <motion.div variants={item} className="glass p-6 rounded-3xl">
                <h3 className="font-bold text-sm text-foreground/60 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-brand-500" />
                    How Composite Score is Calculated
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { label: "Avg AI Score", weight: "40%", color: "text-emerald-500" },
                        { label: "Best Score", weight: "20%", color: "text-blue-500" },
                        { label: "Sessions (max 30pts)", weight: "×3", color: "text-purple-500" },
                        { label: "Streak (max 20pts)", weight: "×2", color: "text-orange-500" },
                        { label: "Workouts (max 15pts)", weight: "×1.5", color: "text-rose-500" },
                    ].map((item) => (
                        <div key={item.label} className="text-center p-3 rounded-xl bg-foreground/5">
                            <p className={`text-lg font-black ${item.color}`}>{item.weight}</p>
                            <p className="text-xs text-foreground/50 mt-1">{item.label}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}
