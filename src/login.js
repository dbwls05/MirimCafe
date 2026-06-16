import { supabase } from "./supabase";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("pw");
const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert("이메일 또는 비밀번호가 틀렸습니다");
    return;
  }

  alert("로그인 성공!");
  // 메인 페이지 이동
  window.location.href = "./main";
});
