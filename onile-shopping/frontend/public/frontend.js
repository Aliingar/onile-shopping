async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || (typeof t === "function" ? t("requestFailed") : "Request failed"));
  }

  return data;
}

function fallbackImageDataUrl() {
  const label = typeof t === "function" ? t("noImage") : "No Image";
  return (
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">' +
        '<rect width="640" height="480" fill="#eef5ef"/>' +
        `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="36" fill="#0f3d2e">${label}</text>` +
      "</svg>"
    )
  );
}

function formatPrice(value) {
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return String(value);
  return `Ks ${numberValue.toLocaleString("en-US")}`;
}

function createFoodCard(food) {
  const card = document.createElement("article");
  card.className = "food-card";

  const image = document.createElement("img");
  image.className = "food-card__image";
  image.src = food.imagePath || fallbackImageDataUrl();
  image.alt = food.name || "";

  const body = document.createElement("div");
  body.className = "food-card__body";

  const title = document.createElement("h3");
  title.className = "food-card__title";
  title.textContent = food.name || "";

  const price = document.createElement("p");
  price.className = "food-card__price";
  price.textContent = formatPrice(food.price);

  const description = document.createElement("p");
  description.className = "food-card__description";
  description.textContent = food.description || (typeof t === "function" ? t("description") : "");

  body.append(title, price, description);
  card.append(image, body);
  return card;
}

async function renderFoods() {
  const grid = document.getElementById("foodGrid");
  const emptyMessage = document.getElementById("emptyMessage");
  if (!grid || !emptyMessage) return;

  try {
    const foods = await fetchJson("/api/foods");
    grid.innerHTML = "";
    foods.forEach((food) => grid.appendChild(createFoodCard(food)));

    emptyMessage.hidden = foods.length > 0;
    emptyMessage.textContent = foods.length > 0 ? "" : (typeof t === "function" ? t("foodMenuText") : "");
  } catch (error) {
    emptyMessage.hidden = false;
    emptyMessage.textContent = error.message;
  }
}

window.renderFoods = renderFoods;

async function updateUserNav() {
  const nav = document.getElementById("authNav");
  const logoutBtn = document.getElementById("logoutBtn");
  const welcomeBox = document.getElementById("welcomeBox");
  if (!nav) return;

  try {
    const me = await fetchJson("/api/me");
    const loggedIn = Boolean(me.loggedIn);

    nav.querySelectorAll("a").forEach((link) => {
      // Keep admin login visible even when logged in
      if (link.getAttribute("href") === "/admin-login.html") return;
      link.hidden = loggedIn;
    });

    if (logoutBtn) {
      logoutBtn.hidden = !loggedIn;
      if (!logoutBtn.dataset.bound) {
        logoutBtn.dataset.bound = "true";
        logoutBtn.addEventListener("click", async () => {
          await fetchJson("/api/logout", { method: "POST" });
          window.location.href = "/";
        });
      }
    }

    if (welcomeBox) {
      const suffix = typeof t === "function" ? t("welcome") : "";
      welcomeBox.textContent = loggedIn ? `${me.username}${suffix}` : "";
    }
  } catch {
    if (welcomeBox) welcomeBox.textContent = "";
  }
}

function setMessage(message, isError = false) {
  const box = document.getElementById("messageBox");
  if (!box) return;
  box.textContent = message;
  box.classList.toggle("is-error", isError);
}

function setupLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) return;

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
  if (!form) return;

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
      setMessage("OK");
      window.setTimeout(() => {
        window.location.href = "/login.html";
      }, 700);
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

