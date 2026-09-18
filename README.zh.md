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
  <a href="README.id.md">🇮🇩 Indonesia</a> · <a href="README.en.md">🇬🇧 English</a> · <a href="README.ja.md">🇯🇵 日本語</a> · 🇨🇳 中文 · <a href="README.ru.md">🇷🇺 Русский</a> · <a href="README.hi.md">🇮🇳 हिन्दी</a>
</p>

---

## 简介

CaptchaX 是集多种验证码与反机器人防护于一体的 REST API:**Cloudflare Turnstile**、**Cloudflare challenge / WAF**、**Kasada PoW**、**reCAPTCHA v3**、**hCaptcha**、**阿里云验证码 2.0**、**FriendlyCaptcha**、**Altcha (proof-of-work)**，以及**渲染后页面源码**获取和**自动 sitekey 检测**工具。

所有求解器运行在同一个 Express 进程中。只有真正需要的接口才会使用 headful 浏览器(Puppeteer，经 `puppeteer-real-browser`)，可直接部署到 Railway 或 Docker。

## 支持的验证码

| 验证码 / 防护 | 接口 | 方式 | 基础 |
|---|---|---|---|
| Cloudflare Turnstile (独立) | `POST /api/turnstile` | 自渲染假页面 + 可选 `action` | 浏览器 |
| Cloudflare Turnstile (嵌入) | `POST /api/turnstile-max` | 访问目标 URL，必要时点击组件 | 浏览器 |
| Cloudflare challenge / WAF | `POST /api/cloudflare` | 挑战点击器，获取 `cf_clearance` | 浏览器 |
| Kasada PoW | `POST /api/kasada` | 捕获 `x-kpsdk-ct` / `x-kpsdk-cd` 头 + Cookie | 浏览器 |
| WAF 会话 | `POST /api/waf-session` | 获取会话 Cookie + 请求头 | 浏览器 |
| reCAPTCHA v3 | `POST /api/captchav3` | anchor/reload(无需浏览器) | HTTP |
| hCaptcha | `POST /api/hcaptcha` | 复选框/invisible | 浏览器 |
| 阿里云验证码 2.0 | `POST /api/aliyun` | 用 `sceneId` + `prefix` 自建页面渲染 | 浏览器 |
| 阿里云验证码 2.0 (自动检测) | `POST /api/aliyun-extract` | 从 URL 检测 `region` + `prefix` + `sceneId` | 浏览器 |
| FriendlyCaptcha v1 | `POST /api/friendly` | 官方 `friendly-pow` WASM 求解器 | HTTP + WASM |
| Altcha PoW v1 | `POST /api/altcha` | SHA-1/256/384/512 暴力计算 | 计算 |
| 渲染后源码 | `POST /api/source` | 浏览器渲染后的 HTML | 浏览器 |
| Sitekey 检测 | `POST /api/get-sitekey` | sitekey 分类 + 求解器推荐 | 浏览器 |
| 健康检查 | `GET /api/health` | RAM/CPU/磁盘状态 | 进程 |

## 可靠性

| 分组 | 接口 | 可靠性 | 说明 |
|---|---|---|---|
| 确定性 PoW / 令牌 | `turnstile`、`turnstile-max`、`captchav3`、`altcha`、`friendly` | 高 | 无图片挑战。失败原因一般是网络、超时或 sitekey 错误 |
| 浏览器会话 | `cloudflare`、`waf-session`、`source` | 目标页面正常时高 | 需要浏览器和充足内存 |
| 尽力而为 | `hcaptcha`、`aliyun`、`aliyun-extract`、`kasada` | 风险低或类型匹配时通过 | 失败时一定返回 `success: false` 及原因。阿里云点选/按序点击类型不支持 |

## 快速开始

```bash
git clone https://github.com/ryuhandev/CaptchaX.git
cd CaptchaX
npm install
cp .env.example .env
npm start
```

默认运行在 `http://localhost:5000`(可通过 `PORT` 修改)。用 `curl http://localhost:5000/` 和 `curl http://localhost:5000/api/health` 验证。

Docker:

```bash
docker build -t captchax .
docker run --rm -p 8080:8080 --env-file .env captchax
```

环境变量:`PORT`(默认 `5000`，Railway 上需与 Public Networking 目标端口一致)、`NODE_ENV`(默认 `production`)、`MAX_REQUESTS_PER_MINUTE`(默认 `5`)、`BROWSER_SLOT_WAIT_MS`(默认 `45000`)、`PUPPETEER_EXECUTABLE_PATH`(Docker 内为 `/usr/bin/chromium`)。

Railway: 从本仓库创建项目，将 Public Networking 目标端口设为与 `PORT` 相同并添加上述变量即可。推送到 `main` 会自动重新部署。

## API 参考

本地基地址:`http://localhost:5000`。所有接口统一返回含 boolean `success` 的 JSON，失败时附带 `error` 原因。

### `GET /`

服务信息、接口列表及示例载荷。

### `GET /api/health`

RAM、CPU、磁盘统计。

### `POST /api/turnstile`

通过自渲染假页面求解 Turnstile。`action` 可选，会透传给 `turnstile.render`。

```json
{ "sitekey": "0x4AAAAAA...", "siteurl": "https://example.com", "timeout": 45, "action": "login" }
```

返回:`{ "success": true, "token": "XXXX...", "duration": 12.3 }`

### `POST /api/turnstile-max`

求解嵌入在真实页面中的 Turnstile。服务会访问目标 URL，必要时点击组件。

```json
{ "url": "https://example.com/page-with-turnstile", "timeout": 60 }
```

### `POST /api/captchav3`

无需浏览器的 reCAPTCHA v3(anchor/reload 通道)。

```json
{ "sitekey": "6Le-...", "siteurl": "https://example.com", "timeout": 30 }
```

返回:`{ "success": true, "token": "...", "duration": 1.2 }`

### `POST /api/altcha`

求解 Altcha proof-of-work v1(SHA-1/256/384/512)。纯计算，只要挑战有效就一定完成。发送 `challengeurl` 或 `challenge` 对象二选一。

```json
{ "challengeurl": "https://example.com/altcha-challenge", "timeout": 60 }
```

```json
{ "challenge": { "algorithm": "SHA-256", "challenge": "abc...", "salt": "def...&", "signature": "...", "maxnumber": 1000000 } }
```

返回:`{ "success": true, "payload": "eyJ...", "number": 12345, "algorithm": "SHA-256", "duration": 0.4 }`。将 base64 `payload` 作为 `altcha` 表单字段提交。

### `POST /api/friendly`

使用官方求解器(`friendly-pow` WASM，与浏览器组件算法一致)求解 FriendlyCaptcha v1 PoW。

```json
{ "sitekey": "FCM...", "timeout": 180 }
```

站点使用自定义接口时追加 `puzzleEndpoint`(默认:`https://api.friendlycaptcha.com/api/v1/puzzle`)。返回:`{ "success": true, "solution": "sig.b64.sol.diag", "puzzles": 48, "field": "frc-captcha-solution", "duration": 50.8 }`。将 `solution` 填入 `frc-captcha-solution` 字段。

### `POST /api/hcaptcha`

经浏览器求解 hCaptcha 复选框/invisible。尽力而为，仅在不出现图片挑战时通过。

```json
{ "sitekey": "10000000-ffff-ffff-ffff-000000000001", "siteurl": "https://example.com", "timeout": 60 }
```

### `POST /api/aliyun`

CapMonster 式阿里云验证码 2.0:使用目标站点的 `sceneId` 和 `prefix`，在自建极简页面中渲染组件，不访问目标站点本身。

```json
{ "sceneId": "XXXX", "prefix": "xxxxxx", "region": "sgp", "timeout": 120 }
```

参数获取:`prefix` 为 Network 面板中 `https://<prefix>.captcha-open.*.aliyuncs.com` 的子域名;`sceneId` 取自验证码出现时的请求载荷;`region` 为 `sgp`/`cn`(初始化失败时自动尝试另一个)。可选:`language`、`mode`、`sdkUrl`、`debug`。初始化失败(`INIT_FAIL`)表示参数错误或场景未激活，服务会如实回答而不等待超时。返回的 `verifyParam` 为一次性会话绑定令牌，必须用同一 IP 验证。点选/按序点击类型不支持。

### `POST /api/aliyun-extract`

从目标页面 URL 自动检测 `region`、`prefix`、`sceneId`。尽力而为，因为验证码通常要在点击登录等操作后才加载，请使用确实能触发验证码的 URL。

```json
{ "url": "https://example.com/login", "timeout": 30 }
```

### `POST /api/kasada`

从目标 URL 捕获 Kasada proof-of-work 头与 Cookie(`x-kpsdk-ct` / `x-kpsdk-cd`)。由 [@hazeloffc](https://github.com/hazeloffc) 贡献(PR #1)，已加固为使用 `BrowserService`、限流、URL 校验和全局浏览器队列。

```json
{ "url": "https://example.com", "timeout": 30, "waitTime": 15 }
```

返回:

```json
{
  "success": true,
  "headers": { "x-kpsdk-ct": "...", "x-kpsdk-cd": "...", "user-agent": "..." },
  "cookies": [],
  "duration": 16.2
}
```

目标未使用 Kasada 时返回 `success: false` 及原因。

### `POST /api/cloudflare`

绕过 Cloudflare 挑战并返回 `cf_clearance`。

```json
{ "url": "https://example.com", "headless": true, "timeout": 30 }
```

返回:`{ "success": true, "cf_clearance": "...", "cookie_string": "...", "cookies": [], "user_agent": "..." }`

### `POST /api/waf-session`

获取某 URL 的 WAF 会话 Cookie 与请求头，供后续请求使用。

```json
{ "url": "https://example.com", "timeout": 60 }
```

返回:`{ "success": true, "cookies": [], "headers": {}, "duration": 8.1 }`

### `POST /api/source`

获取浏览器渲染后的 HTML，包括受基础防护的页面。

```json
{ "url": "https://example.com", "timeout": 60 }
```

返回:`{ "success": true, "html": "<!DOCTYPE html>...", "duration": 8.1 }`

### `POST /api/get-sitekey`

检测目标 URL 上的验证码 sitekey 并分类。用浏览器加载页面，扫描 DOM 属性、内联脚本、JS 全局变量、iframe 来源及网络流量。

```json
{ "url": "https://example.com/login", "timeout": 30 }
```

每条结果包含推荐的 `solver` 与 `solver_param`，可直接转交给对应求解器。识别类型:`turnstile`(`0x` 前缀)、`recaptcha`(`6L` 前缀)、`hcaptcha`(UUID)、`friendly`(`FCM`/`FCS` 前缀)、`altcha`(长 base64 候选)。检测到阿里云时会附带指向 `/api/aliyun-extract` 的 `aliyun_hint`。

## 自动 Sitekey 检测

| `type` | 标签 | 模式 | 求解器 |
|---|---|---|---|
| `turnstile` | Cloudflare Turnstile | `0x` 前缀 | `/api/turnstile` |
| `recaptcha` | Google reCAPTCHA v2 / v3 / enterprise | `6L` 前缀 | `/api/captchav3` |
| `hcaptcha` | hCaptcha | UUID | `/api/hcaptcha` |
| `friendly` | FriendlyCaptcha | `FCM` / `FCS` 前缀 | `/api/friendly` |
| `altcha` | Altcha (候选) | 长 base64，无固定 sitekey | 带 `challengeurl` 的 `/api/altcha` |

## 测试密钥

| 求解器 | Sitekey | 预期结果 |
|---|---|---|
| Turnstile | `1x00000000000000000000AA` | `XXXX.DUMMY.TOKEN.XXXX` |
| reCAPTCHA v3 | `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI` | 有效令牌 |
| FriendlyCaptcha | `FCMGEMUD2M567T8G` | 有效解 |

## 项目结构

```text
CaptchaX/
├── .github/workflows/e2e.yml     # E2E(运行时填入自己的 URL)
├── assets/                       # 横幅与角色素材
├── src/
│   ├── index.js                  # Express 应用
│   ├── routes/solve.js           # 全部求解器路由
│   ├── routes/health.js          # /health
│   └── services/                 # 求解器(browser.js、browserLock.js、kasada.js 等)
├── Dockerfile
├── railway.json
├── .env.example
└── package.json
```

## 限流与资源

- 默认限流:**每 IP 每分钟 5 请求**(`MAX_REQUESTS_PER_MINUTE`)。
- 全局浏览器队列:**同一时间仅 1 个浏览器任务**。后续请求最多等待 `BROWSER_SLOT_WAIT_MS`(默认 45 秒)，超时返回 `Browser busy`。
- 浏览器类接口需要 Chromium，至少 **1 GB 内存**。非浏览器接口(`captchav3`、`altcha`、`friendly`)很轻量。
- Xvfb 由 `puppeteer-real-browser` 内部管理。
- 错误响应均为机器可读的 HTTP 状态码 + JSON。

## FAQ

**所有求解器都保证成功吗?** 不是。PoW 与令牌类是确定性的，但 `hcaptcha`、`aliyun`、`kasada` 取决于风险画像与挑战类型，失败一定明确说明。

**sitekey 正确但 `hcaptcha` 失败?** 多半出现了图片挑战。本求解器只处理复选框/invisible，会提前退出而不空等超时。

**令牌有效期?** 很短，且绑定域名与会话，收到后立即发往目标服务器。

**可以换 IP 使用吗?** 不建议。阿里云必须同一 IP 验证(会话绑定)。

**Railway 上 OOM?** Chromium 吃内存。请升级套餐，并发调用浏览器接口。浏览器队列现已用 `Browser busy` 代替堆积 Chrome 进程。

**阿里云按序点图支持吗?** 不支持，返回 `success: false`。

**有 API 鉴权吗?** 暂无内置 API key。公开前请自行加代理、IP 白名单或反向代理保护。

## 路线图

- [x] Turnstile、reCAPTCHA v3、Altcha、FriendlyCaptcha、hCaptcha、Aliyun、Kasada、Cloudflare、WAF 会话、源码、sitekey 检测
- [x] 防 OOM 全局浏览器队列(单 Chrome)
- [x] Dockerfile、`railway.json`、E2E 工作流
- [ ] API key 与按用户配额
- [ ] 求解结果 Webhook / 回调投递
- [ ] hCaptcha 图片挑战求解器
- [ ] 无浏览器 PoW 求解器单元测试

## 贡献

欢迎贡献、issue 与 PR:

1. Fork 并建分支:`git checkout -b feat/my-feature`。
2. `npm install`，在本地测试改动的接口。
3. 不要提交凭证、Cookie 或内部 URL。
4. 发起 PR，说明问题、方案与测试方法。

Bug 反馈请附接口、脱敏载荷、`error` 响应、Node 版本与部署平台。

## 贡献者

| [![ryuhandev](https://github.com/ryuhandev.png?size=100)](https://github.com/ryuhandev) | [![hazeloffc](https://github.com/hazeloffc.png?size=100)](https://github.com/hazeloffc) |
|---|---|
| **[@ryuhandev](https://github.com/ryuhandev)** — 作者与维护者 | **[@hazeloffc](https://github.com/hazeloffc)** — Kasada 求解器 (PR #1) |

## 许可与免责

基于 **Apache License 2.0** 发布，见 [LICENSE](https://github.com/ryuhandev/CaptchaX/blob/main/LICENSE)。

本项目仅供安全研究、自有系统自动化测试与合法集成。未经许可绕过第三方服务的验证码可能违反当地法律与服务条款，使用风险自负。

维护者:[@ryuhandev](https://github.com/ryuhandev)。
