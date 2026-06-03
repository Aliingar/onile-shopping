# Backend

Python + Flask のバックエンドです。

## ローカル起動

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

起動後は `http://localhost:3000/` を開きます。

## 環境変数

- `PORT`: 起動ポート。未設定なら `3000`
- `SESSION_SECRET`: セッション署名用の秘密文字列

現在のデモ環境では `database/database.sqlite` が自動作成されます。
