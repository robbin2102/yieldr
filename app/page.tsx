'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PaymentPopup } from './components/PaymentPopup';

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

  // Simple demo message
  useEffect(() => {
    const chatArea = document.getElementById('chatArea');
    if (!chatArea) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    chatArea.innerHTML = `
      <div class="message message-agent">
        <div class="message-avatar agent">🤖</div>
        <div class="message-content">
          <div class="message-header">
            <span class="message-sender">AlphaHunter</span>
            <span class="message-time">${time}</span>
          </div>
          <div class="message-text">
            <p>👋 <strong>Hey! I've scanned your wallet. Here's your portfolio:</strong></p>
            <div class="position-summary">
              <div class="position-row">
                <span class="position-label">💰 Tokens</span>
                <span class="value-neutral">$87,340</span>
              </div>
              <div class="position-row">
                <span class="position-label">⚡ BTC SHORT 20×</span>
                <span class="value-positive">+$200,000</span>
              </div>
              <div class="position-row">
                <span class="position-label">💧 cbBTC/USDC LP</span>
                <span class="value-neutral">$250,000</span>
              </div>
              <div class="position-row" style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--border-primary);">
                <span class="position-label"><strong>📊 Total Portfolio</strong></span>
                <span class="value-positive" style="font-size: 1rem;"><strong>$587,340</strong></span>
              </div>
            </div>
            <p style="margin-top: 0.75rem;">I'm now monitoring your positions. What would you like to optimize?</p>
          </div>
        </div>
      </div>
    `;
  }, []);

  return (
    <>
      <canvas className="bg-canvas" id="bgCanvas" />

      {/* Navigation */}
      <nav className="top-nav">
        <Link href="/" className="nav-logo">
          <svg className="logo-icon" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50 10 Q 70 30 80 60 Q 70 90 50 110 Q 30 90 20 60 Q 30 30 50 10 Z" fill="#00C805"/>
            <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000000" opacity="0.3"/>
            <circle cx="50" cy="60" r="8" fill="#FFFFFF" opacity="0.9"/>
          </svg>
          <span className="logo-text">YIELDR</span>
        </Link>
        <div className="nav-links">
          <Link href="/docs" className="nav-link">Docs</Link>
          <Link href="/team" className="nav-link">Team</Link>
          <Link href="/build-in-public" className="nav-link">Build Progress</Link>
          <button className="nav-cta" onClick={() => setShowPopup(true)}>Get Early Access</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-header">
          <h1 className="hero-title">AI for DeFi's <span className="accent">Top 1%</span></h1>
          <p className="hero-subtitle">Agents that level up traders, investors & fund managers onchain.</p>
        </div>

        {/* Demo Container */}
        <div className="demo-container">
          <div className="demo-header">
            <div className="demo-header-left">
              <div className="agent-avatar">🤖</div>
              <div className="agent-info">
                <h3>AlphaHunter</h3>
                <div className="agent-status">
                  <span className="status-dot"></span>
                  <span>AI Trading Agent</span>
                </div>
              </div>
            </div>
            <div className="demo-header-right">
              <div className="live-badge">
                <span className="live-dot"></span>
                <span>Live Demo</span>
              </div>
              <div className="wallet-chip">0x7a3f...9c2e</div>
            </div>
          </div>

          <div className="chat-area" id="chatArea"></div>

          <div className="chat-input-area">
            <div className="input-wrapper">
              <input
                type="text"
                className="chat-input"
                placeholder="Try asking about positions, traders, or strategies..."
                onClick={() => setShowPopup(true)}
                readOnly
              />
              <button className="send-btn" onClick={() => setShowPopup(true)}>➤</button>
            </div>
          </div>
        </div>
      </section>

      {/* Below Fold */}
      <section className="below-fold">
        {/* Base Batches Recognition */}
        <div className="batches-section">
          <div className="batches-card">
            <div className="batches-badge">
              <span>🏆</span>
              <span>BASE BATCHES 002 WINNER</span>
            </div>
            <h2 className="batches-title">Selected by Base Ecosystem</h2>
            <p className="batches-subtitle">
              Yieldr was chosen as one of the winners of Base Batches 002, recognized for building innovative DeFi infrastructure on Base.
            </p>
          </div>
        </div>

        {/* Trust Section */}
        <div className="trust-section">
          <div className="trust-header">
            <h2 className="trust-title">Built Different</h2>
            <p className="trust-subtitle">Transparency, security, and performance at the core.</p>
          </div>
          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-icon">🔐</div>
              <h4>Treasury Public</h4>
              <p>All funds in multisig. Usage reported monthly. Full transparency.</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">📊</div>
              <h4>Build in Public</h4>
              <p>Weekly updates on progress, code shipped, and milestones hit.</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">👤</div>
              <h4>Based Builder</h4>
              <p>2x founder. Ex-KPMG, BCG, CA/CFA turned vibe coder.</p>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="partners-section">
          <div className="partners-label">Building with</div>
          <div className="partners-logos">
            <div className="partner-logo">
              <img src="https://b22290bb4d42a7d0d0d796b264519fb5.cdn.bubble.io/f1760730551690x161831425309488800/_base-square%20%282%29.svg" alt="Base" />
            </div>
            <div className="partner-logo">
              <img src="https://b22290bb4d42a7d0d0d796b264519fb5.cdn.bubble.io/f1760735602576x626366481309788300/Avantis%20White%20Logo%20-%20Vertical.png" alt="Avantis" />
            </div>
            <div className="partner-logo">
              <img src="https://b22290bb4d42a7d0d0d796b264519fb5.cdn.bubble.io/f1760731058931x165828739392198200/aero.png" alt="Aerodrome" />
            </div>
            <div className="partner-logo">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Uniswap_Logo.svg/1200px-Uniswap_Logo.svg.png" alt="Uniswap" />
            </div>
            <div className="partner-logo">
              <img src="https://nftevening.com/wp-content/uploads/2025/03/hyperliquid-logo.png" alt="Hyperliquid" />
            </div>
            <div className="partner-logo">
              <img src="https://avatars.githubusercontent.com/u/31669764?s=280&v=4" alt="Polymarket" />
            </div>
          </div>
        </div>
      </section>

      {/* Payment Popup */}
      <PaymentPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </>
  );
}
