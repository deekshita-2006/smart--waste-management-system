const API_BASE = "http://127.0.0.1:8000/api";

async function request(path, options={}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {"Content-Type":"application/json"},
    ...options
  });
  if (!response.ok) {
    let detail = "API request failed";
    try { const body = await response.json(); detail = body.detail || detail; } catch {}
    throw new Error(detail);
  }
  return response.json();
}

export const api = {
  getBins: () => request("/bins"),
  getBin: (id) => request(`/bins/${id}`),
  updateTelemetry: (id, data) => request(`/bins/${id}/telemetry`, {method:"POST",body:JSON.stringify(data)}),
  simulateCritical: (id) => request(`/bins/${id}/simulate-critical`, {method:"POST"}),
  simulateLowBattery: (id) => request(`/bins/${id}/simulate-low-battery`, {method:"POST"}),
  simulateOffline: (id) => request(`/bins/${id}/simulate-offline`, {method:"POST"}),
  resetBin: (id) => request(`/bins/${id}/reset`, {method:"POST"}),
  resetAll: () => request("/bins/reset-all",{method:"POST"}),
  getAlerts: () => request("/alerts"),
  acknowledgeAlert: (id) => request(`/alerts/${id}/acknowledge`,{method:"POST"}),
  resolveAlert: (id) => request(`/alerts/${id}/resolve`,{method:"POST"}),
  assignAlert: (id) => request(`/alerts/${id}/assign`,{method:"POST"}),
  getCollections: () => request("/collections"),
  createCollection: (data) => request("/collections",{method:"POST",body:JSON.stringify(data)}),
  updateCollection: (id,data) => request(`/collections/${id}`,{method:"PUT",body:JSON.stringify(data)}),
  getWorkers: () => request("/workers"),
  getSegregation: () => request("/segregation"),
  runSegregationDemo: () => request("/segregation/demo",{method:"POST"}),
  getAnalytics: () => request("/analytics"),
  getMaintenance: () => request("/maintenance"),
  createMaintenance: (data) => request("/maintenance",{method:"POST",body:JSON.stringify(data)}),
  resolveMaintenance: (id) => request(`/maintenance/${id}/resolve`,{method:"PUT"})
};
