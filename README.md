# AI Goal Tracker

A full-stack goal tracking application with JWT auth, goal management, and AI verification for completed goals.

## 1) Architecture (Brief)
- **Client (React)** handles auth, dashboard analytics, goal CRUD views, and AI feedback modal.
- **Server (Node + Express + MongoDB)** manages users, goals, JWT auth, and protected REST APIs.
- **AI Service (FastAPI)** evaluates goal completion levels based on user explanations.

## 2) Folder Structure
```
AI Goal Tracker/
├── client/          # React frontend
├── server/          # Node + Express API
└── ai_service/      # FastAPI AI evaluator
```

## 3) Backend (Node + Express)
### Key Routes
- `POST /auth/register`
- `POST /auth/login`
- `GET /goals` (protected)
- `POST /goals` (protected)
- `PUT /goals/:id` (protected)
- `DELETE /goals/:id` (protected)

### User Schema (MongoDB)
- `email` (unique, indexed)
- `password`

### Goal Schema (MongoDB)
- `title`
- `description`
- `category`
- `priority`
- `deadline`
- `status`
- `createdAt` / `updatedAt`

## 4) FastAPI (AI Service)
- `POST /ai/evaluate-goal` evaluates completion level and returns percentage + feedback.

## 5) Frontend (React)
Pages:
- Login / Register
- Dashboard
- Create Goal
- Goal List (filters + category sections)
- Goal Details
- AI Feedback Modal

## 6) Sample API Requests
### Register
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass1234"}'
```

### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass1234"}'
```

### Create Goal
```bash
curl -X POST http://localhost:5000/goals \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Read 10 pages","description":"Daily reading","category":"daily","priority":"medium","deadline":"2024-05-01"}'
```

### AI Evaluation
```bash
curl -X POST http://localhost:8000/ai/evaluate-goal \
  -H "Content-Type: application/json" \
  -d '{"goal":{"title":"Read 10 pages","description":"Daily reading","category":"daily","priority":"medium","deadline":"2024-05-01","status":"pending"},"user_explanation":"Finished all 10 pages and took notes."}'
```

## 7) Setup Steps
### Prerequisites
- Node.js 18+
- MongoDB running locally
- Python 3.10+

### Step 1: Backend API
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### Step 2: AI Service
```bash
cd ai_service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Step 3: Frontend
```bash
cd client
npm install
npm run dev
```

## Environment Variables
Create `server/.env`:
```
MONGO_URI=mongodb://localhost:27017/ai-goal-tracker
JWT_SECRET=replace-with-strong-secret
```

Create `client/.env`:
```
VITE_API_URL=http://localhost:5000
VITE_AI_URL=http://localhost:8000
```
