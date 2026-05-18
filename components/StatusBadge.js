export default function StatusBadge({ value }) {
  return <span className={`badge badge-${value}`}>{String(value).replace('_', ' ')}</span>;
}
