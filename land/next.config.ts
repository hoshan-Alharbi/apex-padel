import type { NextConfig } from 'next';

const config: NextConfig = {
  // Self-contained server for the Docker image (see /Dockerfile).
  output: 'standalone',
  // No Next.js dev badge in screen recordings.
  devIndicators: false,
  // land/ is its own project: don't let Next pick the repo root (other lockfiles) as the trace root.
  outputFileTracingRoot: __dirname,
  images: {
    // Screenshots are already resized WebP from mobile/scripts/capture-screens.mjs.
    unoptimized: true,
  },
};

export default config;
