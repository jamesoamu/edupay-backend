import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  CheckCircle2, 
  Building2, 
  Banknote, 
  Smartphone,
  Layers
} from 'lucide-react';
import { PaymentMethod, Student } from '../types/index.ts';
import { formatCurrency } from '../utils/formatters.ts';

interface RecordPaymentModalProps {
  students: Student[];
  preSelectedStudent?: Student | null;
  currency: string;
  currentTerm: string;
  onClose: () => void;
  onSubmit: (paymentData: any) => Promise<void>;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  students,
  preSelectedStudent,
  currency,
  currentTerm,
  onClose,
  onSubmit,
}) => {
  const [studentId, setStudentId] = useState<number>(
    preSelectedStudent?.id || (students.length > 0 ? students[0].id : 0)
  );

  const selectedStudent = students.find((s) => s.id === studentId) || preSelectedStudent;
  const balance = selectedStudent ? Math.max(0, selectedStudent.totalBilled - selectedStudent.totalPaid) : 0;

  const [amount, setAmount] = useState<number>(balance > 0 ? balance : 50000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [feeCategory, setFeeCategory] = useState<string>('Tuition Fee');
  const [term, setTerm] = useState<string>(currentTerm || 'First Term 2026/2027');
  const [payerName, setPayerName] = useState<string>(selectedStudent?.guardianName || '');
  const [payerPhone, setPayerPhone] = useState<string>(selectedStudent?.guardianPhone || '');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Update payer details when student changes
  const handleStudentChange = (id: number) => {
    setStudentId(id);
    const stu = students.find((s) => s.id === id);
    if (stu) {
      const b = Math.max(0, stu.totalBilled - stu.totalPaid);
      setAmount(b > 0 ? b : 50000);
      setPayerName(stu.guardianName);
      setPayerPhone(stu.guardianPhone);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || amount <= 0) return;

    setSubmitting(true);
    try {
      await onSubmit({
        studentId,
        amount: Number(amount),
        currency,
        paymentMethod,
        channel: paymentMethod.startsWith('paystack') ? 'paystack' : 'manual',
        feeCategory,
        term,
        payerName,
        payerPhone,
        notes,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Record Fee Payment</h2>
              <p className="text-xs text-slate-400">Log bank transfer, cash, card, or POS deposit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Student selection */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Select Student Roster
            </label>
            <select
              value={studentId}
              onChange={(e) => handleStudentChange(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-medium"
            >
              {students.map((stu) => (
                <option key={stu.id} value={stu.id}>
                  {stu.firstName} {stu.lastName} ({stu.admissionNumber}) — {stu.gradeLevel} (Due: {formatCurrency(Math.max(0, stu.totalBilled - stu.totalPaid), currency)})
                </option>
              ))}
            </select>
          </div>

          {/* Student Balance Info pill */}
          {selectedStudent && (
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400">Current Outstanding Balance:</span>
                <div className="text-base font-bold font-mono text-rose-400">
                  {formatCurrency(balance, currency)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAmount(balance)}
                className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-semibold hover:bg-emerald-900 transition"
              >
                Pay Full Balance
              </button>
            </div>
          )}

          {/* Amount & Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Payment Amount ({currency})
              </label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-mono font-bold text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="bank_transfer">Direct Bank Transfer</option>
                <option value="cash">Counter Cash Payment</option>
                <option value="pos">School POS Terminal</option>
                <option value="paystack_card">Paystack Card (Visa/Mastercard)</option>
                <option value="paystack_bank">Paystack Direct Bank</option>
                <option value="paystack_ussd">Paystack USSD Code</option>
              </select>
            </div>
          </div>

          {/* Fee category & Term */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Fee Category
              </label>
              <select
                value={feeCategory}
                onChange={(e) => setFeeCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="Tuition Fee">Tuition Fee</option>
                <option value="Tuition & Levies Full Term">Tuition & Levies Full Term</option>
                <option value="ICT & STEM Lab Levy">ICT & STEM Lab Levy</option>
                <option value="Books & Uniforms">Books & Uniforms</option>
                <option value="PTA Development Levy">PTA Development Levy</option>
                <option value="Examination & Certification">Examination & Certification</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Academic Term & Session
              </label>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Payer info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Payer / Guardian Name
              </label>
              <input
                type="text"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Payer Phone Number
              </label>
              <input
                type="text"
                value={payerPhone}
                onChange={(e) => setPayerPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Internal Bursary Notes / Bank Narration
            </label>
            <input
              type="text"
              placeholder="e.g. Paid at Zenith Bank VI branch, teller #83921"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20 transition flex items-center space-x-2 disabled:opacity-50"
            >
              {submitting ? (
                <span>Recording...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Issue Receipt</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
