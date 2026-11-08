import { CalendarCheck, Star, UsersThree } from '@phosphor-icons/react/dist/ssr';

import { HERO, SCREENS } from '@/lib/site';

import { PhoneFrame } from '../PhoneFrame';

export function Hero() {
  const { chips } = HERO;
  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden>
        <div className="hero-grid" />
        <div className="beam beam-a" />
        <div className="beam beam-b" />
        <div className="court" />
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
          <h1>
            <span className="accent">{HERO.titleAccent}</span>
            {HERO.title}
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
          <div className="hero-glow" aria-hidden />
          <div className="tilt">
            <PhoneFrame src={SCREENS.home} alt={HERO.screenAlt} priority />
          </div>

          <div className="chip chip-a" aria-hidden>
            <span className="chip-icon">
              <CalendarCheck size={20} weight="bold" />
            </span>
            <span>
              <small>{chips.next.label}</small>
              <strong>{chips.next.value}</strong>
            </span>
          </div>
          <div className="chip chip-b" aria-hidden>
            <span className="chip-icon cyan">
              <Star size={20} weight="fill" />
            </span>
            <span>
              <small>{chips.club.label}</small>
              <strong className="mono">{chips.club.value}</strong>
            </span>
          </div>
          <div className="chip chip-c" aria-hidden>
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
