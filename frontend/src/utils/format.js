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
