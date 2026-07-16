// Render carousels.html slides to post-ready PNGs via system Chrome.
// Usage: npm i --no-save puppeteer-core && node docs/marketing/make-cards.mjs
import puppeteer from "puppeteer-core";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const htmlPath = join(__dirname, "carousels.html").replace(/\\/g, "/");
const outDir = join(__dirname, "cards");
mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 1500, deviceScaleFactor: 2 });
await page.goto("file:///" + htmlPath, { waitUntil: "networkidle0" });
await page.evaluate(async () => {
  await document.fonts.ready;
});
await new Promise((r) => setTimeout(r, 500));

const slides = await page.$$(".slide");
let i = 0;
for (const s of slides) {
  i++;
  const n = String(i).padStart(2, "0");
  await s.screenshot({ path: join(outDir, `slide-${n}.png`) });
}
console.log(`Rendered ${i} slides → ${outDir}`);
await browser.close();
