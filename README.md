# Expense Tracker (Full-Stack)

Beginner-friendly full-stack Expense Tracker app with authentication, transaction management, dashboard analytics, AI suggestions (mock logic), and dark mode.

## Tech Stack

### Frontend
- React (functional components + hooks)
- Vite
- Recharts (Pie + Bar charts)
- Responsive CSS

### Backend
- Node.js + Express.js
- JWT authentication
- bcrypt password hashing

### Database
- MongoDB + Mongoose

---

## Project Structure

```txt
Dreamy_project/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
└── ai_service/ (existing helper service, not required for this app)
```

Backend follows an MVC style:
- **Models**: Mongoose schemas
- **Controllers**: route handlers/business logic
- **Routes**: API endpoints
- **Middleware**: auth verification

---

## Features Implemented

1. **User Authentication**
   - Register, Login, Logout
   - Protected dashboard route
   - JWT-based API security

2. **Expense Management**
   - Add transactions (income + expense)
   - Fields: amount, type, category, date, description
   - Edit and delete transactions
   - Per-user data isolation

3. **Dashboard**
   - Total balance, total income, total expenses
   - Recent transactions list

4. **Analytics**
   - Pie chart for category-wise expenses
   - Bar chart for monthly expenses

5. **AI Suggestions**
   - Rule-based mock suggestion engine (works offline)
   - Example output:
     - “You are spending too much on food...”
     - “Try reducing transport expenses...”

6. **Dark Mode**
   - Theme toggle button in header
   - Preference persisted in `localStorage`

7. **UX/Quality Extras**
   - Responsive layout
   - Validation + clear error messages
   - Loading and feedback states

---

## Step-by-Step Setup

## 1) Clone and install dependencies

```bash
# from repo root
cd server
npm install

cd ../client
npm install
```

## 2) Configure environment variables

Create `.env` files using examples:

```bash
cd server
cp .env.example .env

cd ../client
cp .env.example .env
```

## 3) Start MongoDB

Run MongoDB locally (default URL expected in `.env`).

## 4) Run backend

```bash
cd server
npm run dev
```

Backend runs on `http://localhost:5000`.

## 5) Run frontend

```bash
cd client
npm run dev
```

Frontend runs on Vite default URL (`http://localhost:5173`).

---

## Sample `.env` files

### `server/.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=replace-with-a-strong-secret
OPENAI_API_KEY=optional_if_using_real_ai
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## API Documentation

Base URL: `http://localhost:5000/api`

### Auth

#### `POST /auth/register`
Register new user.

Body:
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

Response:
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "...",
    "email": "user@example.com"
  }
}
```

#### `POST /auth/login`
Login existing user.

Body:
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

---

### Transactions (Protected)
Add header:
`Authorization: Bearer <token>`

#### `GET /transactions`
Get all current user's transactions.

#### `POST /transactions`
Create transaction.

Body:
```json
{
  "amount": 120.5,
  "type": "expense",
  "category": "food",
  "date": "2026-04-07",
  "description": "Groceries"
}
```

#### `PUT /transactions/:id`
Update transaction.

#### `DELETE /transactions/:id`
Delete transaction.

---

### Analytics (Protected)

#### `GET /analytics/dashboard`
Returns:
- totalIncome
- totalExpense
- balance
- recentTransactions

#### `GET /analytics/categories`
Category-wise expense breakdown for pie chart.

#### `GET /analytics/monthly`
Monthly expense totals for bar chart.

---

### Suggestions (Protected)

#### `GET /suggestions`
Returns AI-like spending suggestions from mock logic.

---

## Future Improvements (Optional Ideas)

- Add budget limits and overspending alerts
- Add downloadable CSV/PDF reports
- Add recurring transactions
- Integrate real OpenAI API suggestions with prompt tuning
- Add email verification + password reset
- Add unit/integration tests (Jest + React Testing Library + Supertest)

