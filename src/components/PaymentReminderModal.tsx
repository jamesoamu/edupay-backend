import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Smartphone, 
  Mail, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { Institution, Student } from '../types/index.ts';
import { formatCurrency } from '../utils/formatters.ts';

interface PaymentReminderModalProps {
  student: Student;
  institution: Institution | null;
  currency: string;
  onClose: () => void;
  onSendReminder: (data: any) => Promise<void>;
}

export const PaymentReminderModal: React.FC<PaymentReminderModalProps> = ({
  student,
  institution,
  currency,
  onClose,
  onSendReminder,
}) => {
  const balance = Math.max(0, student.totalBilled - student.totalPaid);
  const [channel, setChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Template pre-filled
  const defaultText = `Dear ${student.guardianName},\n\nThis is a friendly reminder from ${institution?.name || 'Apex International College'} regarding ${student.firstName} ${student.lastName} (Adm: ${student.admissionNumber}, Class: ${student.gradeLevel}).\n\nThe pending school fee balance for ${institution?.currentTerm || 'First Term'} is ${formatCurrency(balance, currency)}.\n\nBank Transfer Details:\n• Bank: ${institution?.bankName || 'Zenith Bank'}\n• Account: ${institution?.bankAccountNumber || '1014892019'}\n• Account Name: ${institution?.bankAccountName || institution?.name}\n\nOr pay securely online via Paystack.\nThank you for your prompt cooperation!\n\nBursary Office, ${institution?.name}`;

  const [message, setMessage] = useState(defaultText);

  const handleCopy = () => {
    navigator.clipboard?.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const cleanPhone = student.guardianPhone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  const handleDispatch = async () => {
    setSending(true);
    try {
      await onSendReminder({
        studentId: student.id,
        channel,
        recipient: channel === 'email' ? student.guardianEmail || student.guardianPhone : student.guardianPhone,
        message,
      });
      setSentSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl text-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Draft Payment Reminder</h2>
              <p className="text-xs text-slate-400">Personalized fee notice for parent / guardian</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Target Student Summary */}
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-xs">
                {student.firstName} {student.lastName} ({student.admissionNumber})
              </div>
              <div className="text-[11px] text-slate-400">
                Guardian: {student.guardianName} ({student.guardianPhone})
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400">Outstanding:</span>
              <div className="font-mono font-extrabold text-rose-400 text-sm">
                {formatCurrency(balance, currency)}
              </div>
            </div>
          </div>

          {/* Channel selector */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Select Delivery Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setChannel('whatsapp')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                  channel === 'whatsapp'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('sms')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                  channel === 'sms'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <span>SMS Notice</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('email')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                  channel === 'email'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <span>Email</span>
              </button>
            </div>
          </div>

          {/* Message Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-300">Message Content</label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center space-x-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500 font-sans leading-relaxed text-xs"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
            {channel === 'whatsapp' && (
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-md shadow-emerald-500/20"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Launch WhatsApp</span>
              </button>
            )}

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDispatch}
                disabled={sending || sentSuccess}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center space-x-1.5 transition disabled:opacity-50"
              >
                {sentSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sent & Logged!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{sending ? 'Sending...' : 'Log & Dispatch'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
