// src/firebase/config.js
// ─────────────────────────────────────────────────────────────────────────────
// Initialises the Firebase app and exports the Firestore db instance.
// Every other file that needs Firestore imports `db` from here — never
// re-initialises the app themselves.
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAm6XD-tYxcTvHESGrptBkUjnz3JsV7Gvs",
  authDomain: "unomas-7691b.firebaseapp.com",
  projectId: "unomas-7691b",
  storageBucket: "unomas-7691b.firebasestorage.app",
  messagingSenderId: "408450094014",
  appId: "1:408450094014:web:21af0ae0afc5770ea99fef",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
