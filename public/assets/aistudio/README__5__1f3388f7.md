# EduPay Tracker - School Fees & Paystack Billing

EduPay Tracker is a comprehensive school fee, tuition, and academy payment tracking application with pending balance management, Paystack subscription & billing integration, automated receipts, reminder drafting, and an institution landing page with authentication.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or bun

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
The application will start on **http://localhost:3000** (or your designated port).

### 3. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── index.html                # HTML entry point with meta tags & fonts
├── metadata.json             # AI Studio applet metadata & config
├── package.json              # Project dependencies and npm scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite bundler & plugin configuration
├── public/                   # Static assets & public downloads
│   ├── assets/               # Public image assets
│   └── edupay-project.zip    # Pre-packaged ready-to-run project archive
└── src/                      # Source code
    ├── main.tsx              # React DOM entry point
    ├── App.tsx               # Main application controller & state
    ├── index.css             # Tailwind CSS & global styling
    ├── assets/               # Branding graphics and crests
    ├── components/           # UI Components
    │   ├── LandingPage.tsx           # Institution landing page with hero & sign in/up
    │   ├── AuthModal.tsx             # Modal for Sign In / Sign Up
    │   ├── Header.tsx                # App bar with quick actions & institution name
    │   ├── Sidebar.tsx               # Navigation between Dashboard, Students, Billing, etc.
    │   ├── DashboardOverview.tsx     # Metrics, balance summary, collection chart & recent transactions
    │   ├── StudentsList.tsx          # Student roster with filtering, search & balance status
    │   ├── StudentProfileModal.tsx   # Detailed fee breakdown & payment history per student
    │   ├── RecordPaymentModal.tsx    # Modal to log manual bank transfer, cash, or card
    │   ├── PaystackCheckoutModal.tsx # Interactive Paystack payment gateway simulator
    │   ├── PaystackBillingView.tsx   # Subscription plans, Webhook logs & API key config
    │   ├── FeeStructureManager.tsx   # Tuition & levy fee management by class/term
    │   ├── ReceiptModal.tsx          # Official printable payment receipt
    │   ├── PaymentReminderModal.tsx  # WhatsApp & SMS reminder generator
    │   └── InstitutionSettingsModal.tsx # School profile, bank info & currency settings
    ├── data/
    │   └── mockData.ts       # Initial student data, payment logs & fees
    ├── types/
    │   └── index.ts          # TypeScript interfaces for students, payments, plans
    └── utils/
        ├── formatters.ts     # Currency (NGN/USD/GBP), date & string helpers
        └── paystack.ts       # Paystack transaction verification and signature utilities
```

---

## 💳 Features
- **Landing Page & Authentication**: Complete public-facing school portal with Sign In and Sign Up modals.
- **Student Balance Ledger**: Real-time balance calculations, tracking Paid, Partial, and Overdue students.
- **Paystack Payment Gateway**: Simulated or live Paystack checkout popup supporting cards, bank transfers, and USSD.
- **Instant Receipts**: Printable, verified receipts with transaction reference numbers.
- **Automated Reminders**: Pre-composed WhatsApp and SMS fee reminders for parents.
- **Subscription Billing**: Recurring tuition and termly installment billing configurations.
