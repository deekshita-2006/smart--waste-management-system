export default function StatusBadge({status}) {
  const label = status?.replaceAll("_"," ") || "UNKNOWN";
  return <span className={`badge badge-${String(status).toLowerCase()}`}>{label}</span>;
}
