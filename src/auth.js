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
    card.addEventListener("click", async () => {
      const cafeId = card.dataset.id;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("카페에 가입하려면 로그인해주세요.");
        window.location.href = "./login.html";
        return;
      }

      const result = confirm("이 카페에 가입하시겠습니까?");

      if (!result) {
        return;
      }

      const { data: alreadyJoined } = await supabase
        .from("cafe_members")
        .select("*")
        .eq("cafe_id", cafeId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (alreadyJoined) {
        alert("이미 가입한 카페입니다.");
        return;
      }

      const { error } = await supabase.from("cafe_members").insert({
        cafe_id: cafeId,
        user_id: user.id,
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("카페 가입 완료!");
      location.reload();

      // 가입 처리
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
    ${profile.nickname}님, 안녕하세요
    <button id="logout-btn">로그아웃</button>
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
      <div class="joined-cafe-card">
        <div class="cafe-name">${cafe.name}</div>
        <div class="cafe-owner">카페 주인 : ${cafe.profiles?.nickname ?? "알 수 없음"}</div>
      </div>
    `;
    });

    memberCafes.forEach((cafe) => {
      joinedBox.innerHTML += `
      <div class="joined-cafe-card">
        <div class="cafe-name">${cafe.name}</div>
        <div class="cafe-owner">카페 주인 : ${cafe.profiles?.nickname ?? "알 수 없음"}</div>
      </div>
    `;
    });
  }
}

checkLogin();
