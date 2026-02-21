import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User, Activity } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthLayout } from "../layouts/AuthLayout"

export function Signup() {
    const [showPassword, setShowPassword] = useState(false)
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [role, setRole] = useState("athlete")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!fullName.trim()) {
            setError("Please enter your full name.")
            return
        }

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address.")
            return
        }

        if (!password || password.length < 8) {
            setError("Password must be at least 8 characters.")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        setIsLoading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const { data } = await axios.post(
                'http://localhost:5001/api/auth/register',
                { name: fullName, email, password, role },
                config
            )

            localStorage.setItem('userInfo', JSON.stringify(data))
            navigate("/dashboard")
        } catch (error) {
            setError(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Join elite athletes training with ApexAI"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm font-medium"
                    >
                        {error}
                    </motion.div>
                )}

                <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                        Full Name
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-foreground/5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-medium"
                            placeholder="Sarah Chen"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                        Account Type
                    </label>
                    <div className="relative">
                        <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-foreground/5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-medium appearance-none"
                        >
                            <option value="athlete">Athlete</option>
                            <option value="coach">Coach</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-foreground/40">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-foreground/5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-medium"
                            placeholder="athlete@example.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-12 py-3 bg-foreground/5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-medium"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-foreground/40 hover:text-foreground/80 transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-foreground/5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-medium"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-500 hover:bg-brand-600 text-white dark:bg-brand-500 lg:mt-4 py-3 rounded-xl font-bold text-lg transition-transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Account...
                        </>
                    ) : (
                        "Create Account"
                    )}
                </button>
            </form>

            <div className="mt-8 relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-foreground/50">
                        Or sign up with
                    </span>
                </div>
            </div>

            <div className="mt-6">
                <button className="w-full flex items-center justify-center gap-3 py-3 border border-border rounded-xl hover:bg-foreground/5 transition-colors font-medium">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                </button>
            </div>

            <p className="mt-6 text-center text-sm text-foreground/70">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="font-semibold text-brand-500 hover:text-brand-600 transition-colors"
                >
                    Sign in instead
                </Link>
            </p>
        </AuthLayout>
    )
}
