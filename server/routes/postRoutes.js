import express from 'express';
import {
    getPosts,
    createPost,
    reactToPost,
    addComment,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getPosts)
    .post(createPost);

router.post('/:id/react', reactToPost);
router.post('/:id/comment', addComment);

export default router;
