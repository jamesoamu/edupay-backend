import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Receipt, 
  Layers, 
  MessageSquare, 
  Settings,
  Banknote,
  Sparkles
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard' 
  | 'students' 
  | 'paystack' 
  | 'fees' 
  | 'payments' 
  | 'reminders' 
  | 'backend'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingCount = 0,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'students', 
      label: 'Student Fee Ledger', 
      icon: Users,
      badge: pendingCount > 0 ? `${pendingCount} Overdue` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    { id: 'paystack', label: 'Paystack & Plans', icon: CreditCard },
    { id: 'fees', label: 'Fee Structures', icon: Layers },
    { id: 'backend', label: 'Backend & APIs', icon: Sparkles, badge: 'Live API', badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-800' },
    { id: 'payments', label: 'Payment Records', icon: Receipt },
    { id: 'reminders', label: 'Parent Reminders', icon: MessageSquare },
    { id: 'settings', label: 'School Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Main Management
          </div>
          <nav className="space-y-1">
            {menuItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Finance & Communications
          </div>
          <nav className="space-y-1">
            {menuItems.slice(4).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Paystack Integration Callout */}
      <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60">
        <div className="flex items-center space-x-2 text-emerald-400 mb-1.5">
          <Banknote className="w-4 h-4" />
          <span className="text-xs font-bold text-slate-200">Paystack Gateway</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
          Cards, Bank Transfer & USSD automated checkout with instant reconciliation.
        </p>
        <button
          onClick={() => setActiveTab('paystack')}
          className="w-full py-1.5 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-medium flex items-center justify-center space-x-1 transition"
        >
          <Sparkles className="w-3 h-3" />
          <span>Configure Gateway</span>
        </button>
      </div>
    </aside>
  );
};
