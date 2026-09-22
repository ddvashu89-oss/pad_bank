import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, CheckCircle2 } from 'lucide-react';
import { searchByAadhaar, getLady } from '../services/ladyService.js';
import { createDistribution } from '../services/distributionService.js';
import { fetchDashboard } from '../services/dashboardService.js';
import { formatNumber, todayISO, formatAadhaar } from '../utils/format.js';
import Spinner from '../components/Spinner.jsx';

export default function GivePadsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [aadhaar, setAadhaar] = useState('');
  const [lady, setLady] = useState(null);
  const [available, setAvailable] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [searchError, setSearchError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchDashboard().then((d) => setAvailable(d.availablePads));
  }, [success]);

  useEffect(() => {
    const ladyId = searchParams.get('ladyId');
    if (ladyId) {
      getLady(ladyId).then(setLady).catch(() => {});
    }
  }, [searchParams]);

  async function handleSearch(e) {
    e.preventDefault();
    setSearchError('');
    setLady(null);
    setSearching(true);
    try {
      const found = await searchByAadhaar(aadhaar);
      setLady(found);
    } catch (err) {
      setSearchError(err.response?.data?.message || 'No lady found with this Aadhaar number');
    } finally {
      setSearching(false);
    }
  }

  async function handleConfirm(e) {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);
    try {
      const result = await createDistribution({
        ladyId: lady.id,
        quantity: Number(quantity),
        distributionDate: todayISO(),
      });
      setSuccess({ ladyName: lady.name, quantity: Number(quantity) });
      setAvailable(result.available);
      setLady(null);
      setAadhaar('');
      setQuantity('');
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to save distribution');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">🎁 Give Pads</h1>

      {success && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <CheckCircle2 size={16} />
          Gave {success.quantity} pads to {success.ladyName}.
          <button onClick={() => setSuccess(null)} className="ml-auto text-green-800 underline">
            Dismiss
          </button>
        </div>
      )}

      {!lady && (
        <form onSubmit={handleSearch} className="bg-white border border-neutral-200 rounded-xl p-6 space-y-3">
          <label className="block text-sm font-medium text-neutral-700">Search Aadhaar</label>
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
              {searching ? 'Searching…' : 'Search'}
            </button>
          </div>
          {searchError && <p className="text-sm text-red-600">{searchError}</p>}
        </form>
      )}

      {lady && (
        <form onSubmit={handleConfirm} className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
          <div className="text-sm text-green-700 font-medium">Lady Found ✓</div>

          <dl className="space-y-2 text-sm border-b border-neutral-100 pb-4">
            <div className="flex justify-between">
              <dt className="text-neutral-500">Name</dt>
              <dd className="font-medium text-neutral-900">{lady.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Aadhaar</dt>
              <dd className="font-mono text-neutral-900">{formatAadhaar(lady.aadhaar)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Available Pads</dt>
              <dd className="font-medium text-neutral-900">
                {available === null ? <Spinner size={14} /> : formatNumber(available)}
              </dd>
            </div>
          </dl>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
            >
              {submitting && <Spinner size={16} />}
              {submitting ? 'Saving…' : 'Confirm'}
            </button>
            <button
              type="button"
              onClick={() => {
                setLady(null);
                navigate('/distributions/give');
              }}
              className="border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-neutral-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
