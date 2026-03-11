// src/components/HelpNotification.jsx
export default function HelpNotification({ helper, onDismiss }) {
  return (
    <div className="help-notif" onClick={onDismiss}>
      <span className="help-notif-icon">🆘</span>
      <div className="help-notif-text">
        <strong>Help needed!</strong>
        {helper} needs a hand carrying the order.
      </div>
    </div>
  );
}
