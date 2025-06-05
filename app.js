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

// 아이디를 이메일로 변환 (예: myid → myid@example.com)
export function idToEmail(id) {
  return id + "@example.com";
}

// 로그인 처리
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

// 회원가입 처리
export function handleSignupForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('signupId').value.trim();
    const pw = document.getElementById('signupPw').value;
    const email = document.getElementById('signupEmail').value.trim();

    // 유효성 검사
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
      // displayName에 id 저장
      await updateProfile(userCredential.user, { displayName: id });
      // Firestore에 사용자 정보 저장
      await setDoc(doc(db, "users", userCredential.user.uid), {
        id: id,
        email: email,
        createdAt: new Date()
      });
      alert('회원가입이 완료되었습니다! 로그인 해주세요.');
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

// 로그아웃 처리
export function handleLogoutBtn() {
  const btn = document.getElementById('logoutBtn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });
}

// 메뉴 렌더링 (index.html에서 사용)
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
      // 대시보드
      const dashBtn = document.createElement('button');
      dashBtn.textContent = '대시보드';
      dashBtn.onclick = () => location.href = 'dashboard.html';
      menu.appendChild(dashBtn);
      // 캘린더
      const calBtn = document.createElement('button');
      calBtn.textContent = '에어드랍 참여 (캘린더)';
      calBtn.onclick = () => location.href = 'calendar.html';
      menu.appendChild(calBtn);
      // 관리자 메뉴
      if (isAdmin) {
        const adminBtn = document.createElement('button');
        adminBtn.textContent = '에어드랍 일정관리 (관리자)';
        adminBtn.onclick = () => location.href = 'admin.html';
        menu.appendChild(adminBtn);
      }
      // 로그아웃
      const logoutBtn = document.createElement('button');
      logoutBtn.textContent = '로그아웃';
      logoutBtn.style.background = '#aaa';
      logoutBtn.onclick = async () => {
        await signOut(auth);
        location.reload();
      };
      menu.appendChild(logoutBtn);
    } else {
      welcome.innerHTML = '';
      // 로그인
      const loginBtn = document.createElement('button');
      loginBtn.textContent = '로그인';
      loginBtn.onclick = () => location.href = 'login.html';
      menu.appendChild(loginBtn);
      // 회원가입
      const signupBtn = document.createElement('button');
      signupBtn.textContent = '회원가입';
      signupBtn.onclick = () => location.href = 'signup.html';
      menu.appendChild(signupBtn);
    }
  });
}

// 관리자 권한 체크 (admin.html 등에서 사용)
export function checkAdminAccess(user) {
  let id = user?.displayName;
  if (!id && user?.email) id = user.email.split('@')[0];
  return id === 'difains';
}

// 페이지별 자동 초기화
document.addEventListener('DOMContentLoaded', () => {
  // 로그인 폼
  handleLoginForm();
  // 회원가입 폼
  handleSignupForm();
  // 로그아웃 버튼
  handleLogoutBtn();
  // 메인 메뉴 렌더링 (index.html)
  renderMainMenu();
});
