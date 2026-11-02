import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  GraduationCap, 
  Phone, 
  Mail, 
  CheckCircle2 
} from 'lucide-react';

interface AddStudentModalProps {
  currency: string;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  currency,
  onClose,
  onSubmit,
}) => {
  const nextRandomAdm = `AIC/2026/${Math.floor(180 + Math.random() * 800)}`;
  const [admissionNumber, setAdmissionNumber] = useState(nextRandomAdm);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('SSS 1');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('+234 ');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [gender, setGender] = useState('Female');
  const [totalBilled, setTotalBilled] = useState<number>(320000);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !guardianName) return;

    setSubmitting(true);
    try {
      await onSubmit({
        admissionNumber,
        firstName,
        lastName,
        gradeLevel,
        guardianName,
        guardianPhone,
        guardianEmail: guardianEmail || undefined,
        gender,
        totalBilled: Number(totalBilled),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Enroll New Student</h2>
              <p className="text-xs text-slate-400">Add to school ledger and set term billing schedule</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Adm # and Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Admission Number</label>
              <input
                type="text"
                required
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Class / Grade</label>
              <select
                value={gradeLevel}
                onChange={(e) => {
                  setGradeLevel(e.target.value);
                  // Dynamic default billing based on grade
                  if (e.target.value.includes('Primary')) setTotalBilled(210000);
                  else if (e.target.value.includes('JSS')) setTotalBilled(285000);
                  else setTotalBilled(355000);
                }}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 font-medium"
              >
                <option value="Primary 1">Primary 1</option>
                <option value="Primary 2">Primary 2</option>
                <option value="Primary 3">Primary 3</option>
                <option value="Primary 4">Primary 4</option>
                <option value="Primary 5">Primary 5</option>
                <option value="Primary 6">Primary 6</option>
                <option value="JSS 1">JSS 1</option>
                <option value="JSS 2">JSS 2</option>
                <option value="JSS 3">JSS 3</option>
                <option value="SSS 1">SSS 1</option>
                <option value="SSS 2">SSS 2</option>
                <option value="SSS 3">SSS 3</option>
              </select>
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">First Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ebube"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Last Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Danjuma"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
              />
            </div>
          </div>

          {/* Gender & Billed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Term Fee Expected ({currency})</label>
              <input
                type="number"
                min="0"
                required
                value={totalBilled}
                onChange={(e) => setTotalBilled(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 font-mono font-bold"
              />
            </div>
          </div>

          {/* Guardian Info */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Parent / Guardian Contact
            </h4>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Guardian Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Alhaji Mohammed Danjuma"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Guardian Phone (WhatsApp)</label>
                <input
                  type="text"
                  required
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Guardian Email (Optional)</label>
                <input
                  type="email"
                  placeholder="parent@example.com"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                />
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
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20 flex items-center space-x-1.5 transition active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Registering...' : 'Enroll Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
