import { motion } from "framer-motion"
import { BrainCircuit, ActivitySquare, ShieldAlert, Utensils } from "lucide-react"

export function Features() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    }

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }

    const features = [
        {
            title: "AI Training Programs",
            description: "Dynamically adjusted workouts tailored to your specific goals, sport, and current fitness level.",
            icon: <BrainCircuit className="h-8 w-8 text-brand-500" />,
            color: "from-emerald-500/20 to-teal-500/5",
        },
        {
            title: "Deep Analytics",
            description: "Track speed, power, and endurance metrics over time with interactive, real-time charts.",
            icon: <ActivitySquare className="h-8 w-8 text-blue-500" />,
            color: "from-blue-500/20 to-cyan-500/5",
        },
        {
            title: "Injury Prediction",
            description: "Our algorithm detects overtraining fatigue and suggests immediate recovery protocols to prevent injuries.",
            icon: <ShieldAlert className="h-8 w-8 text-rose-500" />,
            color: "from-rose-500/20 to-pink-500/5",
        },
        {
            title: "Smart Diet Plans",
            description: "Automated macronutrient balancing and meal suggestions optimized for your exact training intensity.",
            icon: <Utensils className="h-8 w-8 text-amber-500" />,
            color: "from-amber-500/20 to-orange-500/5",
        },
    ]

    return (
        <section id="features" className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold text-sm mb-6"
                    >
                        Core Capabilities
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        Everything you need to reach your{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-600">
                            peak potential
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-lg text-foreground/70"
                    >
                        We go beyond standard generic plans. ApexAI learns your body
                        and adapts your entire lifecycle from training to recovery.
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={item}
                            whileHover={{ scale: 1.02 }}
                            className="glass p-8 rounded-3xl relative overflow-hidden transition-all group"
                        >
                            {/* Card glowing background effect */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                            />

                            <div className="relative z-10 flex flex-col gap-4">
                                <div className="h-16 w-16 rounded-2xl bg-background flex items-center justify-center shadow-lg border border-border/10">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mt-4">{feature.title}</h3>
                                <p className="text-foreground/70 leading-relaxed text-lg">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
