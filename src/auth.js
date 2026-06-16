import { supabase } from "./supabase";

const authArea = document.getElementById("auth-area");

async function checkLogin() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .single();

  authArea.innerHTML = `
    ${profile.nickname}님
    <button id="logout-btn">로그아웃</button>
  `;

  document.getElementById("logout-btn").addEventListener("click", async () => {
    await supabase.auth.signOut();
    location.reload();
  });

  const joinedBox = document.getElementById("joined-box");

  if (user) {
    joinedBox.textContent = "가입된 카페가 없습니다.";
  }
}

checkLogin();
