import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';
import trainingRoutes from './routes/trainingRoutes.js';
import coachRoutes from './routes/coachRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import workoutLogRoutes from './routes/workoutLogRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';
import postRoutes from './routes/postRoutes.js';
import nutritionRoutes from './routes/nutritionRoutes.js';
import videoReviewRoutes from './routes/videoReviewRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import recoveryRoutes from './routes/recoveryRoutes.js';
import coachRosterRoutes from './routes/coachRosterRoutes.js';

dotenv.config();

connectDB();

const app = express();
const httpServer = http.createServer(app);

// Setup Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    socket.on('join_conversation', (conversationId) => {
        socket.join(conversationId);
    });

    socket.on('send_message', (data) => {
        if (data.conversationId) {
            io.to(data.conversationId).emit('receive_message', data);
        }
    });

    socket.on('typing', ({ conversationId, userName }) => {
        socket.to(conversationId).emit('user_typing', { userName });
    });

    socket.on('stop_typing', ({ conversationId }) => {
        socket.to(conversationId).emit('user_stop_typing');
    });

    socket.on('disconnect', () => {});
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: false, limit: '25mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/logs', workoutLogRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/video-reviews', videoReviewRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/recovery', recoveryRoutes);
app.use('/api/roster', coachRosterRoutes);

app.get('/', (req, res) => {
    res.send('ApexAI API is running...');
});

const PORT = process.env.API_PORT || 5001;

httpServer.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
