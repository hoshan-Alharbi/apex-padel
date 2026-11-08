import { AndroidLogo, AppleLogo, CalendarCheck, MagnifyingGlass, UsersThree } from '@phosphor-icons/react/dist/ssr';

import { DOWNLOAD, HERO, SCREENS, STEPS } from '@/lib/site';

import { PhoneFrame } from '../PhoneFrame';
import { Reveal } from '../Reveal';

const STEP_ICONS = [MagnifyingGlass, CalendarCheck, UsersThree];

export function Steps() {
  return (
    <section className="section" id="how">
      <div className="container">
        <Reveal>
          <h2 className="section-title">{STEPS.title}</h2>
        </Reveal>
        <div className="steps">
          {STEPS.items.map((step, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <Reveal key={step.title} className="step" delay={i * 0.08}>
                <span className="step-icon" aria-hidden>
                  <Icon size={26} weight="bold" />
                </span>
                <h3>{step.title}</h3>
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
          <div>
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
          </div>
          <div className="fan">
            <PhoneFrame src={SCREENS.home} alt={HERO.screenAlt} className="fan-back" sizes="250px" />
            <PhoneFrame src={SCREENS.pass} alt={DOWNLOAD.screenAlt} className="fan-front" sizes="250px" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
