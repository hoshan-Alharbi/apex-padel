import { SCREENS, SPLIT } from '@/lib/site';

import { SplitDemo } from '../motion';
import { PhoneFrame } from '../PhoneFrame';
import { Reveal } from '../Reveal';

/** The page's centrepiece: full-bleed, no box, live countdown and players paying in turn. */
export function Split() {
  return (
    <section className="section split-section" id="split">
      <div className="split-aura" aria-hidden />
      <div className="container split-inner">
        <Reveal>
          <h2 className="display split-title">{SPLIT.title}</h2>
          <p className="split-body">{SPLIT.body}</p>
        </Reveal>
        <SplitDemo
          players={SPLIT.players}
          startSeconds={SPLIT.startSeconds}
          labels={{ timer: SPLIT.timer, paid: SPLIT.paid, waiting: SPLIT.waiting, collected: SPLIT.collected, complete: SPLIT.complete }}
        >
          <Reveal variant="phone">
            <PhoneFrame src={SCREENS.split} alt={SPLIT.screenAlt} sizes="310px" />
          </Reveal>
        </SplitDemo>
      </div>
    </section>
  );
}
