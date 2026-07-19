# Meta Checker

[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Português (Brasil)](README.pt-BR.md)

**GEO と SEO のためのメタデータ・メイト。**

Meta Checker は、現在の DOM と最初の HTML レスポンスのメタデータを比較する
Chrome 拡張機能です。検索エンジンや AI クローラーが確認する可能性のある情報を
把握し、ページ読み込み後に追加・変更・削除された値をすばやく見つけられます。

[Chrome ウェブストアからインストール](https://chromewebstore.google.com/detail/metadata-extractor/pdikiboojnhoacoknfdpndeddocnbmop)

![Meta Checker のメタデータ比較](docs/images/meta-checker-overview.png)

![Meta Checker の状態ガイド](docs/images/meta-checker-state-guide.png)

## 確認できる情報

- ページタイトル、メタタイトル、メタディスクリプション、正規 URL
- Open Graph のタイトル、説明、タイプ、サイト名、URL、画像
- robots ディレクティブ、文書言語、代替言語リンク
- HTTP ステータス、最終 URL、リダイレクト、コンテンツタイプ、`X-Robots-Tag`
- JSON-LD ブロック数、検証エラー、検出された `@type`
- コードボタンから確認できる元のタグ

セクションを折りたたみ、表示設定でセクション全体または個別項目を選択できます。
ポップアップは英語、韓国語、日本語、スペイン語、ブラジルポルトガル語に対応します。

## GEO・SEO での活用

- サーバーから配信された元の HTML に含まれるメタデータを確認します。
- フレームワーク、スクリプト、タグマネージャーが実行時に変更した値を検出します。
- canonical、言語、robots、Open Graph、HTTP、JSON-LD のシグナルをまとめて点検します。
- 元のレスポンスと、ユーザーや実行可能なクローラーが見るページとの差を調査します。

Meta Checker は技術的なメタデータ確認ツールです。検索順位や AI 回答での
表示を予測または保証するものではありません。

## メタデータの状態

| 状態 | 意味 |
| --- | --- |
| `Same` | 現在の DOM が最初の HTML レスポンスと一致しています。 |
| `New` | 現在の DOM にはありますが、最初のレスポンスにはない値です。 |
| `Changed` | 現在の DOM の値が最初のレスポンスと異なります。 |
| `Removed` | 最初のレスポンスにはありますが、現在の DOM にはない値です。 |

状態チップ、または右上の `?` ボタンをクリックすると状態ガイドが開きます。

## 使い方

1. 確認したい通常のウェブページを開きます。
2. Chrome ツールバーから Meta Checker を起動します。
3. メタデータの値と状態チップを確認します。
4. コードボタンで値の完全な元タグを表示します。
5. 表示設定で表示するセクションと項目を選択します。
6. 言語メニューからインターフェース言語を選択します。

通常のウェブページでは、拡張機能のインストールまたは再読み込み前から開いていた
タブにも Meta Checker がメタデータリーダーを自動的に再接続します。
`chrome://extensions` など Chrome の保護ページは検査できません。

## ローカルインストール

1. このリポジトリをダウンロードまたはクローンします。
2. Chrome で `chrome://extensions` を開きます。
3. **デベロッパーモード**を有効にします。
4. **パッケージ化されていない拡張機能を読み込む**を選択します。
5. `manifest.json` があるリポジトリのルートフォルダーを選択します。
6. Chrome ツールバーの拡張機能メニューから Meta Checker を固定します。

## バージョン

現在のリリース: `1.1.1`
