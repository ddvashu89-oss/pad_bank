import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw, Database, Users, Package, Gift, UserCog } from 'lucide-react';
import { fetchSystemStatus } from '../services/systemService.js';
import { LoadingBlock } from '../components/Spinner.jsx';
import Spinner from '../components/Spinner.jsx';
import { formatNumber } from '../utils/format.js';

function formatTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function InfoPage() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  function load(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    fetchSystemStatus()
      .then((data) => {
        setStatus(data);
        setError('');
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to check system status'))
      .finally(() => setRefreshing(false));
  }

  useEffect(() => load(), []);

  const connected = status?.database?.connected;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Info</h1>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg px-3 py-1.5 hover:bg-neutral-50 disabled:opacity-60"
        >
          {refreshing ? <Spinner size={14} /> : <RefreshCw size={14} />}
          Refresh
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
      )}

      {!status && !error && <LoadingBlock label="Checking database connection…" />}

      {status && (
        <>
          <div
            className={`rounded-xl border p-6 flex items-start gap-4 ${
              connected ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}
          >
            {connected ? (
              <CheckCircle2 className="text-green-600 shrink-0" size={28} />
            ) : (
              <XCircle className="text-red-600 shrink-0" size={28} />
            )}
            <div className="min-w-0">
              <p className={`font-semibold ${connected ? 'text-green-800' : 'text-red-800'}`}>
                Database {connected ? 'Connected' : 'Not Connected'}
              </p>
              <p className={`text-sm mt-0.5 ${connected ? 'text-green-700' : 'text-red-700'}`}>
                {connected
                  ? `Responding in ${status.database.latencyMs}ms`
                  : status.database.error || 'Could not reach the database'}
              </p>
              <p className="text-xs text-neutral-500 mt-2">Checked at {formatTime(status.checkedAt)}</p>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <h2 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <Database size={16} className="text-neutral-400" />
              Connection Details
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-neutral-500">Host</dt>
                <dd className="text-neutral-900 mt-0.5 font-mono break-all">{status.database.host}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Database Name</dt>
                <dd className="text-neutral-900 mt-0.5 font-mono break-all">{status.database.name}</dd>
              </div>
            </dl>
          </div>

          {status.counts && (
            <div className="bg-white border border-neutral-200 rounded-xl p-5">
              <h2 className="font-semibold text-neutral-900 mb-3">Record Counts</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-neutral-400 shrink-0" />
                  <div>
                    <p className="text-neutral-500">Ladies</p>
                    <p className="font-semibold text-neutral-900">{formatNumber(status.counts.ladies)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-neutral-400 shrink-0" />
                  <div>
                    <p className="text-neutral-500">Stock Entries</p>
                    <p className="font-semibold text-neutral-900">{formatNumber(status.counts.stockEntries)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Gift size={16} className="text-neutral-400 shrink-0" />
                  <div>
                    <p className="text-neutral-500">Distributions</p>
                    <p className="font-semibold text-neutral-900">{formatNumber(status.counts.distributions)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <UserCog size={16} className="text-neutral-400 shrink-0" />
                  <div>
                    <p className="text-neutral-500">Users</p>
                    <p className="font-semibold text-neutral-900">{formatNumber(status.counts.users)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
