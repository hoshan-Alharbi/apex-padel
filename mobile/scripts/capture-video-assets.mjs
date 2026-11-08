#!/usr/bin/env node
// Raw app material for the episode edit (Remotion): full-resolution PNG screens, extra "moment"
// screens, the opening animation as a 30 fps video, and tap points for each screen.
//
// Usage (emulator booted, Metro running in production mode so no dev overlays show):
//   npx expo start --no-dev --minify --port 8090
//   node mobile/scripts/capture-video-assets.mjs --url exp://127.0.0.1:8090 [--skip-opening]
//
// Output (git-ignored): video/raw/app/*.png, opening.mp4, app-screens.json (read by
// land/scripts/capture-video-assets.mjs, which writes video/raw/assets.json).
//
// The flow drives the app's in-memory demo data, so run it on a fresh app start: it pays the
// last partner's share on the way (split → all paid).

import { execFileSync, spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  adb,
  adbBin,
  demoModeOff,
  demoModeOn,
  EXPO_GO,
  fail,
  findNode,
  launchProject,
  openRoute,
  preflight,
  resolveBaseUrl,
  screencap,
  screenSize,
  sleep,
  swipe,
  tap,
  uiNodes,
} from './lib/android.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '../../video/raw/app');
const args = process.argv.slice(2);

/** Largest screenrecord size the emulator's encoder accepts at the screen's aspect ratio. */
const RECORD_SIZE = '1080x2404';
/** First launch in production mode builds the bundle; later launches are cached. */
const WARMUP_MS = 70_000;
/** Opening animation length (2.4 s) plus the fade into Home and a little margin. */
const OPENING_TAIL_MS = 3400;

const shots = [];
/** 'shots' saves PNGs; 'taps' (animations off, so uiautomator can read the screen) records tap points. */
let mode = 'shots';
const pendingTaps = new Map();

/** Saves the current screen as video/raw/app/<file>.png, or its tap points in the taps pass. */
function shot(file, description, wanted = []) {
  if (mode === 'taps') {
    pendingTaps.set(file, tapPoints(wanted));
    return;
  }
  writeFileSync(join(outDir, file), screencap());
  const size = screenSize();
  shots.push({ path: `app/${file}`, width: size.width, height: size.height, description, taps: [] });
  console.log(`  ✓ ${file}`);
}

/** Tap points from on-screen text: [{ name, text }] → [{ name, x, y, bounds }]. Missing ones are reported. */
function tapPoints(wanted) {
  if (wanted.length === 0) return [];
  const nodes = uiNodes();
  return wanted.flatMap(({ name, text }) => {
    const n = findNode(nodes, text);
    if (!n) {
      console.log(`    ! tap point not found on screen: ${name}`);
      return [];
    }
    return [{ name, x: Math.round(n.x), y: Math.round(n.y), bounds: n.bounds }];
  });
}

/**
 * The split screen re-renders every second (live countdown), so uiautomator never sees it idle.
 * Its buttons were located once by colour in the 1344×2992 screenshot (volt fill, outline next
 * to it); used only when the dump finds nothing on that screen.
 */
const FALLBACK_TAPS = {
  '04-split-bill.png': [
    { name: 'أرسل الرابط (خالد)', x: 1078, y: 2048, bounds: [912, 2000, 1244, 2096] },
    { name: 'معاينة صفحة الدفع', x: 636, y: 2048, bounds: [412, 2000, 860, 2096] },
    { name: 'ادفع المتبقي', x: 670, y: 2822, bounds: [48, 2740, 1292, 2904] },
  ],
};

/** Android "remove animations": Reanimated then reports reduced motion and loops stop. */
function setAnimations(on) {
  for (const key of ['animator_duration_scale', 'transition_animation_scale', 'window_animation_scale']) {
    adb('shell', 'settings', 'put', 'global', key, on ? '1' : '0');
  }
}

async function recordOpening(baseUrl) {
  console.log('  recording the opening…');
  adb('shell', 'am', 'force-stop', EXPO_GO);
  await sleep(1000);
  const rec = spawn(adbBin, ['shell', 'screenrecord', '--size', RECORD_SIZE, '--bit-rate', '24000000', '--time-limit', '16', '/sdcard/opening-raw.mp4']);
  await sleep(800);
  await launchProject(baseUrl);
  await new Promise((r) => rec.on('exit', r));
  await sleep(1500);
  const raw = join(outDir, 'opening-raw.mp4');
  execFileSync(adbBin, ['pull', '/sdcard/opening-raw.mp4', raw]);
  adb('shell', 'rm', '-f', '/sdcard/opening-raw.mp4');
  console.log(`  ✓ opening-raw.mp4 (trim with: node … --trim-opening <start>-<end>)`);
}

/** Cuts opening-raw.mp4 to [start, end] seconds and re-encodes at a constant 30 fps. */
function trimOpening(range) {
  const [start, end] = range.split('-').map(Number);
  if (!(end > start)) fail('--trim-opening expects <start>-<end> in seconds');
  const raw = join(outDir, 'opening-raw.mp4');
  const out = join(outDir, 'opening.mp4');
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-ss', String(start), '-to', String(end), '-i', raw, '-map', '0:v:0', '-vf', 'fps=30', '-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', '-an', out]);
  console.log(`  ✓ opening.mp4 (${start}s → ${end}s, 30 fps)`);
}

async function captureScreens(baseUrl) {
  const go = async (route, ms = 3200) => {
    openRoute(baseUrl, route);
    await sleep(ms);
  };

  await go('', 3500);
  shot('01-home.png', 'الرئيسية: الترحيب، البحث والفلاتر، حجزك القادم بانتظار شريك، وأول نادي مميز', [
    { name: 'التفاصيل (حجزك القادم)', text: 'التفاصيل' },
    { name: 'فلتر مكيّف', text: 'مكيّف' },
    { name: 'بطاقة نادي الصدارة', text: /الصدارة للبادل$/ },
  ]);

  await go('club/sadara', 3800);
  shot('02-club-details.png', 'تفاصيل نادي الصدارة: صورة الملعب، التقييم والعنوان، المرافق، وزر اختر الوقت واحجز', [
    { name: 'اختر الوقت واحجز', text: 'اختر الوقت واحجز' },
    { name: 'الاتجاهات', text: 'الاتجاهات' },
    { name: 'اتصال', text: 'اتصال' },
  ]);

  await go('book/sadara?court=court-1', 3200);
  shot('03-booking.png', 'شاشة الحجز: اختيار الملعب، تقويم 14 يوم، والمدة 60/90/120 مع السعر', [
    { name: 'ملعب 2', text: /^ملعب 2/ },
    { name: 'يوم بكرة في التقويم', text: String(new Date(Date.now() + 86400000).getDate()) },
    { name: 'مدة 120 دقيقة', text: /^120 د/ },
  ]);

  // Moment: tomorrow picked, then the first free slot, scrolled so the slots and total show.
  const nodes = uiNodes();
  const tomorrow = findNode(nodes, String(new Date(Date.now() + 86400000).getDate()));
  if (tomorrow) tap(tomorrow.x, tomorrow.y);
  await sleep(700);
  const { width, height } = screenSize();
  swipe(width / 2, height * 0.72, width / 2, height * 0.32, 500);
  await sleep(1200);
  const free = findNode(uiNodes(), 'متاح');
  if (free) {
    tap(free.x, free.y);
    await sleep(1400);
    shot('03b-booking-time-selected.png', 'الحجز بعد اختيار الوقت: الوقت محدد بالأخضر، والإجمالي وزر متابعة للدفع مفعّل', [
      { name: 'الوقت المحدد', text: 'محدد' },
      { name: 'متابعة للدفع', text: 'متابعة للدفع' },
    ]);
  } else {
    console.log('    ! no free slot found for the time-selected moment');
  }

  await go('split/bk-seed-split', 3200);
  shot('04-split-bill.png', 'تقسيم الفاتورة: العدّاد التنازلي، 3 لاعبين دفعوا وخالد بانتظار الدفع', [
    { name: 'أرسل الرابط (خالد)', text: 'أرسل الرابط' },
    { name: 'معاينة صفحة الدفع', text: 'معاينة صفحة الدفع' },
    { name: 'ادفع المتبقي', text: /^ادفع المتبقي/ },
  ]);

  // Moment: Khalid pays from his link (centred payment overlay), then the split is complete.
  await go('pay/bk-seed-split/share-3', 3200);
  shot('04b-partner-pay.png', 'صفحة الدفع اللي توصل خالد: الدعوة، تفاصيل المباراة، وحصته 55 ر.س', [{ name: 'ادفع 55 ر.س', text: /^ادفع/ }]);
  const pay = findNode(uiNodes(), /^ادفع/);
  if (pay) {
    tap(pay.x, pay.y);
    await sleep(mode === 'taps' ? 3200 : 2100);
    if (mode === 'shots') shot('04c-payment-success.png', 'نافذة الدفع في نص الشاشة: علامة صح ترسم نفسها وتم الدفع');
    await sleep(2500);
  }
  await go('split/bk-seed-split', 3500);
  shot('04d-split-all-paid.png', 'تقسيم الفاتورة مكتمل: اللاعبين الأربعة دفعوا والحجز مؤكد', [{ name: 'حالة الاكتمال', text: /اكتمل الدفع/ }]);

  await go('booking/bk-seed-arena', 3800);
  shot('05-match-pass.png', 'تذكرة المباراة: الحجز مؤكد، رمز الدخول ورمز البوابة', [
    { name: 'شارك مع الشلة', text: 'شارك مع الشلة' },
    { name: 'حالة الحجز: مؤكد', text: 'تم تأكيد الحجز!' },
  ]);

  await go('bookings', 3000);
  shot('06-bookings.png', 'حجوزاتي: الحجوزات القادمة بحالاتها (مؤكد، بانتظار الشركاء)', [
    { name: 'تبويب السابقة', text: /^السابقة/ },
    { name: 'أول حجز', text: /نادي/ },
  ]);
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  const trimArg = args.indexOf('--trim-opening');
  if (trimArg >= 0) {
    trimOpening(args[trimArg + 1]);
    return;
  }

  preflight({ ffmpegEncoder: 'libx264' });
  const baseUrl = resolveBaseUrl(args, 'exp://127.0.0.1:8090');
  console.log(`capture-video-assets: ${baseUrl} → ${outDir}`);
  demoModeOn();
  try {
    if (args.includes('--taps-only')) {
      // Re-run only the tap-point pass for screens captured earlier.
      shots.push(...JSON.parse(readFileSync(join(outDir, 'app-screens.json'), 'utf8')));
    } else {
    if (!args.includes('--no-warmup')) {
      console.log(`  warm-up launch (${WARMUP_MS / 1000}s, builds the production bundle)…`);
      adb('shell', 'am', 'force-stop', EXPO_GO);
      await launchProject(baseUrl);
      await sleep(WARMUP_MS);
    }
    if (!args.includes('--skip-opening')) await recordOpening(baseUrl);
    else {
      adb('shell', 'am', 'force-stop', EXPO_GO);
      await launchProject(baseUrl);
    }
    await sleep(OPENING_TAIL_MS + 4000);
    await captureScreens(baseUrl);
    }

    // Second pass on a fresh start (same demo data) with animations off, for tap points.
    console.log('  tap points pass (animations off)…');
    mode = 'taps';
    setAnimations(false);
    try {
      adb('shell', 'am', 'force-stop', EXPO_GO);
      await launchProject(baseUrl);
      await sleep(8000);
      await captureScreens(baseUrl);
    } finally {
      setAnimations(true);
    }
    for (const s of shots) {
      const file = s.path.replace('app/', '');
      const found = pendingTaps.get(file) ?? [];
      s.taps = found.length > 0 ? found : (FALLBACK_TAPS[file] ?? []);
    }
    writeFileSync(join(outDir, 'app-screens.json'), JSON.stringify(shots, null, 2));
    console.log(`  ✓ app-screens.json (${shots.length} screens)`);
  } finally {
    demoModeOff();
  }
}

main().catch((err) => {
  demoModeOff();
  fail(err instanceof Error ? err.message : String(err));
});
