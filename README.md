# text-to-manga-editor

## アプリの目的
文章を漫画の設計図に変換し、コマ編集・文字レイヤー編集・コマ番号表示切替・PNG出力までを行う、フロントエンド単体のMVPです。

## 起動方法
```bash
npm install
npm run dev
```

## 主要機能
- 文章入力（任意ジャンル）
- 漫画化モード選択、コマ数設定、絵柄プリセット選択
- レギュラーキャラ管理（初期キャラ: リーディー、見た目メモ・参照画像登録対応）
- `generateStoryboard(sourceText, settings, characters)` による漫画設計図作成（ルールベース実装）
- 漫画設計図編集（コマ追加/削除/並び替え、要約/背景/表情/動作/セリフ/ナレーション/imagePrompt編集）
- 白パネルの漫画プレビュー（コマ番号、要約、キャラ名付きテキストレイヤー重ね表示）
- 文字レイヤー編集（テキスト内容、フォントサイズ、横/縦、x/y、幅、太字）
- コマ番号表示/非表示の切替
- PNG出力（コマ番号あり確認版 / コマ番号なし完成版）
- localStorage 保存/読み込み/初期化

## 実装済みアップデート（同期と編集性の強化）
- StoryboardEditor のセリフ・ナレーション編集時に、対応する TextLayer の `text`（および speech の `speaker`）を自動同期
- コマ追加時に speech / narration の初期 TextLayer を同時追加
- コマ削除時に、該当コマの TextLayer を同時削除
- コマ並び替え・削除後に panelId を振り直す際、TextLayer 側の panelId も同時に整合
- StoryboardEditor / TextLayerEditor の入力欄へラベル追加
- キャラ管理に「この漫画で使用する」チェックを追加
- ストーリーボード生成時は `useInManga=true` キャラの `displayName` を優先し、0人時は「案内役」を使用
- キャラ追加ボタンを追加（displayName / role / personality / usage / speakingStyle / appearanceNotes / referenceImages を編集可能）
- キャラの見た目一貫性を保つため、見た目メモと参照画像を登録可能
- 画像なしでも仮登録は可能だが、固定キャラには参照画像の登録を推奨

## 現在の制約
- AI画像生成APIは未接続です。
- ストーリーボード生成は後でAIに置換しやすいよう、関数分離した仮実装です。
- 参照画像は FileReader で data URL 化して localStorage に保存するため、枚数や解像度が大きいと保存容量上限（ブラウザ依存）に達する場合があります。必要に応じて画像を圧縮し、登録枚数を調整してください。

## 設計思想
文字レイヤーとコマ番号を画像本体から分離して管理し、
- 編集容易性（後編集可能）
- 確認版/完成版の切替出力
- 将来のAI画像差し替えへの柔軟性
を優先しています。
