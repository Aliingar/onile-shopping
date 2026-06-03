const express = require("express");
const session = require("express-session");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const SESSION_SECRET = process.env.SESSION_SECRET || "dev-session-secret-change-me";

const ROOT_DIR = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "frontend", "public");
const UPLOADS_DIR = path.join(ROOT_DIR, "backend", "uploads");
const ICON_DIR = path.join(PUBLIC_DIR, "icon");
const DB_PATH = path.join(ROOT_DIR, "database", "database.sqlite");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows);
    });
  });
}

async function initDb() {
  await run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS foods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      description TEXT,
      image_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const row = await get("SELECT COUNT(*) AS count FROM admins");
  if (Number(row?.count || 0) === 0) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await run("INSERT INTO admins (username, password_hash) VALUES (?, ?)", ["admin", passwordHash]);
    console.log("Seeded initial admin: admin / admin123 (demo only)");
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, UPLOADS_DIR),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname || "");
    const base = path
      .basename(file.originalname || "image", extension)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 60);
    callback(null, `${Date.now()}-${base}${extension || ".png"}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (_req, file, callback) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      callback(null, true);
      return;
    }
    callback(new Error("画像ファイルのみアップロードできます。"));
  }
});

function sanitizeFood(food) {
  return {
    id: food.id,
    name: food.name,
    price: food.price,
    description: food.description || "",
    imagePath: food.image_path || "",
    createdAt: food.created_at
  };
}

function sanitizeAdmin(admin) {
  return {
    id: admin.id,
    username: admin.username,
    createdAt: admin.created_at
  };
}

function requireAdmin(req, res, next) {
  if (!req.session.adminId) {
    res.status(401).json({ message: "管理者ログインが必要です。" });
    return;
  }
  next();
}

function deleteUploadIfExists(imagePath) {
  if (!imagePath) {
    return;
  }
  const safePath = String(imagePath).replace(/^[\\/]/, "");
  const uploadPrefix = `uploads${path.sep}`;
  const normalizedPath = safePath.replace(/[\\/]/g, path.sep);
  const fullPath = normalizedPath.startsWith(uploadPrefix)
    ? path.join(UPLOADS_DIR, normalizedPath.slice(uploadPrefix.length))
    : path.join(ROOT_DIR, normalizedPath);
  fs.unlink(fullPath, () => {});
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);

app.use("/uploads", express.static(UPLOADS_DIR));
app.use("/icon", express.static(ICON_DIR));

app.get("/admin.html", (req, res) => {
  if (!req.session.adminId) {
    res.redirect("/admin-login.html");
    return;
  }
  res.sendFile(path.join(PUBLIC_DIR, "admin.html"));
});

app.get("/admin-users.html", (req, res) => {
  if (!req.session.adminId) {
    res.redirect("/admin-login.html");
    return;
  }
  res.sendFile(path.join(PUBLIC_DIR, "admin-users.html"));
});

app.get("/api/admin/me", (req, res) => {
  res.json({
    isAdmin: Boolean(req.session.adminId),
    adminId: req.session.adminId || null,
    username: req.session.adminUsername || null
  });
});

app.post("/api/admin/login", async (req, res) => {
  try {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");

    if (!username || !password) {
      res.status(400).json({ message: "管理者IDとパスワードを入力してください。" });
      return;
    }

    const admin = await get("SELECT * FROM admins WHERE username = ?", [username]);
    if (!admin) {
      res.status(401).json({ message: "管理者IDまたはパスワードが違います。" });
      return;
    }

    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) {
      res.status(401).json({ message: "管理者IDまたはパスワードが違います。" });
      return;
    }

    req.session.adminId = admin.id;
    req.session.adminUsername = admin.username;
    res.json({ message: "管理者ログインに成功しました。" });
  } catch (_error) {
    res.status(500).json({ message: "管理者ログインに失敗しました。" });
  }
});

app.post("/api/admin/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "管理者ログアウトしました。" });
  });
});

app.get("/api/admins", requireAdmin, async (_req, res) => {
  try {
    const admins = await all("SELECT id, username, created_at FROM admins ORDER BY id ASC");
    res.json(admins.map(sanitizeAdmin));
  } catch (_error) {
    res.status(500).json({ message: "管理者一覧の取得に失敗しました。" });
  }
});

app.post("/api/admins", requireAdmin, async (req, res) => {
  try {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");

    if (!username || !password) {
      res.status(400).json({ message: "管理者IDとパスワードを入力してください。" });
      return;
    }

    const existing = await get("SELECT id FROM admins WHERE username = ?", [username]);
    if (existing) {
      res.status(409).json({ message: "その管理者IDは既に使われています。" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await run("INSERT INTO admins (username, password_hash) VALUES (?, ?)", [username, passwordHash]);
    res.status(201).json({ message: "管理者を追加しました。" });
  } catch (_error) {
    res.status(500).json({ message: "管理者追加に失敗しました。" });
  }
});

app.delete("/api/admins/:id", requireAdmin, async (req, res) => {
  try {
    const adminId = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(adminId)) {
      res.status(400).json({ message: "管理者IDが不正です。" });
      return;
    }

    if (adminId === req.session.adminId) {
      res.status(400).json({ message: "自分自身は削除できません。" });
      return;
    }

    const countRow = await get("SELECT COUNT(*) AS count FROM admins");
    if (Number(countRow?.count || 0) <= 1) {
      res.status(400).json({ message: "管理者が1人しかいないため削除できません。" });
      return;
    }

    const result = await run("DELETE FROM admins WHERE id = ?", [adminId]);
    if (result.changes === 0) {
      res.status(404).json({ message: "管理者が見つかりません。" });
      return;
    }

    res.json({ message: "管理者を削除しました。" });
  } catch (_error) {
    res.status(500).json({ message: "管理者削除に失敗しました。" });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");

    if (!username || !password) {
      res.status(400).json({ message: "ユーザーIDとパスワードを入力してください。" });
      return;
    }

    const existing = await get("SELECT id FROM users WHERE username = ?", [username]);
    if (existing) {
      res.status(409).json({ message: "そのユーザーIDは既に使われています。" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await run("INSERT INTO users (username, password_hash) VALUES (?, ?)", [username, passwordHash]);
    res.status(201).json({ message: "新規登録が完了しました。" });
  } catch (_error) {
    res.status(500).json({ message: "ユーザー登録に失敗しました。" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");

    if (!username || !password) {
      res.status(400).json({ message: "ユーザーIDとパスワードを入力してください。" });
      return;
    }

    const user = await get("SELECT * FROM users WHERE username = ?", [username]);
    if (!user) {
      res.status(401).json({ message: "ユーザーIDまたはパスワードが違います。" });
      return;
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      res.status(401).json({ message: "ユーザーIDまたはパスワードが違います。" });
      return;
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    res.json({ message: "ログインしました。", username: user.username });
  } catch (_error) {
    res.status(500).json({ message: "ログインに失敗しました。" });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "ログアウトしました。" });
  });
});

app.get("/api/me", (req, res) => {
  res.json({
    loggedIn: Boolean(req.session.userId),
    userId: req.session.userId || null,
    username: req.session.username || null
  });
});

app.get("/api/foods", async (_req, res) => {
  try {
    const foods = await all("SELECT * FROM foods ORDER BY id DESC");
    res.json(foods.map(sanitizeFood));
  } catch (_error) {
    res.status(500).json({ message: "料理一覧の取得に失敗しました。" });
  }
});

app.post("/api/foods", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const description = String(req.body.description || "").trim();
    const price = Number.parseInt(req.body.price, 10);

    if (!name || Number.isNaN(price)) {
      if (req.file) deleteUploadIfExists(path.join("uploads", req.file.filename));
      res.status(400).json({ message: "料理名と値段は必須です。" });
      return;
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";
    const result = await run(
      "INSERT INTO foods (name, price, description, image_path) VALUES (?, ?, ?, ?)",
      [name, price, description, imagePath]
    );

    const created = await get("SELECT * FROM foods WHERE id = ?", [result.lastID]);
    res.status(201).json({ message: "料理を登録しました。", food: sanitizeFood(created) });
  } catch (_error) {
    if (req.file) deleteUploadIfExists(path.join("uploads", req.file.filename));
    res.status(500).json({ message: "料理登録に失敗しました。" });
  }
});

app.put("/api/foods/:id", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const foodId = Number.parseInt(req.params.id, 10);
    const existing = await get("SELECT * FROM foods WHERE id = ?", [foodId]);
    if (!existing) {
      if (req.file) deleteUploadIfExists(path.join("uploads", req.file.filename));
      res.status(404).json({ message: "料理が見つかりません。" });
      return;
    }

    const name = String(req.body.name || "").trim();
    const description = String(req.body.description || "").trim();
    const price = Number.parseInt(req.body.price, 10);

    if (!name || Number.isNaN(price)) {
      if (req.file) deleteUploadIfExists(path.join("uploads", req.file.filename));
      res.status(400).json({ message: "料理名と値段は必須です。" });
      return;
    }

    const nextImagePath = req.file ? `/uploads/${req.file.filename}` : existing.image_path || "";
    await run("UPDATE foods SET name = ?, price = ?, description = ?, image_path = ? WHERE id = ?", [
      name,
      price,
      description,
      nextImagePath,
      foodId
    ]);

    if (req.file && existing.image_path && existing.image_path !== nextImagePath) {
      deleteUploadIfExists(existing.image_path);
    }

    const updated = await get("SELECT * FROM foods WHERE id = ?", [foodId]);
    res.json({ message: "料理を更新しました。", food: sanitizeFood(updated) });
  } catch (_error) {
    if (req.file) deleteUploadIfExists(path.join("uploads", req.file.filename));
    res.status(500).json({ message: "料理更新に失敗しました。" });
  }
});

app.delete("/api/foods/:id", requireAdmin, async (req, res) => {
  try {
    const foodId = Number.parseInt(req.params.id, 10);
    const food = await get("SELECT * FROM foods WHERE id = ?", [foodId]);
    if (!food) {
      res.status(404).json({ message: "料理が見つかりません。" });
      return;
    }

    await run("DELETE FROM foods WHERE id = ?", [foodId]);
    deleteUploadIfExists(food.image_path);
    res.json({ message: "料理を削除しました。" });
  } catch (_error) {
    res.status(500).json({ message: "料理削除に失敗しました。" });
  }
});

app.use(express.static(PUBLIC_DIR));

app.use((error, _req, res, _next) => {
  res.status(400).json({ message: error?.message || "リクエストに失敗しました。" });
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("DB initialization failed:", error);
    process.exitCode = 1;
  });
