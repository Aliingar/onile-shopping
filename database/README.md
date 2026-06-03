# Database Notes

このフォルダは、DB設計メモ、スキーマ説明、将来のSQLファイルを置く場所です。

現在のアプリは SQLite を使っており、`python backend/app.py` 実行時に `database/database.sqlite` が自動作成されます。実データを含む可能性があるため、`database.sqlite` は Git 管理しません。

現在 `backend/app.py` で作成されるテーブル:

- `admins`
- `users`
- `foods`
