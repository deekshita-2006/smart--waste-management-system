import { useEffect,useState } from "react";
import { BarChart3, Battery, Clock, Recycle, Route, Trash2 } from "lucide-react";
import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,PieChart,Pie,Cell } from "recharts";
import StatCard from "../components/StatCard";
import { api } from "../services/api";
export default function Analytics({notify}) {
 const [data,setData]=useState(null); useEffect(()=>{api.getAnalytics().then(setData).catch(e=>notify(e.message,"error"))},[]);
 if(!data)return <div className="loading">Loading analytics...</div>;
 const seg=Object.entries(data.segregation_distribution).map(([name,value])=>({name,value}));
 const fill=data.fill_trend.map(x=>({name:x.bin_id,fill:x.fill}));
 return <div><div className="page-heading"><div><div className="eyebrow">OPERATIONAL INTELLIGENCE</div><h1>Analytics</h1><p>Prototype metrics generated from the current database.</p></div></div>
 <div className="stats-grid six"><StatCard icon={Trash2} title="Overflow incidents" value={data.kpis.overflow_incidents}/><StatCard icon={Clock} title="Avg response (min)" value={data.kpis.average_alert_to_collection_minutes}/><StatCard icon={Route} title="Trips avoided" value={data.kpis.collection_trips_avoided}/><StatCard icon={BarChart3} title="Telemetry success" value={`${data.kpis.successful_telemetry_percent}%`}/><StatCard icon={Recycle} title="Completed collections" value={data.kpis.completed_collections}/><StatCard icon={Battery} title="Open maintenance" value={data.maintenance_open}/></div>
 <div className="chart-grid"><div className="panel chart-panel"><div className="panel-title"><div><h2>Bin Fill Trend</h2><p>Current simulated fill by bin</p></div></div><div className="chart"><ResponsiveContainer width="100%" height={280}><BarChart data={fill}><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="fill" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></div></div>
 <div className="panel chart-panel"><div className="panel-title"><div><h2>Segregation Distribution</h2><p>Recorded prototype samples</p></div></div><div className="chart"><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={seg} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label>{seg.map((_,i)=><Cell key={i}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div></div></div>
 </div>
}
