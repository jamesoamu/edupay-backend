export type CurrencyCode = 'NGN' | 'USD' | 'GBP' | 'GHS' | 'KES';

export type StudentFeeStatus = 'paid' | 'partial' | 'overdue';

export type PaymentMethod = 
  | 'paystack_card' 
  | 'paystack_bank' 
  | 'paystack_ussd' 
  | 'bank_transfer' 
  | 'cash' 
  | 'pos';

export interface UserProfile {
  id: number;
  uid: string;
  email: string;
  displayName?: string | null;
  photoUrl?: string | null;
  role: string;
}

export interface Institution {
  id: number;
  userId: number;
  name: string;
  code: string;
  motto?: string | null;
  currency: CurrencyCode;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  bankName?: string | null;
  bankAccountName?: string | null;
  bankAccountNumber?: string | null;
  paystackPublicKey?: string | null;
  paystackSecretKey?: string | null;
  currentTerm: string;
  currentSession: string;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
}

export interface FeeStructure {
  id: number;
  institutionId: number;
  name: string;
  gradeLevel: string;
  category: string;
  term: string;
  amount: number;
  isCompulsory: boolean;
  createdAt?: string | Date | null;
}

export interface Student {
  id: number;
  institutionId: number;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string | null;
  gender?: string | null;
  totalBilled: number;
  totalPaid: number;
  status: StudentFeeStatus;
  createdAt?: string | Date | null;
}

export interface Payment {
  id: number;
  institutionId: number;
  studentId: number;
  studentName?: string;
  admissionNumber?: string;
  reference: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  channel: 'paystack' | 'manual';
  status: 'success' | 'pending' | 'failed';
  feeCategory: string;
  term: string;
  payerName?: string | null;
  payerEmail?: string | null;
  payerPhone?: string | null;
  paystackReference?: string | null;
  receiptNumber: string;
  notes?: string | null;
  paidAt: string | Date;
}

export interface SubscriptionPlan {
  id: number;
  institutionId: number;
  studentId: number;
  studentName?: string;
  admissionNumber?: string;
  planName: string;
  planCode: string;
  interval: 'monthly' | 'weekly' | 'termly';
  amount: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  nextPaymentDate?: string | null;
  autoDebitEnabled: boolean;
  createdAt?: string | Date | null;
}

export interface PaymentReminder {
  id: number;
  institutionId: number;
  studentId: number;
  studentName?: string;
  channel: 'whatsapp' | 'sms' | 'email';
  recipient: string;
  message: string;
  status: string;
  sentAt?: string | Date | null;
}

export interface DashboardMetrics {
  totalBilled: number;
  totalCollected: number;
  totalOutstanding: number;
  collectionRate: number;
  totalStudents: number;
  paidStudents: number;
  partialStudents: number;
  overdueStudents: number;
  recentPayments: Payment[];
  chartData: { month: string; amount: number; count: number }[];
}
