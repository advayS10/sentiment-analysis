import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAWT8ZIZjoU-tOQ-ydPidu8G9sRrv1P5Cg",
  authDomain: "sentiment-analyzer-92f70.firebaseapp.com",
  projectId: "sentiment-analyzer-92f70",
  storageBucket: "sentiment-analyzer-92f70.firebasestorage.app",
  messagingSenderId: "273300445061",
  appId: "1:273300445061:web:e649a09237a95cb5e0d6ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);