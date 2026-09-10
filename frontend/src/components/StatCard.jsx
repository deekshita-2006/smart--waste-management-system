export default function StatCard({icon:Icon,title,value,subtitle}) {
  return <div className="stat-card">
    <div className="stat-icon"><Icon size={20}/></div>
    <div><div className="muted">{title}</div><div className="stat-value">{value}</div>{subtitle && <div className="small">{subtitle}</div>}</div>
  </div>
}
