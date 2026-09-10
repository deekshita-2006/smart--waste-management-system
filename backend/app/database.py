import sqlite3
from pathlib import Path
from contextlib import contextmanager

DB_PATH = Path(__file__).resolve().parent.parent / "smart_waste.db"

@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()

def init_db():
    with get_db() as db:
        db.executescript("""
        CREATE TABLE IF NOT EXISTS bins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bin_id TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            fill_percent REAL NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'AVAILABLE',
            locked INTEGER NOT NULL DEFAULT 0,
            battery REAL NOT NULL DEFAULT 100,
            last_seen TEXT NOT NULL,
            distance_cm REAL NOT NULL DEFAULT 100
        );

        CREATE TABLE IF NOT EXISTS sensor_readings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bin_id TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            distance_cm REAL NOT NULL,
            fill_percent REAL NOT NULL,
            FOREIGN KEY(bin_id) REFERENCES bins(bin_id)
        );

        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS workers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            status TEXT NOT NULL DEFAULT 'AVAILABLE'
        );

        CREATE TABLE IF NOT EXISTS vehicles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vehicle_id TEXT UNIQUE NOT NULL,
            plate TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'AVAILABLE'
        );

        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            alert_id TEXT UNIQUE NOT NULL,
            bin_id TEXT NOT NULL,
            type TEXT NOT NULL,
            severity TEXT NOT NULL,
            created_at TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'OPEN',
            FOREIGN KEY(bin_id) REFERENCES bins(bin_id)
        );

        CREATE TABLE IF NOT EXISTS collections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id TEXT UNIQUE NOT NULL,
            bin_id TEXT NOT NULL,
            worker_id INTEGER,
            vehicle_id INTEGER,
            priority TEXT NOT NULL,
            fill_level REAL NOT NULL,
            location TEXT NOT NULL,
            created_at TEXT NOT NULL,
            started_at TEXT,
            completed_at TEXT,
            status TEXT NOT NULL DEFAULT 'PENDING',
            FOREIGN KEY(bin_id) REFERENCES bins(bin_id),
            FOREIGN KEY(worker_id) REFERENCES workers(id),
            FOREIGN KEY(vehicle_id) REFERENCES vehicles(id)
        );

        CREATE TABLE IF NOT EXISTS segregation_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            collection_id INTEGER,
            item TEXT NOT NULL,
            predicted_category TEXT NOT NULL,
            confidence REAL NOT NULL,
            moisture REAL NOT NULL,
            sorting_result TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            FOREIGN KEY(collection_id) REFERENCES collections(id)
        );

        CREATE TABLE IF NOT EXISTS maintenance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bin_id TEXT NOT NULL,
            issue TEXT NOT NULL,
            opened_at TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'OPEN',
            priority TEXT NOT NULL DEFAULT 'MEDIUM',
            technician TEXT,
            resolved_at TEXT,
            FOREIGN KEY(bin_id) REFERENCES bins(bin_id)
        );
        """)

        count = db.execute("SELECT COUNT(*) AS c FROM bins").fetchone()["c"]
        if count == 0:
            from datetime import datetime, timezone
            now = datetime.now(timezone.utc).isoformat()
            seed = [
                ("BIN-001","Central Market",17.3850,78.4867,35,"AVAILABLE",0,92,now,130),
                ("BIN-002","City Library",17.3910,78.4810,67,"PARTIALLY_FULL",0,88,now,70),
                ("BIN-003","Bus Terminal",17.3740,78.4740,92,"FULL_PRIORITY",1,76,now,30),
                ("BIN-004","Community Park",17.4000,78.4900,97,"CRITICAL",1,64,now,15),
                ("BIN-005","School Zone",17.3780,78.4920,51,"AVAILABLE",0,81,now,90),
                ("BIN-006","Hospital Road",17.3690,78.4860,84,"PARTIALLY_FULL",0,54,now,45),
            ]
            db.executemany("""INSERT INTO bins
                (bin_id,name,latitude,longitude,fill_percent,status,locked,battery,last_seen,distance_cm)
                VALUES (?,?,?,?,?,?,?,?,?,?)""", seed)

        if db.execute("SELECT COUNT(*) AS c FROM workers").fetchone()["c"] == 0:
            db.executemany("INSERT INTO workers(name,phone,status) VALUES(?,?,?)", [
                ("Anil Kumar","+91 90000 10001","AVAILABLE"),
                ("Ravi Teja","+91 90000 10002","AVAILABLE"),
                ("Suresh Babu","+91 90000 10003","ON_ROUTE"),
            ])

        if db.execute("SELECT COUNT(*) AS c FROM vehicles").fetchone()["c"] == 0:
            db.executemany("INSERT INTO vehicles(vehicle_id,plate,status) VALUES(?,?,?)", [
                ("VH-01","TS 09 AB 1201","AVAILABLE"),
                ("VH-02","TS 09 CD 2302","AVAILABLE"),
            ])

        # Seed one alert/task only if the corresponding critical bin has no records.
        alert_exists = db.execute("SELECT 1 FROM alerts WHERE bin_id='BIN-004' AND status='OPEN'").fetchone()
        if not alert_exists:
            db.execute("""INSERT INTO alerts(alert_id,bin_id,type,severity,created_at,status)
                          VALUES(?,?,?,?,?,?)""",
                       ("AL-1001","BIN-004","CRITICAL_BIN","CRITICAL",now,"OPEN"))
        task_exists = db.execute("SELECT 1 FROM collections WHERE bin_id='BIN-004' AND status!='COMPLETED'").fetchone()
        if not task_exists:
            db.execute("""INSERT INTO collections(task_id,bin_id,priority,fill_level,location,created_at,status)
                          VALUES(?,?,?,?,?,?,?)""",
                       ("CT-102","BIN-004","CRITICAL",97,"Community Park",now,"PENDING"))
