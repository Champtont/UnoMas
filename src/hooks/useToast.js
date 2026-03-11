// src/hooks/useToast.js
// ─────────────────────────────────────────────────────────────────────────────
// Tiny hook that manages a self-dismissing toast message.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback } from "react";

export function useToast(duration = 2400) {
  const [message, setMessage] = useState("");
  const timer = useRef(null);

  const showToast = useCallback(
    (msg) => {
      setMessage(msg);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMessage(""), duration);
    },
    [duration]
  );

  return { toastMessage: message, showToast };
}
