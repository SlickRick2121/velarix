import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC9J46_LSq6hpc7tawTVWQrxnLPIhxJeLc",
  authDomain: "velarix-auth.firebaseapp.com",
  projectId: "velarix-auth",
  storageBucket: "velarix-auth.firebasestorage.app",
  messagingSenderId: "1000225309395",
  appId: "1:1000225309395:web:0b03b69a1112b7fa504a26",
  measurementId: "G-WMRE18X36K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Phone Auth (RecaptchaVerifier will be initialized in component)
export { RecaptchaVerifier } from 'firebase/auth';

export default app;

