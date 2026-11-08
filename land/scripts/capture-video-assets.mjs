#!/usr/bin/env node
// Landing-page and brand material for the episode edit, plus the asset index.
//
// Usage (landing served locally, app screens already captured by
// mobile/scripts/capture-video-assets.mjs):
//   npm run build && npx next start -p 3104
//   node land/scripts/capture-video-assets.mjs [--url http://localhost:3104]
//
// Output (git-ignored, under video/raw/):
//   landing/desktop/full.png (1440 @2x), landing/mobile/full.png (390 @3x), one PNG per section
//   brand/logo.svg, brand/icon.png (1024), brand/brand.json
//   assets.json: every file with size, a one-line description, and tap points for app screens
//
// Uses the installed Google Chrome through Playwright (channel "chrome"), no browser download.

import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const raw = join(root, 'video/raw');
const args = process.argv.slice(2);
const urlArg = args.indexOf('--url');
const url = urlArg >= 0 ? args[urlArg + 1] : 'http://localhost:3104';

const SECTIONS = [
  { name: 'hero', selector: '#top', description: 'الهيرو: "ملعبك الجاي، بضغطة وحدة" مع الجوال المايل والبطاقات العائمة وخطوط الملعب' },
  { name: 'facts', selector: '.facts', description: 'شريط الأرقام: 3 مدن، 14 يوم، 60-120 دقيقة، 2-4 لاعبين' },
  { name: 'features', selector: '#features', description: 'المزايا: بطاقات bento فيها جوالين (النادي، الحجز) والفلاتر والمدد' },
  { name: 'marquee', selector: '.marquee', description: 'شريط المدن المتحرك: الرياض، جدة، الخبر، الدمام' },
  { name: 'split', selector: '#split', description: 'مشهد تقسيم الفاتورة: العدّاد وبطاقات اللاعبين كلهم دفعوا حول الجوال' },
  { name: 'steps', selector: '#how', description: 'طريقة الحجز: اختر النادي، احجز الوقت، ادعُ الشلة' },
  { name: 'download', selector: '#download', description: 'قسم التحميل الليموني: "جاهز للمباراة الجاية؟" مع جوالين وزرين' },
  { name: 'footer', selector: '.site-footer', description: 'الفوتر: الشعار والروابط وسطر المشروع الاستعراضي' },
];

const VIEWPORTS = [
  { dir: 'desktop', width: 1440, height: 900, scale: 2, mobile: false },
  { dir: 'mobile', width: 390, height: 844, scale: 3, mobile: true },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Width/height from a PNG header. */
function pngSize(file) {
  const b = readFileSync(file);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

/** Scrolls to the bottom in steps (fires every reveal and the split scene), then back to the top. */
async function settle(page, height) {
  await page.evaluate(() => document.fonts.ready);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= total; y += Math.round(height * 0.5)) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await sleep(220);
  }
  // Let the split-bill sequence finish (players pay one after another) before leaving it.
  await page.locator('#split').scrollIntoViewIfNeeded();
  await sleep(5500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(2500);
}

/** Chrome's largest single capture is ~16384 device px tall; past it, it repeats the page top. */
const MAX_CAPTURE_PX = 16000;

/**
 * Full-page screenshot that stays correct on tall pages: captures in chunks under Chrome's
 * limit and stacks them with ffmpeg.
 */
async function fullPageShot(page, file, scale) {
  const { width, height } = await page.evaluate(() => ({ width: document.documentElement.clientWidth, height: document.documentElement.scrollHeight }));
  const chunk = Math.floor(MAX_CAPTURE_PX / scale);
  if (height <= chunk) {
    await page.screenshot({ path: file, fullPage: true });
    return;
  }
  const tmp = mkdtempSync(join(tmpdir(), 'land-full-'));
  const parts = [];
  for (let y = 0, i = 0; y < height; y += chunk, i++) {
    const part = join(tmp, `part-${i}.png`);
    await page.screenshot({ path: part, fullPage: true, clip: { x: 0, y, width, height: Math.min(chunk, height - y) } });
    parts.push(part);
  }
  const inputs = parts.flatMap((p) => ['-i', p]);
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...inputs, '-filter_complex', `vstack=inputs=${parts.length}`, file]);
  rmSync(tmp, { recursive: true, force: true });
}

async function captureLanding(browser, entries) {
  for (const vp of VIEWPORTS) {
    const outDir = join(raw, 'landing', vp.dir);
    mkdirSync(outDir, { recursive: true });
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.scale,
      // Chrome's mobile emulation (isMobile) repeats sections in full-page captures; the page's
      // layout depends only on width, so a 390-wide desktop viewport renders the same mobile design.
      isMobile: false,
      hasTouch: vp.mobile,
      reducedMotion: 'no-preference',
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    // The vignette is a viewport effect; on a full-page capture it would stretch over everything.
    await page.addStyleTag({ content: 'body::before{display:none!important}' });
    await settle(page, vp.height);

    const full = join(outDir, 'full.png');
    await fullPageShot(page, full, vp.scale);
    entries.push({ file: full, description: `اللاندنج كاملة (${vp.dir === 'desktop' ? 'كمبيوتر 1440 بدقة 2x' : 'جوال 390 بدقة 3x'})` });
    console.log(`  ✓ landing/${vp.dir}/full.png`);

    for (const s of SECTIONS) {
      // Floating header only on the hero; elsewhere it would sit on top of the section.
      await page.evaluate((hide) => {
        const h = document.querySelector('.site-header');
        if (h) h.style.visibility = hide ? 'hidden' : '';
      }, s.name !== 'hero');
      const el = page.locator(s.selector).first();
      await el.scrollIntoViewIfNeeded();
      await sleep(700);
      const file = join(outDir, `${s.name}.png`);
      await el.screenshot({ path: file });
      entries.push({ file, description: s.description });
    }
    console.log(`  ✓ landing/${vp.dir}/ ${SECTIONS.length} sections`);
    await context.close();
  }
}

/** The mark from land/components/Logo.tsx as a standalone SVG. */
function logoSvg({ background } = {}) {
  const dots = [
    [512, 580, 20, '#D4FF00'], [448, 591, 16, '#38BDF8'], [576, 591, 16, '#38BDF8'], [392, 628, 12, '#AFC72A'], [632, 628, 12, '#AFC72A'],
    [480, 652, 18, '#D4FF00'], [544, 652, 18, '#D4FF00'], [512, 720, 22, '#D4FF00'], [452, 732, 15, '#38BDF8'], [572, 732, 15, '#38BDF8'],
  ];
  const view = background ? '0 0 1024 1024' : '176 176 672 736';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}"${background ? ' width="1024" height="1024"' : ''}>
  <defs>
    <linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4CC9FA"/><stop offset="1" stop-color="#0A84C9"/></linearGradient>
    <linearGradient id="v" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E2FF3D"/><stop offset="1" stop-color="#C2EF00"/></linearGradient>
  </defs>
  ${background ? `<rect width="1024" height="1024" fill="${background}"/>\n  <g transform="translate(512 548) scale(0.92) translate(-512 -544)">` : '<g>'}
  <circle cx="512" cy="512" r="320" fill="none" stroke="#2A3242" stroke-width="8"/>
  <path d="M336 572 A188 188 0 1 0 688 572" fill="none" stroke="url(#c)" stroke-width="30" stroke-linecap="round"/>
  <path d="M492 828 H532 L540 888 H484 Z" fill="url(#v)"/>
  ${dots.map(([x, y, r, f]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/>`).join('\n  ')}
  <polygon points="512,208 752,544 648,544 512,348 376,544 272,544" fill="url(#v)"/>
  <circle cx="746" cy="294" r="30" fill="#D4FF00"/>
  </g>
</svg>
`;
}

async function captureBrand(browser, entries) {
  const dir = join(raw, 'brand');
  mkdirSync(dir, { recursive: true });
  const logo = join(dir, 'logo.svg');
  writeFileSync(logo, logoSvg());
  entries.push({ file: logo, description: 'الشعار vector بخلفية شفافة (المدار، المضرب، حرف A، الكورة)', size: { width: 672, height: 736 } });

  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });
  await page.setContent(`<html><body style="margin:0">${logoSvg({ background: '#0E131D' })}</body></html>`);
  const icon = join(dir, 'icon.png');
  await page.screenshot({ path: icon, clip: { x: 0, y: 0, width: 1024, height: 1024 } });
  await page.close();
  entries.push({ file: icon, description: 'أيقونة التطبيق 1024×1024: الشعار على الخلفية الكحلية' });

  // Colours come from the app's single source of truth (mobile tokens).
  const require = createRequire(import.meta.url);
  const tokensPath = [join(root, 'mobile/src/theme/tokens.js'), join(root, 'src/theme/tokens.js')].find((p) => {
    try {
      return statSync(p).isFile();
    } catch {
      return false;
    }
  });
  const { colors } = require(tokensPath);
  const brand = {
    product: { ar: 'أبكس بادل', en: 'Apex Padel', tagline: { ar: 'ملعبك الجاي، بضغطة وحدة', en: 'Your next court, one tap away' } },
    colors: {
      background: colors.bg,
      surface: colors.surface.DEFAULT,
      surfaceLow: colors.surface.low,
      surfaceHigh: colors.surface.high,
      text: colors.ink.DEFAULT,
      textStrong: colors.ink.strong,
      textSoft: colors.ink.soft,
      textMuted: colors.ink.muted,
      volt: colors.volt.DEFAULT,
      voltInk: colors.volt.ink,
      cyan: colors.cyan.DEFAULT,
      crimson: colors.crimson.DEFAULT,
      logo: { volt: '#D4FF00', voltLight: '#E2FF3D', voltDeep: '#C2EF00', cyan: '#38BDF8', cyanLight: '#4CC9FA', cyanDeep: '#0A84C9', olive: '#AFC72A', orbit: '#2A3242' },
    },
    fonts: [
      { family: 'Readex Pro', weights: [400, 500, 600, 700], use: 'كل نصوص التطبيق واللاندنج (عربي وإنجليزي)', source: 'Google Fonts' },
      { family: 'Space Mono', weights: [700], use: 'الأرقام: الأسعار والأوقات والعدّاد', source: 'Google Fonts' },
      { family: 'Alexandria', weights: [800, 900], use: 'عناوين اللاندنج الكبيرة (اختيار مؤقت)', source: 'Google Fonts' },
    ],
    notes: 'الليموني هو اللون الأساسي، والسماوي لون ثاني للتفاصيل والتوهجات. الخلفية داكنة دائماً.',
  };
  const brandFile = join(dir, 'brand.json');
  writeFileSync(brandFile, JSON.stringify(brand, null, 2));
  entries.push({ file: brandFile, description: 'الهوية: الألوان (hex)، الخطوط وأوزانها، واسم المنتج بالعربي والإنجليزي', size: null });
  console.log('  ✓ brand/logo.svg, icon.png, brand.json');
}

function writeIndex(entries) {
  const app = JSON.parse(readFileSync(join(raw, 'app/app-screens.json'), 'utf8'));
  const assets = [
    ...app.map((a) => ({ ...a, path: `app/${a.path.replace(/^app\//, '')}`, kind: 'app-screen' })),
    {
      path: 'app/opening.mp4',
      kind: 'video',
      width: 1080,
      height: 2404,
      fps: 30,
      durationSeconds: 3.6,
      description: 'الافتتاحية: خطوط الملعب ترتسم، المضرب والنقاط، حرف A، الكورة تلف المدار، ثم الشعار يصغر للهيدر وتظهر الرئيسية',
      taps: [],
    },
    ...entries.map((e) => {
      const size = e.size === undefined ? (e.file.endsWith('.png') ? pngSize(e.file) : null) : e.size;
      return {
        path: relative(raw, e.file).split('\\').join('/'),
        kind: e.file.includes(`${'landing'}`) ? 'landing' : 'brand',
        ...(size ?? {}),
        description: e.description,
      };
    }),
  ];
  const extras = readdirSync(join(raw, 'app')).filter((f) => !assets.some((a) => a.path === `app/${f}`) && !['app-screens.json', 'opening-raw.mp4'].includes(f));
  const index = {
    generated: new Date().toISOString(),
    notes: {
      coordinates: 'نقاط الضغط بالبكسل على لقطة التطبيق نفسها (1344×2992)، من uiautomator. x,y مركز الزر، و bounds = [يسار، فوق، يمين، تحت].',
      opening: 'opening-raw.mp4 التسجيل الخام (فيه شاشة تحميل Expo Go)، و opening.mp4 المقصوص 30fps.',
      notOurs: extras.length ? `ملفات في app/ ما أنشأها السكربت: ${extras.join('، ')}` : undefined,
    },
    assets,
  };
  writeFileSync(join(raw, 'assets.json'), JSON.stringify(index, null, 2));
  console.log(`  ✓ assets.json (${assets.length} files)`);
}

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const entries = [];
  try {
    console.log(`capture-video-assets (landing): ${url} → ${raw}`);
    await captureLanding(browser, entries);
    await captureBrand(browser, entries);
  } finally {
    await browser.close();
  }
  writeIndex(entries);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
