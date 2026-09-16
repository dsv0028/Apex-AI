import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    MessageSquare,
    Send,
    Search,
    User as UserIcon,
    Circle,
    Shield,
    Bot,
    Sparkles,
    Check,
    CheckCheck,
} from "lucide-react"
import axios from "axios"
import { io } from "socket.io-client"

const API_BASE = "http://localhost:5001/api"
const SOCKET_SERVER = "http://localhost:5001"

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
}

export function Messages() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    const token = userInfo?.token
    const currentUserId = userInfo?._id
    const currentUserName = userInfo?.name || "Athlete"

    const [contacts, setContacts] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [messages, setMessages] = useState([])
    const [conversationId, setConversationId] = useState(null)
    const [inputText, setInputText] = useState("")
    const [searchContact, setSearchContact] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [typingUser, setTypingUser] = useState("")
    const [loadingContacts, setLoadingContacts] = useState(true)
    const [loadingMessages, setLoadingMessages] = useState(false)

    const socketRef = useRef(null)
    const messagesEndRef = useRef(null)
    const typingTimeoutRef = useRef(null)

    // Setup Socket.io connection
    useEffect(() => {
        socketRef.current = io(SOCKET_SERVER)

        socketRef.current.on("receive_message", (data) => {
            if (data.message) {
                setMessages((prev) => {
                    // Avoid duplicate messages
                    if (prev.some((m) => m._id === data.message._id)) return prev
                    return [...prev, data.message]
                })
            }
        })

        socketRef.current.on("user_typing", ({ userName }) => {
            setTypingUser(userName)
            setIsTyping(true)
        })

        socketRef.current.on("user_stop_typing", () => {
            setIsTyping(false)
            setTypingUser("")
        })

        return () => {
            if (socketRef.current) socketRef.current.disconnect()
        }
    }, [])

    // Scroll to latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    // Fetch contacts
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                setLoadingContacts(true)
                const res = await axios.get(`${API_BASE}/messages/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setContacts(res.data)
                if (res.data.length > 0 && !selectedUser) {
                    setSelectedUser(res.data[0])
                }
            } catch (err) {
                console.error("Failed to load contacts:", err)
            } finally {
                setLoadingContacts(false)
            }
        }

        if (token) fetchContacts()
    }, [token])

    // Fetch messages when selected contact changes
    useEffect(() => {
        if (!selectedUser || !token) return

        const fetchConversation = async () => {
            try {
                setLoadingMessages(true)
                const res = await axios.get(`${API_BASE}/messages/${selectedUser._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setMessages(res.data.messages || [])
                if (res.data.conversation) {
                    setConversationId(res.data.conversation._id)
                    if (socketRef.current) {
                        socketRef.current.emit("join_conversation", res.data.conversation._id)
                    }
                }
            } catch (err) {
                console.error("Failed to load messages:", err)
            } finally {
                setLoadingMessages(false)
            }
        }

        fetchConversation()
    }, [selectedUser, token])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!inputText.trim() || !selectedUser) return

        const messageText = inputText.trim()
        setInputText("")

        // Emit stop typing
        if (socketRef.current && conversationId) {
            socketRef.current.emit("stop_typing", { conversationId })
        }

        try {
            const res = await axios.post(
                `${API_BASE}/messages`,
                {
                    recipientId: selectedUser._id,
                    text: messageText,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            const savedMessage = res.data.message
            const activeConvId = res.data.conversationId
            setConversationId(activeConvId)

            setMessages((prev) => {
                if (prev.some((m) => m._id === savedMessage._id)) return prev
                return [...prev, savedMessage]
            })

            // Broadcast via Socket.io
            if (socketRef.current) {
                socketRef.current.emit("join_conversation", activeConvId)
                socketRef.current.emit("send_message", {
                    conversationId: activeConvId,
                    message: savedMessage,
                })
            }
        } catch (err) {
            console.error("Failed to send message:", err)
        }
    }

    const handleInputChange = (e) => {
        setInputText(e.target.value)

        if (socketRef.current && conversationId) {
            socketRef.current.emit("typing", {
                conversationId,
                userName: currentUserName,
            })

            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
            typingTimeoutRef.current = setTimeout(() => {
                if (socketRef.current) {
                    socketRef.current.emit("stop_typing", { conversationId })
                }
            }, 1500)
        }
    }

    const filteredContacts = contacts.filter((c) =>
        c.name.toLowerCase().includes(searchContact.toLowerCase()) ||
        c.role.toLowerCase().includes(searchContact.toLowerCase())
    )

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto h-[calc(100vh-5rem)] flex flex-col space-y-4"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent flex items-center gap-3">
                        <MessageSquare className="h-7 w-7 text-brand-500" />
                        Team & Coach Messaging
                    </h1>
                    <p className="text-foreground/60 text-xs sm:text-sm mt-0.5">
                        Direct real-time communication between coaches, athletes, and team members.
                    </p>
                </div>
            </motion.div>

            {/* Chat Layout Container */}
            <motion.div
                variants={itemVariants}
                className="flex-1 glass rounded-3xl border border-border/40 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0"
            >
                {/* Contacts List Column */}
                <div className="md:col-span-4 lg:col-span-4 border-r border-border/30 flex flex-col h-full bg-card/30">
                    <div className="p-4 border-b border-border/30 space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                            <input
                                type="text"
                                placeholder="Search coaches & athletes..."
                                value={searchContact}
                                onChange={(e) => setSearchContact(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-xs"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-border/10">
                        {filteredContacts.length === 0 ? (
                            <div className="p-8 text-center text-xs text-foreground/40 space-y-2">
                                <UserIcon className="h-8 w-8 mx-auto opacity-30" />
                                <p>No team members found.</p>
                            </div>
                        ) : (
                            filteredContacts.map((contact) => {
                                const isSelected = selectedUser?._id === contact._id
                                return (
                                    <button
                                        key={contact._id}
                                        onClick={() => setSelectedUser(contact)}
                                        className={`w-full p-3.5 text-left flex items-center gap-3 transition-colors ${
                                            isSelected
                                                ? "bg-brand-500/10 border-l-4 border-brand-500"
                                                : "hover:bg-foreground/5"
                                        }`}
                                    >
                                        <div className="relative">
                                            {contact.profileImage ? (
                                                <img
                                                    src={contact.profileImage}
                                                    alt={contact.name}
                                                    className="h-10 w-10 rounded-full object-cover border border-border/40"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center text-sm border border-brand-500/30">
                                                    {contact.name.charAt(0)}
                                                </div>
                                            )}
                                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-xs truncate text-foreground">
                                                    {contact.name}
                                                </h4>
                                                <span
                                                    className={`text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded-full ${
                                                        contact.role === "coach"
                                                            ? "bg-amber-500/20 text-amber-400"
                                                            : "bg-brand-500/20 text-brand-400"
                                                    }`}
                                                >
                                                    {contact.role}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-foreground/50 truncate mt-0.5">
                                                {contact.sport ? `${contact.sport} Athlete` : contact.email}
                                            </p>
                                        </div>
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Conversation Active Window */}
                <div className="md:col-span-8 lg:col-span-8 flex flex-col h-full bg-background/50">
                    {selectedUser ? (
                        <>
                            {/* Active Chat Header */}
                            <div className="p-4 border-b border-border/30 flex items-center justify-between glass">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        {selectedUser.profileImage ? (
                                            <img
                                                src={selectedUser.profileImage}
                                                alt={selectedUser.name}
                                                className="h-10 w-10 rounded-full object-cover border border-border/40"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center text-sm border border-brand-500/30">
                                                {selectedUser.name.charAt(0)}
                                            </div>
                                        )}
                                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                                            {selectedUser.name}
                                            {selectedUser.role === "coach" && (
                                                <Shield className="h-3.5 w-3.5 text-amber-500" title="Verified Coach" />
                                            )}
                                        </h3>
                                        <p className="text-[11px] text-emerald-500 flex items-center gap-1 font-medium">
                                            <Circle className="h-1.5 w-1.5 fill-emerald-500" /> Active Now
                                        </p>
                                    </div>
                                </div>

                                <div className="text-[11px] text-foreground/50 px-3 py-1 rounded-full bg-foreground/5 border border-border/20">
                                    {selectedUser.sport || "All-Around Sports"}
                                </div>
                            </div>

                            {/* Messages Stream */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                                {messages.length === 0 ? (
                                    <div className="text-center py-16 space-y-3">
                                        <div className="h-14 w-14 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto">
                                            <MessageSquare className="h-6 w-6" />
                                        </div>
                                        <h4 className="font-bold text-sm">Start the conversation</h4>
                                        <p className="text-xs text-foreground/50 max-w-sm mx-auto">
                                            Send your coach or teammate a message to discuss workout drills, recovery benchmarks, or technique feedback.
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isMine =
                                            msg.sender === currentUserId ||
                                            msg.sender?._id === currentUserId

                                        return (
                                            <div
                                                key={msg._id}
                                                className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                                            >
                                                <div
                                                    className={`max-w-[75%] sm:max-w-[65%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                                                        isMine
                                                            ? "bg-brand-500 text-white rounded-br-sm shadow-md shadow-brand-500/20"
                                                            : "glass border border-border/40 text-foreground rounded-bl-sm"
                                                    }`}
                                                >
                                                    {msg.text}
                                                </div>
                                                <span className="text-[10px] text-foreground/40 mt-1 px-1 flex items-center gap-1">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                    {isMine && <CheckCheck className="h-3 w-3 text-brand-400" />}
                                                </span>
                                            </div>
                                        )
                                    })
                                )}

                                {/* Typing indicator */}
                                {isTyping && (
                                    <div className="flex items-center gap-2 text-xs text-foreground/50 italic px-2">
                                        <div className="flex space-x-1">
                                            <span className="h-1.5 w-1.5 bg-brand-500 rounded-full animate-bounce" />
                                            <span className="h-1.5 w-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <span className="h-1.5 w-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                        <span>{typingUser} is typing...</span>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input Box */}
                            <form
                                onSubmit={handleSendMessage}
                                className="p-3 sm:p-4 border-t border-border/30 glass flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    placeholder={`Message ${selectedUser.name}...`}
                                    value={inputText}
                                    onChange={handleInputChange}
                                    className="flex-1 px-4 py-2.5 rounded-2xl bg-foreground/5 border border-border/40 focus:border-brand-500 focus:outline-none text-xs sm:text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim()}
                                    className="p-2.5 sm:px-5 sm:py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02]"
                                >
                                    <span className="hidden sm:inline">Send</span>
                                    <Send className="h-4 w-4" />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-8 text-center text-foreground/40 space-y-2">
                            <div>
                                <MessageSquare className="h-10 w-10 mx-auto opacity-30 mb-2" />
                                <p className="text-sm font-semibold">Select a contact to open messages</p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}
export default Messages
