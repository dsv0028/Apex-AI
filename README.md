# ⚡ ApexAI — AI-Powered Athletic Performance & Training Management Platform

> A full-stack, enterprise-grade sports performance ecosystem built for athletes and coaches on the MERN stack. Features AI workout generation, real-time Socket.io messaging, interval timer suites, barbell plate calculators, daily recovery check-ins with muscle soreness heatmaps, sports science calculators, video form check reviews, nutrition tracking, periodization calendars, workout logging with 1RM PR benchmarks, automated achievement badges, and 1-click monthly PDF performance report exports.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb)
![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-010101?logo=socket.io)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtoken)
![Vite](https://img.shields.io/badge/Build-Vite_7-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v4-38B2AC?logo=tailwind-css)

---

## 📋 Table of Contents

- [✨ Features Suite](#-features-suite)
  - [1. 🏋️ Training & Periodization](#1-️-training--periodization)
  - [2. ⚡ Gym Lab, Recovery & Biometrics](#2--gym-lab-recovery--biometrics)
  - [3. 👥 Team, Coaching & Social](#3--team-coaching--social)
  - [4. 📊 Analytics, AI & Gamification](#4--analytics-ai--gamification)
  - [5. 🔐 Auth, Security & Profile](#5--auth-security--profile)
- [🛠 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Environment Variables](#️-environment-variables)
- [📡 API Documentation](#-api-documentation)
- [🧭 Sidebar Directory Map](#-sidebar-directory-map)

---

## ✨ Features Suite

### 1. 🏋️ Training & Periodization

* **AI Training Routine Generator:** Dynamic workout routines generated using Gemini AI based on athlete physical metrics (*Stamina*, *Speed*, *Strength*).
* **Interactive Workout Timer Modal:** Guided exercise progression with auto-advance, set counters, rest timers, and exercise preview images.
* **Interactive Training Calendar:** Monthly matrix planner with one-click completion toggles (*Completed*, *Skipped*, *Scheduled*) and training load tracking.
* **Workout Logging & PR Tracker:** Log sets, weights (kg), reps, and RPE with automated **Epley 1-Rep Max (1RM)** estimation, lifetime tonnage counters, and PR celebratory alerts.
* **Exercise Library & Custom Routine Builder:** Searchable catalog with muscle group chips, equipment filters, expandable technique guides, pro coaching tips, and a floating custom routine builder tray.

---

### 2. ⚡ Gym Lab, Recovery & Biometrics

* **Interval & Circuit Timer Suite:**
  * **Tabata Mode:** Configurable work/rest intervals and round tracking.
  * **EMOM Mode:** *Every Minute on the Minute* countdown timers.
  * **AMRAP Mode:** *As Many Rounds As Possible* with instant tap round counter.
  * **Stopwatch:** Centisecond stopwatch with split lap tracking.
  * **Web Audio Sound Synthesis:** In-browser synthesized audio countdown beeps (3, 2, 1) and buzzers without external audio downloads.
* **Visual Barbell Plate Calculator & Loader:** Color-coded Olympic bumper plate visualizer (🔴 25kg, 🔵 20kg, 🟡 15kg, 🟢 10kg, ⚪ 5kg, 🔴 2.5kg, 🔵 1.25kg, ⚪ 0.5kg) with bar selector (20kg, 15kg, 10kg) and collar clamp weights.
* **Daily Recovery & Muscle Soreness Heatmap:** Morning biometric check-in (Sleep Hours, Sleep Quality, Stress, Energy) + 10-point muscle soreness rating matrix that dynamically recalculates athlete readiness scores.
* **Sports Science & Performance Calculators:**
  * **Wilks & DOTS Coefficients:** Official powerlifting strength comparison normalized against bodyweight and gender.
  * **Karvonen Heart Rate Zones:** Computes Max HR, Heart Rate Reserve, and training Zones 1 through 5 (*Recovery to VO2 Max*).
  * **Race Pace & Split Predictor:** Riegel formula race projections for 5k, 10k, Half-Marathon, and Full Marathon.
  * **1RM Percentage Matrix:** Generates working set weights from 50% to 100% of 1RM with estimated rep ranges.
* **Daily Nutrition & Macro Target Tracker:** Macro progress rings (*Calories, Protein, Carbs, Fats*), categorized meal logger (*Breakfast, Lunch, Dinner, Snack, Pre/Post-Workout*), and quick-tap hydration counter.

---

### 3. 👥 Team, Coaching & Social

* **Real-Time Coach-Athlete Messaging:** Instant 1-on-1 direct messaging powered by **Socket.io** with live typing indicators (`"Coach is typing..."`), read status, and contact lists.
* **Athlete Social Feed & Community Hub:** Activity timeline to share training milestones, attach workout volume summaries, react with emojis (🔥, 👏, ⚡, 🏆), and comment.
* **Video Form Check & Coach Annotations:** Athletes submit lifting footage; coaches scrub playheads and place **timestamped feedback pins** with severity tags (*Correction, Warning, Praise, Info*).
* **Coach Team Hub & Multi-Athlete Roster:** Side-by-side athlete readiness matrix, injury risk alerts, and a **Bulk Assign Routine** modal to dispatch workouts to multiple athletes simultaneously.

---

### 4. 📊 Analytics, AI & Gamification

* **Performance Analytics:** Area charts for readiness score progression, weekly training volume bar charts, and 6-dimensional Radar charts (*Endurance, Strength, Speed, Recovery, Consistency, Mental Focus*).
* **1-Click Monthly PDF Performance Report:** Generates high-resolution branded PDF reports (`ApexAI_Performance_Report.pdf`) containing charts, radar metrics, and coach notes via `jspdf` and `html2canvas`.
* **Dynamic Badges & Gamification Engine:** Auto-unlocks milestones (*Century Club 100kg*, *7-Day Iron Will*, *10 Tonne Club*, *Hydration Champion*) with celebratory `canvas-confetti` bursts.
* **AI Coach Consultation:** Interactive sports consultation chat powered by Google Gemini API.
* **Global Leaderboard:** Global athlete rankings filtered by Readiness Score, Training Load, and Consistency.

---

### 5. 🔐 Auth, Security & Profile

* **JWT Authentication:** Stateless auth with `bcryptjs` password hashing and role-based guards (`athlete` vs `coach`).
* **Profile & Physical Metrics:** Profile avatar upload, athletic bio, sport selection (15+ disciplines), and physical sliders (*Stamina, Speed, Strength*) that feed directly into AI workout generation.
* **Dark / Light Glassmorphic Theme:** System preference detection and instant toggle with Framer Motion transitions.

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `19.2.0` | Modern UI component framework |
| **Vite** | `7.3.1` | Lightning-fast build tool & dev server |
| **Tailwind CSS** | `4.2.0` | Utility-first styling & design tokens |
| **Framer Motion** | `12.34.3` | Fluid page transitions & spring animations |
| **Recharts** | `3.7.0` | Line, Bar, Area, and Radar data visualizations |
| **Socket.io Client** | `4.8.3` | Real-time WebSocket bidirectional messaging |
| **jsPDF & html2canvas** | `^4.2` / `^1.4` | Client-side vector PDF report card generation |
| **canvas-confetti** | `^1.9.4` | Celebratory milestone and PR particle animations |
| **Lucide React** | `0.575.0` | Iconography suite |
| **Axios** | `1.13.5` | Promise-based REST API client |
| **React Router DOM** | `7.13.0` | Client-side routing with protected route guards |

### Backend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js & Express** | `5.2.1` | REST API runtime & web framework |
| **MongoDB & Mongoose** | `9.2.1` | Object Data Modeling (ODM) database |
| **Socket.io Server** | `4.8.3` | WebSocket server for real-time rooms & events |
| **JSON Web Tokens (JWT)**| `9.0.3` | Stateless token authorization |
| **bcryptjs** | `3.0.3` | Password encryption & salt hashing |
| **Google Generative AI**| `0.24.1` | Gemini AI coaching & workout generation |
| **Multer** | `^2.0.2` | Multipart upload handling for video & media |
| **CORS & Dotenv** | — | Cross-origin resource sharing & environment loading |

---

## 📁 Project Structure

```
Apex-AI/
├── index.html                    # Frontend entry
├── vite.config.js                # Vite build config
├── package.json                  # Frontend dependencies
│
├── src/
│   ├── main.jsx                  # React application root
│   ├── App.jsx                   # Application router & layout guards
│   ├── index.css                 # Global Tailwind styles & design tokens
│   │
│   ├── components/
│   │   ├── ThemeProvider.jsx     # Dark/Light mode context
│   │   ├── Navbar.jsx            # Landing page navbar
│   │   ├── Hero.jsx              # Landing hero section
│   │   ├── Features.jsx          # Feature showcase
│   │   ├── HowItWorks.jsx        # Platform workflow
│   │   ├── Testimonials.jsx      # Social proof
│   │   ├── Footer.jsx            # Footer
│   │   ├── PrivateRoute.jsx      # Auth verification wrapper
│   │   └── WorkoutTimerModal.jsx # Active workout step timer
│   │
│   ├── layouts/
│   │   ├── AuthLayout.jsx        # Split-screen auth layout
│   │   └── DashboardLayout.jsx   # 4-Section categorized sidebar layout
│   │
│   └── pages/
│       ├── Login.jsx             # User login
│       ├── Signup.jsx            # User registration with role selection
│       ├── Dashboard.jsx         # Executive overview & readiness score
│       ├── Workouts.jsx          # AI workout generation & timer
│       ├── Calendar.jsx          # Periodization training calendar
│       ├── WorkoutLogs.jsx       # Volume logging, PRs & Badge showcase
│       ├── ExerciseLibrary.jsx   # Movement catalog & routine builder
│       ├── TimerSuite.jsx        # Tabata, EMOM, AMRAP, Stopwatch
│       ├── PlateCalculator.jsx   # Visual Olympic barbell plate loader
│       ├── Recovery.jsx          # Muscle soreness heatmap & check-in
│       ├── Calculators.jsx       # Wilks, DOTS, HR Zones, Race Pace
│       ├── CoachRoster.jsx       # Team roster & bulk workout assigner
│       ├── Messages.jsx          # Real-time Socket.io coach-athlete chat
│       ├── Community.jsx         # Social activity stream & cheer reactions
│       ├── Nutrition.jsx         # Daily macros & hydration tracking
│       ├── VideoReview.jsx       # Video form check & timestamp notes
│       ├── Analytics.jsx         # Charts & 1-click PDF export
│       ├── AIChat.jsx            # Gemini AI sports consultation
│       ├── Leaderboard.jsx       # Global rankings
│       └── Settings.jsx          # Profile, physical sliders & credentials
│
└── server/
    ├── server.js                 # Express app, HTTP & Socket.io server
    ├── package.json              # Backend dependencies
    ├── .env                      # Environment variables (git-ignored)
    │
    ├── config/
    │   └── db.js                 # MongoDB connection setup
    │
    ├── models/
    │   ├── User.js               # User accounts, roles, physical stats
    │   ├── Performance.js        # Daily readiness & load logs
    │   ├── Workout.js            # Generated workouts & exercises
    │   ├── WorkoutLog.js         # Logged workouts, sets, tonnage, PRs
    │   ├── Schedule.js           # Calendar training sessions
    │   ├── Exercise.js           # Exercise catalog & custom exercises
    │   ├── Conversation.js       # Direct chat conversation threads
    │   ├── Message.js            # Direct chat messages
    │   ├── Post.js               # Community posts, cheers, comments
    │   ├── Nutrition.js          # Daily meals, calories, macros, water
    │   ├── VideoReview.js        # Video clips & timestamped coach pins
    │   ├── Achievement.js        # Badge definitions & user unlocks
    │   ├── RecoveryLog.js        # Sleep, stress, soreness check-ins
    │   ├── TeamAssignment.js     # Coach bulk assignment records
    │   └── Feedback.js           # Coach athlete feedback ratings
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── performanceController.js
    │   ├── trainingController.js
    │   ├── workoutLogController.js
    │   ├── scheduleController.js
    │   ├── exerciseController.js
    │   ├── messageController.js
    │   ├── postController.js
    │   ├── nutritionController.js
    │   ├── videoReviewController.js
    │   ├── achievementController.js
    │   ├── recoveryController.js
    │   ├── coachRosterController.js
    │   ├── coachController.js
    │   ├── chatController.js
    │   └── profileController.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── performanceRoutes.js
    │   ├── trainingRoutes.js
    │   ├── workoutLogRoutes.js
    │   ├── scheduleRoutes.js
    │   ├── exerciseRoutes.js
    │   ├── messageRoutes.js
    │   ├── postRoutes.js
    │   ├── nutritionRoutes.js
    │   ├── videoReviewRoutes.js
    │   ├── achievementRoutes.js
    │   ├── recoveryRoutes.js
    │   ├── coachRosterRoutes.js
    │   ├── coachRoutes.js
    │   ├── chatRoutes.js
    │   └── profileRoutes.js
    │
    ├── middleware/
    │   └── authMiddleware.js     # JWT verification & coachGuard
    │
    └── scripts/
        ├── seedUser.js           # Direct MongoDB user seed script
        └── registerUser.js       # CLI register endpoint tester
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MongoDB** (Local instance running at `mongodb://localhost:27017` or MongoDB Atlas URI)

### 1. Clone & Install Dependencies

```powershell
# Clone the repository
git clone https://github.com/dsv0028/Apex-AI.git
cd Apex-AI

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment Variables
Create a file at `server/.env`:

```env
NODE_ENV=development
API_PORT=5001
MONGO_URI=mongodb://localhost:27017/apexai
JWT_SECRET=supersecret123
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Seed Default Sample User (Optional)
```powershell
cd server
node scripts/seedUser.js
cd ..
```
* **Default Login:** `divyanshu@example.com` / `Password123`

### 4. Run Locally

Open two terminal windows:

* **Terminal 1 (Backend API & Socket.io Server):**
  ```powershell
  cd server
  npm run dev
  ```
  *Server runs at `http://localhost:5001`*

* **Terminal 2 (Vite Frontend):**
  ```powershell
  npm run dev
  ```
  *Frontend runs at `http://localhost:5173`*

---

## 📡 API Documentation

All protected routes require an `Authorization: Bearer <jwt_token>` header.

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new athlete or coach | Public |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | Public |
| `GET` | `/api/profile/me` | Fetch authenticated user profile | Private |
| `PUT` | `/api/profile/me` | Update bio, stats, sport, avatar | Private |
| `GET` | `/api/training/today` | Generate/fetch today's AI workout | Private |
| `GET` | `/api/performance/:userId` | Get weekly score & load trends | Private |
| `GET` | `/api/performance/radar/:userId` | Get 6-dimension skill radar | Private |
| `GET` | `/api/logs` | Fetch workout history, volume & PRs | Private |
| `POST` | `/api/logs` | Log completed session with sets/reps | Private |
| `GET` | `/api/schedule` | Get scheduled training calendar | Private |
| `POST` | `/api/schedule` | Schedule a future training routine | Private |
| `PATCH`| `/api/schedule/:id/status` | Mark completed / skipped | Private |
| `GET` | `/api/exercises` | Browse catalog (filter by muscle/eq) | Private |
| `POST` | `/api/exercises` | Create user custom exercise | Private |
| `GET` | `/api/messages/users` | Get chat contacts & roster | Private |
| `GET` | `/api/messages/:recipientId` | Get message thread history | Private |
| `POST` | `/api/messages` | Send direct message (Socket.io) | Private |
| `GET` | `/api/posts` | Get community activity stream | Private |
| `POST` | `/api/posts` | Share workout update or PR | Private |
| `POST` | `/api/posts/:id/react` | Toggle cheer reaction (🔥, 👏, ⚡, 🏆) | Private |
| `GET` | `/api/nutrition` | Get daily macros, meals, hydration | Private |
| `POST` | `/api/nutrition/meal` | Log meal (protein, carbs, fats) | Private |
| `POST` | `/api/nutrition/water` | Update hydration (+/- ml) | Private |
| `GET` | `/api/video-reviews` | Get form check video reviews | Private |
| `POST` | `/api/video-reviews` | Submit lifting video clip | Private |
| `POST` | `/api/video-reviews/:id/annotations` | Coach pins timestamped note | Coach |
| `GET` | `/api/achievements` | Get milestone badges & streak | Private |
| `GET` | `/api/recovery` | Get sleep & soreness check-in | Private |
| `POST` | `/api/recovery` | Submit daily recovery log | Private |
| `GET` | `/api/roster` | Get team readiness comparison matrix | Coach |
| `POST` | `/api/roster/bulk-assign` | Bulk deploy routine to athletes | Coach |
| `POST` | `/api/chat` | Query AI sports coach (Gemini) | Private |
| `GET` | `/api/leaderboard` | Get global athlete rankings | Private |

---

## 🧭 Sidebar Directory Map

The dashboard sidebar is organized into 4 logical categories:

```
ApexAI Navigation
├── 🏋️ TRAINING
│   ├── Overview          (/dashboard)
│   ├── Workouts          (/dashboard/workouts)
│   ├── Calendar          (/dashboard/calendar)
│   ├── Workout Log       (/dashboard/logs)
│   └── Exercises         (/dashboard/exercises)
│
├── ⚡ GYM LAB & RECOVERY
│   ├── Timers            (/dashboard/timers)
│   ├── Plate Calc        (/dashboard/plate-calculator)
│   ├── Recovery          (/dashboard/recovery)
│   ├── Calculators       (/dashboard/calculators)
│   └── Nutrition         (/dashboard/nutrition)
│
├── 👥 TEAM & COACHING
│   ├── Messages          (/dashboard/messages)
│   ├── Community         (/dashboard/community)
│   ├── Video Review      (/dashboard/video-review)
│   └── Coach Hub         (/dashboard/roster)
│
└── 📊 ANALYTICS & AI
    ├── Analytics         (/dashboard/analytics)
    ├── AI Coach          (/dashboard/ai-coach)
    ├── Leaderboard       (/dashboard/leaderboard)
    └── Settings          (/dashboard/settings)
```

---

## 📄 License
This project is open-source under the [ISC License](LICENSE).
