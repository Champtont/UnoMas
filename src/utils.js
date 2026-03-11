// src/utils.js
// ─────────────────────────────────────────────────────────────────────────────
// Pure utility functions. No Firebase, no React — just logic.
// ─────────────────────────────────────────────────────────────────────────────

// Generates a random 5-character uppercase room code, e.g. "AB3KX"
export function generateRoomCode() {
  return Math.random().toString(36).slice(2, 7).toUpperCase();
}

// Maps a name string to a consistent soft background colour for avatars
const AVATAR_COLOURS = [
  "#ff5c3a33",
  "#ffb34733",
  "#4ade8033",
  "#38bdf833",
  "#a78bfa33",
  "#f472b633",
];

export function nameToColour(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLOURS[Math.abs(hash) % AVATAR_COLOURS.length];
}
