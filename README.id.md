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
  🇮🇩 Indonesia · <a href="README.en.md">🇬🇧 English</a> · <a href="README.ja.md">🇯🇵 日本語</a> · <a href="README.zh.md">🇨🇳 中文</a> · <a href="README.ru.md">🇷🇺 Русский</a> · <a href="README.hi.md">🇮🇳 हिन्दी</a>
</p>

---

## Ringkasan

CaptchaX adalah REST API untuk menyelesaikan dan melewati berbagai jenis captcha serta proteksi anti-bot dalam satu layanan: **Cloudflare Turnstile**, **Cloudflare challenge / WAF**, **Kasada PoW**, **reCAPTCHA v3**, **hCaptcha**, **Aliyun Captcha 2.0**, **FriendlyCaptcha**, **Altcha (proof-of-work)**, plus utilitas **rendered source** dan **detektor sitekey** otomatis.

Semua solver berjalan di satu proses Express, memakai browser headful (Puppeteer via `puppeteer-real-browser`) hanya pada endpoint yang memang butuh, dan bisa langsung di-deploy ke Railway atau Docker.

<table>
<tr>
<td width="60%" valign="top">

### Kenapa CaptchaX

- Satu endpoint untuk banyak vendor captcha, tidak perlu banyak service terpisah.
- Solver PoW dan token (turnstile, reCAPTCHA v3, altcha, friendly) bersifat **deterministik** dan dijalankan tanpa browser sehingga cepat dan hemat RAM.
- Endpoint berbasis browser memakai page dan profil realistis, termasuk mode "halaman asli" untuk Turnstile yang tertanam di situs target.
- Anti-slop tapi jujur: endpoint `hcaptcha`, `aliyun`, dan `kasada` adalah **best-effort**. Kalau tidak bisa, API menjawab `success: false` beserta alasannya, bukan menggantung sampai timeout atau mengarang token palsu.
- Detektor sitekey otomatis memetakan jenis captcha ke endpoint solver yang tepat, jadi alur bisa diotomasi dari URL saja.
- Siap produksi: rate limit per IP, antrean browser global (1 Chrome dalam satu waktu), health check, Dockerfile, `railway.json`, dan workflow E2E.

</td>
<td width="40%" valign="middle">

<p align="center">
  <img src="assets/character-02.png" alt="CaptchaX mascot" width="330">
</p>

</td>
</tr>
</table>

---

## Daftar Isi

- [Captcha yang Didukung](#captcha-yang-didukung)
- [Tingkat Keandalan Solver](#tingkat-keandalan-solver)
- [Quick Start](#quick-start)
- [Deploy](#deploy)
- [Referensi API](#referensi-api)
- [Deteksi Sitekey Otomatis](#deteksi-sitekey-otomatis)
- [Test Keys](#test-keys)
- [Struktur Proyek](#struktur-proyek)
- [Rate Limit dan Kebutuhan Resource](#rate-limit-dan-kebutuhan-resource)
- [FAQ](#faq)
- [Roadmap](#roadmap)
- [Kontribusi](#kontribusi)
- [Kontributor](#kontributor)
- [Lisensi dan Disclaimer](#lisensi-dan-disclaimer)

---

## Captcha yang Didukung

| Captcha / Proteksi | Endpoint | Metode | Basis |
|---|---|---|---|
| Cloudflare Turnstile (standalone) | `POST /api/turnstile` | fake page render + optional `action` | Browser |
| Cloudflare Turnstile (embedded) | `POST /api/turnstile-max` | kunjungi URL target, klik widget bila perlu | Browser |
| Cloudflare challenge / WAF | `POST /api/cloudflare` | challenge clicker menuju `cf_clearance` | Browser |
| Kasada PoW | `POST /api/kasada` | tangkap header `x-kpsdk-ct` / `x-kpsdk-cd` + cookies | Browser |
| WAF session | `POST /api/waf-session` | ambil cookies + headers sesi | Browser |
| reCAPTCHA v3 | `POST /api/captchav3` | anchor/reload tanpa browser | HTTP |
| hCaptcha | `POST /api/hcaptcha` | checkbox/invisible | Browser |
| Aliyun Captcha 2.0 | `POST /api/aliyun` | render widget sendiri dari `sceneId` + `prefix` | Browser |
| Aliyun Captcha 2.0 (auto-detect) | `POST /api/aliyun-extract` | deteksi `region` + `prefix` + `sceneId` dari URL | Browser |
| FriendlyCaptcha v1 | `POST /api/friendly` | solver WASM resmi `friendly-pow` | HTTP + WASM |
| Altcha PoW v1 | `POST /api/altcha` | brute force SHA-1/256/384/512 | Komputasi |
| Rendered page source | `POST /api/source` | HTML hasil render browser | Browser |
| Sitekey detector | `POST /api/get-sitekey` | klasifikasi sitekey + rekomendasi solver | Browser |
| Health check | `GET /api/health` | status RAM/CPU/disk | Proses |

---

## Tingkat Keandalan Solver

| Kelompok | Endpoint | Tingkat keandalan | Catatan |
|---|---|---|---|
| PoW / token deterministik | `turnstile`, `turnstile-max`, `captchav3`, `altcha`, `friendly` | Tinggi, hasil dikembalikan saat berhasil | Tidak memakai image challenge. Kalau gagal, penyebabnya jaringan, timeout, atau sitekey salah |
| Sesi browser | `cloudflare`, `waf-session`, `source` | Tinggi selama halaman target merespons normal | Butuh browser dan RAM memadai |
| Best-effort | `hcaptcha`, `aliyun`, `aliyun-extract`, `kasada` | Lolos bila risiko rendah atau tipe cocok | Selalu menjawab `success: false` beserta alasan bila tidak bisa. Tipe icon-click Aliyun tidak didukung |

---

## Quick Start

### Jalankan lokal

```bash
git clone https://github.com/ryuhandev/CaptchaX.git
cd CaptchaX
npm install
cp .env.example .env
npm start
```

Default berjalan di `http://localhost:5000` (ubah lewat `PORT`).

### Verifikasi cepat

```bash
curl http://localhost:5000/
curl http://localhost:5000/api/health
```

### Docker

```bash
docker build -t captchax .
docker run --rm -p 8080:8080 --env-file .env captchax
```

Image sudah memuat Chromium dari apt dan seluruh dependensi sistem yang dibutuhkan solver berbasis browser.

---

### Variabel Environment

| Variabel | Default | Keterangan |
|---|---|---|
| `PORT` | `5000` | Port HTTP. Di Railway, samakan dengan Target Port pada Public Networking |
| `NODE_ENV` | `production` | Mode runtime |
| `MAX_REQUESTS_PER_MINUTE` | `5` | Rate limit per IP untuk seluruh route `/api` |
| `BROWSER_SLOT_WAIT_MS` | `45000` | Maksimal antre menunggu slot browser global (1 Chrome) |
| `PUPPETEER_EXECUTABLE_PATH` | `/usr/bin/chromium` | Path Chromium di dalam image Docker |

---

## Deploy

### Railway

1. Push repository ke GitHub, lalu buat project baru di Railway dan pilih **Deploy from GitHub repo**.
2. Setiap push ke branch `main` akan memicu **auto-redeploy**.
3. Tambahkan Variables: `PORT=8080`, `NODE_ENV=production`, `MAX_REQUESTS_PER_MINUTE=5`.
4. Pada Public Networking, set Target Port sama dengan nilai `PORT`.
5. Health check memakai `GET /` dan sudah dikonfigurasi di `railway.json`.

### Docker (VPS)

```bash
git clone https://github.com/ryuhandev/CaptchaX.git
cd CaptchaX
cp .env.example .env
docker build -t captchax .
docker run -d --name captchax --restart unless-stopped -p 8080:8080 --env-file .env captchax
```

### E2E Workflow

`.github/workflows/e2e.yml` disediakan untuk uji end-to-end. Workflow ini memakai placeholder URL, jadi isi URL instance kamu sendiri saat menjalankan workflow via `workflow_dispatch`.

<p align="right">
  <img src="assets/character-04.png" alt="CaptchaX mascot" width="300">
</p>

---

## Referensi API

Base URL lokal: `http://localhost:5000`
Base URL produksi: `https://<domain-atau-railway-url-anda>`

Format respons seragam: setiap endpoint mengembalikan objek JSON dengan field `success` (boolean). Bila gagal, disertakan `error` atau `reason` yang menjelaskan penyebabnya.

### `GET /`

Info service, daftar endpoint, dan contoh payload setiap solver.

### `GET /api/health`

Health check berisi statistik RAM, CPU, dan disk.

```bash
curl http://localhost:5000/api/health
```

### `POST /api/turnstile`

Menyelesaikan Turnstile lewat fake page yang dirender sendiri. Field `action` opsional dan diteruskan ke `turnstile.render`.

```json
{
  "sitekey": "0x4AAAAAA...",
  "siteurl": "https://example.com",
  "timeout": 45,
  "action": "login"
}
```

```bash
curl -X POST http://localhost:5000/api/turnstile \
  -H "Content-Type: application/json" \
  -d '{"sitekey":"0x4AAAAAA...","siteurl":"https://example.com","timeout":45,"action":"login"}'
```

Respons:

```json
{ "success": true, "token": "XXXX...", "duration": 12.3 }
```

### `POST /api/turnstile-max`

Menyelesaikan Turnstile yang tertanam di halaman asli. Service mengunjungi URL target dan mengklik widget bila diperlukan.

```json
{
  "url": "https://example.com/page-with-turnstile",
  "timeout": 60
}
```

### `POST /api/captchav3`

reCAPTCHA v3 tanpa browser, memakai jalur anchor/reload.

```json
{
  "sitekey": "6Le-...",
  "siteurl": "https://example.com",
  "timeout": 30
}
```

Respons:

```json
{ "success": true, "token": "...", "duration": 1.2 }
```

### `POST /api/altcha`

Menyelesaikan Altcha proof-of-work v1 (SHA-1/256/384/512). Murni komputasi dan selalu selesai selama challenge valid. Kirim salah satu: `challengeurl` (endpoint JSON yang mengembalikan `{ "challenge", "salt", ... }`) atau objek `challenge` langsung.

```json
{ "challengeurl": "https://example.com/altcha-challenge", "timeout": 60 }
```

```json
{
  "challenge": {
    "algorithm": "SHA-256",
    "challenge": "abc...",
    "salt": "def...&",
    "signature": "...",
    "maxnumber": 1000000
  }
}
```

Respons:

```json
{ "success": true, "payload": "eyJ...", "number": 12345, "algorithm": "SHA-256", "duration": 0.4 }
```

Nilai `payload` berupa base64 dan siap dikirim sebagai field `altcha` ke server tujuan.

### `POST /api/friendly`

Menyelesaikan FriendlyCaptcha v1 proof-of-work memakai solver resmi (`friendly-pow` WASM, algoritma identik dengan widget browser).

```json
{ "sitekey": "FCM...", "timeout": 180 }
```

Tambahkan `puzzleEndpoint` bila situs memakai endpoint kustom. Default global: `https://api.friendlycaptcha.com/api/v1/puzzle`.

Respons:

```json
{
  "success": true,
  "solution": "sig.b64.sol.diag",
  "puzzles": 48,
  "field": "frc-captcha-solution",
  "duration": 50.8
}
```

Isi nilai `solution` ke field `frc-captcha-solution` pada form tujuan.

### `POST /api/hcaptcha`

hCaptcha checkbox atau invisible melalui browser. Bersifat best-effort dan hanya lolos bila tidak muncul image challenge.

```json
{
  "sitekey": "10000000-ffff-ffff-ffff-000000000001",
  "siteurl": "https://example.com",
  "timeout": 60,
  "invisible": false,
  "rqdata": "opsional, untuk enterprise",
  "debug": false
}
```

### `POST /api/aliyun`

Aliyun Captcha 2.0 dengan pendekatan ala CapMonster: widget dirender di halaman minimal milik sendiri bermodal `sceneId` dan `prefix` situs target, tanpa mengunjungi situs target.

```json
{
  "sceneId": "XXXX",
  "prefix": "xxxxxx",
  "region": "sgp",
  "language": "en",
  "mode": "popup",
  "timeout": 120,
  "debug": false
}
```

Cara mendapatkan parameter:

- `prefix` adalah subdomain dari `https://<prefix>.captcha-open.*.aliyuncs.com` pada tab Network.
- `sceneId` diambil dari payload atau body request saat captcha muncul.
- `region` bernilai `sgp` atau `cn`, samakan dengan console situs target. Solver otomatis mencoba region lainnya bila init gagal.

Field opsional: `language` (`en`/`cn`/`tw`), `mode` (`popup`/`embed`/`float`), `sdkUrl` (override CDN SDK), `debug: true` (menyertakan `debug` berisi stages, attempts, dan screenshot saat gagal).

Bila init gagal (`INIT_FAIL`), artinya ketiga parameter tidak cocok atau scene tidak aktif. Solver langsung menjawab jujur tanpa menunggu timeout.

### `POST /api/aliyun-extract`

Mendeteksi otomatis `region`, `prefix`, dan `sceneId` dari URL halaman target. Bersifat best-effort karena captcha biasanya baru dimuat setelah aksi tertentu seperti klik Login, jadi pakai URL yang memang memicu captcha.

```json
{ "url": "https://example.com/login", "timeout": 30 }
```

Respons:

```json
{
  "success": true,
  "region": "sgp",
  "prefix": "xxxxxx",
  "sceneId": "XXXX",
  "sceneIds": [],
  "apiGetLib": "...",
  "requests": [],
  "hint": "ok"
}
```

Tahapan solver saat memecahkan challenge:

- TRACELESS lolos secara otomatis.
- BEHAVIOR-SLIDE melakukan drag penuh menyerupai manusia.
- PUZZLE-SLIDE mendeteksi gap (`shadow.png` vs `back.png`, template matching dengan jimp), lalu drag closed-loop dengan posisi piece dibaca langsung setiap langkah sampai tepat di gap, termasuk retry multi-attempt dengan koreksi.

Respons:

```json
{ "success": true, "verifyParam": "...", "duration": 25.4 }
```

`verifyParam` (captchaVerifyParam) langsung dipakai untuk request bisnis ke server situs target. Token bersifat sekali pakai dan terikat sesi, sehingga verifikasi harus dilakukan dari IP yang sama. Tipe icon-click atau "klik berurutan" tidak didukung dan dijawab `success: false`.

### `POST /api/kasada`

Menangkap header dan cookie proof-of-work Kasada (`x-kpsdk-ct` / `x-kpsdk-cd`) dari URL target. Kontribusi [@hazeloffc](https://github.com/hazeloffc) (PR #1), di-hardening agar memakai `BrowserService`, rate limit, validasi URL, dan antrean browser global.

```json
{ "url": "https://example.com", "timeout": 30, "waitTime": 15 }
```

Respons:

```json
{
  "success": true,
  "headers": {
    "x-kpsdk-ct": "...",
    "x-kpsdk-cd": "...",
    "user-agent": "..."
  },
  "cookies": [],
  "duration": 16.2
}
```

Bila target tidak memakai Kasada, API menjawab `success: false` beserta alasannya.

### `POST /api/cloudflare`

Bypass Cloudflare challenge dan mengembalikan `cf_clearance`.

```json
{ "url": "https://example.com", "headless": true, "timeout": 30 }
```

Respons:

```json
{
  "success": true,
  "cf_clearance": "...",
  "cookie_string": "...",
  "cookies": [],
  "user_agent": "..."
}
```

### `POST /api/waf-session`

Mengambil cookies dan headers sesi WAF dari sebuah URL untuk dipakai pada request lanjutan.

```json
{ "url": "https://example.com", "timeout": 60 }
```

Respons:

```json
{ "success": true, "cookies": [], "headers": {}, "duration": 8.1 }
```

### `POST /api/source`

Mengambil HTML hasil render browser, termasuk halaman yang dilindungi proteksi dasar.

```json
{ "url": "https://example.com", "timeout": 60 }
```

Respons:

```json
{ "success": true, "html": "<!DOCTYPE html>...", "duration": 8.1 }
```

### `POST /api/get-sitekey`

Mendeteksi sitekey captcha dari URL target beserta klasifikasinya. Memakai browser untuk memuat halaman, lalu memindai atribut DOM (`data-sitekey` dan sejenisnya), inline script, global variable JS, iframe `src`, serta network request/response.

```json
{ "url": "https://example.com/login", "timeout": 30 }
```

Respons:

```json
{
  "success": true,
  "url": "https://example.com/login",
  "final_url": "https://example.com/login",
  "title": "Login - Example",
  "detected_providers": ["recaptcha", "turnstile"],
  "sitekeys": [
    {
      "type": "recaptcha",
      "label": "Google reCAPTCHA",
      "variant": "v2-or-v3",
      "sitekey": "6Le-wvkSAAAAAPBMRTvw0Q4Muexq9bi0DJwx_mJ-",
      "pattern": "6L-prefixed (Google reCAPTCHA)",
      "sources": ["dom:data-sitekey", "recaptcha-render-param"],
      "solver": "/api/captchav3",
      "solver_param": "sitekey"
    }
  ],
  "aliyun_hint": null,
  "total_keys_found": 1,
  "duration": 7.2
}
```

---

## Deteksi Sitekey Otomatis

Tipe sitekey yang dikenali oleh `/api/get-sitekey`:

| `type` | Label | Pola sitekey | Solver |
|---|---|---|---|
| `turnstile` | Cloudflare Turnstile | diawali `0x` (mis. `0x4AAAAAA...`) | `/api/turnstile` |
| `recaptcha` | Google reCAPTCHA v2 / v3 / enterprise | diawali `6L` | `/api/captchav3` |
| `hcaptcha` | hCaptcha | UUID `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` | `/api/hcaptcha` |
| `friendly` | FriendlyCaptcha | diawali `FCM` atau `FCS` | `/api/friendly` |
| `altcha` | Altcha (kandidat) | base64 panjang, tanpa static sitekey | `/api/altcha` dengan `challengeurl` |

Field `solver` dan `solver_param` menunjuk endpoint dan nama parameter yang bisa langsung dipakai, sehingga hasil deteksi dapat diteruskan otomatis ke solver yang sesuai.

Bila Aliyun Captcha terdeteksi, respons menyertakan `aliyun_hint` yang mengarahkan ke `/api/aliyun-extract`, karena Aliyun memakai `sceneId` + `prefix`, bukan sitekey tradisional.

---

## Test Keys

| Solver | Sitekey | Hasil yang diharapkan |
|---|---|---|
| Turnstile | `1x00000000000000000000AA` | `XXXX.DUMMY.TOKEN.XXXX` |
| reCAPTCHA v3 | `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI` | token valid |
| FriendlyCaptcha | `FCMGEMUD2M567T8G` (demo homepage) | solusi valid |

<p align="center">
  <img src="assets/konata.png" alt="CaptchaX mascot" width="380">
</p>

---

## Struktur Proyek

```text
CaptchaX/
├── .github/workflows/e2e.yml     # workflow E2E (URL diisi saat workflow_dispatch)
├── assets/                       # banner dan aset karakter
├── src/
│   ├── index.js                  # Express app, PORT dari env, listen 0.0.0.0
│   ├── routes/
│   │   ├── solve.js              # turnstile, turnstile-max, captchav3, altcha, friendly,
│   │   │                         # hcaptcha, aliyun, aliyun-extract, kasada, cloudflare,
│   │   │                         # waf-session, source, get-sitekey
│   │   └── health.js             # /health
│   └── services/
│       ├── turnstile.js          # BypassService: fakePage render + action, max, wafSession, getSource
│       ├── browser.js            # pool puppeteer-real-browser + xvfb
│       ├── browserLock.js        # antrean slot browser global (1 Chrome)
│       ├── captchaV3.js          # reCAPTCHA v3 tanpa browser (anchor/reload)
│       ├── altcha.js             # Altcha PoW v1 (brute force SHA, sesuai altcha-lib)
│       ├── friendly.js           # FriendlyCaptcha PoW v1 (solver WASM resmi)
│       ├── hcaptcha.js           # hCaptcha checkbox/invisible via browser (best-effort, fail-fast)
│       ├── aliyun.js             # Aliyun Captcha 2.0 harvest (closed-loop puzzle drag + jimp gap-detect)
│       ├── extractAliyun.js      # deteksi sceneId/prefix/region Aliyun dari URL target
│       ├── kasada.js             # tangkap header PoW Kasada (kontribusi hazeloffc, PR #1)
│       ├── getSitekey.js         # deteksi dan klasifikasi sitekey dari URL target
│       └── cloudflare.js         # challenge clicker menuju cf_clearance
├── Dockerfile
├── railway.json
├── .env.example
└── package.json
```

---

## Rate Limit dan Kebutuhan Resource

- Rate limit default: **5 request per menit per IP**, diubah lewat `MAX_REQUESTS_PER_MINUTE`.
- Antrean browser global: hanya **1 solve browser dalam satu waktu**; request berikutnya menunggu maksimal `BROWSER_SLOT_WAIT_MS` (default 45 detik), selebihnya dijawab `Browser busy`.
- Endpoint berbasis browser (`turnstile`, `turnstile-max`, `cloudflare`, `kasada`, `waf-session`, `source`, `get-sitekey`, `hcaptcha`, `aliyun`) membutuhkan **RAM minimal 1 GB** karena menjalankan Chromium.
- Endpoint tanpa browser (`captchav3`, `altcha`, `friendly`) ringan dan tetap bisa jalan pada instance kecil.
- Xvfb dikelola otomatis oleh `puppeteer-real-browser`, jadi tidak perlu `xvfb-run` di level container.
- Semua response error memakai HTTP status dan payload JSON yang bisa dibaca mesin.

---

## FAQ

**Apakah semua solver dijamin berhasil?**

Tidak. Endpoint PoW dan token (turnstile, reCAPTCHA v3, altcha, friendly) deterministik, tetapi `hcaptcha`, `aliyun`, dan `kasada` bergantung pada profil risiko dan tipe challenge yang muncul. API selalu melaporkan kegagalan secara eksplisit.

**Kenapa `hcaptcha` gagal padahal sitekey benar?**

Umumnya karena muncul image challenge. Solver hanya menangani checkbox dan invisible, dan berhenti lebih awal agar tidak menunggu timeout.

**Berapa lama token valid?**

Token Turnstile, reCAPTCHA, dan hCaptcha berumur pendek dan terikat domain serta sesi. Kirim ke server target segera setelah diterima.

**Bisakah token dipakai dari IP berbeda?**

Tidak disarankan. Untuk Aliyun, verifikasi wajib dari IP yang sama karena token terikat sesi.

**Kenapa endpoint browser sering OOM di Railway?**

Chromium butuh memori. Naikkan plan atau RAM instance, dan hindari memanggil endpoint browser secara paralel dalam jumlah besar. Sejak update antrean browser, request paralel dijawab `Browser busy` daripada menumpuk proses Chrome.

**Apakah bisa dipakai untuk mengklik urutan gambar Aliyun?**

Belum. Tipe icon-click tidak didukung dan API menjawab `success: false`.

**Apakah ada autentikasi API?**

Belum ada API key bawaan. Lindungi instance dengan proxy, IP allowlist, atau reverse proxy milik sendiri sebelum mengeksposnya ke publik.

---

## Roadmap

- [x] Cloudflare Turnstile (fake page dan embedded page)
- [x] reCAPTCHA v3 tanpa browser
- [x] Altcha PoW (SHA-1/256/384/512)
- [x] FriendlyCaptcha PoW (solver WASM resmi)
- [x] hCaptcha checkbox (best-effort)
- [x] Aliyun Captcha 2.0 + auto-extract `sceneId`/`prefix`
- [x] Kasada PoW header capture (kontribusi [@hazeloffc](https://github.com/hazeloffc), PR #1)
- [x] Cloudflare challenge (`cf_clearance`) dan WAF session
- [x] Rendered page source
- [x] Detektor sitekey otomatis
- [x] Antrean browser global (1 Chrome) anti-OOM
- [x] Dockerfile, `railway.json`, workflow E2E
- [ ] API key dan kuota per user
- [ ] Dukungan webhook / callback hasil solve
- [ ] Image challenge solver untuk hCaptcha
- [ ] Unit test untuk solver PoW tanpa browser

<br>

<p align="left">
  <img src="assets/character-03.png" alt="CaptchaX mascot" width="230">
</p>

---

## Kontribusi

Kontribusi, issue, dan pull request terbuka untuk siapa saja. Alur yang dianjurkan:

1. Fork repository ini dan buat branch baru: `git checkout -b feat/nama-fitur`.
2. Jalankan `npm install` dan uji endpoint yang kamu ubah secara lokal.
3. Pastikan tidak ada kredensial, cookie, atau URL internal yang ikut ter-commit.
4. Buat pull request dengan deskripsi singkat: masalah, pendekatan, dan cara menguji.

Untuk bug report, sertakan endpoint, payload tanpa data sensitif, dan isi respons `error` atau `reason`, serta versi Node dan platform deploy yang dipakai.

---

## Kontributor

| [![ryuhandev](https://github.com/ryuhandev.png?size=100)](https://github.com/ryuhandev) | [![hazeloffc](https://github.com/hazeloffc.png?size=100)](https://github.com/hazeloffc) |
|---|---|
| **[@ryuhandev](https://github.com/ryuhandev)** — Owner & maintainer | **[@hazeloffc](https://github.com/hazeloffc)** — Kasada solver (PR #1) |

---

## Lisensi dan Disclaimer

Dirilis di bawah lisensi **Apache License 2.0**. Lihat berkas [LICENSE](https://github.com/ryuhandev/CaptchaX/blob/main/LICENSE) untuk teks lengkapnya.

Proyek ini disediakan untuk keperluan riset keamanan, pengujian otomatis pada sistem milik sendiri, dan integrasi yang sah. Penggunaan untuk melewati captcha pada layanan pihak ketiga tanpa izin dapat melanggar hukum setempat maupun Terms of Service layanan tersebut. Segala risiko dan konsekuensi penggunaan menjadi tanggung jawab pengguna.

Dibuat dan dirawat oleh [@ryuhandev](https://github.com/ryuhandev).

---

<p align="center">
  <a href="https://star-history.com/#ryuhandev/CaptchaX&Date">
    <img src="https://api.star-history.com/svg?repos=ryuhandev/CaptchaX&type=Date" alt="Star history CaptchaX" width="720">
  </a>
</p>

<p align="center">
  Kalau proyek ini berguna, beri bintang di repository ini.
</p>
