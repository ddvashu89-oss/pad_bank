import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, CheckCircle2, XCircle, Gift, ExternalLink } from 'lucide-react';
import { searchByAadhaar, getLady } from '../services/ladyService.js';
import { formatDate, formatNumber, formatAadhaar } from '../utils/format.js';
import Spinner from '../components/Spinner.jsx';

export default function AadhaarCheckPage() {
  const navigate = useNavigate();
  const [aadhaar, setAadhaar] = useState('');
  const [lady, setLady] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setError('');
    setLady(null);
    setNotFound(false);
    setSearching(true);
    try {
      const found = await searchByAadhaar(aadhaar);
      const full = await getLady(found.id);
      setLady(full);
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(err.response?.data?.message || 'Search failed');
      }
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Check Aadhaar</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Look up whether an Aadhaar number is already registered and see her full pad history.
        </p>
      </div>

      <form onSubmit={handleSearch} className="bg-white border border-neutral-200 rounded-xl p-6 space-y-3">
        <label className="block text-sm font-medium text-neutral-700">Aadhaar Number</label>
        <div className="flex gap-2">
          <input
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
            inputMode="numeric"
            maxLength={12}
            placeholder="Enter 12-digit Aadhaar number"
            className="flex-1 border border-neutral-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={searching || !aadhaar}
            className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
          >
            {searching ? <Spinner size={15} /> : <Search size={15} />}
            {searching ? 'Checking…' : 'Check'}
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      {notFound && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 text-center space-y-3">
          <XCircle className="mx-auto text-neutral-400" size={32} />
          <p className="text-neutral-700 font-medium">No lady is registered with this Aadhaar number.</p>
          <p className="text-sm text-neutral-500">This Aadhaar is free to use for a new registration.</p>
          <button
            onClick={() => navigate(`/ladies/add?aadhaar=${encodeURIComponent(aadhaar)}`)}
            className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
          >
            Add as New Lady
          </button>
        </div>
      )}

      {lady && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <CheckCircle2 size={16} />
            This Aadhaar is already registered — duplicate registration is blocked.
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{lady.name}</h2>
                <p className="text-sm text-neutral-500 font-mono mt-0.5">{formatAadhaar(lady.aadhaar)}</p>
              </div>
              <Link
                to={`/ladies/${lady.id}`}
                className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                Full Profile
                <ExternalLink size={14} />
              </Link>
            </div>
            <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-neutral-500">Marital Status</dt>
                <dd className="text-neutral-900 mt-0.5">
                  {lady.marital_status === 'MARRIED' ? 'Married' : lady.marital_status === 'UNMARRIED' ? 'Unmarried' : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">
                  {lady.marital_status === 'MARRIED' ? "Husband's Name" : "Father's Name"}
                </dt>
                <dd className="text-neutral-900 mt-0.5">
                  {lady.marital_status === 'MARRIED' ? lady.husband_name || '—' : lady.father_name || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">Mobile</dt>
                <dd className="text-neutral-900 mt-0.5">{lady.mobile || '—'}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Address</dt>
                <dd className="text-neutral-900 mt-0.5">{lady.address || '—'}</dd>
              </div>
            </dl>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-neutral-200 rounded-xl p-5">
              <p className="text-sm text-neutral-500">Total Distributions</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{formatNumber(lady.totalDistributions)}</p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-5">
              <p className="text-sm text-neutral-500">Total Pads Received</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{formatNumber(lady.totalPadsReceived)}</p>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl">
            <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="font-semibold text-neutral-900">Full Pad History</h3>
              <Link
                to={`/distributions/give?ladyId=${lady.id}`}
                className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                <Gift size={14} />
                Give Pads
              </Link>
            </div>
            {lady.history.length === 0 ? (
              <p className="px-5 py-6 text-sm text-neutral-500">No pads given yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-neutral-500 border-b border-neutral-100 bg-neutral-50">
                      <th className="px-5 py-2.5 font-medium whitespace-nowrap">Date</th>
                      <th className="px-5 py-2.5 font-medium text-right whitespace-nowrap">Pads Given</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lady.history.map((h) => (
                      <tr key={h.id} className="border-b border-neutral-50 last:border-0">
                        <td className="px-5 py-2.5 text-neutral-600 whitespace-nowrap">{formatDate(h.distribution_date)}</td>
                        <td className="px-5 py-2.5 text-right font-medium text-neutral-900 whitespace-nowrap">{h.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
