// =======================================================
// config/firebase.js — Firebase Admin (FINAL)
// =======================================================

import admin from "firebase-admin";

let bucket = null;

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_BUCKET,
} = process.env;

if (
  !FIREBASE_PROJECT_ID ||
  !FIREBASE_CLIENT_EMAIL ||
  !FIREBASE_PRIVATE_KEY ||
  !FIREBASE_BUCKET
) {
  console.warn("⚠️ Firebase NO inicializado: variables incompletas");
} else {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          project_id: FIREBASE_PROJECT_ID,
          client_email: FIREBASE_CLIENT_EMAIL,
          private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
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
