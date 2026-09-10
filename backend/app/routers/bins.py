from fastapi import APIRouter, HTTPException
from ..schemas import TelemetryIn
from ..services.bin_service import get_all_bins,get_bin,update_bin_telemetry,reset_bin
from ..services.alert_service import create_alert_if_needed
from ..services.collection_service import create_task
import random

router = APIRouter(prefix="/api/bins", tags=["Bins"])

@router.get("")
def bins():
    return get_all_bins()

@router.get("/{bin_id}")
def bin_detail(bin_id: str):
    b = get_bin(bin_id)
    if not b: raise HTTPException(404,"Bin not found")
    return b

@router.post("/{bin_id}/telemetry")
def telemetry(bin_id: str, data: TelemetryIn):
    b = update_bin_telemetry(bin_id,data.fill_percent,data.distance_cm,data.battery)
    if not b: raise HTTPException(404,"Bin not found")
    if b["status"] == "CRITICAL":
        create_alert_if_needed(bin_id,"CRITICAL_BIN","CRITICAL")
        create_task(bin_id)
    elif b["status"] == "FULL_PRIORITY":
        create_alert_if_needed(bin_id,"FULL_BIN","HIGH")
        create_task(bin_id)
    if b["battery"] < 20:
        create_alert_if_needed(bin_id,"LOW_BATTERY","MEDIUM")
    return b

@router.post("/{bin_id}/reset")
def reset(bin_id: str):
    b = reset_bin(bin_id)
    if not b: raise HTTPException(404,"Bin not found")
    return b

@router.post("/{bin_id}/simulate-critical")
def critical(bin_id: str):
    return telemetry(bin_id,TelemetryIn(fill_percent=random.choice([95,97,99]),distance_cm=random.uniform(5,20)))

@router.post("/{bin_id}/simulate-low-battery")
def low_battery(bin_id: str):
    return telemetry(bin_id,TelemetryIn(battery=random.choice([10,15,18])))

@router.post("/{bin_id}/simulate-offline")
def offline(bin_id: str):
    b = get_bin(bin_id)
    if not b: raise HTTPException(404,"Bin not found")
    create_alert_if_needed(bin_id,"SENSOR_OFFLINE","HIGH")
    return {"message":"Offline sensor simulation created","bin":b}

@router.post("/reset-all")
def reset_all():
    for b in get_all_bins():
        reset_bin(b["bin_id"])
    return get_all_bins()
