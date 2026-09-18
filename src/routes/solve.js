const express = require('express');
const router = express.Router();
const { BypassService } = require('../services/turnstile');
const { BrowserService } = require('../services/browser');
const { solveRecaptchaV3 } = require('../services/captchaV3');
const { solveAltcha } = require('../services/altcha');
const { solveFriendly } = require('../services/friendly');
const { solveHCaptcha } = require('../services/hcaptcha');
const { solveAliyun } = require('../services/aliyun');
const { extractAliyunParams } = require('../services/extractAliyun');
const { solveCloudflare } = require('../services/cloudflare');
const { getSitekey } = require('../services/getSitekey');
const { KasadaSolver } = require('../services/kasada.js');
const { solveKasada } = require('../services/kasada.js');
const { acquireSlot, releaseSlot } = require('../services/browserLock');

const requestCounts = new Map();
const MAX_REQUESTS = parseInt(process.env.MAX_REQUESTS_PER_MINUTE) || 5;
const BROWSER_SLOT_WAIT_MS = parseInt(process.env.BROWSER_SLOT_WAIT_MS, 10) || 45000;

// Route yang memakai browser (1 Chrome per solve) wajib antre slot global.
// Tanpa ini, request paralel = banyak Chrome = OOM di Railway.
const BROWSER_ROUTES = new Set([
  '/turnstile', '/turnstile-max', '/hcaptcha', '/aliyun',
  '/waf-session', '/source', '/cloudflare', '/get-sitekey', '/aliyun-extract',
  '/kasada',
]);

router.use(async (req, res, next) => {
  if (req.method !== 'POST' || !BROWSER_ROUTES.has(req.path)) return next();
  let got = false;
  try {
    got = await acquireSlot(BROWSER_SLOT_WAIT_MS);
  } catch (e) {
    got = false;
  }
  if (!got) {
    return res.status(429).json({ success: false, error: 'Browser busy, try again in ~30s' });
  }
  let released = false;
  const done = () => {
    if (released) return;
    released = true;
    releaseSlot();
  };
  res.on('finish', done);
  res.on('close', done);
  next();
});

function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - 60000;
  if (!requestCounts.has(ip)) requestCounts.set(ip, []);
  const requests = requestCounts.get(ip).filter(t => t > windowStart);
  requestCounts.set(ip, requests);
  if (requests.length >= MAX_REQUESTS) return false;
  requests.push(now);
  return true;
}

router.post('/turnstile', async (req, res) => {
  const startTime = Date.now();
  let browserService = null;
  
  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ success: false, error: 'Rate limit exceeded' });
    }

    const { sitekey, siteurl, timeout, action } = req.body;
    
    if (!sitekey) {
      return res.status(400).json({ success: false, error: 'sitekey is required' });
    }
    if (!siteurl) {
      return res.status(400).json({ success: false, error: 'siteurl is required' });
    }
    
    try {
      new URL(siteurl);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid siteurl' });
    }

    const solveTimeout = Math.min(Math.max(timeout || 45, 10), 120);
    
    browserService = new BrowserService();
    const bypassService = new BypassService(browserService);
    await browserService.initialize();
    
    const result = await bypassService.solveTurnstileMin(siteurl, sitekey, null, solveTimeout * 1000, { action });
    
    if (result.success) {
      res.json({ 
        success: true, 
        token: result.data, 
        duration: parseFloat(((Date.now() - startTime) / 1000).toFixed(2))
      });
    } else {
      res.json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('[turnstile] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (browserService) {
      await browserService.shutdown();
    }
  }
});

router.post('/kasada', async (req, res) => {
  const startTime = Date.now();
  let browserService = null;

  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ success: false, error: 'Rate limit exceeded' });
    }

    const { url, timeout, waitTime } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'url is required' });
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid url' });
    }

    browserService = new BrowserService();
    await browserService.initialize();

    const result = await solveKasada({
      url,
      timeout: timeout || 30,
      waitTime: waitTime || 15,
      browserService,
    });

    if (result.success) {
      res.json({
        success: true,
        headers: result.data.headers,
        cookies: result.data.cookies,
        duration: parseFloat((result.duration / 1000).toFixed(2)),
      });
    } else {
      res.json({
        success: false,
        error: result.error,
        duration: parseFloat((result.duration / 1000).toFixed(2)),
      });
    }
  } catch (error) {
    console.error('[kasada] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (browserService) {
      await browserService.shutdown();
    }
  }
});

router.post('/captchav3', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ success: false, error: 'Rate limit exceeded' });
    }

    const { sitekey, siteurl, timeout } = req.body;
    
    if (!sitekey) {
      return res.status(400).json({ success: false, error: 'sitekey is required' });
    }
    if (!siteurl) {
      return res.status(400).json({ success: false, error: 'siteurl is required' });
    }
    
    try {
      new URL(siteurl);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid siteurl' });
    }

    const solveTimeout = Math.min(Math.max(timeout || 30, 10), 60);
    
    const token = await solveRecaptchaV3({
      sitekey: sitekey,
      url: siteurl
    });

    if (token) {
      res.json({
        success: true,
        token: token,
        duration: parseFloat(((Date.now() - startTime) / 1000).toFixed(2))
      });
    } else {
      res.json({ success: false, error: 'Failed to get token' });
    }
    
  } catch (error) {
    console.error('[recaptcha] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/cloudflare', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ success: false, error: 'Rate limit exceeded' });
    }

    const { url, headless, proxy, proxyFile, timeout } = req.body;
    
    if (!url) {
      return res.status(400).json({ success: false, error: 'url is required' });
    }
    
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid url' });
    }

    const result = await solveCloudflare({
      url: url,
      headless: headless !== undefined ? headless : true,
      proxy: proxy || null,
      proxyFile: proxyFile || null,
      timeout: timeout || 30
    });

    if (result.success) {
      res.json({
        success: true,
        cf_clearance: result.cf_clearance,
        cookie_string: result.cookie_string,
        cookies: result.all_cookies,
        user_agent: result.user_agent,
        final_url: result.url,
        domain: result.domain,
        timestamp: result.timestamp,
        duration: parseFloat(((Date.now() - startTime) / 1000).toFixed(2))
      });
    } else {
      res.json({ success: false, error: result.error });
    }
    
  } catch (error) {
    console.error('[cloudflare] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/turnstile-max', async (req, res) => {
  const startTime = Date.now();
  let browserService = null;

  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ success: false, error: 'Rate limit exceeded' });
    }

    const { url, timeout, proxy } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'url is required' });
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid url' });
    }

    const solveTimeout = Math.min(Math.max(timeout || 60, 10), 120);

    browserService = new BrowserService();
    const bypassService = new BypassService(browserService);
    await browserService.initialize();

    const result = await bypassService.solveTurnstileMax(url, proxy || null, solveTimeout * 1000);

    if (result.success) {
      res.json({
        success: true,
        token: result.data,
        duration: parseFloat(((Date.now() - startTime) / 1000).toFixed(2))
      });
    } else {
      res.json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('[turnstile-max] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (browserService) {
      await browserService.shutdown();
    }
  }
});

router.post('/altcha', async (req, res) => {
  const startTime = Date.now();

  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ success: false, error: 'Rate limit exceeded' });
    }

    const { challengeurl, challenge, max, start, timeout } = req.body;

    if (!challengeurl && !challenge) {
      return res.status(400).json({ success: false, error: 'challengeurl or challenge is required' });
    }
    if (challengeurl) {
      try {
        new URL(challengeurl);
      } catch {
        return res.status(400).json({ success: false, error: 'Invalid challengeurl' });
      }
    }

    const result = await solveAltcha({ challengeurl, challenge, max, start, timeout });

    res.json({
      success: true,
      payload: result.data.payload,
      number: result.data.number,
      algorithm: result.data.algorithm,
      duration: parseFloat(((Date.now() - startTime) / 1000).toFixed(2))
    });
  } catch (error) {
    console.error('[altcha] Error:', error.message);
    res.json({ success: false, error: error.message });
  }
});

router.post('/friendly', async (req, res) => {
  const startTime = Date.now();

  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ success: false, error: 'Rate limit exceeded' });
    }

    const { sitekey, puzzleEndpoint, timeout } = req.body;

    if (!sitekey) {
      return res.status(400).json({ success: false, error: 'sitekey is required' });
    }
    if (puzzleEndpoint) {
      try {
        new URL(puzzleEndpoint);
      } catch {
        return res.status(400).json({ success: false, error: 'Invalid puzzleEndpoint' });
      }
    }

    const result = await solveFriendly({ sitekey, puzzleEndpoint, timeout });

    res.json({
      success: true,
      solution: result.data.solution,
      puzzles: result.data.puzzles,
      field: result.data.field,
      duration: parseFloat(((Date.now() - startTime) / 1000).toFixed(2))
    });
  } catch (error) {
    console.error('[friendly] Error:', error.message);
    res.json({ success: false, error: error.message });
  }
});

router.post('/waf-session', async (req, res) => {
  const startTime = Date.now();
  let browserService = null;

  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ success: false, error: 'Rate limit exceeded' });
    }

    const { url, timeout, proxy } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'url is required' });
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid url' });
    }

    const solveTimeout = Math.min(Math.max(timeout || 60, 10), 120);

    browserService = new BrowserService();
    const bypassService = new BypassService(browserService);
    await browserService.initialize();

    const result = await bypassService.wafSession(url, proxy || null, solveTimeout * 1000);

    if (result.success) {
      res.json({
        success: true,
        cookies: result.data.cookies,
        headers: result.data.headers,
        duration: parseFloat(((Date.now() - startTime) / 1000).toFixed(2))
      });
    } else {
      res.json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('[waf-session] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (browserService) {
      await browserService.shutdown();
    }
  }
});

router.post('/source', async (req, res) => {
  const startTime = Date.now();
  let browserService = null;

  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ success: false, error: 'Rate limit exceeded' });
    }

    const { url, timeout, proxy } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'url is required' });
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid url' });
    }

    const solveTimeout = Math.min(Math.max(timeout || 60, 10), 120);

    browserService = new BrowserService();
    const bypassService = new BypassService(browserService);
    await browserService.initialize();

    const result = await bypassService.getSource(url, proxy || null, solveTimeout * 1000);

    if (result.success) {
      res.json({
        success: true,
        html: result.data,
        duration: parseFloat(((Date.now() - startTime) / 1000).toFixed(2))
      });
    } else {
      res.json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('[source] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (browserService) {
      await browserService.shutdown();
    }
  }
});

router.post('/hcaptcha', async (req, res) => {
  const startTime = Date.now();
  let browserService = null;

  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ success: false, error: 'Rate limit exceeded' });
    }

    const { sitekey, siteurl, timeout, rqdata, size, invisible, hl, theme, host, endpoint, assethost, imghost, reportapi, debug } = req.body;

    if (!sitekey) {
      return res.status(400).json({ success: false, error: 'sitekey is required' });
    }
    if (!siteurl) {
      return res.status(400).json({ success: false, error: 'siteurl is required' });
    }

    try {
      new URL(siteurl);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid siteurl' });
    }

    const solveTimeout = Math.min(Math.max(timeout || 60, 10), 180);

    browserService = new BrowserService();
    await browserService.initialize();

    const result = await solveHCaptcha({
      sitekey,
      url: siteurl,
      timeout: solveTimeout * 1000,
      browserService,
      rqdata,
      size,
      invisible,
      hl,
      theme,
      host,
      endpoint,
      assethost,
      imghost,
      reportapi,
      debug: debug === true
    });

    res.json({
      success: true,
      token: result.data,
      duration: parseFloat(((Date.now() - startTime) / 1000).toFixed(2)),
      ...(debug === true && result.debug ? { debug: result.debug } : {})
    });
  } catch (error) {
    console.error('[hcaptcha] Error:', error.message);
    res.json({
      success: false,
      error: error.message,
      ...(req.body && req.body.debug === true && error.debug ? { debug: error.debug } : {})
    });
  } finally {
    if (browserService) {
      await browserService.shutdown();
    }
  }
});

router.post('/aliyun', async (req, res) => {
  const startTime = Date.now();
  let browserService = null;

  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ success: false, error: 'Rate limit exceeded' });
    }

    const { sceneId, prefix, region, language, mode, sdkUrl, timeout, debug } = req.body;

    if (!sceneId) {
      return res.status(400).json({ success: false, error: 'sceneId is required' });
    }
    if (!prefix) {
      return res.status(400).json({ success: false, error: 'prefix is required' });
    }

    const solveTimeout = Math.min(Math.max(timeout || 120, 20), 300);

    browserService = new BrowserService();
    await browserService.initialize();

    const result = await solveAliyun({
      sceneId,
      prefix,
      region: region || 'sgp',
      language: language || 'en',
      mode: mode || 'popup',
      sdkUrl,
      timeout: solveTimeout,
      debug: debug === true,
      browserService
    });

    res.json({
      success: true,
      verifyParam: result.data,
      duration: parseFloat(((Date.now() - startTime) / 1000).toFixed(2)),
      ...(debug === true && result.debug ? { debug: result.debug } : {})
    });
  } catch (error) {
    console.error('[aliyun] Error:', error.message);
    res.json({
      success: false,
      error: error.message,
      ...(req.body && req.body.debug === true && error.debug ? { debug: error.debug } : {})
    });
  } finally {
    if (browserService) {
      await browserService.shutdown();
    }
  }
});

router.post('/get-sitekey', async (req, res) => {
  const startTime = Date.now();
  let browserService = null;

  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ success: false, error: 'Rate limit exceeded' });
    }

    const { url, timeout } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'url is required' });
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid url' });
    }

    const solveTimeout = Math.min(Math.max(timeout || 30, 10), 90);

    browserService = new BrowserService();
    await browserService.initialize();

    const result = await getSitekey({
      url,
      timeout: solveTimeout * 1000,
      browserService,
    });

    res.json({
      success: true,
      ...result.data,
      duration: parseFloat(((Date.now() - startTime) / 1000).toFixed(2)),
    });
  } catch (error) {
    console.error('[get-sitekey] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (browserService) {
      await browserService.shutdown();
    }
  }
});

router.post('/aliyun-extract', async (req, res) => {
  const startTime = Date.now();
  let browserService = null;

  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ success: false, error: 'Rate limit exceeded' });
    }

    const { url, timeout } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'url is required' });
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid url' });
    }

    const solveTimeout = Math.min(Math.max(timeout || 30, 10), 90) * 1000;

    browserService = new BrowserService();
    await browserService.initialize();

    const result = await extractAliyunParams({
      url,
      timeout: solveTimeout,
      browserService
    });

    res.json({
      success: true,
      ...result.data,
      duration: parseFloat(((Date.now() - startTime) / 1000).toFixed(2))
    });
  } catch (error) {
    console.error('[aliyun-extract] Error:', error.message);
    res.json({ success: false, error: error.message });
  } finally {
    if (browserService) {
      await browserService.shutdown();
    }
  }
});

module.exports = router;
