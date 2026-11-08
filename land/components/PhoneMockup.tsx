import Image from 'next/image';

import { SCREEN_SIZE } from '@/lib/site';

type Props = { src: string; alt: string; priority?: boolean; className?: string };

/** Generic phone frame drawn in CSS (no branded device) around a real app screenshot. */
export function PhoneMockup({ src, alt, priority = false, className = '' }: Props) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone-screen">
        <span className="phone-camera" aria-hidden />
        <Image src={src} alt={alt} width={SCREEN_SIZE.width} height={SCREEN_SIZE.height} priority={priority} sizes="(max-width: 960px) 74vw, 330px" />
      </div>
    </div>
  );
}
