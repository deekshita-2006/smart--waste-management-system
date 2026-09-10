from fastapi import APIRouter
from ..schemas import SegregationItem
from ..services.segregation_service import list_records,create_record,run_demo
router=APIRouter(prefix="/api/segregation",tags=["Segregation"])

@router.get("")
def records(): return list_records()

@router.post("")
def create(data:SegregationItem): return create_record(data)

@router.post("/demo")
def demo(): return run_demo()
