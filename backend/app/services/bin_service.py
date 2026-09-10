from datetime import datetime, timezone
from . import __init__
from ..database import get_db
from ..models import calculate_status, STATUS_CRITICAL

def now():
    return datetime.now(timezone.utc).isoformat()

def row_to_dict(row):
    d = dict(row)
    d["locked"] = bool(d["locked"])
    return d

def get_all_bins():
    with get_db() as db:
        return [row_to_dict(r) for r in db.execute("SELECT * FROM bins ORDER BY bin_id")]

def get_bin(bin_id):
    with get_db() as db:
        r = db.execute("SELECT * FROM bins WHERE bin_id=?", (bin_id,)).fetchone()
        return row_to_dict(r) if r else None

def update_bin_telemetry(bin_id, fill_percent=None, distance_cm=None, battery=None):
    with get_db() as db:
        r = db.execute("SELECT * FROM bins WHERE bin_id=?", (bin_id,)).fetchone()
        if not r:
            return None
        fill = float(r["fill_percent"] if fill_percent is None else fill_percent)
        dist = float(r["distance_cm"] if distance_cm is None else distance_cm)
        bat = float(r["battery"] if battery is None else battery)
        status = calculate_status(fill)
        locked = status == STATUS_CRITICAL
        ts = now()
        db.execute("""UPDATE bins SET fill_percent=?,distance_cm=?,battery=?,status=?,locked=?,last_seen=?
                      WHERE bin_id=?""",
                   (fill, dist, bat, status, int(locked), ts, bin_id))
        db.execute("""INSERT INTO sensor_readings(bin_id,timestamp,distance_cm,fill_percent)
                      VALUES(?,?,?,?)""", (bin_id,ts,dist,fill))
        return get_bin(bin_id)

def reset_bin(bin_id):
    return update_bin_telemetry(bin_id, 0, 100, None)
