import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserPlus } from 'lucide-react';
import { listLadies } from '../services/ladyService.js';

export default function LadiesPage() {
  const [ladies, setLadies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      listLadies(search)
        .then(setLadies)
        .catch((err) => setError(err.response?.data?.message || 'Failed to load ladies'))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Ladies</h1>
        <Link
          to="/ladies/add"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
        >
          <UserPlus size={16} />
          Add Lady
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or Aadhaar…"
          className="w-full border border-neutral-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        {loading ? (
          <p className="px-5 py-6 text-sm text-neutral-500">Loading…</p>
        ) : ladies.length === 0 ? (
          <p className="px-5 py-6 text-sm text-neutral-500">No ladies found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-neutral-500 border-b border-neutral-100 bg-neutral-50">
                  <th className="px-5 py-2.5 font-medium whitespace-nowrap">Name</th>
                  <th className="px-5 py-2.5 font-medium whitespace-nowrap">Aadhaar</th>
                  <th className="px-5 py-2.5 font-medium whitespace-nowrap">Mobile</th>
                </tr>
              </thead>
              <tbody>
                {ladies.map((lady) => (
                  <tr key={lady.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50">
                    <td className="px-5 py-2.5 whitespace-nowrap">
                      <Link to={`/ladies/${lady.id}`} className="font-medium text-brand-700 hover:underline">
                        {lady.name}
                      </Link>
                    </td>
                    <td className="px-5 py-2.5 text-neutral-600 font-mono text-xs whitespace-nowrap">{lady.aadhaarMasked}</td>
                    <td className="px-5 py-2.5 text-neutral-600 whitespace-nowrap">{lady.mobile || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
