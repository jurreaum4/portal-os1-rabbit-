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
  const [value, setValue] = useState(commandSamples[0]);
  const [selected, setSelected] = useState(commandSamples[0]);

  const suggestions = useMemo(() => commandSamples, []);

  const result = useMemo(
    () => ({
      headline: "Portfolio is stable, with one high-value opportunity and two execution risks.",
      nextAction: "Review the top-performing division before the next governance window.",
      confidence: "81% confidence",
      tags: ["Revenue", "Risk", "Simulation"],
    }),
    [],
  );

  return (
    <section className="panel" style={{ overflow: "hidden" }}>
      <div className="section-heading">
        <div>
          <h2>BEMAX Copilot</h2>
          <p>Operational AI command surface for the MAX ecosystem.</p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
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
              padding: "8px 10px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                selected === suggestion
                  ? "rgba(124, 101, 233, 0.18)"
                  : "rgba(255,255,255,0.02)",
              color: "#edf2ff",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexDirection: "column",
          padding: 14,
          borderRadius: 14,
          background: "rgba(11, 13, 20, 0.9)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: "#aeb9ff" }}>
            Copilot shell
          </span>
          <span style={{ fontSize: 12, color: "#8fe79f" }}>Online</span>
        </div>

        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={4}
          placeholder="Ask BEMAX AI…"
          style={{
            width: "100%",
            resize: "vertical",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(14, 16, 27, 0.8)",
            color: "#edf2ff",
            padding: 12,
            font: "inherit",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <span className="muted">Internal staff assistant</span>
          <button className="button primary" type="button" disabled={!value.trim()}>
            Execute
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 14,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(124, 101, 233, 0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <strong style={{ fontSize: 14 }}>AI response</strong>
          <span style={{ fontSize: 12, color: "#d7dbff" }}>{result.confidence}</span>
        </div>

        <p style={{ marginTop: 10, lineHeight: 1.5 }}>{result.headline}</p>
        <p style={{ color: "#dfe7ff", marginTop: 8 }}>{result.nextAction}</p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          {result.tags.map((tag) => (
            <span
              key={tag}
              style={{
                display: "inline-block",
                padding: "5px 8px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.04)",
                fontSize: 11,
                color: "#d7dbff",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
