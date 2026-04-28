async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "通信に失敗しました。");
  }

  return data;
}

const fallbackImage =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">' +
      '<rect width="640" height="480" fill="#e8eefc"/>' +
      '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" ' +
      'font-family="sans-serif" font-size="36" fill="#1b1f34">No Image</text>' +
    "</svg>"
  );

function formatPrice(price) {
  return `¥${Number(price).toLocaleString("ja-JP")}`;
}

function createFoodCard(food) {
  const card = document.createElement("article");
  card.className = "food-card";

  const image = document.createElement("img");
  image.className = "food-card__image";
  image.src = food.imagePath || fallbackImage;
  image.alt = food.name;

  const body = document.createElement("div");
  body.className = "food-card__body";

  const title = document.createElement("h3");
  title.className = "food-card__title";
  title.textContent = food.name;

  const price = document.createElement("p");
  price.className = "food-card__price";
  price.textContent = formatPrice(food.price);

  const description = document.createElement("p");
  description.className = "food-card__description";
  description.textContent = food.description || "説明はまだ登録されていません。";

  body.append(title, price, description);
  card.append(image, body);
  return card;
}

async function renderFoods() {
  const grid = document.getElementById("foodGrid");
  const emptyMessage = document.getElementById("emptyMessage");
  if (!grid || !emptyMessage) {
    return;
  }

  try {
    const foods = await fetchJson("/api/foods");
    grid.innerHTML = "";

    foods.forEach((food) => {
      grid.appendChild(createFoodCard(food));
    });

    emptyMessage.hidden = foods.length > 0;
  } catch (error) {
    emptyMessage.hidden = false;
    emptyMessage.textContent = error.message;
  }
}

async function updateUserNav() {
  const authNav = document.getElementById("authNav");
  const logoutBtn = document.getElementById("logoutBtn");
  const welcomeBox = document.getElementById("welcomeBox");
  if (!authNav) {
    return;
  }

  try {
    const me = await fetchJson("/api/me");
    if (me.loggedIn) {
      authNav.querySelectorAll("a").forEach((link) => {
        link.hidden = true;
      });
      if (logoutBtn) {
        logoutBtn.hidden = false;
        logoutBtn.addEventListener("click", async () => {
          await fetchJson("/api/logout", { method: "POST" });
          window.location.href = "/";
        });
      }
      if (welcomeBox) {
        welcomeBox.textContent = `${me.username} さん、ようこそ`;
      }
    } else {
      if (logoutBtn) {
        logoutBtn.hidden = true;
      }
      if (welcomeBox) {
        welcomeBox.textContent = "";
      }
    }
  } catch (_error) {
    if (welcomeBox) {
      welcomeBox.textContent = "";
    }
  }
}

function setMessage(message, isError = false) {
  const box = document.getElementById("messageBox");
  if (!box) {
    return;
  }

  box.textContent = message;
  box.classList.remove("is-error", "is-success");
  if (message) {
    box.classList.add(isError ? "is-error" : "is-success");
  }
}

function setupLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    try {
      await fetchJson("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password")
        })
      });
      window.location.href = "/";
    } catch (error) {
      setMessage(error.message, true);
    }
  });
}

function setupRegisterForm() {
  const form = document.getElementById("registerForm");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    try {
      await fetchJson("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password")
        })
      });
      setMessage("登録に成功しました。ログイン画面へ移動します。");
      window.setTimeout(() => {
        window.location.href = "/login.html";
      }, 900);
    } catch (error) {
      setMessage(error.message, true);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderFoods();
  updateUserNav();
  setupLoginForm();
  setupRegisterForm();
});
