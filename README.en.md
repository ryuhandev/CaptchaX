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
  <a href="README.md">Indonesia</a> · English · <a href="README.ja.md">日本語</a> · <a href="README.zh.md">中文</a> · <a href="README.ru.md">Русский</a> · <a href="README.hi.md">हिन्दी</a>
</p>

---

## Overview

CaptchaX is a single REST API that solves and bypasses a broad set of captchas and anti-bot protections: **Cloudflare Turnstile**, **Cloudflare challenge / WAF**, **Kasada PoW**, **reCAPTCHA v3**, **hCaptcha**, **Aliyun Captcha 2.0**, **FriendlyCaptcha**, **Altcha proof-of-work**, plus **rendered page source** and an **automatic sitekey detector**.

Everything runs in one Express process. Headful browsers (Puppeteer through `puppeteer-real-browser`) are only used by the endpoints that actually need them, and the service ships ready to deploy on Railway or Docker.

## Contents

- [Supported Captchas](#supported-captchas)
- [Solver Reliability](#solver-reliability)
- [Quick Start](#quick-start)
- [Deploy](#deploy)
- [API Reference](#api-reference)
- [Automatic Sitekey Detection](#automatic-sitekey-detection)
- [Test Keys](#test-keys)
- [Project Structure](#project-structure)
- [Rate Limit & Resources](#rate-limit--resources)
- [FAQ](#faq)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [License and Disclaimer](#license-and-disclaimer)

---

## Supported Captchas

| Captcha / Protection | Endpoint | Method | Basis |
|---|---|---|---|
| Cloudflare Turnstile (standalone) | `POST /api/turnstile` | fake page render + optional `action` | Browser |
| Cloudflare Turnstile (embedded) | `POST /api/turnstile-max` | visits target URL, clicks widget if needed | Browser |
| Cloudflare challenge / WAF | `POST /api/cloudflare` | challenge clicker towards `cf_clearance` | Browser |
| Kasada PoW | `POST /api/kasada` | captures `x-kpsdk-ct` / `x-kpsdk-cd` headers + cookies | Browser |
| WAF session | `POST /api/waf-session` | captures session cookies + headers | Browser |
| reCAPTCHA v3 | `POST /api/captchav3` | anchor/reload, no browser | HTTP |
| hCaptcha | `POST /api/hcaptcha` | checkbox/invisible | Browser |
| Aliyun Captcha 2.0 | `POST /api/aliyun` | self-hosted widget from `sceneId` + `prefix` | Browser |
| Aliyun Captcha 2.0 (auto-detect) | `POST /api/aliyun-extract` | detects `region` + `prefix` + `sceneId` from URL | Browser |
| FriendlyCaptcha v1 | `POST /api/friendly` | official `friendly-pow` WASM solver | HTTP + WASM |
| Altcha PoW v1 | `POST /api/altcha` | SHA-1/256/384/512 brute force | Computation |
| Rendered page source | `POST /api/source` | browser-rendered HTML | Browser |
| Sitekey detector | `POST /api/get-sitekey` | sitekey classification + solver recommendation | Browser |
| Health check | `GET /api/health` | RAM/CPU/disk status | Process |

---

## Solver Reliability

| Group | Endpoints | Reliability | Notes |
|---|---|---|---|
| Deterministic PoW / token | `turnstile`, `turnstile-max`, `captchav3`, `altcha`, `friendly` | High, results returned on success | No image challenge. Failures come from network, timeout, or wrong sitekey |
| Browser session | `cloudflare`, `waf-session`, `source` | High while the target page responds normally | Needs browser and enough RAM |
| Best-effort | `hcaptcha`, `aliyun`, `aliyun-extract`, `kasada` | Pass when risk is low or type matches | Always answers `success: false` with a reason when it cannot. Aliyun icon-click is not supported |

---

## Quick Start

Run locally:

```bash
git clone https://github.com/ryuhandev/CaptchaX.git
cd CaptchaX
npm install
cp .env.example .env
npm start
```

Runs on `http://localhost:5000` by default (change via `PORT`). Verify with `curl http://localhost:5000/` and `curl http://localhost:5000/api/health`.

Docker:

```bash
docker build -t captchax .
docker run --rm -p 8080:8080 --env-file .env captchax
```

The image already bundles Chromium from apt plus every system dependency the browser-based solvers need.

Environment variables: `PORT` (default `5000`, on Railway match it with the public networking target port), `NODE_ENV` (default `production`), `MAX_REQUESTS_PER_MINUTE` (default `5`), `BROWSER_SLOT_WAIT_MS` (default `45000`, max wait for the global browser slot), `PUPPETEER_EXECUTABLE_PATH` (in Docker: `/usr/bin/chromium`).

---

## Deploy

### Railway

1. Push the repository to GitHub, create a new Railway project and choose **Deploy from GitHub repo**.
2. Every push to `main` triggers an **auto-redeploy**.
3. Add variables: `PORT=8080`, `NODE_ENV=production`, `MAX_REQUESTS_PER_MINUTE=5`.
4. In Public Networking, set the target port equal to `PORT`.
5. Health check uses `GET /`, already configured in `railway.json`.

### Docker (VPS)

```bash
git clone https://github.com/ryuhandev/CaptchaX.git
cd CaptchaX
cp .env.example .env
docker build -t captchax .
docker run -d --name captchax --restart unless-stopped -p 8080:8080 --env-file .env captchax
```

### E2E Workflow

`.github/workflows/e2e.yml` provides end-to-end tests. It uses a placeholder URL, so fill in your own instance URL when running it via `workflow_dispatch`.

---

## API Reference

Local base URL: `http://localhost:5000`. Uniform response format: every endpoint returns JSON with a boolean `success` field; failures include an `error` explaining why.

### `GET /`

Service info, endpoint list, and sample payloads.

### `GET /api/health`

RAM, CPU, and disk stats.

### `POST /api/turnstile`

Solves Turnstile through a self-rendered fake page. `action` is optional and forwarded to `turnstile.render`.

```json
{ "sitekey": "0x4AAAAAA...", "siteurl": "https://example.com", "timeout": 45, "action": "login" }
```

Response: `{ "success": true, "token": "XXXX...", "duration": 12.3 }`

### `POST /api/turnstile-max`

Solves Turnstile embedded on the real page. The service visits the target URL and clicks the widget when needed.

```json
{ "url": "https://example.com/page-with-turnstile", "timeout": 60 }
```

### `POST /api/captchav3`

reCAPTCHA v3 without a browser, using the anchor/reload flow.

```json
{ "sitekey": "6Le-...", "siteurl": "https://example.com", "timeout": 30 }
```

Response: `{ "success": true, "token": "...", "duration": 1.2 }`

### `POST /api/altcha`

Solves Altcha proof-of-work v1 (SHA-1/256/384/512). Pure computation, always completes while the challenge is valid. Send either `challengeurl` or a `challenge` object.

```json
{ "challengeurl": "https://example.com/altcha-challenge", "timeout": 60 }
```

```json
{ "challenge": { "algorithm": "SHA-256", "challenge": "abc...", "salt": "def...&", "signature": "...", "maxnumber": 1000000 } }
```

Response: `{ "success": true, "payload": "eyJ...", "number": 12345, "algorithm": "SHA-256", "duration": 0.4 }`. Send the base64 `payload` as the `altcha` form field.

### `POST /api/friendly`

Solves FriendlyCaptcha v1 proof-of-work with the official solver (`friendly-pow` WASM, same algorithm as the browser widget).

```json
{ "sitekey": "FCM...", "timeout": 180 }
```

Add `puzzleEndpoint` for custom endpoints (default: `https://api.friendlycaptcha.com/api/v1/puzzle`). Response: `{ "success": true, "solution": "sig.b64.sol.diag", "puzzles": 48, "field": "frc-captcha-solution", "duration": 50.8 }`. Put `solution` into the `frc-captcha-solution` field.

### `POST /api/hcaptcha`

hCaptcha checkbox or invisible via browser. Best-effort, passes only when no image challenge appears.

```json
{ "sitekey": "10000000-ffff-ffff-ffff-000000000001", "siteurl": "https://example.com", "timeout": 60 }
```

### `POST /api/aliyun`

Aliyun Captcha 2.0, CapMonster-style: the widget renders on a minimal self-hosted page using the target site's `sceneId` and `prefix`, without visiting the target site.

```json
{ "sceneId": "XXXX", "prefix": "xxxxxx", "region": "sgp", "timeout": 120 }
```

How to get the parameters: `prefix` is the subdomain of `https://<prefix>.captcha-open.*.aliyuncs.com` in the Network tab; `sceneId` comes from the captcha request payload; `region` is `sgp` or `cn` (the solver tries the other region automatically when init fails). Optional: `language`, `mode`, `sdkUrl`, `debug`. A failed init (`INIT_FAIL`) means wrong parameters or an inactive scene, and the solver answers honestly without waiting for the timeout. The response returns `verifyParam`, a one-time session-bound token that must be verified from the same IP. Icon-click challenges are not supported.

### `POST /api/aliyun-extract`

Auto-detects `region`, `prefix`, and `sceneId` from a target page URL. Best-effort, because captchas usually load only after an action such as clicking Login - use a URL that actually triggers the captcha.

```json
{ "url": "https://example.com/login", "timeout": 30 }
```

### `POST /api/kasada`

Captures Kasada proof-of-work headers and cookies (`x-kpsdk-ct` / `x-kpsdk-cd`) from a target URL. Contributed by [@hazeloffc](https://github.com/hazeloffc) (PR #1), hardened to run on `BrowserService` with rate limiting, URL validation, and the global browser queue.

```json
{ "url": "https://example.com", "timeout": 30, "waitTime": 15 }
```

Response:

```json
{
  "success": true,
  "headers": { "x-kpsdk-ct": "...", "x-kpsdk-cd": "...", "user-agent": "..." },
  "cookies": [],
  "duration": 16.2
}
```

When the target does not use Kasada, the API answers `success: false` with the reason.

### `POST /api/cloudflare`

Bypasses the Cloudflare challenge and returns `cf_clearance`.

```json
{ "url": "https://example.com", "headless": true, "timeout": 30 }
```

Response: `{ "success": true, "cf_clearance": "...", "cookie_string": "...", "cookies": [], "user_agent": "..." }`

### `POST /api/waf-session`

Captures WAF session cookies and headers from a URL for follow-up requests.

```json
{ "url": "https://example.com", "timeout": 60 }
```

Response: `{ "success": true, "cookies": [], "headers": {}, "duration": 8.1 }`

### `POST /api/source`

Returns browser-rendered HTML, including pages behind basic protection.

```json
{ "url": "https://example.com", "timeout": 60 }
```

Response: `{ "success": true, "html": "<!DOCTYPE html>...", "duration": 8.1 }`

### `POST /api/get-sitekey`

Detects captcha sitekeys on a target URL with classification. Uses a browser to load the page, then scans DOM attributes, inline scripts, JS globals, iframe sources, and network traffic.

```json
{ "url": "https://example.com/login", "timeout": 30 }
```

Each entry includes the recommended `solver` endpoint and `solver_param`, so detection output can be piped straight into the right solver. Recognized types: `turnstile` (`0x` prefix), `recaptcha` (`6L` prefix), `hcaptcha` (UUID), `friendly` (`FCM`/`FCS` prefix), `altcha` (long base64 candidate). Aliyun detection returns an `aliyun_hint` pointing to `/api/aliyun-extract`.

---

## Automatic Sitekey Detection

| `type` | Label | Sitekey pattern | Solver |
|---|---|---|---|
| `turnstile` | Cloudflare Turnstile | starts with `0x` | `/api/turnstile` |
| `recaptcha` | Google reCAPTCHA v2 / v3 / enterprise | starts with `6L` | `/api/captchav3` |
| `hcaptcha` | hCaptcha | UUID | `/api/hcaptcha` |
| `friendly` | FriendlyCaptcha | starts with `FCM` or `FCS` | `/api/friendly` |
| `altcha` | Altcha (candidate) | long base64, no static sitekey | `/api/altcha` with `challengeurl` |

---

## Test Keys

| Solver | Sitekey | Expected result |
|---|---|---|
| Turnstile | `1x00000000000000000000AA` | `XXXX.DUMMY.TOKEN.XXXX` |
| reCAPTCHA v3 | `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI` | valid token |
| FriendlyCaptcha | `FCMGEMUD2M567T8G` | valid solution |

---

## Project Structure

```text
CaptchaX/
├── .github/workflows/e2e.yml     # E2E workflow (fill in your URL on dispatch)
├── assets/                       # banner and character assets
├── src/
│   ├── index.js                  # Express app, PORT from env, listens on 0.0.0.0
│   ├── routes/
│   │   ├── solve.js              # turnstile, turnstile-max, captchav3, altcha, friendly,
│   │   │                         # hcaptcha, aliyun, aliyun-extract, kasada, cloudflare,
│   │   │                         # waf-session, source, get-sitekey
│   │   └── health.js             # /health
│   └── services/
│       ├── turnstile.js          # BypassService: fakePage render + action, max, wafSession, getSource
│       ├── browser.js            # puppeteer-real-browser pool + xvfb
│       ├── browserLock.js        # global browser slot queue (1 Chrome)
│       ├── captchaV3.js          # reCAPTCHA v3 without browser (anchor/reload)
│       ├── altcha.js             # Altcha PoW v1 (SHA brute force, per altcha-lib)
│       ├── friendly.js           # FriendlyCaptcha PoW v1 (official WASM solver)
│       ├── hcaptcha.js           # hCaptcha checkbox/invisible via browser (best-effort)
│       ├── aliyun.js             # Aliyun Captcha 2.0 harvest (closed-loop drag + jimp)
│       ├── extractAliyun.js      # Aliyun sceneId/prefix/region detection from URL
│       ├── kasada.js             # Kasada PoW header capture (hazeloffc, PR #1)
│       ├── getSitekey.js         # sitekey detection and classification from URL
│       └── cloudflare.js         # challenge clicker towards cf_clearance
├── Dockerfile
├── railway.json
├── .env.example
└── package.json
```

---

## Rate Limit & Resources

- Default rate limit: **5 requests per minute per IP** (`MAX_REQUESTS_PER_MINUTE`).
- Global browser queue: only **1 browser solve at a time**; further requests wait up to `BROWSER_SLOT_WAIT_MS` (default 45s), otherwise get `Browser busy`.
- Browser endpoints need at least **1 GB RAM** (Chromium). Non-browser endpoints (`captchav3`, `altcha`, `friendly`) stay light.
- Xvfb is managed internally by `puppeteer-real-browser`.
- All error responses use machine-readable HTTP status codes and JSON payloads.

---

## FAQ

**Are all solvers guaranteed?** No. PoW and token endpoints are deterministic, but `hcaptcha`, `aliyun`, and `kasada` depend on the risk profile and challenge type. Failures are always explicit.

**Why does `hcaptcha` fail with a correct sitekey?** Usually an image challenge appeared. The solver only handles checkbox and invisible modes and fails fast instead of hanging.

**How long are tokens valid?** Short-lived and bound to domain and session. Forward them immediately.

**Can tokens be used from a different IP?** Not recommended. Aliyun verification must come from the same IP (session-bound token).

**Why do browser endpoints OOM on Railway?** Chromium needs memory. Upgrade the plan, and avoid heavy parallel calls - the browser queue now answers `Browser busy` instead of stacking Chrome processes.

**Is there API authentication?** No built-in key yet. Protect the instance with a proxy, IP allowlist, or your own reverse proxy before exposing it publicly.

---

## Roadmap

- [x] Turnstile, reCAPTCHA v3, Altcha, FriendlyCaptcha, hCaptcha, Aliyun, Kasada, Cloudflare, WAF session, source, sitekey detector
- [x] Global browser queue (1 Chrome) against OOM
- [x] Dockerfile, `railway.json`, E2E workflow
- [ ] API keys and per-user quotas
- [ ] Webhook / callback delivery of solve results
- [ ] hCaptcha image challenge solver
- [ ] Unit tests for browser-free PoW solvers

---

## Contributing

Contributions, issues, and pull requests are welcome:

1. Fork and create a branch: `git checkout -b feat/my-feature`.
2. Run `npm install` and test the endpoints you changed locally.
3. Never commit credentials, cookies, or internal URLs.
4. Open a PR describing the problem, approach, and how to test.

Bug reports should include the endpoint, a sanitized payload, the `error` response, plus Node version and deploy platform.

---

## Contributors

| [![ryuhandev](https://github.com/ryuhandev.png?size=100)](https://github.com/ryuhandev) | [![hazeloffc](https://github.com/hazeloffc.png?size=100)](https://github.com/hazeloffc) |
|---|---|
| **[@ryuhandev](https://github.com/ryuhandev)** - Owner & maintainer | **[@hazeloffc](https://github.com/hazeloffc)** - Kasada solver (PR #1) |

---

## License and Disclaimer

Released under the **Apache License 2.0**. See [LICENSE](https://github.com/ryuhandev/CaptchaX/blob/main/LICENSE).

This project is provided for security research, automated testing of your own systems, and legitimate integrations. Using it to bypass captchas on third-party services without permission may violate local law and those providers' terms of service. You are responsible for how you use it.

Maintained by [@ryuhandev](https://github.com/ryuhandev).
