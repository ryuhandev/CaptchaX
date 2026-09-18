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
  <a href="README.md">Indonesia</a> · <a href="README.en.md">English</a> · <a href="README.ja.md">日本語</a> · <a href="README.zh.md">中文</a> · Русский · <a href="README.hi.md">हिन्दी</a>
</p>

---

## Обзор

CaptchaX - это единый REST API для решения и обхода широкого спектра капч и антибот-защит: **Cloudflare Turnstile**, **Cloudflare challenge / WAF**, **Kasada PoW**, **reCAPTCHA v3**, **hCaptcha**, **Aliyun Captcha 2.0**, **FriendlyCaptcha**, **Altcha (proof-of-work)**, а также получение **отрендеренного исходника страницы** и **автоматический детектор sitekey**.

Всё работает в одном процессе Express. Headful-браузер (Puppeteer через `puppeteer-real-browser`) используется только теми эндпоинтами, которым он действительно нужен. Сервис готов к деплою на Railway и Docker.

## Поддерживаемые капчи

| Капча / защита | Эндпоинт | Метод | Основа |
|---|---|---|---|
| Cloudflare Turnstile (отдельно) | `POST /api/turnstile` | рендер фейковой страницы + опциональный `action` | Браузер |
| Cloudflare Turnstile (встроенная) | `POST /api/turnstile-max` | посещение целевого URL, клик по виджету при необходимости | Браузер |
| Cloudflare challenge / WAF | `POST /api/cloudflare` | кликер challenge ради `cf_clearance` | Браузер |
| Kasada PoW | `POST /api/kasada` | захват заголовков `x-kpsdk-ct` / `x-kpsdk-cd` + cookies | Браузер |
| WAF-сессия | `POST /api/waf-session` | получение cookies + заголовков сессии | Браузер |
| reCAPTCHA v3 | `POST /api/captchav3` | anchor/reload, без браузера | HTTP |
| hCaptcha | `POST /api/hcaptcha` | чекбокс/invisible | Браузер |
| Aliyun Captcha 2.0 | `POST /api/aliyun` | рендер виджета на своей странице из `sceneId` + `prefix` | Браузер |
| Aliyun Captcha 2.0 (автодетект) | `POST /api/aliyun-extract` | определение `region` + `prefix` + `sceneId` по URL | Браузер |
| FriendlyCaptcha v1 | `POST /api/friendly` | официальный WASM-солвер `friendly-pow` | HTTP + WASM |
| Altcha PoW v1 | `POST /api/altcha` | перебор SHA-1/256/384/512 | Вычисления |
| Отрендеренный исходник | `POST /api/source` | HTML после рендера браузером | Браузер |
| Детектор sitekey | `POST /api/get-sitekey` | классификация sitekey + рекомендация солвера | Браузер |
| Health check | `GET /api/health` | состояние RAM/CPU/диска | Процесс |

## Надёжность

| Группа | Эндпоинты | Надёжность | Примечание |
|---|---|---|---|
| Детерминированные PoW / токены | `turnstile`, `turnstile-max`, `captchav3`, `altcha`, `friendly` | Высокая | Без image challenge. Причины ошибок: сеть, таймаут, неверный sitekey |
| Браузерные сессии | `cloudflare`, `waf-session`, `source` | Высокая, пока целевая страница отвечает нормально | Нужны браузер и достаточно RAM |
| Best-effort | `hcaptcha`, `aliyun`, `aliyun-extract`, `kasada` | Проходят при низком риске или подходящем типе | При неудаче всегда честный `success: false` с причиной. Icon-click Aliyun не поддерживается |

## Быстрый старт

```bash
git clone https://github.com/ryuhandev/CaptchaX.git
cd CaptchaX
npm install
cp .env.example .env
npm start
```

По умолчанию `http://localhost:5000` (меняется через `PORT`). Проверка: `curl http://localhost:5000/` и `curl http://localhost:5000/api/health`.

Docker:

```bash
docker build -t captchax .
docker run --rm -p 8080:8080 --env-file .env captchax
```

Переменные окружения: `PORT` (по умолчанию `5000`, на Railway должен совпадать с target port в Public Networking), `NODE_ENV` (по умолчанию `production`), `MAX_REQUESTS_PER_MINUTE` (по умолчанию `5`), `BROWSER_SLOT_WAIT_MS` (по умолчанию `45000`), `PUPPETEER_EXECUTABLE_PATH` (в Docker: `/usr/bin/chromium`).

Railway: создайте проект из этого репозитория, выставьте target port равным `PORT` и добавьте переменные. Пуши в `main` вызывают автоматический редеплой.

## Справочник API

Локальный базовый URL: `http://localhost:5000`. Все эндпоинты возвращают JSON с boolean-полем `success`; при ошибке прилагается `error` с причиной.

### `GET /`

Информация о сервисе, список эндпоинтов и примеры payload.

### `GET /api/health`

Статистика RAM, CPU и диска.

### `POST /api/turnstile`

Решение Turnstile через собственную фейковую страницу. Поле `action` опционально и пробрасывается в `turnstile.render`.

```json
{ "sitekey": "0x4AAAAAA...", "siteurl": "https://example.com", "timeout": 45, "action": "login" }
```

Ответ: `{ "success": true, "token": "XXXX...", "duration": 12.3 }`

### `POST /api/turnstile-max`

Turnstile, встроенная в настоящую страницу. Сервис посещает целевой URL и кликает виджет при необходимости.

```json
{ "url": "https://example.com/page-with-turnstile", "timeout": 60 }
```

### `POST /api/captchav3`

reCAPTCHA v3 без браузера, через anchor/reload.

```json
{ "sitekey": "6Le-...", "siteurl": "https://example.com", "timeout": 30 }
```

Ответ: `{ "success": true, "token": "...", "duration": 1.2 }`

### `POST /api/altcha`

Altcha proof-of-work v1 (SHA-1/256/384/512). Чистые вычисления, завершается всегда, пока challenge валиден. Отправьте `challengeurl` либо объект `challenge`.

```json
{ "challengeurl": "https://example.com/altcha-challenge", "timeout": 60 }
```

```json
{ "challenge": { "algorithm": "SHA-256", "challenge": "abc...", "salt": "def...&", "signature": "...", "maxnumber": 1000000 } }
```

Ответ: `{ "success": true, "payload": "eyJ...", "number": 12345, "algorithm": "SHA-256", "duration": 0.4 }`. Base64-`payload` отправляется как поле `altcha`.

### `POST /api/friendly`

FriendlyCaptcha v1 PoW официальным солвером (`friendly-pow` WASM, тот же алгоритм, что у виджета).

```json
{ "sitekey": "FCM...", "timeout": 180 }
```

Для кастомных эндпоинтов добавьте `puzzleEndpoint` (по умолчанию `https://api.friendlycaptcha.com/api/v1/puzzle`). Ответ: `{ "success": true, "solution": "sig.b64.sol.diag", "puzzles": 48, "field": "frc-captcha-solution", "duration": 50.8 }`. Поместите `solution` в поле `frc-captcha-solution`.

### `POST /api/hcaptcha`

hCaptcha checkbox/invisible через браузер. Best-effort: проходит, только если не muncul image challenge.

```json
{ "sitekey": "10000000-ffff-ffff-ffff-000000000001", "siteurl": "https://example.com", "timeout": 60 }
```

### `POST /api/aliyun`

Aliyun Captcha 2.0 в стиле CapMonster: виджет рендерится на минимальной собственной странице из `sceneId` и `prefix` целевого сайта, без посещения самого сайта.

```json
{ "sceneId": "XXXX", "prefix": "xxxxxx", "region": "sgp", "timeout": 120 }
```

Где взять параметры: `prefix` - поддомен `https://<prefix>.captcha-open.*.aliyuncs.com` на вкладке Network; `sceneId` - из payload запроса в момент появления капчи; `region` - `sgp` или `cn` (при ошибке init solver сам пробует другой регион). Опционально: `language`, `mode`, `sdkUrl`, `debug`. Ошибка init (`INIT_FAIL`) означает неверные параметры или неактивную сцену - solver отвечает честно, не дожидаясь таймаута. В ответе `verifyParam`: одноразовый токен, привязанный к сессии, верифицировать нужно с того же IP. Icon-click не поддерживается.

### `POST /api/aliyun-extract`

Автодетект `region`, `prefix` и `sceneId` по URL целевой страницы. Best-effort: капча обычно подгружается только после действия вроде клика Login, используйте URL, который реально её вызывает.

```json
{ "url": "https://example.com/login", "timeout": 30 }
```

### `POST /api/kasada`

Захват Kasada proof-of-work заголовков и cookies (`x-kpsdk-ct` / `x-kpsdk-cd`) с целевого URL. Вклад [@hazeloffc](https://github.com/hazeloffc) (PR #1), hardened: работает на `BrowserService`, с rate limit, валидацией URL и глобальной очередью браузера.

```json
{ "url": "https://example.com", "timeout": 30, "waitTime": 15 }
```

Ответ:

```json
{
  "success": true,
  "headers": { "x-kpsdk-ct": "...", "x-kpsdk-cd": "...", "user-agent": "..." },
  "cookies": [],
  "duration": 16.2
}
```

Если цель не использует Kasada, API отвечает честным `success: false` с указанием причины.

### `POST /api/cloudflare`

Обход Cloudflare challenge, возвращает `cf_clearance`.

```json
{ "url": "https://example.com", "headless": true, "timeout": 30 }
```

Ответ: `{ "success": true, "cf_clearance": "...", "cookie_string": "...", "cookies": [], "user_agent": "..." }`

### `POST /api/waf-session`

Cookies и заголовки WAF-сессии с URL для последующих запросов.

```json
{ "url": "https://example.com", "timeout": 60 }
```

Ответ: `{ "success": true, "cookies": [], "headers": {}, "duration": 8.1 }`

### `POST /api/source`

Отрендеренный браузером HTML, включая страницы под базовой защитой.

```json
{ "url": "https://example.com", "timeout": 60 }
```

Ответ: `{ "success": true, "html": "<!DOCTYPE html>...", "duration": 8.1 }`

### `POST /api/get-sitekey`

Детект sitekey капчи на целевом URL с классификацией. Загружает страницу браузером и сканирует DOM-атрибуты, инлайн-скрипты, JS-глобалы, iframe и сетевой трафик.

```json
{ "url": "https://example.com/login", "timeout": 30 }
```

Каждая запись содержит рекомендуемые `solver` и `solver_param`, так что результат можно сразу передать нужному солверу. Типы: `turnstile` (префикс `0x`), `recaptcha` (префикс `6L`), `hcaptcha` (UUID), `friendly` (префикс `FCM`/`FCS`), `altcha` (длинный base64-кандидат). При детекте Aliyun прикладывается `aliyun_hint` на `/api/aliyun-extract`.

## Автодетект sitekey

| `type` | Метка | Паттерн | Солвер |
|---|---|---|---|
| `turnstile` | Cloudflare Turnstile | префикс `0x` | `/api/turnstile` |
| `recaptcha` | Google reCAPTCHA v2 / v3 / enterprise | префикс `6L` | `/api/captchav3` |
| `hcaptcha` | hCaptcha | UUID | `/api/hcaptcha` |
| `friendly` | FriendlyCaptcha | префикс `FCM` / `FCS` | `/api/friendly` |
| `altcha` | Altcha (кандидат) | длинный base64 без статического sitekey | `/api/altcha` с `challengeurl` |

## Тестовые ключи

| Солвер | Sitekey | Ожидаемый результат |
|---|---|---|
| Turnstile | `1x00000000000000000000AA` | `XXXX.DUMMY.TOKEN.XXXX` |
| reCAPTCHA v3 | `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI` | валидный токен |
| FriendlyCaptcha | `FCMGEMUD2M567T8G` | валидное решение |

## Структура проекта

```text
CaptchaX/
├── .github/workflows/e2e.yml     # E2E (свой URL указывается при запуске)
├── assets/                       # баннер и арты
├── src/
│   ├── index.js                  # Express-приложение
│   ├── routes/solve.js           # все роуты солверов
│   ├── routes/health.js          # /health
│   └── services/                 # солверы (browser.js, browserLock.js, kasada.js и др.)
├── Dockerfile
├── railway.json
├── .env.example
└── package.json
```

## Лимиты и ресурсы

- Лимит по умолчанию: **5 запросов в минуту с IP** (`MAX_REQUESTS_PER_MINUTE`).
- Глобальная очередь браузера: **только 1 задача за раз**. Остальные ждут до `BROWSER_SLOT_WAIT_MS` (по умолчанию 45 с), затем получают `Browser busy`.
- Браузерным эндпоинтам нужен Chromium, минимум **1 ГБ RAM**. Небраузерные (`captchav3`, `altcha`, `friendly`) лёгкие.
- Xvfb управляется внутри `puppeteer-real-browser`.
- Все ошибки возвращаются в виде машиночитаемых HTTP-статусов и JSON.

## FAQ

**Все ли солверы гарантированы?** Нет. PoW и токены детерминированы, а `hcaptcha`, `aliyun` и `kasada` зависят от риск-профиля и типа challenge. Неудачи всегда явные.

**Правильный sitekey, а `hcaptcha` падает?** Скорее всего muncul image challenge. Солвер умеет только checkbox/invisible и завершается быстро.

**Сколько живут токены?** Недолго, привязаны к домену и сессии. Отправляйте сразу.

**Можно ли с другого IP?** Не рекомендуется. Aliyun требует верификации с того же IP (привязка к сессии).

**Почему OOM на Railway?** Chromium требует много памяти. Поднимите тариф и не вызывайте браузерные эндпоинты массово параллельно: очередь теперь отвечает `Browser busy` вместо запуска множества процессов Chrome.

**Icon-click Aliyun?** Не поддерживается, ответ `success: false`.

**Есть ли API-авторизация?** Встроенного ключа пока нет. Перед публикацией закройте инстанс прокси, allowlist или своим reverse proxy.

## Roadmap

- [x] Turnstile, reCAPTCHA v3, Altcha, FriendlyCaptcha, hCaptcha, Aliyun, Kasada, Cloudflare, WAF-сессия, source, детектор sitekey
- [x] Глобальная очередь браузера (1 Chrome) против OOM
- [x] Dockerfile, `railway.json`, E2E workflow
- [ ] API-ключи и квоты на пользователя
- [ ] Webhook / колбэк доставки результатов
- [ ] Солвер image challenge для hCaptcha
- [ ] Юнит-тесты PoW-солверов без браузера

## Участие

Приветствуются вклад, issue и PR:

1. Fork и ветка: `git checkout -b feat/my-feature`.
2. `npm install`, протестируйте изменённые эндпоинты локально.
3. Не коммитьте credentials, cookies и внутренние URL.
4. Откройте PR: проблема, подход, как проверить.

В багрепорт включайте эндпоинт, обезличенный payload, ответ `error`, версию Node и платформу.

## Контрибьюторы

| [![ryuhandev](https://github.com/ryuhandev.png?size=100)](https://github.com/ryuhandev) | [![hazeloffc](https://github.com/hazeloffc.png?size=100)](https://github.com/hazeloffc) |
|---|---|
| **[@ryuhandev](https://github.com/ryuhandev)** - владелец и мейнтейнер | **[@hazeloffc](https://github.com/hazeloffc)** - Kasada-солвер (PR #1) |

## Лицензия и дисклеймер

Распространяется под **Apache License 2.0**. См. [LICENSE](https://github.com/ryuhandev/CaptchaX/blob/main/LICENSE).

Проект предназначен для исследований безопасности, автотестов собственных систем и легитимных интеграций. Обход капч на чужих сервисах без разрешения может нарушать закон и ToS провайдеров. Ответственность за использование - на вас.

Мейнтейнер: [@ryuhandev](https://github.com/ryuhandev).
