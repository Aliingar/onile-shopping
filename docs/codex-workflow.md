# Codex作業ワークフロー

このドキュメントは、個人制作プロジェクト「onile-shopping」でCodexを安全に使うための説明書です。
初心者でも分かるように、作業場所、GitHub、PR、サブエージェント、DB運用のルールをまとめています。

## 作業場所

Codexの作業場所は次に統一します。

```text
G:\マイドライブ\Backup\School PC backup file\kozin
```

ローカルのリポジトリは次の場所を想定します。

```text
G:\マイドライブ\Backup\School PC backup file\kozin\onile-shopping
```

## GitHubリポジトリ

GitHubリポジトリは次です。

```text
Aliingar/onile-shopping
https://github.com/Aliingar/onile-shopping
```

## ブランチ運用

作業するときは、`main` ブランチを直接変更しません。
必ず作業用ブランチを作ります。

例:

```text
chore/setup-codex-workflow
feature/cart-page
fix/login-error
```

作業用ブランチで変更し、確認してからPull Requestを作ります。

## PR運用

PRはPull Requestのことです。
作業用ブランチの変更を `main` に入れてよいか確認するための場所です。

基本の流れは次です。

1. `main` から作業用ブランチを作る
2. 作業用ブランチで変更する
3. `git status` と `git diff` で変更内容を確認する
4. commitする
5. GitHubへpushする
6. Pull Requestを作る
7. 内容を確認してからmainへ反映する

## mainを直接触らない理由

`main` はプロジェクトの大事な本線です。
ここを直接変更すると、失敗した変更がすぐに本番用のコードへ混ざる可能性があります。

ブランチとPRを使うと、変更内容をあとから見直せます。
間違いに気づいたときも、どこを直せばよいか分かりやすくなります。

## サブエージェントの使い分け

作業内容に合わせて、次のサブエージェントを使います。

| サブエージェント | 担当 |
| --- | --- |
| `frontend` | HTML、CSS、JavaScript、画面、フォーム、ボタン、API接続、表示処理 |
| `backend` | Python/Flask、APIルート、バリデーション、エラー処理、MySQL接続処理、JSON、APIテスト |
| `database` | MySQL、テーブル設計、SQL案、Aiven注意点、DBeaver確認手順、主キー、外部キー、初期データ案 |
| `frontend_design` | 画面レイアウト、色、余白、ボタン、カード、スマホ対応、使いやすさ |

迷ったときは、何を変えたいかで選びます。
画面の動きなら `frontend`、APIなら `backend`、DB設計なら `database`、見た目なら `frontend_design` です。

## DB運用

このプロジェクトのDBはMySQLです。
MySQL DBはAiven Consoleで作る前提です。
接続やSQL実行は、人間がDBeaverを使って行う前提です。

Codexは実DBに勝手に接続しません。
CodexはAiven ConsoleやDBeaverを勝手に操作しません。
CodexはSQL案や確認手順を作る役割にします。

## DB削除・テーブル削除の危険性

DB削除やテーブル削除は、とても危険です。
一度消すと、商品情報、ユーザー情報、注文情報などが戻せなくなる可能性があります。

次のSQLは特に注意が必要です。

```sql
DROP TABLE table_name;
TRUNCATE TABLE table_name;
DELETE FROM table_name;
ALTER TABLE table_name DROP COLUMN column_name;
```

これらを書く必要があるときは、必ず「人間確認必須」と書き、人間が内容を確認してから実行します。
Codexが勝手に実行してはいけません。

## Codexに渡すプロンプト例

フロントエンドを直したいとき:

```text
frontendサブエージェントで、商品一覧画面のボタン表示を確認してください。
DBや秘密情報には触れず、変更後に確認方法を初心者向けに説明してください。
```

バックエンドを直したいとき:

```text
backendサブエージェントで、商品取得APIのエラー処理を確認してください。
.envは開かず、既存APIを壊さない方針でお願いします。
```

DB設計を相談したいとき:

```text
databaseサブエージェントで、MySQLの商品テーブル案を作ってください。
実DBには接続せず、DBeaverで確認する手順も説明してください。
```

デザインを整えたいとき:

```text
frontend_designサブエージェントで、スマホ画面の余白とボタン配置を見直してください。
API仕様やDBは変更せず、変更理由と確認場所を書いてください。
```

## 先生や他の人に説明する短文

このプロジェクトでは、`main` を直接変更せず、作業用ブランチとPull Requestで安全に変更を確認します。
Codexの作業範囲をフロントエンド、バックエンド、DB、デザインに分け、秘密情報や実DBには勝手に触れないルールをリポジトリに残しています。
