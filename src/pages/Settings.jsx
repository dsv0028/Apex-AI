import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
    User, Mail, FileText, Trophy, Target, Camera, Save,
    Bell, Moon, Sun, Lock, ChevronDown, Check, X, Plus,
    Dumbbell, Zap, HeartPulse,
} from "lucide-react"
import axios from "axios"
import { useTheme } from "../components/ThemeProvider"

const API_BASE = "http://localhost:5001/api"

const SPORTS = [
    "Football", "Basketball", "Tennis", "Swimming", "Running",
    "Cycling", "Weightlifting", "Boxing", "Cricket", "Badminton",
    "Volleyball", "Gymnastics", "Martial Arts", "Yoga", "Other",
]

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}
const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } },
}

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${checked ? "bg-brand-500" : "bg-foreground/20"}`}
        >
            <motion.span
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
                animate={{ x: checked ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        </button>
    )
}

// ─── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, iconColor = "text-brand-500", bgColor = "bg-brand-500/10", children }) {
    return (
        <motion.div variants={item} className="glass p-6 rounded-3xl space-y-5">
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 ${bgColor} rounded-xl`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <h2 className="text-lg font-bold">{title}</h2>
            </div>
            {children}
        </motion.div>
    )
}

// ─── Input Field ───────────────────────────────────────────────────────────────
function InputField({ label, value, onChange, type = "text", placeholder = "", disabled = false }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-foreground/70 mb-1.5">{label}</label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full bg-foreground/5 border border-border/50 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            />
        </div>
    )
}

// ─── Stat Slider ───────────────────────────────────────────────────────────────
function StatSlider({ label, value, onChange, color }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-foreground/70">{label}</label>
                <span className={`text-sm font-bold ${color}`}>{value}</span>
            </div>
            <input
                type="range" min={0} max={100} value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="w-full accent-brand-500 h-1.5 rounded-full cursor-pointer"
            />
        </div>
    )
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, type }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className={`fixed bottom-8 right-8 z-[999] px-5 py-3 rounded-2xl text-white font-semibold shadow-2xl flex items-center gap-2 ${type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
        >
            {type === "success" ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            {message}
        </motion.div>
    )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function Settings() {
    const { theme, setTheme } = useTheme()
    const fileRef = useRef(null)

    const userInfoString = localStorage.getItem("userInfo") || "{}"
    const userInfo = JSON.parse(userInfoString)
    const token = userInfo?.token
    const headers = { Authorization: `Bearer ${token}` }

    // Profile state
    const [name, setName] = useState(userInfo?.name || "")
    const [email] = useState(userInfo?.email || "")
    const [bio, setBio] = useState("")
    const [sport, setSport] = useState("")
    const [goals, setGoals] = useState([])
    const [goalInput, setGoalInput] = useState("")
    const [profileImage, setProfileImage] = useState("")
    const [stats, setStats] = useState({ stamina: 70, speed: 65, strength: 60 })

    // Notification state
    const [notifications, setNotifications] = useState({
        workoutReminders: true,
        performanceAlerts: true,
        coachMessages: true,
        weeklyReport: false,
    })

    // Password state
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    // UI state
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState(null)
    const [sportOpen, setSportOpen] = useState(false)

    // ── Load profile on mount ──
    useEffect(() => {
        if (!token) return
        axios.get(`${API_BASE}/profile/me`, { headers })
            .then(({ data }) => {
                setName(data.name || "")
                setBio(data.bio || "")
                setSport(data.sport || "")
                setGoals(data.goals || [])
                setProfileImage(data.profileImage || "")
                if (data.stats) setStats(data.stats)
                if (data.notifications) setNotifications(data.notifications)
            })
            .catch(() => {/* use defaults */ })
    }, [token])

    const showToast = (message, type = "success") => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    // ── Image Upload ──
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onloadend = () => setProfileImage(reader.result)
        reader.readAsDataURL(file)
    }

    // ── Goals ──
    const addGoal = () => {
        const trimmed = goalInput.trim()
        if (trimmed && !goals.includes(trimmed)) {
            setGoals([...goals, trimmed])
            setGoalInput("")
        }
    }
    const removeGoal = (g) => setGoals(goals.filter(x => x !== g))

    // ── Save Profile ──
    const handleSaveProfile = async () => {
        setSaving(true)
        try {
            const { data } = await axios.put(`${API_BASE}/profile/me`, {
                name, bio, sport, goals, profileImage, stats, notifications,
            }, { headers })
            // Update localStorage with latest name + image so navbar reflects changes
            const updated = { ...userInfo, name: data.name, profileImage: data.profileImage || "" }
            localStorage.setItem("userInfo", JSON.stringify(updated))
            // Notify other components (DashboardLayout) to re-read from localStorage
            window.dispatchEvent(new Event("profile-updated"))
            showToast("Profile saved successfully!")
        } catch {
            showToast("Failed to save profile.", "error")
        } finally {
            setSaving(false)
        }
    }

    // ── Change Password ──
    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            showToast("Passwords do not match.", "error")
            return
        }
        setSaving(true)
        try {
            await axios.put(`${API_BASE}/profile/password`, { currentPassword, newPassword }, { headers })
            showToast("Password updated!")
            setCurrentPassword(""); setNewPassword(""); setConfirmPassword("")
        } catch {
            showToast("Failed to update password.", "error")
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-6">

                {/* ── Header ── */}
                <motion.div variants={item}>
                    <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
                    <p className="text-foreground/60 mt-1">Manage your account, preferences, and goals.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── Left Column: Avatar + Quick Info ── */}
                    <div className="space-y-6">

                        {/* Avatar Card */}
                        <motion.div variants={item} className="glass p-6 rounded-3xl flex flex-col items-center text-center gap-4">
                            <div className="relative group">
                                <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-brand-500/40 shadow-xl shadow-brand-500/20">
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full bg-brand-500/20 flex items-center justify-center">
                                            <User className="h-14 w-14 text-brand-500/60" />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileRef.current?.click()}
                                    className="absolute bottom-0 right-0 p-2 bg-brand-500 rounded-full text-white shadow-lg hover:bg-brand-600 transition-colors"
                                >
                                    <Camera className="h-4 w-4" />
                                </button>
                                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </div>
                            <div>
                                <p className="font-bold text-lg">{name || "Your Name"}</p>
                                <p className="text-sm text-foreground/50">{email}</p>
                                <span className={`mt-1 inline-block text-xs px-3 py-1 rounded-full font-semibold capitalize ${userInfo?.role === "coach" ? "bg-purple-500/15 text-purple-500" : "bg-brand-500/15 text-brand-500"}`}>
                                    {userInfo?.role || "athlete"}
                                </span>
                            </div>
                            {sport && (
                                <div className="flex items-center gap-1.5 text-sm text-foreground/60">
                                    <Trophy className="h-4 w-4 text-orange-400" />
                                    <span>{sport}</span>
                                </div>
                            )}
                        </motion.div>

                        {/* Appearance */}
                        <SectionCard title="Appearance" icon={theme === "dark" ? Moon : Sun} iconColor="text-yellow-500" bgColor="bg-yellow-500/10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold">Dark Mode</p>
                                    <p className="text-xs text-foreground/50">Switch between light and dark theme</p>
                                </div>
                                <Toggle
                                    checked={theme === "dark"}
                                    onChange={(val) => setTheme(val ? "dark" : "light")}
                                />
                            </div>
                        </SectionCard>

                    </div>

                    {/* ── Right Column: Forms ── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Personal Info */}
                        <SectionCard title="Personal Information" icon={User} iconColor="text-brand-500" bgColor="bg-brand-500/10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField label="Full Name" value={name} onChange={setName} placeholder="Your full name" />
                                <InputField label="Email" value={email} onChange={() => { }} disabled placeholder="Email" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground/70 mb-1.5">Bio</label>
                                <textarea
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                    placeholder="Tell us a little about yourself..."
                                    rows={3}
                                    className="w-full bg-foreground/5 border border-border/50 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none transition"
                                />
                            </div>

                            {/* Sport Selector */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-foreground/70 mb-1.5">Sport</label>
                                <button
                                    onClick={() => setSportOpen(!sportOpen)}
                                    className="w-full flex items-center justify-between bg-foreground/5 border border-border/50 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition"
                                >
                                    <span className={sport ? "" : "text-foreground/40"}>{sport || "Select your sport"}</span>
                                    <ChevronDown className={`h-4 w-4 transition-transform ${sportOpen ? "rotate-180" : ""}`} />
                                </button>
                                {sportOpen && (
                                    <div className="absolute z-20 mt-1 w-full glass border border-border/40 rounded-2xl shadow-xl overflow-hidden">
                                        <div className="max-h-52 overflow-y-auto p-2 grid grid-cols-2 gap-1">
                                            {SPORTS.map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => { setSport(s); setSportOpen(false) }}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors text-left ${sport === s ? "bg-brand-500 text-white" : "hover:bg-foreground/5"}`}
                                                >
                                                    {sport === s && <Check className="h-3.5 w-3.5" />}
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </SectionCard>

                        {/* Goals */}
                        <SectionCard title="Training Goals" icon={Target} iconColor="text-emerald-500" bgColor="bg-emerald-500/10">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={goalInput}
                                    onChange={e => setGoalInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && addGoal()}
                                    placeholder='e.g. "Run 5km in under 25 min"'
                                    className="flex-1 bg-foreground/5 border border-border/50 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition"
                                />
                                <button
                                    onClick={addGoal}
                                    className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-colors flex items-center gap-1"
                                >
                                    <Plus className="h-4 w-4" /> Add
                                </button>
                            </div>
                            {goals.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {goals.map(g => (
                                        <div key={g} className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full text-sm font-semibold">
                                            <Trophy className="h-3.5 w-3.5" />
                                            {g}
                                            <button onClick={() => removeGoal(g)} className="ml-1 hover:text-red-500 transition-colors">
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {goals.length === 0 && (
                                <p className="text-sm text-foreground/40 italic">No goals set yet. Add your first training goal!</p>
                            )}
                        </SectionCard>

                        {/* Athlete Stats */}
                        <SectionCard title="Athlete Stats" icon={Dumbbell} iconColor="text-blue-500" bgColor="bg-blue-500/10">
                            <p className="text-xs text-foreground/50 -mt-2 mb-1">These are used to generate your personalized AI training plans.</p>
                            <div className="space-y-4">
                                <StatSlider label="Stamina" value={stats.stamina} color="text-emerald-500" onChange={v => setStats(s => ({ ...s, stamina: v }))} />
                                <StatSlider label="Speed" value={stats.speed} color="text-blue-500" onChange={v => setStats(s => ({ ...s, speed: v }))} />
                                <StatSlider label="Strength" value={stats.strength} color="text-orange-500" onChange={v => setStats(s => ({ ...s, strength: v }))} />
                            </div>
                        </SectionCard>

                        {/* Notifications */}
                        <SectionCard title="Notifications" icon={Bell} iconColor="text-purple-500" bgColor="bg-purple-500/10">
                            {[
                                { key: "workoutReminders", label: "Workout Reminders", desc: "Daily reminders for scheduled sessions" },
                                { key: "performanceAlerts", label: "Performance Alerts", desc: "Alerts when your AI score changes significantly" },
                                { key: "coachMessages", label: "Coach Messages", desc: "Notifications from your assigned coach" },
                                { key: "weeklyReport", label: "Weekly Report", desc: "Summary of your week every Sunday" },
                            ].map(({ key, label, desc }) => (
                                <div key={key} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                                    <div>
                                        <p className="text-sm font-semibold">{label}</p>
                                        <p className="text-xs text-foreground/50">{desc}</p>
                                    </div>
                                    <Toggle
                                        checked={notifications[key]}
                                        onChange={val => setNotifications(n => ({ ...n, [key]: val }))}
                                    />
                                </div>
                            ))}
                        </SectionCard>

                        {/* Change Password */}
                        <SectionCard title="Change Password" icon={Lock} iconColor="text-rose-500" bgColor="bg-rose-500/10">
                            <div className="space-y-3">
                                <InputField label="Current Password" type="password" value={currentPassword} onChange={setCurrentPassword} placeholder="••••••••" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <InputField label="New Password" type="password" value={newPassword} onChange={setNewPassword} placeholder="••••••••" />
                                    <InputField label="Confirm New Password" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" />
                                </div>
                            </div>
                            <button
                                onClick={handleChangePassword}
                                disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                                className="mt-1 w-full py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                <Lock className="h-4 w-4" /> Update Password
                            </button>
                        </SectionCard>

                        {/* Save Button */}
                        <motion.div variants={item}>
                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="w-full py-4 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-brand-500/25"
                            >
                                {saving ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                        <Zap className="h-5 w-5" />
                                    </motion.div>
                                ) : (
                                    <Save className="h-5 w-5" />
                                )}
                                {saving ? "Saving..." : "Save All Changes"}
                            </button>
                        </motion.div>

                    </div>
                </div>
            </motion.div>

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} />}
        </>
    )
}
