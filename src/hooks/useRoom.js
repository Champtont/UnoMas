// src/hooks/useRoom.js
// ─────────────────────────────────────────────────────────────────────────────
// Custom hook that owns all live room state.
// Subscribes to Firestore on mount, unsubscribes on unmount.
// Exposes actions so screens never import Firebase directly.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";
import {
  subscribeToRoom,
  updateOrder,
  markCompleted,
  reopenRoom,
  callForHelp,
  deleteRoom,
  addPlusOne,
  removePlusOne,
  setOrderComplete,
} from "../firebase/rooms";

export function useRoom(code, myName) {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roomGone, setRoomGone] = useState(false);

  // Help notification state — derived from room changes, not raw Firestore data
  const [helpNotif, setHelpNotif] = useState(null);
  const [sosPulsing, setSosPulsing] = useState(false);
  const lastHelpAt = useRef(null);

  // ── Subscribe to Firestore ─────────────────────────────────────────────────
  useEffect(() => {
    const unsub = subscribeToRoom(code, {
      onUpdate: (data) => {
        // Detect a new help signal from someone else
        if (data.helpAt && data.helpAt !== lastHelpAt.current) {
          lastHelpAt.current = data.helpAt;
          if (data.helpBy !== myName) {
            setHelpNotif(data.helpBy);
            setSosPulsing(true);
            setTimeout(() => setSosPulsing(false), 3500);
          }
        }
        setRoom(data);
        setLoading(false);
      },
      onDeleted: () => {
        setRoomGone(true);
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      },
    });

    return () => unsub();
  }, [code, myName]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const saveOrder = useCallback(
    (items) => updateOrder(code, myName, items),
    [code, myName]
  );

  const complete = useCallback(
    () => markCompleted(code, myName),
    [code, myName]
  );

  const reopen = useCallback(() => reopenRoom(code), [code]);

  const sendHelp = useCallback(async () => {
    await callForHelp(code, myName);
    setSosPulsing(true);
    setTimeout(() => setSosPulsing(false), 3500);
  }, [code, myName]);

  const remove = useCallback(() => deleteRoom(code), [code]);

  const dismissHelp = useCallback(() => setHelpNotif(null), []);

  const addPlusOneToOrder = useCallback(
    (targetName) => addPlusOne(code, myName, targetName),
    [code, myName]
  );

  const removePlusOneFromOrder = useCallback(
    (targetName) => removePlusOne(code, myName, targetName),
    [code, myName]
  );

  const setMyOrderComplete = useCallback(
    (completed) => setOrderComplete(code, myName, completed),
    [code, myName]
  );

  return {
    room,
    loading,
    roomGone,
    helpNotif,
    sosPulsing,
    // actions
    saveOrder,
    complete,
    reopen,
    sendHelp,
    remove,
    dismissHelp,
    addPlusOneToOrder,
    removePlusOneFromOrder,
    setMyOrderComplete,
  };
}
