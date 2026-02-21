import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config({ path: './.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/apexai';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    const email = 'divyanshu@example.com';
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('User already exists:', email);
      await mongoose.disconnect();
      process.exit(0);
    }

    const user = new User({
      name: 'Divyanshu Verma',
      email,
      password: 'Password123',
      role: 'athlete',
    });

    await user.save();
    console.log('Seeded user:', email);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
