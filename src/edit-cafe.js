import { supabase } from "./supabase";

const params = new URLSearchParams(location.search);
const cafeId = params.get("id");

const {
  data: { user },
} = await supabase.auth.getUser();

const { data: cafe } = await supabase
  .from("cafes")
  .select("*")
  .eq("id", cafeId)
  .single();

if (!user || user.id !== cafe.owner_id) {
  alert("권한이 없습니다.");
  location.href = `cafe.html?id=${cafeId}`;
  return;
}

document.getElementById("cafe-name").value = cafe.name;
document.getElementById("cafe-description").value = cafe.description ?? "";

document.getElementById("save-btn").addEventListener("click", async () => {
  const name = document.getElementById("cafe-name").value.trim();
  const description = document.getElementById("cafe-description").value.trim();

  const { error } = await supabase
    .from("cafes")
    .update({
      name,
      description,
    })
    .eq("id", cafeId);

  if (error) {
    alert(error.message);
    return;
  }

  alert("카페가 수정되었습니다.");

  location.href = `cafe.html?id=${cafeId}`;
});
