from datetime import datetime, timezone
from ..database import get_db
import uuid

def now():
    return datetime.now(timezone.utc).isoformat()

def create_alert_if_needed(bin_id, alert_type, severity):
    with get_db() as db:
        existing = db.execute("""SELECT * FROM alerts
                                 WHERE bin_id=? AND type=? AND status IN ('OPEN','ACKNOWLEDGED')""",
                               (bin_id,alert_type)).fetchone()
        if existing:
            return dict(existing)
        alert_id = "AL-" + str(uuid.uuid4())[:8].upper()
        db.execute("""INSERT INTO alerts(alert_id,bin_id,type,severity,created_at,status)
                      VALUES(?,?,?,?,?,?)""",
                   (alert_id,bin_id,alert_type,severity,now(),"OPEN"))
        return dict(db.execute("SELECT * FROM alerts WHERE alert_id=?", (alert_id,)).fetchone())

def list_alerts():
    with get_db() as db:
        return [dict(r) for r in db.execute("SELECT * FROM alerts ORDER BY id DESC")]

def set_alert_status(alert_id, status):
    with get_db() as db:
        db.execute("UPDATE alerts SET status=? WHERE alert_id=?", (status,alert_id))
        r = db.execute("SELECT * FROM alerts WHERE alert_id=?", (alert_id,)).fetchone()
        return dict(r) if r else None
