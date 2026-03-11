// src/components/OrderCard.jsx
import { useState, useEffect, useRef } from "react";

export default function OrderCard({ person, items, isMe, isCompleted, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(items);
  const [saving, setSaving] = useState(false);
  const taRef = useRef(null);

  // Auto-focus and auto-size textarea when editing opens
  useEffect(() => {
    if (editing && taRef.current) {
      taRef.current.focus();
      taRef.current.style.height = "auto";
      taRef.current.style.height = taRef.current.scrollHeight + "px";
    }
  }, [editing]);

  // Keep draft in sync with incoming changes when not actively editing
  useEffect(() => {
    if (!editing) setDraft(items);
  }, [items, editing]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(draft.trim());
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(items);
    setEditing(false);
  };

  return (
    <div className={`order-card${isMe ? " mine" : ""}`}>
      <div className="order-card-top">
        <span className={`order-person${isMe ? " me" : ""}`}>
          {person}
          {isMe ? " (you)" : ""}
        </span>
        {isMe && !isCompleted && (
          <button
            className="order-edit-btn"
            onClick={() => {
              setDraft(items);
              setEditing((e) => !e);
            }}
          >
            {editing ? "✕" : "Edit"}
          </button>
        )}
      </div>

      {!editing ? (
        <div className={`order-items${!items ? " empty" : ""}`}>
          {items || (isMe ? "Tap Edit to add your order…" : "Nothing yet")}
        </div>
      ) : (
        <div className="inline-edit">
          <textarea
            ref={taRef}
            value={draft}
            rows={2}
            placeholder="e.g. Large oat latte, extra shot, no sugar"
            onChange={(e) => {
              setDraft(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
          <div className="inline-edit-actions">
            <button
              className="btn btn-primary"
              style={{ flex: 2 }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <span className="spinner" /> : "Save"}
            </button>
            <button
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
