from fastapi import APIRouter,HTTPException
from ..schemas import MaintenanceCreate
from ..database import get_db
from datetime import datetime,timezone

router=APIRouter(prefix="/api/maintenance",tags=["Maintenance"])

@router.get("")
def maintenance():
    with get_db() as db:
        return [dict(r) for r in db.execute("SELECT * FROM maintenance ORDER BY id DESC")]

@router.post("")
def create(data:MaintenanceCreate):
    with get_db() as db:
        db.execute("""INSERT INTO maintenance(bin_id,issue,opened_at,status,priority,technician)
                      VALUES(?,?,?,?,?,?)""",
                   (data.bin_id,data.issue,datetime.now(timezone.utc).isoformat(),"OPEN",
                    data.priority,data.technician))
        return dict(db.execute("SELECT * FROM maintenance ORDER BY id DESC LIMIT 1").fetchone())

@router.put("/{maintenance_id}/resolve")
def resolve(maintenance_id:int):
    with get_db() as db:
        db.execute("""UPDATE maintenance SET status='RESOLVED',resolved_at=? WHERE id=?""",
                   (datetime.now(timezone.utc).isoformat(),maintenance_id))
        r=db.execute("SELECT * FROM maintenance WHERE id=?",(maintenance_id,)).fetchone()
    if not r: raise HTTPException(404,"Maintenance record not found")
    return dict(r)
