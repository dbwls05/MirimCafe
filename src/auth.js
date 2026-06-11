import { supabase } from "./supabase";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("pw");
const signupBtn = document.getElementById("signup-btn");
const message = document.getElementById("message");

console.log("signup.js 로드됨");
signupBtn.addEventListener("click", async function () {
  console.log("버튼 클릭됨");

  const email = emailInput.value;
  const password = passwordInput.value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  console.log(data);
  console.log(error);
});

signupBtn.addEventListener("click", async function () {
  const email = emailInput.value;
  const password = passwordInput.value;
  const nickname = document.getElementById("nick").value;

  const { data, error } = await supabase.auth.signUp({
    //회원가입
    email: email,
    password: password,
  });
});
