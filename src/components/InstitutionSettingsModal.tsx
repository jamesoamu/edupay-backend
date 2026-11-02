import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Building2, 
  CheckCircle2, 
  CreditCard, 
  DollarSign,
  GraduationCap
} from 'lucide-react';
import { CurrencyCode, Institution } from '../types/index.ts';

interface InstitutionSettingsModalProps {
  institution: Institution | null;
  onClose: () => void;
  onSave: (data: Partial<Institution>) => Promise<void>;
}

export const InstitutionSettingsModal: React.FC<InstitutionSettingsModalProps> = ({
  institution,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(institution?.name || 'Apex International College');
  const [code, setCode] = useState(institution?.code || 'AIC-101');
  const [motto, setMotto] = useState(institution?.motto || 'Excellence in Knowledge & Character');
  const [currency, setCurrency] = useState<CurrencyCode>(institution?.currency || 'NGN');
  const [currentTerm, setCurrentTerm] = useState(institution?.currentTerm || 'First Term');
  const [currentSession, setCurrentSession] = useState(institution?.currentSession || '2026/2027');
  const [address, setAddress] = useState(institution?.address || '14 Admiralty Way, Victoria Island, Lagos, Nigeria');
  const [phone, setPhone] = useState(institution?.phone || '+234 803 123 4567');
  const [email, setEmail] = useState(institution?.email || 'bursar@apexcollege.edu.ng');
  const [bankName, setBankName] = useState(institution?.bankName || 'Zenith Bank Plc');
  const [bankAccountName, setBankAccountName] = useState(institution?.bankAccountName || 'Apex International College Fee Account');
  const [bankAccountNumber, setBankAccountNumber] = useState(institution?.bankAccountNumber || '1014892019');
  
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        name,
        code,
        motto,
        currency,
        currentTerm,
        currentSession,
        address,
        phone,
        email,
        bankName,
        bankAccountName,
        bankAccountNumber,
      });
      setSavedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Institution Profile & Settings</h2>
              <p className="text-xs text-slate-400">School identity, official bank account, and currency</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* School Name & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">School / Academy Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">School Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 font-mono"
              />
            </div>
          </div>

          {/* Motto */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Motto</label>
            <input
              type="text"
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 italic"
            />
          </div>

          {/* Currency & Term */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 font-semibold"
              >
                <option value="NGN">NGN (₦ Nigerian Naira)</option>
                <option value="USD">USD ($ US Dollar)</option>
                <option value="GBP">GBP (£ British Pound)</option>
                <option value="GHS">GHS (GH₵ Ghana Cedi)</option>
                <option value="KES">KES (KSh Kenyan Shilling)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Academic Term</label>
              <input
                type="text"
                value={currentTerm}
                onChange={(e) => setCurrentTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Session</label>
              <input
                type="text"
                value={currentSession}
                onChange={(e) => setCurrentSession(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 font-medium"
              />
            </div>
          </div>

          {/* Bank Info Header */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center">
              <CreditCard className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              School Bank Account (For Invoices & Reminders)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Account Number</label>
                <input
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 font-mono font-bold text-emerald-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Account Name</label>
                <input
                  type="text"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Physical Address & Official Contact
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Official Telephone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Bursary Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20 flex items-center space-x-1.5 transition active:scale-95 disabled:opacity-50"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Changes Saved!</span>
                </>
              ) : (
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
