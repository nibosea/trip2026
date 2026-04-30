# 🚀 公開デプロイ手順（家族共有用の暗号化サイト）

この `public-build/` には、`travel-site.html` を **AES-256 で暗号化した公開用ファイル一式** が入っています。
新しい public リポジトリ `nibosea/trip2026` に push すれば、GitHub Pages で家族と URL 共有できます。

## 🔐 合言葉

**`nomura-2026`**（ローテーション済み・PBKDF2 60万回導出）

- 家族（弥令さん・お姉さん）には **URL + この合言葉** だけ伝えれば OK
- 変えたくなったら `npx staticrypt source.html -p '新しいパスワード'` で再生成

---

## 🧭 3ステップ（所要 5分）

### STEP 1 — 新リポジトリ作成（クリック1つ）

下の URL をクリック → 「Create repository」ボタン押すだけ：

👉 https://github.com/new?name=trip2026&visibility=public&description=2026+USA+%26+Canada+trip+guide+%28encrypted%29

> - 名前は `trip2026` で事前入力済
> - Visibility は **Public**（公開しても暗号化済なので安全）
> - README / .gitignore は **追加しない**（空リポで作る）

### STEP 2 — 初回 push（Mac のターミナルで）

以下をまるごとコピペして実行：

```bash
cd ~/Downloads
rm -rf trip2026-deploy
mkdir trip2026-deploy
cp -r ~/claude/trips/2026-usa/public-build/* trip2026-deploy/
cd trip2026-deploy
git init -b main
git add .
git commit -m "initial public deploy: encrypted travel site"
git remote add origin https://github.com/nibosea/trip2026.git
git push -u origin main
```

### STEP 3 — GitHub Pages 有効化（クリック3つ）

下の URL をクリック：

👉 https://github.com/nibosea/trip2026/settings/pages

1. **Source** を `Deploy from a branch` に
2. **Branch** を `main` / Folder を `/docs` に
3. **Save** ボタン

1-2分で公開される。URL は：

## 🌍 公開URL

**https://nibosea.github.io/trip2026/**

このURLを家族に送れば、合言葉画面が出る。正しい合言葉で中身が見える。

---

## 🔄 更新フロー（2回目以降）

元の private リポ（`~/claude/trips/2026-usa/travel-site.html`）を編集したら、再暗号化して再 push：

```bash
# 1. 元リポで編集＆コミット（普通通り）
cd ~/claude
# ... travel-site.html を編集 ...

# 2. 再暗号化
cd /tmp
npx staticrypt ~/claude/trips/2026-usa/travel-site.html \
  --short \
  --password 'Eve-Zoro-2026!' \
  --output /tmp/rebuild \
  --template-title "2026 USA & Canada Trip" \
  --template-instructions "合言葉を入力してください" \
  --template-button "開く" \
  --template-placeholder "合言葉"

# 3. 公開リポに反映
cd ~/Downloads/trip2026-deploy
cp /tmp/rebuild/travel-site.html docs/travel-site.html
cp /tmp/rebuild/travel-site.html docs/index.html
git add docs/
git commit -m "update encrypted site"
git push
```

将来的にはこれを GitHub Actions で自動化可能（今は手動でOK）。

---

## 🛡️ セキュリティ評価

- **暗号化**: AES-256-CBC + PBKDF2-HMAC-SHA256（600,000 iterations）
- **ソース保護**: `view-source:` で見ても暗号文のみ。平文情報は1バイトも含まれない
- **検証済み**: PNR、予約番号、電話番号、パスワード、氏名いずれも平文漏洩なし
- **攻撃耐性**:
  - 辞書攻撃: `Eve-Zoro-2026!` は14文字+記号で辞書未収録。実質不可
  - ブルートフォース: PBKDF2 60万回で1試行あたり数百ms。14文字英数記号空間は天文学的
- **リスク**:
  - 合言葉が流出したら終わり → 家族以外には教えない
  - 暗号化済HTMLそのもの（`docs/travel-site.html`）は公開されるが中身は読めない

## 🗑️ やめたいとき

1. GitHub で `nibosea/trip2026` リポジトリを Delete（Settings → 最下部）
2. URL アクセス不可になる

---

## ⚠️ 絶対やらないこと

- ❌ `public-build/` 以外のファイル（`bookings.md` / `documents/` / PDF 等）を公開リポに push しない
- ❌ 合言葉を公開の場所（X、ブログ、公開 Slack 等）に書かない
- ❌ 元の private リポ（`nibosea/claude`）を public に変えない
