import { useEffect,useState } from "react";
import { Play, CheckCircle2, UserRound } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { api } from "../services/api";
export default function Collections({notify}) {
 const [tasks,setTasks]=useState([]); const [workers,setWorkers]=useState([]);
 const load=async()=>{try{const [t,w]=await Promise.all([api.getCollections(),api.getWorkers()]);setTasks(t);setWorkers(w)}catch(e){notify(e.message,"error")}}; useEffect(()=>{load()},[]);
 const action=async(t,action)=>{try{let data={action};if(action==="assign")data={...data,worker_id:workers[0]?.id,vehicle_id:1};await api.updateCollection(t.task_id,data);await load();notify(action==="complete"?"Collection completed and bin reset":"Task updated")}catch(e){notify(e.message,"error")}};
 return <div><div className="page-heading"><div><div className="eyebrow">FIELD OPERATIONS</div><h1>Collection Tasks</h1><p>Assign, dispatch and complete priority waste collections.</p></div></div>
 <div className="task-grid">{tasks.map(t=><div className="task-card" key={t.task_id}><div className="task-head"><b>{t.task_id}</b><StatusBadge status={t.status}/></div><h3>{t.bin_id} · {t.location}</h3><div className="task-meta"><span>Fill <b>{t.fill_level}%</b></span><span>Priority <b>{t.priority}</b></span><span>Worker <b>{t.worker_name||"Unassigned"}</b></span></div><div className="task-actions">{t.status==="PENDING"&&<button className="primary-btn" onClick={()=>action(t,"assign")}><UserRound size={15}/> Assign Worker</button>}{t.status==="ASSIGNED"&&<button className="secondary-btn" onClick={()=>action(t,"start")}><Play size={15}/> Start Collection</button>}{t.status==="IN_PROGRESS"&&<button className="primary-btn" onClick={()=>action(t,"complete")}><CheckCircle2 size={15}/> Complete Collection</button>}{t.status==="COMPLETED"&&<span className="completed"><CheckCircle2 size={16}/> Completed</span>}</div></div>)}</div></div>
}
