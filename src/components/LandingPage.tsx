import React from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  Receipt, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Layers,
  Sparkles,
  Building2,
  TrendingUp
} from 'lucide-react';
import { Institution } from '../types/index.ts';

interface LandingPageProps {
  institution: Institution | null;
  onEnterPortal: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  institution,
  onEnterPortal,
  onOpenAuth,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 font-black text-xl">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">
                EduPay<span className="text-emerald-400">Tracker</span>
              </span>
              <p className="text-[11px] text-slate-400">
                {institution?.name || 'Apex International College'} Portal
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition"
            >
              Sign In
            </button>
            <button
              onClick={onEnterPortal}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95 flex items-center space-x-1.5"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col justify-center">
        {/* Subtle glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Paystack Subscriptions & Automated Student Billing</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Seamless School Fee Tracking & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Paystack Billing</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Eliminate reconciliation headaches. Manage student tuition ledgers, automate parent payment reminders via WhatsApp, and collect fees with instant verification.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnterPortal}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>Explore Bursary Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-sm transition flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Administrator Sign In</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Paystack Gateway Checkout</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Support debit cards, direct bank transfer virtual accounts, and USSD dial codes with instant webhook confirmation.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Real-Time Balance Ledger</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Categorize student statuses dynamically as Paid, Partial, or Overdue with automated balance recalculation.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center mb-4">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Official Verified Receipts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate printable, verified bursary payment receipts with reference tracking and official school watermarks.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-400">
        <p>© 2026 EduPay Tracker • Built with Node.js, Cloud SQL PostgreSQL & Firebase Auth</p>
      </footer>
    </div>
  );
};
