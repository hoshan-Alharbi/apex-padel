import { CloudSun, Snowflake, SquaresFour, Warehouse } from '@phosphor-icons/react/dist/ssr';

import { CITIES, FACTS, FEATURES, SCREENS } from '@/lib/site';

import { CourtLines } from '../CourtLines';
import { CountUp, SpotlightGrid } from '../motion';
import { PhoneFrame } from '../PhoneFrame';
import { Reveal } from '../Reveal';

const CHIP_ICONS = [SquaresFour, Snowflake, Warehouse, CloudSun];

/** Full volt band with dark text: the page's one colour block. Numbers count up when seen. */
export function Facts() {
  return (
    <section className="facts" aria-label="أرقام من التطبيق">
      <div className="container facts-row">
        {FACTS.map((fact) => (
          <div key={fact.label} className="fact">
            <CountUp value={fact.value} />
            <span className="fact-label">{fact.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Bento on a faint court-lines background; cards light up under the pointer. */
export function Features() {
  const { discover, book, filters, durations } = FEATURES;
  return (
    <section className="section features-section" id="features">
      <CourtLines className="section-court" />
      <div className="container">
        <Reveal>
          <h2 className="section-title display">{FEATURES.title}</h2>
        </Reveal>

        <SpotlightGrid className="bento">
          <Reveal className="cell cell-tall cell-a">
            <h3 className="display">{discover.title}</h3>
            <p>{discover.body}</p>
            <div className="cell-phone">
              <PhoneFrame src={SCREENS.club} alt={discover.screenAlt} sizes="300px" />
            </div>
          </Reveal>

          <Reveal className="cell cell-tall cell-b" delay={0.08}>
            <h3 className="display">{book.title}</h3>
            <p>{book.body}</p>
            <div className="cell-phone">
              <PhoneFrame src={SCREENS.booking} alt={book.screenAlt} sizes="270px" />
            </div>
          </Reveal>

          <Reveal className="cell cell-c" delay={0.04}>
            <h3 className="display">{filters.title}</h3>
            <p>{filters.body}</p>
            <div className="mini-chips" aria-hidden>
              {filters.chips.map((label, i) => {
                const Icon = CHIP_ICONS[i];
                return (
                  <span key={label} className={`mini-chip ${i === 0 ? 'active' : ''}`}>
                    <Icon size={18} weight="bold" />
                    {label}
                  </span>
                );
              })}
            </div>
          </Reveal>

          <Reveal className="cell cell-d" delay={0.12}>
            <h3 className="display">{durations.title}</h3>
            <div className="durations" aria-hidden>
              {durations.items.map((d) => (
                <div key={d.mins} className={`duration ${d.active ? 'active' : ''}`}>
                  {d.active && <span className="duration-tag">موصى به</span>}
                  <span className="mins">
                    <span className="mono">{d.mins}</span>
                    <span className="unit">{durations.unit}</span>
                  </span>
                  <small>{d.hint}</small>
                  <span className="price">
                    <span className="mono">{d.price}</span>
                    <span>{durations.currency}</span>
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </SpotlightGrid>
      </div>
    </section>
  );
}

/** Big translucent city names scrolling sideways (CSS only, paused under reduced motion). */
export function Marquee() {
  const row = [...CITIES, ...CITIES];
  return (
    <section className="marquee" aria-label={CITIES.join('، ')}>
      <div className="marquee-track" aria-hidden>
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee-group">
            {row.map((city, i) => (
              <span key={`${copy}-${i}`} className="marquee-item display">
                {city}
                <span className="marquee-dot" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
