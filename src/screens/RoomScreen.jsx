// src/screens/RoomScreen.jsx
import { useState } from "react";
import { useRoom } from "../hooks/useRoom";
import { useToast } from "../hooks/useToast";

import HelpNotification from "../components/HelpNotification";
import ConfirmModal from "../components/ConfirmModal";
import OrderProgress from "../components/OrderProgress";
import MemberStrip from "../components/MemberStrip";
import OrderCard from "../components/OrderCard";
import Toast from "../components/Toast";

export default function RoomScreen({ code, myName, onLeave }) {
  const {
    room,
    loading,
    roomGone,
    helpNotif,
    sosPulsing,
    saveOrder,
    complete,
    reopen,
    sendHelp,
    remove,
    dismissHelp,
    addPlusOneToOrder,
    removePlusOneFromOrder,
  } = useRoom(code, myName);

  const { toastMessage, showToast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="loading-screen">
        <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
        Joining room…
      </div>
    );
  }

  // ── Room deleted / not found ───────────────────────────────────────────────
  if (roomGone) {
    return (
      <div className="room-closed">
        <span className="big-emoji">🚪</span>
        <h2>Room Closed</h2>
        <p>
          This room no longer exists. It was either deleted by the host or
          expired after 24 hours.
        </p>
        <button className="btn btn-primary" onClick={onLeave}>
          Back to Home
        </button>
      </div>
    );
  }

  if (!room) return null;

  // ── Derived values ─────────────────────────────────────────────────────────
  const isHost = room.host === myName;
  const members = room.members || [];
  const orders = room.orders || {};
  const myItems = orders[myName]?.items || "";
  const otherMembers = members.filter((m) => m.name !== myName);

  // ── Action handlers (add toast feedback here, not in the hook) ────────────
  const handleSaveOrder = async (items) => {
    await saveOrder(items);
    showToast("Order saved ✓");
  };

  const handleHelp = async () => {
    await sendHelp();
    showToast("Help request sent 🆘");
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    await remove();
    // onSnapshot will fire → roomGone → shows closed screen automatically
  };

  const copyCode = () => {
    navigator.clipboard?.writeText(code).catch(() => {});
    showToast("Room code copied!");
  };

  return (
    <div>
      {/* Overlays */}
      {helpNotif && (
        <HelpNotification helper={helpNotif} onDismiss={dismissHelp} />
      )}
      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete this room?"
          body="This will permanently remove the room and all orders for everyone. This cannot be undone."
          confirmLabel="Yes, Delete Room"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {/* Room header */}
      <div className="room-header">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button className="room-code" onClick={copyCode}>
            <span>🏷</span> Code: <strong>{room.code}</strong>{" "}
            <span style={{ fontSize: 11 }}>tap to copy</span>
          </button>
          <button className="leave-btn" onClick={onLeave}>✕</button>
        </div>
        <div className="room-name-display">{room.name}</div>
        <div className="room-meta">
          {members.length} {members.length === 1 ? "person" : "people"} · hosted
          by {room.host}
        </div>
      </div>

      {/* Order progress bar */}
      <OrderProgress members={members} orders={orders} />

      {/* Scrollable member chips */}
      <MemberStrip
        members={members}
        orders={orders}
        myName={myName}
        hostName={room.host}
      />

      {/* Completed banner */}
      {room.completed && (
        <div className="completed-banner">
          <span className="completed-icon">✅</span>
          <div className="completed-text">
            <strong>Order Complete!</strong>
            {room.completedBy} has picked up all orders. Enjoy!
          </div>
        </div>
      )}

      {/* Order list */}
      <div className="orders-section">
        <div className="section-label">Your Order</div>
        <OrderCard
          person={myName}
          items={myItems}
          isMe={true}
          isCompleted={room.completed}
          onSave={handleSaveOrder}
        />

        {otherMembers.length > 0 && (
          <>
            <div className="section-label">Everyone Else</div>
            {otherMembers.map((m) => (
              <OrderCard
                key={m.name}
                person={m.name}
                items={orders[m.name]?.items || ""}
                isMe={false}
                isCompleted={room.completed}
                onSave={() => {}}
                plusOnes={orders[m.name]?.plusOnes || []}
                onAddPlusOne={() => addPlusOneToOrder(m.name)}
                onRemovePlusOne={() => removePlusOneFromOrder(m.name)}
                myName={myName}
              />
            ))}
          </>
        )}

        {members.length === 1 && (
          <div className="empty-state">
            <span className="emoji">👋</span>
            Share the room code so others can join!
          </div>
        )}

        {/* Host-only delete link */}
        {isHost && (
          <div className="delete-row">
            <button
              className="delete-room-btn"
              onClick={() => setShowDeleteConfirm(true)}
            >
              🗑 Delete this room
            </button>
          </div>
        )}
      </div>

      {/* Fixed bottom action bar */}
      <div className="action-bar">
        <div className="action-row">
          <button
            className={`sos-btn${sosPulsing ? " pulsing" : ""}`}
            onClick={handleHelp}
            disabled={room.completed}
          >
            🆘 Need Help
          </button>

          {!room.completed ? (
            <button
              className="btn btn-success"
              style={{ flex: 2, borderRadius: 12, fontSize: 14 }}
              onClick={complete}
            >
              ✓ Mark Order Done
            </button>
          ) : isHost ? (
            <button
              className="btn btn-secondary"
              style={{ flex: 2, borderRadius: 12, fontSize: 14 }}
              onClick={reopen}
            >
              ↩ Reopen Order
            </button>
          ) : null}
        </div>
      </div>

      <Toast message={toastMessage} />
    </div>
  );
}
