import React from 'react';
import { 
  X, 
  GraduationCap, 
  Phone, 
  Mail, 
  Calendar, 
  CreditCard, 
  Printer, 
  ShieldCheck, 
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Payment, Student } from '../types/index.ts';
import { formatCurrency, formatDate } from '../utils/formatters.ts';

interface StudentDetailed extends Student {
  payments?: Payment[];
  subscriptions?: any[];
  reminders?: any[];
}

interface StudentProfileModalProps {
  student: StudentDetailed | null;
  currency: string;
  onClose: () => void;
  onRecordPayment: (student: Student) => void;
  onPaystackCheckout: (student: Student) => void;
  onSendReminder: (student: Student) => void;
  onViewReceipt: (payment: Payment) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  currency,
  onClose,
  onRecordPayment,
  onPaystackCheckout,
  onSendReminder,
  onViewReceipt,
}) => {
  if (!student) return null;

  const balance = Math.max(0, student.totalBilled - student.totalPaid);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/80 sticky top-0 backdrop-blur-md z-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-white">
                  {student.firstName} {student.lastName}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {student.admissionNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Class: <span className="text-white font-semibold">{student.gradeLevel}</span> • Guardian: <span className="text-slate-300">{student.guardianName}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Financial Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Billed</span>
              <div className="text-xl font-bold font-mono text-white mt-0.5">
                {formatCurrency(student.totalBilled, currency)}
              </div>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Total Paid</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                {formatCurrency(student.totalPaid, currency)}
              </div>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">Balance Outstanding</span>
              <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">
                {formatCurrency(balance, currency)}
              </div>
            </div>
          </div>

          {/* Quick Actions for this student */}
          <div className="flex flex-wrap gap-2.5">
            {balance > 0 && (
              <button
                onClick={() => {
                  onClose();
                  onPaystackCheckout(student);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center space-x-2 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Pay via Paystack</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onRecordPayment(student);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center space-x-2 transition"
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Record Manual Payment</span>
            </button>

            {balance > 0 && (
              <button
                onClick={() => {
                  onClose();
                  onSendReminder(student);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-amber-950 text-slate-200 hover:text-amber-300 font-semibold text-xs border border-slate-700 flex items-center space-x-2 transition"
              >
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Draft Fee Reminder</span>
              </button>
            )}
          </div>

          {/* Guardian Info */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Guardian Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="font-semibold text-slate-400">Name:</span>
                <span>{student.guardianName}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{student.guardianPhone}</span>
              </div>
              {student.guardianEmail && (
                <div className="flex items-center space-x-2 text-slate-300 sm:col-span-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{student.guardianEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment History Ledger */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
              <CreditCard className="w-4 h-4 mr-1.5 text-emerald-400" />
              Payment History & Receipts ({student.payments?.length || 0})
            </h4>

            {(!student.payments || student.payments.length === 0) ? (
              <div className="p-6 rounded-2xl bg-slate-800/20 border border-slate-800 text-center text-xs text-slate-400">
                No recorded payments yet for this student.
              </div>
            ) : (
              <div className="border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800 text-xs">
                {student.payments.map((p) => (
                  <div key={p.id} className="p-3.5 flex items-center justify-between hover:bg-slate-800/30 transition">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-emerald-400">{p.receiptNumber}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {p.paymentMethod.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">{p.feeCategory} • {formatDate(p.paidAt)}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-white text-sm">
                        {formatCurrency(p.amount, p.currency)}
                      </span>
                      <button
                        onClick={() => onViewReceipt(p)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition"
                        title="Print Official Receipt"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
