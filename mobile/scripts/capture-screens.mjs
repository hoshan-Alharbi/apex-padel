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
// otherwise it shows up in the screenshots.

import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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
const EXPO_GO = 'host.exp.exponent';
const OUTPUT_WIDTH = 1080;

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '../../land/public/screens');

const args = process.argv.slice(2);
const arg = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const baseUrl = (arg('--url') ?? process.env.EXPO_URL ?? 'exp://127.0.0.1:8081').replace(/\/$/, '');
const only = arg('--only')?.split(',');

const sdk = process.env.ANDROID_HOME ?? (process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, 'Android', 'Sdk') : undefined);
const adbBin = sdk ? join(sdk, 'platform-tools', process.platform === 'win32' ? 'adb.exe' : 'adb') : 'adb';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const adb = (...a) => execFileSync(adbBin, a, { encoding: 'utf8' });
const demo = (command, extras = []) =>
  adb('shell', 'am', 'broadcast', '-a', 'com.android.systemui.demo', '-e', 'command', command, ...extras);
const open = (url) => adb('shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', url, EXPO_GO);

function preflight() {
  try {
    execFileSync('ffmpeg', ['-hide_banner', '-encoders'], { encoding: 'utf8' }).includes('libwebp') || fail('ffmpeg has no libwebp encoder');
  } catch {
    fail('ffmpeg not found in PATH');
  }
  const devices = adb('devices').split(/\r?\n/).filter((l) => /\tdevice$/.test(l));
  if (devices.length === 0) fail('no Android device/emulator connected (adb devices)');
}

function fail(message) {
  console.error(`capture-screens: ${message}`);
  process.exit(1);
}

function demoModeOn() {
  adb('shell', 'settings', 'put', 'global', 'sysui_demo_allowed', '1');
  demo('enter');
  demo('clock', ['-e', 'hhmm', '0941']);
  demo('battery', ['-e', 'level', '100', '-e', 'plugged', 'false']);
  demo('network', ['-e', 'wifi', 'show', '-e', 'level', '4']);
  demo('network', ['-e', 'mobile', 'show', '-e', 'level', '4', '-e', 'datatype', 'none']);
  demo('notifications', ['-e', 'visible', 'false']);
}

function demoModeOff() {
  try {
    demo('exit');
  } catch {
    // Device gone: nothing to restore.
  }
}

const projectFocused = () => /mCurrentFocus=.*host\.exp\.exponent\/.*ExperienceActivity/.test(adb('shell', 'dumpsys', 'window'));

/**
 * After a force-stop, Expo Go sometimes swallows the first intent and shows its own home
 * screen. Re-send the project URL until the project's activity has focus.
 */
async function launchProject() {
  for (let attempt = 1; attempt <= 4; attempt++) {
    open(baseUrl);
    for (let i = 0; i < 10; i++) {
      await sleep(1000);
      if (projectFocused()) return;
    }
    console.log(`  Expo Go did not open the project (attempt ${attempt}), retrying…`);
  }
  fail('Expo Go never opened the project; is Metro running at ' + baseUrl + '?');
}

/** Screenshot → resized WebP in land/public/screens. */
function capture(name, tmp) {
  const png = execFileSync(adbBin, ['exec-out', 'screencap', '-p'], { maxBuffer: 64 * 1024 * 1024 });
  const pngPath = join(tmp, `${name}.png`);
  writeFileSync(pngPath, png);
  const out = join(outDir, `${name}.webp`);
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', pngPath, '-vf', `scale=${OUTPUT_WIDTH}:-1`, '-c:v', 'libwebp', '-quality', '88', out]);
  console.log(`  ✓ ${out}`);
}

async function main() {
  preflight();
  mkdirSync(outDir, { recursive: true });
  const tmp = mkdtempSync(join(tmpdir(), 'apex-screens-'));
  const port = new URL(baseUrl.replace(/^exp:/, 'http:')).port;
  if (port) adb('reverse', `tcp:${port}`, `tcp:${port}`);

  console.log(`capture-screens: ${baseUrl} → ${outDir}`);
  demoModeOn();
  try {
    adb('shell', 'am', 'force-stop', EXPO_GO);
    await launchProject();
    console.log(`  waiting ${COLD_START_MS / 1000}s for the bundle and the opening animation…`);
    await sleep(COLD_START_MS);

    for (const screen of SCREENS) {
      if (only && !only.includes(screen.name)) continue;
      if (screen.route) open(`${baseUrl}/--/${screen.route}`);
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
