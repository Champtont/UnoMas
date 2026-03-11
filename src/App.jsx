// src/App.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Root component. Owns the session state (which room/name the user is in)
// and swaps between the Landing and Room screens. Nothing else lives here.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import LandingScreen from "./screens/LandingScreen";
import RoomScreen from "./screens/RoomScreen";

export default function App() {
  // session = null when on landing, or { code, myName } when inside a room
  const [session, setSession] = useState(null);

  const enterRoom = (code, myName) => setSession({ code, myName });
  const leaveRoom = () => setSession(null);

  return (
    <div className="app">
      <div className="header">
        <div className="logo">
          uno<span style={{ color: "var(--accent)" }}>más</span>
        </div>
        {session && (
          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            👋 {session.myName}
          </div>
        )}
      </div>

      {!session ? (
        <LandingScreen onEnterRoom={enterRoom} />
      ) : (
        <RoomScreen
          code={session.code}
          myName={session.myName}
          onLeave={leaveRoom}
        />
      )}
    </div>
  );
}
