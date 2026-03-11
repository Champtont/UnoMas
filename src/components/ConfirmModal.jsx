// src/components/ConfirmModal.jsx
export default function ConfirmModal({ title, body, confirmLabel, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{title}</div>
        <div className="modal-body">{body}</div>
        <div className="modal-actions">
          <button
            className="btn btn-primary"
            style={{ background: "var(--accent)" }}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
