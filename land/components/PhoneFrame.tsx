import Image from 'next/image';

import { SCREEN_SIZE } from '@/lib/site';

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  /** Rendered width; the frame keeps the screenshot's aspect ratio. */
  sizes?: string;
};

/**
 * Drawn device frame (CSS only, no device photo or logo). Proportions follow the 21st.dev
 * "Iphone Mockup" component (lovesickfromthe6ix): 393-pt screen, 12-pt bezel, 56-pt corners,
 * floating island. Layers: brushed metal band, black bezel, screen, glass glare.
 */
export function PhoneFrame({ src, alt, priority = false, className = '', sizes = '(max-width: 960px) 72vw, 340px' }: Props) {
  return (
    <div className={`device ${className}`}>
      <span className="device-btn device-btn-action" aria-hidden />
      <span className="device-btn device-btn-up" aria-hidden />
      <span className="device-btn device-btn-down" aria-hidden />
      <span className="device-btn device-btn-power" aria-hidden />
      <div className="device-bezel">
        <div className="device-screen">
          <Image src={src} alt={alt} width={SCREEN_SIZE.width} height={SCREEN_SIZE.height} priority={priority} sizes={sizes} />
          <span className="device-island" aria-hidden />
          <span className="device-glare" aria-hidden />
        </div>
      </div>
    </div>
  );
}
