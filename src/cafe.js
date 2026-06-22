import { supabase } from "./supabase";

const params = new URLSearchParams(location.search);
const cafeId = params.get("id");

loadCafe();

async function loadCafe() {
  const { data: cafe } = await supabase
    .from("cafes")
    .select(
      `
      *,
      profiles!cafes_owner_id_fkey (
        nickname
      )
    `,
    )
    .eq("id", cafeId)
    .single();

  document.getElementById("cafe-name").textContent = cafe.name;

  document.getElementById("cafe-desc").textContent = cafe.description ?? "";

  checkRole(cafe);
}
loadPosts();
async function loadPosts() {
  const postList = document.getElementById("post-list");

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("cafe_id", cafeId)
    .eq("is_hidden", false)
    .order("created_at", {
      ascending: false,
    });

  postList.innerHTML = "";

  if (!posts.length) {
    postList.textContent = "게시글이 없습니다.";
    return;
  }

  posts.forEach((post) => {
    postList.innerHTML += `
    <div class="post-card" data-id="${post.id}">
      <div class="post-title">
        ${post.title}
      </div>

      <div class="post-date">
        ${new Date(post.created_at).toLocaleDateString()}
      </div>
    </div>
  `;
  });
  document.querySelectorAll(".post-card").forEach((card) => {
    card.addEventListener("click", () => {
      const postId = card.dataset.id;

      location.href = `post.html?id=${postId}`;
    });
  });
}
const joinBtn = document.getElementById("join-btn");
const writeBtn = document.getElementById("write-btn");
async function checkRole(cafe) {
  writeBtn.addEventListener("click", () => {
    location.href = `write-post.html?cafeId=${cafeId}`;
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    writeBtn.style.display = "none";
    return;
  }

  if (cafe.owner_id === user.id) {
    joinBtn.style.display = "none";
    return;
  }

  const { data: member } = await supabase
    .from("cafe_members")
    .select("*")
    .eq("cafe_id", cafeId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (member) {
    joinBtn.style.display = "none";
  } else {
    writeBtn.style.display = "none";
  }
}

document.getElementById("edit-cafe-btn").addEventListener("click", () => {
  location.href = `edit-cafe.html?id=${cafeId}`;
});

document.getElementById("join-btn").addEventListener("click", async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("로그인 후 이용해주세요.");
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

  alert("가입 완료!");
  location.reload();
});
