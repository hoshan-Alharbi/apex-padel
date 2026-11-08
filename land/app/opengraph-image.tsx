import { ImageResponse } from 'next/og';

// Social preview. Latin text only: the OG renderer would need an Arabic font file to shape Arabic.
export const alt = 'Apex Padel: padel court booking in Saudi Arabia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '80px 96px',
          background: 'radial-gradient(60% 80% at 80% 50%, rgba(202,243,0,0.28), #0e131d 70%)',
          color: '#f4f6fb',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 30, color: '#caf300', letterSpacing: 6 }}>APEX PADEL</div>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1, maxWidth: 640 }}>Book your next padel court</div>
          <div style={{ fontSize: 30, color: '#c5c9ac' }}>Riyadh · Jeddah · Al Khobar</div>
        </div>
        <svg width="300" height="327" viewBox="176 176 672 736">
          <circle cx="512" cy="512" r="320" fill="none" stroke="#2A3242" stroke-width="8" />
          <path d="M336 572 A188 188 0 1 0 688 572" fill="none" stroke="#38BDF8" stroke-width="30" stroke-linecap="round" />
          <path d="M492 828 H532 L540 888 H484 Z" fill="#D4FF00" />
          <polygon points="512,208 752,544 648,544 512,348 376,544 272,544" fill="#D4FF00" />
          <circle cx="746" cy="294" r="30" fill="#D4FF00" />
        </svg>
      </div>
    ),
    size,
  );
}
