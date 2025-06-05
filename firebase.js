// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAY0X4truWyyJL8Ki7sXASA2_xbOgFRrfA",
  authDomain: "airdrop-84ff4.firebaseapp.com",
  projectId: "airdrop-84ff4",
  storageBucket: "airdrop-84ff4.firebasestorage.app",
  messagingSenderId: "350878632708",
  appId: "1:350878632708:web:c47c1f9e84b7a3aca91e51",
  measurementId: "G-57D615W3SW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
