import React from 'react';
import { 
  X, 
  Printer, 
  GraduationCap, 
  ShieldCheck, 
  Download,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { Institution, Payment } from '../types/index.ts';
import { formatCurrency, formatDateTime } from '../utils/formatters.ts';

interface ReceiptModalProps {
  payment: Payment | null;
  institution: Institution | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  payment,
  institution,
  onClose,
}) => {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col">
        {/* Header toolbar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 backdrop-blur-md z-10 print:hidden">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Official Bursary Receipt</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 transition active:scale-95 shadow-md shadow-emerald-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div id="printable-receipt" className="p-8 space-y-6 bg-white text-slate-900 font-sans">
          {/* Institution Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-700 flex items-center justify-center text-white font-black text-2xl shadow-sm">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-950 uppercase tracking-tight">
                  {institution?.name || 'Apex International College'}
                </h1>
                <p className="text-xs text-slate-600 font-medium italic">
                  "{institution?.motto || 'Excellence in Knowledge & Character'}"
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {institution?.address || '14 Admiralty Way, Victoria Island, Lagos, Nigeria'} • Tel: {institution?.phone || '+234 803 123 4567'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Receipt No:</div>
              <div className="font-mono font-extrabold text-emerald-800 text-base">
                {payment.receiptNumber}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                {formatDateTime(payment.paidAt)}
              </div>
            </div>
          </div>

          {/* Student & Payer Information */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500">Student Name</span>
              <div className="font-extrabold text-slate-900 text-sm">{payment.studentName || 'Student'}</div>
              <div className="text-slate-600 font-mono mt-0.5">Adm #: {payment.admissionNumber}</div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500">Payer / Guardian</span>
              <div className="font-bold text-slate-900">{payment.payerName || 'Guardian'}</div>
              <div className="text-slate-600 font-mono mt-0.5">Phone: {payment.payerPhone || '—'}</div>
            </div>
          </div>

          {/* Payment Details Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-300">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3">Session / Term</th>
                  <th className="p-3">Channel / Method</th>
                  <th className="p-3 text-right">Amount Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">
                    {payment.feeCategory}
                    {payment.notes && (
                      <div className="text-[10px] text-slate-500 font-normal italic mt-0.5">
                        Note: {payment.notes}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-slate-700">{payment.term}</td>
                  <td className="p-3">
                    <span className="font-semibold text-slate-900">
                      {payment.paymentMethod.replace('_', ' ').toUpperCase()}
                    </span>
                    {payment.paystackReference && (
                      <div className="text-[10px] text-slate-500 font-mono">
                        Ref: {payment.paystackReference}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-right font-mono font-black text-slate-950 text-base">
                    {formatCurrency(payment.amount, payment.currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total & Verification Stamp */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-slate-900">
            {/* Stamp */}
            <div className="border-2 border-emerald-700 rounded-xl p-2.5 text-center transform -rotate-3 text-emerald-800 bg-emerald-50">
              <div className="text-[10px] font-black tracking-widest uppercase">
                BURSARY OFFICE VERIFIED
              </div>
              <div className="text-xs font-black">PAYMENT RECEIVED & CREDITED</div>
              <div className="text-[9px] font-mono">CODE: {payment.reference}</div>
            </div>

            {/* Total Paid */}
            <div className="text-right">
              <div className="text-xs font-bold text-slate-600 uppercase">Total Amount Received</div>
              <div className="font-mono font-black text-2xl text-emerald-800">
                {formatCurrency(payment.amount, payment.currency)}
              </div>
            </div>
          </div>

          {/* Footnote */}
          <div className="text-center pt-4 text-[10px] text-slate-500 border-t border-slate-200">
            This is a computer-generated receipt issued by EduPay Tracker. No physical signature required.
          </div>
        </div>
      </div>
    </div>
  );
};
