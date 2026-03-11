// src/screens/LandingScreen.jsx
import { useState } from "react";
import { createRoom, joinRoom } from "../firebase/rooms";
import { generateRoomCode } from "../utils";

export default function LandingScreen({ onEnterRoom }) {
  const [name, setName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [mode, setMode] = useState("home"); // "home" | "create" | "join"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const clearError = () => setError("");

  const handleCreate = async () => {
    if (!name.trim() || !roomName.trim()) {
      setError("Enter your name and a room name.");
      return;
    }
    setLoading(true);
    const code = generateRoomCode();
    try {
      await createRoom({ code, roomName: roomName.trim(), hostName: name.trim() });
      onEnterRoom(code, name.trim());
    } catch {
      setError("Could not create room. Check your connection and try again.");
    }
    setLoading(false);
  };

  const handleJoin = async () => {
    if (!name.trim() || !joinCode.trim()) {
      setError("Enter your name and the room code.");
      return;
    }
    setLoading(true);
    const result = await joinRoom(joinCode.trim().toUpperCase(), name.trim());
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    onEnterRoom(joinCode.trim().toUpperCase(), name.trim());
    setLoading(false);
  };

  const goBack = () => {
    setMode("home");
    clearError();
  };

  return (
    <div className="landing">
      <div className="hero-tag">☕ Group Orders Made Easy</div>
      <h1 className="hero-title">
        uno<span style={{ color: "var(--accent)" }}>más</span>
      </h1>
      <p className="hero-sub">
        Everyone adds their own order. The fetcher remembers everything. No
        yelling required.
      </p>

      {mode === "home" && (
        <div className="input-group slide-up">
          <button className="btn btn-primary" onClick={() => setMode("create")}>
            ✦ Create a Room
          </button>
          <button className="btn btn-secondary" onClick={() => setMode("join")}>
            Join a Room
          </button>
        </div>
      )}

      {mode === "create" && (
        <div className="card slide-up">
          <div className="card-title">Create Room</div>
          <div className="input-group">
            <input
              className="input"
              placeholder="Your name"
              value={name}
              maxLength={24}
              onChange={(e) => { setName(e.target.value); clearError(); }}
            />
            <input
              className="input"
              placeholder="Room name (e.g. Coffee Run)"
              value={roomName}
              maxLength={30}
              onChange={(e) => { setRoomName(e.target.value); clearError(); }}
            />
            {error && <p className="error-text">{error}</p>}
            <button className="btn btn-primary" onClick={handleCreate} disabled={loading}>
              {loading ? <span className="spinner" /> : "Create & Go →"}
            </button>
            <button className="btn btn-secondary" onClick={goBack}>Back</button>
          </div>
        </div>
      )}

      {mode === "join" && (
        <div className="card slide-up">
          <div className="card-title">Join Room</div>
          <div className="input-group">
            <input
              className="input"
              placeholder="Your name"
              value={name}
              maxLength={24}
              onChange={(e) => { setName(e.target.value); clearError(); }}
            />
            <input
              className="input"
              placeholder="Room code"
              value={joinCode}
              maxLength={8}
              style={{ letterSpacing: "0.1em", fontWeight: 600 }}
              onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); clearError(); }}
            />
            {error && <p className="error-text">{error}</p>}
            <button className="btn btn-primary" onClick={handleJoin} disabled={loading}>
              {loading ? <span className="spinner" /> : "Join Room →"}
            </button>
            <button className="btn btn-secondary" onClick={goBack}>Back</button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 40 }}>
        <div style={{ display: "flex", gap: 12 }}>
          {[
            "🛍️ Everyone orders themselves",
            "📋 Fetcher sees all orders",
            "✅ Mark when done",
          ].map((f) => (
            <div
              key={f}
              style={{
                flex: 1,
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "12px 10px",
                fontSize: 12,
                color: "var(--muted)",
                lineHeight: 1.5,
                textAlign: "center",
              }}
            >
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
