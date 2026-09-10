import { useState } from "react";
import { ShieldCheck } from "lucide-react";

import Landing from "./pages/Landing";
import DashboardLayout from "./layouts/DashboardLayout";
import Overview from "./pages/Overview";
import Bins from "./pages/Bins";
import Alerts from "./pages/Alerts";
import Collections from "./pages/Collections";
import Workers from "./pages/Workers";
import Segregation from "./pages/Segregation";
import Analytics from "./pages/Analytics";
import MapPage from "./pages/MapPage";
import Maintenance from "./pages/Maintenance";
import Citizen from "./pages/Citizen";

export default function App() {
  // IMPORTANT:
  // All hooks must be declared before any conditional return.
  const [entered, setEntered] = useState(false);
  const [page, setPage] = useState("overview");
  const [toasts, setToasts] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const notify = (message, type = "success") => {
    const id = Date.now();

    setToasts((currentToasts) => [
      ...currentToasts,
      {
        id,
        message,
        type,
      },
    ]);

    setTimeout(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.id !== id)
      );
    }, 3500);
  };

  // Landing page
  if (!entered) {
    return (
      <>
        <Landing enter={() => setEntered(true)} />
        <ToastStack toasts={toasts} />
      </>
    );
  }

  // Dashboard pages
  const screen = {
    overview: (
      <Overview
        notify={notify}
        onNavigate={setPage}
      />
    ),

    bins: (
      <Bins
        notify={notify}
      />
    ),

    map: (
      <MapPage
        notify={notify}
      />
    ),

    alerts: (
      <Alerts
        notify={notify}
      />
    ),

    collections: (
      <Collections
        notify={notify}
      />
    ),

    workers: (
      <Workers
        notify={notify}
      />
    ),

    segregation: (
      <Segregation
        notify={notify}
      />
    ),

    analytics: (
      <Analytics
        notify={notify}
      />
    ),

    maintenance: (
      <Maintenance
        notify={notify}
      />
    ),

    settings: (
      <SettingsPage
        notify={notify}
      />
    ),

    citizen: (
      <Citizen
        notify={notify}
      />
    ),
  }[page] || (
    <Overview
      notify={notify}
      onNavigate={setPage}
    />
  );

  return (
    <>
      <DashboardLayout
        page={page}
        setPage={setPage}
        alerts={alerts}
      >
        {screen}
      </DashboardLayout>

      <div className="role-switch">
        <button onClick={() => setPage("citizen")}>
          Citizen View
        </button>

        <button onClick={() => setPage("overview")}>
          <ShieldCheck size={14} />
          Municipal
        </button>
      </div>

      <ToastStack toasts={toasts} />
    </>
  );
}


// ----------------------------------------
// SETTINGS PAGE
// ----------------------------------------

function SettingsPage({ notify }) {
  return (
    <div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            SYSTEM CONFIGURATION
          </div>

          <h1>Settings</h1>

          <p>
            Prototype settings and operating rules.
          </p>
        </div>
      </div>

      <div className="settings-grid">

        <div className="panel">
          <h2>Bin status thresholds</h2>

          <div className="setting">
            <span>AVAILABLE</span>
            <b>&lt; 60%</b>
          </div>

          <div className="setting">
            <span>PARTIALLY FULL</span>
            <b>60–89%</b>
          </div>

          <div className="setting">
            <span>FULL / PRIORITY</span>
            <b>90–94%</b>
          </div>

          <div className="setting">
            <span>CRITICAL</span>
            <b>≥ 95%</b>
          </div>
        </div>


        <div className="panel">
          <h2>Prototype authentication</h2>

          <p>
            Roles: ADMIN · WORKER · CITIZEN
          </p>

          <p className="muted">
            Mock role navigation is used for this MVP.
            Production authentication should use secure
            password hashing and token/session controls.
          </p>
        </div>

      </div>
    </div>
  );
}


// ----------------------------------------
// TOAST NOTIFICATIONS
// ----------------------------------------

function ToastStack({ toasts }) {
  return (
    <div className="toasts">
      {toasts.map((toast) => (
        <div
          className={`toast ${toast.type}`}
          key={toast.id}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}