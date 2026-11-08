// Shared Android-emulator helpers for the capture scripts (adb + Expo Go).

import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

export const EXPO_GO = 'host.exp.exponent';

const sdk = process.env.ANDROID_HOME ?? (process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, 'Android', 'Sdk') : undefined);
export const adbBin = sdk ? join(sdk, 'platform-tools', process.platform === 'win32' ? 'adb.exe' : 'adb') : 'adb';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const adb = (...a) => execFileSync(adbBin, a, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
export const adbBinary = (...a) => execFileSync(adbBin, a, { maxBuffer: 128 * 1024 * 1024 });

export function fail(message) {
  console.error(`capture: ${message}`);
  process.exit(1);
}

/** adb reachable, one device connected; optionally ffmpeg with an encoder. */
export function preflight({ ffmpegEncoder } = {}) {
  if (ffmpegEncoder) {
    try {
      if (!execFileSync('ffmpeg', ['-hide_banner', '-encoders'], { encoding: 'utf8' }).includes(ffmpegEncoder)) fail(`ffmpeg has no ${ffmpegEncoder} encoder`);
    } catch {
      fail('ffmpeg not found in PATH');
    }
  }
  const devices = adb('devices').split(/\r?\n/).filter((l) => /\tdevice$/.test(l));
  if (devices.length === 0) fail('no Android device/emulator connected (adb devices)');
}

/** "exp://127.0.0.1:8081" from --url / EXPO_URL, plus adb reverse for its port. */
export function resolveBaseUrl(args, fallback = 'exp://127.0.0.1:8081') {
  const i = args.indexOf('--url');
  const baseUrl = ((i >= 0 ? args[i + 1] : undefined) ?? process.env.EXPO_URL ?? fallback).replace(/\/$/, '');
  const port = new URL(baseUrl.replace(/^exp:/, 'http:')).port;
  if (port) adb('reverse', `tcp:${port}`, `tcp:${port}`);
  return baseUrl;
}

const demo = (command, extras = []) => adb('shell', 'am', 'broadcast', '-a', 'com.android.systemui.demo', '-e', 'command', command, ...extras);

/** Status bar demo mode: 9:41, full battery and signal, no notifications. */
export function demoModeOn() {
  adb('shell', 'settings', 'put', 'global', 'sysui_demo_allowed', '1');
  demo('enter');
  demo('clock', ['-e', 'hhmm', '0941']);
  demo('battery', ['-e', 'level', '100', '-e', 'plugged', 'false']);
  demo('network', ['-e', 'wifi', 'show', '-e', 'level', '4']);
  demo('network', ['-e', 'mobile', 'show', '-e', 'level', '4', '-e', 'datatype', 'none']);
  demo('notifications', ['-e', 'visible', 'false']);
}

export function demoModeOff() {
  try {
    demo('exit');
  } catch {
    // Device gone: nothing to restore.
  }
}

export const openUrl = (url) => adb('shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', url, EXPO_GO);

/** Deep link into a route of the running project (Expo Go form: exp://host/--/route). */
export const openRoute = (baseUrl, route) => openUrl(route ? `${baseUrl}/--/${route}` : baseUrl);

const projectFocused = () => /mCurrentFocus=.*host\.exp\.exponent\/.*ExperienceActivity/.test(adb('shell', 'dumpsys', 'window'));

/**
 * After a force-stop, Expo Go sometimes swallows the first intent and shows its own home
 * screen. Re-send the project URL until the project's activity has focus.
 */
export async function launchProject(baseUrl) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    openUrl(baseUrl);
    for (let i = 0; i < 10; i++) {
      await sleep(1000);
      if (projectFocused()) return;
    }
    console.log(`  Expo Go did not open the project (attempt ${attempt}), retrying…`);
  }
  fail(`Expo Go never opened the project; is Metro running at ${baseUrl}?`);
}

/** PNG screenshot bytes at the device's full resolution. */
export const screencap = () => adbBinary('exec-out', 'screencap', '-p');

export const tap = (x, y) => adb('shell', 'input', 'tap', String(Math.round(x)), String(Math.round(y)));
export const swipe = (x1, y1, x2, y2, ms = 400) => adb('shell', 'input', 'swipe', ...[x1, y1, x2, y2, ms].map((v) => String(Math.round(v))));

/**
 * On-screen text nodes from uiautomator: [{ text, x, y, bounds: [l, t, r, b] }] (device px).
 * uiautomator needs a moment without UI updates; screens that re-render every second (a
 * countdown) can make it fail, so it retries, and never reads a stale dump.
 */
export function uiNodes(retries = 8) {
  let xml = '';
  for (let i = 0; i < retries && !xml.includes('<hierarchy'); i++) {
    adb('shell', 'rm', '-f', '/sdcard/ui.xml');
    try {
      execFileSync(adbBin, ['shell', 'uiautomator', 'dump', '/sdcard/ui.xml'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      xml = adb('shell', 'cat', '/sdcard/ui.xml');
    } catch {
      xml = '';
    }
  }
  if (!xml.includes('<hierarchy')) return [];
  const nodes = [];
  for (const m of xml.matchAll(/<node [^>]*?text="([^"]*)"[^>]*?content-desc="([^"]*)"[^>]*?bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/g)) {
    const [, text, desc, l, t, r, b] = m;
    const label = decodeXml(text || desc);
    if (!label) continue;
    const box = [l, t, r, b].map(Number);
    nodes.push({ text: label, x: (box[0] + box[2]) / 2, y: (box[1] + box[3]) / 2, bounds: box });
  }
  return nodes;
}

const decodeXml = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

/** First node whose text matches (string = exact, RegExp = test), or undefined. */
export function findNode(nodes, match) {
  return nodes.find((n) => (typeof match === 'string' ? n.text === match : match.test(n.text)));
}

/** Device screen size in px, e.g. { width: 1344, height: 2992 }. */
export function screenSize() {
  const m = adb('shell', 'wm', 'size').match(/(\d+)x(\d+)/);
  return { width: Number(m[1]), height: Number(m[2]) };
}
