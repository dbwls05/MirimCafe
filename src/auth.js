import { supabase } from "./supabase";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signup-btn");
const message = document.getElementById("message");

signupBtn.addEventListener("click", async function () {
  const email = emailInput.value;
  const password = passwordInput.value;

  const { data, error } = await supabase.auth.signUp({
    //회원가입
    email: email,
    password: password,
  });

  if (error) {
    message.textContent = "에러 : " + error.message;
    message.style.color = "red";
  } else {
    message.textContent = "가입완료! 환영합니다.";
    message.style.color = "skyblue";
    setTimeout(() => {
      location.href = "index.html";
    }, 2000);
  }
});
