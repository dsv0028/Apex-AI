import asyncHandler from 'express-async-handler';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Get contacts / users list available for chat
// @route   GET /api/messages/users
// @access  Private
export const getChatContacts = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id;
    // Return other registered users
    const users = await User.find({ _id: { $ne: currentUserId } })
        .select('name email role profileImage sport bio')
        .lean();
    res.json(users);
});

// @desc    Get user conversations
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id;

    const conversations = await Conversation.find({
        participants: currentUserId,
    })
        .populate('participants', 'name email role profileImage')
        .sort({ updatedAt: -1 })
        .lean();

    res.json(conversations);
});

// @desc    Get messages for a conversation or specific recipient
// @route   GET /api/messages/:recipientId
// @access  Private
export const getMessagesWithUser = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id;
    const { recipientId } = req.params;

    // Find conversation between currentUserId and recipientId
    const conversation = await Conversation.findOne({
        participants: { $all: [currentUserId, recipientId] },
    });

    if (!conversation) {
        return res.json({ conversation: null, messages: [] });
    }

    const messages = await Message.find({
        conversationId: conversation._id,
    })
        .sort({ createdAt: 1 })
        .populate('sender', 'name profileImage')
        .lean();

    // Mark incoming messages as read
    await Message.updateMany(
        { conversationId: conversation._id, recipient: currentUserId, read: false },
        { read: true }
    );

    res.json({ conversation, messages });
});

// @desc    Send a direct message
// @route   POST /api/messages
// @access  Private
export const sendMessage = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id;
    const { recipientId, text } = req.body;

    if (!recipientId || !text || !text.trim()) {
        res.status(400);
        throw new Error('Recipient ID and message text are required');
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
        participants: { $all: [currentUserId, recipientId] },
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [currentUserId, recipientId],
        });
    }

    const message = await Message.create({
        conversationId: conversation._id,
        sender: currentUserId,
        recipient: recipientId,
        text: text.trim(),
    });

    conversation.lastMessage = message._id;
    conversation.lastMessageText = text.trim();
    conversation.lastMessageAt = message.createdAt;
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'name profileImage')
        .lean();

    res.status(201).json({
        conversationId: conversation._id,
        message: populatedMessage,
    });
});
