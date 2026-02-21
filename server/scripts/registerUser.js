// Simple CLI script to call the running backend register endpoint
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const url = process.env.REGISTER_URL || 'http://localhost:5001/api/auth/register';

const payload = {
  name: 'Divyanshu Verma',
  email: 'divyanshu@example.com',
  password: 'Password123',
  role: 'athlete',
};

async function register() {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    console.log('Register response status:', res.status);
    console.log(data);
  } catch (err) {
    console.error('Register error:', err);
  }
}

register();
