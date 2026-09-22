export default function StatCard({ label, value, icon: Icon, accent = false }) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        accent ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-neutral-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${accent ? 'text-brand-100' : 'text-neutral-500'}`}>
          {label}
        </span>
        {Icon && <Icon size={18} className={accent ? 'text-brand-100' : 'text-neutral-400'} />}
      </div>
      <div className={`mt-2 text-3xl font-bold ${accent ? 'text-white' : 'text-neutral-900'}`}>
        {value}
      </div>
    </div>
  );
}
