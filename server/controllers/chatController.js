import asyncHandler from 'express-async-handler';
import { GoogleGenerativeAI } from '@google/generative-ai';
import User from '../models/User.js';
import Performance from '../models/Performance.js';

// @desc    Chat with AI Coach (Gemini)
// @route   POST /api/chat
// @access  Private
const chatWithAI = asyncHandler(async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        res.status(400);
        throw new Error('Message is required');
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        res.status(500);
        throw new Error('AI service is not configured');
    }

    // Gather athlete context
    const user = await User.findById(req.user._id).select('-password');
    const recentPerformance = await Performance.find({ user: req.user._id })
        .sort({ date: -1 })
        .limit(7);

    const statsContext = user?.stats
        ? `Stamina: ${user.stats.stamina}/100, Speed: ${user.stats.speed}/100, Strength: ${user.stats.strength}/100`
        : 'No stats available';

    const perfContext = recentPerformance.length > 0
        ? recentPerformance.map(p => `Date: ${new Date(p.date).toLocaleDateString()}, AI Score: ${p.aiScore}, Load: ${p.trainingLoad}, Injury Risk: ${p.injuryRisk}`).join('\n')
        : 'No recent performance data';

    const systemPrompt = `You are ApexAI Coach — an elite, friendly AI sports coach built into the ApexAI training platform. You provide personalized training advice, nutrition tips, recovery strategies, and motivation.

ATHLETE PROFILE:
- Name: ${user?.name || 'Athlete'}
- Sport: ${user?.sport || 'General Athletics'}
- Bio: ${user?.bio || 'Not specified'}
- Goals: ${user?.goals?.length ? user.goals.join(', ') : 'Not specified'}
- Stats: ${statsContext}

RECENT PERFORMANCE (last 7 sessions):
${perfContext}

RULES:
- Be conversational, encouraging, and be consice.
- Use the athlete's name naturally
- Reference their actual stats and performance data when relevant
- Give specific, actionable advice — not vague tips
- If asked about injuries, always recommend consulting a medical professional
- Use emoji sparingly for personality (1-2 max per response)
- If they ask something unrelated to sports/fitness, gently redirect`;

    // Helper: delay for ms
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Helper: check if error is rate-limit related
    // Helper: check if error is rate-limit related
    const isRateLimitError = (err) => {
        const msg = (err.message || '').toLowerCase();
        return (
            msg.includes('429') ||
            msg.includes('quota') ||
            msg.includes('rate') ||
            msg.includes('resource has been exhausted') ||
            msg.includes('503') ||
            msg.includes('service unavailable') ||
            msg.includes('high demand') ||
            msg.includes('unavailable')
        );
    };

    // Try multiple models with retry on rate limits
    // Expanded array to prevent 404s and 429s from isolated models
    // Try multiple models with retry on rate limits
    const models = ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.5-pro'];
    const MAX_RETRIES = 3;


    let lastError = 'AI Coach is currently unavailable';

    for (const modelName of models) {
        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                // Wait before retry
                // Wait before retry
                if (attempt > 0) {
                    const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
                    await delay(waitTime);
                }

                const cleanApiKey = apiKey.trim(); // Ensure no sneaky whitespaces/newlines invalidate the key
                const genAI = new GoogleGenerativeAI(cleanApiKey);
                const model = genAI.getGenerativeModel({ model: modelName });

                // Build conversation history for context
                const chatHistory = (history || []).map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }],
                }));

                const chat = model.startChat({
                    history: [
                        { role: 'user', parts: [{ text: 'You are my AI coach. Here is your system context: ' + systemPrompt }] },
                        { role: 'model', parts: [{ text: `Hey ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your ApexAI Coach. I've reviewed your profile and recent performance data. How can I help you today?` }] },
                        ...chatHistory,
                    ],
                });

                const result = await chat.sendMessage(message);
                const reply = result.response.text();

                res.status(200).json({
                    reply,
                    model: modelName,
                    athleteContext: {
                        name: user?.name,
                        sport: user?.sport,
                        stats: user?.stats,
                    },
                });
                return;
            } catch (error) {
                console.error(`Gemini Chat error (${modelName}, attempt ${attempt + 1}):`, error.message);
                lastError = error.message;

                if (!isRateLimitError(error)) break; // Skip directly to next model if it's 404/400
                if (attempt === MAX_RETRIES) break;   // Move to next model after max retries
            }
        }
    }

    // --- FALLBACK MOCK RESPONSE ---
    // If we reach here, the API failed (likely 429 quota exceeded). 
    // Return a graceful mock response instead of a 429 error so the UI works.
    const msgLower = message.toLowerCase();
    const name = user?.name?.split(' ')[0] || 'Athlete';

    let fallbackReply = `Hey ${name}, my AI systems are currently resting due to API rate limits (Daily Quota Exceeded). But I'm still here! What are your core goals for this week?`;

    if (msgLower.includes('workout') || msgLower.includes('suggest')) {
        fallbackReply = `Since my AI is resting, I suggest keeping it simple today, ${name}! How about a 30-minute balanced workout (Cardio and Core) to maintain your stamina without overtraining?`;
    } else if (msgLower.includes('eat') || msgLower.includes('nutrition') || msgLower.includes('food')) {
        fallbackReply = `Focus on the basics, ${name}: lean proteins, complex carbs, and stay hydrated. A banana with peanut butter makes a great pre-workout snack!`;
    } else if (msgLower.includes('recover') || msgLower.includes('sore')) {
        fallbackReply = `Make sure to do some light stretching, stay hydrated, and get at least 8 hours of sleep tonight, ${name}. Recovery is where the gains happen!`;
    } else if (msgLower.includes('score') || msgLower.includes('improve')) {
        fallbackReply = `To boost your readiness score, make sure you balance your training load and get adequate recovery. Consistency over intensity right now, ${name}!`;
    }

    // Return a 200 with the fallback reply so the frontend doesn't crash
    res.status(200).json({
        reply: fallbackReply + "\n\n*(Standard Coach reply — AI connection currently rate-limited)*",
        model: "fallback-coach",
    });
});

export { chatWithAI };
