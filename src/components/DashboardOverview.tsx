import React from 'react';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight,
  ShieldCheck, 
  Printer,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { DashboardMetrics, Payment } from '../types/index.ts';
import { formatCurrency, formatDate } from '../utils/formatters.ts';

interface DashboardOverviewProps {
  metrics: DashboardMetrics | null;
  currency: string;
  onOpenRecordPayment: () => void;
  onOpenPaystackSimulator: () => void;
  onSelectStudent: (studentId: number) => void;
  onViewReceipt: (payment: Payment) => void;
  onNavigateToStudents: (filterStatus?: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  metrics,
  currency,
  onOpenRecordPayment,
  onOpenPaystackSimulator,
  onSelectStudent,
  onViewReceipt,
  onNavigateToStudents,
}) => {
  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const {
    totalBilled,
    totalCollected,
    totalOutstanding,
    collectionRate,
    totalStudents,
    paidStudents,
    partialStudents,
    overdueStudents,
    recentPayments,
    chartData,
  } = metrics;

  return (
    <div className="space-y-6">
      {/* Top Banner / Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-2xl border border-slate-700/60 shadow-lg">
        <div>
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Live Bursary & Payment Gateway
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            School Fee Collection Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time balance tracking, Paystack debit collections, and automated parent billing.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenPaystackSimulator}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition flex items-center space-x-2 active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Paystack Checkout</span>
          </button>
          <button
            onClick={onOpenRecordPayment}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition flex items-center space-x-1.5 active:scale-95"
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Manual Entry</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Billed */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Expected Billed</span>
            <div className="p-2 rounded-xl bg-slate-800 text-blue-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatCurrency(totalBilled, currency)}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center">
            <span>{totalStudents} enrolled students</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
        </div>

        {/* Total Collected */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Collected</span>
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/40">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 tracking-tight">
            {formatCurrency(totalCollected, currency)}
          </div>
          <div className="mt-2 text-xs text-emerald-400 flex items-center font-medium">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>{collectionRate}% recovery rate</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>
        </div>

        {/* Pending Outstanding */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Outstanding</span>
            <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/40">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 tracking-tight">
            {formatCurrency(totalOutstanding, currency)}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center">
            <span>{partialStudents + overdueStudents} students with balance</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500"></div>
        </div>

        {/* Overdue Alert */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Overdue Accounts</span>
            <div className="p-2 rounded-xl bg-rose-950 text-rose-400 border border-rose-800/40">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 tracking-tight">
            {overdueStudents} Students
          </div>
          <button
            onClick={() => onNavigateToStudents('overdue')}
            className="mt-2 text-xs text-rose-400 hover:text-rose-300 flex items-center font-semibold"
          >
            <span>View & send reminders</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500"></div>
        </div>
      </div>

      {/* Middle Row: Progress Distribution & Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Fee Status Distribution */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center">
                <Users className="w-4 h-4 mr-2 text-emerald-400" />
                Student Fee Ledger Status
              </h2>
              <span className="text-xs text-slate-400 font-mono">{totalStudents} Total</span>
            </div>

            {/* Multi-segment progress bar */}
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex mb-5">
              <div
                style={{ width: `${totalStudents ? (paidStudents / totalStudents) * 100 : 0}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`Fully Paid: ${paidStudents}`}
              />
              <div
                style={{ width: `${totalStudents ? (partialStudents / totalStudents) * 100 : 0}%` }}
                className="bg-amber-500 h-full transition-all"
                title={`Partial: ${partialStudents}`}
              />
              <div
                style={{ width: `${totalStudents ? (overdueStudents / totalStudents) * 100 : 0}%` }}
                className="bg-rose-500 h-full transition-all"
                title={`Overdue: ${overdueStudents}`}
              />
            </div>

            {/* Legend items */}
            <div className="space-y-3">
              <div 
                onClick={() => onNavigateToStudents('paid')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 cursor-pointer transition"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-semibold text-slate-200">Fully Paid</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-white">{paidStudents}</span>
                  <span className="text-[11px] text-slate-400">({totalStudents ? Math.round((paidStudents / totalStudents) * 100) : 0}%)</span>
                </div>
              </div>

              <div 
                onClick={() => onNavigateToStudents('partial')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 cursor-pointer transition"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-xs font-semibold text-slate-200">Partial Balance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-white">{partialStudents}</span>
                  <span className="text-[11px] text-slate-400">({totalStudents ? Math.round((partialStudents / totalStudents) * 100) : 0}%)</span>
                </div>
              </div>

              <div 
                onClick={() => onNavigateToStudents('overdue')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 cursor-pointer transition"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <span className="text-xs font-semibold text-slate-200">Zero / Overdue</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-white">{overdueStudents}</span>
                  <span className="text-[11px] text-slate-400">({totalStudents ? Math.round((overdueStudents / totalStudents) * 100) : 0}%)</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToStudents('all')}
            className="w-full mt-4 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl transition flex items-center justify-center space-x-1"
          >
            <span>Open Complete Roster</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Collection Trends Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-emerald-400" />
                  Monthly Fee Collections
                </h2>
                <p className="text-xs text-slate-400">Term tuition deposits and Paystack recurring receipts</p>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-800/50">
                {currency} Collections
              </span>
            </div>

            {/* Custom Bar Visualization */}
            <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-800">
              {chartData.map((item, idx) => {
                const maxAmount = Math.max(...chartData.map(d => d.amount), 1);
                const heightPercent = Math.max(15, Math.round((item.amount / maxAmount) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <div className="text-[10px] font-mono text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap">
                      {formatCurrency(item.amount, currency)}
                    </div>
                    <div 
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[42px] rounded-t-lg bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 group-hover:to-teal-300 transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-400 mt-2">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 text-xs text-slate-400">
            <span>Aggregated across Paystack Cards, Bank Transfers, and Cash</span>
            <span className="font-semibold text-slate-200">
              Total: {formatCurrency(totalCollected, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center">
              <CreditCard className="w-4 h-4 mr-2 text-emerald-400" />
              Recent Payment Transactions
            </h2>
            <p className="text-xs text-slate-400">Latest successful school fee and levy receipts</p>
          </div>
          <button
            onClick={onOpenRecordPayment}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
          >
            <span>+ Record New</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Receipt / Ref</th>
                <th className="px-5 py-3">Student & Admission</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Channel & Method</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {recentPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No payment records yet. Use 'Record Payment' or 'Paystack Checkout' to log the first payment.
                  </td>
                </tr>
              ) : (
                recentPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-mono font-bold text-emerald-400">{p.receiptNumber}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.reference}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => onSelectStudent(p.studentId)}
                        className="font-bold text-white hover:text-emerald-400 transition text-left"
                      >
                        {p.studentName || 'Student'}
                      </button>
                      <div className="text-[10px] text-slate-400 font-mono">{p.admissionNumber}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">
                      <div>{p.feeCategory}</div>
                      <div className="text-[10px] text-slate-400">{p.term}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                        p.channel === 'paystack'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {p.paymentMethod.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                      {formatDate(p.paidAt)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-white text-sm">
                      {formatCurrency(p.amount, p.currency)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => onViewReceipt(p)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-400 border border-slate-700 transition"
                        title="View & Print Official Receipt"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
