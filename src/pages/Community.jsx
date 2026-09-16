import { useState, useEffect, useId } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Users,
    Flame,
    Sparkles,
    MessageCircle,
    Send,
    Trophy,
    Zap,
    Plus,
    Share2,
    Calendar,
    Pin,
    Dumbbell,
    X,
} from "lucide-react"
import axios from "axios"
import confetti from "canvas-confetti"

const API_BASE = "http://localhost:5001/api"

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
}

export function Community() {
    const postCategorySelectId = useId()
    const workoutNameInputId = useId()
    const volumeInputId = useId()
    const durationInputId = useId()
    const prInputId = useId()

    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    const token = userInfo?.token
    const currentUserId = userInfo?._id

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [newPostContent, setNewPostContent] = useState("")
    const [postCategory, setPostCategory] = useState("General")
    const [activeCommentPostId, setActiveCommentPostId] = useState(null)
    const [commentText, setCommentText] = useState("")
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [workoutStats, setWorkoutStats] = useState({
        workoutName: "",
        volumeKg: 0,
        durationMinutes: 45,
        prMetric: "",
    })

    const fetchPosts = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${API_BASE}/posts`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setPosts(res.data)
        } catch (err) {
            console.error("Failed to load community feed:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) fetchPosts()
    }, [token])

    const handleCreatePost = async (e) => {
        e.preventDefault()
        if (!newPostContent.trim()) return

        try {
            const payload = {
                content: newPostContent.trim(),
                category: postCategory,
                workoutStats: postCategory === "Workout" || postCategory === "PR Milestone" ? workoutStats : null,
            }
            const res = await axios.post(`${API_BASE}/posts`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setPosts([res.data, ...posts])
            setNewPostContent("")
            setIsCreateModalOpen(false)

            if (postCategory === "PR Milestone") {
                confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } })
            }
        } catch (err) {
            console.error("Failed to create post:", err)
        }
    }

    const handleReaction = async (postId, reactionType) => {
        try {
            const res = await axios.post(
                `${API_BASE}/posts/${postId}/react`,
                { reactionType },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setPosts((prev) => prev.map((p) => (p._id === postId ? res.data : p)))

            if (reactionType === "fire" || reactionType === "trophy") {
                confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } })
            }
        } catch (err) {
            console.error("Failed to react:", err)
        }
    }

    const handleAddComment = async (postId) => {
        if (!commentText.trim()) return
        try {
            const res = await axios.post(
                `${API_BASE}/posts/${postId}/comment`,
                { text: commentText.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setPosts((prev) => prev.map((p) => (p._id === postId ? res.data : p)))
            setCommentText("")
        } catch (err) {
            console.error("Failed to add comment:", err)
        }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-8 pb-24"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent flex items-center gap-3">
                        <Users className="h-8 w-8 text-brand-500" />
                        Athlete Community & Activity Feed
                    </h1>
                    <p className="text-foreground/60 text-sm mt-1">
                        Share training accomplishments, celebrate new personal bests, and cheer on teammates.
                    </p>
                </div>

                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02]"
                >
                    <Plus className="h-4 w-4" />
                    Share Update
                </button>
            </motion.div>

            {/* Quick Share Card */}
            <motion.div variants={itemVariants} className="glass rounded-3xl p-5 border border-border/40 shadow-lg space-y-3">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center border border-brand-500/30 shrink-0">
                        {userInfo?.name?.charAt(0) || "A"}
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex-1 text-left px-4 py-2.5 rounded-2xl bg-foreground/5 hover:bg-foreground/10 text-xs sm:text-sm text-foreground/50 transition-colors border border-border/20"
                    >
                        Share today's workout, milestone, or PR...
                    </button>
                </div>
            </motion.div>

            {/* Feed Stream */}
            <div className="space-y-6">
                {posts.length === 0 ? (
                    <div className="glass rounded-3xl p-12 text-center border border-border/40 space-y-3">
                        <Users className="h-12 w-12 mx-auto text-foreground/20" />
                        <h3 className="text-lg font-bold">No community updates yet</h3>
                        <p className="text-sm text-foreground/50 max-w-sm mx-auto">
                            Be the first athlete to share a training breakthrough or workout summary!
                        </p>
                    </div>
                ) : (
                    posts.map((post) => {
                        const hasFired = post.reactions?.fire?.some((id) => (id._id || id) === currentUserId)
                        const hasClapped = post.reactions?.clap?.some((id) => (id._id || id) === currentUserId)
                        const hasLightning = post.reactions?.lightning?.some((id) => (id._id || id) === currentUserId)
                        const hasTrophied = post.reactions?.trophy?.some((id) => (id._id || id) === currentUserId)
                        const isCommentsOpen = activeCommentPostId === post._id

                        return (
                            <motion.div
                                key={post._id}
                                variants={itemVariants}
                                className="glass rounded-3xl p-6 border border-border/40 shadow-xl space-y-4 hover:border-brand-500/30 transition-all"
                            >
                                {/* Author info */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-11 w-11 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center border border-brand-500/30 text-sm">
                                            {post.author?.name?.charAt(0) || "A"}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-sm text-foreground">{post.author?.name}</h4>
                                                <span
                                                    className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                                                        post.author?.role === "coach"
                                                            ? "bg-amber-500/20 text-amber-400"
                                                            : "bg-brand-500/20 text-brand-400"
                                                    }`}
                                                >
                                                    {post.author?.role}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-foreground/50">
                                                {new Date(post.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-foreground/5 text-foreground/60 border border-border/20">
                                        {post.category}
                                    </span>
                                </div>

                                {/* Post Content */}
                                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                                    {post.content}
                                </p>

                                {/* Workout Stats Highlight Box */}
                                {post.workoutStats && post.workoutStats.workoutName && (
                                    <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-500/10 via-card to-card border border-brand-500/30 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                                        <div>
                                            <span className="text-foreground/50 text-[10px] block font-semibold">Routine</span>
                                            <strong className="text-foreground text-xs">{post.workoutStats.workoutName}</strong>
                                        </div>
                                        {post.workoutStats.volumeKg > 0 && (
                                            <div>
                                                <span className="text-foreground/50 text-[10px] block font-semibold">Volume</span>
                                                <strong className="text-brand-400 text-xs">{post.workoutStats.volumeKg} kg</strong>
                                            </div>
                                        )}
                                        {post.workoutStats.prMetric && (
                                            <div className="col-span-2 sm:col-span-1">
                                                <span className="text-amber-400 text-[10px] block font-semibold flex items-center gap-1">
                                                    <Trophy className="h-3 w-3" /> PR Achieved
                                                </span>
                                                <strong className="text-amber-400 text-xs truncate block">{post.workoutStats.prMetric}</strong>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Reaction Buttons */}
                                <div className="flex items-center gap-2 pt-2 border-t border-border/20">
                                    <button
                                        onClick={() => handleReaction(post._id, "fire")}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                            hasFired
                                                ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                                                : "bg-foreground/5 hover:bg-foreground/10 text-foreground/70"
                                        }`}
                                    >
                                        <span>🔥</span>
                                        <span>{post.reactions?.fire?.length || 0}</span>
                                    </button>

                                    <button
                                        onClick={() => handleReaction(post._id, "clap")}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                            hasClapped
                                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                                : "bg-foreground/5 hover:bg-foreground/10 text-foreground/70"
                                        }`}
                                    >
                                        <span>👏</span>
                                        <span>{post.reactions?.clap?.length || 0}</span>
                                    </button>

                                    <button
                                        onClick={() => handleReaction(post._id, "lightning")}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                            hasLightning
                                                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                                                : "bg-foreground/5 hover:bg-foreground/10 text-foreground/70"
                                        }`}
                                    >
                                        <span>⚡</span>
                                        <span>{post.reactions?.lightning?.length || 0}</span>
                                    </button>

                                    <button
                                        onClick={() => handleReaction(post._id, "trophy")}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                            hasTrophied
                                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                                : "bg-foreground/5 hover:bg-foreground/10 text-foreground/70"
                                        }`}
                                    >
                                        <span>🏆</span>
                                        <span>{post.reactions?.trophy?.length || 0}</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveCommentPostId(isCommentsOpen ? null : post._id)}
                                        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-foreground/60 hover:bg-foreground/5 transition-colors"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        <span>{post.comments?.length || 0} comments</span>
                                    </button>
                                </div>

                                {/* Comments Drawer */}
                                {isCommentsOpen && (
                                    <div className="pt-4 border-t border-border/20 space-y-3">
                                        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                                            {post.comments?.length === 0 ? (
                                                <p className="text-xs text-foreground/40 italic">No comments yet. Be the first to chime in!</p>
                                            ) : (
                                                post.comments?.map((c, cIdx) => (
                                                    <div key={cIdx} className="p-2.5 rounded-xl bg-foreground/5 border border-border/20 text-xs">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <strong className="text-foreground">{c.user?.name || "Athlete"}</strong>
                                                            <span className="text-[10px] text-foreground/40">
                                                                {new Date(c.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                            </span>
                                                        </div>
                                                        <p className="text-foreground/80">{c.text}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 pt-2">
                                            <input
                                                type="text"
                                                placeholder="Write an encouraging comment..."
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleAddComment(post._id)}
                                                className="flex-1 px-3.5 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-xs"
                                            />
                                            <button
                                                onClick={() => handleAddComment(post._id)}
                                                className="p-2 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-md shadow-brand-500/20"
                                            >
                                                <Send className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )
                    })
                )}
            </div>

            {/* Create Post Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass border border-border/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-brand-500" />
                                    Share Community Update
                                </h3>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="p-1 rounded-lg hover:bg-foreground/10 text-foreground/60"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreatePost} className="space-y-4">
                                <div>
                                    <label htmlFor={postCategorySelectId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                        Post Category
                                    </label>
                                    <select
                                        id={postCategorySelectId}
                                        value={postCategory}
                                        onChange={(e) => setPostCategory(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl bg-background border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                    >
                                        <option value="General">General Thought / Motivation</option>
                                        <option value="Workout">Workout Summary</option>
                                        <option value="PR Milestone">PR Milestone Celebration 🏆</option>
                                        <option value="Nutrition">Nutrition & Meal Update</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-foreground/70 block mb-1">
                                        What's on your mind? *
                                    </label>
                                    <textarea
                                        rows={4}
                                        required
                                        placeholder="Crushed heavy squats today! Hit 140kg for 3 clean reps with zero lower back strain..."
                                        value={newPostContent}
                                        onChange={(e) => setNewPostContent(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm resize-none"
                                    />
                                </div>

                                {(postCategory === "Workout" || postCategory === "PR Milestone") && (
                                    <div className="p-4 rounded-2xl bg-foreground/5 border border-border/30 space-y-3">
                                        <span className="text-xs font-bold text-brand-400 block">Attach Workout Metrics</span>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                id={workoutNameInputId}
                                                type="text"
                                                placeholder="Routine Name (e.g. Leg Day)"
                                                value={workoutStats.workoutName}
                                                onChange={(e) => setWorkoutStats({ ...workoutStats, workoutName: e.target.value })}
                                                className="px-3 py-1.5 rounded-lg bg-background border border-border/40 text-xs"
                                            />
                                            <input
                                                id={volumeInputId}
                                                type="number"
                                                placeholder="Volume (kg)"
                                                value={workoutStats.volumeKg || ""}
                                                onChange={(e) => setWorkoutStats({ ...workoutStats, volumeKg: Number(e.target.value) })}
                                                className="px-3 py-1.5 rounded-lg bg-background border border-border/40 text-xs"
                                            />
                                        </div>
                                        {postCategory === "PR Milestone" && (
                                            <input
                                                id={prInputId}
                                                type="text"
                                                placeholder="PR Details (e.g., Squat: 140kg x 3 reps)"
                                                value={workoutStats.prMetric}
                                                onChange={(e) => setWorkoutStats({ ...workoutStats, prMetric: e.target.value })}
                                                className="w-full px-3 py-1.5 rounded-lg bg-background border border-border/40 text-xs"
                                            />
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="px-4 py-2 rounded-xl border border-border/40 text-sm font-semibold hover:bg-foreground/5"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-lg shadow-brand-500/20"
                                    >
                                        Post Update
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
export default Community
