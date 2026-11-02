import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// 1. Users table (synced with Authentication UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  role: text('role').default('admin').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. School / Institution profile & credentials
export const institutions = pgTable('institutions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  motto: text('motto'),
  currency: text('currency').default('NGN').notNull(), // NGN, USD, GBP, GHS, KES
  address: text('address'),
  phone: text('phone'),
  email: text('email'),
  bankName: text('bank_name'),
  bankAccountName: text('bank_account_name'),
  bankAccountNumber: text('bank_account_number'),
  paystackPublicKey: text('paystack_public_key'),
  paystackSecretKey: text('paystack_secret_key'),
  currentTerm: text('current_term').default('First Term').notNull(),
  currentSession: text('current_session').default('2026/2027').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 3. Fee structure defined by the institution
export const feeStructures = pgTable('fee_structures', {
  id: serial('id').primaryKey(),
  institutionId: integer('institution_id')
    .references(() => institutions.id)
    .notNull(),
  name: text('name').notNull(),
  gradeLevel: text('grade_level').notNull(), // e.g. "Primary 1", "JSS 2", "All"
  category: text('category').default('Tuition').notNull(), // Tuition, Levy, ICT, Books, Uniform, Boarding
  term: text('term').default('First Term').notNull(),
  amount: integer('amount').notNull(),
  isCompulsory: boolean('is_compulsory').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. Students roster & ledger balances
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  institutionId: integer('institution_id')
    .references(() => institutions.id)
    .notNull(),
  admissionNumber: text('admission_number').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  gradeLevel: text('grade_level').notNull(),
  guardianName: text('guardian_name').notNull(),
  guardianPhone: text('guardian_phone').notNull(),
  guardianEmail: text('guardian_email'),
  gender: text('gender').default('Other'),
  totalBilled: integer('total_billed').default(0).notNull(),
  totalPaid: integer('total_paid').default(0).notNull(),
  status: text('status').default('partial').notNull(), // 'paid', 'partial', 'overdue'
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. Payment transactions & receipts
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  institutionId: integer('institution_id')
    .references(() => institutions.id)
    .notNull(),
  studentId: integer('student_id')
    .references(() => students.id)
    .notNull(),
  reference: text('reference').notNull().unique(),
  amount: integer('amount').notNull(),
  currency: text('currency').default('NGN').notNull(),
  paymentMethod: text('payment_method').notNull(), // 'paystack_card', 'paystack_bank', 'paystack_ussd', 'bank_transfer', 'cash', 'pos'
  channel: text('channel').default('paystack').notNull(), // 'paystack' | 'manual'
  status: text('status').default('success').notNull(), // 'success' | 'pending' | 'failed'
  feeCategory: text('fee_category').default('Tuition Fee').notNull(),
  term: text('term').default('First Term 2026/2027').notNull(),
  payerName: text('payer_name'),
  payerEmail: text('payer_email'),
  payerPhone: text('payer_phone'),
  paystackReference: text('paystack_reference'),
  receiptNumber: text('receipt_number').notNull(),
  notes: text('notes'),
  paidAt: timestamp('paid_at').defaultNow().notNull(),
});

// 6. Subscriptions / installment recurring plans
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  institutionId: integer('institution_id')
    .references(() => institutions.id)
    .notNull(),
  studentId: integer('student_id')
    .references(() => students.id)
    .notNull(),
  planName: text('plan_name').notNull(),
  planCode: text('plan_code').notNull(),
  interval: text('interval').notNull(), // 'monthly' | 'weekly' | 'termly'
  amount: integer('amount').notNull(),
  status: text('status').default('active').notNull(), // 'active' | 'paused' | 'completed' | 'cancelled'
  nextPaymentDate: text('next_payment_date'),
  autoDebitEnabled: boolean('auto_debit_enabled').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 7. Payment reminder history
export const paymentReminders = pgTable('payment_reminders', {
  id: serial('id').primaryKey(),
  institutionId: integer('institution_id')
    .references(() => institutions.id)
    .notNull(),
  studentId: integer('student_id')
    .references(() => students.id)
    .notNull(),
  channel: text('channel').notNull(), // 'whatsapp' | 'sms' | 'email'
  recipient: text('recipient').notNull(),
  message: text('message').notNull(),
  status: text('status').default('sent').notNull(),
  sentAt: timestamp('sent_at').defaultNow(),
});

// 8. Paystack Webhook audit log
export const webhookLogs = pgTable('webhook_logs', {
  id: serial('id').primaryKey(),
  institutionId: integer('institution_id'),
  event: text('event').notNull(),
  reference: text('reference'),
  payload: text('payload').notNull(),
  status: text('status').default('processed').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  institutions: many(institutions),
}));

export const institutionsRelations = relations(institutions, ({ one, many }) => ({
  user: one(users, {
    fields: [institutions.userId],
    references: [users.id],
  }),
  students: many(students),
  feeStructures: many(feeStructures),
  payments: many(payments),
  subscriptions: many(subscriptions),
  paymentReminders: many(paymentReminders),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [students.institutionId],
    references: [institutions.id],
  }),
  payments: many(payments),
  subscriptions: many(subscriptions),
  paymentReminders: many(paymentReminders),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  institution: one(institutions, {
    fields: [payments.institutionId],
    references: [institutions.id],
  }),
  student: one(students, {
    fields: [payments.studentId],
    references: [students.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  institution: one(institutions, {
    fields: [subscriptions.institutionId],
    references: [institutions.id],
  }),
  student: one(students, {
    fields: [subscriptions.studentId],
    references: [students.id],
  }),
}));
