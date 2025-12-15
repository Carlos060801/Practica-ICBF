import admin from "firebase-admin";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKey) {
  console.warn("⚠️ Firebase Admin no inicializado: faltan variables");
} else {
  privateKey = privateKey.replace(/\\n/g, "\n");

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket: "sige-95d85.appspot.com", // ✅ FIJO
    });

    console.log("✅ Firebase Admin inicializado correctamente");
  }
}

export const bucket = admin.apps.length
  ? admin.storage().bucket()
  : null;
