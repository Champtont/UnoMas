// src/components/OrderProgress.jsx
export default function OrderProgress({ members, orders }) {
  const total = members.length;
  const ordered = members.filter((m) => orders[m.name]?.items?.trim()).length;
  const notOrdered = members.filter((m) => !orders[m.name]?.items?.trim());
  const pct = total === 0 ? 0 : Math.round((ordered / total) * 100);
  const allDone = ordered === total && total > 0;

  return (
    <div className="progress-bar-wrap">
      <div className="progress-labels">
        <div className="progress-label-left">
          <strong>{ordered}</strong> of <strong>{total}</strong>{" "}
          {total === 1 ? "person has" : "people have"} ordered
        </div>
        <div className="progress-fraction">
          <span className="frac-done">{ordered}</span>/{total}
        </div>
      </div>

      <div className="progress-track">
        <div
          className={`progress-fill${allDone ? " all-done" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {notOrdered.length > 0 && (
        <div className="waiting-chips">
          {notOrdered.map((m) => (
            <div key={m.name} className="waiting-chip">
              <div className="waiting-dot" />
              {m.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
