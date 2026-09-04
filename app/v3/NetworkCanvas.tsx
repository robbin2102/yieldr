'use client';

import { useEffect, useRef } from 'react';

// A live particle network — each node is a "wallet", faint lines are
// candidate matches, and nodes occasionally pulse and snap a hard line
// to their nearest neighbor ("matched"). This is the actual thing the
// product does (matching edge to capital), rendered as ambient motion
// rather than a decorative blob unrelated to what the page is about.
export default function NetworkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const c = canvas;
    const cx = ctx;

    let w = 0, h = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
    const mouse = { x: -9999, y: -9999 };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    type Node = { x: number; y: number; vx: number; vy: number; r: number; pulse: number; matched: number };
    let nodes: Node[] = [];

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      c.style.width = w + 'px';
      c.style.height = h + 'px';
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(90, Math.floor((w * h) / 18000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 1 + Math.random() * 1.6,
        pulse: Math.random() * Math.PI * 2,
        matched: Math.random() < 0.12 ? 1 : 0,
      }));
    }

    function onMove(e: MouseEvent) { mouse.x = e.clientX; mouse.y = e.clientY; }
    function onLeave() { mouse.x = -9999; mouse.y = -9999; }

    let raf = 0;
    function tick(t: number) {
      cx.clearRect(0, 0, w, h);
      const linkDist = Math.min(150, w / 8);

      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx; n.y += n.vy;
          const dx = n.x - mouse.x, dy = n.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < 120) { n.x += (dx / (d || 1)) * 0.6; n.y += (dy / (d || 1)) * 0.6; }
          if (n.x < 0) n.x = w; if (n.x > w) n.x = 0;
          if (n.y < 0) n.y = h; if (n.y > h) n.y = 0;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < linkDist) {
            const alpha = (1 - d / linkDist) * (a.matched || b.matched ? 0.5 : 0.1);
            cx.strokeStyle = `rgba(107,196,122,${alpha})`;
            cx.lineWidth = a.matched || b.matched ? 1 : 0.6;
            cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const glow = 0.5 + 0.5 * Math.sin(t / 900 + n.pulse);
        cx.beginPath();
        cx.arc(n.x, n.y, n.r * (n.matched ? 1.6 : 1), 0, Math.PI * 2);
        cx.fillStyle = n.matched ? `rgba(143,224,156,${0.5 + glow * 0.5})` : `rgba(163,166,150,${0.35 + glow * 0.2})`;
        cx.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} className="v3-canvas" aria-hidden="true" />;
}
