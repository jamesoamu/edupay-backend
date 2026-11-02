import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  Smartphone, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { Student } from '../types/index.ts';
import { formatCurrency, generateReference } from '../utils/formatters.ts';

interface PaystackCheckoutModalProps {
  student: Student;
  currency: string;
  schoolName: string;
  paystackPublicKey?: string;
  onClose: () => void;
  onSuccess: (payment: any) => void;
}

type PaystackChannel = 'card' | 'bank' | 'ussd';

export const PaystackCheckoutModal: React.FC<PaystackCheckoutModalProps> = ({
  student,
  currency,
  schoolName,
  paystackPublicKey,
  onClose,
  onSuccess,
}) => {
  const balance = Math.max(0, student.totalBilled - student.totalPaid);
  const [payAmount, setPayAmount] = useState<number>(balance > 0 ? balance : 50000);
  const [channel, setChannel] = useState<PaystackChannel>('card');
  const [processing, setProcessing] = useState<boolean>(false);
  const [otpStep, setOtpStep] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('123456');
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState<string>('4084 0820 9912 3456');
  const [cardExpiry, setCardExpiry] = useState<string>('08/28');
  const [cardCvv, setCardCvv] = useState<string>('382');

  const virtualAccountNumber = '7829104821';
  const virtualBankName = 'Wema Bank (Paystack Checkout)';

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText(virtualAccountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleCardPayment = () => {
    setProcessing(true);
    // Simulate 3D-Secure check
    setTimeout(() => {
      setProcessing(false);
      setOtpStep(true);
    }, 1000);
  };

  const handleVerifyOtpAndComplete = async () => {
    setProcessing(true);
    const reference = `PSTK-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    try {
      const res = await fetch('/api/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference,
          studentId: student.id,
          amount: payAmount,
          paymentMethod: channel === 'card' ? 'paystack_card' : channel === 'bank' ? 'paystack_bank' : 'paystack_ussd',
          payerName: student.guardianName,
          payerEmail: student.guardianEmail || 'parent@example.com',
          payerPhone: student.guardianPhone,
          feeCategory: 'School Fees (Paystack Checkout)',
        }),
      });

      if (!res.ok) throw new Error('Verification failed');
      const data = await res.json();
      onSuccess(data.payment);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-slate-100 flex flex-col">
        {/* Paystack Top Branding Bar */}
        <div className="bg-[#0aa564] text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-black text-sm">
              P
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight flex items-center">
                paystack <span className="text-[10px] font-mono bg-black/20 px-1.5 py-0.5 rounded ml-1.5 uppercase font-medium">Secured</span>
              </div>
              <div className="text-[10px] text-emerald-100 truncate max-w-[200px]">
                {schoolName}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-black/10 hover:bg-black/20 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount to pay summary */}
        <div className="p-4 bg-slate-800/80 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400">Paying for:</div>
            <div className="font-bold text-white text-xs">
              {student.firstName} {student.lastName} ({student.admissionNumber})
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-slate-400">Total Due:</div>
            <div className="font-mono font-extrabold text-emerald-400 text-lg">
              {formatCurrency(payAmount, currency)}
            </div>
          </div>
        </div>

        {/* Channel Selection */}
        {!otpStep && (
          <div className="grid grid-cols-3 border-b border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setChannel('card')}
              className={`py-3 flex flex-col items-center space-y-1 transition ${
                channel === 'card'
                  ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Card</span>
            </button>

            <button
              onClick={() => setChannel('bank')}
              className={`py-3 flex flex-col items-center space-y-1 transition ${
                channel === 'bank'
                  ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Transfer</span>
            </button>

            <button
              onClick={() => setChannel('ussd')}
              className={`py-3 flex flex-col items-center space-y-1 transition ${
                channel === 'ussd'
                  ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>USSD</span>
            </button>
          </div>
        )}

        {/* Body based on Channel */}
        <div className="p-5 text-xs space-y-4">
          {otpStep ? (
            /* 3D-Secure OTP Simulation */
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">3D Secure Authorization</h3>
                <p className="text-slate-400 text-xs mt-1">
                  Enter the one-time passcode sent to guardian's phone ({student.guardianPhone})
                </p>
              </div>

              <div>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength={6}
                  className="w-48 mx-auto text-center font-mono font-bold tracking-widest text-lg bg-slate-800 border border-slate-700 text-white rounded-xl py-2 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={handleVerifyOtpAndComplete}
                disabled={processing}
                className="w-full py-3 rounded-xl bg-[#0aa564] hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize {formatCurrency(payAmount, currency)}</span>
                  </>
                )}
              </button>
            </div>
          ) : channel === 'card' ? (
            /* Pay with Card */
            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Custom Amount ({currency})</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Card Number</label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4084 0820 9912 3456"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Valid Till</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="123"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleCardPayment}
                disabled={processing || payAmount <= 0}
                className="w-full mt-2 py-3 rounded-xl bg-[#0aa564] hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
              >
                {processing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay {formatCurrency(payAmount, currency)}</span>
                  </>
                )}
              </button>
            </div>
          ) : channel === 'bank' ? (
            /* Pay with Bank Transfer */
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-center space-y-2">
                <span className="text-[11px] text-slate-400">Transfer exactly to virtual account:</span>
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-mono text-xl font-extrabold text-emerald-400 tracking-wider">
                    {virtualAccountNumber}
                  </span>
                  <button
                    onClick={handleCopyAccount}
                    className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition"
                    title="Copy Account Number"
                  >
                    {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-xs text-slate-300 font-semibold">{virtualBankName}</div>
                <div className="text-[11px] text-amber-400">Expires in 29:59 mins</div>
              </div>

              <button
                onClick={handleVerifyOtpAndComplete}
                disabled={processing}
                className="w-full py-3 rounded-xl bg-[#0aa564] hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>I have sent {formatCurrency(payAmount, currency)}</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Pay with USSD */
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-center space-y-2">
                <span className="text-[11px] text-slate-400">Dial on your registered phone:</span>
                <div className="font-mono text-base font-extrabold text-emerald-400">
                  *737*000*4928#
                </div>
                <div className="text-xs text-slate-300">GTBank, Zenith (*966#), Access (*901#)</div>
              </div>

              <button
                onClick={handleVerifyOtpAndComplete}
                disabled={processing}
                className="w-full py-3 rounded-xl bg-[#0aa564] hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>I have completed USSD Payment</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Security footnote */}
          <div className="pt-2 text-[10px] text-slate-400 text-center flex items-center justify-center space-x-1">
            <Lock className="w-3 h-3 text-[#0aa564]" />
            <span>256-bit SSL encrypted • PCI-DSS Level 1 certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
