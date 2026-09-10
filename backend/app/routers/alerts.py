from fastapi import APIRouter,HTTPException
from ..services.alert_service import list_alerts,set_alert_status
from ..services.collection_service import create_task

router=APIRouter(prefix="/api/alerts",tags=["Alerts"])

@router.get("")
def alerts(): return list_alerts()

@router.post("/{alert_id}/acknowledge")
def acknowledge(alert_id:str):
    r=set_alert_status(alert_id,"ACKNOWLEDGED")
    if not r: raise HTTPException(404,"Alert not found")
    return r

@router.post("/{alert_id}/resolve")
def resolve(alert_id:str):
    r=set_alert_status(alert_id,"RESOLVED")
    if not r: raise HTTPException(404,"Alert not found")
    return r

@router.post("/{alert_id}/assign")
def assign(alert_id:str):
    from ..database import get_db
    with get_db() as db:
        a=db.execute("SELECT * FROM alerts WHERE alert_id=?",(alert_id,)).fetchone()
    if not a: raise HTTPException(404,"Alert not found")
    return create_task(a["bin_id"])
