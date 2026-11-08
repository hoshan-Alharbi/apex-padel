import { CheckCircle, HourglassMedium } from '@phosphor-icons/react/dist/ssr';

import { SCREENS, SPLIT } from '@/lib/site';

import { PhoneFrame } from '../PhoneFrame';
import { Reveal } from '../Reveal';

export function Split() {
  const [start, end] = [SPLIT.players.slice(0, 2), SPLIT.players.slice(2)];
  return (
    <section className="section" id="split">
      <div className="container">
        <Reveal className="split-panel">
          <h2>{SPLIT.title}</h2>
          <p>{SPLIT.body}</p>
          <div className="timer">
            <small>{SPLIT.timer}</small>
            <span className="mono">44:04</span>
            <span className="progress">{SPLIT.progress}</span>
          </div>
          <div className="split-stage">
            <div className="split-side start">
              {start.map((p) => (
                <Player key={p.name} {...p} />
              ))}
            </div>
            <PhoneFrame src={SCREENS.split} alt={SPLIT.screenAlt} sizes="310px" />
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
    <div className={`player ${paid ? '' : 'waiting'}`}>
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
