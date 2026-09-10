from fastapi import APIRouter
from ..database import get_db
router=APIRouter(prefix="/api",tags=["Users"])

@router.get("/workers")
def workers():
    with get_db() as db:
        return [dict(r) for r in db.execute("SELECT * FROM workers ORDER BY id")]
