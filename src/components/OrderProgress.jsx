// src/components/OrderProgress.jsx
export default function OrderProgress({ members, orders }) {
  const total = members.length;
  
  // Create a set to track all unique people who have ordered
  const orderedPeople = new Set();
  
  // Add direct order owners
  members.forEach(m => {
    if (orders[m.name]?.items?.trim()) {
      orderedPeople.add(m.name);
    }
  });
  
  // Add plus 1 users (they should be counted as having ordered)
  Object.values(orders).forEach(order => {
    if (order.plusOnes) {
      order.plusOnes.forEach(plusOneUser => {
        orderedPeople.add(plusOneUser);
      });
    }
  });
  
  const ordered = orderedPeople.size;
  
  // Count people who have completed their order (only direct order owners can complete)
  const completed = members.filter((m) => orders[m.name]?.completed).length;
  
  // Find people who haven't ordered (neither direct nor plus 1)
  const notOrdered = members.filter((m) => {
    const hasDirectOrder = orders[m.name]?.items?.trim();
    const isPlusOneUser = Object.values(orders).some(order => 
      order.plusOnes && order.plusOnes.includes(m.name)
    );
    return !hasDirectOrder && !isPlusOneUser;
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
