import { supabase } from "./supabase";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("pw");
const signupBtn = document.getElementById("signup-btn");

console.log("signup.js 로드됨");
signupBtn.addEventListener("click", async function () {
  console.log("버튼 클릭됨");

  const email = emailInput.value;
  const password = passwordInput.value;
  const nickname = document.getElementById("nick").value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    alert(error.message);
    return;
  }

  const user = data.user;

  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    email: email,
    nickname: nickname,
    created_at: new Date().toISOString(),
  });

  if (profileError) {
    alert(profileError.message);
    return;
  }

  alert("회원가입 완료!");
});
