import { compactNumber } from '../utils/helpers.js';

export default function StatCard({ label, value, hint }) {
  return (
    <article className="stat-card">
      <strong>{compactNumber(value)}</strong>
      <span>{label}</span>
      {hint ? <small>{hint}</small> : null}
    </article>
  );
}
