import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  CreditCard, 
  MessageSquare, 
  ExternalLink, 
  Trash2, 
  ShieldCheck, 
  Phone, 
  Mail,
  UserPlus
} from 'lucide-react';
import { Student } from '../types/index.ts';
import { formatCurrency } from '../utils/formatters.ts';

interface StudentsListProps {
  students: Student[];
  currency: string;
  initialStatusFilter?: string;
  onSelectStudent: (studentId: number) => void;
  onRecordPayment: (student: Student) => void;
  onPaystackCheckout: (student: Student) => void;
  onSendReminder: (student: Student) => void;
  onAddStudent: () => void;
  onDeleteStudent: (studentId: number) => void;
}

export const StudentsList: React.FC<StudentsListProps> = ({
  students,
  currency,
  initialStatusFilter = 'all',
  onSelectStudent,
  onRecordPayment,
  onPaystackCheckout,
  onSendReminder,
  onAddStudent,
  onDeleteStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [gradeFilter, setGradeFilter] = useState<string>('all');

  const filtered = students.filter((s) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      s.admissionNumber.toLowerCase().includes(q) ||
      s.guardianName.toLowerCase().includes(q) ||
      s.guardianPhone.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'all' || s.status === statusFilter;

    const matchesGrade =
      gradeFilter === 'all' || s.gradeLevel.includes(gradeFilter);

    return matchesSearch && matchesStatus && matchesGrade;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
            Fully Paid
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-950 text-amber-400 border border-amber-800/60">
            Partial Balance
          </span>
        );
      case 'overdue':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-950 text-rose-400 border border-rose-800/60">
            Overdue / Zero
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Student Fee Ledger
          </h1>
          <p className="text-xs text-slate-400">
            Enrolled student roster, fee balance calculations, and collections
          </p>
        </div>

        <button
          onClick={onAddStudent}
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Enroll New Student
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student, adm # or phone..."
            className="w-full bg-slate-800/80 text-white text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-700/80 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {/* Status filter */}
          <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-xl border border-slate-700/60 text-xs">
            {['all', 'paid', 'partial', 'overdue'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition ${
                  statusFilter === st
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Grade Level filter */}
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="bg-slate-800 text-slate-300 text-xs px-3 py-2 rounded-xl border border-slate-700/80 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Classes</option>
            <option value="Primary">Primary (1 - 6)</option>
            <option value="JSS">JSS (1 - 3)</option>
            <option value="SSS">SSS (1 - 3)</option>
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Student Details</th>
                <th className="px-5 py-3.5">Class</th>
                <th className="px-5 py-3.5">Guardian Contact</th>
                <th className="px-5 py-3.5 text-right">Billed</th>
                <th className="px-5 py-3.5 text-right">Paid</th>
                <th className="px-5 py-3.5 text-right">Balance Due</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    No students match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((student) => {
                  const balance = Math.max(0, student.totalBilled - student.totalPaid);
                  return (
                    <tr key={student.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => onSelectStudent(student.id)}
                          className="font-bold text-white hover:text-emerald-400 transition text-left"
                        >
                          {student.firstName} {student.lastName}
                        </button>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {student.admissionNumber}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-300">
                        {student.gradeLevel}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-slate-200">{student.guardianName}</div>
                        <div className="text-[10px] text-slate-400 flex items-center space-x-2 mt-0.5">
                          <span className="flex items-center">
                            <Phone className="w-2.5 h-2.5 mr-1" />
                            {student.guardianPhone}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-medium text-slate-400">
                        {formatCurrency(student.totalBilled, currency)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-emerald-400">
                        {formatCurrency(student.totalPaid, currency)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-rose-400 text-sm">
                        {balance > 0 ? formatCurrency(balance, currency) : '₦0'}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {getStatusBadge(student.status)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Paystack Checkout */}
                          {balance > 0 && (
                            <button
                              onClick={() => onPaystackCheckout(student)}
                              className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60 transition"
                              title="Checkout via Paystack"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Record Payment Manual */}
                          <button
                            onClick={() => onRecordPayment(student)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                            title="Record Manual Cash/Transfer Payment"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>

                          {/* WhatsApp / SMS reminder */}
                          {balance > 0 && (
                            <button
                              onClick={() => onSendReminder(student)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-950 text-slate-300 hover:text-amber-400 border border-slate-700 transition"
                              title="Draft Fee Reminder"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* View Profile */}
                          <button
                            onClick={() => onSelectStudent(student.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                            title="View Full Ledger History"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm(`Remove student ${student.firstName} ${student.lastName}?`)) {
                                onDeleteStudent(student.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                            title="Delete Student Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
