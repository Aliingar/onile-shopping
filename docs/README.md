# AK Myanmar Food (Flask + SQLite)

卒業研究デモ用の料理メニューサイトです。一般ユーザーは料理一覧を閲覧でき、管理者はログイン後に料理の追加・編集・削除、管理者の追加・削除ができます。

本番運用では `admin / admin123` のような固定パスワードは危険です。必ず変更してください。

## ローカル起動方法

```bash
cd "onile-shopping/backend"
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

ブラウザで開く:
- 一般ユーザー画面: `http://localhost:3000/`
- 管理者ログイン: `http://localhost:3000/admin-login.html`
- 管理者管理: `http://localhost:3000/admin-users.html` (管理者ログイン後)

## フォルダ構成

リポジトリ直下は次の3フォルダに整理しています。

- `backend/`: Flask サーバー、API、認証、アップロード処理、Python依存関係
- `database/`: SQLite DBファイル、DB設計メモ、スキーマ説明
- `docs/`: フロントエンド、説明書、設計資料、旧プロトタイプ、作業資料

## DB作成方法

`python app.py` で `database/database.sqlite` が自動作成・自動初期化されます。

作成されるテーブル:
- `admins`
- `users`
- `foods`

初回起動時、`admins` に管理者が1人もいない場合だけ、次の初期管理者が自動登録されます。
- ユーザーID: `admin`
- パスワード: `admin123`

## 管理者ログイン方法

1. `http://localhost:3000/admin-login.html` を開く
2. 管理者ID/パスワードでログイン
3. `http://localhost:3000/admin.html` で料理管理（追加・編集・削除）
4. `http://localhost:3000/admin-users.html` で管理者管理（追加・一覧・削除）

## 公開準備 (Render向け)

このアプリは `PORT` と `SESSION_SECRET` に対応しています。

1. GitHub にこのフォルダをpushする
2. Render で **New +** → **Web Service** → 対象リポジトリを選択
3. 設定:
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && gunicorn app:app`
4. 環境変数を追加:
   - `SESSION_SECRET`: 例) ランダムな長い文字列
5. デプロイ後、Renderが発行するURLにアクセスする

注意:
- SQLite はファイル保存です。Render でデータを保持したい場合は **Persistent Disk** を有効化し、`database/database.sqlite` をそのディスク上に置く構成にしてください（デモなら現状でも動きますが、再デプロイ等で消える可能性があります）。

## 公開URLを送る方法

Renderでデプロイ後に表示されるURL（例: `https://xxxx.onrender.com`）を、そのまま友達や親に送れば `料理メニュー` を閲覧できます。
