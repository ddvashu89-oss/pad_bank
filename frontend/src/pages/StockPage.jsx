import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackagePlus } from 'lucide-react';
import { listStock } from '../services/stockService.js';
import { formatDate, formatNumber } from '../utils/format.js';

export default function StockPage() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listStock()
      .then(setEntries)
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stock'))
      .finally(() => setLoading(false));
  }, []);

  const total = entries.reduce((sum, e) => sum + e.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Stock</h1>
        <Link
          to="/stock/add"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
        >
          <PackagePlus size={16} />
          Add Pads
        </Link>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        {loading ? (
          <p className="px-5 py-6 text-sm text-neutral-500">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="px-5 py-6 text-sm text-neutral-500">No stock entries yet.</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-neutral-500 border-b border-neutral-100 bg-neutral-50">
                  <th className="px-5 py-2.5 font-medium">Date</th>
                  <th className="px-5 py-2.5 font-medium">Note</th>
                  <th className="px-5 py-2.5 font-medium">Added By</th>
                  <th className="px-5 py-2.5 font-medium text-right">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-b border-neutral-50 last:border-0">
                    <td className="px-5 py-2.5 text-neutral-600">{formatDate(e.created_at)}</td>
                    <td className="px-5 py-2.5 text-neutral-900">{e.note || '—'}</td>
                    <td className="px-5 py-2.5 text-neutral-600">{e.createdByName || '—'}</td>
                    <td className="px-5 py-2.5 text-right font-medium text-neutral-900">
                      +{formatNumber(e.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-100 text-sm font-semibold text-neutral-900 text-right">
              Total Added: {formatNumber(total)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
