import { motion } from "framer-motion"
import { Activity } from "lucide-react"
import { Link } from "react-router-dom"

export function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen flex selection:bg-brand-500/30">
            {/* Left Form Area */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[480px] xl:w-[560px] bg-background">
                <div className="mx-auto w-full max-w-sm lg:max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link to="/" className="flex items-center gap-2 mb-12 group w-fit">
                            <Activity className="h-8 w-8 text-brand-500 group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-2xl tracking-tight">ApexAI</span>
                        </Link>

                        <h2 className="text-3xl font-extrabold tracking-tight mb-2">
                            {title}
                        </h2>
                        <p className="text-foreground/60 mb-8">{subtitle}</p>

                        {children}
                    </motion.div>
                </div>
            </div>

            {/* Right Promotional Image Area */}
            <div className="hidden lg:flex flex-1 relative bg-zinc-900 border-l border-border/10 overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-10" />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                        x: [0, 50, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-500/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.6, 0.3],
                        x: [0, -50, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[150px]"
                />

                <div className="relative z-20 max-w-xl text-center px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="glass p-10 rounded-3xl"
                    >
                        <h3 className="text-3xl font-bold text-white mb-6">
                            "The most advanced sports intelligence platform on the planet."
                        </h3>
                        <div className="flex items-center justify-center gap-4">
                            <img
                                src="https://i.pravatar.cc/150?img=11"
                                alt="Profile"
                                className="w-12 h-12 rounded-full border-2 border-brand-500"
                            />
                            <div className="text-left">
                                <p className="text-white font-semibold">Elite Athlete</p>
                                <p className="text-white/60 text-sm">Pro Sprinter</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
