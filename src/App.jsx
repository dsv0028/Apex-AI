import { ThemeProvider } from "./components/ThemeProvider"
import { Navbar } from "./components/Navbar"
import { Hero } from "./components/Hero"
import { Features } from "./components/Features"
import { HowItWorks } from "./components/HowItWorks"
import { Testimonials } from "./components/Testimonials"
import { Footer } from "./components/Footer"
import { Login } from "./pages/Login"
import { Signup } from "./pages/Signup"
import { DashboardLayout } from "./layouts/DashboardLayout"
import { Dashboard } from "./pages/Dashboard"
import { Workouts } from "./pages/Workouts"
import { Analytics } from "./pages/Analytics"
import { Settings } from "./pages/Settings"
import { BrowserRouter, Routes, Route } from "react-router-dom"

function LandingLayout() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <Features />
                <HowItWorks />
                <Testimonials />
            </main>
            <Footer />
        </>
    )
}

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-brand-500/30">
                <BrowserRouter>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingLayout />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />

                        {/* Protected Dashboard Routes */}
                        <Route path="/dashboard" element={<DashboardLayout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="workouts" element={<Workouts />} />
                            <Route path="analytics" element={<Analytics />} />
                            <Route path="settings" element={<Settings />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </div>
        </ThemeProvider>
    )
}

export default App
