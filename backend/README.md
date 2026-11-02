# EduPay Tracker — Backend Service

A high-performance, modular **Node.js + Express + PostgreSQL (Drizzle ORM)** backend providing authentication synchronization, real-time student fee ledger management, Paystack checkout initialization & verification, and automated billing reminders.

---

## 📁 Backend Directory Structure

```
backend/
├── README.md               # Backend documentation & connection guide
├── package.json            # Backend dependencies and runner scripts
├── .env.example            # Environment variables template
├── server.ts               # Standalone Express server with CORS & API routing
└── src/
    ├── config/
    │   ├── db.ts           # PostgreSQL connection pool with lazy evaluation
    │   └── firebase.ts     # Firebase Admin Auth token verification
    ├── db/
    │   ├── schema.ts       # Relational Drizzle schema (Users, Institutions, Students, Fees, Payments, etc.)
    │   └── queries.ts      # Query layer with two-layer error handling & initial demo data seeding
    ├── middleware/
    │   └── auth.ts         # Bearer token authentication middleware
    ├── routes/
    │   └── api.ts          # REST endpoints for dashboard, students, payments, Paystack, and webhooks
    └── utils/
        ├── formatters.ts   # Receipt generation & currency formatting utilities
        └── paystack.ts     # Paystack reference creation & validation helpers
```

---

## 🔌 Connecting Your Frontend

To connect any external frontend (e.g. Next.js, React Vite, Vue, Mobile App):

### 1. Set the Backend API URL
In your frontend `.env`:
```env
VITE_API_URL="https://your-backend-app-url.run.app"
# Or during local development:
# VITE_API_URL="http://localhost:3000"
```

### 2. Making Authenticated Requests
Pass the Firebase ID token in the standard `Authorization` header:
```javascript
const response = await fetch(`${API_URL}/api/dashboard`, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`,
  },
});
const data = await response.json();
```

*Note: All endpoints also support optional demo authentication out-of-the-box for preview environments.*

---

## 🗄️ Database Schema Summary

The database uses PostgreSQL managed via Drizzle ORM:
- **`users`**: School bursar / admin accounts linked via Firebase UID.
- **`institutions`**: School profile, code, motto, currency (NGN, USD, GBP, etc.), official bank accounts, and Paystack API keys.
- **`students`**: Student records with admission numbers, grade levels, guardian contacts, billed amount, paid amount, and real-time status (`paid`, `partial`, `overdue`).
- **`fee_structures`**: Tuition fees, ICT/STEM levies, textbooks, and development charges configured by class and term.
- **`payments`**: Payment transaction logs, auto-generated receipt numbers (`RCP-2026-XXXX`), transaction references, and Paystack response IDs.
- **`subscriptions`**: Recurring installment billing schedules (monthly, weekly, termly).
- **`payment_reminders`**: WhatsApp & SMS fee reminder dispatch records.
- **`webhook_logs`**: Paystack `charge.success` audit history.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & database connection status |
| `GET` | `/api/docs` | Interactive JSON API specification |
| `POST` | `/api/auth/sync` | Syncs logged-in Firebase user & institution profile |
| `GET` | `/api/institution` | Retrieves school profile, bank details & Paystack keys |
| `PUT` | `/api/institution` | Updates school profile, bank details & Paystack keys |
| `GET` | `/api/dashboard` | Financial metrics, recovery rate %, student counts, monthly chart |
| `GET` | `/api/students` | List students with search `?q=`, `?grade=`, `?status=` |
| `POST` | `/api/students` | Enroll student and assign default grade tuition fees |
| `GET` | `/api/students/:id` | Detailed student ledger, payment history, and fee breakdown |
| `PUT` | `/api/students/:id` | Update student profile or fee balances |
| `DELETE`| `/api/students/:id` | Delete student and associated records |
| `GET` | `/api/payments` | Payment history and receipt log |
| `POST` | `/api/payments` | Record manual payment (bank transfer, cash, card, pos) |
| `GET` | `/api/fee-structures` | List configured school fee items |
| `POST` | `/api/fee-structures` | Create new tuition or levy item |
| `DELETE`| `/api/fee-structures/:id` | Delete fee structure item |
| `GET` | `/api/subscriptions` | List active recurring installment plans |
| `POST` | `/api/subscriptions` | Create a recurring billing plan |
| `PATCH`| `/api/subscriptions/:id` | Update plan status (`active`, `paused`, `cancelled`) |
| `POST` | `/api/reminders` | Dispatch & log WhatsApp, SMS, or email fee reminder |
| `POST` | `/api/paystack/initialize` | Initialize Paystack checkout with reference code |
| `POST` | `/api/paystack/verify` | Verify Paystack transaction and credit student balance |
| `POST` | `/api/webhooks/paystack` | Paystack webhook receiver for live checkout events |

---

## 🚀 Running the Standalone Backend

```bash
# 1. Install dependencies
npm install

# 2. Run in development with hot reload
npm run dev

# 3. Start production server
npm start
```
Default server will listen on port `3000` (or `PORT` environment variable).
