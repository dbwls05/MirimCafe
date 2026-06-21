import { supabase } from "./supabase";

async function init() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("로그인이 필요합니다.");
    location.href = "./login.html";
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    alert("프로필 정보를 찾을 수 없습니다.");
    return;
  }

  document.getElementById("nickname").textContent = profile.nickname;

  document.getElementById("email").textContent = profile.email;

  document.getElementById("created-at").textContent = document.getElementById(
    "created-at",
  ).textContent =
    "가입일 : " + new Date(profile.created_at).toLocaleDateString("ko-KR");

  document.getElementById("edit-btn").addEventListener("click", async () => {
    const nickname = prompt("새 닉네임을 입력하세요", profile.nickname)?.trim();

    if (!nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        nickname,
      })
      .eq("id", user.id);

    if (nickname.length < 2 || nickname.length > 12) {
      alert("닉네임은 2~12글자여야 합니다.");
      return;
    }

    if (error) {
      alert("이미 사용 중인 닉네임입니다.");
      return;
    }

    alert("수정 완료");
    location.reload();
  });
  document.getElementById("delete-btn").addEventListener("click", () => {
    alert("계정 삭제 기능은 추후 구현 예정입니다.");
  });
  document.getElementById("home-btn").addEventListener("click", () => {
    location.href = "./index.html";
  });
}

init();
