'use client';

import { useEffect, useState } from 'react';

// A running simulation of what Quant Agent actually does — not a static
// screenshot of a chart. It types out like a live process, fills the
// three graded bars as it "computes" them, lands on a composite score,
// then resets and runs again — so the hero shows the product working
// rather than describing it.
const LINES = [
  { t: '$ yieldr scan --wallet 0x71c…9e4f', d: 900 },
  { t: '> indexing 293 trades across Base, Robinhood Chain…', d: 1100 },
  { t: '> grading entry timing vs. onchain liquidity depth…', d: 1000 },
  { t: '> grading exit discipline vs. realized drawdown…', d: 1000 },
  { t: '> grading position sizing vs. account risk…', d: 1000 },
  { t: '> composite edge score: 76 / 100 — STRONG EDGE', d: 1400 },
];

const BARS = [
  { label: 'Entry', pct: 25 },
  { label: 'Exit', pct: 40 },
  { label: 'Sizing', pct: 35 },
];

export default function ScanTerminal() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [barsOn, setBarsOn] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    setLineIdx(0); setCharIdx(0); setBarsOn(false);
    let cancelled = false;
    let lt = 0;

    async function run() {
      for (lt = 0; lt < LINES.length; lt++) {
        if (cancelled) return;
        const line = LINES[lt];
        for (let c = 0; c <= line.t.length; c++) {
          if (cancelled) return;
          setLineIdx(lt);
          setCharIdx(c);
          await new Promise((r) => setTimeout(r, 14));
        }
        if (lt === 1) setBarsOn(true);
        await new Promise((r) => setTimeout(r, line.d));
      }
      if (cancelled) return;
      await new Promise((r) => setTimeout(r, 2600));
      if (!cancelled) setCycle((c) => c + 1);
    }
    run();
    return () => { cancelled = true; };
  }, [cycle]);

  return (
    <div className="v3-term">
      <div className="v3-term-bar"><span /><span /><span /><b>quant-agent — scan</b></div>
      <div className="v3-term-body">
        {LINES.slice(0, lineIdx + 1).map((l, i) => (
          <div className="v3-term-line" key={i}>
            {i === lineIdx ? l.t.slice(0, charIdx) : l.t}
            {i === lineIdx && <span className="v3-cursor" />}
          </div>
        ))}
        <div className={`v3-term-bars${barsOn ? ' is-on' : ''}`}>
          {BARS.map((b) => (
            <div className="v3-term-bar-row" key={b.label}>
              <span>{b.label}</span>
              <div className="v3-term-bar-track"><div className="v3-term-bar-fill" style={{ width: barsOn ? `${b.pct * 2}%` : 0 }} /></div>
              <b>{b.pct}%</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
