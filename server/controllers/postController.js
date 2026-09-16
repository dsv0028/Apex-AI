import asyncHandler from 'express-async-handler';
import Post from '../models/Post.js';

// @desc    Get all community posts
// @route   GET /api/posts
// @access  Private
export const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find()
        .populate('author', 'name role profileImage sport')
        .populate('comments.user', 'name profileImage role')
        .sort({ pinned: -1, createdAt: -1 })
        .lean();

    res.json(posts);
});

// @desc    Create a community post
// @route   POST /api/posts
// @access  Private
export const createPost = asyncHandler(async (req, res) => {
    const { content, category, workoutStats } = req.body;

    if (!content || !content.trim()) {
        res.status(400);
        throw new Error('Post content cannot be empty');
    }

    const post = await Post.create({
        author: req.user._id,
        content: content.trim(),
        category: category || 'General',
        workoutStats: workoutStats || {},
        reactions: { fire: [], clap: [], lightning: [], trophy: [] },
        comments: [],
    });

    const populated = await Post.findById(post._id)
        .populate('author', 'name role profileImage sport')
        .lean();

    res.status(201).json(populated);
});

// @desc    Toggle a reaction on a post (fire, clap, lightning, trophy)
// @route   POST /api/posts/:id/react
// @access  Private
export const reactToPost = asyncHandler(async (req, res) => {
    const { reactionType } = req.body; // 'fire' | 'clap' | 'lightning' | 'trophy'
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    if (!post.reactions[reactionType]) {
        post.reactions[reactionType] = [];
    }

    const userIdStr = req.user._id.toString();
    const index = post.reactions[reactionType].findIndex((id) => id.toString() === userIdStr);

    if (index > -1) {
        // Remove reaction
        post.reactions[reactionType].splice(index, 1);
    } else {
        // Add reaction
        post.reactions[reactionType].push(req.user._id);
    }

    await post.save();

    const populated = await Post.findById(post._id)
        .populate('author', 'name role profileImage sport')
        .populate('comments.user', 'name profileImage role')
        .lean();

    res.json(populated);
});

// @desc    Add comment to a post
// @route   POST /api/posts/:id/comment
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
    const { text } = req.body;

    if (!text || !text.trim()) {
        res.status(400);
        throw new Error('Comment text cannot be empty');
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    post.comments.push({
        user: req.user._id,
        text: text.trim(),
    });

    await post.save();

    const populated = await Post.findById(post._id)
        .populate('author', 'name role profileImage sport')
        .populate('comments.user', 'name profileImage role')
        .lean();

    res.json(populated);
});
