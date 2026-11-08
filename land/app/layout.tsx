import type { Metadata, Viewport } from 'next';
import { Readex_Pro, Space_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

import { SITE } from '@/lib/site';

import './globals.css';

// Same fonts as the app (docs/design-system.md): Readex Pro for text, Space Mono for numbers.
const readex = Readex_Pro({ subsets: ['arabic', 'latin'], variable: '--font-readex', display: 'swap' });
const spaceMono = Space_Mono({ weight: '700', subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ['بادل', 'حجز ملعب بادل', 'ملاعب بادل الرياض', 'ملاعب بادل جدة', 'ملاعب بادل الخبر', 'Apex Padel'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: '/',
  },
  twitter: { card: 'summary_large_image', title: SITE.title, description: SITE.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0e131d',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${readex.variable} ${spaceMono.variable}`}>
      <body>
        {/* Without JavaScript the scroll reveals never fire: show everything. */}
        <noscript>
          <style>{'.reveal{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
