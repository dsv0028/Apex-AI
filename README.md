# ⚡ ApexAI — AI-Based Training Platform for Athletes

> A full-stack, AI-powered sports performance platform built for athletes and coaches. Features JWT authentication, personalized workout generation, deep performance analytics, coach management, profile settings, and a sleek animated React frontend.

![Tech Stack](https://img.shields.io/badge/React-JSX-61DAFB?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb) ![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtoken) ![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
  - [Auth Routes](#auth-routes)
  - [Performance Routes](#performance-routes)
  - [Training Routes](#training-routes)
  - [Coach Routes](#coach-routes)
  - [Profile Routes](#profile-routes)
- [Frontend Pages](#-frontend-pages)
- [Role-Based Access](#-role-based-access)

---

## ✨ Features

### 🧑‍🤝‍🧑 Authentication

- User **Signup** with name, email, password, and role selection (`athlete` / `coach`)
- **Login** with email & password, returning a JWT token
- Passwords hashed securely with **bcryptjs**
- JWT stored in `localStorage` for persistent sessions
- Automatic redirection to dashboard after auth
- **Sign Out** clears session and redirects to Login
- Auth-aware landing page navbar — shows **Go to Dashboard** when logged in

### 📊 Athlete Dashboard

- **AI Readiness Score** — personalized performance indicator (0–100)
- **Weekly Progress Chart** — area chart of score and training load (Mon–Sun)
- **Calories Burned** card — latest training load metric
- **Injury Risk Indicator** — Low / Medium / High badge
- Dynamic greeting using authenticated user's name
- Dark / Light theme toggle

### 🏋️ AI Training Plan

- AI generates a personalized **Today's Workout** based on `stamina`, `speed`, and `strength` stats
- Workout focuses on **Endurance**, **Speed**, or **Strength** based on the highest stat
- **Upcoming Schedule** shows 2 future sessions
- Interactive **Workout Timer Modal** — step through exercises with auto-advance
- Progress bar tracking workout completion
- Exercise preview thumbnails with set counters

### 📈 Performance Analytics

- **Line Chart** — AI readiness score progress over time
- **Bar Chart** — weekly training load per day
- **Radar Chart** — skill profile across 6 dimensions (Endurance, Strength, Speed, Recovery, Consistency, Mental Focus)
- **Monthly Comparison Cards** — sessions, avg score, avg load, injury risk with % change vs last month
- **Score vs Load Correlation** — dual-axis line chart overlay
- Falls back to rich demo data when no real data exists yet

### 👤 Profile & Settings

- **Upload profile image** (base64, previewed instantly)
- **Edit athlete details** — name, bio, email
- **Select sport** from 15 sport options
- **Set training goals** — add/remove goal tags
- **Athlete stats sliders** — Stamina, Speed, Strength (used for AI workout generation)
- **Notification toggles** — Workout Reminders, Performance Alerts, Coach Messages, Weekly Report
- **Dark / Light mode toggle**
- **Change password** with current + new + confirm fields
- Live sync — avatar and name update in the navbar instantly on save

### 👨‍🏫 Coach Dashboard

- Coaches can list **all registered athletes**
- View any athlete's **performance chart** data
- **Assign custom training plans** to specific athletes
- Submit **feedback with ratings (1–5)** and comments for athletes
- All coach routes are locked behind role-based middleware

### 🎨 UI/UX

- Glassmorphism design with brand color system
- **Framer Motion** animations and staggered transitions
- Fully **responsive** — mobile sidebar + desktop top navbar
- Dark / Light mode with system preference detection
- Animated auth layout with floating background gradients
- Skeleton loading states on all data-fetching pages

---

## 🛠 Tech Stack

### Frontend

| Technology       | Purpose                                            |
| ---------------- | -------------------------------------------------- |
| React 19 (JSX)   | UI framework                                       |
| Vite             | Build tool & dev server                            |
| Framer Motion    | Animations & transitions                           |
| Recharts         | Data visualization (Line, Bar, Radar, Area charts) |
| Lucide React     | Icon library                                       |
| Axios            | API communication                                  |
| React Router DOM | Client-side routing                                |
| Tailwind CSS v4  | Utility-first styling                              |

### Backend

| Technology            | Purpose                       |
| --------------------- | ----------------------------- |
| Node.js               | JavaScript runtime            |
| Express.js v5         | Web framework                 |
| MongoDB               | NoSQL database                |
| Mongoose 9            | ODM for MongoDB               |
| JSON Web Tokens       | Authentication                |
| bcryptjs              | Password hashing              |
| dotenv                | Environment variables         |
| cors                  | Cross-origin resource sharing |
| express-async-handler | Async error handling          |
| nodemon               | Dev server hot-reload         |

---

## 📁 Project Structure

```
Apex-AI/
├── index.html                    # Vite entry point
├── vite.config.js                # Vite configuration
├── package.json                  # Frontend dependencies
│
├── src/
│   ├── main.jsx                  # React app entry
│   ├── App.jsx                   # Root app with routing
│   ├── index.css                 # Global styles + Tailwind
│   │
│   ├── components/
│   │   ├── ThemeProvider.jsx     # Dark/Light mode context
│   │   ├── Navbar.jsx            # Auth-aware landing page nav
│   │   ├── Hero.jsx              # Landing hero section
│   │   ├── Features.jsx          # Feature showcase
│   │   ├── HowItWorks.jsx        # Process walkthrough
│   │   ├── Testimonials.jsx      # User testimonials
│   │   ├── Footer.jsx            # Site footer
│   │   └── WorkoutTimerModal.jsx # Animated workout timer
│   │
│   ├── layouts/
│   │   ├── AuthLayout.jsx        # Split-screen auth wrapper
│   │   └── DashboardLayout.jsx   # Sidebar + top navbar shell
│   │
│   ├── pages/
│   │   ├── Login.jsx             # Login form with JWT auth
│   │   ├── Signup.jsx            # Signup with role selection
│   │   ├── Dashboard.jsx         # Main analytics dashboard
│   │   ├── Workouts.jsx          # AI training plan page
│   │   ├── Analytics.jsx         # Performance analytics charts
│   │   └── Settings.jsx          # Profile & settings page
│   │
│   └── lib/
│       └── utils.js              # Utility helpers (cn)
│
└── server/
    ├── server.js                 # Express app & middleware
    ├── package.json              # Backend dependencies
    ├── .env                      # Environment variables (not in git)
    │
    ├── config/
    │   └── db.js                 # MongoDB connection setup
    │
    ├── models/
    │   ├── User.js               # User schema (name, email, role, profile, stats)
    │   ├── Performance.js        # Daily performance logs
    │   ├── Workout.js            # Workout plans + exercises
    │   └── Feedback.js           # Coach feedback schema
    │
    ├── controllers/
    │   ├── authController.js     # Register & login logic
    │   ├── performanceController.js # Analytics CRUD + monthly + radar
    │   ├── trainingController.js # AI workout generation
    │   ├── coachController.js    # Coach management APIs
    │   └── profileController.js  # Profile get/update/password
    │
    ├── routes/
    │   ├── authRoutes.js         # /api/auth/*
    │   ├── performanceRoutes.js  # /api/performance/*
    │   ├── trainingRoutes.js     # /api/training/*
    │   ├── coachRoutes.js        # /api/coach/*
    │   └── profileRoutes.js      # /api/profile/*
    │
    └── middleware/
        └── authMiddleware.js     # JWT protect + coachGuard
```

---

## 📦 Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB** running locally on port `27017`

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/dsv0028/Apex-AI.git
cd Apex-AI
```

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create the `.env` file inside the `server/` directory:

```bash
cp .env.example .env  # or create manually — see Environment Variables below
```

Start the backend server:

```bash
npm start           # production
# or with hot-reload:
npm run dev
```

The backend will start at **http://localhost:5001**

### 3. Set Up the Frontend

Open a new terminal tab:

```bash
cd Apex-AI        # root directory
npm install
npm run dev
```

The frontend will start at **http://localhost:5173** (or `5174` if port is busy)

### 4. Open the App

Navigate to **http://localhost:5173** in your browser. Sign up for a new account to get started!

---

## 🔐 Environment Variables

Create a `.env` file in the `/server` directory:

```env
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/apexai
JWT_SECRET=your_super_secret_key_here
```

| Variable     | Description                   | Example                            |
| ------------ | ----------------------------- | ---------------------------------- |
| `NODE_ENV`   | Environment mode              | `development`                      |
| `PORT`       | Backend server port           | `5001`                             |
| `MONGO_URI`  | MongoDB connection string     | `mongodb://localhost:27017/apexai` |
| `JWT_SECRET` | Secret for signing JWT tokens | Any long random string             |

> ⚠️ Never commit your `.env` file to version control. It is already listed in `.gitignore`.

---

## 📡 API Documentation

All protected routes require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

---

### Auth Routes

**Base URL:** `/api/auth`

#### `POST /api/auth/register`

Register a new user.

**Request Body:**

```json
{
  "name": "Divyanshu Verma",
  "email": "divyanshu@example.com",
  "password": "password123",
  "role": "athlete"
}
```

{
"password": "Password123"

**Response `201`:**

```json
    "password": "Password123"
  "_id": "64a...",
  "name": "Divyanshu Verma",
  "email": "divyanshu@example.com",
  "role": "athlete",
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

---

#### `POST /api/auth/login`

Login with existing credentials.

**Request Body:**

```json
{
  "email": "divyanshu@example.com",
  "password": "password123"
}
```

**Response `200`:**

```json
{
  "_id": "64a...",
  "name": "Divyanshu Verma",
  "email": "divyanshu@example.com",
  "role": "athlete",
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

---

### Performance Routes

**Base URL:** `/api/performance` | 🔒 Requires JWT

#### `POST /api/performance`

Log a daily performance entry.

**Request Body:**

```json
{
  "aiScore": 87,
  "trainingLoad": 650,
  "injuryRisk": "Low",
  "date": "2026-02-21"
}
```

---

#### `GET /api/performance/:userId`

Get the last 7 days of performance, grouped by weekday for chart rendering.

**Response `200`:**

```json
[
  { "id": "...", "day": "Mon", "score": 72, "load": 550 },
  { "id": "...", "day": "Sat", "score": 95, "load": 850 }
]
```

---

#### `GET /api/performance/summary/:userId`

Get the latest performance snapshot for dashboard cards.

**Response `200`:**

```json
{
  "aiScore": 95,
  "trainingLoad": 850,
  "injuryRisk": "Low",
  "lastUpdated": "2026-02-21T07:12:26.580Z"
}
```

---

#### `GET /api/performance/monthly/:userId`

Get current vs previous month comparison with % changes.

**Response `200`:**

```json
{
  "thisMonth": {
    "sessions": 18,
    "avgScore": 86,
    "avgLoad": 640,
    "injuryRisk": "Low"
  },
  "lastMonth": {
    "sessions": 14,
    "avgScore": 79,
    "avgLoad": 590,
    "injuryRisk": "Low"
  },
  "changes": { "sessions": 29, "avgScore": 9, "avgLoad": 8 }
}
```

---

#### `GET /api/performance/radar/:userId`

Get skill radar chart data derived from workouts and performance history.

**Response `200`:**

```json
[
  { "skill": "Endurance", "value": 84 },
  { "skill": "Strength", "value": 71 },
  { "skill": "Speed", "value": 77 },
  { "skill": "Recovery", "value": 89 },
  { "skill": "Consistency", "value": 78 },
  { "skill": "Mental Focus", "value": 93 }
]
```

---

### Training Routes

**Base URL:** `/api/training` | 🔒 Requires JWT

#### `POST /api/training/generate`

Generate a personalized AI training plan based on user stats.

**Request Body:**

```json
{
  "stamina": 85,
  "speed": 60,
  "strength": 75
}
```

**AI Logic:**

- Highest stat wins → focus area is `Endurance`, `Speed`, or `Strength`
- Duration: Endurance = 60 min, others = 45 min
- Calories: Endurance = 600 kcal, others = 450 kcal

---

#### `GET /api/training/:userId`

Fetch active (pending) training plan for a user.

---

#### `PUT /api/training/progress`

Mark a workout as completed.

**Request Body:**

```json
{
  "workoutId": "64a...",
  "status": "Completed"
}
```

---

### Coach Routes

**Base URL:** `/api/coach` | 🔒 Requires JWT + `coach` role

#### `GET /api/coach/athletes`

List all registered athletes.

#### `GET /api/coach/performance/:athleteId`

View an athlete's weekly performance chart data.

#### `POST /api/coach/assign-training`

Assign a custom training plan to an athlete.

#### `POST /api/coach/feedback`

Submit feedback (rating 1–5 + comments) for an athlete.

---

### Profile Routes

**Base URL:** `/api/profile` | 🔒 Requires JWT

#### `GET /api/profile/me`

Get the current user's full profile.

**Response `200`:**

```json
{
  "_id": "64a...",
  "name": "Divyanshu Verma",
  "email": "divyanshu@example.com",
  "role": "athlete",
  "bio": "Sprinter and fitness enthusiast",
  "sport": "Running",
  "goals": ["Run 5km under 25min", "Improve VO2 max"],
  "profileImage": "<base64 string>",
  "stats": { "stamina": 80, "speed": 70, "strength": 65 },
  "notifications": {
    "workoutReminders": true,
    "performanceAlerts": true,
    "coachMessages": true,
    "weeklyReport": false
  }
}
```

---

#### `PUT /api/profile/me`

Update profile fields (any combination of the fields below).

**Request Body:**

```json
{
  "name": "Divyanshu Verma",
  "bio": "Updated bio",
  "sport": "Running",
  "goals": ["Run 5km under 25min"],
  "profileImage": "<base64 data URL>",
  "stats": { "stamina": 85, "speed": 75, "strength": 70 },
  "notifications": { "weeklyReport": true }
}
```

---

#### `PUT /api/profile/password`

Change the account password.

**Request Body:**

```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## 📱 Frontend Pages

| Route                  | Component       | Description                                      |
| ---------------------- | --------------- | ------------------------------------------------ |
| `/`                    | Landing Page    | Hero, Features, Testimonials — auth-aware navbar |
| `/login`               | `Login.jsx`     | JWT login form                                   |
| `/signup`              | `Signup.jsx`    | Signup with role selection                       |
| `/dashboard`           | `Dashboard.jsx` | Performance overview + charts                    |
| `/dashboard/workouts`  | `Workouts.jsx`  | AI training plan + workout timer                 |
| `/dashboard/analytics` | `Analytics.jsx` | Line, Bar, Radar charts + monthly comparison     |
| `/dashboard/settings`  | `Settings.jsx`  | Profile image, bio, sport, goals, notifications  |

---

## 🛡 Role-Based Access

| Feature                    | Athlete | Coach |
| -------------------------- | ------- | ----- |
| View own dashboard         | ✅      | ✅    |
| Log performance            | ✅      | ❌    |
| Generate training plan     | ✅      | ❌    |
| View own workout timer     | ✅      | ❌    |
| View analytics charts      | ✅      | ✅    |
| Edit own profile           | ✅      | ✅    |
| List all athletes          | ❌      | ✅    |
| View athlete performance   | ❌      | ✅    |
| Assign training to athlete | ❌      | ✅    |
| Submit feedback            | ❌      | ✅    |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  Built with ❤️ using React, Node.js, and MongoDB
</div>
