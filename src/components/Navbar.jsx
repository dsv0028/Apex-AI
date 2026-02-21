import { Moon, Sun, Menu, X, Activity } from "lucide-react"
import { useState } from "react"
import { useTheme } from "./ThemeProvider"
import { Link, useNavigate } from "react-router-dom"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const { theme, setTheme } = useTheme()
    const navigate = useNavigate()

    const isLoggedIn = !!localStorage.getItem("userInfo")

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    const handleSignOut = () => {
        localStorage.removeItem("userInfo")
        navigate("/login")
    }

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "How It Works", href: "#how-it-works" },
        { name: "Testimonials", href: "#testimonials" },
    ]

    return (
        <nav className="fixed top-0 w-full z-50 glass border-b border-border/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <Activity className="h-8 w-8 text-brand-500" />
                        <span className="font-bold text-xl tracking-tight">ApexAI</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex items-center space-x-6">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-medium text-foreground/80 hover:text-brand-500 transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === "dark" ? (
                                    <Sun className="h-5 w-5" />
                                ) : (
                                    <Moon className="h-5 w-5" />
                                )}
                            </button>

                            {isLoggedIn ? (
                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/dashboard"
                                        className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-brand-500/25 active:scale-95"
                                    >
                                        Go to Dashboard
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="text-sm font-medium text-foreground/70 hover:text-red-500 transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-brand-500/25 active:scale-95"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                            {theme === "dark" ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden glass border-t border-border/40">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-500 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        <div className="px-3 py-3 space-y-2">
                            {isLoggedIn ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setIsOpen(false)}
                                        className="block text-center w-full bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-brand-500/25"
                                    >
                                        Go to Dashboard
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="block text-center w-full text-sm font-medium text-red-500 hover:bg-red-500/10 px-5 py-2.5 rounded-full transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-center w-full bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-brand-500/25"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
