import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDBWmU6Hda-nwOJckmi7bCz29xkBkK9Tww',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'businessgrowth-d7a3f.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'businessgrowth-d7a3f',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'businessgrowth-d7a3f.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '947933208829',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:947933208829:web:24c758372096d028541e94',
};

// Initialize Firebase safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
