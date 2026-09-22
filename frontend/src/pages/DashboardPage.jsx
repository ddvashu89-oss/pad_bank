import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, PackagePlus, Droplet, Gift } from 'lucide-react';
import StatCard from '../components/StatCard.jsx';
import { fetchDashboard } from '../services/dashboardService.js';
import { formatDate, formatNumber } from '../utils/format.js';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <Link
          to="/distributions/give"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
        >
          <Gift size={16} />
          Give Pads
        </Link>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {data && (
        <>
          <StatCard label="Available Pads" value={formatNumber(data.availablePads)} icon={Droplet} accent />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Ladies" value={formatNumber(data.totalLadies)} icon={Users} />
            <StatCard label="Total Added" value={formatNumber(data.totalPadsAdded)} icon={PackagePlus} />
            <StatCard label="Total Distributed" value={formatNumber(data.totalPadsDistributed)} icon={Gift} />
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl">
            <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="font-semibold text-neutral-900">Recent Distributions</h2>
              <Link to="/distributions" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                View all
              </Link>
            </div>
            {data.recentDistributions.length === 0 ? (
              <p className="px-5 py-6 text-sm text-neutral-500">No distributions yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-500 border-b border-neutral-100">
                    <th className="px-5 py-2 font-medium">Date</th>
                    <th className="px-5 py-2 font-medium">Lady</th>
                    <th className="px-5 py-2 font-medium text-right">Pads</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentDistributions.map((d) => (
                    <tr key={d.id} className="border-b border-neutral-50 last:border-0">
                      <td className="px-5 py-2.5 text-neutral-600">{formatDate(d.distribution_date)}</td>
                      <td className="px-5 py-2.5 text-neutral-900">{d.ladyName}</td>
                      <td className="px-5 py-2.5 text-right font-medium text-neutral-900">{d.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
