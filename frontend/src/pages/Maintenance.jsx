import { useEffect,useState } from "react";
import { Plus, Wrench } from "lucide-react";
import { api } from "../services/api";
export default function Maintenance({notify}) {
 const [items,setItems]=useState([]); const [form,setForm]=useState({bin_id:"BIN-001",issue:"Low battery",priority:"MEDIUM",technician:""});
 const load=()=>api.getMaintenance().then(setItems).catch(e=>notify(e.message,"error")); useEffect(load,[]);
 const add=async()=>{try{await api.createMaintenance(form);load();notify("Maintenance opened")}catch(e){notify(e.message,"error")}};
 return <div><div className="page-heading"><div><div className="eyebrow">ASSET HEALTH</div><h1>Maintenance</h1><p>Track low battery, calibration, offline and physical maintenance events.</p></div></div>
 <div className="panel form-panel"><div className="form-grid"><input value={form.bin_id} onChange={e=>setForm({...form,bin_id:e.target.value})} placeholder="Bin ID"/><select value={form.issue} onChange={e=>setForm({...form,issue:e.target.value})}><option>Low battery</option><option>Sensor calibration</option><option>Network offline</option><option>Lock maintenance</option><option>Physical damage</option></select><select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option>LOW</option><option>MEDIUM</option><option>HIGH</option><option>CRITICAL</option></select><input value={form.technician} onChange={e=>setForm({...form,technician:e.target.value})} placeholder="Technician"/><button className="primary-btn" onClick={add}><Plus size={16}/> Open Maintenance</button></div></div>
 <div className="panel"><div className="table-wrap"><table><thead><tr><th>Bin</th><th>Issue</th><th>Opened</th><th>Priority</th><th>Technician</th><th>Status</th><th/></tr></thead><tbody>{items.map(m=><tr key={m.id}><td>{m.bin_id}</td><td>{m.issue}</td><td>{new Date(m.opened_at).toLocaleString()}</td><td>{m.priority}</td><td>{m.technician||"Unassigned"}</td><td>{m.status}</td><td>{m.status==="OPEN"&&<button className="tiny-btn" onClick={async()=>{await api.resolveMaintenance(m.id);load();notify("Maintenance resolved")}}><Wrench size={14}/> Resolve</button>}</td></tr>)}</tbody></table></div></div></div>
}
