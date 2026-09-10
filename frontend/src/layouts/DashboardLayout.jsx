import { useState } from "react";
import { Bell, LayoutDashboard, Map, Trash2, ClipboardList, Users, Recycle, BarChart3, Wrench, Settings, Search, Menu, X, LogOut } from "lucide-react";

const nav = [
  ["overview","Overview",LayoutDashboard],["bins","Live Bins",Trash2],["map","Map",Map],["alerts","Alerts",Bell],
  ["collections","Collection Tasks",ClipboardList],["workers","Workers",Users],["segregation","Segregation",Recycle],
  ["analytics","Analytics",BarChart3],["maintenance","Maintenance",Wrench],["settings","Settings",Settings]
];

export default function DashboardLayout({page,setPage,children,alerts=[]}) {
  const [open,setOpen]=useState(false);
  const activeAlerts=alerts.filter(a=>a.status!=="RESOLVED").length;
  return <div className="app-shell">
    <aside className={`sidebar ${open?"open":""}`}>
      <div className="brand"><div className="brand-mark">♻</div><div><b>SmartWaste</b><span>Municipal OS</span></div><button className="icon-btn mobile-only" onClick={()=>setOpen(false)}><X/></button></div>
      <div className="simulation">● SIMULATION MODE</div>
      <nav>{nav.map(([id,label,Icon])=><button key={id} className={page===id?"nav-item active":"nav-item"} onClick={()=>{setPage(id);setOpen(false)}}><Icon size={18}/><span>{label}</span>{id==="alerts"&&activeAlerts>0?<em>{activeAlerts}</em>:null}</button>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item"><LogOut size={18}/> <span>Prototype Logout</span></button></div>
    </aside>
    <main className="main">
      <header className="topbar">
        <button className="icon-btn mobile-only" onClick={()=>setOpen(true)}><Menu/></button>
        <div className="search"><Search size={17}/><input placeholder="Search bins, alerts, tasks..." /></div>
        <div className="top-actions"><span className="mode-pill">DEMO DATA</span><button className="icon-btn"><Bell size={18}/>{activeAlerts>0&&<i/>}</button><div className="avatar">DC</div></div>
      </header>
      <section className="content">{children}</section>
    </main>
  </div>
}
