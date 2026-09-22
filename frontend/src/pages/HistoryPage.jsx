import { useEffect, useState } from 'react';
import { listDistributions } from '../services/distributionService.js';
import { formatDate, formatNumber } from '../utils/format.js';

export default function HistoryPage() {
  const [distributions, setDistributions] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    listDistributions({ from, to })
      .then(setDistributions)
      .catch((err) => setError(err.response?.data?.message || 'Failed to load history'))
      .finally(() => setLoading(false));
  }, [from, to]);

  const totalPads = distributions.reduce((sum, d) => sum + d.quantity, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Distribution History</h1>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">From Date</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">To Date</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        {(from || to) && (
          <button
            onClick={() => {
              setFrom('');
              setTo('');
            }}
            className="text-sm text-neutral-500 hover:text-neutral-800 pb-2"
          >
            Clear filters
          </button>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        {loading ? (
          <p className="px-5 py-6 text-sm text-neutral-500">Loading…</p>
        ) : distributions.length === 0 ? (
          <p className="px-5 py-6 text-sm text-neutral-500">No distributions found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-500 border-b border-neutral-100 bg-neutral-50">
                    <th className="px-5 py-2.5 font-medium whitespace-nowrap">Date</th>
                    <th className="px-5 py-2.5 font-medium whitespace-nowrap">Lady</th>
                    <th className="px-5 py-2.5 font-medium whitespace-nowrap">Aadhaar</th>
                    <th className="px-5 py-2.5 font-medium text-right whitespace-nowrap">Pads</th>
                  </tr>
                </thead>
                <tbody>
                  {distributions.map((d) => (
                    <tr key={d.id} className="border-b border-neutral-50 last:border-0">
                      <td className="px-5 py-2.5 text-neutral-600 whitespace-nowrap">{formatDate(d.distribution_date)}</td>
                      <td className="px-5 py-2.5 text-neutral-900 whitespace-nowrap">{d.ladyName}</td>
                      <td className="px-5 py-2.5 text-neutral-500 font-mono text-xs whitespace-nowrap">
                        XXXX-XXXX-{d.aadhaar?.slice(-4)}
                      </td>
                      <td className="px-5 py-2.5 text-right font-medium text-neutral-900 whitespace-nowrap">{d.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-100 text-sm font-semibold text-neutral-900 text-right">
              Total: {formatNumber(totalPads)} pads
            </div>
          </>
        )}
      </div>
    </div>
  );
}
