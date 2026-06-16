import { supabase } from "./supabase";

const createBtn = document.getElementById("create-btn");

createBtn.addEventListener("click", async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name = document.getElementById("cafe-name").value;
  const description = document.getElementById("cafe-description").value;

  const { error } = await supabase.from("cafes").insert({
    name,
    description,
    owner_id: user.id,
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("카페 생성 완료!");
  window.location.href = "./index.html";
});
