import { motion } from "framer-motion"
import { ArrowRight, PlayCircle } from "lucide-react"
import { Link } from "react-router-dom"

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 w-full h-full bg-background z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, 100, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-brand-500/30 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, -100, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute bottom-[20%] right-[20%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[150px]"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
                >
                    <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
                    <span className="text-sm font-medium">ApexAI v2.0 is now live</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
                >
                    Train Smarter. <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-600">
                        Perform Better.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-2xl mx-auto text-xl text-foreground/70 mb-12"
                >
                    The ultimate AI-powered training platform for elite athletes.
                    Personalized workouts, real-time analytics, and injury prediction
                    all in one place.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-foreground text-background dark:bg-brand-500 dark:text-white rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-xl flex items-center justify-center gap-2">
                        Start Free Trial <ArrowRight className="h-5 w-5" />
                    </Link>

                    <button className="w-full sm:w-auto px-8 py-4 glass rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                        <PlayCircle className="h-5 w-5 text-brand-500" /> Watch Demo
                    </button>
                </motion.div>

                {/* Floating Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
                >
                    {[
                        { label: "Active Athletes", value: "50k+" },
                        { label: "AI Workouts", value: "1M+" },
                        { label: "Injury Prevented", value: "94%" },
                        { label: "Performance Boost", value: "32%" },
                    ].map((stat, i) => (
                        <div key={i} className="glass rounded-2xl p-6 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-foreground mb-1">{stat.value}</span>
                            <span className="text-sm font-medium text-foreground/60">{stat.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

