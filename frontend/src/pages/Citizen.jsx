import { useEffect,useState } from "react";
import { MapPin, Flag, Bell } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { api } from "../services/api";
export default function Citizen({notify}) {
 const [bins,setBins]=useState([]); const [issue,setIssue]=useState("");
 useEffect(()=>{api.getBins().then(setBins).catch(e=>notify(e.message,"error"))},[]);
 const report=()=>{if(!issue)return notify("Choose an issue","error");notify(`Citizen report submitted: ${issue}`);setIssue("")};
 return <div><div className="page-heading"><div><div className="eyebrow">CITIZEN WEB APP</div><h1>Nearby Smart Bins</h1><p>View simulated bin status and report local waste issues.</p></div></div>
 <div className="citizen-grid">{bins.map(b=><div className="panel citizen-card" key={b.bin_id}><MapPin size={20}/><h3>{b.name}</h3><p>{b.bin_id} · {b.fill_percent}% full</p><StatusBadge status={b.status}/><div className="small">Distance: simulated</div></div>)}</div>
 <div className="panel report"><div><Flag/><h2>Report an issue</h2><p>Prototype citizen reporting channel.</p></div><select value={issue} onChange={e=>setIssue(e.target.value)}><option value="">Select issue</option><option>Overflowing bin</option><option>Damaged bin</option><option>Bad smell</option><option>Other issue</option></select><button className="primary-btn" onClick={report}><Bell size={16}/> Submit Report</button></div></div>
}
