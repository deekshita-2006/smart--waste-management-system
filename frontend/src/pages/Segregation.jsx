import { useEffect,useState } from "react";
import { Play, Recycle } from "lucide-react";
import { api } from "../services/api";
export default function Segregation({notify}) {
 const [records,setRecords]=useState([]); const load=()=>api.getSegregation().then(setRecords).catch(e=>notify(e.message,"error")); useEffect(load,[]);
 const demo=async()=>{try{await api.runSegregationDemo();load();notify("Segregation batch completed")}catch(e){notify(e.message,"error")}};
 return <div><div className="page-heading"><div><div className="eyebrow">CONTROLLED SAMPLE SORTING</div><h1>Smart Segregation</h1><p>Prototype conveyor simulation using known sample items and a confidence threshold.</p></div><button className="primary-btn" onClick={demo}><Play size={16}/> Run Sorting Simulation</button></div>
 <div className="notice"><Recycle size={18}/><span>Confidence ≥ 80% is classified. Lower-confidence or unknown samples are sent to <b>REJECT / OTHER</b>. This is not a claim of perfect AI classification.</span></div>
 <div className="conveyor"><div className="conveyor-line"/>{["Banana Peel","Plastic Bottle","Newspaper","Unknown Item"].map((x,i)=><div className="waste-item" key={x} style={{animationDelay:`${i*.3}s`}}><span>{["🍌","🧴","📰","❔"][i]}</span><small>{x}</small></div>)}</div>
 <div className="panel"><div className="table-wrap"><table><thead><tr><th>Item</th><th>Predicted Category</th><th>Confidence</th><th>Moisture</th><th>Result</th><th>Timestamp</th></tr></thead><tbody>{records.map(r=><tr key={r.id}><td><b>{r.item}</b></td><td>{r.predicted_category}</td><td>{r.confidence}%</td><td>{r.moisture}%</td><td>{r.sorting_result}</td><td>{new Date(r.timestamp).toLocaleString()}</td></tr>)}</tbody></table></div></div></div>
}
