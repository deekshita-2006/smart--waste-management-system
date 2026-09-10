# Smart Waste Management System

**Detect. Monitor. Collect. Segregate. Verify.**

A hackathon-ready prototype for municipal smart waste management. The MVP demonstrates smart-bin telemetry, status/lock logic, alerts, collection tasks, worker operations, controlled waste-segregation simulation, and analytics.

> **Prototype disclaimer:** This project uses simulation/mock data unless real hardware/API integrations are connected. It does not claim live city-wide IoT, GPS, AI classification, SMS, maps, or cloud connectivity.

## Architecture

Citizen / simulated ESP32 telemetry
→ FastAPI
→ SQLite
→ Municipal Dashboard
→ Alerts
→ Collection Task
→ Worker
→ Segregation
→ Analytics
→ Bin reset

## Stack

- React + Vite + JavaScript
- FastAPI + Pydantic
- SQLite
- Recharts
- Lucide React
- Optional Leaflet/OpenStreetMap integration is intentionally avoided in the MVP so the demo works without external map configuration.

## Folder Structure

```text
smart-waste-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   └── requirements.txt
└── README.md
```

## Backend setup

Open a terminal in `smart-waste-system/backend`.

Windows PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

If PowerShell blocks activation, use:

```powershell
.venv\Scripts\activate.bat
```

Backend:
- API: http://127.0.0.1:8000
- Swagger: http://127.0.0.1:8000/docs

The SQLite database is created automatically.

## Frontend setup

Open a second terminal in `smart-waste-system/frontend`.

```powershell
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally:

http://localhost:5173

## Demo

1. Open **Dashboard**.
2. Open **Live Bins**.
3. Select a bin.
4. Click **Simulate Critical Level**.
5. Confirm the bin becomes CRITICAL, locked, and an alert/task is generated.
6. Open **Alerts** and acknowledge/resolve as appropriate.
7. Open **Collection Tasks**.
8. Assign a worker, start the collection, then complete it.
9. Open **Segregation** and run the controlled sample simulation.
10. Open **Analytics** to see the operational data.
11. Use **Run Complete Demo** from the dashboard for the guided flow.

## API

- `GET /api/bins`
- `GET /api/bins/{bin_id}`
- `POST /api/bins/{bin_id}/telemetry`
- `POST /api/bins/{bin_id}/reset`
- `POST /api/bins/{bin_id}/simulate-critical`
- `POST /api/bins/{bin_id}/simulate-low-battery`
- `POST /api/bins/{bin_id}/simulate-offline`
- `POST /api/bins/reset-all`
- `GET /api/alerts`
- `POST /api/alerts/{alert_id}/acknowledge`
- `POST /api/alerts/{alert_id}/resolve`
- `GET /api/collections`
- `POST /api/collections`
- `PUT /api/collections/{collection_id}`
- `GET /api/workers`
- `GET /api/segregation`
- `POST /api/segregation`
- `GET /api/analytics`
- `GET /api/maintenance`
- `POST /api/maintenance`
- `PUT /api/maintenance/{maintenance_id}/resolve`

## Limitations

- Mock coordinates are used for the prototype map.
- Sensor values are simulated.
- Segregation uses controlled sample items and confidence thresholds; it is not a general-purpose AI waste classifier.
- Authentication is prototype-ready but not a production identity system.
- No unsafe physical lock mechanism is implemented.
- Satellite/GIS waste hotspot analysis is future scope, not core MVP.

## Suggested SIH demo narration

**Detect:** A bin reports increasing fill level.

**Monitor:** The municipal dashboard shows its live status.

**Alert:** At the critical threshold, an alert is created.

**Restrict:** The software prototype displays the lock/restrictor as active.

**Collect:** A collection task is generated and assigned to a worker.

**Verify:** The worker completes the collection.

**Segregate:** Controlled sample items are categorized with confidence.

**Analyze:** Collection, overflow, response, battery and segregation metrics update.

**Reset:** The bin returns to AVAILABLE.
