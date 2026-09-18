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

---

## 🌍 Documentation / Dokumentasi / ドキュメント / 文档 / Документация / दस्तावेज़

| Language | File |
|---|---|
| 🇮🇩 Bahasa Indonesia | [README.id.md](README.id.md) |
| 🇬🇧 English | [README.en.md](README.en.md) |
| 🇯🇵 日本語 | [README.ja.md](README.ja.md) |
| 🇨🇳 中文 | [README.zh.md](README.zh.md) |
| 🇷🇺 Русский | [README.ru.md](README.ru.md) |
| 🇮🇳 हिन्दी | [README.hi.md](README.hi.md) |

CaptchaX adalah REST API all-in-one untuk menyelesaikan dan melewati berbagai captcha serta proteksi anti-bot: **Cloudflare Turnstile**, **Cloudflare challenge / WAF**, **Kasada PoW**, **reCAPTCHA v3**, **hCaptcha**, **Aliyun Captcha 2.0**, **FriendlyCaptcha**, **Altcha**, plus **rendered source** dan **detektor sitekey** otomatis.

CaptchaX is a single REST API that solves and bypasses a broad set of captchas and anti-bot protections in one service.

---

## ✨ Update Terbaru / Latest Update — Kasada Solver

Endpoint baru **`POST /api/kasada`** menangkap header dan cookie proof-of-work Kasada (`x-kpsdk-ct` / `x-kpsdk-cd`) dari URL target. Kontribusi oleh [@hazeloffc](https://github.com/hazeloffc) (PR #1), di-hardening agar memakai `BrowserService`, rate limit, validasi URL, dan antrean browser global.

```bash
curl -X POST https://your-app.up.railway.app/api/kasada \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","timeout":30,"waitTime":15}'
```

Lihat dokumentasi lengkap per bahasa di tabel atas.

---

## 🤝 Contributors / Kontributor

| [![ryuhandev](https://github.com/ryuhandev.png?size=100)](https://github.com/ryuhandev) | [![hazeloffc](https://github.com/hazeloffc.png?size=100)](https://github.com/hazeloffc) |
|---|---|
| **[@ryuhandev](https://github.com/ryuhandev)** — Owner & maintainer | **[@hazeloffc](https://github.com/hazeloffc)** — Kasada solver (PR #1) |

---

## Lisensi / License

Dirilis di bawah **Apache License 2.0**. Lihat [LICENSE](https://github.com/ryuhandev/CaptchaX/blob/main/LICENSE).

Released under the **Apache License 2.0**. See [LICENSE](https://github.com/ryuhandev/CaptchaX/blob/main/LICENSE).
