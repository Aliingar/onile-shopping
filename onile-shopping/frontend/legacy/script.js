const STORAGE_KEY = "food-catalog-products-v2";

const dom = {
  productForm: document.getElementById("productForm"),
  nameInput: document.getElementById("nameInput"),
  priceInput: document.getElementById("priceInput"),
  fileInput: document.getElementById("fileInput"),
  imageUrlInput: document.getElementById("imageUrlInput"),
  previewBox: document.getElementById("previewBox"),
  previewImage: document.getElementById("previewImage"),
  clearAllBtn: document.getElementById("clearAllBtn"),
  statusText: document.getElementById("statusText"),
  catalog: document.getElementById("catalog"),
  emptyMessage: document.getElementById("emptyMessage")
};

let products = [];
let selectedImageData = "";

function loadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    products = Array.isArray(parsed) ? parsed : [];
  } catch {
    products = [];
  }
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function updateStatus() {
  dom.statusText.textContent = `保存済み商品: ${products.length}件`;
  dom.emptyMessage.style.display = products.length === 0 ? "block" : "none";
}

function showPreview(src) {
  if (!src) {
    dom.previewBox.hidden = true;
    dom.previewImage.removeAttribute("src");
    return;
  }

  dom.previewImage.src = src;
  dom.previewBox.hidden = false;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("画像ファイルの読み込みに失敗しました。"));
    reader.readAsDataURL(file);
  });
}

function createProductCard(product, index) {
  const card = document.createElement("article");
  card.className = "product-card";

  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name;
  img.loading = "lazy";

  const body = document.createElement("div");
  body.className = "product-card__body";

  const name = document.createElement("h3");
  name.textContent = product.name;

  const price = document.createElement("p");
  price.className = "price";
  price.textContent = product.price;

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "削除";
  removeBtn.addEventListener("click", () => {
    products.splice(index, 1);
    saveProducts();
    renderCatalog();
  });

  body.appendChild(name);
  body.appendChild(price);
  body.appendChild(removeBtn);
  card.appendChild(img);
  card.appendChild(body);

  return card;
}

function renderCatalog() {
  dom.catalog.innerHTML = "";
  products.forEach((product, index) => {
    dom.catalog.appendChild(createProductCard(product, index));
  });
  updateStatus();
}

async function handleFileChange() {
  const file = dom.fileInput.files[0];
  if (!file) {
    selectedImageData = "";
    showPreview(dom.imageUrlInput.value.trim());
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("画像ファイルを選択してください。");
    dom.fileInput.value = "";
    selectedImageData = "";
    showPreview("");
    return;
  }

  try {
    selectedImageData = await readFileAsDataUrl(file);
    dom.imageUrlInput.value = "";
    showPreview(selectedImageData);
  } catch (error) {
    alert(error.message);
  }
}

function handleImageUrlInput() {
  const url = dom.imageUrlInput.value.trim();
  if (url) {
    dom.fileInput.value = "";
    selectedImageData = "";
  }
  showPreview(url || selectedImageData);
}

async function handleSubmit(event) {
  event.preventDefault();

  const name = dom.nameInput.value.trim();
  const price = dom.priceInput.value.trim();
  const imageFromUrl = dom.imageUrlInput.value.trim();
  const image = selectedImageData || imageFromUrl;

  if (!name || !price) {
    alert("商品名と値段を入力してください。");
    return;
  }

  if (!image) {
    alert("写真をアップロードするか、写真パスまたは画像URLを入力してください。");
    return;
  }

  products.unshift({
    id: Date.now(),
    name,
    price,
    image
  });

  saveProducts();
  renderCatalog();
  dom.productForm.reset();
  selectedImageData = "";
  showPreview("");
}

function clearAllProducts() {
  if (!confirm("保存済み商品をすべて削除します。よろしいですか？")) {
    return;
  }

  products = [];
  saveProducts();
  renderCatalog();
}

function bindEvents() {
  dom.fileInput.addEventListener("change", handleFileChange);
  dom.imageUrlInput.addEventListener("input", handleImageUrlInput);
  dom.productForm.addEventListener("submit", handleSubmit);
  dom.clearAllBtn.addEventListener("click", clearAllProducts);
}

function init() {
  loadProducts();
  renderCatalog();
  bindEvents();
}

init();
