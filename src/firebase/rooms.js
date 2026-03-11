// src/firebase/rooms.js
// ─────────────────────────────────────────────────────────────────────────────
// All Firestore read/write operations for rooms.
// Components never touch Firestore directly — they call these functions.
// ─────────────────────────────────────────────────────────────────────────────

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

// ── Reference helper ──────────────────────────────────────────────────────────
export const roomRef = (code) => doc(db, "rooms", code);

// ── Create ────────────────────────────────────────────────────────────────────
export async function createRoom({ code, roomName, hostName }) {
  await setDoc(roomRef(code), {
    code,
    name: roomName,
    host: hostName,
    members: [{ name: hostName, joinedAt: Date.now() }],
    orders: { [hostName]: { items: "", updatedAt: Date.now() } },
    completed: false,
    completedBy: null,
    completedAt: null,
    helpAt: null,
    helpBy: null,
    createdAt: serverTimestamp(),
  });
}

// ── Join ──────────────────────────────────────────────────────────────────────
export async function joinRoom(code, name) {
  let snap;
  try {
    snap = await getDoc(roomRef(code));
  } catch {
    return { error: "Connection error. Please try again." };
  }

  if (!snap.exists()) return { error: "Room not found. Check the code and try again." };

  const room = snap.data();
  if (room.completed) return { error: "This order has already been completed." };

  const alreadyIn = (room.members || []).find(
    (m) => m.name.toLowerCase() === name.toLowerCase()
  );

  if (!alreadyIn) {
    await updateDoc(roomRef(code), {
      members: arrayUnion({ name, joinedAt: Date.now() }),
      [`orders.${name}`]: { items: "", updatedAt: Date.now() },
    });
  }

  return { ok: true };
}

// ── Update order ──────────────────────────────────────────────────────────────
export async function updateOrder(code, name, items) {
  await updateDoc(roomRef(code), {
    [`orders.${name}`]: { items, updatedAt: Date.now() },
  });
}

// ── Mark completed ────────────────────────────────────────────────────────────
export async function markCompleted(code, completedBy) {
  await updateDoc(roomRef(code), {
    completed: true,
    completedBy,
    completedAt: Date.now(),
  });
}

// ── Reopen ────────────────────────────────────────────────────────────────────
export async function reopenRoom(code) {
  await updateDoc(roomRef(code), {
    completed: false,
    completedBy: null,
    completedAt: null,
  });
}

// ── Call for help ─────────────────────────────────────────────────────────────
export async function callForHelp(code, name) {
  await updateDoc(roomRef(code), {
    helpAt: Date.now(),
    helpBy: name,
  });
}

// ── Delete room ───────────────────────────────────────────────────────────────
export async function deleteRoom(code) {
  await deleteDoc(roomRef(code));
}

// ── Plus 1 operations ─────────────────────────────────────────────────────────
export async function addPlusOne(code, name, targetName) {
  await updateDoc(roomRef(code), {
    [`orders.${targetName}.plusOnes`]: arrayUnion(name),
  });
}

export async function removePlusOne(code, name, targetName) {
  await updateDoc(roomRef(code), {
    [`orders.${targetName}.plusOnes`]: arrayRemove(name),
  });
}

// ── Order completion operations ───────────────────────────────────────────────
export async function setOrderComplete(code, name, completed) {
  await updateDoc(roomRef(code), {
    [`orders.${name}.completed`]: completed,
  });
}

// ── Real-time listener ────────────────────────────────────────────────────────
// Returns an unsubscribe function. Calls onUpdate(data) on every change,
// and onDeleted() if the document is removed.
export function subscribeToRoom(code, { onUpdate, onDeleted, onError }) {
  return onSnapshot(
    roomRef(code),
    (snap) => {
      if (!snap.exists()) {
        onDeleted?.();
      } else {
        onUpdate(snap.data());
      }
    },
    (err) => onError?.(err)
  );
}
