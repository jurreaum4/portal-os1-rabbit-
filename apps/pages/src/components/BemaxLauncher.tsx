import { useState } from "react";
import { BemaxCopilot } from "./BemaxCopilot";

export function BemaxLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="button primary"
        onClick={() => setOpen((value) => !value)}
        style={{
          width: "100%",
          marginBottom: 12,
          justifyContent: "center",
        }}
      >
        {open ? "Close BEMAX" : "Open BEMAX"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 12, 18, 0.74)",
            backdropFilter: "blur(8px)",
            zIndex: 50,
            display: "flex",
            justifyContent: "flex-end",
            padding: 20,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              width: "min(520px, 100%)",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "rgba(12, 14, 22, 0.96)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 18,
              boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              padding: 16,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div>
                <div className="eyebrow">BEMAX AI</div>
                <h3 style={{ margin: 0 }}>Operational Intelligence</h3>
              </div>
              <button type="button" className="button" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>

            <BemaxCopilot />
          </div>
        </div>
      )}
    </>
  );
}
