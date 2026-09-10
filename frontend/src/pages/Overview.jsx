import { useEffect, useState } from "react";
import { Activity, Battery, CheckCircle2, CircleAlert, Clock3, Route, Trash2, Zap } from "lucide-react";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { api } from "../services/api";

export default function Overview({notify,onNavigate}) {
  const [bins,setBins]=useState([]); const [alerts,setAlerts]=useState([]); const [collections,setCollections]=useState([]);
  const [running,setRunning]=useState(false);
  const refresh=async()=>{try{const [b,a,c]=await Promise.all([api.getBins(),api.getAlerts(),api.getCollections()]);setBins(b);setAlerts(a);setCollections(c)}catch{}};
  useEffect(()=>{refresh()},[]);
  const critical=bins.filter(b=>b.status==="CRITICAL").length;
  const partial=bins.filter(b=>b.status==="PARTIALLY_FULL").length;
  const full=bins.filter(b=>b.status==="FULL_PRIORITY").length;
  const available=bins.filter(b=>b.status==="AVAILABLE").length;
  const pending=collections.filter(c=>c.status!=="COMPLETED").length;
  const runDemo=async()=>{
    setRunning(true); notify("Complete demo started");
    try {
      const target=bins.find(b=>b.status==="AVAILABLE")||bins[0];
      await api.updateTelemetry(target.bin_id,{fill_percent:65});
      await new Promise(r=>setTimeout(r,700));
      await api.updateTelemetry(target.bin_id,{fill_percent:92});
      await new Promise(r=>setTimeout(r,700));
      await api.simulateCritical(target.bin_id);
      await new Promise(r=>setTimeout(r,700));
      const tasks=await api.getCollections(); const task=tasks.find(t=>t.bin_id===target.bin_id && t.status!=="COMPLETED");
      if(task){ await api.updateCollection(task.task_id,{action:"assign",worker_id:1,vehicle_id:1}); await api.updateCollection(task.task_id,{action:"start"}); await new Promise(r=>setTimeout(r,500)); await api.updateCollection(task.task_id,{action:"complete"});}
      await api.runSegregationDemo(); await refresh(); notify("Complete demo finished: bin reset and segregation recorded");
    } catch(e){notify(e.message,"error")} finally{setRunning(false)}
  };
  return <div>
    <div className="page-heading"><div><div className="eyebrow">MUNICIPAL OPERATIONS</div><h1>Smart Waste Command Center</h1><p>Monitor connected bins, prioritize collection and verify the waste journey.</p></div><button className="primary-btn" onClick={runDemo} disabled={running}><Zap size={17}/>{running?"Running demo...":"Run Complete Demo"}</button></div>
    <div className="notice"><Activity size={18}/><span><b>Simulation Mode active.</b> Values are prototype data and are not live city-wide telemetry.</span></div>
    <div className="stats-grid">
      <StatCard icon={Trash2} title="Total Bins" value={bins.length}/>
      <StatCard icon={CheckCircle2} title="Available" value={available}/>
      <StatCard icon={Clock3} title="Partially Full" value={partial}/>
      <StatCard icon={CircleAlert} title="Full / Priority" value={full}/>
      <StatCard icon={CircleAlert} title="Critical" value={critical}/>
      <StatCard icon={BellIcon} title="Active Alerts" value={alerts.filter(a=>a.status!=="RESOLVED").length}/>
      <StatCard icon={Route} title="Pending Collections" value={pending}/>
      <StatCard icon={CheckCircle2} title="Today's Collections" value={collections.filter(c=>c.status==="COMPLETED").length}/>
    </div>
    <div className="two-col">
      <div className="panel"><div className="panel-title"><div><h2>Priority bins</h2><p>Highest operational attention first</p></div><button className="text-btn" onClick={()=>onNavigate("bins")}>View all</button></div>
        <div className="table-wrap"><table><thead><tr><th>Bin</th><th>Location</th><th>Fill</th><th>Status</th></tr></thead><tbody>
        {bins.filter(b=>b.status!=="AVAILABLE").sort((a,b)=>b.fill_percent-a.fill_percent).slice(0,5).map(b=><tr key={b.bin_id}><td><b>{b.bin_id}</b></td><td>{b.name}</td><td><div className="bar"><span style={{width:`${b.fill_percent}%`}}/></div>{b.fill_percent}%</td><td><StatusBadge status={b.status}/></td></tr>)}</tbody></table></div>
      </div>
      <div className="panel journey"><div className="panel-title"><div><h2>Waste journey</h2><p>End-to-end prototype flow</p></div></div>
        {["DETECT","MONITOR","ALERT","COLLECT","SEGREGATE","VERIFY","ANALYZE"].map((x,i)=><div className="journey-step" key={x}><span>{i+1}</span><b>{x}</b>{i<6&&<small>→</small>}</div>)}
      </div>
    </div>
  </div>
}
function BellIcon(){return <CircleAlert/>}
