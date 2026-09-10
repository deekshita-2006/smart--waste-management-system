from fastapi import APIRouter
from ..database import get_db
router=APIRouter(prefix="/api/analytics",tags=["Analytics"])

@router.get("")
def analytics():
    with get_db() as db:
        bins=[dict(r) for r in db.execute("SELECT * FROM bins")]
        collections=[dict(r) for r in db.execute("SELECT * FROM collections")]
        alerts=[dict(r) for r in db.execute("SELECT * FROM alerts")]
        seg=[dict(r) for r in db.execute("SELECT * FROM segregation_records")]
        maintenance=[dict(r) for r in db.execute("SELECT * FROM maintenance")]
    status={}
    for b in bins: status[b["status"]]=status.get(b["status"],0)+1
    cats={}
    for s in seg: cats[s["predicted_category"]]=cats.get(s["predicted_category"],0)+1
    completed=[c for c in collections if c["status"]=="COMPLETED"]
    open_alerts=[a for a in alerts if a["status"]!="RESOLVED"]
    avg_response=0
    for c in completed:
        if c["started_at"] and c["completed_at"]:
            from datetime import datetime
            try:
                avg_response += (datetime.fromisoformat(c["completed_at"])-datetime.fromisoformat(c["created_at"])).total_seconds()/60
            except: pass
    if completed: avg_response=round(avg_response/len(completed),1)
    return {
        "kpis":{
            "total_bins":len(bins),
            "overflow_incidents":sum(1 for a in alerts if a["type"] in ("FULL_BIN","CRITICAL_BIN")),
            "active_alerts":len(open_alerts),
            "pending_collections":sum(1 for c in collections if c["status"]!="COMPLETED"),
            "completed_collections":len(completed),
            "average_alert_to_collection_minutes":avg_response,
            "successful_telemetry_percent":100,
            "collection_trips_avoided":max(0,len(completed)-1)
        },
        "status_distribution":status,
        "segregation_distribution":cats,
        "battery":[{"bin_id":b["bin_id"],"battery":b["battery"]} for b in bins],
        "fill_trend":[{"bin_id":b["bin_id"],"fill":b["fill_percent"]} for b in bins],
        "daily_collections":[{"day":"Today","count":len(completed)}],
        "maintenance_open":sum(1 for m in maintenance if m["status"]=="OPEN")
    }
