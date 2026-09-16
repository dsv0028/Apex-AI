import asyncHandler from 'express-async-handler';
import VideoReview from '../models/VideoReview.js';

// @desc    Get video reviews
// @route   GET /api/video-reviews
// @access  Private
export const getVideoReviews = asyncHandler(async (req, res) => {
    let filter = {};
    if (req.user.role === 'athlete') {
        filter.athlete = req.user._id;
    }

    const reviews = await VideoReview.find(filter)
        .populate('athlete', 'name profileImage sport')
        .populate('annotations.coach', 'name profileImage role')
        .sort({ createdAt: -1 })
        .lean();

    res.json(reviews);
});

// @desc    Submit a video for form check review
// @route   POST /api/video-reviews
// @access  Private
export const createVideoReview = asyncHandler(async (req, res) => {
    const { title, exercise, videoUrl, notes } = req.body;

    if (!title || !exercise) {
        res.status(400);
        throw new Error('Title and exercise name are required');
    }

    // Default sample video if user provides empty URL
    const finalVideoUrl = videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-athlete-lifting-barbell-in-gym-42995-large.mp4';

    const review = await VideoReview.create({
        athlete: req.user._id,
        title,
        exercise,
        videoUrl: finalVideoUrl,
        notes: notes || '',
        status: 'Pending Review',
        annotations: [],
    });

    const populated = await VideoReview.findById(review._id)
        .populate('athlete', 'name profileImage sport')
        .lean();

    res.status(201).json(populated);
});

// @desc    Coach adds a timestamped annotation to a video
// @route   POST /api/video-reviews/:id/annotations
// @access  Private
export const addAnnotation = asyncHandler(async (req, res) => {
    const { timestampSeconds, comment, severity } = req.body;

    if (timestampSeconds === undefined || !comment) {
        res.status(400);
        throw new Error('Timestamp and comment text are required');
    }

    const review = await VideoReview.findById(req.params.id);
    if (!review) {
        res.status(404);
        throw new Error('Video review not found');
    }

    review.annotations.push({
        coach: req.user._id,
        timestampSeconds: Number(timestampSeconds),
        comment,
        severity: severity || 'correction',
    });

    review.status = 'Reviewed';
    await review.save();

    const populated = await VideoReview.findById(review._id)
        .populate('athlete', 'name profileImage sport')
        .populate('annotations.coach', 'name profileImage role')
        .lean();

    res.json(populated);
});

// @desc    Delete video review
// @route   DELETE /api/video-reviews/:id
// @access  Private
export const deleteVideoReview = asyncHandler(async (req, res) => {
    const review = await VideoReview.findById(req.params.id);
    if (!review) {
        res.status(404);
        throw new Error('Video review not found');
    }

    // Check ownership or coach
    if (review.athlete.toString() !== req.user._id.toString() && req.user.role !== 'coach') {
        res.status(403);
        throw new Error('Not authorized to delete this review');
    }

    await review.deleteOne();
    res.json({ message: 'Video review deleted successfully' });
});
