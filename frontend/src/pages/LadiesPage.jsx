import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserPlus, Pencil, Trash2 } from 'lucide-react';
import { listLadies, deleteLady } from '../services/ladyService.js';
import Spinner, { LoadingBlock } from '../components/Spinner.jsx';
import { formatAadhaar } from '../utils/format.js';

export default function LadiesPage() {
  const [ladies, setLadies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  function load() {
    setLoading(true);
    listLadies(search)
      .then(setLadies)
      .catch((err) => setError(err.response?.data?.message || 'Failed to load ladies'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const timeout = setTimeout(load, 250);
    return () => clearTimeout(timeout);
  }, [search]);

  async function handleDelete(lady) {
    if (!window.confirm(`Delete ${lady.name}? This cannot be undone.`)) return;
    setError('');
    setDeletingId(lady.id);
    try {
      await deleteLady(lady.id);
      setLadies((prev) => prev.filter((l) => l.id !== lady.id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete lady');
    } finally {
      setDeletingId(null);
    }
  }

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
          <LoadingBlock />
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
                  <th className="px-5 py-2.5 font-medium text-right whitespace-nowrap">Actions</th>
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
                    <td className="px-5 py-2.5 text-neutral-600 font-mono text-xs whitespace-nowrap">{formatAadhaar(lady.aadhaar)}</td>
                    <td className="px-5 py-2.5 text-neutral-600 whitespace-nowrap">{lady.mobile || '—'}</td>
                    <td className="px-5 py-2.5 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/ladies/${lady.id}?edit=1`}
                          className="text-neutral-500 hover:text-brand-700"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(lady)}
                          disabled={deletingId === lady.id}
                          className="text-neutral-500 hover:text-red-600 disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === lady.id ? <Spinner size={16} /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </td>
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
