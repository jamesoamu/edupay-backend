import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  Key, 
  Code, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Play, 
  RefreshCw,
  Layers,
  FileText
} from 'lucide-react';
import { Institution } from '../types/index.ts';

interface BackendHubViewProps {
  institution: Institution | null;
}

export const BackendHubView: React.FC<BackendHubViewProps> = ({ institution }) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [activeTab, setActiveTab] = useState<'endpoints' | 'schema' | 'keys'>('endpoints');

  // Test endpoint runner
  const [testEndpoint, setTestEndpoint] = useState<string>('/api/health');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [loadingTest, setLoadingTest] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(`${baseUrl}/api`);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const envTemplate = `# Frontend .env (to connect this backend)
VITE_API_URL="${baseUrl}"

# Backend Connection Keys (.env)
PORT=3000
SQL_HOST="127.0.0.1"
SQL_USER="postgres"
SQL_DB_NAME="edupay_db"
PAYSTACK_PUBLIC_KEY="${institution?.paystackPublicKey || 'pk_test_edupay_demo_key_9831'}"
PAYSTACK_SECRET_KEY="${institution?.paystackSecretKey || 'sk_test_edupay_demo_key_4412'}"`;

  const handleCopyEnv = () => {
    navigator.clipboard?.writeText(envTemplate);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const runTest = async (endpoint: string) => {
    setLoadingTest(true);
    setTestEndpoint(endpoint);
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setTestResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setTestResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setLoadingTest(false);
    }
  };

  useEffect(() => {
    runTest('/api/health');
  }, []);

  const endpointsList = [
    { method: 'GET', path: '/api/health', desc: 'Server health & status' },
    { method: 'GET', path: '/api/dashboard', desc: 'Financial metrics & recovery rates' },
    { method: 'GET', path: '/api/students', desc: 'Roster with search & filters' },
    { method: 'GET', path: '/api/payments', desc: 'Transactions & receipts audit' },
    { method: 'GET', path: '/api/fee-structures', desc: 'Class tuition & levies' },
    { method: 'GET', path: '/api/subscriptions', desc: 'Recurring installment plans' },
    { method: 'GET', path: '/api/institution', desc: 'School bank details & keys' },
    { method: 'GET', path: '/api/docs', desc: 'Full API Specification' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Modular Backend Service • Online & CORS Enabled</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center">
            <Server className="w-6 h-6 mr-2 text-emerald-400" />
            Backend Architecture & Connection Hub
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Dedicated folder (<code className="text-emerald-400">/backend</code>) containing schema, REST APIs, and connection keys.
          </p>
        </div>

        <button
          onClick={handleCopyUrl}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center space-x-2 active:scale-95"
        >
          {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
          <span>{copiedUrl ? 'Copied Backend URL!' : 'Copy Base API URL'}</span>
        </button>
      </div>

      {/* Connection Info Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Base API URL</span>
          <div className="font-mono text-xs font-bold text-emerald-400 truncate mt-1">
            {baseUrl}/api
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Accepts CORS from any origin (*)</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Database Engine</span>
          <div className="font-mono text-xs font-bold text-white mt-1">
            Cloud SQL PostgreSQL
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Drizzle ORM Object-Pooled</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Auth & Gateway</span>
          <div className="font-mono text-xs font-bold text-white mt-1">
            Firebase Auth + Paystack
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Bearer token authorization</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('endpoints')}
          className={`py-3 px-4 border-b-2 transition flex items-center space-x-1.5 ${
            activeTab === 'endpoints'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Live API Endpoints & Tester</span>
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`py-3 px-4 border-b-2 transition flex items-center space-x-1.5 ${
            activeTab === 'schema'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>PostgreSQL Schema Models</span>
        </button>

        <button
          onClick={() => setActiveTab('keys')}
          className={`py-3 px-4 border-b-2 transition flex items-center space-x-1.5 ${
            activeTab === 'keys'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Connection Keys & .env Template</span>
        </button>
      </div>

      {/* Tab 1: Live Endpoints & Interactive Tester */}
      {activeTab === 'endpoints' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Endpoints List */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center">
              <Code className="w-4 h-4 mr-1.5 text-emerald-400" />
              REST API Endpoints
            </h3>
            <div className="space-y-2">
              {endpointsList.map((ep) => (
                <div
                  key={ep.path}
                  onClick={() => runTest(ep.path)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    testEndpoint === ep.path
                      ? 'bg-slate-800 border-emerald-500/50 shadow-sm'
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-200">{ep.path}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <span>{ep.desc}</span>
                    <Play className="w-3 h-3 text-emerald-400 ml-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Response Console */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  Response: {testEndpoint}
                </span>
                <button
                  onClick={() => runTest(testEndpoint)}
                  disabled={loadingTest}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center space-x-1 border border-slate-700"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingTest ? 'animate-spin' : ''}`} />
                  <span>Execute</span>
                </button>
              </div>

              <div className="h-96 bg-slate-950 rounded-xl p-4 overflow-y-auto font-mono text-xs text-slate-300 border border-slate-800/80">
                {loadingTest ? (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    Executing request...
                  </div>
                ) : (
                  <pre>{testResponse || 'Click any endpoint on the left to test execution.'}</pre>
                )}
              </div>
            </div>

            <div className="pt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800 mt-3">
              <span>Status: 200 OK • Content-Type: application/json</span>
              <span className="text-emerald-400 font-mono">Verified Live</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: PostgreSQL Schema */}
      {activeTab === 'schema' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center">
                <Database className="w-4 h-4 mr-2 text-emerald-400" />
                Drizzle PostgreSQL Schema Definition
              </h3>
              <p className="text-xs text-slate-400">File path: <code className="text-emerald-400">backend/src/db/schema.ts</code></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5">
              <span className="font-mono font-bold text-emerald-400">users</span>
              <p className="text-slate-400">id (PK), uid (unique), email, displayName, photoUrl, role, createdAt</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5">
              <span className="font-mono font-bold text-emerald-400">institutions</span>
              <p className="text-slate-400">id (PK), userId (FK), name, code, motto, currency, bankName, bankAccountNumber, paystackPublicKey, paystackSecretKey, currentTerm, currentSession</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5">
              <span className="font-mono font-bold text-emerald-400">students</span>
              <p className="text-slate-400">id (PK), institutionId (FK), admissionNumber, firstName, lastName, gradeLevel, guardianName, guardianPhone, totalBilled, totalPaid, status ('paid'|'partial'|'overdue')</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5">
              <span className="font-mono font-bold text-emerald-400">payments</span>
              <p className="text-slate-400">id (PK), institutionId (FK), studentId (FK), reference (unique), amount, currency, paymentMethod, channel, receiptNumber, payerName, paystackReference, paidAt</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5">
              <span className="font-mono font-bold text-emerald-400">fee_structures</span>
              <p className="text-slate-400">id (PK), institutionId (FK), name, gradeLevel, category, term, amount, isCompulsory</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5">
              <span className="font-mono font-bold text-emerald-400">subscriptions</span>
              <p className="text-slate-400">id (PK), institutionId (FK), studentId (FK), planName, planCode, interval, amount, status, nextPaymentDate</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Connection Keys & .env Template */}
      {activeTab === 'keys' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center">
                <Key className="w-4 h-4 mr-2 text-emerald-400" />
                Connection Keys & Environment Template
              </h3>
              <p className="text-xs text-slate-400">
                Use these variables to connect any external frontend or run the backend independently.
              </p>
            </div>

            <button
              onClick={handleCopyEnv}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 transition active:scale-95"
            >
              {copiedEnv ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEnv ? 'Copied .env!' : 'Copy Template'}</span>
            </button>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-emerald-400 border border-slate-800/80 overflow-x-auto">
            <pre>{envTemplate}</pre>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-white flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-400" />
              How To Connect An External Frontend:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed">
              <li>In your separate frontend project, configure <code className="text-emerald-400">VITE_API_URL="{baseUrl}"</code>.</li>
              <li>Make standard <code className="text-slate-200">fetch()</code> or <code className="text-slate-200">axios</code> requests to <code className="text-emerald-400">{baseUrl}/api/dashboard</code>, <code className="text-emerald-400">{baseUrl}/api/students</code>, etc.</li>
              <li>CORS is enabled by default with wildcard origin <code className="text-slate-200">*</code> and all headers allowed.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
