import { supabase } from "./supabase";

const createBtn = document.getElementById("create-btn");

createBtn.addEventListener("click", async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count, error: countError } = await supabase
    .from("cafes")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", user.id);

  if (count >= 4) {
    alert("카페는 최대 4개까지 생성할 수 있습니다.");
    window.location.href = "./index.html";
    return;
  }

  const name = document.getElementById("cafe-name").value;
  const description = document.getElementById("cafe-description").value;

  const { data: cafeData, error } = await supabase
    .from("cafes")
    .insert({
      name,
      description,
      owner_id: user.id,
    })
    .select()
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  const { error: memberError } = await supabase.from("cafe_members").insert({
    cafe_id: cafeData.id,
    user_id: user.id,
  });

  if (memberError) {
    alert(memberError.message);
    return;
  }

  alert("카페 생성 완료!");
  window.location.href = "./index.html";
});
