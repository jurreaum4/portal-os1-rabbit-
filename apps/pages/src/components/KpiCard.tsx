type KpiCardProps = {
  label: string;
  value: string;
  detail: string;
  tint?: "purple" | "blue" | "amber" | "green";
};

export function KpiCard({ label, value, detail, tint = "purple" }: KpiCardProps) {
  return (
    <article className={`command-metric ${tint}`}>
      <div className="metric-label">
        {label}
        <span className="metric-symbol"><span aria-hidden="true">✦</span></span>
      </div>
      <strong>{value}</strong>
      <p>
        <span className="metric-indicator" />
        {detail}
      </p>
      <div className="metric-bottom">Strategic signal</div>
    </article>
  );
}
