// firebase.js
// Firebase v9+ (모듈 방식)

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// 아래 값을 자신의 Firebase 콘솔에서 복사해 입력하세요!
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAY0X4truWyyJL8Ki7sXASA2_xbOgFRrfA",
  authDomain: "difains.firebaseapp.com",
  projectId: "airdrop-84ff4",
  storageBucket: "airdrop-84ff4.firebasestorage.app",
  messagingSenderId: "350878632708",
  appId: "1:350878632708:web:c47c1f9e84b7a3aca91e51",
  measurementId: "G-57D615W3SW"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
// 인증 객체
const auth = getAuth(app);
// Firestore 객체
const db = getFirestore(app);

// 외부에서 사용 가능하게 export
export { app, auth, db };
