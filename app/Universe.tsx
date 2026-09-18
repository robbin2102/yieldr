'use client';

import { useEffect, useRef } from 'react';

// Simplified stand-in for the source design's 8-world morphing particle
// field (singularity → galaxy → seed head → equity curve → helix → tree →
// constellation → horizon). Full fidelity is a large standalone 3D canvas
// engine — this ports the same idea (one persistent field of points behind
// every section, an "edge" green glow, gentle parallax drift) without the
// per-scroll-position shape morphing, which is a separate follow-up.
export default function Universe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const c = canvas;
    const cx = ctx;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0, h = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
    let scrollT = 0;

    type P = { x: number; y: number; z: number; vx: number; vy: number };
    let points: P[] = [];

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      c.style.width = w + 'px';
      c.style.height = h + 'px';
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(420, Math.floor((w * h) / 3800));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.3 + Math.random() * 0.7,
        vx: (Math.random() - 0.5) * 0.06,
        vy: (Math.random() - 0.5) * 0.06,
      }));
    }

    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollT = max > 0 ? window.scrollY / max : 0;
    }

    let raf = 0;
    function tick(t: number) {
      cx.clearRect(0, 0, w, h);
      const drift = reduced ? 0 : 1;
      const parY = (scrollT - 0.5) * 40;
      for (const p of points) {
        p.x += p.vx * drift;
        p.y += p.vy * drift;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        const y = p.y + parY * p.z;
        const glow = 0.4 + 0.3 * Math.sin(t / 1800 + p.x * 0.01);
        cx.beginPath();
        cx.arc(p.x, y, 0.7 + p.z * 1.1, 0, Math.PI * 2);
        cx.fillStyle = `rgba(61,220,132,${0.08 + glow * 0.14 * p.z})`;
        cx.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    resize();
    onScroll();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return <canvas id="universe" ref={ref} aria-hidden="true" />;
}
