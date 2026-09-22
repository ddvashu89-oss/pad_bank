import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pencil, X, Check } from 'lucide-react';
import { getLady, updateLady } from '../services/ladyService.js';
import Spinner, { LoadingBlock } from '../components/Spinner.jsx';
import { formatDate, formatNumber } from '../utils/format.js';

export default function LadyProfilePage() {
  const { id } = useParams();
  const [lady, setLady] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    maritalStatus: '',
    fatherName: '',
    husbandName: '',
    mobile: '',
    address: '',
  });
  const [saving, setSaving] = useState(false);

  function load() {
    getLady(id)
      .then((data) => {
        setLady(data);
        setForm({
          name: data.name,
          maritalStatus: data.marital_status || '',
          fatherName: data.father_name || '',
          husbandName: data.husband_name || '',
          mobile: data.mobile || '',
          address: data.address || '',
        });
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load lady'));
  }

  useEffect(load, [id]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateLady(id, form);
      setEditing(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update lady');
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>;
  }

  if (!lady) {
    return <LoadingBlock />;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        {editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Marital Status</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="radio"
                    name="maritalStatus"
                    value="UNMARRIED"
                    checked={form.maritalStatus === 'UNMARRIED'}
                    onChange={(e) => setForm((f) => ({ ...f, maritalStatus: e.target.value }))}
                    required
                    className="accent-brand-600"
                  />
                  Unmarried
                </label>
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="radio"
                    name="maritalStatus"
                    value="MARRIED"
                    checked={form.maritalStatus === 'MARRIED'}
                    onChange={(e) => setForm((f) => ({ ...f, maritalStatus: e.target.value }))}
                    required
                    className="accent-brand-600"
                  />
                  Married
                </label>
              </div>
            </div>
            {form.maritalStatus === 'UNMARRIED' && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Father's Name</label>
                <input
                  required
                  value={form.fatherName}
                  onChange={(e) => setForm((f) => ({ ...f, fatherName: e.target.value }))}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}
            {form.maritalStatus === 'MARRIED' && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Husband's Name</label>
                <input
                  required
                  value={form.husbandName}
                  onChange={(e) => setForm((f) => ({ ...f, husbandName: e.target.value }))}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Mobile</label>
              <input
                value={form.mobile}
                onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Address</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                rows={2}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
              >
                {saving ? <Spinner size={15} /> : <Check size={15} />}
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg px-4 py-2 hover:bg-neutral-50"
              >
                <X size={15} />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-neutral-900">{lady.name}</h1>
                <p className="text-sm text-neutral-500 font-mono mt-0.5">{lady.aadhaarMasked}</p>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 border border-neutral-300 rounded-lg px-3 py-1.5"
              >
                <Pencil size={14} />
                Edit
              </button>
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
          </>
        )}
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
          <h2 className="font-semibold text-neutral-900">Distribution History</h2>
          <Link
            to={`/distributions/give?ladyId=${lady.id}`}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            Give Pads
          </Link>
        </div>
        {lady.history.length === 0 ? (
          <p className="px-5 py-6 text-sm text-neutral-500">No distributions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {lady.history.map((h) => (
                  <tr key={h.id} className="border-b border-neutral-50 last:border-0">
                    <td className="px-5 py-2.5 text-neutral-600 whitespace-nowrap">{formatDate(h.distribution_date)}</td>
                    <td className="px-5 py-2.5 text-right font-medium text-neutral-900 whitespace-nowrap">{h.quantity} pads</td>
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
