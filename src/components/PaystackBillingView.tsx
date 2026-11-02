import React, { useState } from 'react';
import { 
  CreditCard, 
  Key, 
  Plus, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  PauseCircle, 
  PlayCircle, 
  Webhook, 
  Send,
  AlertCircle
} from 'lucide-react';
import { Institution, Student, SubscriptionPlan } from '../types/index.ts';
import { formatCurrency, formatDate } from '../utils/formatters.ts';

interface PaystackBillingViewProps {
  institution: Institution | null;
  subscriptions: SubscriptionPlan[];
  students: Student[];
  currency: string;
  onUpdateInstitution: (data: Partial<Institution>) => Promise<void>;
  onCreateSubscription: (data: any) => Promise<void>;
  onUpdateSubscriptionStatus: (subId: number, status: 'active' | 'paused' | 'cancelled') => Promise<void>;
}

export const PaystackBillingView: React.FC<PaystackBillingViewProps> = ({
  institution,
  subscriptions,
  students,
  currency,
  onUpdateInstitution,
  onCreateSubscription,
  onUpdateSubscriptionStatus,
}) => {
  const [publicKey, setPublicKey] = useState(institution?.paystackPublicKey || 'pk_test_edupay_demo_key_9831');
  const [secretKey, setSecretKey] = useState(institution?.paystackSecretKey || 'sk_test_edupay_demo_key_4412');
  const [savingKeys, setSavingKeys] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  // New Subscription modal
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(students[0]?.id || 0);
  const [planName, setPlanName] = useState('Termly 3-Installment Plan');
  const [planInterval, setPlanInterval] = useState<'monthly' | 'weekly' | 'termly'>('monthly');
  const [planAmount, setPlanAmount] = useState<number>(65000);

  // Webhook test simulator
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);

  const handleSaveKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKeys(true);
    try {
      await onUpdateInstitution({
        paystackPublicKey: publicKey,
        paystackSecretKey: secretKey,
      });
      setKeySaved(true);
      setTimeout(() => setKeySaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingKeys(false);
    }
  };

  const handleCreatePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || planAmount <= 0) return;

    try {
      await onCreateSubscription({
        studentId: selectedStudentId,
        planName,
        interval: planInterval,
        amount: planAmount,
      });
      setShowCreatePlan(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerTestWebhook = async () => {
    setTestingWebhook(true);
    setWebhookStatus(null);
    try {
      const sampleRef = `TRX_TEST_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const res = await fetch('/api/webhooks/paystack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'charge.success',
          data: {
            id: 894012,
            domain: 'test',
            status: 'success',
            reference: sampleRef,
            amount: 5000000, // 50,000 in kobo
            gateway_response: 'Successful',
            paid_at: new Date().toISOString(),
            channel: 'card',
            currency: 'NGN',
            ip_address: '102.89.44.11',
            customer: {
              email: 'parent@example.com',
            },
          },
        }),
      });

      if (res.ok) {
        setWebhookStatus('Success 200 OK: Paystack charge.success webhook processed.');
      } else {
        setWebhookStatus('Failed to process webhook.');
      }
    } catch (err) {
      setWebhookStatus('Error dispatching test webhook.');
    } finally {
      setTestingWebhook(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center">
            <CreditCard className="w-6 h-6 mr-2.5 text-[#0aa564]" />
            Paystack Subscriptions & Gateway
          </h1>
          <p className="text-xs text-slate-400">
            Configure live payment credentials, termly installment debits, and webhook listeners.
          </p>
        </div>

        <button
          onClick={() => setShowCreatePlan(true)}
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-[#0aa564] hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create Installment Plan
        </button>
      </div>

      {/* API Keys Configuration Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Paystack API Credentials</h2>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            Ready & Connected
          </span>
        </div>

        <form onSubmit={handleSaveKeys} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Paystack Public Key (Client-side)
              </label>
              <input
                type="text"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="pk_test_xxxxxxxxxxxxxxxx"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Paystack Secret Key (Server-side)
              </label>
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="sk_test_xxxxxxxxxxxxxxxx"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-[11px] text-slate-400">
              Webhook URL: <code className="bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono">/api/webhooks/paystack</code>
            </div>

            <button
              type="submit"
              disabled={savingKeys}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold transition flex items-center space-x-1.5"
            >
              {keySaved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Keys Saved!</span>
                </>
              ) : (
                <span>Save API Keys</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Active Subscriptions / Installment Plans */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center">
              <Clock className="w-4 h-4 mr-2 text-emerald-400" />
              Active Installment Plans ({subscriptions.length})
            </h2>
            <p className="text-xs text-slate-400">Automated recurring debit schedules for parent tuition</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Plan Code & Name</th>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Frequency</th>
                <th className="px-5 py-3.5">Next Charge</th>
                <th className="px-5 py-3.5 text-right">Amount</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No active installment plans yet. Click "Create Installment Plan" to add one.
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-white">{sub.planName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{sub.planCode}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-200">{sub.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{sub.admissionNumber}</div>
                    </td>
                    <td className="px-5 py-3.5 capitalize font-medium text-slate-300">
                      {sub.interval}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-300">
                      {sub.nextPaymentDate || 'Auto-Scheduled'}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-white text-sm">
                      {formatCurrency(sub.amount, currency)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sub.status === 'active'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {sub.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {sub.status === 'active' ? (
                        <button
                          onClick={() => onUpdateSubscriptionStatus(sub.id, 'paused')}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-[11px] font-semibold transition"
                        >
                          Pause
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateSubscriptionStatus(sub.id, 'active')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 text-[11px] font-semibold transition"
                        >
                          Resume
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paystack Webhook Diagnostics Simulator */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Webhook className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Paystack Webhook Tester</h2>
              <p className="text-xs text-slate-400">Dispatch a test charge.success payload to verify server endpoint response</p>
            </div>
          </div>

          <button
            onClick={handleTriggerTestWebhook}
            disabled={testingWebhook}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition flex items-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>{testingWebhook ? 'Testing...' : 'Send Test Event'}</span>
          </button>
        </div>

        {webhookStatus && (
          <div className="mt-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700 font-mono text-xs text-emerald-400">
            {webhookStatus}
          </div>
        )}
      </div>

      {/* Create Installment Plan Modal */}
      {showCreatePlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white mb-1">Create Student Installment Plan</h3>
            <p className="text-xs text-slate-400 mb-4">Set up recurring scheduled billing for tuition fees</p>

            <form onSubmit={handleCreatePlanSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                >
                  {students.map((stu) => (
                    <option key={stu.id} value={stu.id}>
                      {stu.firstName} {stu.lastName} ({stu.admissionNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Plan Name</label>
                <input
                  type="text"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Frequency</label>
                  <select
                    value={planInterval}
                    onChange={(e) => setPlanInterval(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 capitalize"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="termly">Termly</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Installment Amount</label>
                  <input
                    type="number"
                    min="1"
                    value={planAmount}
                    onChange={(e) => setPlanAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreatePlan(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0aa564] hover:bg-emerald-600 text-white font-bold"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
