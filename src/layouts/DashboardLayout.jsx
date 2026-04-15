import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Activity,
    LayoutDashboard,
    Dumbbell,
    LineChart,
    Settings,
    Menu,
    X,
    Bell,
    Sun,
    Moon,
    LogOut,
    ChevronDown,
    Trophy,
} from "lucide-react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useTheme } from "../components/ThemeProvider"

const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Workouts", href: "/dashboard/workouts", icon: Dumbbell },
    { name: "Analytics", href: "/dashboard/analytics", icon: LineChart },
    { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const { theme, setTheme } = useTheme()
    const location = useLocation()
    const navigate = useNavigate()

    const [profile, setProfile] = useState(() => {
        const s = localStorage.getItem('userInfo')
        return s ? JSON.parse(s) : {}
    })

    // Re-read from localStorage whenever Settings saves
    useEffect(() => {
        const onUpdate = () => {
            const s = localStorage.getItem('userInfo')
            if (s) setProfile(JSON.parse(s))
        }
        window.addEventListener('profile-updated', onUpdate)
        return () => window.removeEventListener('profile-updated', onUpdate)
    }, [])

    const userName = profile?.name || 'Athlete'
    const userShortName = profile?.name
        ? `${profile.name.split(' ')[0]} ${profile.name.split(' ').length > 1 ? profile.name.split(' ')[1][0] + '.' : ''}`.trim()
        : 'Athlete'
    const userEmail = profile?.email || ''
    const profileImage = profile?.profileImage || ''

    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

    const handleSignOut = () => {
        localStorage.removeItem('userInfo')
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row selection:bg-brand-500/30">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 glass border-b border-border/40 sticky top-0 z-50">
                <Link to="/" className="flex items-center gap-2">
                    <Activity className="h-6 w-6 text-brand-500" />
                    <span className="font-bold text-xl tracking-tight">ApexAI</span>
                </Link>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: isSidebarOpen ? 0 : window.innerWidth >= 768 ? 0 : -300 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed md:sticky top-0 left-0 z-[60] md:z-50 h-screen w-64 glass border-r border-border/40 flex flex-col"
            >
                <Link to="/" className="p-6 hidden md:flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Activity className="h-8 w-8 text-brand-500" />
                    <span className="font-bold text-2xl tracking-tight">ApexAI</span>
                </Link>

                <nav className="flex-1 px-4 py-8 md:py-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/25"
                                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                                    }`}
                            >
                                <item.icon className={`h-5 w-5 ${isActive ? "text-white" : ""}`} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-border/40">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-500/10 transition-colors font-medium"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen relative">
                {/* Top Navbar (Desktop) */}
                <header className="hidden md:flex sticky top-0 z-40 h-20 items-center justify-end px-8 glass border-b border-border/40">
                    <div className="flex items-center gap-6">
                        <button className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <Bell className="h-5 w-5 text-foreground/70" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                            {theme === "dark" ? (
                                <Sun className="h-5 w-5 text-foreground/70" />
                            ) : (
                                <Moon className="h-5 w-5 text-foreground/70" />
                            )}
                        </button>

                        <div className="h-8 w-[1px] bg-border/40"></div>

                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors pr-3"
                            >
                                <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-brand-500 flex-shrink-0">
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full bg-brand-500/20 flex items-center justify-center text-brand-500 font-bold text-sm">
                                            {userName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm font-semibold max-w-[100px] truncate">
                                    {userShortName}
                                </span>
                                <ChevronDown className="h-4 w-4 text-foreground/50" />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-48 glass rounded-2xl border border-border/40 shadow-xl overflow-hidden z-50"
                                    >
                                        <div className="p-2">
                                            <div className="px-4 py-2 border-b border-border/40 mb-2">
                                                <p className="text-sm font-semibold">{userName}</p>
                                                <p className="text-xs text-foreground/50 truncate">
                                                    {userEmail}
                                                </p>
                                            </div>
                                            <Link
                                                to="/dashboard/settings"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="block px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/5 rounded-lg transition-colors"
                                            >
                                                Account Settings
                                            </Link>
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden pt-24 md:pt-8 w-full max-w-[100vw]">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
