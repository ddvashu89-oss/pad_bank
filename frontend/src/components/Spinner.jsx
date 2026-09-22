import { Loader2 } from 'lucide-react';

export default function Spinner({ size = 16, className = '' }) {
  return <Loader2 size={size} className={`animate-spin ${className}`} />;
}

export function LoadingBlock({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-2 px-5 py-10 text-sm text-neutral-500">
      <Spinner size={18} />
      {label}
    </div>
  );
}
