from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .routers import bins,alerts,collections,users,segregation,analytics,maintenance

init_db()

app=FastAPI(title="Smart Waste Management API",version="1.0.0")

app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://smart-waste-management-system-9ktn.onrender.com",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bins.router)
app.include_router(alerts.router)
app.include_router(collections.router)
app.include_router(users.router)
app.include_router(segregation.router)
app.include_router(analytics.router)
app.include_router(maintenance.router)

@app.get("/")
def root():
    return {
        "name":"Smart Waste Management System",
        "tagline":"Detect. Monitor. Collect. Segregate. Verify.",
        "mode":"SIMULATION MODE"
    }

@app.get("/health")
def health(): return {"status":"ok"}
