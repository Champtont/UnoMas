// src/components/OrderProgress.jsx
export default function OrderProgress({ members, orders }) {
  const total = members.length;
  
  // Count people who have ordered (either directly or via plus 1)
  const ordered = members.filter((m) => {
    const hasDirectOrder = orders[m.name]?.items?.trim();
    const hasPlusOnes = orders[m.name]?.plusOnes?.length > 0;
    return hasDirectOrder || hasPlusOnes;
  }).length;
  
  // Count people who have completed their order
  const completed = members.filter((m) => orders[m.name]?.completed).length;
  
  const notOrdered = members.filter((m) => {
    const hasDirectOrder = orders[m.name]?.items?.trim();
    const hasPlusOnes = orders[m.name]?.plusOnes?.length > 0;
    return !hasDirectOrder && !hasPlusOnes;
  });
  
  const pct = total === 0 ? 0 : Math.round((ordered / total) * 100);
  const allDone = ordered === total && total > 0;

  return (
    <div className="progress-bar-wrap">
      <div className="progress-labels">
        <div className="progress-label-left">
          <strong>{ordered}</strong> of <strong>{total}</strong>{" "}
          {total === 1 ? "person has" : "people have"} ordered
          {completed > 0 && ` (${completed} set)`}
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
