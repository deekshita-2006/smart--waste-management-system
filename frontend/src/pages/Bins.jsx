import { useEffect,useState } from "react";
import { Battery, Lock, RefreshCw, RotateCcw, Wifi, Zap } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { api } from "../services/api";

export default function Bins({notify}) {
  const [bins,setBins]=useState([]); const [selected,setSelected]=useState(null); const [filter,setFilter]=useState("ALL");
  const load=async()=>{try{const b=await api.getBins();setBins(b);setSelected(s=>s?b.find(x=>x.bin_id===s.bin_id)||b[0]:b[0])}catch(e){notify(e.message,"error")}};
  useEffect(()=>{load()},[]);
  const act=async(fn,msg)=>{try{const b=await fn();setSelected(b);await load();notify(msg)}catch(e){notify(e.message,"error")}};
  const visible=bins.filter(b=>filter==="ALL"||b.status===filter);
  return <div><div className="page-heading"><div><div className="eyebrow">IOT TELEMETRY</div><h1>Live Smart Bins</h1><p>Monitor fill, battery, connectivity and software lock state.</p></div><button className="secondary-btn" onClick={load}><RefreshCw size={16}/> Refresh Sensor</button></div>
    <div className="filter-row">{["ALL","AVAILABLE","PARTIALLY_FULL","FULL_PRIORITY","CRITICAL"].map(x=><button className={filter===x?"filter active":"filter"} key={x} onClick={()=>setFilter(x)}>{x.replace("_"," ")}</button>)}</div>
    <div className="bin-layout"><div className="panel"><div className="table-wrap"><table><thead><tr><th>Bin</th><th>Location</th><th>Fill</th><th>Battery</th><th>Status</th></tr></thead><tbody>{visible.map(b=><tr className={selected?.bin_id===b.bin_id?"click-row selected": "click-row"} key={b.bin_id} onClick={()=>setSelected(b)}><td><b>{b.bin_id}</b></td><td>{b.name}</td><td>{b.fill_percent}%</td><td>{b.battery}%</td><td><StatusBadge status={b.status}/></td></tr>)}</tbody></table></div></div>
      {selected&&<div className="panel bin-detail"><div className="detail-top"><div><span className="muted">{selected.bin_id}</span><h2>{selected.name}</h2></div><StatusBadge status={selected.status}/></div>
        <div className="circle-wrap"><div className="fill-circle" style={{"--fill":`${selected.fill_percent*3.6}deg`}}><strong>{Math.round(selected.fill_percent)}%</strong><span>FILL LEVEL</span></div></div>
        <div className="health-grid"><div><Battery/><b>{selected.battery}%</b><span>Battery health</span></div><div><Wifi/><b>Online</b><span>Connectivity</span></div><div><Lock/><b>{selected.locked?"LOCKED":"UNLOCKED"}</b><span>Access state</span></div></div>
        <div className="detail-list"><div><span>GPS</span><b>{selected.latitude.toFixed(4)}, {selected.longitude.toFixed(4)}</b></div><div><span>Sensor distance</span><b>{selected.distance_cm} cm</b></div><div><span>Last telemetry</span><b>{new Date(selected.last_seen).toLocaleString()}</b></div></div>
        <div className="action-grid"><button className="secondary-btn" onClick={()=>act(()=>api.updateTelemetry(selected.bin_id,{fill_percent:Math.min(100,selected.fill_percent+10)}),"Fill increased")}>+ Increase Fill</button><button className="danger-btn" onClick={()=>act(()=>api.simulateCritical(selected.bin_id),"Critical alert generated")}>⚠ Simulate Critical</button><button className="secondary-btn" onClick={()=>act(()=>api.simulateLowBattery(selected.bin_id),"Low battery alert generated")}>Low Battery</button><button className="secondary-btn" onClick={()=>act(()=>api.simulateOffline(selected.bin_id),"Offline alert generated")}>Offline Sensor</button><button className="primary-btn full" onClick={()=>act(()=>api.resetBin(selected.bin_id),"Bin reset to AVAILABLE")}> <RotateCcw size={16}/> Reset Bin</button></div>
        <div className="manual"><Zap size={16}/><span><b>Manual override concept:</b> Authorized municipal staff can override software state during an emergency. No physical locking mechanism is implemented in this prototype.</span></div>
      </div>}</div>
  </div>
}
