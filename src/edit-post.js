import { supabase } from "./supabase";

const params = new URLSearchParams(location.search);
const postId = params.get("id");

const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  alert("로그인이 필요합니다.");
  location.href = "./login.html";
}

const { data: post } = await supabase
  .from("posts")
  .select("*")
  .eq("id", postId)
  .single();

if (!post) {
  alert("게시글을 찾을 수 없습니다.");
  location.href = "./index.html";
}

if (post.author_id !== user.id) {
  alert("작성자만 수정할 수 있습니다.");
  location.href = `post.html?id=${postId}`;
}

document.getElementById("title").value = post.title;
document.getElementById("content").value = post.content;

document.getElementById("save-btn").addEventListener("click", async () => {
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();

  if (!title || !content) {
    alert("제목과 내용을 입력해주세요.");
    return;
  }

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId);

  if (error) {
    alert(error.message);
    return;
  }

  alert("수정되었습니다.");

  location.href = `post.html?id=${postId}`;
});
