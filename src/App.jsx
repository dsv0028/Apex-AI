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
import { Leaderboard } from "./pages/Leaderboard"
import { AIChat } from "./pages/AIChat"
import { Calendar } from "./pages/Calendar"
import { WorkoutLogs } from "./pages/WorkoutLogs"
import { ExerciseLibrary } from "./pages/ExerciseLibrary"
import { Messages } from "./pages/Messages"
import { Community } from "./pages/Community"
import { Nutrition } from "./pages/Nutrition"
import { VideoReview } from "./pages/VideoReview"
import { TimerSuite } from "./pages/TimerSuite"
import { PlateCalculator } from "./pages/PlateCalculator"
import { Recovery } from "./pages/Recovery"
import { Calculators } from "./pages/Calculators"
import { CoachRoster } from "./pages/CoachRoster"
import { PrivateRoute } from "./components/PrivateRoute"
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
                        <Route path="/dashboard" element={
                            <PrivateRoute>
                                <DashboardLayout />
                            </PrivateRoute>
                        }>
                            <Route index element={<Dashboard />} />
                            <Route path="workouts" element={<Workouts />} />
                            <Route path="calendar" element={<Calendar />} />
                            <Route path="logs" element={<WorkoutLogs />} />
                            <Route path="exercises" element={<ExerciseLibrary />} />
                            <Route path="timers" element={<TimerSuite />} />
                            <Route path="plate-calculator" element={<PlateCalculator />} />
                            <Route path="recovery" element={<Recovery />} />
                            <Route path="calculators" element={<Calculators />} />
                            <Route path="roster" element={<CoachRoster />} />
                            <Route path="messages" element={<Messages />} />
                            <Route path="community" element={<Community />} />
                            <Route path="nutrition" element={<Nutrition />} />
                            <Route path="video-review" element={<VideoReview />} />
                            <Route path="analytics" element={<Analytics />} />
                            <Route path="leaderboard" element={<Leaderboard />} />
                            <Route path="ai-coach" element={<AIChat />} />
                            <Route path="settings" element={<Settings />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </div>
        </ThemeProvider>
    )
}

export default App
