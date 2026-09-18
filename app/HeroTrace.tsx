'use client';

import { useEffect, useRef } from 'react';

// Ported faithfully from the source design: a deterministic seeded random
// so every visitor sees the same "evidence", a synthetic price series, and
// a set of swaps where dip-buys (entries into a >11% pullback after a run)
// are marked as "the pattern" and animated in as the reader scrolls to it.
function makeRng(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export default function HeroTrace() {
  const cvRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rnd = makeRng(42);

    const price = Array.from({ length: 200 }, (_, i) => {
      const t = i / 199;
      return 0.5 + 0.3 * Math.sin(t * 7.1) + 0.16 * Math.sin(t * 17.3 + 1.2) + 0.22 * t + (rnd() - 0.5) * 0.05;
    });
    const swaps = Array.from({ length: 64 }, (_, i) => ({ i, dip: false, x: 0, p: 0 }));
    swaps.forEach((s) => { s.x = rnd(); s.p = price[Math.round(s.x * 199)]; });
    swaps.sort((a, b) => a.x - b.x);
    swaps.forEach((s, i) => {
      const j = Math.round(s.x * 199);
      const prior = price.slice(Math.max(0, j - 26), j);
      const peak = Math.max(...prior, s.p);
      s.dip = prior.length > 8 && (peak - s.p) / peak > 0.11 && i % 2 === 0;
    });

    let traceP = reduced ? 1 : 0;
    let traceHover = -1;

    function fit() {
      const el = cv as HTMLCanvasElement;
      const r = el.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(r.width * d);
      el.height = Math.round(r.height * d);
      const ctx = el.getContext('2d')!;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      return { c: ctx, w: r.width, h: r.height };
    }

    function draw() {
      const { c, w, h } = fit();
      const padL = 14, padR = 14, padT = 18, padB = 18;
      const X = (t: number) => padL + t * (w - padL - padR);
      const lo = Math.min(...price), hi = Math.max(...price);
      const Y = (p: number) => padT + (1 - (p - lo) / (hi - lo)) * (h - padT - padB);
      c.clearRect(0, 0, w, h);
      const shown = Math.round(price.length * traceP);

      const grad = c.createLinearGradient(0, padT, 0, h);
      grad.addColorStop(0, 'rgba(167,176,196,.22)'); grad.addColorStop(1, 'rgba(167,176,196,0)');
      c.beginPath(); c.moveTo(X(0), Y(price[0]));
      for (let i = 1; i < shown; i++) c.lineTo(X(i / 199), Y(price[i]));
      c.strokeStyle = 'rgba(167,176,196,.5)'; c.lineWidth = 1.25; c.stroke();
      if (shown > 1) { c.lineTo(X((shown - 1) / 199), h); c.lineTo(X(0), h); c.closePath(); c.fillStyle = grad; c.fill(); }

      swaps.forEach((s, k) => {
        if (s.x > traceP) return;
        const x = X(s.x), y = Y(s.p), on = k === traceHover;
        if (!s.dip) {
          c.beginPath(); c.arc(x, y, on ? 3.4 : 2.2, 0, Math.PI * 2);
          c.fillStyle = on ? 'rgba(238,241,247,.9)' : 'rgba(167,176,196,.42)'; c.fill();
        }
      });
      const dips = swaps.filter((s) => s.dip && s.x <= traceP);
      if (dips.length > 1) {
        c.beginPath();
        dips.forEach((s, i) => (i ? c.lineTo(X(s.x), Y(s.p)) : c.moveTo(X(s.x), Y(s.p))));
        c.strokeStyle = 'rgba(61,220,132,.28)'; c.lineWidth = 1; c.setLineDash([3, 4]); c.stroke(); c.setLineDash([]);
      }
      dips.forEach((s) => {
        const x = X(s.x), y = Y(s.p);
        c.beginPath(); c.arc(x, y, 7.5, 0, Math.PI * 2); c.fillStyle = 'rgba(61,220,132,.14)'; c.fill();
        c.beginPath(); c.arc(x, y, 3.6, 0, Math.PI * 2); c.fillStyle = '#3DDC84'; c.fill();
      });
      c.font = '500 10px ui-monospace,monospace'; c.fillStyle = 'rgba(97,107,133,.9)';
      c.fillText(dips.length + ' pattern entries · ' + swaps.filter((s) => s.x <= traceP).length + ' swaps read', padL, h - 5);
    }

    const io = new IntersectionObserver((es, ob) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      ob.unobserve(e.target);
      if (reduced) return draw();
      const t0 = performance.now();
      const step = (t: number) => {
        traceP = Math.max(0, Math.min(1, (t - t0) / 1500));
        draw();
        if (traceP < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), { threshold: 0.25 });
    io.observe(cv);

    function onMove(e: PointerEvent) {
      const r = cv!.getBoundingClientRect();
      const t = (e.clientX - r.left - 14) / (r.width - 28);
      let best = -1, bd = 1;
      swaps.forEach((s, k) => { const d = Math.abs(s.x - t); if (d < bd) { bd = d; best = k; } });
      traceHover = bd < 0.03 ? best : -1;
      draw();
    }
    function onLeave() { traceHover = -1; draw(); }
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', draw);

    return () => {
      io.disconnect();
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', draw);
    };
  }, []);

  return <canvas id="traceCv" ref={cvRef} aria-label="Swaps by a sample wallet plotted over price history; repeated dip entries resolve into one named pattern" />;
}
