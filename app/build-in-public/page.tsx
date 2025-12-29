'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BuildInPublicPage() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement email subscription
    console.log('Subscribe email:', email);
    alert('Thanks for subscribing! Updates coming soon.');
    setEmail('');
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Build Progress - Yieldr</title>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'JetBrains Mono', monospace;
            background: #000000;
            color: #FFFFFF;
            line-height: 1.6;
          }
        `}</style>
      </head>
      <body>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-[#1A1A1A]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <svg className="w-9 h-9" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                <path d="M 50 10 Q 70 30 80 60 Q 70 90 50 110 Q 30 90 20 60 Q 30 30 50 10 Z" fill="#00C805"/>
                <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000000" opacity="0.3"/>
                <circle cx="50" cy="60" r="8" fill="#FFFFFF" opacity="0.9"/>
              </svg>
              <span className="text-xl font-bold text-[#00C805] tracking-[0.1em]">YIELDR</span>
            </Link>
            <nav className="flex items-center gap-8">
              <Link href="/docs" className="text-[#A0A0A0] hover:text-[#00C805] text-sm font-medium transition-colors">
                Docs
              </Link>
              <Link href="/team" className="text-[#A0A0A0] hover:text-[#00C805] text-sm font-medium transition-colors">
                Team
              </Link>
              <Link href="/build-in-public" className="text-[#00C805] text-sm font-medium">
                Build Progress
              </Link>
              <Link
                href="/"
                className="bg-[#00C805] text-black px-5 py-2.5 rounded-md font-semibold text-sm hover:bg-[#00E006] hover:shadow-[0_4px_20px_rgba(0,200,5,0.4)] transition-all"
              >
                Get Early Access
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-[rgba(0,200,5,0.1)] border border-[rgba(0,200,5,0.3)] px-4 py-2 rounded-full text-sm font-semibold text-[#00C805] mb-6">
            <div className="w-2 h-2 bg-[#00C805] rounded-full animate-pulse" />
            <span>BUILDING IN PUBLIC</span>
          </div>
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">
            Our Journey to <span className="text-[#00C805]">Production</span>
          </h1>
          <p className="text-xl text-[#A0A0A0] max-w-2xl mx-auto mb-8">
            Weekly updates on progress, code shipped, and milestones hit. Transparency first.
          </p>
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email for updates"
              required
              className="flex-1 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00C805] transition-colors placeholder-[#666666]"
            />
            <button
              type="submit"
              className="bg-[#00C805] text-black px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#00E006] hover:shadow-[0_4px_20px_rgba(0,200,5,0.4)] transition-all"
            >
              Subscribe
            </button>
          </form>
        </section>

        {/* Progress Stats */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: 'Days Building', value: '45', trend: '+7 this week' },
              { label: 'Code Commits', value: '312', trend: '+28 this week' },
              { label: 'Features Shipped', value: '18', trend: '+3 this week' },
              { label: 'Tests Written', value: '156', trend: '+12 this week' },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 text-center hover:border-[#00C805] transition-all"
              >
                <div className="text-3xl font-bold text-[#00C805] mb-2">{stat.value}</div>
                <div className="text-sm text-[#A0A0A0] mb-1">{stat.label}</div>
                <div className="text-xs text-[#666666]">{stat.trend}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-12 text-center">Development Timeline</h2>

          <div className="space-y-8">
            {/* Week 7 */}
            <div className="relative pl-8 border-l-2 border-[#00C805]">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[#00C805] rounded-full animate-pulse" />
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">Week 7 - Current Sprint</h3>
                  <span className="text-xs text-[#666666] bg-[#1A1A1A] px-3 py-1 rounded-full">Dec 23-29, 2025</span>
                </div>
                <div className="space-y-3 text-sm text-[#A0A0A0]">
                  <div className="flex items-start gap-2">
                    <span className="text-[#00C805] mt-1">✓</span>
                    <span>USDC payment infrastructure for YLDR pre-TGE sale</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#00C805] mt-1">✓</span>
                    <span>MongoDB integration for contribution tracking</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#00C805] mt-1">✓</span>
                    <span>Tier-based token allocation system (Genesis → Scale)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">⟳</span>
                    <span>Final testing of payment flow and local deployment</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Week 6 */}
            <div className="relative pl-8 border-l-2 border-[#1A1A1A]">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[#1A1A1A] rounded-full" />
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">Week 6</h3>
                  <span className="text-xs text-[#666666] bg-[#1A1A1A] px-3 py-1 rounded-full">Dec 16-22, 2025</span>
                </div>
                <div className="space-y-3 text-sm text-[#A0A0A0]">
                  <div className="flex items-start gap-2">
                    <span className="text-[#00C805] mt-1">✓</span>
                    <span>New homepage with modern UI and animated background</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#00C805] mt-1">✓</span>
                    <span>RainbowKit + Wagmi wallet connection integration</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#00C805] mt-1">✓</span>
                    <span>Branding refresh: favicon, heading, GitHub link updates</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Week 5 */}
            <div className="relative pl-8 border-l-2 border-[#1A1A1A]">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[#1A1A1A] rounded-full" />
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">Week 5</h3>
                  <span className="text-xs text-[#666666] bg-[#1A1A1A] px-3 py-1 rounded-full">Dec 9-15, 2025</span>
                </div>
                <div className="space-y-3 text-sm text-[#A0A0A0]">
                  <div className="flex items-start gap-2">
                    <span className="text-[#00C805] mt-1">✓</span>
                    <span>Documentation page with comprehensive guides</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#00C805] mt-1">✓</span>
                    <span>Team page showcasing human-AI collaboration</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#00C805] mt-1">✓</span>
                    <span>Base Batches 002 winner recognition section</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Week 4 */}
            <div className="relative pl-8 border-l-2 border-[#1A1A1A]">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[#1A1A1A] rounded-full" />
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">Week 4</h3>
                  <span className="text-xs text-[#666666] bg-[#1A1A1A] px-3 py-1 rounded-full">Dec 2-8, 2025</span>
                </div>
                <div className="space-y-3 text-sm text-[#A0A0A0]">
                  <div className="flex items-start gap-2">
                    <span className="text-[#00C805] mt-1">✓</span>
                    <span>Core agent infrastructure setup</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#00C805] mt-1">✓</span>
                    <span>Initial DeFi protocol integrations (Uniswap, Aerodrome)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#00C805] mt-1">✓</span>
                    <span>Wallet analytics and portfolio tracking</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Earlier Weeks Collapsed */}
            <div className="relative pl-8 border-l-2 border-[#1A1A1A]">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[#1A1A1A] rounded-full" />
              <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">Weeks 1-3</h3>
                  <span className="text-xs text-[#666666] bg-[#1A1A1A] px-3 py-1 rounded-full">Nov 11 - Dec 1, 2025</span>
                </div>
                <div className="space-y-3 text-sm text-[#A0A0A0]">
                  <div className="flex items-start gap-2">
                    <span className="text-[#00C805] mt-1">✓</span>
                    <span>Project inception and architecture design</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#00C805] mt-1">✓</span>
                    <span>Next.js 15 app setup with TypeScript</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#00C805] mt-1">✓</span>
                    <span>Base network integration and testing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#00C805] mt-1">✓</span>
                    <span>Initial landing page and branding</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's Next */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">What's Next</h2>
          <div className="grid grid-cols-2 gap-6">
            {[
              {
                title: 'Q1 2026',
                items: [
                  'Complete YLDR token pre-TGE sale',
                  'Deploy production multisig treasury',
                  'Launch AlphaHunter trading agent beta',
                  'Onboard first 100 users',
                ],
              },
              {
                title: 'Q2 2026',
                items: [
                  'YLDR Token Generation Event (TGE)',
                  'Token distribution to early supporters',
                  'Additional AI agent releases',
                  'Cross-chain expansion beyond Base',
                ],
              },
            ].map((quarter, i) => (
              <div key={i} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-[#00C805]">{quarter.title}</h3>
                <ul className="space-y-2 text-sm text-[#A0A0A0]">
                  {quarter.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="text-[#00C805] mt-1">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#1A1A1A] mt-20">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-3 gap-12 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-8 h-8" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 50 10 Q 70 30 80 60 Q 70 90 50 110 Q 30 90 20 60 Q 30 30 50 10 Z" fill="#00C805"/>
                    <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000000" opacity="0.3"/>
                    <circle cx="50" cy="60" r="8" fill="#FFFFFF" opacity="0.9"/>
                  </svg>
                  <span className="text-lg font-bold text-[#00C805] tracking-[0.1em]">YIELDR</span>
                </div>
                <p className="text-sm text-[#666666]">
                  AI agents that help you become better investors, traders & fund managers onchain.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-3">Navigation</h4>
                <div className="space-y-2 text-sm">
                  <Link href="/" className="block text-[#666666] hover:text-[#00C805] transition-colors">
                    Home
                  </Link>
                  <Link href="/docs" className="block text-[#666666] hover:text-[#00C805] transition-colors">
                    Docs
                  </Link>
                  <Link href="/team" className="block text-[#666666] hover:text-[#00C805] transition-colors">
                    Team
                  </Link>
                  <Link href="/build-in-public" className="block text-[#666666] hover:text-[#00C805] transition-colors">
                    Build Progress
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-3">Connect</h4>
                <div className="space-y-2 text-sm">
                  <a
                    href="https://github.com/robbin2102/yieldr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#666666] hover:text-[#00C805] transition-colors"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://x.com/YieldrOfficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#666666] hover:text-[#00C805] transition-colors"
                  >
                    Twitter
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-[#1A1A1A] pt-8 text-center text-sm text-[#666666]">
              <p>&copy; 2025 Yieldr. Built with transparency.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
