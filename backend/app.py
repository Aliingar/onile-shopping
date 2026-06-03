import os
import re
import sqlite3
import time
from pathlib import Path

import bcrypt
from flask import (
    Flask,
    abort,
    jsonify,
    redirect,
    request,
    send_from_directory,
    session,
)
from werkzeug.utils import secure_filename


ROOT_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = next(
    (
        path
        for path in (
            ROOT_DIR / "frontend" / "public",
            ROOT_DIR / "docs" / "frontend" / "public",
            ROOT_DIR / "public",
        )
        if path.exists()
    ),
    ROOT_DIR / "frontend" / "public",
)
ICON_DIR = PUBLIC_DIR / "icon"
UPLOADS_DIR = BACKEND_DIR / "uploads"
DB_PATH = (
    ROOT_DIR / "database" / "database.sqlite"
    if (ROOT_DIR / "database").exists()
    else ROOT_DIR / "database.sqlite"
)

PORT = int(os.environ.get("PORT", "3000"))
SESSION_SECRET = os.environ.get("SESSION_SECRET", "dev-session-secret-change-me")

UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH.parent.mkdir(parents=True, exist_ok=True)

app = Flask(__name__, static_folder=None)
app.secret_key = SESSION_SECRET
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    PERMANENT_SESSION_LIFETIME=60 * 60 * 8,
)


def request_data():
    return request.get_json(silent=True) or request.form


def connect_db():
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    return db


def init_db():
    with connect_db() as db:
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS admins (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT UNIQUE NOT NULL,
              password_hash TEXT NOT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT UNIQUE NOT NULL,
              password_hash TEXT NOT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS foods (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              price INTEGER NOT NULL,
              description TEXT,
              image_path TEXT,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        row = db.execute("SELECT COUNT(*) AS count FROM admins").fetchone()
        if int(row["count"] or 0) == 0:
            db.execute(
                "INSERT INTO admins (username, password_hash) VALUES (?, ?)",
                ("admin", hash_password("admin123")),
            )
            print("Seeded initial admin: admin / admin123 (demo only)")

        db.commit()


def fetch_one(sql, params=()):
    with connect_db() as db:
        return db.execute(sql, params).fetchone()


def fetch_all(sql, params=()):
    with connect_db() as db:
        return db.execute(sql, params).fetchall()


def execute(sql, params=()):
    with connect_db() as db:
        cursor = db.execute(sql, params)
        db.commit()
        return cursor.lastrowid, cursor.rowcount


def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=10)).decode(
        "utf-8"
    )


def verify_password(password, password_hash):
    try:
        return bcrypt.checkpw(
            password.encode("utf-8"),
            str(password_hash).encode("utf-8"),
        )
    except ValueError:
        return False


def parse_int(value):
    match = re.match(r"^[+-]?\d+", str(value or "").strip())
    if not match:
        return None
    return int(match.group(0))


def sanitize_food(food):
    return {
        "id": food["id"],
        "name": food["name"],
        "price": food["price"],
        "description": food["description"] or "",
        "imagePath": food["image_path"] or "",
        "createdAt": food["created_at"],
    }


def sanitize_admin(admin):
    return {
        "id": admin["id"],
        "username": admin["username"],
        "createdAt": admin["created_at"],
    }


def require_admin():
    if not session.get("adminId"):
        return jsonify({"message": "管理者ログインが必要です。"}), 401
    return None


def delete_upload_if_exists(image_path):
    if not image_path:
        return

    normalized = str(image_path).lstrip("/\\").replace("\\", "/")
    if not normalized.startswith("uploads/"):
        return

    target = (UPLOADS_DIR / normalized.removeprefix("uploads/")).resolve()
    uploads_root = UPLOADS_DIR.resolve()

    try:
        target.relative_to(uploads_root)
    except ValueError:
        return

    try:
        if target.is_file():
            target.unlink()
    except OSError:
        pass


def save_uploaded_image(file_storage):
    if not file_storage or not file_storage.filename:
        return ""

    if not (file_storage.mimetype or "").startswith("image/"):
        raise ValueError("画像ファイルのみアップロードできます。")

    original_name = secure_filename(file_storage.filename)
    stem = Path(original_name).stem or "image"
    suffix = Path(original_name).suffix or ".png"
    safe_stem = re.sub(r"[^a-zA-Z0-9_-]", "_", stem)[:60] or "image"
    filename = f"{int(time.time() * 1000)}-{safe_stem}{suffix}"
    file_storage.save(UPLOADS_DIR / filename)
    return f"/uploads/{filename}"


@app.get("/admin.html")
def admin_page():
    if not session.get("adminId"):
        return redirect("/admin-login.html")
    return send_from_directory(PUBLIC_DIR, "admin.html")


@app.get("/admin-users.html")
def admin_users_page():
    if not session.get("adminId"):
        return redirect("/admin-login.html")
    return send_from_directory(PUBLIC_DIR, "admin-users.html")


@app.get("/api/admin/me")
def admin_me():
    return jsonify(
        {
            "isAdmin": bool(session.get("adminId")),
            "adminId": session.get("adminId"),
            "username": session.get("adminUsername"),
        }
    )


@app.post("/api/admin/login")
def admin_login():
    try:
        data = request_data()
        username = str(data.get("username") or "").strip()
        password = str(data.get("password") or "")

        if not username or not password:
            return jsonify({"message": "管理者IDとパスワードを入力してください。"}), 400

        admin = fetch_one("SELECT * FROM admins WHERE username = ?", (username,))
        if not admin or not verify_password(password, admin["password_hash"]):
            return jsonify({"message": "管理者IDまたはパスワードが違います。"}), 401

        session.permanent = True
        session["adminId"] = admin["id"]
        session["adminUsername"] = admin["username"]
        return jsonify({"message": "管理者ログインに成功しました。"})
    except Exception:
        return jsonify({"message": "管理者ログインに失敗しました。"}), 500


@app.post("/api/admin/logout")
def admin_logout():
    session.clear()
    return jsonify({"message": "管理者ログアウトしました。"})


@app.get("/api/admins")
def list_admins():
    admin_error = require_admin()
    if admin_error:
        return admin_error

    try:
        admins = fetch_all("SELECT id, username, created_at FROM admins ORDER BY id ASC")
        return jsonify([sanitize_admin(admin) for admin in admins])
    except Exception:
        return jsonify({"message": "管理者一覧の取得に失敗しました。"}), 500


@app.post("/api/admins")
def create_admin():
    admin_error = require_admin()
    if admin_error:
        return admin_error

    try:
        data = request_data()
        username = str(data.get("username") or "").strip()
        password = str(data.get("password") or "")

        if not username or not password:
            return jsonify({"message": "管理者IDとパスワードを入力してください。"}), 400

        existing = fetch_one("SELECT id FROM admins WHERE username = ?", (username,))
        if existing:
            return jsonify({"message": "その管理者IDは既に使われています。"}), 409

        execute(
            "INSERT INTO admins (username, password_hash) VALUES (?, ?)",
            (username, hash_password(password)),
        )
        return jsonify({"message": "管理者を追加しました。"}), 201
    except Exception:
        return jsonify({"message": "管理者追加に失敗しました。"}), 500


@app.delete("/api/admins/<admin_id>")
def delete_admin(admin_id):
    admin_error = require_admin()
    if admin_error:
        return admin_error

    try:
        parsed_admin_id = parse_int(admin_id)
        if parsed_admin_id is None:
            return jsonify({"message": "管理者IDが不正です。"}), 400

        if parsed_admin_id == session.get("adminId"):
            return jsonify({"message": "自分自身は削除できません。"}), 400

        count_row = fetch_one("SELECT COUNT(*) AS count FROM admins")
        if int(count_row["count"] or 0) <= 1:
            return jsonify({"message": "管理者が1人しかいないため削除できません。"}), 400

        _last_id, rowcount = execute(
            "DELETE FROM admins WHERE id = ?",
            (parsed_admin_id,),
        )
        if rowcount == 0:
            return jsonify({"message": "管理者が見つかりません。"}), 404

        return jsonify({"message": "管理者を削除しました。"})
    except Exception:
        return jsonify({"message": "管理者削除に失敗しました。"}), 500


@app.post("/api/register")
def register():
    try:
        data = request_data()
        username = str(data.get("username") or "").strip()
        password = str(data.get("password") or "")

        if not username or not password:
            return jsonify({"message": "ユーザーIDとパスワードを入力してください。"}), 400

        existing = fetch_one("SELECT id FROM users WHERE username = ?", (username,))
        if existing:
            return jsonify({"message": "そのユーザーIDは既に使われています。"}), 409

        execute(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            (username, hash_password(password)),
        )
        return jsonify({"message": "新規登録が完了しました。"}), 201
    except Exception:
        return jsonify({"message": "ユーザー登録に失敗しました。"}), 500


@app.post("/api/login")
def login():
    try:
        data = request_data()
        username = str(data.get("username") or "").strip()
        password = str(data.get("password") or "")

        if not username or not password:
            return jsonify({"message": "ユーザーIDとパスワードを入力してください。"}), 400

        user = fetch_one("SELECT * FROM users WHERE username = ?", (username,))
        if not user or not verify_password(password, user["password_hash"]):
            return jsonify({"message": "ユーザーIDまたはパスワードが違います。"}), 401

        session.permanent = True
        session["userId"] = user["id"]
        session["username"] = user["username"]
        return jsonify({"message": "ログインしました。", "username": user["username"]})
    except Exception:
        return jsonify({"message": "ログインに失敗しました。"}), 500


@app.post("/api/logout")
def logout():
    session.clear()
    return jsonify({"message": "ログアウトしました。"})


@app.get("/api/me")
def me():
    return jsonify(
        {
            "loggedIn": bool(session.get("userId")),
            "userId": session.get("userId"),
            "username": session.get("username"),
        }
    )


@app.get("/api/foods")
def list_foods():
    try:
        foods = fetch_all("SELECT * FROM foods ORDER BY id DESC")
        return jsonify([sanitize_food(food) for food in foods])
    except Exception:
        return jsonify({"message": "料理一覧の取得に失敗しました。"}), 500


@app.post("/api/foods")
def create_food():
    admin_error = require_admin()
    if admin_error:
        return admin_error

    try:
        name = str(request.form.get("name") or "").strip()
        description = str(request.form.get("description") or "").strip()
        price = parse_int(request.form.get("price"))

        if not name or price is None:
            return jsonify({"message": "料理名と値段は必須です。"}), 400

        image_path = save_uploaded_image(request.files.get("image"))
        food_id, _rowcount = execute(
            "INSERT INTO foods (name, price, description, image_path) VALUES (?, ?, ?, ?)",
            (name, price, description, image_path),
        )

        created = fetch_one("SELECT * FROM foods WHERE id = ?", (food_id,))
        return (
            jsonify({"message": "料理を登録しました。", "food": sanitize_food(created)}),
            201,
        )
    except ValueError as error:
        return jsonify({"message": str(error)}), 400
    except Exception:
        return jsonify({"message": "料理登録に失敗しました。"}), 500


@app.put("/api/foods/<food_id>")
def update_food(food_id):
    admin_error = require_admin()
    if admin_error:
        return admin_error

    saved_image_path = ""
    try:
        parsed_food_id = parse_int(food_id)
        existing = (
            fetch_one("SELECT * FROM foods WHERE id = ?", (parsed_food_id,))
            if parsed_food_id is not None
            else None
        )
        if not existing:
            return jsonify({"message": "料理が見つかりません。"}), 404

        name = str(request.form.get("name") or "").strip()
        description = str(request.form.get("description") or "").strip()
        price = parse_int(request.form.get("price"))

        if not name or price is None:
            return jsonify({"message": "料理名と値段は必須です。"}), 400

        saved_image_path = save_uploaded_image(request.files.get("image"))
        next_image_path = saved_image_path or existing["image_path"] or ""
        execute(
            "UPDATE foods SET name = ?, price = ?, description = ?, image_path = ? WHERE id = ?",
            (name, price, description, next_image_path, parsed_food_id),
        )

        if saved_image_path and existing["image_path"] != next_image_path:
            delete_upload_if_exists(existing["image_path"])

        updated = fetch_one("SELECT * FROM foods WHERE id = ?", (parsed_food_id,))
        return jsonify({"message": "料理を更新しました。", "food": sanitize_food(updated)})
    except ValueError as error:
        delete_upload_if_exists(saved_image_path)
        return jsonify({"message": str(error)}), 400
    except Exception:
        delete_upload_if_exists(saved_image_path)
        return jsonify({"message": "料理更新に失敗しました。"}), 500


@app.delete("/api/foods/<food_id>")
def delete_food(food_id):
    admin_error = require_admin()
    if admin_error:
        return admin_error

    try:
        parsed_food_id = parse_int(food_id)
        food = (
            fetch_one("SELECT * FROM foods WHERE id = ?", (parsed_food_id,))
            if parsed_food_id is not None
            else None
        )
        if not food:
            return jsonify({"message": "料理が見つかりません。"}), 404

        execute("DELETE FROM foods WHERE id = ?", (parsed_food_id,))
        delete_upload_if_exists(food["image_path"])
        return jsonify({"message": "料理を削除しました。"})
    except Exception:
        return jsonify({"message": "料理削除に失敗しました。"}), 500


@app.get("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOADS_DIR, filename)


@app.get("/icon/<path:filename>")
def icon_file(filename):
    return send_from_directory(ICON_DIR, filename)


@app.get("/")
def index():
    return send_from_directory(PUBLIC_DIR, "index.html")


@app.get("/<path:filename>")
def public_file(filename):
    target = (PUBLIC_DIR / filename).resolve()
    try:
        target.relative_to(PUBLIC_DIR.resolve())
    except ValueError:
        abort(404)

    if target.is_file():
        return send_from_directory(PUBLIC_DIR, filename)
    abort(404)


@app.errorhandler(400)
def bad_request(error):
    message = getattr(error, "description", "リクエストに失敗しました。")
    return jsonify({"message": message}), 400


init_db()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT)
