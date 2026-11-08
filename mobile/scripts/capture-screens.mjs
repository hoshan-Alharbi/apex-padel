#!/usr/bin/env node
// Clean screenshots of the app's main screens from the Android emulator, for the landing page.
//
// Usage (Metro must be running and the emulator booted):
//   node mobile/scripts/capture-screens.mjs [--url exp://127.0.0.1:8081] [--only home,booking]
//
// What it does:
//   1. Turns on Android's status-bar demo mode (9:41, full battery and signal, no notifications).
//   2. Cold-starts the app in Expo Go, waits for the opening animation, then opens each screen
//      by deep link (exp://<host>/--/<route>) and waits for images and entrance animations.
//   3. Saves land/public/screens/<name>.webp (fixed names, so re-running updates the landing page).
//   4. Turns demo mode off again, even if something fails.
//
// Needs: adb (ANDROID_HOME or PATH) and ffmpeg with libwebp (PATH).
// Once per emulator: hide Expo Go's floating "Tools" button (dev menu → Tools button: off),
// otherwise it shows up in the screenshots. Running Metro with --no-dev avoids dev overlays.

import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { adb, demoModeOff, demoModeOn, EXPO_GO, fail, launchProject, openRoute, preflight, resolveBaseUrl, screencap, sleep } from './lib/android.mjs';

// Routes come from the app's seed data (src/data/clubs.ts, src/state/bookingsSeed.ts).
// The app has no "open match" screen; the booking pass takes that slot.
const SCREENS = [
  { name: 'home', route: '', settleMs: 3500 },
  { name: 'club-details', route: 'club/sadara', settleMs: 3500 },
  { name: 'booking', route: 'book/sadara?court=court-1', settleMs: 3000 },
  { name: 'split-bill', route: 'split/bk-seed-split', settleMs: 3000 },
  { name: 'match-pass', route: 'booking/bk-seed-arena', settleMs: 3500 },
];

/** Bundle load + opening animation (~2.4 s) on a cold start in dev mode. */
const COLD_START_MS = 40_000;
const OUTPUT_WIDTH = 1080;

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '../../land/public/screens');

const args = process.argv.slice(2);
const onlyArg = args.indexOf('--only');
const only = onlyArg >= 0 ? args[onlyArg + 1]?.split(',') : undefined;

/** Screenshot → resized WebP in land/public/screens. */
function capture(name, tmp) {
  const pngPath = join(tmp, `${name}.png`);
  writeFileSync(pngPath, screencap());
  const out = join(outDir, `${name}.webp`);
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', pngPath, '-vf', `scale=${OUTPUT_WIDTH}:-1`, '-c:v', 'libwebp', '-quality', '88', out]);
  console.log(`  ✓ ${out}`);
}

async function main() {
  preflight({ ffmpegEncoder: 'libwebp' });
  mkdirSync(outDir, { recursive: true });
  const tmp = mkdtempSync(join(tmpdir(), 'apex-screens-'));
  const baseUrl = resolveBaseUrl(args);

  console.log(`capture-screens: ${baseUrl} → ${outDir}`);
  demoModeOn();
  try {
    adb('shell', 'am', 'force-stop', EXPO_GO);
    await launchProject(baseUrl);
    console.log(`  waiting ${COLD_START_MS / 1000}s for the bundle and the opening animation…`);
    await sleep(COLD_START_MS);

    for (const screen of SCREENS) {
      if (only && !only.includes(screen.name)) continue;
      if (screen.route) openRoute(baseUrl, screen.route);
      await sleep(screen.settleMs);
      capture(screen.name, tmp);
    }
  } finally {
    demoModeOff();
    rmSync(tmp, { recursive: true, force: true });
  }
}

main().catch((err) => {
  demoModeOff();
  fail(err instanceof Error ? err.message : String(err));
});
