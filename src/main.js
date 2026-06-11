import "./style.css";
import { supabase } from "./supabase.js"; //다른 파일에서 supabase를 가져온다

const cafeList = document.querySelector("#cafeList");

async function loadCafes() {
  const { data, error } = await supabase.from("cafes").select("*");

  if (error) {
    console.error(error);
    return;
  }

  cafeList.innerHTML = "";

  data.forEach((cafe) => {
    cafeList.innerHTML += `
            <div class="cafe-card">
                <div class="cafe-image"></div>

                <div class="cafe-info">
                    <div class="cafe-title">
                        ${cafe.name}
                    </div>

                    <div class="cafe-desc">
                        ${cafe.description}
                    </div>
                </div>
            </div>
        `;
  });
}

loadCafes();
