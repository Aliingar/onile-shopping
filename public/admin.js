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

let editingFoodId = null;
let editingFoodImagePath = "";

function formatPrice(price) {
  return `¥${Number(price).toLocaleString("ja-JP")}`;
}

function formatDate(value) {
  return new Date(value).toLocaleString("ja-JP");
}

function setMessage(id, message, isError = false) {
  const box = document.getElementById(id);
  if (!box) return;

  box.textContent = message;
  box.classList.remove("is-error", "is-success");
  if (message) {
    box.classList.add(isError ? "is-error" : "is-success");
  }
}

async function requireAdminOrRedirect() {
  const pathname = window.location.pathname;
  const guarded = pathname.endsWith("/admin.html") || pathname.endsWith("/admin-users.html");
  if (!guarded) return null;

  try {
    const me = await fetchJson("/api/admin/me");
    if (!me.isAdmin) {
      window.location.href = "/admin-login.html";
      return null;
    }
    return me;
  } catch {
    window.location.href = "/admin-login.html";
    return null;
  }
}

function setupAdminLoginForm() {
  const form = document.getElementById("adminLoginForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    try {
      await fetchJson("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password")
        })
      });
      window.location.href = "/admin.html";
    } catch (error) {
      setMessage("messageBox", error.message, true);
    }
  });
}

function setupAdminLogoutButton() {
  const logoutBtn = document.getElementById("adminLogoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", async () => {
    await fetchJson("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin-login.html";
  });
}

function setPreviewImage(sourceUrl) {
  const previewBox = document.getElementById("previewBox");
  const previewImage = document.getElementById("previewImage");
  if (!previewBox || !previewImage) return;

  if (!sourceUrl) {
    previewBox.hidden = true;
    previewImage.removeAttribute("src");
    return;
  }

  previewImage.src = sourceUrl;
  previewBox.hidden = false;
}

function createFoodFormData({ name, price, description, imageFile }) {
  const formData = new FormData();
  formData.set("name", name);
  formData.set("price", String(price));
  formData.set("description", description || "");
  if (imageFile) {
    formData.set("image", imageFile);
  }
  return formData;
}

function enterEditMode(food) {
  editingFoodId = food.id;
  editingFoodImagePath = food.imagePath || "";

  const nameInput = document.getElementById("nameInput");
  const priceInput = document.getElementById("priceInput");
  const descriptionInput = document.getElementById("descriptionInput");
  const imageInput = document.getElementById("imageInput");
  const submitBtn = document.getElementById("submitFoodBtn");
  const cancelBtn = document.getElementById("cancelEditBtn");

  if (nameInput) nameInput.value = food.name || "";
  if (priceInput) priceInput.value = String(food.price ?? "");
  if (descriptionInput) descriptionInput.value = food.description || "";
  if (imageInput) imageInput.value = "";

  setPreviewImage(editingFoodImagePath || fallbackImage);

  if (submitBtn) submitBtn.textContent = "料理を更新";
  if (cancelBtn) cancelBtn.hidden = false;

  setMessage("formMessage", `編集モード: 「${food.name}」`, false);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function exitEditMode() {
  editingFoodId = null;
  editingFoodImagePath = "";

  const form = document.getElementById("foodForm");
  const submitBtn = document.getElementById("submitFoodBtn");
  const cancelBtn = document.getElementById("cancelEditBtn");

  if (form) form.reset();
  if (submitBtn) submitBtn.textContent = "料理を登録";
  if (cancelBtn) cancelBtn.hidden = true;

  setPreviewImage("");
  setMessage("formMessage", "", false);
}

function createAdminFoodCard(food) {
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

  const footer = document.createElement("div");
  footer.className = "food-card__footer";

  const date = document.createElement("span");
  date.className = "food-card__date";
  date.textContent = formatDate(food.createdAt);

  const editButton = document.createElement("button");
  editButton.className = "card-button card-button--neutral";
  editButton.textContent = "編集";
  editButton.addEventListener("click", () => enterEditMode(food));

  const deleteButton = document.createElement("button");
  deleteButton.className = "card-button card-button--danger";
  deleteButton.textContent = "削除";
  deleteButton.addEventListener("click", async () => {
    if (!window.confirm(`「${food.name}」を削除しますか？`)) return;

    try {
      await fetchJson(`/api/foods/${food.id}`, { method: "DELETE" });
      if (editingFoodId === food.id) {
        exitEditMode();
      }
      setMessage("formMessage", "料理を削除しました。");
      await loadAdminFoods();
    } catch (error) {
      setMessage("formMessage", error.message, true);
    }
  });

  footer.append(date, editButton, deleteButton);
  body.append(title, price, description, footer);
  card.append(image, body);
  return card;
}

async function loadAdminFoods() {
  const grid = document.getElementById("adminFoodGrid");
  const emptyMessage = document.getElementById("adminEmptyMessage");
  if (!grid || !emptyMessage) return;

  try {
    const foods = await fetchJson("/api/foods");
    grid.innerHTML = "";
    foods.forEach((food) => grid.appendChild(createAdminFoodCard(food)));
    emptyMessage.hidden = foods.length > 0;
  } catch (error) {
    emptyMessage.hidden = false;
    emptyMessage.textContent = error.message;
  }
}

function setupFoodForm() {
  const form = document.getElementById("foodForm");
  const imageInput = document.getElementById("imageInput");
  const cancelBtn = document.getElementById("cancelEditBtn");

  if (!form || !imageInput) return;

  imageInput.addEventListener("change", () => {
    const file = imageInput.files && imageInput.files[0];
    if (!file) {
      setPreviewImage(editingFoodImagePath || "");
      return;
    }
    setPreviewImage(URL.createObjectURL(file));
  });

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => exitEditMode());
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = String(document.getElementById("nameInput")?.value || "").trim();
    const priceRaw = String(document.getElementById("priceInput")?.value || "").trim();
    const description = String(document.getElementById("descriptionInput")?.value || "").trim();
    const imageFile = imageInput.files && imageInput.files[0] ? imageInput.files[0] : null;
    const price = Number.parseInt(priceRaw, 10);

    if (!name || Number.isNaN(price)) {
      setMessage("formMessage", "料理名と値段は必須です。", true);
      return;
    }

    try {
      const formData = createFoodFormData({ name, price, description, imageFile });
      if (editingFoodId) {
        await fetchJson(`/api/foods/${editingFoodId}`, { method: "PUT", body: formData });
        setMessage("formMessage", "料理を更新しました。");
      } else {
        await fetchJson("/api/foods", { method: "POST", body: formData });
        setMessage("formMessage", "料理を登録しました。");
      }

      exitEditMode();
      await loadAdminFoods();
    } catch (error) {
      setMessage("formMessage", error.message, true);
    }
  });
}

function createAdminRow(admin, currentAdminId) {
  const row = document.createElement("div");
  row.className = "admin-row";

  const left = document.createElement("div");

  const name = document.createElement("div");
  name.className = "admin-row__name";
  name.textContent = admin.username + (admin.id === currentAdminId ? "（自分）" : "");

  const meta = document.createElement("div");
  meta.className = "admin-row__meta";
  meta.textContent = `ID: ${admin.id} / 作成: ${formatDate(admin.createdAt)}`;

  left.append(name, meta);

  const btn = document.createElement("button");
  btn.className = "card-button card-button--danger";
  btn.textContent = "削除";
  btn.disabled = admin.id === currentAdminId;
  btn.addEventListener("click", async () => {
    if (!window.confirm(`管理者「${admin.username}」を削除しますか？`)) return;
    try {
      await fetchJson(`/api/admins/${admin.id}`, { method: "DELETE" });
      setMessage("adminUserMessage", "管理者を削除しました。");
      await loadAdmins(currentAdminId);
    } catch (error) {
      setMessage("adminUserMessage", error.message, true);
    }
  });

  row.append(left, btn);
  return row;
}

async function loadAdmins(currentAdminId) {
  const list = document.getElementById("adminList");
  const empty = document.getElementById("adminListEmpty");
  if (!list || !empty) return;

  try {
    const admins = await fetchJson("/api/admins");
    list.innerHTML = "";
    admins.forEach((admin) => list.appendChild(createAdminRow(admin, currentAdminId)));
    empty.hidden = admins.length > 0;
  } catch (error) {
    empty.hidden = false;
    empty.textContent = error.message;
  }
}

function setupAdminCreateForm(currentAdminId) {
  const form = document.getElementById("adminCreateForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");

    try {
      await fetchJson("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      form.reset();
      setMessage("adminUserMessage", "管理者を追加しました。");
      await loadAdmins(currentAdminId);
    } catch (error) {
      setMessage("adminUserMessage", error.message, true);
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const me = await requireAdminOrRedirect();

  setupAdminLoginForm();
  setupAdminLogoutButton();
  setupFoodForm();

  if (document.getElementById("adminFoodGrid")) {
    await loadAdminFoods();
  }

  if (document.getElementById("adminList")) {
    const currentAdminId = me?.adminId || 0;
    setupAdminCreateForm(currentAdminId);
    await loadAdmins(currentAdminId);
  }
});

