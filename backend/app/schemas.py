from pydantic import BaseModel, Field
from typing import Optional

class TelemetryIn(BaseModel):
    fill_percent: Optional[float] = Field(None, ge=0, le=100)
    distance_cm: Optional[float] = Field(None, ge=0)
    battery: Optional[float] = Field(None, ge=0, le=100)

class CollectionCreate(BaseModel):
    bin_id: str
    worker_id: Optional[int] = None
    vehicle_id: Optional[int] = None

class CollectionUpdate(BaseModel):
    action: str
    worker_id: Optional[int] = None
    vehicle_id: Optional[int] = None

class SegregationItem(BaseModel):
    item: str
    confidence: float = Field(ge=0, le=100)
    moisture: float = Field(ge=0, le=100)
    collection_id: Optional[int] = None

class MaintenanceCreate(BaseModel):
    bin_id: str
    issue: str
    priority: str = "MEDIUM"
    technician: Optional[str] = None
