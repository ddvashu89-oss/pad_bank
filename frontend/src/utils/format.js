export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatNumber(n) {
  return Number(n ?? 0).toLocaleString('en-IN');
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function formatAadhaar(aadhaar) {
  if (!aadhaar) return aadhaar;
  const digits = aadhaar.replace(/\D/g, '');
  if (digits.length !== 12) return aadhaar;
  return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)}`;
}
