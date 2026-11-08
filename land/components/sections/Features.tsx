import { CloudSun, Snowflake, SquaresFour, Warehouse } from '@phosphor-icons/react/dist/ssr';

import { FACTS, FEATURES, SCREENS } from '@/lib/site';

import { PhoneFrame } from '../PhoneFrame';
import { Reveal } from '../Reveal';

const CHIP_ICONS = [SquaresFour, Snowflake, Warehouse, CloudSun];

export function Facts() {
  return (
    <section className="facts" aria-label="أرقام من التطبيق">
      <div className="container facts-row">
        {FACTS.map((fact) => (
          <div key={fact.label} className="fact">
            <span className="mono">{fact.value}</span>
            <span>{fact.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Bento: two tall phone cells, then two short cells with real app controls. */
export function Features() {
  const { discover, book, filters, durations } = FEATURES;
  return (
    <section className="section" id="features">
      <div className="container">
        <Reveal>
          <h2 className="section-title">{FEATURES.title}</h2>
        </Reveal>

        <div className="bento">
          <Reveal className="cell cell-tall cell-a">
            <h3>{discover.title}</h3>
            <p>{discover.body}</p>
            <div className="cell-phone">
              <PhoneFrame src={SCREENS.club} alt={discover.screenAlt} sizes="300px" />
            </div>
          </Reveal>

          <Reveal className="cell cell-tall cell-b" delay={0.08}>
            <h3>{book.title}</h3>
            <p>{book.body}</p>
            <div className="cell-phone">
              <PhoneFrame src={SCREENS.booking} alt={book.screenAlt} sizes="270px" />
            </div>
          </Reveal>

          <Reveal className="cell cell-c">
            <h3>{filters.title}</h3>
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

          <Reveal className="cell cell-d" delay={0.08}>
            <h3>{durations.title}</h3>
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
        </div>
      </div>
    </section>
  );
}
