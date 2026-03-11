// src/components/MemberStrip.jsx
import { nameToColour } from "../utils";

export default function MemberStrip({ members, orders, myName, hostName }) {
  return (
    <div className="members-strip">
      {members.map((m) => {
        const hasOrdered = orders[m.name]?.items?.trim();
        const isMe = m.name === myName;
        const isHost = m.name === hostName;

        return (
          <div
            key={m.name}
            className={[
              "member-chip",
              isMe ? "me" : "",
              isHost ? "host-chip" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div
              className="avatar"
              style={{ background: nameToColour(m.name) }}
            >
              {m.name[0].toUpperCase()}
            </div>

            {m.name}

            {isHost && <span style={{ fontSize: 11 }}>👑</span>}

            <span className={hasOrdered ? "order-tick-yes" : "order-tick-no"}>
              {hasOrdered ? "✓" : "·"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
