import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
    LineChart, Line,
    BarChart, Bar,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts"
import {
    TrendingUp, TrendingDown, Minus,
    Activity, Flame, HeartPulse, Calendar,
    Dumbbell, Zap, Target, FileText, Download, Loader2,
} from "lucide-react"
import axios from "axios"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

const API_BASE = "http://localhost:5001/api"

// ─── Mock Demo Data ────────────────────────────────────────────────────────────
const MOCK_WEEKLY = [
    { day: "Mon", score: 62, load: 420 },
    { day: "Tue", score: 74, load: 580 },
    { day: "Wed", score: 69, load: 495 },
    { day: "Thu", score: 83, load: 710 },
    { day: "Fri", score: 87, load: 660 },
    { day: "Sat", score: 92, load: 820 },
    { day: "Sun", score: 96, load: 870 },
]

const MOCK_RADAR = [
    { skill: "Endurance", value: 84 },
    { skill: "Strength", value: 71 },
    { skill: "Speed", value: 77 },
    { skill: "Recovery", value: 89 },
    { skill: "Consistency", value: 78 },
    { skill: "Mental Focus", value: 93 },
]

const MOCK_MONTHLY = {
    thisMonth: { sessions: 18, avgScore: 86, avgLoad: 640, injuryRisk: "Low" },
    lastMonth: { sessions: 14, avgScore: 79, avgLoad: 590, injuryRisk: "Low" },
    changes: { sessions: 29, avgScore: 9, avgLoad: 8 },
}

// ─── Animation Variants ────────────────────────────────────────────────────────
const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } },
}

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="glass px-4 py-3 rounded-2xl border border-border/40 shadow-xl text-sm">
            <p className="font-semibold text-foreground/70 mb-2">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }} className="font-bold">
                    {p.name}: {p.value}
                </p>
            ))}
        </div>
    )
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconColor, bgColor, label, thisMonth, lastMonth, unit = "", change }) {
    const isUp = change > 0
    const isFlat = change === 0
    return (
        <motion.div variants={item} className="glass p-6 rounded-3xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <Icon className={`h-16 w-16 ${iconColor}`} />
            </div>
            <div className="flex items-center gap-2 mb-4">
                <div className={`p-2 ${bgColor} rounded-xl`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <h3 className="font-semibold text-foreground/80 text-sm">{label}</h3>
            </div>
            <div className="flex items-end gap-2 mb-1">
                <span className="text-4xl font-bold">{thisMonth ?? "—"}</span>
                {unit && <span className="text-sm text-foreground/50 mb-1">{unit}</span>}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
                {isFlat ? (
                    <Minus className="h-4 w-4 text-foreground/40" />
                ) : isUp ? (
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-semibold ${isFlat ? "text-foreground/40" : isUp ? "text-emerald-500" : "text-red-500"}`}>
                    {isFlat ? "No change" : `${isUp ? "+" : ""}${change}% vs last month`}
                </span>
            </div>
            <p className="text-xs text-foreground/50 mt-1">Last month: {lastMonth ?? "—"}{unit ? ` ${unit}` : ""}</p>
        </motion.div>
    )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className }) {
    return <div className={`animate-pulse bg-foreground/10 rounded-2xl ${className}`} />
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function Analytics() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    const userId = userInfo?._id
    const token = userInfo?.token

    const headers = { Authorization: `Bearer ${token}` }

    const [weekly, setWeekly] = useState([])
    const [monthly, setMonthly] = useState(null)
    const [radar, setRadar] = useState([])
    const [loading, setLoading] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    const handleExportPdf = async () => {
        const reportElement = document.getElementById("analytics-report")
        if (!reportElement) return

        try {
            setIsExporting(true)
            const canvas = await html2canvas(reportElement, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#0b0f19",
            })
            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: [canvas.width, canvas.height],
            })
            pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
            pdf.save(`ApexAI_Performance_Report_${userInfo?.name?.replace(/\s+/g, "_") || "Athlete"}.pdf`)
        } catch (err) {
            console.error("Failed to generate PDF:", err)
        } finally {
            setIsExporting(false)
        }
    }

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }
        setLoading(true)
        Promise.all([
            axios.get(`${API_BASE}/performance/${userId}`, { headers }),
            axios.get(`${API_BASE}/performance/monthly/${userId}`, { headers }),
            axios.get(`${API_BASE}/performance/radar/${userId}`, { headers }),
        ])
            .then(([weeklyRes, monthlyRes, radarRes]) => {
                setWeekly(weeklyRes.data)
                setMonthly(monthlyRes.data)
                setRadar(radarRes.data)
            })
            .catch(() => {
                // API unavailable — mock data will be used automatically
            })
            .finally(() => setLoading(false))
    }, [userId])

    // ── use real data if available, otherwise fall back to mock demo ──
    const weeklyData = weekly.length >= 2 ? weekly : MOCK_WEEKLY;
    const radarData = radar.length > 0 ? radar : MOCK_RADAR
    const monthlyData = monthly ?? MOCK_MONTHLY

    const tm = monthlyData.thisMonth
    const lm = monthlyData.lastMonth
    const ch = monthlyData.changes

    return (
        <motion.div
            id="analytics-report"
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-7xl mx-auto space-y-5 p-2 sm:p-4 rounded-3xl"
        >
            {/* ── Header ── */}
            <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
                    <p className="text-foreground/60 mt-1">
                        Deep dive into your training metrics, trends, and skill development.
                    </p>
                </div>

                <button
                    onClick={handleExportPdf}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02]"
                >
                    {isExporting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Exporting PDF...
                        </>
                    ) : (
                        <>
                            <FileText className="h-4 w-4" />
                            Export PDF Report Card
                        </>
                    )}
                </button>
            </motion.div>



            {/* ── Line Chart + Bar Chart Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Line Chart — Readiness Score Progress */}
                <motion.div variants={item} className="glass p-6 rounded-3xl">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                            </div>
                            <h2 className="text-lg font-bold">Score Progress</h2>
                        </div>
                        <p className="text-sm text-foreground/50">AI readiness score — past 7 sessions</p>
                    </div>
                    {loading ? <Skeleton className="h-64 w-full" /> : (
                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="lineScore" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/20" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "currentColor", opacity: 0.5, fontSize: 12 }} dy={10} />
                                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "currentColor", opacity: 0.5, fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    name="Readiness Score"
                                    stroke="url(#lineScore)"
                                    strokeWidth={3}
                                    dot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </motion.div>

                {/* Bar Chart — Weekly Training Load */}
                <motion.div variants={item} className="glass p-6 rounded-3xl">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 bg-blue-500/10 rounded-lg">
                                <Dumbbell className="h-4 w-4 text-blue-500" />
                            </div>
                            <h2 className="text-lg font-bold">Weekly Training Load</h2>
                        </div>
                        <p className="text-sm text-foreground/50">Calories-equivalent training load per day</p>
                    </div>
                    {loading ? <Skeleton className="h-64 w-full" /> : (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barSize={24}>
                                <defs>
                                    <linearGradient id="barLoad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.5} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/20" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "currentColor", opacity: 0.5, fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: "currentColor", opacity: 0.5, fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="load" name="Training Load" fill="url(#barLoad)" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </motion.div>
            </div>

            {/* ── Radar Chart + Score vs Load Comparison ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Radar Chart — Skill Comparison */}
                <motion.div variants={item} className="lg:col-span-3 glass p-6 rounded-3xl">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 bg-purple-500/10 rounded-lg">
                                <Target className="h-4 w-4 text-purple-500" />
                            </div>
                            <h2 className="text-lg font-bold">Skill Radar</h2>
                        </div>
                        <p className="text-sm text-foreground/50">Your athletic profile across all dimensions</p>
                    </div>
                    {loading ? <Skeleton className="h-72 w-full" /> : (
                        <ResponsiveContainer width="100%" height={290}>
                            <RadarChart data={radarData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                                <defs>
                                    <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <PolarGrid stroke="currentColor" className="text-border/30" />
                                <PolarAngleAxis
                                    dataKey="skill"
                                    tick={{ fill: "currentColor", opacity: 0.7, fontSize: 12, fontWeight: 600 }}
                                />
                                <PolarRadiusAxis
                                    angle={30}
                                    domain={[0, 100]}
                                    tick={{ fill: "currentColor", opacity: 0.3, fontSize: 10 }}
                                    axisLine={false}
                                />
                                <Radar
                                    name="Your Skills"
                                    dataKey="value"
                                    stroke="#8b5cf6"
                                    strokeWidth={2.5}
                                    fill="url(#radarFill)"
                                />
                                <Tooltip content={<CustomTooltip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    )}
                </motion.div>

                {/* Skill Score Breakdown list */}
                <motion.div variants={item} className="lg:col-span-2 glass p-6 rounded-3xl flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-1.5 bg-purple-500/10 rounded-lg">
                            <Zap className="h-4 w-4 text-purple-500" />
                        </div>
                        <h2 className="text-lg font-bold">Skill Breakdown</h2>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col justify-between gap-3">
                            {radarData.map((s, i) => {
                                const colors = [
                                    "bg-purple-500",
                                    "bg-blue-500",
                                    "bg-emerald-500",
                                    "bg-cyan-500",
                                    "bg-brand-500",
                                    "bg-rose-500",
                                ]
                                const textColors = [
                                    "text-purple-500",
                                    "text-blue-500",
                                    "text-emerald-500",
                                    "text-cyan-500",
                                    "text-brand-500",
                                    "text-rose-500",
                                ]
                                return (
                                    <div key={s.skill}>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-sm font-semibold text-foreground/80">{s.skill}</span>
                                            <span className={`text-sm font-bold ${textColors[i % textColors.length]}`}>{s.value}</span>
                                        </div>
                                        <div className="h-2 w-full bg-foreground/10 rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full ${colors[i % colors.length]} rounded-full`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${s.value}%` }}
                                                transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* ── Score vs Load Overlay Chart ── */}
            <motion.div variants={item} className="glass p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 bg-brand-500/10 rounded-lg">
                                <Activity className="h-4 w-4 text-brand-500" />
                            </div>
                            <h2 className="text-lg font-bold">Score vs Load Correlation</h2>
                        </div>
                        <p className="text-sm text-foreground/50">How your readiness score tracks against training load</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                        <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
                            AI Score
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block" />
                            Training Load
                        </span>
                    </div>
                </div>
                {loading ? <Skeleton className="h-64 w-full" /> : (
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="lineScore2" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#34d399" />
                                </linearGradient>
                                <linearGradient id="lineLoad2" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#818cf8" />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/20" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "currentColor", opacity: 0.5, fontSize: 12 }} dy={10} />
                            <YAxis yAxisId="left" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "currentColor", opacity: 0.5, fontSize: 12 }} />
                            {/* Width 0 prevents the hidden axis from taking 60px of empty space */}
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={false} width={0} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                wrapperStyle={{ fontSize: "12px", paddingTop: "16px", opacity: 0.7 }}
                            />
                            <Line yAxisId="left" type="monotone" dataKey="score" name="AI Score" stroke="url(#lineScore2)" strokeWidth={3} dot={{ r: 4, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }} />
                            <Line yAxisId="right" type="monotone" dataKey="load" name="Training Load" stroke="url(#lineLoad2)" strokeWidth={3} strokeDasharray="6 3" dot={{ r: 4, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </motion.div>
        </motion.div>
    )
}
