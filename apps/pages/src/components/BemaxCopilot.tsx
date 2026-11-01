"use client";

import { useMemo, useState } from "react";

const commandSamples = [
  "Show Revenue",
  "Show Churn",
  "Prediction Accuracy",
  "Run Simulation",
  "Find Top Teams",
  "Find Most Active Users",
  "Generate Draft Report",
  "Generate Injury Report",
  "Show Infrastructure Costs",
];

export function BemaxCopilot() {
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState(commandSamples[0]);

  const suggestions = useMemo(() => commandSamples, []);

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <h2>BEMAX Copilot</h2>
          <p>Operational AI command surface for the MAX ecosystem.</p>
        </div>
      </div>

      <div className="decision-list">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className={`primary-option ${selected === suggestion ? "active" : ""}`}
            onClick={() => {
              setSelected(suggestion);
              setValue(suggestion);
            }}
            style={{
              width: "100%",
              marginBottom: 8,
              textAlign: "left",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)",
              background: selected === suggestion ? "rgba(124, 101, 233, 0.18)" : "rgba(255,255,255,0.02)",
              color: "#edf2ff",
              cursor: "pointer",
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={5}
        placeholder="Ask BEMAX AI…"
        style={{
          width: "100%",
          resize: "vertical",
          marginTop: 8,
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(14, 16, 27, 0.8)",
          color: "#edf2ff",
          padding: 12,
          font: "inherit",
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <span className="muted">Internal staff assistant</span>
        <button className="button primary" type="button" disabled={!value.trim()}>
          Execute
        </button>
      </div>
    </section>
  );
}
