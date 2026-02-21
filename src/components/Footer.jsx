import { Activity, Twitter, Instagram, Linkedin, Github } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-background/50 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand & Mission */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="h-6 w-6 text-brand-500" />
                            <span className="font-bold text-xl tracking-tight">ApexAI</span>
                        </div>
                        <p className="text-foreground/60 text-sm leading-relaxed mb-6">
                            The next-generation intelligence platform designed exclusively for professional athletes and ambitious amateurs.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="text-foreground/40 hover:text-brand-500 transition-colors"
                                >
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-3">
                            {["Features", "Pricing", "Integrations", "Changelog"].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-foreground/60 hover:text-brand-500 text-sm transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-3">
                            {["About Us", "Careers", "Blog", "Contact"].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-foreground/60 hover:text-brand-500 text-sm transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-foreground/60 hover:text-brand-500 text-sm transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-foreground/50 text-sm text-center md:text-left">
                        © {new Date().getFullYear()} ApexAI Technologies Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-foreground/50">
                        <span>Made with</span>
                        <span className="text-brand-500">♥</span>
                        <span>for athletes</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
