import { supabase } from "./supabase";

const authArea = document.getElementById("auth-area");

async function checkLogin() {
  const createCafeBtn = document.getElementById("create-cafe-btn");

  createCafeBtn.addEventListener("click", async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("카페를 만들려면 먼저 로그인해주세요.");
      window.location.href = "./login.html";
      return;
    }

    window.location.href = "./create-cafe.html";
  });

  const cafeList = document.getElementById("cafe-list");

  const { data: cafes } = await supabase.from("cafes").select(`
    *,
    profiles!cafes_owner_id_fkey (
      nickname
    )
  `);

  cafeList.innerHTML = "";

  cafes.forEach((cafe) => {
    cafeList.innerHTML += `
  <div class="cafe-card" data-id="${cafe.id}">
    <div class="cafe-info">
      <div class="cafe-title">${cafe.name}</div>

      <div class="cafe-desc">
        ${cafe.description ?? ""}
      </div>

      <div class="cafe-owner">
        카페 주인 : ${cafe.profiles.nickname}
      </div>
    </div>
  </div>
`;
  });

  document.querySelectorAll(".cafe-card").forEach((card) => {
    card.addEventListener("click", () => {
      const cafeId = card.dataset.id;

      location.href = `./cafe.html?id=${cafeId}`;
    });
  });
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
  <div class="profile-menu">
    <button id="profile-btn">
      ${profile.nickname}님 ▼
    </button>

    <div class="dropdown-menu" id="dropdown-menu">
      <div class="menu-item" id="profile-page-btn">
        프로필 보기
      </div>

      <div class="menu-item" id="settings-btn">
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
    alert("로그아웃이 완료되었습니다!");
    location.reload();
  });

  const joinedBox = document.getElementById("joined-box");

  joinedBox.classList.remove("guest");
  joinedBox.classList.add("member");
  const { data: memberships } = await supabase
    .from("cafe_members")
    .select("cafe_id")
    .eq("user_id", user.id);

  if (!memberships || memberships.length === 0) {
    joinedBox.innerHTML = `
    <div class="joined-empty">
      가입된 카페가 없습니다.
    </div>
  `;
  } else {
    const cafeIds = memberships.map((m) => m.cafe_id);

    const { data: joinedCafes } = await supabase
      .from("cafes")
      .select(
        `
    *,
    profiles!cafes_owner_id_fkey (
      nickname
    )
  `,
      )
      .in("id", cafeIds);

    joinedBox.innerHTML = "";

    const ownedCafes = joinedCafes.filter((cafe) => cafe.owner_id === user.id);

    const memberCafes = joinedCafes.filter((cafe) => cafe.owner_id !== user.id);

    ownedCafes.forEach((cafe) => {
      joinedBox.innerHTML += `
      <div class="joined-cafe-card" data-id="${cafe.id}">
        <div class="cafe-name">${cafe.name}</div>
        <div class="cafe-owner">카페 주인 : ${cafe.profiles?.nickname ?? "알 수 없음"}</div>
      </div>
    `;
    });

    memberCafes.forEach((cafe) => {
      joinedBox.innerHTML += `
      <div class="joined-cafe-card" data-id="${cafe.id}">
        <div class="cafe-name">${cafe.name}</div>
        <div class="cafe-owner">카페 주인 : ${cafe.profiles?.nickname ?? "알 수 없음"}</div>
      </div>
    `;
    });
    document.querySelectorAll(".joined-cafe-card").forEach((card) => {
      card.addEventListener("click", () => {
        const cafeId = card.dataset.id;

        location.href = `./cafe.html?id=${cafeId}`;
      });
    });
  }
  const profileBtn = document.getElementById("profile-btn");
  const dropdownMenu = document.getElementById("dropdown-menu");

  profileBtn.addEventListener("click", () => {
    dropdownMenu.classList.toggle("show");
  });
  document.getElementById("profile-page-btn").addEventListener("click", () => {
    location.href = "./profile.html";
  });

  document.getElementById("settings-btn").addEventListener("click", () => {
    location.href = "./settings.html";
  });

  document.getElementById("logout-btn").addEventListener("click", async () => {
    await supabase.auth.signOut();

    alert("로그아웃 되었습니다.");
    location.reload();
  });
}

checkLogin();
