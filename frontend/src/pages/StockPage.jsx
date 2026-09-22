import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackagePlus, PackageCheck, Gift, Droplet } from 'lucide-react';
import { listStock } from '../services/stockService.js';
import { listDistributions } from '../services/distributionService.js';
import StatCard from '../components/StatCard.jsx';
import { LoadingBlock } from '../components/Spinner.jsx';
import { formatDate, formatNumber, formatAadhaar } from '../utils/format.js';

export default function StockPage() {
  const [entries, setEntries] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listStock(), listDistributions()])
      .then(([stockData, distributionData]) => {
        setEntries(stockData);
        setDistributions(distributionData);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stock'))
      .finally(() => setLoading(false));
  }, []);

  const totalAdded = entries.reduce((sum, e) => sum + e.quantity, 0);
  const totalDistributed = distributions.reduce((sum, d) => sum + d.quantity, 0);
  const available = totalAdded - totalDistributed;

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

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Added" value={formatNumber(totalAdded)} icon={PackageCheck} />
          <StatCard label="Total Distributed" value={formatNumber(totalDistributed)} icon={Gift} />
          <StatCard label="Available Now" value={formatNumber(available)} icon={Droplet} accent />
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-200">
          <h2 className="font-semibold text-neutral-900">Stock Added</h2>
        </div>
        {loading ? (
          <LoadingBlock />
        ) : entries.length === 0 ? (
          <p className="px-5 py-6 text-sm text-neutral-500">No stock entries yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-500 border-b border-neutral-100 bg-neutral-50">
                    <th className="px-5 py-2.5 font-medium whitespace-nowrap">Date</th>
                    <th className="px-5 py-2.5 font-medium whitespace-nowrap">Note</th>
                    <th className="px-5 py-2.5 font-medium whitespace-nowrap">Added By</th>
                    <th className="px-5 py-2.5 font-medium text-right whitespace-nowrap">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr key={e.id} className="border-b border-neutral-50 last:border-0">
                      <td className="px-5 py-2.5 text-neutral-600 whitespace-nowrap">{formatDate(e.created_at)}</td>
                      <td className="px-5 py-2.5 text-neutral-900">{e.note || '—'}</td>
                      <td className="px-5 py-2.5 text-neutral-600 whitespace-nowrap">{e.createdByName || '—'}</td>
                      <td className="px-5 py-2.5 text-right font-medium text-neutral-900 whitespace-nowrap">
                        +{formatNumber(e.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-100 text-sm font-semibold text-neutral-900 text-right">
              Total Added: {formatNumber(totalAdded)}
            </div>
          </>
        )}
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-semibold text-neutral-900">Pads Distributed</h2>
          <Link to="/distributions/give" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            Give Pads
          </Link>
        </div>
        {loading ? (
          <LoadingBlock />
        ) : distributions.length === 0 ? (
          <p className="px-5 py-6 text-sm text-neutral-500">No pads have been given out yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-500 border-b border-neutral-100 bg-neutral-50">
                    <th className="px-5 py-2.5 font-medium whitespace-nowrap">Date</th>
                    <th className="px-5 py-2.5 font-medium whitespace-nowrap">Given To</th>
                    <th className="px-5 py-2.5 font-medium whitespace-nowrap">Aadhaar</th>
                    <th className="px-5 py-2.5 font-medium text-right whitespace-nowrap">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {distributions.map((d) => (
                    <tr key={d.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50">
                      <td className="px-5 py-2.5 text-neutral-600 whitespace-nowrap">{formatDate(d.distribution_date)}</td>
                      <td className="px-5 py-2.5 whitespace-nowrap">
                        <Link to={`/ladies/${d.lady_id}`} className="font-medium text-brand-700 hover:underline">
                          {d.ladyName}
                        </Link>
                      </td>
                      <td className="px-5 py-2.5 text-neutral-500 font-mono text-xs whitespace-nowrap">
                        {formatAadhaar(d.aadhaar)}
                      </td>
                      <td className="px-5 py-2.5 text-right font-medium text-neutral-900 whitespace-nowrap">
                        -{formatNumber(d.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-100 text-sm font-semibold text-neutral-900 text-right">
              Total Distributed: {formatNumber(totalDistributed)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
