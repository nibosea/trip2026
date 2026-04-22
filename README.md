# trip2026

2026年 USA + カナダ旅行の家族用ガイドサイト（暗号化デプロイ）。

## 公開URL
- https://nibosea.github.io/trip2026/
- 合言葉保護（AES-256 + PBKDF2 600k iterations）

## 構成
- `docs/` … GitHub Pages の公開ルート
  - `index.html` / `travel-site.html` … 暗号化済みHTML
  - `images/` … 料理・観光写真
  - `.nojekyll` … Jekyll 無効化

## ソースの場所
元のプレーン版は **private リポジトリ** で管理。ここには暗号文しか置かない。
