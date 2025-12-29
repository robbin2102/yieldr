'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PaymentPopup } from './components/PaymentPopup';
import { Providers } from './providers';

export default function HomePage() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Background canvas animation
    const canvas = document.getElementById('bgCanvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
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
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 200, 5, 0.35)';
        ctx.fill();
      }
    }

    const particles = Array.from({ length: 50 }, () => new Particle());

    function drawConnections() {
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawConnections();
      particles.forEach(p => {
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

  // Animated chat demo - EXACT match to HTML design
  useEffect(() => {
    const chatArea = document.getElementById('chatArea');
    if (!chatArea) return;

    function getTime() {
      const now = new Date();
      return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    }

    function addMessage(html: string, delay = 0): Promise<void> {
      return new Promise(resolve => {
        setTimeout(() => {
          const div = document.createElement('div');
          div.innerHTML = html;
          const element = div.firstElementChild;
          if (element && chatArea) {
            chatArea.appendChild(element);
            // Smooth scroll with small delay
            setTimeout(() => {
              chatArea.scrollTo({
                top: chatArea.scrollHeight,
                behavior: 'smooth'
              });
            }, 50);
          }
          resolve();
        }, delay);
      });
    }

    function addLog(text: string, isComplete = false, delay = 0): Promise<HTMLElement | null> {
      return new Promise(resolve => {
        setTimeout(() => {
          const log = document.createElement('div');
          log.className = 'agent-log';
          log.innerHTML = isComplete
            ? `<span class="log-check">✓</span><span>${text}</span>`
            : `<div class="log-spinner"></div><span>${text}</span>`;
          if (chatArea) {
            chatArea.appendChild(log);
            // Smooth scroll with small delay
            setTimeout(() => {
              chatArea.scrollTo({
                top: chatArea.scrollHeight,
                behavior: 'smooth'
              });
            }, 50);
          }
          resolve(log);
        }, delay);
      });
    }

    function removeElement(el: HTMLElement | null) {
      if (el && el.parentNode) el.remove();
    }

    async function runDemo() {
      const time = getTime();

      // Step 1: Agent scans wallet
      let log1 = await addLog('Connecting to wallet 0x7a3f...9c2e...', false, 800);
      await new Promise(r => setTimeout(r, 1200));
      removeElement(log1);
      await addLog('Wallet connected', true);

      let log2 = await addLog('Scanning token holdings...', false, 600);
      await new Promise(r => setTimeout(r, 1500));
      removeElement(log2);
      await addLog('Found 3 tokens', true);

      let log3 = await addLog('Scanning perpetual positions...', false, 600);
      await new Promise(r => setTimeout(r, 1500));
      removeElement(log3);
      await addLog('Found 1 position on Avantis', true);

      let log4 = await addLog('Scanning LP positions...', false, 600);
      await new Promise(r => setTimeout(r, 1500));
      removeElement(log4);
      await addLog('Found 1 LP on Aerodrome', true);

      await new Promise(r => setTimeout(r, 800));

      // Agent shows portfolio summary
      await addMessage(`
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
                <div class="summary-line">
                  <span class="token-tag"><span class="token-symbol" style="color:#FF0420;">OP</span> <span class="token-amount">4,827</span></span>
                  <span class="token-tag"><span class="token-symbol" style="color:#8B5CF6;">JESSE</span> <span class="token-amount">7,193</span></span>
                  <span class="token-tag"><span class="token-symbol" style="color:#627EEA;">WETH</span> <span class="token-amount">16.42</span></span>
                </div>

                <div class="position-row" style="margin-top: 0.5rem;">
                  <div class="position-left">
                    <span class="position-label">⚡ BTC/USDC SHORT 20×</span>
                    <span class="platform-tag avantis">Avantis</span>
                  </div>
                  <span class="value-positive">+$20,000</span>
                </div>
                <div class="summary-line" style="font-size: 0.75rem; color: var(--text-tertiary);">
                  Entry $100K → Now $90K • Margin $10K • ROI <span class="value-positive">+200%</span>
                </div>

                <div class="position-row" style="margin-top: 0.5rem;">
                  <div class="position-left">
                    <span class="position-label">💧 cbBTC/USDC LP</span>
                    <span class="platform-tag aerodrome">Aerodrome</span>
                  </div>
                  <span class="value-neutral">$250,000</span>
                </div>
                <div class="summary-line" style="font-size: 0.75rem; color: var(--text-tertiary);">
                  184.5% APR • Fees <span class="value-positive">+$5,790</span> • IL <span class="value-negative">-$12,908</span>
                </div>

                <div class="position-row" style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--border-primary);">
                  <span class="position-label">💵 Idle USDC</span>
                  <span class="value-neutral">$50,000</span>
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
      `);

      await new Promise(r => setTimeout(r, 3500));

      // User Q1: BTC Short
      await addMessage(`
        <div class="message message-user">
          <div class="bubble">Should I take profits on my BTC short? It's up 2000%</div>
        </div>
      `);

      await new Promise(r => setTimeout(r, 600));
      let logA1 = await addLog('Analyzing BTC market sentiment...', false);
      await new Promise(r => setTimeout(r, 1200));
      removeElement(logA1);
      let logA2 = await addLog('Checking what top traders are doing...', false);
      await new Promise(r => setTimeout(r, 1400));
      removeElement(logA2);
      await addLog('67% of top traders closing shorts', true);

      await new Promise(r => setTimeout(r, 600));

      await addMessage(`
        <div class="message message-agent">
          <div class="message-avatar agent">🤖</div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-sender">AlphaHunter</span>
              <span class="message-time">${time}</span>
            </div>
            <div class="message-text">
              <p><strong>✅ Yes, take partial profits.</strong></p>
              <div class="summary-line">
                Your <span class="value-positive">+$20K</span> gain is exceptional. <strong>67% of top traders</strong> are closing BTC shorts here.
              </div>
              <div class="position-summary" style="margin-top: 0.5rem;">
                <div class="position-row">
                  <span class="position-label">Recommendation</span>
                  <span class="value-positive">Close 50% → Lock $10K</span>
                </div>
                <div class="position-row">
                  <span class="position-label">Stop-loss on rest</span>
                  <span class="value-neutral">$95,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `);

      await new Promise(r => setTimeout(r, 3000));

      // User Q2: LP Hedge
      await addMessage(`
        <div class="message message-user">
          <div class="bubble">How do I reduce the impermanent loss on my cbBTC LP?</div>
        </div>
      `);

      await new Promise(r => setTimeout(r, 600));
      let logB1 = await addLog('Calculating LP delta exposure...', false);
      await new Promise(r => setTimeout(r, 1300));
      removeElement(logB1);
      let logB2 = await addLog('Finding optimal hedge ratio...', false);
      await new Promise(r => setTimeout(r, 1200));
      removeElement(logB2);
      await addLog('Delta-neutral strategy identified', true);

      await new Promise(r => setTimeout(r, 600));

      await addMessage(`
        <div class="message message-agent">
          <div class="message-avatar agent">🤖</div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-sender">AlphaHunter</span>
              <span class="message-time">${time}</span>
            </div>
            <div class="message-text">
              <p><strong>🛡️ Delta-Neutral Hedge Strategy</strong></p>
              <div class="summary-line">
                Current IL: <span class="value-negative">-$12,908</span> (BTC moved +15% since entry)
              </div>
              <div class="position-summary" style="margin-top: 0.5rem;">
                <div class="position-row">
                  <span class="position-label">Open BTC SHORT on</span>
                  <span class="platform-tag avantis">Avantis</span>
                </div>
                <div class="position-row">
                  <span class="position-label">Size: 0.65 BTC @ 5×</span>
                  <span class="value-neutral">$12K margin</span>
                </div>
                <div class="position-row">
                  <span class="position-label">Expected IL reduction</span>
                  <span class="value-positive">-65%</span>
                </div>
                <div class="position-row">
                  <span class="position-label">Net APR after hedge</span>
                  <span class="value-positive">~142%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `);

      await new Promise(r => setTimeout(r, 3000));

      // User Q3: ETH Long
      await addMessage(`
        <div class="message message-user">
          <div class="bubble">Fed rate cut next week. Should I open an ETH long?</div>
        </div>
      `);

      await new Promise(r => setTimeout(r, 600));
      let logC1 = await addLog('Fetching macro news & Fed expectations...', false);
      await new Promise(r => setTimeout(r, 1200));
      removeElement(logC1);
      let logC2 = await addLog('Analyzing ETH OI & funding rates...', false);
      await new Promise(r => setTimeout(r, 1300));
      removeElement(logC2);
      let logC3 = await addLog('Checking top trader ETH positions...', false);
      await new Promise(r => setTimeout(r, 1100));
      removeElement(logC3);
      await addLog('73% of top traders are long ETH', true);

      await new Promise(r => setTimeout(r, 600));

      await addMessage(`
        <div class="message message-agent">
          <div class="message-avatar agent">🤖</div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-sender">AlphaHunter</span>
              <span class="message-time">${time}</span>
            </div>
            <div class="message-text">
              <p><strong>🎯 ETH Long Setup Looks Good</strong></p>
              <div class="summary-line">
                <strong>73%</strong> of top traders are long • Funding: <span class="value-positive">-0.01%</span> (favorable)
              </div>
              <div class="position-summary" style="margin-top: 0.5rem;">
                <div class="position-row">
                  <span class="position-label">Entry Zone</span>
                  <span class="value-neutral">$3,450 - $3,500</span>
                </div>
                <div class="position-row">
                  <span class="position-label">Stop Loss</span>
                  <span class="value-negative">$3,280 (-5%)</span>
                </div>
                <div class="position-row">
                  <span class="position-label">Target</span>
                  <span class="value-positive">$4,100 (+18%)</span>
                </div>
                <div class="position-row">
                  <span class="position-label">Suggested size (from idle)</span>
                  <span class="value-neutral">$15,000</span>
                </div>
                <div class="position-row">
                  <span class="position-label">Risk/Reward</span>
                  <span class="value-positive">3.2:1 ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `);

      await new Promise(r => setTimeout(r, 3000));

      // User Q4: Allocate idle USDC
      await addMessage(`
        <div class="message message-user">
          <div class="bubble">Allocate my remaining 50K USDC across top 10 traders in perps, predictions, and LPs. Max 20% drawdown.</div>
        </div>
      `);

      await new Promise(r => setTimeout(r, 600));
      let logD1 = await addLog('Discovering traders across protocols...', false);
      await new Promise(r => setTimeout(r, 1500));
      removeElement(logD1);
      let logD2 = await addLog('Analyzing 847 traders...', false);
      await new Promise(r => setTimeout(r, 1400));
      removeElement(logD2);
      let logD3 = await addLog('Filtering by drawdown < 20%...', false);
      await new Promise(r => setTimeout(r, 1200));
      removeElement(logD3);
      let logD4 = await addLog('Optimizing allocation for Sharpe ratio...', false);
      await new Promise(r => setTimeout(r, 1300));
      removeElement(logD4);
      await addLog('30 traders meet criteria', true);

      await new Promise(r => setTimeout(r, 600));

      await addMessage(`
        <div class="message message-agent">
          <div class="message-avatar agent">🤖</div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-sender">AlphaHunter</span>
              <span class="message-time">${time}</span>
            </div>
            <div class="message-text">
              <p><strong>🔍 Discovery Complete</strong> — 847 traders scanned → 30 meet criteria</p>

              <div class="allocation-card">
                <div class="allocation-header">
                  <span>📊</span>
                  <span class="allocation-title">Optimized Allocation</span>
                </div>

                <div class="allocation-bars">
                  <div class="alloc-bar">
                    <div class="alloc-label">⚡ Perpetuals</div>
                    <div class="alloc-track">
                      <div class="alloc-fill perps" style="width: 40%;">40%</div>
                    </div>
                    <span class="alloc-amount">$20,000</span>
                  </div>
                  <div class="alloc-bar">
                    <div class="alloc-label">🎯 Prediction</div>
                    <div class="alloc-track">
                      <div class="alloc-fill pred" style="width: 30%;">30%</div>
                    </div>
                    <span class="alloc-amount">$15,000</span>
                  </div>
                  <div class="alloc-bar">
                    <div class="alloc-label">💧 Liquidity</div>
                    <div class="alloc-track">
                      <div class="alloc-fill lp" style="width: 30%;">30%</div>
                    </div>
                    <span class="alloc-amount">$15,000</span>
                  </div>
                </div>

                <div style="font-size: 0.7rem; color: var(--text-tertiary); margin-bottom: 0.5rem;">TOP PICKS</div>
                <div class="picks-row">
                  <div class="pick-chip">
                    <div class="pick-name">perp_alpha</div>
                    <div class="pick-platform">Avantis</div>
                    <div class="pick-roi">+47%</div>
                  </div>
                  <div class="pick-chip">
                    <div class="pick-name">poly_og</div>
                    <div class="pick-platform">Polymarket</div>
                    <div class="pick-roi">+52%</div>
                  </div>
                  <div class="pick-chip">
                    <div class="pick-name">aero_whale</div>
                    <div class="pick-platform">Aerodrome</div>
                    <div class="pick-roi">+38%</div>
                  </div>
                </div>

                <div class="summary-stats">
                  <div class="stat-item">
                    <div class="stat-value">42-67%</div>
                    <div class="stat-label">Est. Return</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">18.3% ✓</div>
                    <div class="stat-label">Max Drawdown</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">30</div>
                    <div class="stat-label">Traders</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `);
    }

    // Start demo after 1.2s
    setTimeout(runDemo, 1200);
  }, []);

  return (
    <Providers>
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
                id="chatInput"
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
            <p className="batches-subtitle">Yieldr was chosen as one of the winners of Base Batches 002, recognized for building innovative DeFi infrastructure on Base.</p>
          </div>
        </div>

        {/* Trust Section */}
        <div className="trust-section">
          <div className="trust-header">
            <h2 className="trust-title">Built Different</h2>
            <p className="trust-subtitle">Transparency, security, and performance at the core.</p>
          </div>
          <div className="trust-grid">
            <Link href="/build-in-public" className="trust-card">
              <div className="trust-icon">🔐</div>
              <h4>Treasury Public</h4>
              <p>All funds in multisig. Usage reported monthly. Full transparency.</p>
            </Link>
            <Link href="/build-in-public" className="trust-card">
              <div className="trust-icon">📊</div>
              <h4>Build in Public</h4>
              <p>Weekly updates on progress, code shipped, and milestones hit.</p>
            </Link>
            <Link href="/team" className="trust-card">
              <div className="trust-icon">👤</div>
              <h4>Based Builder</h4>
              <p>2x founder. Ex-KPMG, BCG, CA/CFA turned vibe coder.</p>
            </Link>
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
    </Providers>
  );
}
