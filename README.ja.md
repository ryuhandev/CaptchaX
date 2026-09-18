<p align="center">
  <img src="assets/banner.png" alt="CaptchaX - Captcha Bypasser" width="860">
</p>

<h1 align="center">CaptchaX</h1>

<p align="center">
  <strong>All-in-one captcha solver API</strong><br>
  Node.js · Express · Puppeteer · Docker · Railway-ready
</p>

<p align="center">
  <img src="https://img.shields.io/badge/repo-private-181717?style=for-the-badge&logo=github&logoColor=white" alt="Private">
  <img src="https://img.shields.io/badge/version-5.1.1-4f46e5?style=for-the-badge" alt="Version">
  <a href="https://github.com/ryuhandev/CaptchaX/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-22c55e?style=for-the-badge" alt="License"></a>
  <img src="https://img.shields.io/badge/status-production-16a34a?style=for-the-badge" alt="Status">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D18-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node">
  <img src="https://img.shields.io/badge/express-4.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/puppeteer--real--browser-1.4-40B5A4?style=for-the-badge&logo=puppeteer&logoColor=white" alt="Puppeteer">
  <img src="https://img.shields.io/badge/javascript-100%25-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/docker-ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/railway-deploy-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" alt="Railway">
  <img src="https://img.shields.io/badge/platform-linux%20%7C%20docker-94a3b8?style=for-the-badge&logo=linux&logoColor=white" alt="Platform">
</p>

<p align="center">
  <a href="https://github.com/ryuhandev"><img src="https://img.shields.io/badge/GitHub-@ryuhandev-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>
  <img src="https://img.shields.io/badge/PRs-welcome-8b5cf6?style=for-the-badge" alt="PRs welcome">
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=nodejs,express,docker" alt="Tech stack" height="55">
</p>

<p align="center">
  <a href="README.id.md">🇮🇩 Indonesia</a> · <a href="README.en.md">🇬🇧 English</a> · 🇯🇵 日本語 · <a href="README.zh.md">🇨🇳 中文</a> · <a href="README.ru.md">🇷🇺 Русский</a> · <a href="README.hi.md">🇮🇳 हिन्दी</a>
</p>

---

## 概要

CaptchaX は、多種多様な captcha とアンチボット保護を単一サービスで解決・バイパスする REST API です:**Cloudflare Turnstile**、**Cloudflare challenge / WAF**、**Kasada PoW**、**reCAPTCHA v3**、**hCaptcha**、**Aliyun Captcha 2.0**、**FriendlyCaptcha**、**Altcha (proof-of-work)** に加え、**レンダリング済みページソース**取得と**自動 sitekey 検出**ユーティリティを備えています。

すべて単一の Express プロセスで動作します。ヘッドフルブラウザ(Puppeteer、`puppeteer-real-browser`経由)は必要なエンドポイントでのみ使用し、Railway や Docker へそのままデプロイできます。

## 対応 Captcha

| Captcha / 保護 | エンドポイント | 方式 | 基盤 |
|---|---|---|---|
| Cloudflare Turnstile (単体) | `POST /api/turnstile` | フェイクページレンダー + 任意の `action` | ブラウザ |
| Cloudflare Turnstile (埋め込み) | `POST /api/turnstile-max` | 対象 URL に訪問、必要に応じウィジェットをクリック | ブラウザ |
| Cloudflare challenge / WAF | `POST /api/cloudflare` | `cf_clearance` 取得用チャレンジクリッカー | ブラウザ |
| Kasada PoW | `POST /api/kasada` | `x-kpsdk-ct` / `x-kpsdk-cd` ヘッダー + Cookie 取得 | ブラウザ |
| WAF セッション | `POST /api/waf-session` | セッション Cookie + ヘッダー取得 | ブラウザ |
| reCAPTCHA v3 | `POST /api/captchav3` | anchor/reload(ブラウザ不要) | HTTP |
| hCaptcha | `POST /api/hcaptcha` | チェックボックス/invisible | ブラウザ |
| Aliyun Captcha 2.0 | `POST /api/aliyun` | `sceneId` + `prefix` で自前ページに描画 | ブラウザ |
| Aliyun Captcha 2.0 (自動検出) | `POST /api/aliyun-extract` | URL から `region` + `prefix` + `sceneId` を検出 | ブラウザ |
| FriendlyCaptcha v1 | `POST /api/friendly` | 公式 `friendly-pow` WASM ソルバー | HTTP + WASM |
| Altcha PoW v1 | `POST /api/altcha` | SHA-1/256/384/512 ブルートフォース | 計算 |
| レンダリング済みソース | `POST /api/source` | ブラウザ描画後の HTML | ブラウザ |
| Sitekey 検出 | `POST /api/get-sitekey` | sitekey 分類 + ソルバー推奨 | ブラウザ |
| ヘルスチェック | `GET /api/health` | RAM/CPU/ディスク状態 | プロセス |

## 信頼性

| グループ | エンドポイント | 信頼性 | 備考 |
|---|---|---|---|
| 決定的 PoW / トークン | `turnstile`、`turnstile-max`、`captchav3`、`altcha`、`friendly` | 高い | 画像チャレンジなし。失敗原因は通信・タイムアウト・sitekey 誤り |
| ブラウザセッション | `cloudflare`、`waf-session`、`source` | 対象ページが正常なら高い | ブラウザと十分な RAM が必要 |
| ベストエフォート | `hcaptcha`、`aliyun`、`aliyun-extract`、`kasada` | リスクが低い場合や型が合致すれば成功 | 不可の場合は必ず `success: false` と理由を返す。Aliyun の icon-click は未対応 |

## クイックスタート

```bash
git clone https://github.com/ryuhandev/CaptchaX.git
cd CaptchaX
npm install
cp .env.example .env
npm start
```

デフォルトは `http://localhost:5000`(`PORT` で変更可)。`curl http://localhost:5000/` と `curl http://localhost:5000/api/health` で確認。

Docker:

```bash
docker build -t captchax .
docker run --rm -p 8080:8080 --env-file .env captchax
```

環境変数:`PORT`(既定 `5000`、Railway では Public Networking の Target Port と一致させる)、`NODE_ENV`(既定 `production`)、`MAX_REQUESTS_PER_MINUTE`(既定 `5`)、`BROWSER_SLOT_WAIT_MS`(既定 `45000`)、`PUPPETEER_EXECUTABLE_PATH`(Docker 内では `/usr/bin/chromium`)。

Railway: リポジトリからプロジェクトを作成し、Public Networking の Target Port を `PORT` と一致させ、変数を追加するだけ。`main` への push で自動再デプロイされます。

## API リファレンス

ベース URL(ローカル):`http://localhost:5000`。全エンドポイントは boolean の `success` を含む JSON を返し、失敗時は `error` に理由が入ります。

### `GET /`

サービス情報、エンドポイント一覧、サンプルペイロード。

### `GET /api/health`

RAM・CPU・ディスク統計。

### `POST /api/turnstile`

自前フェイクページで Turnstile を解決。`action` は任意で `turnstile.render` に転送されます。

```json
{ "sitekey": "0x4AAAAAA...", "siteurl": "https://example.com", "timeout": 45, "action": "login" }
```

レスポンス:`{ "success": true, "token": "XXXX...", "duration": 12.3 }`

### `POST /api/turnstile-max`

実際のページに埋め込まれた Turnstile を解決。対象 URL に訪問し、必要に応じウィジェットをクリックします。

```json
{ "url": "https://example.com/page-with-turnstile", "timeout": 60 }
```

### `POST /api/captchav3`

ブラウザ不要の reCAPTCHA v3(anchor/reload 方式)。

```json
{ "sitekey": "6Le-...", "siteurl": "https://example.com", "timeout": 30 }
```

レスポンス:`{ "success": true, "token": "...", "duration": 1.2 }`

### `POST /api/altcha`

Altcha proof-of-work v1(SHA-1/256/384/512)。純粋な計算で、チャレンジが有効な限り必ず完了します。`challengeurl` または `challenge` オブジェクトのいずれかを送信します。

```json
{ "challengeurl": "https://example.com/altcha-challenge", "timeout": 60 }
```

```json
{ "challenge": { "algorithm": "SHA-256", "challenge": "abc...", "salt": "def...&", "signature": "...", "maxnumber": 1000000 } }
```

レスポンス:`{ "success": true, "payload": "eyJ...", "number": 12345, "algorithm": "SHA-256", "duration": 0.4 }`。base64 の `payload` を `altcha` フィールドとして送信します。

### `POST /api/friendly`

公式ソルバー(`friendly-pow` WASM、ブラウザウィジェットと同一アルゴリズム)による FriendlyCaptcha v1 PoW。

```json
{ "sitekey": "FCM...", "timeout": 180 }
```

カスタムエンドポイントの場合は `puzzleEndpoint` を追加(既定:`https://api.friendlycaptcha.com/api/v1/puzzle`)。レスポンス:`{ "success": true, "solution": "sig.b64.sol.diag", "puzzles": 48, "field": "frc-captcha-solution", "duration": 50.8 }`。`solution` を `frc-captcha-solution` に格納します。

### `POST /api/hcaptcha`

ブラウザ経由の hCaptcha チェックボックス/invisible。ベストエフォートで、画像チャレンジが出ない場合のみ成功します。

```json
{ "sitekey": "10000000-ffff-ffff-ffff-000000000001", "siteurl": "https://example.com", "timeout": 60 }
```

### `POST /api/aliyun`

CapMonster 方式の Aliyun Captcha 2.0:対象サイトの `sceneId` と `prefix` を使い、自前の最小ページにウィジェットを描画します(対象サイト自体には訪問しません)。

```json
{ "sceneId": "XXXX", "prefix": "xxxxxx", "region": "sgp", "timeout": 120 }
```

パラメータの取得方法:`prefix` は Network タブの `https://<prefix>.captcha-open.*.aliyuncs.com` のサブドメイン、`sceneId` は captcha 出現時のリクエストペイロード、`region` は `sgp`/`cn`(init 失敗時は自動で他方を試行)。任意:`language`、`mode`、`sdkUrl`、`debug`。init 失敗(`INIT_FAIL`)はパラメータ誤りか非アクティブな scene を意味し、タイムアウトを待たず正直に応答します。応答の `verifyParam` は使い捨て・セッション紐付けトークンのため同一 IP から検証してください。icon-click 型は未対応です。

### `POST /api/aliyun-extract`

対象ページ URL から `region`・`prefix`・`sceneId` を自動検出します。captcha は通常ログインクリック等の後に読み込まれるため、実際に発火する URL を使ってください。ベストエフォートです。

```json
{ "url": "https://example.com/login", "timeout": 30 }
```

### `POST /api/kasada`

対象 URL から Kasada proof-of-work ヘッダーと Cookie(`x-kpsdk-ct` / `x-kpsdk-cd`)を取得します。[@hazeloffc](https://github.com/hazeloffc) の貢献(PR #1)を、`BrowserService` 化・レート制限・URL 検証・ブラウザキュー対応でハードニングしたものです。

```json
{ "url": "https://example.com", "timeout": 30, "waitTime": 15 }
```

レスポンス:

```json
{
  "success": true,
  "headers": { "x-kpsdk-ct": "...", "x-kpsdk-cd": "...", "user-agent": "..." },
  "cookies": [],
  "duration": 16.2
}
```

対象が Kasada を使っていない場合は `success: false` と理由を返します。

### `POST /api/cloudflare`

Cloudflare チャレンジをバイパスし `cf_clearance` を返します。

```json
{ "url": "https://example.com", "headless": true, "timeout": 30 }
```

レスポンス:`{ "success": true, "cf_clearance": "...", "cookie_string": "...", "cookies": [], "user_agent": "..." }`

### `POST /api/waf-session`

後続リクエスト用の WAF セッション Cookie とヘッダーを取得します。

```json
{ "url": "https://example.com", "timeout": 60 }
```

レスポンス:`{ "success": true, "cookies": [], "headers": {}, "duration": 8.1 }`

### `POST /api/source`

ブラウザ描画後の HTML を取得します(基礎的な保護下のページも可)。

```json
{ "url": "https://example.com", "timeout": 60 }
```

レスポンス:`{ "success": true, "html": "<!DOCTYPE html>...", "duration": 8.1 }`

### `POST /api/get-sitekey`

対象 URL の captcha sitekey を検出・分類します。ブラウザでページを読み込み、DOM 属性・インラインスクリプト・JS グローバル・iframe・通信を走査します。

```json
{ "url": "https://example.com/login", "timeout": 30 }
```

各エントリは推奨 `solver` と `solver_param` を含むため、検出結果をそのまま適切なソルバーへ渡せます。対応タイプ:`turnstile`(`0x` 始まり)、`recaptcha`(`6L` 始まり)、`hcaptcha`(UUID)、`friendly`(`FCM`/`FCS` 始まり)、`altcha`(長い base64 候補)。Aliyun 検出時は `/api/aliyun-extract` への `aliyun_hint` が付きます。

## 自動 Sitekey 検出

| `type` | ラベル | パターン | ソルバー |
|---|---|---|---|
| `turnstile` | Cloudflare Turnstile | `0x` 始まり | `/api/turnstile` |
| `recaptcha` | Google reCAPTCHA v2 / v3 / enterprise | `6L` 始まり | `/api/captchav3` |
| `hcaptcha` | hCaptcha | UUID | `/api/hcaptcha` |
| `friendly` | FriendlyCaptcha | `FCM` / `FCS` 始まり | `/api/friendly` |
| `altcha` | Altcha (候補) | 長い base64、固定 sitekey なし | `challengeurl` 付き `/api/altcha` |

## テストキー

| ソルバー | Sitekey | 期待結果 |
|---|---|---|
| Turnstile | `1x00000000000000000000AA` | `XXXX.DUMMY.TOKEN.XXXX` |
| reCAPTCHA v3 | `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI` | 有効なトークン |
| FriendlyCaptcha | `FCMGEMUD2M567T8G` | 有効なソリューション |

## プロジェクト構成

```text
CaptchaX/
├── .github/workflows/e2e.yml     # E2E (dispatch 時に自前 URL を入力)
├── assets/                       # バナー・キャラクター素材
├── src/
│   ├── index.js                  # Express アプリ
│   ├── routes/solve.js           # 全ソルバールート
│   ├── routes/health.js          # /health
│   └── services/                 # ソルバー群 (browser.js、browserLock.js、kasada.js 等)
├── Dockerfile
├── railway.json
├── .env.example
└── package.json
```

## レート制限とリソース

- 既定のレート制限:**IP あたり毎分 5 リクエスト**(`MAX_REQUESTS_PER_MINUTE`)。
- ブラウザキューはグローバルで**同時 1 実行のみ**。後続は最大 `BROWSER_SLOT_WAIT_MS`(既定 45 秒)待機し、超過時は `Browser busy` を返します。
- ブラウザ系エンドポイントには Chromium のため最低 **1 GB RAM** が必要です。非ブラウザ系(`captchav3`・`altcha`・`friendly`)は軽量です。
- Xvfb は `puppeteer-real-browser` が内部管理します。
- エラー応答はすべて機械可読な HTTP ステータス + JSON です。

## FAQ

**全ソルバーは保証されますか?** いいえ。PoW・トークン系は決定的ですが、`hcaptcha`・`aliyun`・`kasada` はリスクプロファイルとチャレンジ型に依存します。失敗は常に明示されます。

**正しい sitekey でも `hcaptcha` が失敗するのはなぜ?** 画像チャレンジが出た可能性が高いです。ソルバーはチェックボックス/invisible のみ対応し、早期に打ち切ります。

**トークンの有効期間は?** 短命でドメイン・セッションに紐付きます。受領後すぐ対象サーバーへ送信してください。

**別 IP から使えますか?** 非推奨です。Aliyun は同一 IP からの検証が必須です(セッション紐付け)。

**Railway で OOM するのはなぜ?** Chromium がメモリを要します。プランを上げるか、ブラウザ系の並列呼び出しを避けてください。

**Aliyun の画像順序クリックは?** 未対応で `success: false` を返します。

**API 認証は?** 組み込みの API キーはまだありません。公開前は自前のプロキシ・IP 許可・リバースプロキシで保護してください。

## ロードマップ

- [x] Turnstile、reCAPTCHA v3、Altcha、FriendlyCaptcha、hCaptcha、Aliyun、Kasada、Cloudflare、WAF セッション、ソース、sitekey 検出
- [x] OOM 対策のブラウザキュー(1 Chrome)
- [x] Dockerfile、`railway.json`、E2E ワークフロー
- [ ] API キーとユーザー別クォータ
- [ ] solve 結果の Webhook / コールバック配送
- [ ] hCaptcha 画像チャレンジソルバー
- [ ] ブラウザ不要 PoW ソルバーの単体テスト

## 貢献

貢献・issue・PR を歓迎します:

1. Fork してブランチ作成:`git checkout -b feat/my-feature`。
2. `npm install` し、変更したエンドポイントをローカルでテスト。
3. 認証情報・Cookie・内部 URL をコミットしないこと。
4. 問題・方針・検証方法を書いて PR を作成。

バグ報告にはエンドポイント、機密を除いたペイロード、`error` 応答、Node バージョン、デプロイ先を含めてください。

## コントリビューター

| [![ryuhandev](https://github.com/ryuhandev.png?size=100)](https://github.com/ryuhandev) | [![hazeloffc](https://github.com/hazeloffc.png?size=100)](https://github.com/hazeloffc) |
|---|---|
| **[@ryuhandev](https://github.com/ryuhandev)** — オーナー兼メンテナー | **[@hazeloffc](https://github.com/hazeloffc)** — Kasada ソルバー (PR #1) |

## ライセンスと免責

**Apache License 2.0** で公開。[LICENSE](https://github.com/ryuhandev/CaptchaX/blob/main/LICENSE) 参照。

本プロジェクトはセキュリティ研究・自システムの自動テスト・正規の連携用途向けです。許可なく第三者サービスの captcha を回避する利用は、現地法や利用規約に違反する可能性があります。利用の責任は利用者にあります。

メンテナー:[@ryuhandev](https://github.com/ryuhandev)。
