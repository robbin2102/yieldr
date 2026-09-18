'use client';

import { useEffect, useRef } from 'react';

export type Pattern = {
  id: string; name: string; kind: string; edge?: number; occ?: number; tok?: number;
  health?: string; risk?: boolean; by: string; desc: string;
};

export const PATTERNS: Pattern[] = [
  { id: 'dip', name: 'High-Conviction Dip Buyer', kind: 'Entry · Sizing', edge: 8.6, occ: 86, tok: 63, health: 'Stable', by: 'wanderer', desc: 'Buys 20–35% pullbacks after strong runs and sizes the strongest setups above normal.' },
  { id: 'brk', name: 'Breakout Retest Buyer', kind: 'Entry', edge: 7.8, occ: 54, tok: 41, health: 'Strengthening', by: 'monk', desc: 'Waits for the retest instead of the breakout, then enters on confirmation.' },
  { id: 'cut', name: 'Fast Loss Cutter', kind: 'Exit', edge: 7.4, occ: 210, tok: 97, health: 'Stable', by: 'wanderer', desc: 'Exits losers early and without exception. The discipline itself is the edge.' },
  { id: 'peak', name: 'Peak Capturer', kind: 'Exit', edge: 8.1, occ: 71, tok: 52, health: 'Stable', by: 'nightshift', desc: 'Scales out into strength near local highs rather than riding the round trip.' },
  { id: 'sel', name: 'Selective Trader', kind: 'Behaviour', edge: 7.9, occ: 132, tok: 78, health: 'Stable', by: 'monk', desc: 'Sits out far more than they trade. What they skip is as consistent as what they take.' },
  { id: 'conv', name: 'Calibrated Conviction', kind: 'Sizing', edge: 8.3, occ: 39, tok: 30, health: 'Strengthening', by: 'monk', desc: 'Size tracks their actual hit rate. Bigger bets really are the better ones.' },
  { id: 'sess', name: 'Session Specialist', kind: 'Timing', edge: 6.9, occ: 88, tok: 60, health: 'Weakening', by: 'nightshift', desc: 'Wins inside one session window and gives it back outside of it.' },
  { id: 'tilt', name: 'Post-Loss Tilt', kind: 'Risk flag', risk: true, by: 'wanderer', desc: 'Sizes up immediately after a loss. Excluded from every vault automatically.' },
  { id: 'over', name: 'Overtrader', kind: 'Risk flag', risk: true, by: 'nightshift', desc: 'Trade count climbs as edge falls. Excluded from every vault automatically.' },
];

// Simplified stand-in for the source design's nine distinct generative
// growth-form algorithms (phyllotaxis, branching, murmuration, growth
// rings, tides, crystals...). This ports one shared procedural sparkline
// driven by the pattern's own occurrence count instead of nine bespoke
// ones — an intentional scope cut, flagged as a follow-up if wanted.
function Spark({ p, active }: { p: Pattern; active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const r = cv.getBoundingClientRect();
    const d = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d);
    const c = cv.getContext('2d')!;
    c.setTransform(d, 0, 0, d, 0, 0);
    const w = r.width, h = r.height;
    c.clearRect(0, 0, w, h);
    let seed = p.id.charCodeAt(0) * 97 + p.id.length;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const n = p.risk ? 18 : Math.min(60, (p.occ ?? 40));
    const base = p.risk ? 'rgba(179,58,43,' : active ? 'rgba(244,241,232,' : 'rgba(23,163,92,';
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const x = 6 + t * (w - 12);
      const jitter = p.risk ? (rnd() - 0.5) * h * 0.8 : Math.sin(t * Math.PI * (2 + (p.tok ?? 20) / 40)) * (h * 0.32);
      const y = h / 2 + jitter + (rnd() - 0.5) * 4;
      c.beginPath(); c.arc(x, y, p.risk ? 1.4 : 1.1 + (i / n) * 0.8, 0, Math.PI * 2);
      c.fillStyle = base + (0.35 + 0.5 * (i / n)) + ')';
      c.fill();
    }
  }, [p, active]);
  return <canvas ref={ref} className="spark" aria-hidden="true" />;
}

export default function PatternLibrary({ selected, onToggle }: { selected: Set<string>; onToggle: (id: string) => void }) {
  return (
    <div className="lib-grid" id="libGrid">
      {PATTERNS.map((p) => {
        const active = selected.has(p.id);
        if (p.risk) {
          return (
            <div className="pcard risk" key={p.id}>
              <div className="p-top"><div className="p-name">{p.name}</div></div>
              <div className="p-kind">{p.kind}</div>
              <Spark p={p} active={false} />
              <div className="p-flag">⚠ Excluded automatically</div>
            </div>
          );
        }
        return (
          <button className="pcard" key={p.id} aria-pressed={active} onClick={() => onToggle(p.id)}>
            <div className="p-top">
              <div className="p-name">{p.name}</div>
              <div className="p-num">{p.edge}<small>/10</small></div>
            </div>
            <div className="p-kind">{p.kind} · by {p.by}</div>
            <Spark p={p} active={active} />
            <div className="p-meta"><span>{p.occ} occ.</span><span>{p.tok} tokens</span></div>
          </button>
        );
      })}
    </div>
  );
}
