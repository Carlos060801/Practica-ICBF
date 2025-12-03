// config/firebase.js
import admin from "firebase-admin";

// 🛑 Importante: validar que PRIVATE_KEY exista y se procese correctamente
const privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (!privateKey) {
  console.error("❌ ERROR: FIREBASE_PRIVATE_KEY no está definido en el .env");
  process.exit(1);
}

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: privateKey.replace(/\\n/g, "\n"),   // 🔥 Corrección clave
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

// 🔥 Inicializar Firebase SOLO si no está inicializado antes
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_BUCKET,   // 🔥 Debe ser .firebasestorage.app
  });

  console.log("✅ Firebase Admin inicializado con bucket:", process.env.FIREBASE_BUCKET);
}

// Exportamos bucket listo para usar
const bucket = admin.storage().bucket();

export default bucket;
