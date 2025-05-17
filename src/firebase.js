import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzhD5Ip4XN7Cu-ozVpFIAxCMTjX2ZFZNA",
  authDomain: "some-test-985ea.firebaseapp.com",
  projectId: "some-test-985ea",
  storageBucket: "some-test-985ea.firebasestorage.app",
  messagingSenderId: "848757190503",
  appId: "1:848757190503:web:0e3a0c0a7ddc467bd6c9c2",
  measurementId: "G-Q1VLLWTW78"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
