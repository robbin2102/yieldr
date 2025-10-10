// app/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Network animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    class Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
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
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
      }
    }

    const nodes: Node[] = [];
    const nodeCount = 50;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(
        new Node(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        )
      );
    }

    function drawConnections() {
      if (!ctx) return;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    let animationId: number;

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawConnections();
      nodes.forEach((node) => {
        node.update();
        node.draw();
      });
      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('✓ You\'re on the waitlist!');
        setEmail('');
      } else {
        setStatus(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('Network error. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          color: #e0e0e0;
          overflow-x: hidden;
          background: #000000;
        }

        .background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background: radial-gradient(circle at 20% 50%, rgba(20, 20, 40, 0.4), transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(30, 30, 60, 0.3), transparent 50%),
                      #000000;
        }

        .network-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          position: relative;
          z-index: 1;
        }

        .hero-content {
          max-width: 800px;
          text-align: center;
          position: relative;
        }

        .logo-container {
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .logo-svg {
          width: 100px;
          height: 100px;
          filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
          animation: logoFloat 3s ease-in-out infinite;
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .logo-svg circle {
          animation: nodePulse 2s ease-in-out infinite;
        }

        .logo-svg circle:nth-child(1) { animation-delay: 0s; }
        .logo-svg circle:nth-child(2) { animation-delay: 0.3s; }
        .logo-svg circle:nth-child(3) { animation-delay: 0.6s; }
        .logo-svg circle:nth-child(4) { animation-delay: 0.9s; }

        @keyframes nodePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .logo-text {
          font-size: 3rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.15em;
          position: relative;
        }

        .logo-text::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ffffff, transparent);
        }

        h1 {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 2rem;
          line-height: 1.2;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .problem-solution {
          margin-bottom: 3rem;
          line-height: 1.8;
        }

        .problem {
          font-size: 1.3rem;
          color: #ff6b6b;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .solution {
          font-size: 1.3rem;
          color: #4ecdc4;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .description {
          font-size: 1.1rem;
          color: #b0b0b0;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .blackrock-callout {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 30px;
          font-size: 0.95rem;
          color: #ffffff;
          margin-bottom: 3rem;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
        }

        .cta-form {
          display: flex;
          gap: 1rem;
          max-width: 550px;
          margin: 0 auto 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .email-input {
          flex: 1;
          min-width: 300px;
          padding: 1.2rem 1.8rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(20, 20, 20, 0.8);
          color: white;
          font-size: 1rem;
          backdrop-filter: blur(10px);
          transition: all 0.3s;
        }

        .email-input:focus {
          outline: none;
          border-color: #ffffff;
          background: rgba(30, 30, 30, 0.9);
        }

        .email-input::placeholder {
          color: #666;
        }

        .cta-button {
          padding: 1.2rem 3rem;
          border-radius: 8px;
          border: none;
          background: #ffffff;
          color: #000000;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(255, 255, 255, 0.3);
        }

        .cta-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .status-message {
          text-align: center;
          font-size: 0.95rem;
          min-height: 24px;
          margin-top: 1rem;
        }

        .status-success {
          color: #4ecdc4;
        }

        .status-error {
          color: #ff6b6b;
        }

        .partners {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem;
          background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.9));
          z-index: 2;
        }

        .partners-content {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .partners-label {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .partners-logos {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .partner-logo {
          opacity: 0.6;
          transition: opacity 0.3s;
          font-size: 1.2rem;
          color: #ffffff;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .partner-logo:hover {
          opacity: 1;
        }

        .base-circle {
          width: 24px;
          height: 24px;
          background: #0052FF;
          border-radius: 50%;
          display: inline-block;
        }

        @media (max-width: 768px) {
          .logo-svg {
            width: 70px;
            height: 70px;
          }

          .logo-text {
            font-size: 2rem;
          }

          h1 {
            font-size: 2.2rem;
          }

          .problem, .solution {
            font-size: 1.1rem;
          }

          .description {
            font-size: 1rem;
          }

          .cta-form {
            flex-direction: column;
          }

          .email-input {
            min-width: 100%;
          }

          .partners-logos {
            gap: 1.5rem;
          }

          .partner-logo {
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="background"></div>
      <canvas ref={canvasRef} className="network-canvas"></canvas>

      <section className="hero">
        <div className="hero-content">
          <div className="logo-container">
            <svg className="logo-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="20" r="8" fill="#ffffff"/>
              <circle cx="30" cy="60" r="6" fill="#ffffff"/>
              <circle cx="90" cy="60" r="6" fill="#ffffff"/>
              <circle cx="60" cy="100" r="8" fill="#ffffff"/>
              <line x1="60" y1="20" x2="30" y2="60" stroke="#ffffff" strokeWidth="2" opacity="0.6"/>
              <line x1="60" y1="20" x2="90" y2="60" stroke="#ffffff" strokeWidth="2" opacity="0.6"/>
              <line x1="30" y1="60" x2="60" y2="100" stroke="#ffffff" strokeWidth="2" opacity="0.6"/>
              <line x1="90" y1="60" x2="60" y2="100" stroke="#ffffff" strokeWidth="2" opacity="0.6"/>
            </svg>
            
            <div className="logo-text">YIELDR</div>
          </div>
          
          <h1>Decentralized Asset Management</h1>
          
          <div className="problem-solution">
            <p className="problem">
              95% of crypto traders and investors lose money.
            </p>
            <p className="solution">
              They don't have access to the top 5% of asset managers.
            </p>
          </div>

          <p className="description">
            Yieldr connects you with verified crypto asset managers through transparent, on-chain performance tracking and smart contract-powered copy trading. Discover top performers, invest alongside them, and keep full custody of your funds.
          </p>

          <div className="blackrock-callout">
            Taking on BlackRock, one smart contract at a time.
          </div>

          <form className="cta-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="email-input"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="cta-button" disabled={isLoading}>
              {isLoading ? 'Joining...' : 'Join Waitlist'}
            </button>
          </form>
          {status && (
            <div className={`status-message ${status.includes('✓') ? 'status-success' : 'status-error'}`}>
              {status}
            </div>
          )}
        </div>
      </section>

      <div className="partners">
        <div className="partners-content">
          <div className="partners-label">Building with</div>
          <div className="partners-logos">
            <div className="partner-logo">
              <span className="base-circle"></span>
              Base
            </div>
            <div className="partner-logo">Avantis</div>
            <div className="partner-logo">Aerodrome</div>
          </div>
        </div>
      </div>
    </>
  );
}