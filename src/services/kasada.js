/*
Note: Ini works namun tidak semua web menggunakan nya. Jika solver ini secara tiba tiba tidak works anda dapat membaca
info di https://scrapfly.io/blog/posts/how-to-bypass-kasada-anti-scraping-waf untuk betulin nya
Developer: hazel (t.me/hazeloffc)
*/
const KasadaSolver = class {
  constructor(options = {}) {
    this.headless = options.headless !== undefined ? options.headless : true;
    this.waitTime = options.waitTime || 15000;
    this.timeout = options.timeout || 30000;
    this.browser = null;
    this.isReady = false;
  }

  async initialize() {
    if (this.isReady) return;

    const { launch } = await import('cloakbrowser/puppeteer');

    this.browser = await launch({
      headless: this.headless,
      humanize: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu'
      ]
    });

    this.isReady = true;
  }

  async cleanup() {
    if (this.browser) {
      try { await this.browser.close(); } catch {}
      this.browser = null;
      this.isReady = false;
    }
  }

  async solve(url) {
    if (!this.isReady) await this.initialize();

    const startTime = Date.now();
    const page = await this.browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
    });

    let kasadaHeaders = {};

    page.on('request', interceptedRequest => {
      const headers = interceptedRequest.headers();
      if (headers['x-kpsdk-ct'] || headers['x-kpsdk-cd']) {
        kasadaHeaders = {
          'x-kpsdk-ct': headers['x-kpsdk-ct'],
          'x-kpsdk-cd': headers['x-kpsdk-cd'],
          'user-agent': headers['user-agent']
        };
      }
    });

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: this.timeout });
      await new Promise(r => setTimeout(r, this.waitTime));

      const cookies = await page.cookies();
      await page.close();

      if (Object.keys(kasadaHeaders).length > 0) {
        return {
          success: true,
          headers: kasadaHeaders,
          cookies: cookies,
          duration: parseFloat(((Date.now() - startTime) / 1000).toFixed(2))
        };
      } else {
        return {
          success: false,
          error: 'Kasada headers tidak ditemukan',
          duration: parseFloat(((Date.now() - startTime) / 1000).toFixed(2))
        };
      }

    } catch (error) {
      try { await page.close(); } catch {}
      return {
        success: false,
        error: error.message,
        duration: parseFloat(((Date.now() - startTime) / 1000).toFixed(2))
      };
    }
  }
};

module.exports = { KasadaSolver };
