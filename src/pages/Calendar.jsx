import { useState, useEffect, useId } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
    CheckCircle2,
    Clock,
    XCircle,
    Flame,
    Dumbbell,
    Sparkles,
    Trash2,
    CalendarCheck,
    Zap,
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

const TYPE_COLORS = {
    Strength: "bg-brand-500/20 text-brand-400 border-brand-500/30",
    Cardio: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    HIIT: "bg-red-500/20 text-red-400 border-red-500/30",
    Mobility: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    Speed: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    Rest: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    Competition: "bg-amber-500/20 text-amber-400 border-amber-500/30",
}

export function Calendar() {
    const titleInputId = useId()
    const timeInputId = useId()
    const typeSelectId = useId()
    const durationInputId = useId()
    const loadInputId = useId()
    const notesInputId = useId()

    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    const token = userInfo?.token

    const [currentDate, setCurrentDate] = useState(new Date())
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedDateStr, setSelectedDateStr] = useState(() => {
        const d = new Date()
        return d.toISOString().split('T')[0]
    })
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [newEvent, setNewEvent] = useState({
        title: "",
        time: "08:00 AM",
        type: "Strength",
        durationMinutes: 60,
        targetLoad: 400,
        notes: "",
    })

    const fetchEvents = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${API_BASE}/schedule`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setEvents(res.data)
        } catch (err) {
            console.error("Failed to load schedule:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) fetchEvents()
    }, [token])

    // Month Navigation
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }
    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const monthName = currentDate.toLocaleString("default", { month: "long" })

    // Build calendar matrix
    const firstDayIndex = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const calendarDays = []

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const d = daysInPrevMonth - i
        const monthStr = String(month === 0 ? 12 : month).padStart(2, "0")
        const y = month === 0 ? year - 1 : year
        calendarDays.push({
            day: d,
            dateStr: `${y}-${monthStr}-${String(d).padStart(2, "0")}`,
            isCurrentMonth: false,
        })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        const monthStr = String(month + 1).padStart(2, "0")
        calendarDays.push({
            day: i,
            dateStr: `${year}-${monthStr}-${String(i).padStart(2, "0")}`,
            isCurrentMonth: true,
        })
    }

    // Next month filler days to complete grid
    const remainingSlots = 42 - calendarDays.length
    for (let i = 1; i <= remainingSlots; i++) {
        const monthStr = String(month + 2 > 12 ? 1 : month + 2).padStart(2, "0")
        const y = month + 2 > 12 ? year + 1 : year
        calendarDays.push({
            day: i,
            dateStr: `${y}-${monthStr}-${String(i).padStart(2, "0")}`,
            isCurrentMonth: false,
        })
    }

    const handleCreateEvent = async (e) => {
        e.preventDefault()
        if (!newEvent.title.trim()) return

        try {
            const payload = {
                ...newEvent,
                date: selectedDateStr,
            }
            const res = await axios.post(`${API_BASE}/schedule`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setEvents((prev) => [...prev, res.data])
            setIsAddModalOpen(false)
            setNewEvent({
                title: "",
                time: "08:00 AM",
                type: "Strength",
                durationMinutes: 60,
                targetLoad: 400,
                notes: "",
            })
        } catch (err) {
            console.error("Failed to add schedule item:", err)
        }
    }

    const handleStatusChange = async (eventId, newStatus) => {
        try {
            await axios.patch(
                `${API_BASE}/schedule/${eventId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setEvents((prev) =>
                prev.map((ev) => (ev._id === eventId ? { ...ev, status: newStatus } : ev))
            )
        } catch (err) {
            console.error("Failed to update status:", err)
        }
    }

    const handleDeleteEvent = async (eventId) => {
        try {
            await axios.delete(`${API_BASE}/schedule/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setEvents((prev) => prev.filter((ev) => ev._id !== eventId))
        } catch (err) {
            console.error("Failed to delete event:", err)
        }
    }

    const todayStr = new Date().toISOString().split("T")[0]
    const selectedDayEvents = events.filter((ev) => ev.date === selectedDateStr)

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="p-6 md:p-8 max-w-7xl mx-auto space-y-8"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent flex items-center gap-3">
                        <CalendarIcon className="h-8 w-8 text-brand-500" />
                        Training Calendar & Periodization
                    </h1>
                    <p className="text-foreground/60 text-sm mt-1">
                        Organize your training cycles, schedule upcoming routines, and track completed sessions.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setSelectedDateStr(todayStr)
                            setCurrentDate(new Date())
                        }}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border/40 transition-colors"
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02]"
                    >
                        <Plus className="h-4 w-4" />
                        Schedule Workout
                    </button>
                </div>
            </motion.div>

            {/* Main Calendar View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar Grid Card */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 glass rounded-3xl p-6 border border-border/40 shadow-xl space-y-6"
                >
                    {/* Month Navigator */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            {monthName} <span className="text-brand-500 font-extrabold">{year}</span>
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={prevMonth}
                                aria-label="Previous month"
                                className="p-2 rounded-xl hover:bg-foreground/5 transition-colors border border-border/30"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={nextMonth}
                                aria-label="Next month"
                                className="p-2 rounded-xl hover:bg-foreground/5 transition-colors border border-border/30"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Day Names Header */}
                    <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-foreground/50 tracking-wider uppercase">
                        <span>Sun</span>
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((item, idx) => {
                            const isToday = item.dateStr === todayStr
                            const isSelected = item.dateStr === selectedDateStr
                            const dayEvents = events.filter((ev) => ev.date === item.dateStr)

                            return (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedDateStr(item.dateStr)}
                                    className={`min-h-[75px] md:min-h-[85px] p-2 rounded-2xl border text-left flex flex-col justify-between transition-all relative ${
                                        isSelected
                                            ? "border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/30"
                                            : isToday
                                            ? "border-brand-500/50 bg-foreground/5"
                                            : item.isCurrentMonth
                                            ? "border-border/30 hover:border-brand-500/40 bg-card/40"
                                            : "border-border/10 opacity-30 hover:opacity-70 bg-transparent"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={`text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center ${
                                                isToday
                                                    ? "bg-brand-500 text-white shadow-md shadow-brand-500/30"
                                                    : "text-foreground/80"
                                            }`}
                                        >
                                            {item.day}
                                        </span>
                                        {dayEvents.length > 0 && (
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400">
                                                {dayEvents.length}
                                            </span>
                                        )}
                                    </div>

                                    {/* Preview Dots / Tags */}
                                    <div className="space-y-1 mt-1 overflow-hidden">
                                        {dayEvents.slice(0, 2).map((ev) => (
                                            <div
                                                key={ev._id}
                                                className={`text-[9px] truncate px-1.5 py-0.5 rounded-md font-medium border ${
                                                    TYPE_COLORS[ev.type] || "bg-foreground/10 text-foreground"
                                                }`}
                                            >
                                                {ev.title}
                                            </div>
                                        ))}
                                        {dayEvents.length > 2 && (
                                            <span className="text-[9px] text-foreground/40 font-semibold block text-center">
                                                +{dayEvents.length - 2} more
                                            </span>
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </motion.div>

                {/* Selected Date Details Panel */}
                <motion.div
                    variants={itemVariants}
                    className="glass rounded-3xl p-6 border border-border/40 shadow-xl space-y-6 flex flex-col justify-between"
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-border/30 pb-4">
                            <div>
                                <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider">
                                    Selected Schedule
                                </span>
                                <h3 className="text-lg font-bold">
                                    {new Date(selectedDateStr + "T00:00:00").toLocaleDateString("en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="p-2 rounded-xl bg-brand-500/10 text-brand-400 hover:bg-brand-500 hover:text-white transition-all"
                                title="Add to this date"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>

                        {/* List of events on this day */}
                        <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
                            {selectedDayEvents.length === 0 ? (
                                <div className="text-center py-12 space-y-3">
                                    <CalendarCheck className="h-10 w-10 mx-auto text-foreground/20" />
                                    <p className="text-sm text-foreground/50">
                                        No workouts scheduled for this day.
                                    </p>
                                    <button
                                        onClick={() => setIsAddModalOpen(true)}
                                        className="text-xs font-semibold text-brand-500 hover:underline"
                                    >
                                        + Schedule a session now
                                    </button>
                                </div>
                            ) : (
                                selectedDayEvents.map((ev) => (
                                    <div
                                        key={ev._id}
                                        className={`p-4 rounded-2xl border transition-all ${
                                            ev.status === "completed"
                                                ? "bg-emerald-500/10 border-emerald-500/30"
                                                : ev.status === "skipped"
                                                ? "bg-red-500/10 border-red-500/30 opacity-70"
                                                : "bg-card/60 border-border/40"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <span
                                                    className={`inline-block text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full border mb-1.5 ${
                                                        TYPE_COLORS[ev.type] || "bg-foreground/10"
                                                    }`}
                                                >
                                                    {ev.type}
                                                </span>
                                                <h4 className="font-bold text-sm text-foreground">{ev.title}</h4>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteEvent(ev._id)}
                                                className="text-foreground/30 hover:text-red-400 p-1 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-foreground/60 mt-2">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5 text-brand-500" />
                                                {ev.time} ({ev.durationMinutes}m)
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Flame className="h-3.5 w-3.5 text-orange-500" />
                                                {ev.targetLoad} load
                                            </span>
                                        </div>

                                        {ev.notes && (
                                            <p className="text-xs text-foreground/70 mt-2 italic bg-foreground/5 p-2 rounded-xl border border-border/20">
                                                "{ev.notes}"
                                            </p>
                                        )}

                                        {/* Status Toggle Buttons */}
                                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/20">
                                            <span className="text-[11px] font-semibold text-foreground/50">
                                                Status: <strong className="capitalize text-foreground">{ev.status}</strong>
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            ev._id,
                                                            ev.status === "completed" ? "scheduled" : "completed"
                                                        )
                                                    }
                                                    className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                                                        ev.status === "completed"
                                                            ? "bg-emerald-500 text-white border-emerald-500"
                                                            : "hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                                    }`}
                                                    title="Mark Completed"
                                                >
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            ev._id,
                                                            ev.status === "skipped" ? "scheduled" : "skipped"
                                                        )
                                                    }
                                                    className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                                                        ev.status === "skipped"
                                                            ? "bg-red-500 text-white border-red-500"
                                                            : "hover:bg-red-500/20 text-red-400 border-red-500/30"
                                                    }`}
                                                    title="Mark Skipped"
                                                >
                                                    <XCircle className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Periodization Summary */}
                    <div className="p-4 rounded-2xl bg-brand-500/5 border border-brand-500/20 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-brand-500">
                            <Sparkles className="h-4 w-4" />
                            Apex AI Periodization Tip
                        </div>
                        <p className="text-xs text-foreground/70 leading-relaxed">
                            Maintain a 3:1 load-to-recovery ratio. Ensure at least one active recovery or mobility session every 4 heavy training blocks.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Add Workout Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
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
                                    Schedule Training Session
                                </h3>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="p-1 rounded-lg hover:bg-foreground/10 text-foreground/60"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateEvent} className="space-y-4">
                                <div>
                                    <label htmlFor={titleInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                        Session Title *
                                    </label>
                                    <input
                                        id={titleInputId}
                                        type="text"
                                        required
                                        placeholder="e.g., Heavy Leg Day & Sprints"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor={timeInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                            Time
                                        </label>
                                        <input
                                            id={timeInputId}
                                            type="text"
                                            value={newEvent.time}
                                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={typeSelectId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                            Category
                                        </label>
                                        <select
                                            id={typeSelectId}
                                            value={newEvent.type}
                                            onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                        >
                                            <option value="Strength">Strength</option>
                                            <option value="Cardio">Cardio</option>
                                            <option value="HIIT">HIIT</option>
                                            <option value="Mobility">Mobility</option>
                                            <option value="Speed">Speed</option>
                                            <option value="Rest">Rest</option>
                                            <option value="Competition">Competition</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor={durationInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                            Duration (min)
                                        </label>
                                        <input
                                            id={durationInputId}
                                            type="number"
                                            value={newEvent.durationMinutes}
                                            onChange={(e) => setNewEvent({ ...newEvent, durationMinutes: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={loadInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                            Target Load Score
                                        </label>
                                        <input
                                            id={loadInputId}
                                            type="number"
                                            value={newEvent.targetLoad}
                                            onChange={(e) => setNewEvent({ ...newEvent, targetLoad: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor={notesInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                        Notes / Focus Areas
                                    </label>
                                    <textarea
                                        id={notesInputId}
                                        rows={2}
                                        placeholder="e.g., Focus on explosive hip drive in squat lockout"
                                        value={newEvent.notes}
                                        onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm resize-none"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="px-4 py-2 rounded-xl border border-border/40 text-sm font-semibold hover:bg-foreground/5"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-lg shadow-brand-500/20"
                                    >
                                        Save Schedule
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
export default Calendar
