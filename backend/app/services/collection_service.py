from datetime import datetime, timezone
from ..database import get_db
import uuid

def now():
    return datetime.now(timezone.utc).isoformat()

def priority_for_fill(fill):
    if fill >= 95: return "CRITICAL"
    if fill >= 90: return "HIGH"
    if fill >= 75: return "MEDIUM"
    return "LOW"

def create_task(bin_id, worker_id=None, vehicle_id=None):
    with get_db() as db:
        b = db.execute("SELECT * FROM bins WHERE bin_id=?", (bin_id,)).fetchone()
        if not b:
            return None
        existing = db.execute("""SELECT * FROM collections
                                 WHERE bin_id=? AND status!='COMPLETED'""",(bin_id,)).fetchone()
        if existing:
            return dict(existing)
        task_id = "CT-" + str(uuid.uuid4())[:8].upper()
        db.execute("""INSERT INTO collections
          (task_id,bin_id,worker_id,vehicle_id,priority,fill_level,location,created_at,status)
          VALUES(?,?,?,?,?,?,?,?,?)""",
          (task_id,bin_id,worker_id,vehicle_id,priority_for_fill(b["fill_percent"]),
           b["fill_percent"],b["name"],now(),"ASSIGNED" if worker_id else "PENDING"))
        if worker_id:
            db.execute("UPDATE workers SET status='ON_ROUTE' WHERE id=?", (worker_id,))
        return dict(db.execute("SELECT * FROM collections WHERE task_id=?", (task_id,)).fetchone())

def list_tasks():
    with get_db() as db:
        return [dict(r) for r in db.execute("""SELECT c.*,w.name AS worker_name,v.vehicle_id
          FROM collections c LEFT JOIN workers w ON c.worker_id=w.id
          LEFT JOIN vehicles v ON c.vehicle_id=v.id ORDER BY c.id DESC""")]

def update_task(task_id, action, worker_id=None, vehicle_id=None):
    with get_db() as db:
        t = db.execute("SELECT * FROM collections WHERE task_id=?", (task_id,)).fetchone()
        if not t:
            return None
        if action == "assign":
            db.execute("UPDATE collections SET worker_id=?,vehicle_id=?,status='ASSIGNED' WHERE task_id=?",
                       (worker_id,vehicle_id,task_id))
            if worker_id: db.execute("UPDATE workers SET status='ON_ROUTE' WHERE id=?", (worker_id,))
        elif action == "start":
            db.execute("UPDATE collections SET status='IN_PROGRESS',started_at=? WHERE task_id=?",
                       (now(),task_id))
        elif action == "complete":
            db.execute("""UPDATE collections SET status='COMPLETED',completed_at=? WHERE task_id=?""",
                       (now(),task_id))
            db.execute("""UPDATE bins SET fill_percent=0,status='AVAILABLE',locked=0,
                          distance_cm=100,last_seen=? WHERE bin_id=?""",(now(),t["bin_id"]))
            if t["worker_id"]:
                db.execute("UPDATE workers SET status='AVAILABLE' WHERE id=?", (t["worker_id"],))
            db.execute("""UPDATE alerts SET status='RESOLVED'
                          WHERE bin_id=? AND status IN ('OPEN','ACKNOWLEDGED')""",(t["bin_id"],))
        return dict(db.execute("SELECT * FROM collections WHERE task_id=?", (task_id,)).fetchone())
