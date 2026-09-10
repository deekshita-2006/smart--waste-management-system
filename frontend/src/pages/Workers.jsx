import { useEffect,useState } from "react";
import { Truck, UserCheck } from "lucide-react";
import { api } from "../services/api";
export default function Workers({notify}) {
 const [workers,setWorkers]=useState([]); useEffect(()=>{api.getWorkers().then(setWorkers).catch(e=>notify(e.message,"error"))},[]);
 return <div><div className="page-heading"><div><div className="eyebrow">COLLECTION CREW</div><h1>Worker Dashboard</h1><p>Prototype field-crew availability and operational status.</p></div></div>
 <div className="stats-grid three"><div className="stat-card"><div className="stat-icon"><UserCheck/></div><div><div className="muted">Available Workers</div><div className="stat-value">{workers.filter(w=>w.status==="AVAILABLE").length}</div></div></div><div className="stat-card"><div className="stat-icon"><Truck/></div><div><div className="muted">On Route</div><div className="stat-value">{workers.filter(w=>w.status==="ON_ROUTE").length}</div></div></div></div>
 <div className="worker-grid">{workers.map(w=><div className="panel worker" key={w.id}><div className="avatar large">{w.name.split(" ").map(x=>x[0]).join("")}</div><h3>{w.name}</h3><p>{w.phone}</p><span className={`worker-status ${w.status==="AVAILABLE"?"ok":""}`}>● {w.status}</span><div className="worker-feature"><UserCheck size={16}/> GPS navigation: simulation</div><div className="worker-feature"><Truck size={16}/> Vehicle dispatch: prototype</div></div>)}</div></div>
}
