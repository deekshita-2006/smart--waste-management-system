import { useEffect,useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { api } from "../services/api";
export default function MapPage({notify}) {
 const [bins,setBins]=useState([]); const [filter,setFilter]=useState("ALL");
 useEffect(()=>{api.getBins().then(setBins).catch(e=>notify(e.message,"error"))},[]);
 const visible=bins.filter(b=>filter==="ALL"||b.status===filter);
 return <div><div className="page-heading"><div><div className="eyebrow">GIS SIMULATION</div><h1>Smart Bin Map</h1><p>Fixed prototype coordinates are shown for demonstration; this is not live GPS tracking.</p></div></div>
 <div className="filter-row">{["ALL","AVAILABLE","PARTIALLY_FULL","FULL_PRIORITY","CRITICAL"].map(x=><button className={filter===x?"filter active":"filter"} key={x} onClick={()=>setFilter(x)}>{x.replace("_"," ")}</button>)}</div>
 <div className="map-layout"><div className="fake-map">{visible.map((b,i)=><div key={b.bin_id} className={`map-marker marker-${b.status.toLowerCase()}`} style={{left:`${15+(i%3)*30}%`,top:`${18+Math.floor(i/3)*45}%`}} title={b.name}><span>{b.bin_id.replace("BIN-","")}</span></div>)}<div className="map-label">SIMULATION MAP · FIXED PROTOTYPE COORDINATES</div></div><div className="panel"><h2>Bin locations</h2>{visible.map(b=><div className="location-row" key={b.bin_id}><div><b>{b.bin_id}</b><span>{b.name}</span></div><StatusBadge status={b.status}/></div>)}</div></div></div>
}
