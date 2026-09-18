'use client';

import { useEffect, useState } from 'react';

export const STEPS = [
  { n: 1, title: 'Watch', desc: 'Reconstructs every swap from the traders you selected, joined to price history, in real time.' },
  { n: 2, title: 'Fire', desc: "Enters only when a pattern's conditions are met, sized the way the trader sizes their best setups." },
  { n: 3, title: 'Check', desc: 'Re-scores edge health in real time: strengthening, stable, weakening, decaying, dead.' },
  { n: 4, title: 'Retreat', desc: 'Cuts allocation as an edge weakens and exits before it dies. Depositors see why.' },
];

export const LOGS = [
  { ts: '09:42', step: 1, tag: 'Pattern fired', cls: 't-fire', msg: <><em>High-Conviction Dip Buyer</em> on wanderer: 28% pullback after a 3.1× run, recovery confirmed. Entered at <em>1.8× base size</em>.</> },
  { ts: '07:00', step: 2, tag: 'Health check', cls: 't-ok', msg: <><em>Selective Trader</em> on monk: stable. Last 30 occurrences inside historical range.</> },
  { ts: '03:15', step: 0, tag: 'Skipped', cls: 't-skip', msg: <>nightshift entered outside their session window. <em>Not the edge, not our trade.</em></> },
  { ts: '−1d', step: 3, tag: 'Edge weakening', cls: 't-warn', msg: <><em>Session Specialist</em> on nightshift: recent expectancy below range. Allocation reduced to <em>40%</em> until it recovers.</> },
];

export function useAgentCycle() {
  const [activeStep, setActiveStep] = useState(-1);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % (LOGS.length + 1);
      setShown(i);
      if (i > 0) setActiveStep(LOGS[i - 1].step);
    }, 1800);
    return () => clearInterval(id);
  }, []);
  return { activeStep, shown };
}

export function AgentSteps({ activeStep }: { activeStep: number }) {
  return (
    <div className="steps" id="steps">
      {STEPS.map((s, i) => (
        <div className={`step${activeStep === i ? ' on' : ''}`} key={s.n} data-step={i}>
          <span className="n">{s.n}</span>
          <span><b>{s.title}</b><p>{s.desc}</p></span>
        </div>
      ))}
    </div>
  );
}

export function AgentLog({ shown }: { shown: number }) {
  return (
    <div className="console rise d1" id="console">
      <div className="c-head"><span>agent · sample vault · last 24h</span><span className="live"><i />RUNNING</span></div>
      <div className="c-body">
        {LOGS.map((l, i) => (
          <div className={`logline${i < shown ? ' on' : ''}`} key={l.ts} data-step={l.step}>
            <span className="ts">{l.ts}</span>
            <span>
              <span className={`tag ${l.cls}`}><i />{l.tag}</span>
              <p className="msg">{l.msg}</p>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
