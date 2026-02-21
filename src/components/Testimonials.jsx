import { motion } from "framer-motion"
import { Star } from "lucide-react"

export function Testimonials() {
    const testimonials = [
        {
            name: "Marcus Johnson",
            role: "Pro Sprinter",
            image: "https://i.pravatar.cc/150?img=11",
            quote: "ApexAI shaved 0.2 seconds off my 100m sprint time by perfectly calibrating my taper week. The injury prediction actually stopped me from pulling a hamstring.",
        },
        {
            name: "Sarah Chen",
            role: "Olympic Swimmer",
            image: "https://i.pravatar.cc/150?img=5",
            quote: "The deep analytics dashboard shows me exactly how my stroke power translates over distance. It's like having a world-class coach analyzing every meter.",
        },
        {
            name: "David Rodriguez",
            role: "Triathlete",
            image: "https://i.pravatar.cc/150?img=12",
            quote: "Balancing three sports used to lead to overtraining. ApexAI dynamically shifts my load based on daily fatigue scores. I've never felt fresher.",
        },
    ]

    return (
        <section id="testimonials" className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-brand-500/5 -skew-y-3 z-0 origin-top-left" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        Trusted by Elite Athletes
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-lg text-foreground/70"
                    >
                        Don't just take our word for it. See how ApexAI is revolutionizing global sports.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="glass p-8 rounded-3xl flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-amber-500 text-amber-500" />
                                    ))}
                                </div>
                                <p className="text-lg text-foreground/80 italic mb-8">
                                    "{testimonial.quote}"
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-14 h-14 rounded-full border-2 border-brand-500/50"
                                    loading="lazy"
                                />
                                <div>
                                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                                    <p className="text-sm text-foreground/60">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
