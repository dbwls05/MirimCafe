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
    .select("*")
    .eq("id", user.id)
    .single();

  authArea.innerHTML = `
<div class="profile-menu">

  <img
    id="profile-btn"
    class="header-profile"
    src="${profile.profile_image || "https://placehold.co/40x40"}"
  />

  <div class="dropdown-menu">

    <div class="dropdown-user">
      <div class="dropdown-name">
        ${profile.nickname}
      </div>

      <div class="dropdown-email">
        ${profile.email}
      </div>
    </div>

    <div class="menu-divider"></div>

    <div class="menu-item" id="profile-page">
      프로필 보기
    </div>

    <div class="menu-item" id="settings-page">
      설정
    </div>

    <div class="menu-item" id="logout-btn">
      로그아웃
    </div>

  </div>

</div>
`;

  document.getElementById("logout-btn").addEventListener("click", async () => {
    await supabase.auth.signOut();
    location.href = "./index.html";
  });

  document.getElementById("profile-btn").addEventListener("click", () => {
    document.querySelector(".dropdown-menu").classList.toggle("show");
  });

  document.getElementById("profile-page").addEventListener("click", () => {
    location.href = "./profile.html";
  });

  document.getElementById("settings-page").addEventListener("click", () => {
    location.href = "./settings.html";
  });

  document.getElementById("logout-btn").addEventListener("click", async () => {
    await supabase.auth.signOut();
    alert("로그아웃이 완료되었습니다!");
    location.reload();
  });
}
