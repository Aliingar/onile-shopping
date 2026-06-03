# Codex作業ルール

このリポジトリは、個人制作プロジェクト「onile-shopping」です。
Codexやサブエージェントが作業するときは、このファイルのルールを必ず確認してください。

## 基本情報

- GitHubリポジトリ: `Aliingar/onile-shopping`
- 作業場所: `G:\マイドライブ\Backup\School PC backup file\kozin`
- ローカル想定: `G:\マイドライブ\Backup\School PC backup file\kozin\onile-shopping`
- このプロジェクトは個人制作なので、初心者にも分かる日本語で説明してください。

## GitとPRのルール

- `main` ブランチで直接作業しないでください。
- 必ず作業用ブランチを作ってから変更してください。
- 変更は作業ブランチからPull Requestを作って確認します。
- `main` へ直接commit、push、mergeしないでください。
- 変更前に現在の構成と `git status` を確認してください。
- 変更後は、何を確認したかを日本語で報告してください。

## 秘密情報のルール

- `.env`、APIキー、DBパスワード、Aiven接続情報、トークン、GitHub Secretsを開かないでください。
- 秘密情報を画面やログに表示しないでください。
- APIキーやDBパスワードをコードへ直接書かないでください。

## DB運用ルール

- このプロジェクトのDBはMySQLです。
- MySQL DBはAiven Consoleで作る前提です。
- DBへ接続するときは、人間がDBeaverを使って接続する前提です。
- テーブル作成や確認は、DBeaver上でSQLを実行して行う前提です。
- Codexは実DBへ勝手に接続しないでください。
- CodexはAiven Console、DBeaver、実DBを勝手に操作しないでください。
- DB削除、テーブル削除、データ削除、破壊的なSQLは必ず人間に確認してください。
- `DROP`、`TRUNCATE`、`DELETE`、破壊的な `ALTER` は、許可なく実行しないでください。

## サブエージェントの使い分け

作業範囲を分けるため、次の4種類のサブエージェントを使います。

- `frontend`: HTML、CSS、JavaScript、画面、フォーム、ボタン、API接続、表示処理を担当します。
- `backend`: Python/Flask、APIルート、バリデーション、エラー処理、MySQL接続処理、JSON、APIテストを担当します。
- `database`: MySQL、テーブル設計、SQL案、Aiven注意点、DBeaver確認手順、主キー、外部キー、初期データ案を担当します。
- `frontend_design`: 画面レイアウト、色、余白、ボタン、カード、スマホ対応、使いやすさを担当します。

## 最後の報告

作業が終わったら、初心者にも分かる日本語で次の内容を報告してください。

- 実施した内容
- 作成または変更したファイル
- 確認したコマンド
- 変更後の確認方法
- 注意点や、次に人間が確認すること
