import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';
import trainingRoutes from './routes/trainingRoutes.js';
import coachRoutes from './routes/coachRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => {
    res.send('ApexAI API is running...');
});

const PORT = process.env.API_PORT || 5001;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
