import {
  AndroidLogo,
  AppleLogo,
  CalendarBlank,
  CheckCircle,
  HourglassMedium,
  MapPin,
  ShoppingBagOpen,
  Snowflake,
  Star,
  Timer,
} from '@phosphor-icons/react/dist/ssr';
import type { ComponentType } from 'react';

import { BOOK, DISCOVER, DOWNLOAD, FEATURES_TITLE, FOOTER, HERO, NAV, SCREENS, SITE, SPLIT } from '@/lib/site';

import { Logo } from './Logo';
import { PhoneMockup } from './PhoneMockup';
import { Reveal } from './Reveal';

type Icon = ComponentType<{ size?: number; weight?: 'regular' | 'bold' | 'fill' | 'duotone' }>;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <a href="#top" className="brand" aria-label={SITE.name}>
          <Logo size={30} />
          <span>{SITE.name}</span>
          <span className="brand-latin">{SITE.nameLatin.toUpperCase()}</span>
        </a>
        <nav className="site-nav" aria-label="الرئيسية">
          <a href="#features" className="nav-link">
            {NAV.features}
          </a>
          <a href="#download" className="btn btn-primary btn-small">
            {NAV.download}
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero-copy">
          <span className="eyebrow">{HERO.eyebrow}</span>
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
          <div className="glow" aria-hidden />
          <div className="tilt">
            <PhoneMockup src={SCREENS.home} alt={HERO.screenAlt} priority />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureRow({
  title,
  body,
  points,
  icons,
  screen,
  alt,
  reverse = false,
}: {
  title: string;
  body: string;
  points: string[];
  icons: Icon[];
  screen: string;
  alt: string;
  reverse?: boolean;
}) {
  return (
    <div className={`feature-row ${reverse ? 'reverse' : ''}`}>
      <Reveal className="feature-text">
        <h3>{title}</h3>
        <p>{body}</p>
        <ul className="points">
          {points.map((point, i) => {
            const PointIcon = icons[i];
            return (
              <li key={point}>
                <span className="point-icon" aria-hidden>
                  <PointIcon size={20} weight="bold" />
                </span>
                {point}
              </li>
            );
          })}
        </ul>
      </Reveal>
      <Reveal className="feature-visual" delay={0.1}>
        <PhoneMockup src={screen} alt={alt} />
      </Reveal>
    </div>
  );
}

export function Features() {
  const [start, end] = [SPLIT.players.slice(0, 2), SPLIT.players.slice(2)];
  return (
    <section className="section" id="features">
      <div className="container">
        <Reveal>
          <h2 className="section-title">{FEATURES_TITLE}</h2>
        </Reveal>

        <div className="features">
          <FeatureRow {...DISCOVER} icons={[MapPin, Snowflake, Star]} screen={SCREENS.club} alt={DISCOVER.screenAlt} />
          <FeatureRow {...BOOK} icons={[CalendarBlank, Timer, ShoppingBagOpen]} screen={SCREENS.booking} alt={BOOK.screenAlt} reverse />
        </div>

        <Reveal className="split-panel">
          <h3>{SPLIT.title}</h3>
          <p>{SPLIT.body}</p>
          <div className="timer">
            <small>{SPLIT.timer}</small>
            <span className="mono">44:04</span>
          </div>
          <div className="split-stage">
            <div className="split-side start">
              {start.map((p) => (
                <Player key={p.name} {...p} />
              ))}
            </div>
            <PhoneMockup src={SCREENS.split} alt={SPLIT.screenAlt} />
            <div className="split-side end">
              {end.map((p) => (
                <Player key={p.name} {...p} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Player({ name, amount, paid }: { name: string; amount: string; paid: boolean }) {
  return (
    <div className="player">
      <span className={`avatar ${paid ? 'paid' : 'waiting'}`} aria-hidden>
        {name.slice(0, 1)}
      </span>
      <span>
        <span className="player-name">{name}</span>
        <span className="player-amount">{amount}</span>
      </span>
      <span className={`player-status ${paid ? 'paid' : 'waiting'}`}>
        {paid ? <CheckCircle size={18} weight="fill" /> : <HourglassMedium size={18} weight="bold" />}
        {paid ? SPLIT.paid : SPLIT.waiting}
      </span>
    </div>
  );
}

export function Download() {
  return (
    <section className="section" id="download">
      <div className="container download">
        <Reveal className="download-visual">
          <div className="glow" aria-hidden />
          <PhoneMockup src={SCREENS.pass} alt={DOWNLOAD.screenAlt} />
        </Reveal>
        <Reveal className="download-text" delay={0.1}>
          <h2>{DOWNLOAD.title}</h2>
          <p>{DOWNLOAD.body}</p>
          {/* Generic buttons (no store badges): the app isn't published. */}
          <div className="store-buttons">
            <a href="#download" className="btn btn-primary store-btn">
              <AppleLogo size={24} weight="fill" />
              {DOWNLOAD.ios}
            </a>
            <a href="#download" className="btn btn-ghost store-btn">
              <AndroidLogo size={24} weight="fill" />
              {DOWNLOAD.android}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-row">
          <a href="#top" className="brand">
            <Logo size={28} />
            <span>{SITE.name}</span>
          </a>
          <nav className="footer-links" aria-label="روابط الصفحة">
            <a href="#features">{NAV.features}</a>
            <a href="#download">{NAV.download}</a>
          </nav>
        </div>
        <div className="footer-meta">
          <span>{FOOTER.rights}</span>
          <span>{FOOTER.disclaimer}</span>
        </div>
      </div>
    </footer>
  );
}
