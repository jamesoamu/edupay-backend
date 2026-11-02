import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './lib/auth-context.tsx';
import { Header } from './components/Header.tsx';
import { Sidebar, ActiveTab } from './components/Sidebar.tsx';
import { DashboardOverview } from './components/DashboardOverview.tsx';
import { StudentsList } from './components/StudentsList.tsx';
import { StudentProfileModal } from './components/StudentProfileModal.tsx';
import { RecordPaymentModal } from './components/RecordPaymentModal.tsx';
import { PaystackCheckoutModal } from './components/PaystackCheckoutModal.tsx';
import { PaystackBillingView } from './components/PaystackBillingView.tsx';
import { FeeStructureManager } from './components/FeeStructureManager.tsx';
import { ReceiptModal } from './components/ReceiptModal.tsx';
import { PaymentReminderModal } from './components/PaymentReminderModal.tsx';
import { InstitutionSettingsModal } from './components/InstitutionSettingsModal.tsx';
import { AddStudentModal } from './components/AddStudentModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { BackendHubView } from './components/BackendHubView.tsx';
import { DashboardMetrics, FeeStructure, Payment, Student, SubscriptionPlan } from './types/index.ts';

function EduPayApp() {
  const { user, institution, setInstitution, refreshInstitution } = useAuth();

  // Navigation & View State
  const [inApp, setInApp] = useState<boolean>(true); // Start directly inside the dashboard
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Backend Data
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [showRecordPayment, setShowRecordPayment] = useState<boolean>(false);
  const [preSelectedStudentForPayment, setPreSelectedStudentForPayment] = useState<Student | null>(null);

  const [showPaystackSimulator, setShowPaystackSimulator] = useState<boolean>(false);
  const [paystackStudent, setPaystackStudent] = useState<Student | null>(null);

  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<any | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [activeReceiptPayment, setActiveReceiptPayment] = useState<Payment | null>(null);

  const [showReminderModal, setShowReminderModal] = useState<boolean>(false);
  const [reminderStudent, setReminderStudent] = useState<Student | null>(null);

  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Load all data from backend
  const loadData = async () => {
    try {
      setLoading(true);
      const [dashRes, stuRes, payRes, feeRes, subRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/students'),
        fetch('/api/payments'),
        fetch('/api/fee-structures'),
        fetch('/api/subscriptions'),
      ]);

      if (dashRes.ok) {
        const dData = await dashRes.json();
        setMetrics(dData.metrics);
        if (dData.institution) {
          setInstitution(dData.institution);
        }
      }

      if (stuRes.ok) setStudents(await stuRes.json());
      if (payRes.ok) setPayments(await payRes.json());
      if (feeRes.ok) setFeeStructures(await feeRes.json());
      if (subRes.ok) setSubscriptions(await subRes.json());
    } catch (err) {
      console.error('Failed to load EduPay data from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Load detailed single student
  const handleSelectStudent = async (studentId: number) => {
    try {
      const res = await fetch(`/api/students/${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedStudentForProfile(data);
      }
    } catch (err) {
      console.error('Error fetching student profile:', err);
    }
  };

  // Record payment
  const handleRecordPaymentSubmit = async (paymentData: any) => {
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });

    if (res.ok) {
      const newPayment = await res.json();
      setActiveReceiptPayment(newPayment);
      setShowReceiptModal(true);
      await loadData();
    } else {
      const err = await res.json();
      alert(`Payment failed: ${err.error || 'Server error'}`);
    }
  };

  // Add Student
  const handleAddStudentSubmit = async (studentData: any) => {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });

    if (res.ok) {
      await loadData();
      setActiveTab('students');
    } else {
      const err = await res.json();
      alert(`Registration failed: ${err.error || 'Server error'}`);
    }
  };

  // Delete Student
  const handleDeleteStudent = async (studentId: number) => {
    const res = await fetch(`/api/students/${studentId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      await loadData();
    }
  };

  // Fee structure actions
  const handleCreateFee = async (feeData: any) => {
    const res = await fetch('/api/fee-structures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feeData),
    });
    if (res.ok) await loadData();
  };

  const handleDeleteFee = async (feeId: number) => {
    const res = await fetch(`/api/fee-structures/${feeId}`, {
      method: 'DELETE',
    });
    if (res.ok) await loadData();
  };

  // Subscriptions
  const handleCreateSubscription = async (subData: any) => {
    const res = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subData),
    });
    if (res.ok) await loadData();
  };

  const handleUpdateSubscriptionStatus = async (subId: number, status: 'active' | 'paused' | 'cancelled') => {
    const res = await fetch(`/api/subscriptions/${subId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) await loadData();
  };

  // Reminders
  const handleSendReminderSubmit = async (reminderData: any) => {
    const res = await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reminderData),
    });
    if (res.ok) await loadData();
  };

  // Update Institution
  const handleUpdateInstitution = async (updatedData: any) => {
    const res = await fetch('/api/institution', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    if (res.ok) {
      const saved = await res.json();
      setInstitution(saved);
      await loadData();
    }
  };

  const currency = institution?.currency || 'NGN';
  const overdueCount = students.filter((s) => s.status === 'overdue').length;

  if (!inApp) {
    return (
      <LandingPage
        institution={institution}
        onEnterPortal={() => setInApp(true)}
        onOpenAuth={() => setShowAuthModal(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Header
        onOpenRecordPayment={() => {
          setPreSelectedStudentForPayment(null);
          setShowRecordPayment(true);
        }}
        onOpenAddStudent={() => setShowAddStudentModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingCount={overdueCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <DashboardOverview
              metrics={metrics}
              currency={currency}
              onOpenRecordPayment={() => {
                setPreSelectedStudentForPayment(null);
                setShowRecordPayment(true);
              }}
              onOpenPaystackSimulator={() => {
                const target = students.find((s) => s.status !== 'paid') || students[0];
                if (target) {
                  setPaystackStudent(target);
                  setShowPaystackSimulator(true);
                }
              }}
              onSelectStudent={handleSelectStudent}
              onViewReceipt={(p) => {
                setActiveReceiptPayment(p);
                setShowReceiptModal(true);
              }}
              onNavigateToStudents={(status) => {
                if (status) setStatusFilter(status);
                setActiveTab('students');
              }}
            />
          )}

          {/* Student Ledger Tab */}
          {activeTab === 'students' && (
            <StudentsList
              students={students}
              currency={currency}
              initialStatusFilter={statusFilter}
              onSelectStudent={handleSelectStudent}
              onRecordPayment={(student) => {
                setPreSelectedStudentForPayment(student);
                setShowRecordPayment(true);
              }}
              onPaystackCheckout={(student) => {
                setPaystackStudent(student);
                setShowPaystackSimulator(true);
              }}
              onSendReminder={(student) => {
                setReminderStudent(student);
                setShowReminderModal(true);
              }}
              onAddStudent={() => setShowAddStudentModal(true)}
              onDeleteStudent={handleDeleteStudent}
            />
          )}

          {/* Paystack & Subscriptions Tab */}
          {activeTab === 'paystack' && (
            <PaystackBillingView
              institution={institution}
              subscriptions={subscriptions}
              students={students}
              currency={currency}
              onUpdateInstitution={handleUpdateInstitution}
              onCreateSubscription={handleCreateSubscription}
              onUpdateSubscriptionStatus={handleUpdateSubscriptionStatus}
            />
          )}

          {/* Fee Structures Tab */}
          {activeTab === 'fees' && (
            <FeeStructureManager
              feeStructures={feeStructures}
              currency={currency}
              onCreateFee={handleCreateFee}
              onDeleteFee={handleDeleteFee}
            />
          )}

          {/* Payment Records & Receipts Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white tracking-tight">
                    Payment Transaction History
                  </h1>
                  <p className="text-xs text-slate-400">
                    Audit log of all verified Paystack gateway and manual bursary collections
                  </p>
                </div>
                <button
                  onClick={() => {
                    setPreSelectedStudentForPayment(null);
                    setShowRecordPayment(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95"
                >
                  + Record Payment
                </button>
              </div>

              {/* Transactions list */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-5 py-3.5">Receipt #</th>
                      <th className="px-5 py-3.5">Student</th>
                      <th className="px-5 py-3.5">Payer Details</th>
                      <th className="px-5 py-3.5">Category & Term</th>
                      <th className="px-5 py-3.5">Method</th>
                      <th className="px-5 py-3.5 text-right">Amount</th>
                      <th className="px-5 py-3.5 text-center">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-5 py-3.5 font-mono font-bold text-emerald-400">
                          {p.receiptNumber}
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => handleSelectStudent(p.studentId)}
                            className="font-bold text-white hover:text-emerald-400 transition"
                          >
                            {p.studentName || 'Student'}
                          </button>
                          <div className="text-[10px] text-slate-400 font-mono">{p.admissionNumber}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div>{p.payerName || 'Guardian'}</div>
                          <div className="text-[10px] text-slate-400">{p.payerPhone || p.payerEmail}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div>{p.feeCategory}</div>
                          <div className="text-[10px] text-slate-400">{p.term}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                            p.channel === 'paystack'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            {p.paymentMethod.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono font-bold text-white text-sm">
                          {p.amount.toLocaleString()} {p.currency}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <button
                            onClick={() => {
                              setActiveReceiptPayment(p);
                              setShowReceiptModal(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700 transition font-semibold text-[11px]"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reminders Tab */}
          {activeTab === 'reminders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white tracking-tight">
                    Parent Fee Reminders (WhatsApp & SMS)
                  </h1>
                  <p className="text-xs text-slate-400">
                    Students with outstanding balances ready for direct reminder messaging
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students
                  .filter((s) => s.status !== 'paid')
                  .map((stu) => {
                    const bal = Math.max(0, stu.totalBilled - stu.totalPaid);
                    return (
                      <div
                        key={stu.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                              {stu.admissionNumber}
                            </span>
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-900">
                              Due: {bal.toLocaleString()} {currency}
                            </span>
                          </div>

                          <h3 className="font-bold text-white text-base">
                            {stu.firstName} {stu.lastName}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Class: <span className="text-slate-200">{stu.gradeLevel}</span>
                          </p>

                          <div className="mt-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1">
                            <div className="text-slate-300 font-semibold">{stu.guardianName}</div>
                            <div className="text-slate-400 font-mono text-[11px]">{stu.guardianPhone}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setReminderStudent(stu);
                            setShowReminderModal(true);
                          }}
                          className="mt-4 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition flex items-center justify-center space-x-1.5"
                        >
                          <span>Draft Personalized Reminder</span>
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Backend & API Hub Tab */}
          {activeTab === 'backend' && (
            <BackendHubView institution={institution} />
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-sm max-w-3xl">
              <h2 className="text-xl font-bold text-white mb-2">Institution Configuration</h2>
              <p className="text-xs text-slate-400 mb-6">
                Manage academy profile, bank details, and currency settings
              </p>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
              >
                Open Settings Editor
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showRecordPayment && (
        <RecordPaymentModal
          students={students}
          preSelectedStudent={preSelectedStudentForPayment}
          currency={currency}
          currentTerm={institution?.currentTerm || 'First Term'}
          onClose={() => setShowRecordPayment(false)}
          onSubmit={handleRecordPaymentSubmit}
        />
      )}

      {showPaystackSimulator && paystackStudent && (
        <PaystackCheckoutModal
          student={paystackStudent}
          currency={currency}
          schoolName={institution?.name || 'Apex International College'}
          paystackPublicKey={institution?.paystackPublicKey || undefined}
          onClose={() => setShowPaystackSimulator(false)}
          onSuccess={async (payment) => {
            setActiveReceiptPayment(payment);
            setShowReceiptModal(true);
            await loadData();
          }}
        />
      )}

      {selectedStudentForProfile && (
        <StudentProfileModal
          student={selectedStudentForProfile}
          currency={currency}
          onClose={() => setSelectedStudentForProfile(null)}
          onRecordPayment={(stu) => {
            setPreSelectedStudentForPayment(stu);
            setShowRecordPayment(true);
          }}
          onPaystackCheckout={(stu) => {
            setPaystackStudent(stu);
            setShowPaystackSimulator(true);
          }}
          onSendReminder={(stu) => {
            setReminderStudent(stu);
            setShowReminderModal(true);
          }}
          onViewReceipt={(p) => {
            setActiveReceiptPayment(p);
            setShowReceiptModal(true);
          }}
        />
      )}

      {showReceiptModal && activeReceiptPayment && (
        <ReceiptModal
          payment={activeReceiptPayment}
          institution={institution}
          onClose={() => setShowReceiptModal(false)}
        />
      )}

      {showReminderModal && reminderStudent && (
        <PaymentReminderModal
          student={reminderStudent}
          institution={institution}
          currency={currency}
          onClose={() => setShowReminderModal(false)}
          onSendReminder={handleSendReminderSubmit}
        />
      )}

      {showSettingsModal && (
        <InstitutionSettingsModal
          institution={institution}
          onClose={() => setShowSettingsModal(false)}
          onSave={handleUpdateInstitution}
        />
      )}

      {showAddStudentModal && (
        <AddStudentModal
          currency={currency}
          onClose={() => setShowAddStudentModal(false)}
          onSubmit={handleAddStudentSubmit}
        />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <EduPayApp />
    </AuthProvider>
  );
}
