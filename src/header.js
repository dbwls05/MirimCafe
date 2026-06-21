import { supabase } from "./supabase";

const header = document.getElementById("header");

const response = await fetch("./header.html");
header.innerHTML = await response.text();

const authArea = document.getElementById("auth-area");

const {
  data: { user },
} = await supabase.auth.getUser();

if (user) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .single();

  authArea.innerHTML = `
    <span id="profile-btn">${profile.nickname}님</span>
    <button id="logout-btn">로그아웃</button>
  `;

  document.getElementById("logout-btn").addEventListener("click", async () => {
    await supabase.auth.signOut();
    location.href = "./index.html";
  });

  document.getElementById("profile-btn").addEventListener("click", () => {
    location.href = "./profile.html";
  });
}
