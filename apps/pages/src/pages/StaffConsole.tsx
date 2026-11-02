import { FormEvent, useState } from "react";
import "./StaffConsole.css";

type ActiveTab = "console" | "network" | "simulation";

const initialLogs = [
  "System: Portal-OS1 Edge Substrate Initialized.",
  "Staff Login Verified: Max Jurreau (Identity Hash: bba28add4f99bd9aae158f173168145d)",
  "Internet Traversal Gateway: ACTIVE ($0.00/mo Cloudflare Worker Proxy)",
];

export default function StaffConsole() {
  const [isAuthenticated] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("console");
  const [queryInput, setQueryInput] = useState("");
  const [outputLog, setOutputLog] = useState<string[]>(initialLogs);

  const handleExecute = (event: FormEvent) => {
    event.preventDefault();
    if (!queryInput.trim()) return;

    setOutputLog((previous) => [
      `> [STAFF QUERY]: ${queryInput}`,
      "> [GATEWAY]: Fetching via secure edge proxy...",
      "> [SUCCESS]: Result synthesized across BEMAX invariant manifold.",
      ...previous,
    ]);
    setQueryInput("");
  };

  return (
    <div className="staff-console-page">
      <header className="staff-console-header">
        <div className="staff-console-branding">
          <span className="staff-console-indicator" aria-hidden="true" />
          <span className="staff-console-brand">OUR umbrella™ // PORTAL-OS1</span>
        </div>

        <div className="staff-console-meta">
          <span>MODE: STAFF GATEWAY</span>
          <span>BURN: $0.00/mo</span>
          <span className="staff-console-auth-state">
            {isAuthenticated ? "STATUS: AUTHENTICATED" : "STATUS: OFFLINE"}
          </span>
          <span className="staff-console-id">ID: bba28add...</span>
        </div>
      </header>

      <div className="staff-console-workspace">
        <nav className="staff-console-nav" aria-label="Staff console tabs">
          <button
            type="button"
            onClick={() => setActiveTab("console")}
            className={activeTab === "console" ? "staff-console-tab active" : "staff-console-tab"}
          >
            [01] Staff Terminal &amp; Net
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("network")}
            className={activeTab === "network" ? "staff-console-tab active" : "staff-console-tab"}
          >
            [02] Node &amp; Protocol Mesh
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("simulation")}
            className={activeTab === "simulation" ? "staff-console-tab active" : "staff-console-tab"}
          >
            [03] MAX-FORCE Simulation HUD
          </button>
        </nav>

        <main className="staff-console-main">
          {activeTab === "console" && (
            <div className="staff-console-panel">
              <h2>Secure Staff Internet Gateway &amp; Command Line</h2>

              <div className="staff-console-output" aria-live="polite">
                {outputLog.map((log, index) => (
                  <div
                    key={`${log}-${index}`}
                    className={log.startsWith(">") ? "staff-console-log staff-console-log-success" : "staff-console-log"}
                  >
                    {log}
                  </div>
                ))}
              </div>

              <form onSubmit={handleExecute} className="staff-console-form">
                <input
                  type="text"
                  value={queryInput}
                  onChange={(event) => setQueryInput(event.target.value)}
                  placeholder="Enter URL, query, or runtime instruction via staff login..."
                  aria-label="Staff query"
                />
                <button type="submit" className="staff-console-submit">
                  EXECUTE
                </button>
              </form>
            </div>
          )}

          {activeTab === "network" && (
            <div className="staff-console-panel network-panel">
              <h2>Active Edge Node Topology</h2>

              <div className="staff-console-card-grid">
                <div className="staff-console-card">
                  <p className="staff-console-card-title">Cloudflare Edge Worker</p>
                  <p className="staff-console-card-subtitle">Status: Active (Global Proxy)</p>
                </div>
                <div className="staff-console-card">
                  <p className="staff-console-card-title">D1 SQL State Grid</p>
                  <p className="staff-console-card-subtitle">Status: Synchronized (0.0 Drift)</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "simulation" && (
            <div className="staff-console-panel simulation-panel">
              <h2>PATH-B / MAX-FORCE 1Hz Tick HUD</h2>

              <div className="staff-console-simulation-box">
                <div>
                  <p className="staff-console-small-label">Current Simulation State</p>
                  <p className="staff-console-state">Deterministic Grid [Stable]</p>
                </div>
                <div className="staff-console-tick">
                  <p className="staff-console-small-label">Tick Frequency</p>
                  <p className="staff-console-value">1.0 Hz</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
