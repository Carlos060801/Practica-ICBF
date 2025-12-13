// =======================================================
// config/firebase.js — Inicialización segura Firebase Admin
// =======================================================

import admin from "firebase-admin";

let bucket = null;

// Leer variables de entorno
const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_BUCKET,
} = process.env;

// 🔎 Validación mínima (sin matar el backend)
const firebaseReady =
  FIREBASE_PROJECT_ID &&
  FIREBASE_CLIENT_EMAIL &&
  FIREBASE_PRIVATE_KEY &&
  FIREBASE_BUCKET;

if (!firebaseReady) {
  console.warn("⚠️ Firebase NO inicializado (variables incompletas)");
} else {
  try {
    // Preparar credenciales
    const serviceAccount = {
      type: "service_account",
      project_id: FIREBASE_PROJECT_ID,
      client_email: FIREBASE_CLIENT_EMAIL,
      private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };

    // Inicializar solo una vez
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: FIREBASE_BUCKET,
      });

      console.log("✅ Firebase Admin inicializado correctamente");
      console.log("🪣 Bucket:", FIREBASE_BUCKET);
    }

    bucket = admin.storage().bucket();
  } catch (error) {
    console.error("❌ Error inicializando Firebase:", error.message);
    bucket = null;
  }
}

export default bucket;
