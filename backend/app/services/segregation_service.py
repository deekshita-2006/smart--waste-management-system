from datetime import datetime, timezone
from ..database import get_db

def classify(item, confidence):
    mapping = {
        "Banana Peel": "WET / ORGANIC",
        "Plastic Bottle": "PLASTIC",
        "Newspaper": "PAPER",
        "Unknown Item": "REJECT / OTHER",
    }
    category = mapping.get(item, "REJECT / OTHER")
    if confidence < 80:
        category = "REJECT / OTHER"
    return category

def create_record(data):
    category = classify(data.item, data.confidence)
    result = "SORTED" if category != "REJECT / OTHER" else "REJECTED_TO_OTHER"
    ts = datetime.now(timezone.utc).isoformat()
    with get_db() as db:
        db.execute("""INSERT INTO segregation_records
          (collection_id,item,predicted_category,confidence,moisture,sorting_result,timestamp)
          VALUES(?,?,?,?,?,?,?)""",
          (data.collection_id,data.item,category,data.confidence,data.moisture,result,ts))
        r = db.execute("SELECT * FROM segregation_records ORDER BY id DESC LIMIT 1").fetchone()
        return dict(r)

def list_records():
    with get_db() as db:
        return [dict(r) for r in db.execute("SELECT * FROM segregation_records ORDER BY id DESC")]

def run_demo():
    samples = [
        ("Banana Peel",94,72),
        ("Plastic Bottle",91,18),
        ("Newspaper",88,12),
        ("Unknown Item",62,44),
    ]
    return [create_record(type("Obj",(),{"collection_id":None,"item":i,"confidence":c,"moisture":m})())
            for i,c,m in samples]
