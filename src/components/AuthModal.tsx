import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  ShieldCheck, 
  GraduationCap, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../lib/auth-context.tsx';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please check popup permissions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl text-slate-100 flex flex-col relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pt-2 pb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20 text-white font-bold text-2xl">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Bursary Portal Sign In</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Log in to manage student fee ledgers, automated Paystack debits, and official receipts.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Google Sign In Button */}
        <div className="space-y-3 my-2">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{loading ? 'Authenticating...' : 'Continue with Google Account'}</span>
          </button>
        </div>

        {/* Demo Mode Notice */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Live Preview Mode Active
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">
            You can test the entire app, Paystack simulations, and student ledgers immediately.
          </p>
        </div>
      </div>
    </div>
  );
};
