import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Only initialize if keys are present (prevents crash during setup)
const app = firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your-api-key'
  ? initializeApp(firebaseConfig)
  : null

export const auth = app ? getAuth(app) : null
export const storage = app ? getStorage(app) : null
export const googleProvider = new GoogleAuthProvider()

export default app
