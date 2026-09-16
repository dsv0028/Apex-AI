import express from 'express';
import {
    getChatContacts,
    getConversations,
    getMessagesWithUser,
    sendMessage,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/users', getChatContacts);
router.get('/conversations', getConversations);
router.get('/:recipientId', getMessagesWithUser);
router.post('/', sendMessage);

export default router;
