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
