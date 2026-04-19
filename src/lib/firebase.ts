import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test connection on boot
async function testConnection() {
  try {
    // Attempting a non-existent doc read to check connectivity and config
    await getDocFromServer(doc(db, 'system', 'ping'));
    console.log("Firebase connection verified");
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.error("Firebase is offline. Check credentials.");
    }
  }
}

testConnection();

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: any[];
  }
}

export function handleFirestoreError(error: any, operation: FirestoreErrorInfo['operationType'], path: string | null): never {
  const authState = auth.currentUser;
  const errorInfo: FirestoreErrorInfo = {
    error: error.message || 'Unknown Firestore error',
    operationType: operation,
    path: path,
    authInfo: {
      userId: authState?.uid || 'unauthenticated',
      email: authState?.email || 'none',
      emailVerified: authState?.emailVerified || false,
      isAnonymous: authState?.isAnonymous || false,
      providerInfo: authState?.providerData || []
    }
  };
  throw new Error(JSON.stringify(errorInfo));
}
