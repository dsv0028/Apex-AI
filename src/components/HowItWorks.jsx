import { motion } from "framer-motion"
import { Target, Activity, Trophy } from "lucide-react"

export function HowItWorks() {
    const steps = [
        {
            title: "Set Your Baseline",
            description: "Complete a brief assessment. Our AI analyzes your current fitness level, sport, and goals.",
            icon: <Target className="h-6 w-6 text-white" />,
            color: "bg-blue-500",
        },
        {
            title: "Train with Real-Time Feedback",
            description: "Follow dynamically generated daily routines. Log your sets, and the AI instantly adapts tomorrow's plan.",
            icon: <Activity className="h-6 w-6 text-white" />,
            color: "bg-brand-500",
        },
        {
            title: "Achieve Peak Performance",
            description: "Watch your stats soar. We optimize your taper and recovery so you peak exactly on competition day.",
            icon: <Trophy className="h-6 w-6 text-white" />,
            color: "bg-amber-500",
        },
    ]

    return (
        <section id="how-it-works" className="py-24 bg-foreground/[0.02]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        How <span className="text-brand-500">ApexAI</span> Works
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-lg text-foreground/70"
                    >
                        Three simple steps to unlock your athletic dominance.
                    </motion.p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Vertical Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

                    <div className="space-y-12">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: idx * 0.2 }}
                                className={`relative flex items-center ${idx % 2 === 0 ? "md:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Center Icon */}
                                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 border-background z-10 flex items-center justify-center shadow-lg transition-transform hover:scale-110" style={{ backgroundColor: `var(--color-${step.color.split('-')[1]}-500)` }} />

                                {/* Specific override for tailwind dynamic classes above: */}
                                <div className={`absolute left-8 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 border-background ${step.color} z-10 flex items-center justify-center shadow-lg transition-transform hover:scale-110`}>
                                    {step.icon}
                                </div>

                                {/* Content Card */}
                                <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${idx % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"
                                    }`}>
                                    <div className="glass p-8 rounded-3xl hover:border-brand-500/30 transition-colors">
                                        <span className="text-sm font-bold text-brand-500 mb-2 block">
                                            Step {idx + 1}
                                        </span>
                                        <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                                        <p className="text-foreground/70 text-lg">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
