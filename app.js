// app.js
import { auth, db } from './firebase.js';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

export function idToEmail(id) {
  return id + "@example.com";
}
export function handleLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('loginId').value.trim();
    const pw = document.getElementById('loginPw').value;
    if (!id || !pw) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    try {
      const email = idToEmail(id);
      await signInWithEmailAndPassword(auth, email, pw);
      window.location.href = "index.html";
    } catch (err) {
      alert('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
    }
  });
}
export function handleSignupForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('signupId').value.trim();
    const pw = document.getElementById('signupPw').value;
    const email = document.getElementById('signupEmail').value.trim();
    if (!/^[A-Za-z0-9]{4,20}$/.test(id)) {
      alert('아이디는 영문/숫자 4~20자로 입력하세요.');
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/.test(pw)) {
      alert('비밀번호는 영문+숫자 조합 6~20자로 입력하세요.');
      return;
    }
    if (!/^[\w\.-]+@[\w\.-]+\.\w+$/.test(email)) {
      alert('올바른 이메일 주소를 입력하세요.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pw);
      await updateProfile(userCredential.user, { displayName: id });
      await setDoc(doc(db, "users", userCredential.user.uid), {
        id: id,
        email: email,
        createdAt: new Date()
      });
      alert('가입이 정상적으로 완료되었습니다');
      window.location.href = "login.html";
    } catch (err) {
      let msg = '회원가입 실패: ';
      if (err.code === 'auth/email-already-in-use') msg += '이미 사용 중인 이메일입니다.';
      else if (err.code === 'auth/weak-password') msg += '비밀번호가 너무 약합니다.';
      else msg += err.message;
      alert(msg);
    }
  });
}
export function renderMainMenu() {
  const menu = document.getElementById('mainMenu');
  const welcome = document.getElementById('welcomeMsg');
  if (!menu) return;
  onAuthStateChanged(auth, (user) => {
    menu.innerHTML = '';
    if (user) {
      let userId = user.displayName || (user.email ? user.email.split('@')[0] : '');
      const isAdmin = (userId === 'difains');
      welcome.innerHTML = `<b>${userId}</b>님 환영합니다!`;
      const dashBtn = document.createElement('button');
      dashBtn.textContent = '대시보드';
      dashBtn.onclick = () => location.href = 'dashboard.html';
      menu.appendChild(dashBtn);
      const calBtn = document.createElement('button');
      calBtn.textContent = '에어드랍 참여 (캘린더)';
      calBtn.onclick = () => location.href = 'calendar.html';
      menu.appendChild(calBtn);
      if (isAdmin) {
        const adminBtn = document.createElement('button');
        adminBtn.textContent = '에어드랍 일정관리 (관리자)';
        adminBtn.onclick = () => location.href = 'admin.html';
        menu.appendChild(adminBtn);
      }
      const logoutBtn = document.createElement('button');
      logoutBtn.textContent = '로그아웃';
      logoutBtn.style.background = '#aaa';
      logoutBtn.onclick = async () => {
        if (confirm('정말 나갈거에요?')) {
          await signOut(auth);
          window.location.href = 'login.html';
        }
      };
      menu.appendChild(logoutBtn);
    } else {
      welcome.innerHTML = '';
      const loginBtn = document.createElement('button');
      loginBtn.textContent = '로그인';
      loginBtn.onclick = () => location.href = 'login.html';
      menu.appendChild(loginBtn);
      const signupBtn = document.createElement('button');
      signupBtn.textContent = '회원가입';
      signupBtn.onclick = () => location.href = 'signup.html';
      menu.appendChild(signupBtn);
    }
  });
}
document.addEventListener('DOMContentLoaded', () => {
  handleLoginForm();
  handleSignupForm();
  renderMainMenu();
});
