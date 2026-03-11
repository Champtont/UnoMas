// src/components/OrderCard.jsx
import { useState, useEffect, useRef } from "react";

export default function OrderCard({ 
  person, 
  items, 
  isMe, 
  isCompleted, 
  onSave, 
  plusOnes = [], 
  onAddPlusOne, 
  onRemovePlusOne, 
  myName,
  onSetComplete,
  hasCompleted = false
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(items);
  const [saving, setSaving] = useState(false);
  const [showPlusOneTooltip, setShowPlusOneTooltip] = useState(false);
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
    
    // If user was completed and they edited their order, unset completion
    if (isMe && hasCompleted && onSetComplete) {
      onSetComplete(false);
    }
  };

  const handleCancel = () => {
    setDraft(items);
    setEditing(false);
  };

  // Check if current user has added plus 1 to this order
  const hasPlusOne = plusOnes.includes(myName);
  
  // Don't show plus 1 button for own orders, completed orders, or empty orders
  const showPlusOneButton = !isMe && !isCompleted && onAddPlusOne && onRemovePlusOne && items.trim();
  
  // Show completion button for own order only
  const showCompleteButton = isMe && !isCompleted && items.trim() && onSetComplete;

  const handlePlusOne = () => {
    if (hasPlusOne) {
      onRemovePlusOne();
    } else {
      onAddPlusOne();
    }
  };

  const handleSetComplete = () => {
    onSetComplete(!hasCompleted);
  };

  // Format plus 1 names for display
  const formatPlusOnes = () => {
    if (plusOnes.length === 0) return "";
    if (plusOnes.length === 1) return ` + ${plusOnes[0]}`;
    if (plusOnes.length === 2) return ` + ${plusOnes.join(" & ")}`;
    return ` + ${plusOnes.slice(0, 2).join(", ")} & ${plusOnes.length - 2} more`;
  };

  return (
    <div className={`order-card${isMe ? " mine" : ""}`}>
      <div className="order-card-top">
        <span className={`order-person${isMe ? " me" : ""}`}>
          {person}
          {isMe ? " (you)" : ""}
          {formatPlusOnes()}
        </span>
        <div className="order-actions">
          {showCompleteButton && (
            <button
              className={`complete-btn${hasCompleted ? " active" : ""}`}
              onClick={handleSetComplete}
            >
              {hasCompleted ? "✓ Set" : "Set Order"}
            </button>
          )}
          {isMe && plusOnes.length > 0 && (
            <div 
              className="plus-one-count" 
              onClick={() => setShowPlusOneTooltip(!showPlusOneTooltip)}
              onMouseLeave={() => setShowPlusOneTooltip(false)}
            >
              {plusOnes.length + 1}
              {showPlusOneTooltip && (
                <div className="plus-one-tooltip">
                  {plusOnes.join(", ")}
                </div>
              )}
            </div>
          )}
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
          {showPlusOneButton && (
            <button
              className={`plus-one-btn${hasPlusOne ? " active" : ""}`}
              onClick={handlePlusOne}
              disabled={saving}
            >
              {hasPlusOne ? "✓" : "+"} {plusOnes.length > 0 && `(${plusOnes.length + 1})`}
            </button>
          )}
        </div>
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
