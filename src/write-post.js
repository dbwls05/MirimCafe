import { supabase } from "./supabase";

const params = new URLSearchParams(location.search);

const cafeId = params.get("cafeId");

const writeBtn = document.getElementById("write-btn");

writeBtn.addEventListener("click", async () => {
  const title = document.getElementById("title").value;

  const content = document.getElementById("content").value;

  const visibility = document.getElementById("visibility").value;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("로그인 필요");
    return;
  }

  const { error } = await supabase.from("posts").insert({
    cafe_id: cafeId,
    author_id: user.id,
    title,
    content,
    visibility,
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("작성 완료");

  location.href = `cafe.html?id=${cafeId}`;
});
