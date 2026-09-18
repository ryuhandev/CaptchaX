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
  <a href="README.md">Indonesia</a> · <a href="README.en.md">English</a> · <a href="README.ja.md">日本語</a> · <a href="README.zh.md">中文</a> · <a href="README.ru.md">Русский</a> · हिन्दी
</p>

---

## परिचय

CaptchaX एक ही सेवा में कई तरह के कैप्चा और एंटी-बॉट सुरक्षा को हल/बायपास करने वाला REST API है: **Cloudflare Turnstile**, **Cloudflare challenge / WAF**, **Kasada PoW**, **reCAPTCHA v3**, **hCaptcha**, **Aliyun Captcha 2.0**, **FriendlyCaptcha**, **Altcha (proof-of-work)**, साथ में **रेंडर किया हुआ पेज सोर्स** और **ऑटोमैटिक sitekey डिटेक्टर**।

सब कुछ एक Express प्रोसेस में चलता है। Headful ब्राउज़र (Puppeteer via `puppeteer-real-browser`) सिर्फ उन्हीं एंडपॉइंट में इस्तेमाल होता है जिन्हें सच में ज़रूरत है, और Railway या Docker पर सीधे डिप्लॉय हो जाता है।

## समर्थित कैप्चा

| कैप्चा / सुरक्षा | एंडपॉइंट | तरीका | आधार |
|---|---|---|---|
| Cloudflare Turnstile (अकेला) | `POST /api/turnstile` | खुद का फेक पेज रेंडर + वैकल्पिक `action` | ब्राउज़र |
| Cloudflare Turnstile (एम्बेडेड) | `POST /api/turnstile-max` | टारगेट URL खोलता है, ज़रूरत पर विजेट क्लिक करता है | ब्राउज़र |
| Cloudflare challenge / WAF | `POST /api/cloudflare` | `cf_clearance` के लिए चैलेंज क्लिकर | ब्राउज़र |
| Kasada PoW | `POST /api/kasada` | `x-kpsdk-ct` / `x-kpsdk-cd` हेडर + कुकीज़ लेता है | ब्राउज़र |
| WAF सेशन | `POST /api/waf-session` | सेशन कुकीज़ + हेडर लेता है | ब्राउज़र |
| reCAPTCHA v3 | `POST /api/captchav3` | anchor/reload (बिना ब्राउज़र) | HTTP |
| hCaptcha | `POST /api/hcaptcha` | चेकबॉक्स/invisible | ब्राउज़र |
| Aliyun Captcha 2.0 | `POST /api/aliyun` | `sceneId` + `prefix` से खुद के पेज पर विजेट | ब्राउज़र |
| Aliyun Captcha 2.0 (ऑटो-डिटेक्ट) | `POST /api/aliyun-extract` | URL से `region` + `prefix` + `sceneId` पहचानता है | ब्राउज़र |
| FriendlyCaptcha v1 | `POST /api/friendly` | आधिकारिक `friendly-pow` WASM सॉल्वर | HTTP + WASM |
| Altcha PoW v1 | `POST /api/altcha` | SHA-1/256/384/512 ब्रूट-फोर्स | कंप्यूटेशन |
| रेंडर किया सोर्स | `POST /api/source` | ब्राउज़र-रेंडर किया HTML | ब्राउज़र |
| Sitekey डिटेक्टर | `POST /api/get-sitekey` | sitekey वर्गीकरण + सॉल्वर सुझाव | ब्राउज़र |
| हेल्थ चेक | `GET /api/health` | RAM/CPU/डिस्क स्थिति | प्रोसेस |

## विश्वसनीयता

| समूह | एंडपॉइंट | विश्वसनीयता | नोट |
|---|---|---|---|
| डिटर्मिनिस्टिक PoW / टोकन | `turnstile`, `turnstile-max`, `captchav3`, `altcha`, `friendly` | उच्च | कोई इमेज चैलेंज नहीं। असफलता का कारण नेटवर्क, टाइमआउट या गलत sitekey |
| ब्राउज़र सेशन | `cloudflare`, `waf-session`, `source` | टारगेट पेज सामान्य हो तो उच्च | ब्राउज़र और पर्याप्त RAM चाहिए |
| बेस्ट-एफर्ट | `hcaptcha`, `aliyun`, `aliyun-extract`, `kasada` | कम रिस्क या सही टाइप पर पास | न हो पाए तो हमेशा कारण सहित `success: false`। Aliyun icon-click समर्थित नहीं |

## क्विक स्टार्ट

```bash
git clone https://github.com/ryuhandev/CaptchaX.git
cd CaptchaX
npm install
cp .env.example .env
npm start
```

डिफ़ॉल्ट `http://localhost:5000` पर चलता है (`PORT` से बदलें)। `curl http://localhost:5000/` और `curl http://localhost:5000/api/health` से जांचें।

Docker:

```bash
docker build -t captchax .
docker run --rm -p 8080:8080 --env-file .env captchax
```

एनवायरनमेंट वेरिएबल: `PORT` (डिफ़ॉल्ट `5000`, Railway पर Public Networking टारगेट पोर्ट से मिलाएं), `NODE_ENV` (डिफ़ॉल्ट `production`), `MAX_REQUESTS_PER_MINUTE` (डिफ़ॉल्ट `5`), `BROWSER_SLOT_WAIT_MS` (डिफ़ॉल्ट `45000`), `PUPPETEER_EXECUTABLE_PATH` (Docker में `/usr/bin/chromium`)।

Railway: इस रेपो से प्रोजेक्ट बनाएं, टारगेट पोर्ट `PORT` के बराबर रखें और वेरिएबल जोड़ें। `main` पर पुश से ऑटो-रिडिप्लॉय होता है।

## API रेफरेंस

लोकल बेस URL: `http://localhost:5000`। हर एंडपॉइंट boolean `success` वाला JSON देता है; असफलता पर `error` में कारण होता है।

### `GET /`

सर्विस जानकारी, एंडपॉइंट सूची और सैंपल पेलोड।

### `GET /api/health`

RAM, CPU और डिस्क आंकड़े।

### `POST /api/turnstile`

खुद के फेक पेज से Turnstile हल करता है। `action` वैकल्पिक है और `turnstile.render` को जाता है।

```json
{ "sitekey": "0x4AAAAAA...", "siteurl": "https://example.com", "timeout": 45, "action": "login" }
```

रिस्पॉन्स: `{ "success": true, "token": "XXXX...", "duration": 12.3 }`

### `POST /api/turnstile-max`

असली पेज में एम्बेडेड Turnstile हल करता है। टारगेट URL खोलता है और ज़रूरत पर विजेट क्लिक करता है।

```json
{ "url": "https://example.com/page-with-turnstile", "timeout": 60 }
```

### `POST /api/captchav3`

बिना ब्राउज़र वाला reCAPTCHA v3 (anchor/reload तरीका)।

```json
{ "sitekey": "6Le-...", "siteurl": "https://example.com", "timeout": 30 }
```

रिस्पॉन्स: `{ "success": true, "token": "...", "duration": 1.2 }`

### `POST /api/altcha`

Altcha proof-of-work v1 (SHA-1/256/384/512) हल करता है। शुद्ध कंप्यूटेशन, चैलेंज सही हो तो हमेशा पूरा होता है। `challengeurl` या `challenge` ऑब्जेक्ट में से एक भेजें।

```json
{ "challengeurl": "https://example.com/altcha-challenge", "timeout": 60 }
```

```json
{ "challenge": { "algorithm": "SHA-256", "challenge": "abc...", "salt": "def...&", "signature": "...", "maxnumber": 1000000 } }
```

रिस्पॉन्स: `{ "success": true, "payload": "eyJ...", "number": 12345, "algorithm": "SHA-256", "duration": 0.4 }`। base64 `payload` को `altcha` फील्ड में भेजें।

### `POST /api/friendly`

आधिकारिक सॉल्वर (`friendly-pow` WASM, ब्राउज़र विजेट वाला ही एल्गोरिदम) से FriendlyCaptcha v1 PoW हल करता है।

```json
{ "sitekey": "FCM...", "timeout": 180 }
```

कस्टम एंडपॉइंट वाली साइट के लिए `puzzleEndpoint` जोड़ें (डिफ़ॉल्ट: `https://api.friendlycaptcha.com/api/v1/puzzle`)। रिस्पॉन्स: `{ "success": true, "solution": "sig.b64.sol.diag", "puzzles": 48, "field": "frc-captcha-solution", "duration": 50.8 }`। `solution` को `frc-captcha-solution` में डालें।

### `POST /api/hcaptcha`

ब्राउज़र से hCaptcha चेकबॉक्स/invisible। बेस्ट-एफर्ट, सिर्फ तब पास जब इमेज चैलेंज न आए।

```json
{ "sitekey": "10000000-ffff-ffff-ffff-000000000001", "siteurl": "https://example.com", "timeout": 60 }
```

### `POST /api/aliyun`

CapMonster-स्टाइल Aliyun Captcha 2.0: टारगेट साइट के `sceneId` और `prefix` से खुद के छोटे पेज पर विजेट रेंडर करता है, टारगेट साइट खोले बिना।

```json
{ "sceneId": "XXXX", "prefix": "xxxxxx", "region": "sgp", "timeout": 120 }
```

पैरामीटर कैसे लें: `prefix` Network टैब में `https://<prefix>.captcha-open.*.aliyuncs.com` का सबडोमेन है; `sceneId` कैप्चा दिखने पर रिक्वेस्ट पेलोड से; `region` `sgp`/`cn` (init फेल हो तो दूसरा खुद try करता है)। वैकल्पिक: `language`, `mode`, `sdkUrl`, `debug`। init फेल (`INIT_FAIL`) का मतलब गलत पैरामीटर या निष्क्रिय scene, टाइमआउट का इंतज़ार किए बिना ईमानदार जवाब मिलता है। रिस्पॉन्स का `verifyParam` एक बार इस्तेमाल होने वाला सेशन-बाउंड टोकन है, उसी IP से वेरिफाई करें। icon-click टाइप समर्थित नहीं।

### `POST /api/aliyun-extract`

टारगेट पेज URL से `region`, `prefix`, `sceneId` ऑटो-डिटेक्ट करता है। बेस्ट-एफर्ट, क्योंकि कैप्चा आमतौर पर लॉगिन क्लिक जैसी कार्रवाई के बाद लोड होता है - वही URL दें जिससे कैप्चा ट्रिगर हो।

```json
{ "url": "https://example.com/login", "timeout": 30 }
```

### `POST /api/kasada`

टारगेट URL से Kasada proof-of-work हेडर और कुकीज़ (`x-kpsdk-ct` / `x-kpsdk-cd`) लेता है। [@hazeloffc](https://github.com/hazeloffc) का योगदान (PR #1), `BrowserService`, रेट-लिमिट, URL वैलिडेशन और ग्लोबल ब्राउज़र कतार के साथ मजबूत किया हुआ।

```json
{ "url": "https://example.com", "timeout": 30, "waitTime": 15 }
```

रिस्पॉन्स:

```json
{
  "success": true,
  "headers": { "x-kpsdk-ct": "...", "x-kpsdk-cd": "...", "user-agent": "..." },
  "cookies": [],
  "duration": 16.2
}
```

टारगेट Kasada इस्तेमाल न करे तो कारण सहित `success: false`।

### `POST /api/cloudflare`

Cloudflare चैलेंज बायपास करके `cf_clearance` देता है।

```json
{ "url": "https://example.com", "headless": true, "timeout": 30 }
```

रिस्पॉन्स: `{ "success": true, "cf_clearance": "...", "cookie_string": "...", "cookies": [], "user_agent": "..." }`

### `POST /api/waf-session`

आगे की रिक्वेस्ट के लिए किसी URL के WAF सेशन कुकीज़ और हेडर लेता है।

```json
{ "url": "https://example.com", "timeout": 60 }
```

रिस्पॉन्स: `{ "success": true, "cookies": [], "headers": {}, "duration": 8.1 }`

### `POST /api/source`

ब्राउज़र-रेंडर किया HTML देता है, बुनियादी सुरक्षा वाले पेज सहित।

```json
{ "url": "https://example.com", "timeout": 60 }
```

रिस्पॉन्स: `{ "success": true, "html": "<!DOCTYPE html>...", "duration": 8.1 }`

### `POST /api/get-sitekey`

टारगेट URL पर कैप्चा sitekey पहचानकर वर्गीकृत करता है। ब्राउज़र से पेज लोड करके DOM एट्रिब्यूट, इनलाइन स्क्रिप्ट, JS ग्लोबल, iframe और नेटवर्क ट्रैफिक स्कैन करता है।

```json
{ "url": "https://example.com/login", "timeout": 30 }
```

हर एंट्री में सुझाया `solver` और `solver_param` होता है, इसलिए पहचान सीधे सही सॉल्वर को दी जा सकती है। टाइप: `turnstile` (`0x` शुरुआत), `recaptcha` (`6L` शुरुआत), `hcaptcha` (UUID), `friendly` (`FCM`/`FCS` शुरुआत), `altcha` (लंबा base64)। Aliyun मिलने पर `/api/aliyun-extract` वाला `aliyun_hint` आता है।

## ऑटोमैटिक Sitekey पहचान

| `type` | लेबल | पैटर्न | सॉल्वर |
|---|---|---|---|
| `turnstile` | Cloudflare Turnstile | `0x` शुरुआत | `/api/turnstile` |
| `recaptcha` | Google reCAPTCHA v2 / v3 / enterprise | `6L` शुरुआत | `/api/captchav3` |
| `hcaptcha` | hCaptcha | UUID | `/api/hcaptcha` |
| `friendly` | FriendlyCaptcha | `FCM` / `FCS` शुरुआत | `/api/friendly` |
| `altcha` | Altcha (उम्मीदवार) | लंबा base64, कोई स्थिर sitekey नहीं | `challengeurl` वाला `/api/altcha` |

## टेस्ट कीज़

| सॉल्वर | Sitekey | अपेक्षित नतीजा |
|---|---|---|
| Turnstile | `1x00000000000000000000AA` | `XXXX.DUMMY.TOKEN.XXXX` |
| reCAPTCHA v3 | `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI` | सही टोकन |
| FriendlyCaptcha | `FCMGEMUD2M567T8G` | सही समाधान |

## प्रोजेक्ट संरचना

```text
CaptchaX/
├── .github/workflows/e2e.yml     # E2E (चलाते समय अपना URL दें)
├── assets/                       # बैनर और कैरेक्टर
├── src/
│   ├── index.js                  # Express ऐप
│   ├── routes/solve.js           # सभी सॉल्वर रूट
│   ├── routes/health.js          # /health
│   └── services/                 # सॉल्वर (browser.js, browserLock.js, kasada.js आदि)
├── Dockerfile
├── railway.json
├── .env.example
└── package.json
```

## रेट-लिमिट और संसाधन

- डिफ़ॉल्ट रेट-लिमिट: **प्रति IP प्रति मिनट 5 रिक्वेस्ट** (`MAX_REQUESTS_PER_MINUTE`)।
- ग्लोबल ब्राउज़र कतार: **एक समय में सिर्फ 1 ब्राउज़र टास्क**। आगे वाली `BROWSER_SLOT_WAIT_MS` (डिफ़ॉल्ट 45 सेकंड) तक रुकती हैं, फिर `Browser busy` मिलता है।
- ब्राउज़र एंडपॉइंट को Chromium के लिए कम से कम **1 GB RAM** चाहिए। गैर-ब्राउज़र (`captchav3`, `altcha`, `friendly`) हल्के हैं।
- Xvfb `puppeteer-real-browser` खुद संभालता है।
- हर एरर मशीन-पठनीय HTTP स्टेटस + JSON में।

## FAQ

**क्या सभी सॉल्वर की गारंटी है?** नहीं। PoW और टोकन डिटर्मिनिस्टिक हैं, पर `hcaptcha`, `aliyun`, `kasada` रिस्क प्रोफाइल और चैलेंज टाइप पर निर्भर हैं। असफलता हमेशा साफ बताई जाती है।

**सही sitekey पर `hcaptcha` क्यों फेल?** आमतौर पर इमेज चैलेंज आ गया। सॉल्वर सिर्फ चेकबॉक्स/invisible संभालता है और जल्दी रुक जाता है।

**टोकन कितनी देर वैध?** कम समय के लिए, डोमेन और सेशन से बंधे। मिलते ही टारगेट सर्वर को भेजें।

**दूसरे IP से इस्तेमाल?** सलाह नहीं। Aliyun उसी IP से वेरिफाई करना ज़रूरी है (सेशन-बाउंड)।

**Railway पर OOM क्यों?** Chromium मेमोरी खाता है। प्लान बढ़ाएं और ब्राउज़र एंडपॉइंट पैरेलल न मारें।

**Aliyun क्रम-चित्र क्लिक?** समर्थित नहीं, `success: false` मिलता है।

**API ऑथ?** बिल्ट-इन key अभी नहीं। पब्लिक करने से पहले खुद का प्रॉक्सी, IP allowlist या रिवर्स प्रॉक्सी लगाएं।

## रोडमैप

- [x] Turnstile, reCAPTCHA v3, Altcha, FriendlyCaptcha, hCaptcha, Aliyun, Kasada, Cloudflare, WAF सेशन, सोर्स, sitekey डिटेक्टर
- [x] OOM-रोधी ग्लोबल ब्राउज़र कतार (1 Chrome)
- [x] Dockerfile, `railway.json`, E2E वर्कफ़्लो
- [ ] API key और प्रति-यूज़र कोटा
- [ ] सॉल्व नतीजों की Webhook / कॉलबैक डिलीवरी
- [ ] hCaptcha इमेज चैलेंज सॉल्वर
- [ ] बिना-ब्राउज़र PoW सॉल्वर यूनिट टेस्ट

## योगदान

योगदान, issue और PR स्वागत है:

1. Fork करके ब्रांच बनाएं: `git checkout -b feat/my-feature`।
2. `npm install` करके बदले एंडपॉइंट लोकल टेस्ट करें।
3. क्रेडेंशियल, कुकीज़ या अंदरूनी URL कमिट न करें।
4. समस्या, तरीका और टेस्ट विधि लिखकर PR खोलें।

बग रिपोर्ट में एंडपॉइंट, बिना-संवेदनशील पेलोड, `error` रिस्पॉन्स, Node वर्शन और डिप्लॉय प्लेटफॉर्म दें।

## योगदानकर्ता

| [![ryuhandev](https://github.com/ryuhandev.png?size=100)](https://github.com/ryuhandev) | [![hazeloffc](https://github.com/hazeloffc.png?size=100)](https://github.com/hazeloffc) |
|---|---|
| **[@ryuhandev](https://github.com/ryuhandev)** - ओनर व मेंटेनर | **[@hazeloffc](https://github.com/hazeloffc)** - Kasada सॉल्वर (PR #1) |

## लाइसेंस और अस्वीकरण

**Apache License 2.0** के तहत, देखें [LICENSE](https://github.com/ryuhandev/CaptchaX/blob/main/LICENSE)।

यह प्रोजेक्ट सुरक्षा शोध, अपने सिस्टम के ऑटोमैटिक टेस्ट और वैध इंटीग्रेशन के लिए है। बिना अनुमति तीसरी-पार्टी सेवाओं के कैप्चा बायपास से स्थानीय कानून व सेवा शर्तें टूट सकती हैं। इस्तेमाल की ज़िम्मेदारी आपकी है।

मेंटेनर: [@ryuhandev](https://github.com/ryuhandev)।
