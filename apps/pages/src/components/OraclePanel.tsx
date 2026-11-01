export function OraclePanel() {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <h2>MAX Oracle</h2>
          <p>Recommended action and confidence signal.</p>
        </div>
      </div>

      <div className="decision-list">
        <div className="decision-preview">
          <strong>Recommended Action</strong>
          <p>Acquire WR and improve route leverage for the next 14-day build window.</p>
          <span className="priority-tag high">Expected wins added +1.8</span>
          <span className="decision-risk">Confidence 81%</span>
        </div>
      </div>
    </section>
  );
}
