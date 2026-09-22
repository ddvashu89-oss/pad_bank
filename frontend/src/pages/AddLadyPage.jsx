import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createLady } from '../services/ladyService.js';

export default function AddLadyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    aadhaar: searchParams.get('aadhaar') || '',
    name: '',
    maritalStatus: '',
    fatherName: '',
    husbandName: '',
    mobile: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const lady = await createLady(form);
      navigate(`/ladies/${lady.id}`);
    } catch (err) {
      if (err.response?.status === 409) {
        setError('This lady is already registered.');
      } else {
        setError(err.response?.data?.message || 'Failed to save lady');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Add Lady</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Aadhaar Number *</label>
          <input
            required
            value={form.aadhaar}
            onChange={update('aadhaar')}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Name *</label>
          <input
            required
            value={form.name}
            onChange={update('name')}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Marital Status *</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="radio"
                name="maritalStatus"
                value="UNMARRIED"
                checked={form.maritalStatus === 'UNMARRIED'}
                onChange={update('maritalStatus')}
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
                onChange={update('maritalStatus')}
                required
                className="accent-brand-600"
              />
              Married
            </label>
          </div>
        </div>

        {form.maritalStatus === 'UNMARRIED' && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Father's Name *</label>
            <input
              required
              value={form.fatherName}
              onChange={update('fatherName')}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        )}

        {form.maritalStatus === 'MARRIED' && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Husband's Name *</label>
            <input
              required
              value={form.husbandName}
              onChange={update('husbandName')}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Mobile</label>
          <input
            value={form.mobile}
            onChange={update('mobile')}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Address</label>
          <textarea
            value={form.address}
            onChange={update('address')}
            rows={3}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
        >
          {submitting ? 'Saving…' : 'Save Lady'}
        </button>
      </form>
    </div>
  );
}
