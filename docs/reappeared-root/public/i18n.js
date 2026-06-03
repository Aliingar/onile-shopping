const translations = {
  ja: {
    brand: "AK Myanmar Food",
    heroTitle: "AK Myanmar Food",
    heroText: "本格ミャンマー料理を、見やすいカード一覧でゆっくり選べる料理メニューです。",
    foodMenu: "料理メニュー",
    foodMenuText: "登録された料理を写真付きで表示しています。",
    login: "ログイン",
    register: "新規登録",
    logout: "ログアウト",
    adminLogin: "管理者ログイン",
    welcome: "さん、ようこそ",
    emptyFood: "まだ料理が登録されていません。",
    noImage: "画像なし",
    price: "値段",
    description: "説明",
    addFood: "料理を追加",
    foodName: "料理名",
    photo: "写真",
    save: "登録する",
    edit: "編集",
    delete: "削除"
  },

  en: {
    brand: "AK Myanmar Food",
    heroTitle: "AK Myanmar Food",
    heroText: "Enjoy authentic Myanmar dishes in a clean and easy-to-browse food menu.",
    foodMenu: "Food Menu",
    foodMenuText: "Browse our registered dishes with photos.",
    login: "Login",
    register: "Register",
    logout: "Logout",
    adminLogin: "Admin Login",
    welcome: "welcome",
    emptyFood: "No food has been registered yet.",
    noImage: "No Image",
    price: "Price",
    description: "Description",
    addFood: "Add Food",
    foodName: "Food Name",
    photo: "Photo",
    save: "Save",
    edit: "Edit",
    delete: "Delete"
  },

  my: {
    brand: "AK Myanmar Food",
    heroTitle: "AK Myanmar Food",
    heroText: "မြန်မာအစားအစာများကို လွယ်ကူစွာ ကြည့်ရှုရွေးချယ်နိုင်သော မီနူးဖြစ်သည်။",
    foodMenu: "အစားအစာ မီနူး",
    foodMenuText: "မှတ်ပုံတင်ထားသော အစားအစာများကို ဓာတ်ပုံနှင့်အတူ ပြသထားပါသည်။",
    login: "လော့ဂ်အင်",
    register: "အကောင့်အသစ်ဖွင့်ရန်",
    logout: "လော့ဂ်အောက်",
    adminLogin: "စီမံခန့်ခွဲသူ လော့ဂ်အင်",
    welcome: "မင်္ဂလာပါ",
    emptyFood: "အစားအစာ မထည့်ရသေးပါ။",
    noImage: "ဓာတ်ပုံမရှိပါ",
    price: "ဈေးနှုန်း",
    description: "ဖော်ပြချက်",
    addFood: "အစားအစာ ထည့်ရန်",
    foodName: "အစားအစာအမည်",
    photo: "ဓာတ်ပုံ",
    save: "သိမ်းဆည်းရန်",
    edit: "ပြင်ဆင်ရန်",
    delete: "ဖျက်ရန်"
  }
};

function getCurrentLang() {
  return localStorage.getItem("siteLang") || "ja";
}

function t(key) {
  const lang = getCurrentLang();
  return translations[lang]?.[key] || translations.ja[key] || key;
}

function applyTranslations() {
  const lang = getCurrentLang();
  document.documentElement.lang = lang === "my" ? "my" : lang;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    element.placeholder = t(key);
  });

  const selector = document.getElementById("languageSelect");
  if (selector) {
    selector.value = lang;
  }
}

function setupLanguageSwitcher() {
  const selector = document.getElementById("languageSelect");
  if (!selector) return;

  selector.addEventListener("change", () => {
    localStorage.setItem("siteLang", selector.value);
    applyTranslations();

    if (typeof renderFoods === "function") {
      renderFoods();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupLanguageSwitcher();
  applyTranslations();
});