import { useState, useEffect, useRef, useId } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Video,
    Play,
    Pause,
    Plus,
    Clock,
    CheckCircle2,
    Shield,
    Trash2,
    Sparkles,
    AlertCircle,
    Info,
    Check,
    Upload,
    X,
} from "lucide-react"
import axios from "axios"

const API_BASE = "http://localhost:5001/api"

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
}

export function VideoReview() {
    const videoTitleInputId = useId()
    const exerciseInputId = useId()
    const videoUrlInputId = useId()
    const videoNotesInputId = useId()
    const annotationSeveritySelectId = useId()

    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    const token = userInfo?.token
    const userRole = userInfo?.role || "athlete"

    const [reviews, setReviews] = useState([])
    const [selectedReview, setSelectedReview] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    // New Video Form
    const [newVideo, setNewVideo] = useState({
        title: "",
        exercise: "Barbell Back Squat",
        videoUrl: "",
        notes: "",
    })

    // New Annotation Form
    const [annotationComment, setAnnotationComment] = useState("")
    const [annotationSeverity, setAnnotationSeverity] = useState("correction")

    const videoRef = useRef(null)

    const fetchReviews = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${API_BASE}/video-reviews`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setReviews(res.data)
            if (res.data.length > 0 && !selectedReview) {
                setSelectedReview(res.data[0])
            }
        } catch (err) {
            console.error("Failed to load video reviews:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) fetchReviews()
    }, [token])

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime)
        }
    }

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration)
        }
    }

    const togglePlay = () => {
        if (!videoRef.current) return
        if (isPlaying) {
            videoRef.current.pause()
            setIsPlaying(false)
        } else {
            videoRef.current.play()
            setIsPlaying(true)
        }
    }

    const seekTo = (seconds) => {
        if (videoRef.current) {
            videoRef.current.currentTime = seconds
            setCurrentTime(seconds)
            videoRef.current.play()
            setIsPlaying(true)
        }
    }

    const handleCreateReview = async (e) => {
        e.preventDefault()
        if (!newVideo.title.trim() || !newVideo.exercise.trim()) return

        try {
            const res = await axios.post(`${API_BASE}/video-reviews`, newVideo, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setReviews([res.data, ...reviews])
            setSelectedReview(res.data)
            setIsUploadModalOpen(false)
            setNewVideo({
                title: "",
                exercise: "Barbell Back Squat",
                videoUrl: "",
                notes: "",
            })
        } catch (err) {
            console.error("Failed to submit video:", err)
        }
    }

    const handleAddAnnotation = async (e) => {
        e.preventDefault()
        if (!annotationComment.trim() || !selectedReview) return

        try {
            const res = await axios.post(
                `${API_BASE}/video-reviews/${selectedReview._id}/annotations`,
                {
                    timestampSeconds: Math.round(currentTime),
                    comment: annotationComment.trim(),
                    severity: annotationSeverity,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            setSelectedReview(res.data)
            setReviews((prev) => prev.map((r) => (r._id === selectedReview._id ? res.data : r)))
            setAnnotationComment("")
        } catch (err) {
            console.error("Failed to add annotation:", err)
        }
    }

    const formatSeconds = (sec) => {
        const m = Math.floor(sec / 60)
        const s = Math.floor(sec % 60)
        return `${m}:${s < 10 ? "0" : ""}${s}`
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-24"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent flex items-center gap-3">
                        <Video className="h-8 w-8 text-brand-500" />
                        Form Check & Technique Review
                    </h1>
                    <p className="text-foreground/60 text-sm mt-1">
                        Upload lifting clips for frame-by-frame scrutiny and timestamped coaching feedback.
                    </p>
                </div>

                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02]"
                >
                    <Upload className="h-4 w-4" />
                    Submit Form Clip
                </button>
            </motion.div>

            {/* Main Video & Feedback Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Video Player Column */}
                <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">
                    {selectedReview ? (
                        <div className="glass rounded-3xl p-6 border border-border/40 shadow-xl space-y-4">
                            {/* Video Player Container */}
                            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center group">
                                <video
                                    ref={videoRef}
                                    src={selectedReview.videoUrl}
                                    onTimeUpdate={handleTimeUpdate}
                                    onLoadedMetadata={handleLoadedMetadata}
                                    className="w-full h-full object-contain"
                                    playsInline
                                />

                                {/* Overlay Play/Pause Button */}
                                <button
                                    onClick={togglePlay}
                                    className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <div className="p-4 rounded-full bg-brand-500 text-white shadow-xl shadow-brand-500/40">
                                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                                    </div>
                                </button>
                            </div>

                            {/* Player Scrubber & Timeline Markers */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-foreground/60">
                                    <span className="font-mono font-bold text-brand-400">{formatSeconds(currentTime)}</span>
                                    <span className="font-mono">{formatSeconds(duration)}</span>
                                </div>

                                <div className="relative">
                                    <input
                                        type="range"
                                        min={0}
                                        max={duration || 100}
                                        value={currentTime}
                                        onChange={(e) => {
                                            const t = Number(e.target.value)
                                            if (videoRef.current) videoRef.current.currentTime = t
                                            setCurrentTime(t)
                                        }}
                                        className="w-full h-2 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-brand-500"
                                    />

                                    {/* Timestamp Pin Indicators on Scrubber */}
                                    {(selectedReview.annotations || []).map((ann, idx) => {
                                        const leftPct = duration > 0 ? (ann.timestampSeconds / duration) * 100 : 0
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => seekTo(ann.timestampSeconds)}
                                                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full ring-2 ring-background z-10 transition-transform hover:scale-125 ${
                                                    ann.severity === "praise"
                                                        ? "bg-emerald-400"
                                                        : ann.severity === "warning"
                                                        ? "bg-red-500"
                                                        : "bg-amber-400"
                                                }`}
                                                style={{ left: `${leftPct}%` }}
                                                title={`Seek to ${formatSeconds(ann.timestampSeconds)}: ${ann.comment}`}
                                            />
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Title & Exercise Info */}
                            <div className="flex items-start justify-between border-t border-border/30 pt-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                                            {selectedReview.exercise}
                                        </span>
                                        <span className="text-xs text-foreground/50">
                                            By {selectedReview.athlete?.name || "Athlete"}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground">{selectedReview.title}</h3>
                                    {selectedReview.notes && (
                                        <p className="text-xs text-foreground/70 mt-1 italic">
                                            Athlete Note: "{selectedReview.notes}"
                                        </p>
                                    )}
                                </div>

                                <span
                                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                                        selectedReview.status === "Reviewed"
                                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                    }`}
                                >
                                    {selectedReview.status}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="glass rounded-3xl p-16 text-center border border-border/40 space-y-3">
                            <Video className="h-12 w-12 mx-auto text-foreground/20" />
                            <h3 className="text-lg font-bold">No technique clips uploaded</h3>
                            <p className="text-sm text-foreground/50 max-w-sm mx-auto">
                                Upload a video recording of your squats, deadlifts, or sprint drills to get precision feedback.
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Coach Feedback Column */}
                <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
                    <div className="glass rounded-3xl p-6 border border-border/40 shadow-xl space-y-6 flex flex-col justify-between min-h-[500px]">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-border/30 pb-4">
                                <h3 className="font-bold text-base flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-brand-500" />
                                    Timestamped Annotations
                                </h3>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-foreground/10 text-foreground/60">
                                    {selectedReview?.annotations?.length || 0} notes
                                </span>
                            </div>

                            {/* Annotations List */}
                            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                                {!selectedReview?.annotations || selectedReview.annotations.length === 0 ? (
                                    <p className="text-xs text-foreground/40 italic text-center py-8">
                                        No annotations yet. Pause video at any point and leave a timestamped note below.
                                    </p>
                                ) : (
                                    selectedReview.annotations.map((ann, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => seekTo(ann.timestampSeconds)}
                                            className="w-full text-left p-3.5 rounded-2xl bg-card/60 border border-border/30 hover:border-brand-500/40 transition-all space-y-1.5 group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono text-xs font-bold text-brand-400 flex items-center gap-1 group-hover:underline">
                                                    <Clock className="h-3 w-3" />
                                                    {formatSeconds(ann.timestampSeconds)}
                                                </span>
                                                <span
                                                    className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                                                        ann.severity === "praise"
                                                            ? "bg-emerald-500/20 text-emerald-400"
                                                            : ann.severity === "warning"
                                                            ? "bg-red-500/20 text-red-400"
                                                            : "bg-amber-500/20 text-amber-400"
                                                    }`}
                                                >
                                                    {ann.severity}
                                                </span>
                                            </div>
                                            <p className="text-xs text-foreground/80 leading-relaxed">{ann.comment}</p>
                                            <span className="text-[10px] text-foreground/40 block">
                                                By Coach {ann.coach?.name || "Apex Coach"}
                                            </span>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Add Annotation Form */}
                        {selectedReview && (
                            <form onSubmit={handleAddAnnotation} className="pt-4 border-t border-border/20 space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-foreground/70">
                                        Add Pin at <strong className="text-brand-400 font-mono">{formatSeconds(currentTime)}</strong>
                                    </span>
                                    <select
                                        id={annotationSeveritySelectId}
                                        value={annotationSeverity}
                                        onChange={(e) => setAnnotationSeverity(e.target.value)}
                                        className="px-2 py-1 rounded-lg bg-background border border-border/40 text-[11px] font-semibold"
                                    >
                                        <option value="correction">Correction</option>
                                        <option value="warning">Warning / Hazard</option>
                                        <option value="praise">Praise / Great Form</option>
                                        <option value="info">General Info</option>
                                    </select>
                                </div>

                                <textarea
                                    rows={2}
                                    required
                                    placeholder="e.g., Knees caving in on ascent. Drive knees outward over toes..."
                                    value={annotationComment}
                                    onChange={(e) => setAnnotationComment(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-xs resize-none"
                                />

                                <button
                                    type="submit"
                                    className="w-full py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-1.5"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Pin Annotation at {formatSeconds(currentTime)}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Video Upload Modal */}
            <AnimatePresence>
                {isUploadModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass border border-border/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Video className="h-5 w-5 text-brand-500" />
                                    Submit Clip for Review
                                </h3>
                                <button
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="p-1 rounded-lg hover:bg-foreground/10 text-foreground/60"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateReview} className="space-y-4">
                                <div>
                                    <label htmlFor={videoTitleInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                        Clip Title *
                                    </label>
                                    <input
                                        id={videoTitleInputId}
                                        type="text"
                                        required
                                        placeholder="e.g., Heavy Squat Set 3 @ 140kg"
                                        value={newVideo.title}
                                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor={exerciseInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                        Exercise Name *
                                    </label>
                                    <input
                                        id={exerciseInputId}
                                        type="text"
                                        required
                                        placeholder="e.g., Barbell Back Squat"
                                        value={newVideo.exercise}
                                        onChange={(e) => setNewVideo({ ...newVideo, exercise: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor={videoUrlInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                        Video URL (Direct MP4 / WebM or leave blank for demo clip)
                                    </label>
                                    <input
                                        id={videoUrlInputId}
                                        type="url"
                                        placeholder="https://example.com/video.mp4 (Optional)"
                                        value={newVideo.videoUrl}
                                        onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor={videoNotesInputId} className="text-xs font-semibold text-foreground/70 block mb-1">
                                        Athlete Notes for Coach
                                    </label>
                                    <textarea
                                        id={videoNotesInputId}
                                        rows={2}
                                        placeholder="e.g., Felt lower back rounding slightly in bottom hole."
                                        value={newVideo.notes}
                                        onChange={(e) => setNewVideo({ ...newVideo, notes: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-sm resize-none"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsUploadModalOpen(false)}
                                        className="px-4 py-2 rounded-xl border border-border/40 text-sm font-semibold hover:bg-foreground/5"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-lg shadow-brand-500/20"
                                    >
                                        Upload Clip
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
export default VideoReview
