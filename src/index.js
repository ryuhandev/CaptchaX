require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const solveRoute = require('./routes/solve');
const healthRoute = require('./routes/health');

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000;
console.log(`[boot] PORT env=${process.env.PORT} -> listen ${PORT}`);

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api', solveRoute);
app.use('/api', healthRoute);

app.get('/', (req, res) => {
  res.json({
    name: 'Captcha Solver JS',
    version: '5.1.1',
    browser: require('./services/browserLock').browserSlotStatus(),
    endpoints: {
      'POST /api/turnstile': 'Solve Turnstile (min, fake page, optional action)',
      'POST /api/turnstile-max': 'Solve Turnstile on real page URL',
      'POST /api/captchav3': 'Solve reCAPTCHA v3 (no browser)',
      'POST /api/altcha': 'Solve Altcha PoW (challenge JSON or challengeurl)',
      'POST /api/friendly': 'Solve FriendlyCaptcha PoW (official solver)',
      'POST /api/hcaptcha': 'Solve hCaptcha checkbox (best-effort)',
      'POST /api/aliyun': 'Solve Aliyun Captcha 2.0 (sceneId+prefix, best-effort)',
      'POST /api/aliyun-extract': 'Extract Aliyun sceneId+prefix+region from target page URL',
      'POST /api/cloudflare': 'Bypass Cloudflare challenge (cf_clearance)',
      'POST /api/kasada': 'Capture Kasada PoW headers+cookies (x-kpsdk-ct/cd, best-effort)',
      'POST /api/waf-session': 'Get WAF session cookies + headers',
      'POST /api/source': 'Get rendered page HTML source',
      'POST /api/get-sitekey': 'Detect & classify captcha sitekeys from a target URL (turnstile/recaptcha/hcaptcha/friendly/altcha)',
      'GET /api/health': 'Health check'
    },
    usage: {
      turnstile: {
        method: 'POST',
        url: '/api/turnstile',
        body: {
          sitekey: '0x4AAAAAA...',
          siteurl: 'https://example.com',
          timeout: 45,
          action: 'login'
        }
      },
      turnstileMax: {
        method: 'POST',
        url: '/api/turnstile-max',
        body: {
          url: 'https://example.com/page-with-turnstile',
          timeout: 60
        }
      },
      altcha: {
        method: 'POST',
        url: '/api/altcha',
        body: {
          challengeurl: 'https://example.com/altcha-challenge',
          timeout: 60
        }
      },
      friendly: {
        method: 'POST',
        url: '/api/friendly',
        body: {
          sitekey: 'FCM...',
          timeout: 180
        }
      },
      hcaptcha: {
        method: 'POST',
        url: '/api/hcaptcha',
        body: {
          sitekey: '10000000-ffff-ffff-ffff-000000000001',
          siteurl: 'https://example.com',
          timeout: 60,
          rqdata: '(optional, enterprise)',
          invisible: false,
          debug: false
        }
      },
      aliyun: {
        method: 'POST',
        url: '/api/aliyun',
        body: {
          sceneId: 'XXXX',
          prefix: 'xxxxxx',
          region: 'sgp',
          language: 'en',
          mode: 'popup',
          timeout: 120,
          debug: false
        }
      },
      captchav3: {
        method: 'POST',
        url: '/api/captchav3',
        body: {
          sitekey: '6Le-wvk....',
          siteurl: 'https://example.com',
          timeout: 30
        }
      },
      cloudflare: {
        method: 'POST',
        url: '/api/cloudflare',
        body: {
          url: 'https://example.com',
          headless: true,
          timeout: 30
        }
      },
      getSitekey: {
        method: 'POST',
        url: '/api/get-sitekey',
        body: {
          url: 'https://example.com/login',
          timeout: 30
        }
      }
    }
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

process.on('uncaughtException', (e) => console.error('[fatal] uncaught:', e.message));
process.on('unhandledRejection', (e) => console.error('[fatal] unhandled:', e?.message || e));

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Captcha Solver JS running on port ${PORT}`);
});
server.on('error', (e) => { console.error('[fatal] listen:', e.message); process.exit(1); });

module.exports = app;