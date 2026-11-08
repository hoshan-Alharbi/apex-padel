import { AndroidLogo, AppleLogo, CalendarCheck, MagnifyingGlass, UsersThree } from '@phosphor-icons/react/dist/ssr';

import { DOWNLOAD, HERO, SCREENS, STEPS } from '@/lib/site';

import { CourtLines } from '../CourtLines';
import { PhoneFrame } from '../PhoneFrame';
import { Reveal } from '../Reveal';

const STEP_ICONS = [MagnifyingGlass, CalendarCheck, UsersThree];

export function Steps() {
  return (
    <section className="section steps-section" id="how">
      <CourtLines className="section-court" />
      <div className="container">
        <Reveal>
          <h2 className="section-title display">{STEPS.title}</h2>
        </Reveal>
        <div className="steps">
          {STEPS.items.map((step, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <Reveal key={step.title} className="step" delay={i * 0.1}>
                <span className="step-icon" aria-hidden>
                  <Icon size={26} weight="bold" />
                </span>
                <h3 className="display">{step.title}</h3>
                <p>{step.body}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Download() {
  return (
    <section className="section" id="download">
      <div className="container">
        <Reveal className="download-panel">
          <div className="download-copy">
            <h2 className="display">{DOWNLOAD.title}</h2>
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
          </div>
          <div className="fan">
            <div className="fan-glow" aria-hidden />
            <Reveal variant="phone" className="fan-back" delay={0.1}>
              <PhoneFrame src={SCREENS.home} alt={HERO.screenAlt} sizes="250px" />
            </Reveal>
            <Reveal variant="phone" className="fan-front" delay={0.22}>
              <PhoneFrame src={SCREENS.pass} alt={DOWNLOAD.screenAlt} sizes="250px" />
            </Reveal>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
