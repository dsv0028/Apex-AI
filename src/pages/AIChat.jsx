import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Send,
    Bot,
    User,
    Sparkles,
    Dumbbell,
    Utensils,
    Heart,
    Zap,
    RefreshCw,
} from "lucide-react"
import axios from "axios"

const API_BASE = "http://localhost:5001/api"

// ─── Quick Prompts ─────────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
    { icon: Dumbbell, label: "Suggest a workout", prompt: "Can you suggest a workout for today based on my current stats?" },
    { icon: Utensils, label: "Nutrition advice", prompt: "What should I eat before and after my workout today?" },
    { icon: Heart, label: "Recovery tips", prompt: "How should I recover after an intense training session?" },
    { icon: Zap, label: "Improve my score", prompt: "What can I do to improve my AI readiness score?" },
]

// ─── Animation ─────────────────────────────────────────────────────────────────
const messageVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
}

export function AIChat() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    const token = userInfo?.token
    const userName = userInfo?.name?.split(" ")[0] || "Athlete"
    const headers = { Authorization: `Bearer ${token}` }

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: `Hey ${userName}! 👋 I'm your ApexAI Coach powered by Gemini AI. I know your stats, recent performance, and training goals. Ask me anything about workouts, nutrition, recovery, or training strategy!`,
        },
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const sendMessage = async (text) => {
        const messageText = text || input.trim()
        if (!messageText || !token) return

        const userMessage = { role: "user", content: messageText }
        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            // Build history for context (skip the first welcome message)
            const history = messages.slice(1).map((m) => ({
                role: m.role === "assistant" ? "model" : "user",
                content: m.content,
            }))

            const res = await axios.post(
                `${API_BASE}/chat`,
                { message: messageText, history },
                { headers }
            )

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: res.data.reply },
            ])
        } catch (err) {
            console.error("Chat error:", err)
            let errorMessage = "Sorry, I'm having trouble connecting right now. Please try again in a moment. 🔄"
            
            if (err.response) {
                // The server responded with a status code that falls out of the range of 2xx
                errorMessage = err.response.data?.message || `Server Error: ${err.response.status}`
            } else if (err.request) {
                // The request was made but no response was received
                errorMessage = "Cannot reach the AI server. Please make sure the backend is running on port 5001. 🔌"
            }

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: errorMessage,
                },
            ])
        } finally {
            setIsLoading(false)
            inputRef.current?.focus()
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const clearChat = () => {
        setMessages([
            {
                role: "assistant",
                content: `Fresh start! 🔄 What would you like to work on, ${userName}?`,
            },
        ])
    }

    return (
        <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]">
            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            AI Coach
                            <span className="text-xs font-semibold bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded-full border border-purple-500/20">
                                Gemini AI
                            </span>
                        </h1>
                        <p className="text-xs text-foreground/50">Personalized training advice powered by your data</p>
                    </div>
                </div>
                <button
                    onClick={clearChat}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Clear
                </button>
            </div>

            {/* ── Messages Area ── */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4 min-h-0">
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            variants={messageVariants}
                            initial="hidden"
                            animate="show"
                            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                            {/* Avatar */}
                            <div className={`h-8 w-8 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.role === "user"
                                    ? "bg-brand-500/20 text-brand-500"
                                    : "bg-gradient-to-br from-purple-500 to-blue-500 text-white"
                                }`}
                            >
                                {msg.role === "user" ? (
                                    <User className="h-4 w-4" />
                                ) : (
                                    <Sparkles className="h-4 w-4" />
                                )}
                            </div>

                            {/* Bubble */}
                            <div
                                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                        ? "bg-brand-500 text-white rounded-tr-md"
                                        : "glass border border-border/30 rounded-tl-md"
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                    >
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div className="glass border border-border/30 px-4 py-3 rounded-2xl rounded-tl-md">
                            <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="h-2 w-2 rounded-full bg-purple-500"
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* ── Quick Prompts (shown when few messages) ── */}
            {messages.length <= 1 && (
                <div className="flex-shrink-0 mb-4">
                    <p className="text-xs text-foreground/40 font-medium mb-2 uppercase tracking-wider">Quick prompts</p>
                    <div className="grid grid-cols-2 gap-2">
                        {QUICK_PROMPTS.map((q) => (
                            <button
                                key={q.label}
                                onClick={() => sendMessage(q.prompt)}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-3 glass rounded-xl border border-border/30 hover:bg-foreground/5 hover:border-purple-500/30 transition-all text-left text-sm font-medium text-foreground/70 hover:text-foreground disabled:opacity-50 group"
                            >
                                <q.icon className="h-4 w-4 text-purple-500 group-hover:scale-110 transition-transform flex-shrink-0" />
                                {q.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Input Bar ── */}
            <div className="flex-shrink-0 glass rounded-2xl border border-border/30 p-2 flex items-end gap-2">
                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask your AI Coach anything..."
                    rows={1}
                    className="flex-1 bg-transparent px-3 py-2 text-sm resize-none focus:outline-none max-h-32 min-h-[40px]"
                    style={{ height: "40px" }}
                    onInput={(e) => {
                        e.target.style.height = "40px"
                        e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px"
                    }}
                />
                <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isLoading}
                    className="h-10 w-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 flex-shrink-0 shadow-lg shadow-purple-500/20"
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
