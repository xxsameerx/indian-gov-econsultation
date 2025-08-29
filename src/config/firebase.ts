import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD1494R2hxWdD6YgfNkkZB4ApY-61ePKVI",
  authDomain: "indian-gov-consultation.firebaseapp.com",
  projectId: "indian-gov-consultation",
  storageBucket: "indian-gov-consultation.firebasestorage.app",
  messagingSenderId: "800014340516",
  appId: "1:800014340516:web:db5bcafe4a7f08bbfd3131"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// For development - connect to emulators if running locally
if (process.env.NODE_ENV === 'development') {
  // Uncomment these if you want to use Firebase emulators
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectStorageEmulator(storage, 'localhost', 9199);
}

export default app;
