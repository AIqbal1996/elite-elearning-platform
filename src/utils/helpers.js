export function compactNumber(value) {
  return new Intl.NumberFormat('en-IN').format(value || 0);
}

export function formatDuration(value) {
  if (value === null || value === undefined || value === '') return 'Self paced';
  const n = Number(value);
  if (Number.isNaN(n)) return 'Self paced';
  return `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)} hrs`;
}

export function unique(list) {
  return Array.from(new Set(list.filter(Boolean)));
}

export function includesText(item, query, fields) {
  if (!query) return true;
  const q = query.toLowerCase();
  return fields.some((field) => String(item[field] || '').toLowerCase().includes(q));
}
