'use client';

import { useEffect, useRef, useState } from 'react';

function makeRng(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const TOGGLES = [
  { key: 'best', label: 'Remove the best trade', hint: 'Delete the single biggest winner from the record.' },
  { key: 'top5', label: 'Remove the top 5%', hint: 'Strip every outlier that could carry the result.' },
  { key: 'cross', label: 'Hold out 63 tokens', hint: 'Re-run the pattern on tokens it was never fitted to.' },
  { key: 'unseen', label: 'Unseen trades only', hint: 'Score it forward, on trades it has never met.' },
] as const;
type TestKey = (typeof TOGGLES)[number]['key'];

export default function LabDemo() {
  const curveRef = useRef<HTMLCanvasElement>(null);
  const [tests, setTests] = useState<Record<TestKey, boolean>>({ best: false, top5: false, cross: false, unseen: false });
  const [hoverI, setHoverI] = useState(-1);
  const [readout, setReadout] = useState<{ x: number; y: number; html: string } | null>(null);
  const dataRef = useRef<{ trades: { i: number; v: number; tok: number; late: boolean }[]; others: number[]; baseFinal: number } | null>(null);

  if (!dataRef.current) {
    const rnd = makeRng(7);
    const N = 108;
    const trades = Array.from({ length: N }, (_, i) => {
      const base = 0.52 + (rnd() - 0.4) * 1.15;
      const spike = rnd() > 0.95 ? 2.4 + rnd() * 3.1 : 0;
      return { i, v: base + spike, tok: Math.floor(rnd() * 97), late: i / N > 0.6 };
    });
    const others = Array.from({ length: N }, () => (rnd() - 0.52) * 1.25);
    dataRef.current = { trades, others, baseFinal: trades.reduce((s, t) => s + t.v, 0) };
  }
  const { trades, others, baseFinal } = dataRef.current;
  const N = trades.length;

  function removedSet() {
    const rm = new Set<number>();
    const byVal = [...trades].sort((a, b) => b.v - a.v);
    if (tests.best) rm.add(byVal[0].i);
    if (tests.top5) byVal.slice(0, Math.ceil(N * 0.05)).forEach((t) => rm.add(t.i));
    if (tests.cross) trades.forEach((t) => { if (t.tok < 34) rm.add(t.i); });
    if (tests.unseen) trades.forEach((t) => { if (!t.late) rm.add(t.i); });
    return rm;
  }
  function series() {
    const rm = removedSet();
    let a = 0, b = 0;
    const pat: number[] = [], oth: number[] = [];
    trades.forEach((t, i) => {
      if (!rm.has(t.i)) a += t.v;
      b += others[i];
      pat.push(a); oth.push(b);
    });
    return { pat, oth, rm };
  }

  function draw() {
    const cv = curveRef.current;
    if (!cv) return;
    const r = cv.getBoundingClientRect();
    const d = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d);
    const c = cv.getContext('2d')!;
    c.setTransform(d, 0, 0, d, 0, 0);
    const w = r.width, h = r.height;
    const padL = 6, padR = 6, padT = 14, padB = 22;
    const { pat, oth, rm } = series();
    const hi = Math.max(baseFinal, ...pat) * 1.06, lo = Math.min(0, ...oth) * 1.35 - 1;
    const X = (i: number) => padL + (i / (N - 1)) * (w - padL - padR);
    const Y = (v: number) => padT + (1 - (v - lo) / (hi - lo)) * (h - padT - padB);
    c.clearRect(0, 0, w, h);

    c.beginPath(); c.moveTo(padL, Y(0)); c.lineTo(w - padR, Y(0));
    c.strokeStyle = 'rgba(238,241,247,.13)'; c.lineWidth = 1; c.stroke();

    if (rm.size) {
      let g = 0; c.beginPath();
      trades.forEach((t, i) => { g += t.v; i ? c.lineTo(X(i), Y(g)) : c.moveTo(X(i), Y(g)); });
      c.strokeStyle = 'rgba(255,122,107,.42)'; c.lineWidth = 1.25; c.setLineDash([4, 5]); c.stroke(); c.setLineDash([]);
    }
    c.beginPath(); oth.forEach((v, i) => (i ? c.lineTo(X(i), Y(v)) : c.moveTo(X(i), Y(v))));
    c.strokeStyle = 'rgba(140,150,175,.95)'; c.lineWidth = 1.5; c.stroke();

    const fill = c.createLinearGradient(0, padT, 0, h - padB);
    fill.addColorStop(0, 'rgba(61,220,132,.24)'); fill.addColorStop(1, 'rgba(61,220,132,0)');
    c.beginPath(); pat.forEach((v, i) => (i ? c.lineTo(X(i), Y(v)) : c.moveTo(X(i), Y(v))));
    c.strokeStyle = '#3DDC84'; c.lineWidth = 2; c.lineJoin = 'round'; c.stroke();
    c.lineTo(X(N - 1), Y(0)); c.lineTo(X(0), Y(0)); c.closePath(); c.fillStyle = fill; c.fill();

    trades.forEach((t, i) => {
      if (!rm.has(t.i)) return;
      c.beginPath(); c.moveTo(X(i), Y(0) - 4); c.lineTo(X(i), Y(0) + 4);
      c.strokeStyle = 'rgba(255,122,107,.6)'; c.lineWidth = 1; c.stroke();
    });
    if (hoverI >= 0) {
      c.beginPath(); c.moveTo(X(hoverI), padT); c.lineTo(X(hoverI), h - padB);
      c.strokeStyle = 'rgba(238,241,247,.22)'; c.lineWidth = 1; c.stroke();
      c.beginPath(); c.arc(X(hoverI), Y(pat[hoverI]), 4, 0, Math.PI * 2);
      c.fillStyle = rm.has(trades[hoverI].i) ? '#FF7A6B' : '#3DDC84'; c.fill();
    }
    c.font = '500 10px ui-monospace,monospace'; c.fillStyle = 'rgba(97,107,133,.9)';
    c.fillText('TRADE 1', padL, h - 6);
    c.fillText('TRADE ' + N, w - padR - 52, h - 6);
    return { pat, rm };
  }

  useEffect(() => { draw(); window.addEventListener('resize', draw); return () => window.removeEventListener('resize', draw); });

  const on = Object.values(tests).filter(Boolean).length;
  const { pat, rm } = series();
  const kept = N - rm.size;
  const ratio = kept ? (pat[N - 1] / kept) / (baseFinal / N) : 0;
  const score = Math.max(0, Math.min(10, 8.6 * (0.34 + 0.66 * ratio)));
  const occ = Math.round(86 * (N - rm.size) / N);
  const toks = tests.cross ? 41 : 63;
  const luck = on === 0 ? 'Unknown' : score >= 7.4 ? 'Low' : score >= 6 ? 'Moderate' : 'High';

  let verdictVal = 'Untested', verdictNote = 'Turn on a test. This is what most dashboards never show you.', dead = false;
  if (on === 4 && score >= 7.4) { verdictVal = 'Selected'; verdictNote = 'Stripped of its outliers, moved to tokens it was never fitted to, and scored only on trades it has never seen — the curve still climbs. That is an edge.'; }
  else if (on > 0 && score >= 7.4) { verdictVal = 'Survives'; verdictNote = 'The shape holds without its crutches. Keep going — an edge should survive all four.'; }
  else if (on > 0 && score >= 6) { verdictVal = 'Weakened'; verdictNote = 'Still standing, but leaning on fewer trades. Yieldr would mark this edge health "weakening".'; }
  else if (on > 0) { verdictVal = 'It was luck'; verdictNote = 'Remove the outliers and nothing is left. This never becomes a vault.'; dead = true; }

  return (
    <div className="lab-panel rise d1">
      <div className="lab-ctl">
        <h3>Break the edge</h3>
        <p className="hint">Every switch removes a crutch. What is left standing has been selected for, not fitted.</p>
        {TOGGLES.map((tg) => (
          <button
            key={tg.key}
            className="tog"
            aria-pressed={tests[tg.key]}
            onClick={() => setTests((s) => ({ ...s, [tg.key]: !s[tg.key] }))}
          >
            <span className="box"><svg viewBox="0 0 12 12" fill="none"><path d="M2 6.2 4.6 8.8 10 3.4" stroke="#04240F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            <span><b>{tg.label}</b><span>{tg.hint}</span></span>
          </button>
        ))}
        <div className={`verdict${dead ? ' dead' : ''}`}>
          <div className="v-lab">Verdict</div>
          <div className="v-val">{verdictVal}</div>
          <div className="v-note">{verdictNote}</div>
        </div>
      </div>
      <div className="lab-view">
        <div className="vtop">
          <span className="t">High-Conviction Dip Buyer <small>SAMPLE WALLET · CUMULATIVE EDGE OVER ITS OWN ORDINARY ENTRIES</small></span>
          <span className="legend">
            <span><i style={{ background: 'var(--edge)' }} />Pattern trades</span>
            <span><i style={{ background: 'var(--ink-3)' }} />All other trades</span>
            <span><i style={{ background: 'var(--ember)' }} />Removed</span>
          </span>
        </div>
        <canvas
          id="curveCv"
          ref={curveRef}
          aria-label="Cumulative edge curve under the selected robustness tests"
          onPointerMove={(e) => {
            const cv = curveRef.current!;
            const r = cv.getBoundingClientRect();
            const i = Math.max(0, Math.min(N - 1, Math.round(((e.clientX - r.left - 6) / (r.width - 12)) * (N - 1))));
            setHoverI(i);
            const t = trades[i], gone = rm.has(t.i);
            const html = `<b>Trade ${i + 1}</b> <span class="r-dim">of ${N}</span><br>`
              + `<span class="r-dim">result</span> ${t.v >= 0 ? '+' : ''}${t.v.toFixed(2)}R<br>`
              + `<span class="r-dim">cumulative</span> ${pat[i].toFixed(1)}R<br>`
              + (gone ? '<span style="color:#FF7A6B">removed by test</span>' : '<span class="r-dim">counted</span>');
            const host = cv.parentElement!.getBoundingClientRect();
            setReadout({
              x: Math.max(8, Math.min(host.width - 150, e.clientX - host.left + 14)),
              y: Math.max(8, Math.min(host.height - 96, e.clientY - host.top - 10)),
              html,
            });
          }}
          onPointerLeave={() => { setHoverI(-1); setReadout(null); }}
        />
        {readout && <div className="readout on" style={{ left: readout.x, top: readout.y }} dangerouslySetInnerHTML={{ __html: readout.html }} />}
        <div className="statrow">
          <div><div className="k">Edge strength</div><div className={`v ${score >= 7.4 ? 'good' : score >= 6 ? 'warn' : 'bad'}`}>{score.toFixed(1)}</div></div>
          <div><div className="k">Occurrences</div><div className="v">{occ}</div></div>
          <div><div className="k">Token breadth</div><div className="v">{toks}</div></div>
          <div><div className="k">Luck risk</div><div className={`v ${on === 0 ? '' : luck === 'Low' ? 'good' : luck === 'Moderate' ? 'warn' : 'bad'}`}>{luck}</div></div>
        </div>
      </div>
    </div>
  );
}
