import { motion } from "framer-motion"
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts"
import {
    Activity,
    Flame,
    HeartPulse,
    TrendingUp,
    Clock,
    ChevronRight,
    Dumbbell,
} from "lucide-react"

const weeklyData = [
    { day: "Mon", score: 65, load: 400 },
    { day: "Tue", score: 72, load: 550 },
    { day: "Wed", score: 68, load: 480 },
    { day: "Thu", score: 85, load: 700 },
    { day: "Fri", score: 82, load: 650 },
    { day: "Sat", score: 90, load: 800 },
    { day: "Sun", score: 95, load: 850 },
]

const upcomingSessions = [
    {
        id: 1,
        title: "High-Intensity Interval Training",
        time: "Today, 4:00 PM",
        duration: "45 min",
        intensity: "High",
    },
    {
        id: 2,
        title: "Active Recovery & Mobility",
        time: "Tomorrow, 8:00 AM",
        duration: "30 min",
        intensity: "Low",
    },
    {
        id: 3,
        title: "Strength & Power (Lower Body)",
        time: "Wed, 5:30 PM",
        duration: "60 min",
        intensity: "Medium",
    },
]


const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
}

export function Dashboard() {
    // Retrieve user data securely from local storage
    const userInfoString = localStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

    // Extract first name or fallback to a default
    const firstName = userInfo?.name?.split(' ')[0] || 'Athlete';

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-7xl mx-auto space-y-6"
        >
            <motion.div variants={itemVariants} className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, {firstName}</h1>
                <p className="text-foreground/60 mt-1">Here's your training overview for today.</p>
            </motion.div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Performance Score */}
                <motion.div variants={itemVariants} className="glass p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="h-16 w-16 text-brand-500" />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-brand-500/10 rounded-xl">
                            <TrendingUp className="h-5 w-5 text-brand-500" />
                        </div>
                        <h3 className="font-semibold text-foreground/80">AI Readiness</h3>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-foreground">95</span>
                        <span className="text-sm text-brand-500 font-medium mb-1">/100</span>
                    </div>
                    <p className="text-sm text-foreground/60 mt-2">Optimal condition for high intensity</p>
                </motion.div>

                {/* Calories Burned */}
                <motion.div variants={itemVariants} className="glass p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Flame className="h-16 w-16 text-orange-500" />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-orange-500/10 rounded-xl">
                            <Flame className="h-5 w-5 text-orange-500" />
                        </div>
                        <h3 className="font-semibold text-foreground/80">Active Calories</h3>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-foreground">2,840</span>
                        <span className="text-sm text-foreground/50 font-medium mb-1">kcal</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-4 w-4 text-brand-500" />
                        <p className="text-sm text-brand-500 font-medium">+12% vs last week</p>
                    </div>
                </motion.div>

                {/* Injury Risk */}
                <motion.div variants={itemVariants} className="glass p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <HeartPulse className="h-16 w-16 text-emerald-500" />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-emerald-500/10 rounded-xl">
                            <HeartPulse className="h-5 w-5 text-emerald-500" />
                        </div>
                        <h3 className="font-semibold text-foreground/80">Injury Risk</h3>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-emerald-500">Low</span>
                    </div>
                    <div className="mt-3 h-2 w-full bg-border/50 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-1/5 rounded-full"></div>
                    </div>
                    <p className="text-sm text-foreground/60 mt-2">Recovery metrics look solid</p>
                </motion.div>

                {/* Training Load */}
                <motion.div variants={itemVariants} className="glass p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Dumbbell className="h-16 w-16 text-blue-500" />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-xl">
                            <Dumbbell className="h-5 w-5 text-blue-500" />
                        </div>
                        <h3 className="font-semibold text-foreground/80">Weekly Load</h3>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-foreground">3.2k</span>
                    </div>
                    <div className="mt-3 h-2 w-full bg-border/50 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-3/4 rounded-full"></div>
                    </div>
                    <p className="text-sm text-foreground/60 mt-2">75% of target capacity</p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <motion.div variants={itemVariants} className="lg:col-span-2 glass p-6 rounded-3xl flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Performance Trend</h2>
                            <p className="text-sm text-foreground/60">Your AI-calculated readiness vs training load</p>
                        </div>
                        <select className="bg-foreground/5 border border-border/50 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50">
                            <option>This Week</option>
                            <option>Last Week</option>
                            <option>Past Month</option>
                        </select>
                    </div>

                    <div className="flex-1 w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/30" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    yAxisId="left"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--tw-colors-background)',
                                        borderColor: 'var(--tw-colors-border)',
                                        borderRadius: '16px',
                                        boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)'
                                    }}
                                    itemStyle={{ color: 'var(--tw-colors-foreground)' }}
                                    labelStyle={{ color: 'var(--tw-colors-foreground)', opacity: 0.7, marginBottom: '4px' }}
                                />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="score"
                                    name="Readiness Score"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorScore)"
                                />
                                <Area
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="load"
                                    name="Training Load"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorLoad)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Upcoming Sessions */}
                <motion.div variants={itemVariants} className="glass p-6 rounded-3xl flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-foreground">Upcoming Sessions</h2>
                        <button className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">
                            View All
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col gap-4">
                        {upcomingSessions.map((session) => (
                            <div
                                key={session.id}
                                className="p-4 rounded-2xl bg-foreground/5 border border-border/50 hover:bg-foreground/10 transition-colors cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-foreground group-hover:text-brand-500 transition-colors">{session.title}</h3>
                                    <div className={`text-xs font-bold px-2 py-1 rounded-md ${session.intensity === 'High' ? 'bg-red-500/10 text-red-500' :
                                        session.intensity === 'Medium' ? 'bg-orange-500/10 text-orange-500' :
                                            'bg-emerald-500/10 text-emerald-500'
                                        }`}>
                                        {session.intensity}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-foreground/60">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        <span>{session.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 focus:outline-none">
                                        <Activity className="h-4 w-4" />
                                        <span>{session.duration}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="mt-6 w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]">
                        Start Next Workout <ChevronRight className="h-5 w-5" />
                    </button>
                </motion.div>
            </div>
        </motion.div>
    )
}
