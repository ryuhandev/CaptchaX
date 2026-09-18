/*
Kasada (x-kpsdk-ct / x-kpsdk-cd) solver.
Kontribusi awal: hazel (t.me/hazeloffc) via PR #1 — rute + ide capture header.
Hardening: jalan di atas BrowserService (tanpa dep tambahan), rate-limit + antrean slot di route.
Note: tidak semua web memakai Kasada. Referensi:
https://scrapfly.io/blog/posts/how-to-bypass-kasada-anti-scraping-waf
*/
const DEFAULT_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function solveKasada({ url, timeout = 30, waitTime = 15, browserService } = {}) {
  const startTime = Date.now();
  if (!url) throw new Error("url is required");
  if (!browserService) throw new Error("Browser service not initialized");

  const navTimeout = Math.min(Math.max((timeout || 30) * 1000, 5000), 90000);
  const waitMs = Math.min(Math.max((waitTime || 15) * 1000, 1000), 60000);

  return browserService.withBrowserContext(async (context) => {
    const page = await context.newPage();
    await page.setUserAgent(DEFAULT_UA);
    await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });

    let kasadaHeaders = {};
    page.on("request", (req) => {
      try {
        const h = req.headers();
        if (h["x-kpsdk-ct"] || h["x-kpsdk-cd"]) {
          kasadaHeaders = {
            "x-kpsdk-ct": h["x-kpsdk-ct"] || null,
            "x-kpsdk-cd": h["x-kpsdk-cd"] || null,
            "user-agent": h["user-agent"] || DEFAULT_UA,
          };
        }
      } catch (e) {}
    });

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: navTimeout });

    const deadline = Date.now() + waitMs;
    while (Date.now() < deadline && Object.keys(kasadaHeaders).length === 0) {
      await sleep(1000);
    }

    const cookies = await page.cookies().catch(() => []);
    const duration = Date.now() - startTime;

    if (Object.keys(kasadaHeaders).length > 0) {
      return { success: true, data: { headers: kasadaHeaders, cookies }, duration };
    }
    return { success: false, error: "Kasada headers tidak ditemukan (target mungkin tidak memakai Kasada)", duration };
  });
}

// Kompatibilitas mundur untuk pemanggil gaya lama (hazeloffc PR #1).
class KasadaSolver {
  constructor(options = {}) {
    this.timeout = options.timeout || 30;
    this.waitTime = options.waitTime || 15;
    this.browserService = options.browserService || null;
    this.isReady = true;
  }
  async initialize() {
    if (!this.browserService) throw new Error("KasadaSolver butuh browserService (lihat /api/kasada)");
  }
  async cleanup() {}
  async solve(url) {
    const result = await solveKasada({
      url,
      timeout: this.timeout,
      waitTime: this.waitTime,
      browserService: this.browserService,
    });
    if (result.success) {
      return {
        success: true,
        headers: result.data.headers,
        cookies: result.data.cookies,
        duration: parseFloat((result.duration / 1000).toFixed(2)),
      };
    }
    return {
      success: false,
      error: result.error,
      duration: parseFloat((result.duration / 1000).toFixed(2)),
    };
  }
}

module.exports = { KasadaSolver, solveKasada };
