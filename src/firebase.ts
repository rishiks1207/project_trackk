import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore with graceful fallback to default
export const db = (() => {
  try {
    const customDbId = (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId;
    if (customDbId) {
      return getFirestore(app, customDbId);
    }
  } catch (err) {
    console.warn('Falling back to default Firestore database instance:', err);
  }
  return getFirestore(app);
})();

// Validate Firestore connection on boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline status:', error.message);
    }
  }
}

testFirestoreConnection();
