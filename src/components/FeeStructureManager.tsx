import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Tag, 
  GraduationCap 
} from 'lucide-react';
import { FeeStructure } from '../types/index.ts';
import { formatCurrency } from '../utils/formatters.ts';

interface FeeStructureManagerProps {
  feeStructures: FeeStructure[];
  currency: string;
  onCreateFee: (fee: any) => Promise<void>;
  onDeleteFee: (feeId: number) => Promise<void>;
}

export const FeeStructureManager: React.FC<FeeStructureManagerProps> = ({
  feeStructures,
  currency,
  onCreateFee,
  onDeleteFee,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('Tuition Fee (Junior Secondary)');
  const [gradeLevel, setGradeLevel] = useState('JSS 1-3');
  const [category, setCategory] = useState('Tuition');
  const [term, setTerm] = useState('First Term');
  const [amount, setAmount] = useState<number>(200000);
  const [isCompulsory, setIsCompulsory] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || amount <= 0) return;

    setSubmitting(true);
    try {
      await onCreateFee({
        name,
        gradeLevel,
        category,
        term,
        amount: Number(amount),
        isCompulsory,
      });
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center">
            <Layers className="w-6 h-6 mr-2.5 text-emerald-400" />
            School Fee Structure & Levies
          </h1>
          <p className="text-xs text-slate-400">
            Configure tuition, laboratory charges, and extracurricular levies by class.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Fee Item
        </button>
      </div>

      {/* Fee Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {feeStructures.map((fee) => (
          <div
            key={fee.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                  {fee.category}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {fee.term}
                </span>
              </div>

              <h3 className="font-bold text-white text-sm mb-1">{fee.name}</h3>
              <p className="text-xs text-slate-400 flex items-center">
                <GraduationCap className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Target: <span className="text-slate-200 font-semibold ml-1">{fee.gradeLevel}</span>
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400">Standard Rate:</span>
                <div className="font-mono font-extrabold text-white text-base">
                  {formatCurrency(fee.amount, currency)}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {fee.isCompulsory && (
                  <span className="text-[10px] font-semibold text-emerald-400">Compulsory</span>
                )}
                <button
                  onClick={() => {
                    if (confirm(`Delete fee item '${fee.name}'?`)) {
                      onDeleteFee(fee.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                  title="Delete Fee Item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white mb-1">Add School Fee Item</h3>
            <p className="text-xs text-slate-400 mb-4">Define a new fee schedule component</p>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Fee Item Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Class / Grade</label>
                  <input
                    type="text"
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    placeholder="e.g. Primary 1 or All"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                  >
                    <option value="Tuition">Tuition</option>
                    <option value="ICT & Lab">ICT & Lab</option>
                    <option value="Books">Books & Uniform</option>
                    <option value="Development">Development Levy</option>
                    <option value="Boarding">Boarding & Meals</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Amount ({currency})</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Academic Term</label>
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="compulsory"
                  checked={isCompulsory}
                  onChange={(e) => setIsCompulsory(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="compulsory" className="text-slate-300">
                  Compulsory for all enrolled students in this class
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Save Fee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
