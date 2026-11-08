import { CalendarCheck, Star, UsersThree } from '@phosphor-icons/react/dist/ssr';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import Image from 'next/image';

import { HERO, SCREENS } from '@/lib/site';

import { CourtLines } from '../CourtLines';
import { PointerTilt } from '../motion';
import { PhoneFrame } from '../PhoneFrame';

/** Night court photo supplied by the owner; until it exists the hero uses the drawn background. */
const HERO_PHOTO = '/hero-court.jpg';
const hasPhoto = existsSync(join(process.cwd(), 'public', HERO_PHOTO));

export function Hero() {
  const { chips } = HERO;
  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden>
        {hasPhoto && <Image src={HERO_PHOTO} alt="" fill priority sizes="100vw" className="hero-photo" />}
        <div className="hero-shade" />
        <div className="hero-grid" />
        <div className="beam beam-a" />
        <div className="beam beam-b" />
        <div className="beam beam-c" />
      </div>
      <div className="hero-word" aria-hidden>
        PADEL
      </div>

      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">
            <Star size={14} weight="fill" />
            {HERO.eyebrow}
          </span>
          <h1 className="display">
            {HERO.titleLead} <span className="shimmer-text">{HERO.titleHighlight}</span>
            {HERO.titleTail}
            <span className="hero-title-2">{HERO.title}</span>
          </h1>
          <p className="lead">{HERO.body}</p>
          <div className="hero-actions">
            <a href="#download" className="btn btn-primary">
              {HERO.primary}
            </a>
            <a href="#features" className="btn btn-ghost">
              {HERO.secondary}
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <CourtLines draw className="hero-court" />
          <div className="hero-glow" aria-hidden />
          <div className="hero-glow cyan" aria-hidden />
          <PointerTilt>
            <div className="tilt">
              <PhoneFrame src={SCREENS.home} alt={HERO.screenAlt} priority className="sweep" />
            </div>
          </PointerTilt>

          <div className="chip glass chip-a" aria-hidden>
            <span className="chip-icon">
              <CalendarCheck size={20} weight="bold" />
            </span>
            <span>
              <small>{chips.next.label}</small>
              <strong>{chips.next.value}</strong>
            </span>
          </div>
          <div className="chip glass chip-b" aria-hidden>
            <span className="chip-icon cyan">
              <Star size={20} weight="fill" />
            </span>
            <span>
              <small>{chips.club.label}</small>
              <strong className="mono">{chips.club.value}</strong>
            </span>
          </div>
          <div className="chip glass chip-c" aria-hidden>
            <span className="chip-icon rose">
              <UsersThree size={20} weight="bold" />
            </span>
            <span>
              <small>{chips.split.label}</small>
              <strong>{chips.split.value}</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
