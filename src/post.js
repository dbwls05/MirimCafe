import { supabase } from "./supabase";

const params = new URLSearchParams(location.search);

const postId = params.get("id");

const { data: post } = await supabase
  .from("posts")
  .select(
    `
    *,
    profiles!posts_author_id_fkey (
      nickname
    )
  `,
  )
  .eq("id", postId)
  .single();

document.getElementById("title").textContent = post.title;

document.getElementById("author").textContent =
  `작성자 : ${post.profiles.nickname}`;

document.getElementById("date").textContent = new Date(
  post.created_at,
).toLocaleString();

document.getElementById("content").textContent = post.content;

document.getElementById("author").textContent =
  `작성자 : ${post.profiles.nickname}`;

document.getElementById("date").textContent = new Date(
  post.created_at,
).toLocaleDateString("ko-KR");

document.getElementById("date").textContent =
  `작성일 : ${new Date(post.created_at).toLocaleString("ko-KR")}`;

if (post.updated_at) {
  document.getElementById("updated").textContent =
    `수정일 : ${new Date(post.updated_at).toLocaleString("ko-KR")}`;
}

const {
  data: { user },
} = await supabase.auth.getUser();

if (user) {
  // 게시글 작성자
  if (user.id === post.author_id) {
    document.getElementById("edit-btn").style.display = "inline-block";
    document.getElementById("delete-btn").style.display = "inline-block";
  }

  // 카페 정보 조회
  const { data: cafe } = await supabase
    .from("cafes")
    .select("owner_id")
    .eq("id", post.cafe_id)
    .single();

  // 카페 주인
  if (cafe.owner_id === user.id) {
    document.getElementById("delete-btn").style.display = "inline-block";
  }
}

document.getElementById("edit-btn").addEventListener("click", () => {
  location.href = `edit-post.html?id=${postId}`;
});

document.getElementById("delete-btn").addEventListener("click", async () => {
  if (!confirm("게시글을 삭제하시겠습니까?")) return;

  const { data, error } = await supabase
    .from("posts")
    .update({
      is_hidden: true,
    })
    .eq("id", postId)
    .select();

  console.log("postId =", postId);
  console.log("data =", data);
  console.log("error =", error);

  if (error) {
    alert(error.message);
    return;
  }

  alert("삭제되었습니다.");

  location.href = `cafe.html?id=${post.cafe_id}`;
});
