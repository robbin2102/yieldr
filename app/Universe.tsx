'use client';

import { useEffect, useRef } from 'react';

// Ported faithfully from the source design's "Emergence" engine: one field
// of 1,400 points (one per swap Yieldr reads) that never resets. Scrolling
// re-forms it through eight named worlds via 3D projection in canvas 2D —
// singularity, galaxy, seed head, the equity curve itself, a helix, a tree,
// a constellation, a horizon. Progress lags the scroll (momentum, not a
// snap), and each point arrives slightly out of step with the others.
export default function Universe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const c = cv;
    const cx2d = ctx;

    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const TAU = Math.PI * 2;
    const PHI = Math.PI * (3 - Math.sqrt(5));

    const MOBILE = window.innerWidth < 700;
    const N = MOBILE ? 460 : 1400;
    let seed = 9301;
    const rand = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
    const R = Array.from({ length: N * 4 + 64 }, rand);

    type Vec3 = [number, number, number];
    const FORMS: Array<(i: number, o: Vec3) => void> = [
      (i, o) => { const a = R[i] * TAU, b = R[i + N] * Math.PI, r = 0.13 + R[i + N * 2] * 0.09;
        o[0] = Math.sin(b) * Math.cos(a) * r; o[1] = Math.cos(b) * r; o[2] = Math.sin(b) * Math.sin(a) * r; },
      (i, o) => { const arm = i % 3, t = Math.pow(R[i], 0.62), a = t * 5.2 + (arm * TAU) / 3 + R[i + N] * 0.34;
        const r = 0.12 + t * 0.82; o[0] = Math.cos(a) * r; o[2] = Math.sin(a) * r;
        o[1] = (R[i + N * 2] - 0.5) * 0.13 * (1 - t * 0.5); },
      (i, o) => { const a = i * PHI, r = Math.sqrt(i / N) * 0.92;
        o[0] = Math.cos(a) * r; o[1] = Math.sin(a) * r * 0.72; o[2] = (R[i] - 0.5) * 0.05; },
      (i, o) => { const t = i / N, x = t * 1.9 - 0.95;
        const y = -0.52 + Math.pow(t, 0.82) * 0.92 + Math.sin(t * 21) * 0.035;
        o[0] = x; o[1] = -y + (R[i] - 0.5) * 0.07 * (1 - t * 0.6); o[2] = (R[i + N] - 0.5) * 0.16; },
      (i, o) => { const t = i / N, strand = i % 2, a = t * 13 + strand * Math.PI;
        o[0] = Math.cos(a) * 0.34; o[2] = Math.sin(a) * 0.34; o[1] = t * 1.8 - 0.9; },
      (i, o) => { let x = 0, y = -0.92, a = -Math.PI / 2, len = 0.34, k = i;
        for (let d = 0; d < 5; d++) { const turn = (k % 2 ? 0.46 : -0.5) + (R[i + d * 7] - 0.5) * 0.2;
          a += turn * (d ? 1 : 0.18); x += Math.cos(a) * len; y += Math.sin(a) * len; len *= 0.68; k = (k / 2) | 0; }
        o[0] = x; o[1] = y + 0.5; o[2] = (R[i + N] - 0.5) * 0.42; },
      (i, o) => { const cn = i % 9, ca = (cn / 9) * TAU, cr = 0.62;
        o[0] = Math.cos(ca) * cr + (R[i] - 0.5) * 0.26; o[1] = Math.sin(ca) * cr * 0.6 + (R[i + N] - 0.5) * 0.24;
        o[2] = (R[i + N * 2] - 0.5) * 0.5; },
      (i, o) => { o[0] = (R[i] - 0.5) * 2.3; o[1] = 0.34 + (R[i + N] - 0.5) * 0.07; o[2] = (R[i + N * 2] - 0.5) * 1.1; },
    ];
    const ANCHOR: Array<[number, number]> = [
      [0.5, 0.8], [0.54, 0.48], [0.55, 0.48], [0.5, 0.52],
      [0.78, 0.5], [0.3, 0.56], [0.54, 0.48], [0.5, 0.44],
    ];
    const TINT: Array<[number, number, number]> = [
      [61, 220, 132], [150, 170, 220], [61, 220, 132], [61, 220, 132],
      [157, 140, 255], [245, 196, 107], [91, 224, 216], [61, 220, 132],
    ];

    const pos = new Float32Array(N * 3);
    const a3: Vec3 = [0, 0, 0], b3: Vec3 = [0, 0, 0], o3: Vec3 = [0, 0, 0];
    let prog = 0, targetProg = 0, rotY = 0;
    let px = 0, py = 0, W = 0, H = 0, DPR = 1, seeded = false;

    function size() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      c.width = Math.round(W * DPR); c.height = Math.round(H * DPR);
      cx2d.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function sample(p: number, i: number, out: Vec3) {
      const span = FORMS.length - 1;
      const f = clamp(p, 0, 1) * span;
      const lag = ((i * 37) % 101) / 101 * 0.55;
      const local = clamp((f - Math.floor(f)) * (1 + lag) - lag, 0, 1);
      const i0 = clamp(Math.floor(f), 0, span), i1 = clamp(i0 + 1, 0, span);
      FORMS[i0](i, a3); FORMS[i1](i, b3);
      const t = smooth(local);
      out[0] = a3[0] + (b3[0] - a3[0]) * t;
      out[1] = a3[1] + (b3[1] - a3[1]) * t;
      out[2] = a3[2] + (b3[2] - a3[2]) * t;
    }

    function draw() {
      cx2d.clearRect(0, 0, W, H);
      const scale = Math.min(W, H) * (MOBILE ? 0.46 : 0.43);
      const cos = Math.cos(rotY), sin = Math.sin(rotY);
      const tilt = 0.52 + prog * 0.16;
      const cosX = Math.cos(tilt), sinX = Math.sin(tilt);
      const span = FORMS.length - 1;
      const f = clamp(prog, 0, 1) * span, i0 = clamp(Math.floor(f), 0, span);
      const mix = f - i0, c0 = TINT[i0], c1 = TINT[clamp(i0 + 1, 0, span)];
      const a0 = ANCHOR[i0], a1 = ANCHOR[clamp(i0 + 1, 0, span)];
      const ax = a0[0] + (a1[0] - a0[0]) * mix, ay = a0[1] + (a1[1] - a0[1]) * mix;
      const centerX = W * (MOBILE ? 0.5 : ax) + px * 26, centerY = H * ay + py * 18;
      const cr = (c0[0] + (c1[0] - c0[0]) * mix) | 0;
      const cg = (c0[1] + (c1[1] - c0[1]) * mix) | 0;
      const cb = (c0[2] + (c1[2] - c0[2]) * mix) | 0;
      for (let i = 0; i < N; i++) {
        sample(prog, i, o3);
        const k = i * 3;
        if (!seeded) { pos[k] = o3[0]; pos[k + 1] = o3[1]; pos[k + 2] = o3[2]; }
        else {
          pos[k] += (o3[0] - pos[k]) * 0.14;
          pos[k + 1] += (o3[1] - pos[k + 1]) * 0.14;
          pos[k + 2] += (o3[2] - pos[k + 2]) * 0.14;
        }
        const x0 = pos[k], y0 = pos[k + 1], z0 = pos[k + 2];
        const xr = x0 * cos - z0 * sin, z1 = x0 * sin + z0 * cos;
        const yr = y0 * cosX - z1 * sinX, zr = y0 * sinX + z1 * cosX;
        const depth = 2.6 / (2.6 + zr);
        const sx = centerX + xr * scale * depth, sy = centerY + yr * scale * depth;
        if (sx < -30 || sx > W + 30 || sy < -30 || sy > H + 30) continue;
        const r = (MOBILE ? 1.15 : 1.35) * depth * (0.55 + R[i + N * 3] * 0.95);
        const alpha = clamp((depth - 0.5) * 1.15, 0.1, 1) * (0.34 + R[i] * 0.66);
        cx2d.beginPath(); cx2d.arc(sx, sy, r, 0, TAU);
        cx2d.fillStyle = `rgba(${cr},${cg},${cb},${alpha.toFixed(3)})`;
        cx2d.fill();
      }
      seeded = true;
    }

    function readScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      targetProg = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    }
    function onResize() { size(); readScroll(); draw(); }
    function onMove(e: PointerEvent) {
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
    }

    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });

    size();
    readScroll();
    let raf = 0;
    if (RM) {
      prog = targetProg;
      draw();
    } else {
      let last = 0;
      const frame = (t: number) => {
        prog += (targetProg - prog) * 0.075;
        rotY = prog * 2.4 + px * 0.22;
        if (t - last > 15) { draw(); last = t; }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas id="universe" ref={ref} aria-hidden="true" />;
}
