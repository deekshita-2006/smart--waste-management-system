STATUS_AVAILABLE = "AVAILABLE"
STATUS_PARTIAL = "PARTIALLY_FULL"
STATUS_FULL = "FULL_PRIORITY"
STATUS_CRITICAL = "CRITICAL"
CRITICAL_THRESHOLD = 95.0

def calculate_status(fill_percent: float):
    if fill_percent >= CRITICAL_THRESHOLD:
        return STATUS_CRITICAL
    if fill_percent >= 90:
        return STATUS_FULL
    if fill_percent >= 60:
        return STATUS_PARTIAL
    return STATUS_AVAILABLE
