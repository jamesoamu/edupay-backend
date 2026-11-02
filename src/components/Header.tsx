import React from 'react';
import { 
  GraduationCap, 
  PlusCircle, 
  CreditCard, 
  Settings, 
  LogOut, 
  LogIn, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';
import { useAuth } from '../lib/auth-context.tsx';

interface HeaderProps {
  onOpenRecordPayment: () => void;
  onOpenAddStudent: () => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRecordPayment,
  onOpenAddStudent,
  onOpenSettings,
  onOpenAuth,
}) => {
  const { user, profile, institution, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & School Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-xl">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  EduPay<span className="text-emerald-400">Tracker</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Paystack Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center truncate max-w-[200px] sm:max-w-sm">
                <Building2 className="w-3 h-3 mr-1 text-slate-400" />
                {institution?.name || 'Apex International College'}
                <span className="mx-1 text-slate-600">•</span>
                <span className="text-emerald-400 font-mono text-[11px]">{institution?.currentTerm || 'First Term'}</span>
              </p>
            </div>
          </div>

          {/* Quick Actions & Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenRecordPayment}
              className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition active:scale-95"
            >
              <CreditCard className="w-3.5 h-3.5 mr-1.5" />
              Record Payment
            </button>

            <button
              onClick={onOpenAddStudent}
              className="hidden md:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Add Student
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="School Settings & Paystack Keys"
            >
              <Settings className="w-4 h-4" />
            </button>

            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-emerald-800/80 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-200 overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'Admin'} className="w-full h-full object-cover" />
                  ) : (
                    (user.displayName || user.email || 'A').charAt(0).toUpperCase()
                  )}
                </div>
                <div className="hidden lg:block text-left text-xs">
                  <div className="font-semibold text-slate-200 truncate max-w-[120px]">
                    {user.displayName || user.email?.split('@')[0]}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono uppercase">Bursar Admin</div>
                </div>
                <button
                  onClick={signOut}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition"
              >
                <LogIn className="w-3.5 h-3.5 mr-1.5" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
