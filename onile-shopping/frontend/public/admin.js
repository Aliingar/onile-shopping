const STORAGE_KEY = "ak-myanmar-food-language";
const supportedLanguages = ["ja", "my", "en"];

const translations = {
  ja: {
    "title.adminLogin": "管理者ログイン | AK Myanmar Food",
    "title.adminDashboard": "管理者ダッシュボード | AK Myanmar Food",
    "title.adminUsers": "管理者管理 | AK Myanmar Food",
    "admin.badgeLogin": "ADMIN LOGIN",
    "admin.badgeDashboard": "ADMIN DASHBOARD",
    "admin.badgeUsers": "ADMIN USERS",
    "admin.navFood": "料理管理",
    "admin.navUsers": "管理者管理",
    "admin.navLogout": "ログアウト",
    "admin.loginTitle": "管理者ログイン",
    "admin.loginLead": "管理者アカウントでログインして、料理や管理者を管理できます。",
    "admin.loginFormTitle": "管理者ログイン",
    "admin.loginButton": "管理者としてログイン",
    "admin.dashboardTitle": "管理者ダッシュボード",
    "admin.dashboardLead": "料理の追加・編集・削除を行い、一般ユーザー画面にすぐ反映できます。",
    "admin.addFoodTitle": "料理を追加",
    "admin.addFoodHint": "料理名、値段、説明、料理写真を登録すると一般ユーザー画面に反映されます。",
    "admin.foodNameLabel": "料理名",
    "admin.foodPriceLabel": "値段",
    "admin.foodDescriptionLabel": "説明",
    "admin.foodImageLabel": "料理写真アップロード",
    "admin.foodNamePlaceholder": "料理名を入力",
    "admin.foodPricePlaceholder": "値段を入力",
    "admin.foodDescriptionPlaceholder": "料理の特徴やおすすめポイント",
    "admin.previewLabel": "画像プレビュー",
    "admin.createFoodButton": "料理を登録",
    "admin.updateFoodButton": "料理を更新",
    "admin.cancelEditButton": "編集をやめる",
    "admin.registeredFoodsTitle": "登録済み料理",
    "admin.registeredFoodsHint": "一覧から内容を確認し、不要な料理は削除できます。",
    "admin.noFoods": "まだ料理が登録されていません。",
    "admin.usersTitle": "管理者管理",
    "admin.usersLead": "管理者アカウントの追加、一覧表示、削除を行えます。自分自身は削除できません。",
    "admin.addAdminTitle": "管理者を追加",
    "admin.addAdminHint": "新しい管理者IDとパスワードを登録します。",
    "admin.createAdminButton": "管理者を追加",
    "admin.adminListTitle": "管理者一覧",
    "admin.adminListHint": "自分以外の管理者は削除できます。",
    "admin.noAdmins": "管理者が見つかりません。",
    "admin.usernameLabel": "管理者ID",
    "admin.passwordLabel": "パスワード",
    "admin.usernamePlaceholder": "管理者IDを入力",
    "admin.passwordPlaceholder": "パスワードを入力",
    "admin.noDescription": "説明はまだ登録されていません。",
    "admin.selfTag": "（自分）",
    "admin.metaRow": "ID: {id} / 作成: {createdAt}",
    "admin.editButton": "編集",
    "admin.deleteButton": "削除",
    "admin.confirmDeleteFood": "「{name}」を削除しますか？",
    "admin.confirmDeleteUser": "管理者「{name}」を削除しますか？",
    "admin.editMode": "編集モード: 「{name}」",
    "admin.foodRequired": "料理名と値段は必須です。",
    "admin.foodCreated": "料理を登録しました。",
    "admin.foodUpdated": "料理を更新しました。",
    "admin.foodDeleted": "料理を削除しました。",
    "admin.adminCreated": "管理者を追加しました。",
    "admin.adminDeleted": "管理者を削除しました。",
    "message.requestFailed": "通信に失敗しました。"
  },
  my: {
    "title.adminLogin": "စီမံခန့်ခွဲသူ လော့ဂ်အင် | AK Myanmar Food",
    "title.adminDashboard": "စီမံခန့်ခွဲမှု စာမျက်နှာ | AK Myanmar Food",
    "title.adminUsers": "စီမံခန့်ခွဲသူများ | AK Myanmar Food",
    "admin.badgeLogin": "ADMIN LOGIN",
    "admin.badgeDashboard": "ADMIN DASHBOARD",
    "admin.badgeUsers": "ADMIN USERS",
    "admin.navFood": "အစားအစာစီမံခန့်ခွဲမှု",
    "admin.navUsers": "စီမံခန့်ခွဲသူများ",
    "admin.navLogout": "ထွက်မည်",
    "admin.loginTitle": "စီမံခန့်ခွဲသူ လော့ဂ်အင်",
    "admin.loginLead": "စီမံခန့်ခွဲသူ အကောင့်ဖြင့် ဝင်ရောက်ပြီး အစားအစာနှင့် စီမံခန့်ခွဲသူများကို စီမံနိုင်ပါသည်။",
    "admin.loginFormTitle": "စီမံခန့်ခွဲသူ လော့ဂ်အင်",
    "admin.loginButton": "စီမံခန့်ခွဲသူအဖြစ် ဝင်မည်",
    "admin.dashboardTitle": "စီမံခန့်ခွဲမှု စာမျက်နှာ",
    "admin.dashboardLead": "အစားအစာများကို ထည့်၊ ပြင်၊ ဖျက် လုပ်ဆောင်နိုင်ပြီး အသုံးပြုသူမျက်နှာပြင်သို့ ချက်ချင်း ပြသပါသည်။",
    "admin.addFoodTitle": "အစားအစာ ထည့်ရန်",
    "admin.addFoodHint": "အမည်၊ ဈေးနှုန်း၊ ဖော်ပြချက်နှင့် ဓာတ်ပုံ ထည့်သွင်းပါက အသုံးပြုသူမျက်နှာပြင်တွင် ပြသပါမည်။",
    "admin.foodNameLabel": "အစားအစာအမည်",
    "admin.foodPriceLabel": "ဈေးနှုန်း",
    "admin.foodDescriptionLabel": "ဖော်ပြချက်",
    "admin.foodImageLabel": "အစားအစာဓာတ်ပုံ တင်ရန်",
    "admin.foodNamePlaceholder": "အစားအစာအမည် ထည့်ပါ",
    "admin.foodPricePlaceholder": "ဈေးနှုန်း ထည့်ပါ",
    "admin.foodDescriptionPlaceholder": "အစားအစာ၏ ထူးခြားချက် သို့မဟုတ် အကြံပြုချက်",
    "admin.previewLabel": "ဓာတ်ပုံအကြိုမြင်ကွင်း",
    "admin.createFoodButton": "အစားအစာ ထည့်မည်",
    "admin.updateFoodButton": "အစားအစာ ပြင်မည်",
    "admin.cancelEditButton": "ပြင်ဆင်မှု ရပ်မည်",
    "admin.registeredFoodsTitle": "မှတ်တမ်းဝင် အစားအစာများ",
    "admin.registeredFoodsHint": "စာရင်းကို ကြည့်ရှုပြီး မလိုအပ်သော အစားအစာများကို ဖျက်နိုင်ပါသည်။",
    "admin.noFoods": "အစားအစာများ မထည့်ထားသေးပါ။",
    "admin.usersTitle": "စီမံခန့်ခွဲသူများ",
    "admin.usersLead": "စီမံခန့်ခွဲသူ အကောင့်အသစ်များ ထည့်နိုင်ပြီး စာရင်းကြည့်ရှုကာ ဖျက်နိုင်ပါသည်။ မိမိကိုယ်တိုင်ကို မဖျက်နိုင်ပါ။",
    "admin.addAdminTitle": "စီမံခန့်ခွဲသူ ထည့်ရန်",
    "admin.addAdminHint": "စီမံခန့်ခွဲသူအမည်နှင့် စကားဝှက်အသစ် ထည့်သွင်းပါ။",
    "admin.createAdminButton": "စီမံခန့်ခွဲသူ ထည့်မည်",
    "admin.adminListTitle": "စီမံခန့်ခွဲသူ စာရင်း",
    "admin.adminListHint": "မိမိမှလွဲ၍ အခြားစီမံခန့်ခွဲသူများကို ဖျက်နိုင်ပါသည်။",
    "admin.noAdmins": "စီမံခန့်ခွဲသူ မတွေ့ပါ။",
    "admin.usernameLabel": "စီမံခန့်ခွဲသူအမည်",
    "admin.passwordLabel": "စကားဝှက်",
    "admin.usernamePlaceholder": "စီမံခန့်ခွဲသူအမည် ထည့်ပါ",
    "admin.passwordPlaceholder": "စကားဝှက် ထည့်ပါ",
    "admin.noDescription": "ဖော်ပြချက် မထည့်ထားသေးပါ။",
    "admin.selfTag": " (မိမိ)",
    "admin.metaRow": "ID: {id} / ဖန်တီးချိန်: {createdAt}",
    "admin.editButton": "ပြင်မည်",
    "admin.deleteButton": "ဖျက်မည်",
    "admin.confirmDeleteFood": "「{name}」ကို ဖျက်မလား?",
    "admin.confirmDeleteUser": "စီမံခန့်ခွဲသူ 「{name}」 ကို ဖျက်မလား?",
    "admin.editMode": "ပြင်ဆင်မှု: 「{name}」",
    "admin.foodRequired": "အစားအစာအမည်နှင့် ဈေးနှုန်း လိုအပ်ပါသည်။",
    "admin.foodCreated": "အစားအစာ ထည့်သွင်းပြီးပါပြီ။",
    "admin.foodUpdated": "အစားအစာ ပြင်ဆင်ပြီးပါပြီ။",
    "admin.foodDeleted": "အစားအစာ ဖျက်ပြီးပါပြီ။",
    "admin.adminCreated": "စီမံခန့်ခွဲသူ ထည့်ပြီးပါပြီ။",
    "admin.adminDeleted": "စီမံခန့်ခွဲသူ ဖျက်ပြီးပါပြီ။",
    "message.requestFailed": "ဆက်သွယ်မှု မအောင်မြင်ပါ။"
  },
  en: {
    "title.adminLogin": "Admin Login | AK Myanmar Food",
    "title.adminDashboard": "Admin Dashboard | AK Myanmar Food",
    "title.adminUsers": "Admin Users | AK Myanmar Food",
    "admin.badgeLogin": "ADMIN LOGIN",
    "admin.badgeDashboard": "ADMIN DASHBOARD",
    "admin.badgeUsers": "ADMIN USERS",
    "admin.navFood": "Food Management",
    "admin.navUsers": "Admin Management",
    "admin.navLogout": "Logout",
    "admin.loginTitle": "Admin Login",
    "admin.loginLead": "Log in with an admin account to manage foods and other admins.",
    "admin.loginFormTitle": "Admin Login",
    "admin.loginButton": "Log in as admin",
    "admin.dashboardTitle": "Admin Dashboard",
    "admin.dashboardLead": "Add, edit, and delete dishes, then reflect them immediately on the public menu.",
    "admin.addFoodTitle": "Add Food",
    "admin.addFoodHint": "Register the dish name, price, description, and photo to publish it on the public page.",
    "admin.foodNameLabel": "Food name",
    "admin.foodPriceLabel": "Price",
    "admin.foodDescriptionLabel": "Description",
    "admin.foodImageLabel": "Upload food image",
    "admin.foodNamePlaceholder": "Enter food name",
    "admin.foodPricePlaceholder": "Enter price",
    "admin.foodDescriptionPlaceholder": "Highlights or recommended notes for the dish",
    "admin.previewLabel": "Image preview",
    "admin.createFoodButton": "Create food",
    "admin.updateFoodButton": "Update food",
    "admin.cancelEditButton": "Cancel editing",
    "admin.registeredFoodsTitle": "Registered Foods",
    "admin.registeredFoodsHint": "Review the list and remove dishes that are no longer needed.",
    "admin.noFoods": "No foods have been registered yet.",
    "admin.usersTitle": "Admin Management",
    "admin.usersLead": "Add, view, and delete admin accounts. You cannot delete yourself.",
    "admin.addAdminTitle": "Add Admin",
    "admin.addAdminHint": "Register a new admin ID and password.",
    "admin.createAdminButton": "Create admin",
    "admin.adminListTitle": "Admin List",
    "admin.adminListHint": "You can delete other admins, but not yourself.",
    "admin.noAdmins": "No admins found.",
    "admin.usernameLabel": "Admin ID",
    "admin.passwordLabel": "Password",
    "admin.usernamePlaceholder": "Enter admin ID",
    "admin.passwordPlaceholder": "Enter password",
    "admin.noDescription": "No description has been added yet.",
    "admin.selfTag": " (you)",
    "admin.metaRow": "ID: {id} / Created: {createdAt}",
    "admin.editButton": "Edit",
    "admin.deleteButton": "Delete",
    "admin.confirmDeleteFood": "Delete \"{name}\"?",
    "admin.confirmDeleteUser": "Delete admin \"{name}\"?",
    "admin.editMode": "Editing: \"{name}\"",
    "admin.foodRequired": "Food name and price are required.",
    "admin.foodCreated": "Food created.",
    "admin.foodUpdated": "Food updated.",
    "admin.foodDeleted": "Food deleted.",
    "admin.adminCreated": "Admin created.",
    "admin.adminDeleted": "Admin deleted.",
    "message.requestFailed": "Request failed."
  }
};

let currentLanguage = localStorage.getItem(STORAGE_KEY) || "ja";
if (!supportedLanguages.includes(currentLanguage)) {
  currentLanguage = "ja";
}

let editingFoodId = null;
let editingFoodImagePath = "";

function t(key, values = {}) {
  const dict = translations[currentLanguage] || translations.ja;
  const template = dict[key] || translations.ja[key] || key;
  return Object.entries(values).reduce((result, [name, value]) => {
    return result.replaceAll(`{${name}}`, value);
  }, template);
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage;

  const titleNode = document.querySelector("title[data-page-title]");
  if (titleNode) {
    document.title = t(`title.${titleNode.dataset.pageTitle}`);
  }

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
  });

  document.querySelectorAll(".lang-switch__btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === currentLanguage);
  });
}

function setLanguage(lang) {
  if (!supportedLanguages.includes(lang)) {
    return;
  }
  currentLanguage = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  applyTranslations();
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || t("message.requestFailed"));
  }

  return data;
}

const fallbackImage =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">' +
      '<rect width="640" height="480" fill="#d7eadf"/>' +
      '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" ' +
      'font-family="sans-serif" font-size="36" fill="#103b2a">AK Myanmar Food</text>' +
    "</svg>"
  );

function formatPrice(price) {
  return `Ks ${Number(price).toLocaleString("en-US")}`;
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

function setupLanguageSwitcher() {
  document.querySelectorAll(".lang-switch__btn").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang));
  });
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

function updateFoodFormLabelsForMode() {
  const submitBtn = document.getElementById("submitFoodBtn");
  const cancelBtn = document.getElementById("cancelEditBtn");
  if (submitBtn) {
    submitBtn.textContent = editingFoodId ? t("admin.updateFoodButton") : t("admin.createFoodButton");
  }
  if (cancelBtn) {
    cancelBtn.textContent = t("admin.cancelEditButton");
  }
}

function enterEditMode(food) {
  editingFoodId = food.id;
  editingFoodImagePath = food.imagePath || "";

  const nameInput = document.getElementById("nameInput");
  const priceInput = document.getElementById("priceInput");
  const descriptionInput = document.getElementById("descriptionInput");
  const imageInput = document.getElementById("imageInput");
  const cancelBtn = document.getElementById("cancelEditBtn");

  if (nameInput) nameInput.value = food.name || "";
  if (priceInput) priceInput.value = String(food.price ?? "");
  if (descriptionInput) descriptionInput.value = food.description || "";
  if (imageInput) imageInput.value = "";
  if (cancelBtn) cancelBtn.hidden = false;

  setPreviewImage(editingFoodImagePath || fallbackImage);
  updateFoodFormLabelsForMode();
  setMessage("formMessage", t("admin.editMode", { name: food.name }), false);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function exitEditMode() {
  editingFoodId = null;
  editingFoodImagePath = "";

  const form = document.getElementById("foodForm");
  const cancelBtn = document.getElementById("cancelEditBtn");

  if (form) form.reset();
  if (cancelBtn) cancelBtn.hidden = true;

  setPreviewImage("");
  updateFoodFormLabelsForMode();
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
  description.textContent = food.description || t("admin.noDescription");

  const footer = document.createElement("div");
  footer.className = "food-card__footer";

  const date = document.createElement("span");
  date.className = "food-card__date";
  date.textContent = formatDate(food.createdAt);

  const editButton = document.createElement("button");
  editButton.className = "card-button card-button--neutral";
  editButton.textContent = t("admin.editButton");
  editButton.addEventListener("click", () => enterEditMode(food));

  const deleteButton = document.createElement("button");
  deleteButton.className = "card-button card-button--danger";
  deleteButton.textContent = t("admin.deleteButton");
  deleteButton.addEventListener("click", async () => {
    if (!window.confirm(t("admin.confirmDeleteFood", { name: food.name }))) return;

    try {
      await fetchJson(`/api/foods/${food.id}`, { method: "DELETE" });
      if (editingFoodId === food.id) {
        exitEditMode();
      }
      setMessage("formMessage", t("admin.foodDeleted"));
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
    emptyMessage.textContent = t("admin.noFoods");
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
      setMessage("formMessage", t("admin.foodRequired"), true);
      return;
    }

    try {
      const formData = createFoodFormData({ name, price, description, imageFile });
      if (editingFoodId) {
        await fetchJson(`/api/foods/${editingFoodId}`, { method: "PUT", body: formData });
        setMessage("formMessage", t("admin.foodUpdated"));
      } else {
        await fetchJson("/api/foods", { method: "POST", body: formData });
        setMessage("formMessage", t("admin.foodCreated"));
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
  name.textContent = admin.username + (admin.id === currentAdminId ? t("admin.selfTag") : "");

  const meta = document.createElement("div");
  meta.className = "admin-row__meta";
  meta.textContent = t("admin.metaRow", {
    id: String(admin.id),
    createdAt: formatDate(admin.createdAt)
  });

  left.append(name, meta);

  const btn = document.createElement("button");
  btn.className = "card-button card-button--danger";
  btn.textContent = t("admin.deleteButton");
  btn.disabled = admin.id === currentAdminId;
  btn.addEventListener("click", async () => {
    if (!window.confirm(t("admin.confirmDeleteUser", { name: admin.username }))) return;
    try {
      await fetchJson(`/api/admins/${admin.id}`, { method: "DELETE" });
      setMessage("adminUserMessage", t("admin.adminDeleted"));
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
    empty.textContent = t("admin.noAdmins");
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
      setMessage("adminUserMessage", t("admin.adminCreated"));
      await loadAdmins(currentAdminId);
    } catch (error) {
      setMessage("adminUserMessage", error.message, true);
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  setupLanguageSwitcher();
  applyTranslations();

  const me = await requireAdminOrRedirect();

  setupAdminLoginForm();
  setupAdminLogoutButton();
  setupFoodForm();
  updateFoodFormLabelsForMode();

  if (document.getElementById("adminFoodGrid")) {
    await loadAdminFoods();
  }

  if (document.getElementById("adminList")) {
    const currentAdminId = me?.adminId || 0;
    setupAdminCreateForm(currentAdminId);
    await loadAdmins(currentAdminId);
  }
});
