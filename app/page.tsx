'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PaymentPopup } from '../components/PaymentPopup';

export default function HomePage() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Background canvas animation
    const canvas = document.getElementById('bgCanvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resizeCanvas() {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = document.documentElement.scrollHeight;
      }
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.radius = Math.random() * 1.5 + 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 200, 5, 0.35)';
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }

    function drawConnections() {
      if (!ctx) return;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 200, 5, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animateBg() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawConnections();
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateBg);
    }
    animateBg();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <>
      <canvas className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" id="bgCanvas" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 px-8 py-4 flex justify-between items-center z-[1000] bg-gradient-to-b from-black/95 via-black/90 to-transparent backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3">
          <svg className="w-9 h-9" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50 10 Q 70 30 80 60 Q 70 90 50 110 Q 30 90 20 60 Q 30 30 50 10 Z" fill="#00C805"/>
            <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000000" opacity="0.3"/>
            <circle cx="50" cy="60" r="8" fill="#FFFFFF" opacity="0.9"/>
          </svg>
          <span className="font-['JetBrains_Mono'] text-xl font-bold text-[#00C805] tracking-[0.1em]">
            YIELDR
          </span>
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/docs" target="_blank" className="text-[#A0A0A0] hover:text-[#00C805] text-sm font-medium transition-colors">
            Docs
          </Link>
          <Link href="/team" className="text-[#A0A0A0] hover:text-[#00C805] text-sm font-medium transition-colors">
            Team
          </Link>
          <Link href="/build-in-public" className="text-[#A0A0A0] hover:text-[#00C805] text-sm font-medium transition-colors">
            Build Progress
          </Link>
          <button
            onClick={() => setShowPopup(true)}
            className="bg-[#00C805] text-black px-5 py-2.5 rounded-md font-semibold text-sm hover:bg-[#00E006] hover:shadow-[0_4px_20px_rgba(0,200,5,0.4)] hover:-translate-y-px transition-all"
          >
            Get Early Access
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col pt-36 pb-8 px-8 z-[1]">
        <div className="text-center mb-6 pt-6">
          <h1 className="text-5xl font-extrabold leading-tight mb-3 tracking-tight">
            AI for DeFi's <span className="text-[#00C805]">Top 1%</span>
          </h1>
          <p className="text-[1.1rem] text-[#A0A0A0] max-w-[550px] mx-auto">
            Agents that level up traders, investors & fund managers onchain.
          </p>
        </div>

        {/* Demo Container */}
        <div className="flex-1 max-w-[900px] w-full mx-auto bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl overflow-hidden flex flex-col relative shadow-[0_0_80px_rgba(0,200,5,0.08)]">
          {/* Demo Header */}
          <div className="flex items-center justify-between px-5 py-3 bg-[#111111] border-b border-[#1A1A1A]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00C805] to-[#0088FF] rounded-lg flex items-center justify-center text-base">
                🤖
              </div>
              <div>
                <h3 className="text-sm font-semibold">AlphaHunter</h3>
                <div className="flex items-center gap-1.5 text-[0.7rem] text-[#666666]">
                  <div className="w-1.5 h-1.5 bg-[#00C805] rounded-full" />
                  <span>AI Trading Agent</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[rgba(0,200,5,0.15)] border border-[rgba(0,200,5,0.3)] px-2.5 py-1 rounded text-[0.65rem] font-bold text-[#00C805] uppercase tracking-wider">
                <div className="w-1.5 h-1.5 bg-[#00C805] rounded-full animate-pulse" />
                <span>Live Demo</span>
              </div>
              <div className="font-['JetBrains_Mono'] text-[0.7rem] text-[#666666] bg-[#0A0A0A] px-2.5 py-1.5 rounded border border-[#1A1A1A]">
                0x7a3f...9c2e
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4 min-h-[480px] max-h-[520px]">
            {/* Demo messages would go here - simplified for now */}
            <div className="flex gap-2.5">
              <div className="w-[26px] h-[26px] rounded-md bg-gradient-to-br from-[#00C805] to-[#0088FF] flex items-center justify-center text-sm flex-shrink-0">
                🤖
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm font-semibold">AlphaHunter</span>
                  <span className="font-['JetBrains_Mono'] text-[0.6rem] text-[#666666]">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="text-[0.85rem] text-[#A0A0A0] leading-relaxed">
                  <p>👋 <strong className="text-white">Hey! I've scanned your wallet. Here's your portfolio:</strong></p>
                  <div className="bg-[#111111] border border-[#1A1A1A] rounded-lg p-3 mt-2">
                    <div className="flex justify-between py-2">
                      <span className="text-[#A0A0A0]">💰 Tokens</span>
                      <span className="font-['JetBrains_Mono'] font-semibold">$87,340</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-[#A0A0A0]">⚡ BTC SHORT 20×</span>
                      <span className="font-['JetBrains_Mono'] font-semibold text-[#00C805]">+$200,000</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-[#A0A0A0]">💧 cbBTC/USDC LP</span>
                      <span className="font-['JetBrains_Mono'] font-semibold">$250,000</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-[#1A1A1A] mt-2 pt-2">
                      <span className="text-white font-semibold">📊 Total Portfolio</span>
                      <span className="font-['JetBrains_Mono'] font-bold text-[#00C805]">$587,340</span>
                    </div>
                  </div>
                  <p className="mt-3">I'm now monitoring your positions. What would you like to optimize?</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-[#1A1A1A] bg-[#111111] px-4 py-3">
            <div className="flex gap-2.5">
              <input
                type="text"
                readOnly
                onClick={() => setShowPopup(true)}
                placeholder="Try asking about positions, traders, or strategies..."
                className="flex-1 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#00C805] transition-colors placeholder-[#666666] cursor-pointer"
              />
              <button
                onClick={() => setShowPopup(true)}
                className="w-10 h-10 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg text-[#A0A0A0] hover:bg-[#00C805] hover:border-[#00C805] hover:text-black transition-all flex items-center justify-center"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Below Fold */}
      <section className="relative z-[1] py-16 px-8">
        {/* Base Batches */}
        <div className="max-w-[700px] mx-auto mb-16 text-center">
          <div className="bg-gradient-to-br from-[rgba(0,82,255,0.1)] to-[rgba(0,200,5,0.05)] border border-[rgba(0,82,255,0.3)] rounded-2xl p-8">
            <div className="inline-flex items-center gap-2 bg-[rgba(0,82,255,0.2)] border border-[rgba(0,82,255,0.4)] px-4 py-2 rounded-full text-sm font-semibold text-[#0052FF] mb-4">
              <span>🏆</span>
              <span>BASE BATCHES 002 WINNER</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Selected by Base Ecosystem</h2>
            <p className="text-[#A0A0A0]">
              Yieldr was chosen as one of the winners of Base Batches 002, recognized for building innovative DeFi infrastructure on Base.
            </p>
          </div>
        </div>

        {/* Trust Section */}
        <div className="max-w-[900px] mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Built Different</h2>
            <p className="text-[#A0A0A0]">Transparency, security, and performance at the core.</p>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {[
              { icon: '🔐', title: 'Treasury Public', desc: 'All funds in multisig. Usage reported monthly. Full transparency.' },
              { icon: '📊', title: 'Build in Public', desc: 'Weekly updates on progress, code shipped, and milestones hit.' },
              { icon: '👤', title: 'Based Builder', desc: '2x founder. Ex-KPMG, BCG, CA/CFA turned vibe coder.' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-5 text-center hover:border-[#00C805] hover:-translate-y-0.5 transition-all"
              >
                <div className="w-11 h-11 mx-auto mb-3 bg-[rgba(0,200,5,0.15)] rounded-xl flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <h4 className="text-[0.95rem] font-semibold mb-1.5">{item.title}</h4>
                <p className="text-sm text-[#A0A0A0] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Partners */}
        <div className="max-w-[900px] mx-auto text-center">
          <div className="text-xs text-[#666666] uppercase tracking-[0.1em] mb-5">Building with</div>
          <div className="flex justify-center items-center gap-12 flex-wrap">
            {[
              { src: 'https://b22290bb4d42a7d0d0d796b264519fb5.cdn.bubble.io/f1760730551690x161831425309488800/_base-square%20%282%29.svg', alt: 'Base' },
              { src: 'https://b22290bb4d42a7d0d0d796b264519fb5.cdn.bubble.io/f1760735602576x626366481309788300/Avantis%20White%20Logo%20-%20Vertical.png', alt: 'Avantis' },
              { src: 'https://b22290bb4d42a7d0d0d796b264519fb5.cdn.bubble.io/f1760731058931x165828739392198200/aero.png', alt: 'Aerodrome' },
              { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Uniswap_Logo.svg/1200px-Uniswap_Logo.svg.png', alt: 'Uniswap' },
              { src: 'https://nftevening.com/wp-content/uploads/2025/03/hyperliquid-logo.png', alt: 'Hyperliquid' },
              { src: 'https://avatars.githubusercontent.com/u/31669764?s=280&v=4', alt: 'Polymarket' },
            ].map((partner, i) => (
              <div key={i} className="h-10 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                <img src={partner.src} alt={partner.alt} className="h-10 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Popup */}
      <PaymentPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </>
  );
}
