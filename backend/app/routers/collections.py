from fastapi import APIRouter,HTTPException
from ..schemas import CollectionCreate,CollectionUpdate
from ..services.collection_service import create_task,list_tasks,update_task

router=APIRouter(prefix="/api/collections",tags=["Collections"])

@router.get("")
def collections(): return list_tasks()

@router.post("")
def create(data:CollectionCreate):
    r=create_task(data.bin_id,data.worker_id,data.vehicle_id)
    if not r: raise HTTPException(404,"Bin not found")
    return r

@router.put("/{collection_id}")
def update(collection_id:str,data:CollectionUpdate):
    r=update_task(collection_id,data.action,data.worker_id,data.vehicle_id)
    if not r: raise HTTPException(404,"Task not found")
    return r
