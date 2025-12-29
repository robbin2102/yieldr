'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DocsPage() {
  const [activePage, setActivePage] = useState('what-is-yieldr');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showPage = (pageId: string) => {
    setActivePage(pageId);
    window.scrollTo(0, 0);
    setSidebarOpen(false);
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Yieldr Docs</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-black text-white font-['Inter']">
        {/* Sidebar Overlay */}
        <div
          className={`fixed inset-0 bg-black/70 z-[85] transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-[#0A0A0A] border-b border-[#1E1E1E] flex items-center justify-between px-6 z-[100]">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <span className="font-['JetBrains_Mono'] text-lg font-bold text-[#00C805]">YIELDR</span>
              <span className="text-[#2A2A2A]">|</span>
              <span className="text-sm font-medium text-[#A0A0A0]">Docs</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#A0A0A0] hover:text-white text-sm font-medium no-underline">Home</Link>
            <Link href="/team" className="text-[#A0A0A0] hover:text-white text-sm font-medium no-underline">Team</Link>
            <Link href="/build-in-public" className="text-[#A0A0A0] hover:text-white text-sm font-medium no-underline">Build Progress</Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-[#A0A0A0] hover:text-white text-xl"
            >
              ☰
            </button>
          </div>
        </header>

        {/* Sidebar */}
        <nav className={`fixed top-14 left-0 w-[280px] h-[calc(100vh-56px)] bg-[#0A0A0A] border-r border-[#1E1E1E] overflow-y-auto z-[90] transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-6">
            <div className="mb-6">
              <div className="text-xs font-semibold text-[#6E6E6E] uppercase tracking-wider mb-2 flex items-center gap-2">
                <span>📖</span> Getting Started
              </div>
              <button onClick={() => showPage('what-is-yieldr')} className={`block w-full text-left py-2 px-4 text-sm ${activePage === 'what-is-yieldr' ? 'text-[#00C805] bg-[rgba(0,200,5,0.15)] border-l-2 border-[#00C805]' : 'text-[#A0A0A0] hover:text-white'} transition-colors`}>What is Yieldr?</button>
              <button onClick={() => showPage('the-problem')} className={`block w-full text-left py-2 px-4 text-sm ${activePage === 'the-problem' ? 'text-[#00C805] bg-[rgba(0,200,5,0.15)] border-l-2 border-[#00C805]' : 'text-[#A0A0A0] hover:text-white'} transition-colors`}>The Problem</button>
              <button onClick={() => showPage('quick-start')} className={`block w-full text-left py-2 px-4 text-sm ${activePage === 'quick-start' ? 'text-[#00C805] bg-[rgba(0,200,5,0.15)] border-l-2 border-[#00C805]' : 'text-[#A0A0A0] hover:text-white'} transition-colors`}>Quick Start</button>
            </div>

            <div className="mb-6">
              <div className="text-xs font-semibold text-[#6E6E6E] uppercase tracking-wider mb-2 flex items-center gap-2">
                <span>🤖</span> Product
              </div>
              <button onClick={() => showPage('how-it-works')} className={`block w-full text-left py-2 px-4 text-sm ${activePage === 'how-it-works' ? 'text-[#00C805] bg-[rgba(0,200,5,0.15)] border-l-2 border-[#00C805]' : 'text-[#A0A0A0] hover:text-white'} transition-colors`}>How It Works</button>
              <button onClick={() => showPage('tokenomics')} className={`block w-full text-left py-2 px-4 text-sm ${activePage === 'tokenomics' ? 'text-[#00C805] bg-[rgba(0,200,5,0.15)] border-l-2 border-[#00C805]' : 'text-[#A0A0A0] hover:text-white'} transition-colors`}>Tokenomics</button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="ml-0 lg:ml-[280px] mt-14 min-h-[calc(100vh-56px)]">
          <div className="max-w-[800px] mx-auto p-8 lg:p-12">

            {/* What is Yieldr Page */}
            {activePage === 'what-is-yieldr' && (
              <section>
                <h1 className="text-4xl font-bold mb-4">What is Yieldr?</h1>
                <p className="text-lg text-[#6E6E6E] mb-8">AI-enabled decentralized asset management.</p>

                <p className="mb-4 text-[#A0A0A0]">Yieldr is a platform where <strong className="text-white">investors can discover top Traders & Fund Managers onchain</strong> while <strong className="text-white">Traders can validate performance, raise capital, and scale to fund management</strong> — all powered by AI agents and secured by smart contracts.</p>

                <div className="bg-[rgba(0,200,5,0.15)] border-l-4 border-[#00C805] p-4 rounded my-6">
                  <div className="font-semibold text-[#00C805] mb-2 flex items-center gap-2">
                    💡 The Vision
                  </div>
                  <p className="text-sm text-[#A0A0A0] m-0">A two-sided marketplace where investors discover top trading alpha while traders build track records and raise capital. AI agents power discovery, research & analysis, execution and portfolio management — becoming autonomous over time. Smart contracts enable trustless execution.</p>
                </div>

                <h2 className="text-2xl font-semibold mt-8 mb-4 pt-6 border-t border-[#1E1E1E]">What You Get Today (Phase 1)</h2>

                <p className="mb-4 text-[#A0A0A0]">Phase 1 focuses on the <strong className="text-white">Intelligence Layer</strong> — AI agents that deliver standalone value:</p>

                <ul className="list-none pl-0 mb-4 space-y-2">
                  <li className="text-[#A0A0A0] pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-[#00C805] before:font-semibold"><strong className="text-white">Discover</strong> — Find top traders across Avantis, Hyperliquid, Aerodrome, Uniswap, and more</li>
                  <li className="text-[#A0A0A0] pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-[#00C805] before:font-semibold"><strong className="text-white">Analyze</strong> — Understand what drives alpha: win rates, risk profiles, trading styles</li>
                  <li className="text-[#A0A0A0] pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-[#00C805] before:font-semibold"><strong className="text-white">Advise</strong> — Get recommendations on your portfolio, positions, and timing</li>
                  <li className="text-[#A0A0A0] pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-[#00C805] before:font-semibold"><strong className="text-white">Monitor</strong> — Track your positions and get alerts when things need attention</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Who It's For</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl p-5 hover:border-[#00C805] transition-all">
                    <div className="text-3xl mb-3">💰</div>
                    <div className="font-semibold mb-2">Investors</div>
                    <p className="text-sm text-[#A0A0A0] m-0">Discover top traders, understand their strategies, deploy capital with confidence.</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl p-5 hover:border-[#00C805] transition-all">
                    <div className="text-3xl mb-3">📈</div>
                    <div className="font-semibold mb-2">Traders</div>
                    <p className="text-sm text-[#A0A0A0] m-0">Build verified track records, benchmark & improve your edge, scale to fund management.</p>
                  </div>
                </div>
              </section>
            )}

            {/* The Problem Page */}
            {activePage === 'the-problem' && (
              <section>
                <h1 className="text-4xl font-bold mb-4">The Problem</h1>
                <p className="text-lg text-[#6E6E6E] mb-8">Why earning and scaling alpha in DeFi is harder than it should be.</p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">For Investors</h2>
                <p className="mb-4 text-[#A0A0A0]">You want to earn alpha by following top DeFi traders. But you face two problems:</p>

                <h3 className="text-xl font-semibold mt-6 mb-3">🔍 Discovery Problem</h3>
                <p className="mb-4 text-[#A0A0A0]">Finding top traders across DeFi protocols is fragmented and manual. There's no unified view of who's actually generating alpha across Avantis, Hyperliquid, Polymarket, Kalshi, Aerodrome, Uniswap, and other protocols.</p>
                <div className="bg-[rgba(0,200,5,0.15)] border-l-4 border-[#00C805] p-3 rounded mb-6">
                  <p className="text-sm text-[#A0A0A0] m-0"><strong className="text-white">→ Solved by:</strong> AI agents discover and rank top traders across protocols <span className="bg-[#00C805] text-black text-xs px-2 py-1 rounded ml-2 font-semibold">MVP</span></p>
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-3">🤝 Trust Problem</h3>
                <p className="mb-4 text-[#A0A0A0]">Copy trading platforms exist, but there's no way to validate the performance they claim. Even when wallet addresses are provided, there's massive friction to pull transaction data and do true analysis.</p>
                <div className="bg-[rgba(0,200,5,0.15)] border-l-4 border-[#00C805] p-3 rounded mb-6">
                  <p className="text-sm text-[#A0A0A0] m-0"><strong className="text-white">→ Solved by:</strong> AI analyzes on-chain transactions, explains alpha drivers <span className="bg-[#00C805] text-black text-xs px-2 py-1 rounded ml-2 font-semibold">MVP</span></p>
                </div>

                <h2 className="text-2xl font-semibold mt-8 mb-4 pt-6 border-t border-[#1E1E1E]">For Traders</h2>

                <h3 className="text-xl font-semibold mt-6 mb-3">✓ Validation Problem</h3>
                <p className="mb-4 text-[#A0A0A0]">No place to publicly validate performance in a verifiable way. No path from managing $200K personal capital to $2M+ with outside investors.</p>

                <h3 className="text-xl font-semibold mt-6 mb-3">🔒 Edge Preservation Problem</h3>
                <p className="mb-4 text-[#A0A0A0]">Top traders don't want their wallet transactions parsed and strategies reverse-engineered. No incentive structure exists for them to let their alpha be accessible to investors.</p>
              </section>
            )}

            {/* Quick Start Page */}
            {activePage === 'quick-start' && (
              <section>
                <h1 className="text-4xl font-bold mb-4">Quick Start</h1>
                <p className="text-lg text-[#6E6E6E] mb-8">Get started in 30 seconds.</p>

                <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                  <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg px-6 py-4 text-center"><strong>1.</strong> Name Your Agent</div>
                  <div className="text-[#00C805] text-2xl">→</div>
                  <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg px-6 py-4 text-center"><strong>2.</strong> Connect Wallet</div>
                  <div className="text-[#00C805] text-2xl">→</div>
                  <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg px-6 py-4 text-center"><strong>3.</strong> Start Chatting</div>
                </div>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Example Queries</h2>

                <div className="space-y-3">
                  <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg p-4">
                    <div className="font-['JetBrains_Mono'] text-sm text-[#00C805] mb-2">"Find traders with &gt;60% win rate and &lt;15% max drawdown"</div>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg p-4">
                    <div className="font-['JetBrains_Mono'] text-sm text-[#00C805] mb-2">"ETH SHORTS on Avantis are up 75%, good time to take profits?"</div>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-lg p-4">
                    <div className="font-['JetBrains_Mono'] text-sm text-[#00C805] mb-2">"What are top wallets doing with $DEGEN?"</div>
                  </div>
                </div>
              </section>
            )}

            {/* How It Works Page */}
            {activePage === 'how-it-works' && (
              <section>
                <h1 className="text-4xl font-bold mb-4">How It Works</h1>
                <p className="text-lg text-[#6E6E6E] mb-8">Two layers that power decentralized asset management.</p>

                <p className="mb-6 text-[#A0A0A0]">Yieldr combines two layers to enable trustless asset management at scale:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-[#0A0A0A] border-2 border-[#00C805] rounded-xl p-5">
                    <div className="text-3xl mb-3">🧠</div>
                    <div className="font-semibold mb-2">Intelligence Layer <span className="bg-[#00C805] text-black text-xs px-2 py-1 rounded ml-2">Now</span></div>
                    <p className="text-sm text-[#A0A0A0] m-0">AI agents that discover top traders, analyze alpha drivers, advise on positions, and monitor your portfolio.</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl p-5">
                    <div className="text-3xl mb-3">🔐</div>
                    <div className="font-semibold mb-2">Trust Layer <span className="bg-[#2A2A2A] text-[#A0A0A0] text-xs px-2 py-1 rounded ml-2">v1.0</span></div>
                    <p className="text-sm text-[#A0A0A0] m-0">Smart contracts that enable trustless execution — auto trading, fund management, risk controls, and compensation.</p>
                  </div>
                </div>

                <div className="bg-[rgba(0,136,255,0.15)] border-l-4 border-[#0088FF] p-4 rounded my-6">
                  <div className="font-semibold text-[#0088FF] mb-2">💡 Why Two Layers?</div>
                  <p className="text-sm text-[#A0A0A0] mb-2"><strong className="text-white">Intelligence without trust</strong> = You know who's good but can't safely invest with them.</p>
                  <p className="text-sm text-[#A0A0A0] mb-2"><strong className="text-white">Trust without intelligence</strong> = You can execute safely but don't know who to invest with.</p>
                  <p className="text-sm text-[#A0A0A0] m-0"><strong className="text-white">Both layers together</strong> = True decentralized asset management.</p>
                </div>
              </section>
            )}

            {/* Tokenomics Page */}
            {activePage === 'tokenomics' && (
              <section>
                <h1 className="text-4xl font-bold mb-4">Tokenomics</h1>
                <p className="text-lg text-[#6E6E6E] mb-8">Supply structure and public allocation tiers.</p>

                <div className="bg-gradient-to-br from-[rgba(0,200,5,0.15)] to-[rgba(0,136,255,0.1)] border border-[#00C805] rounded-xl p-8 text-center mb-8">
                  <div className="text-5xl mb-4">⚡</div>
                  <div className="text-3xl font-bold text-[#00C805] mb-2">YLDR</div>
                  <p className="text-[#A0A0A0] mb-6">Use Yieldr = Burn YLDR</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="font-['JetBrains_Mono'] text-2xl font-bold">210M</div>
                      <div className="text-xs text-[#6E6E6E] uppercase tracking-wider">Total Supply</div>
                    </div>
                    <div>
                      <div className="font-['JetBrains_Mono'] text-2xl font-bold">9.05%</div>
                      <div className="text-xs text-[#6E6E6E] uppercase tracking-wider">Public Allocation</div>
                    </div>
                    <div>
                      <div className="font-['JetBrains_Mono'] text-2xl font-bold">~$5M</div>
                      <div className="text-xs text-[#6E6E6E] uppercase tracking-wider">Target Raise</div>
                    </div>
                    <div>
                      <div className="font-['JetBrains_Mono'] text-2xl font-bold">BASE</div>
                      <div className="text-xs text-[#6E6E6E] uppercase tracking-wider">Network</div>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Public Allocation Tiers</h2>

                <div className="overflow-x-auto mb-8">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-[rgba(0,200,5,0.15)] text-[#00C805]">
                        <th className="border border-[#1E1E1E] p-3 text-left font-semibold">Tier</th>
                        <th className="border border-[#1E1E1E] p-3 text-left font-semibold">Tokens</th>
                        <th className="border border-[#1E1E1E] p-3 text-left font-semibold">Price</th>
                        <th className="border border-[#1E1E1E] p-3 text-left font-semibold">FDV</th>
                        <th className="border border-[#1E1E1E] p-3 text-left font-semibold">Raise</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#111111]">
                      <tr>
                        <td className="border border-[#1E1E1E] p-3 text-white font-semibold">Genesis</td>
                        <td className="border border-[#1E1E1E] p-3 text-[#A0A0A0]">1.5M</td>
                        <td className="border border-[#1E1E1E] p-3 text-[#00C805] font-['JetBrains_Mono']">$0.057</td>
                        <td className="border border-[#1E1E1E] p-3 text-[#A0A0A0]">$12M</td>
                        <td className="border border-[#1E1E1E] p-3 text-[#A0A0A0]">$85.5K</td>
                      </tr>
                      <tr>
                        <td className="border border-[#1E1E1E] p-3 text-white font-semibold">Pre-Seed</td>
                        <td className="border border-[#1E1E1E] p-3 text-[#A0A0A0]">2.0M</td>
                        <td className="border border-[#1E1E1E] p-3 text-[#00C805] font-['JetBrains_Mono']">$0.10</td>
                        <td className="border border-[#1E1E1E] p-3 text-[#A0A0A0]">$21M</td>
                        <td className="border border-[#1E1E1E] p-3 text-[#A0A0A0]">$200K</td>
                      </tr>
                      <tr>
                        <td className="border border-[#1E1E1E] p-3 text-white font-semibold">Seed</td>
                        <td className="border border-[#1E1E1E] p-3 text-[#A0A0A0]">3.0M</td>
                        <td className="border border-[#1E1E1E] p-3 text-[#00C805] font-['JetBrains_Mono']">$0.20</td>
                        <td className="border border-[#1E1E1E] p-3 text-[#A0A0A0]">$42M</td>
                        <td className="border border-[#1E1E1E] p-3 text-[#A0A0A0]">$600K</td>
                      </tr>
                      <tr>
                        <td className="border border-[#1E1E1E] p-3 text-white font-semibold">Growth</td>
                        <td className="border border-[#1E1E1E] p-3 text-[#A0A0A0]">4.5M</td>
                        <td className="border border-[#1E1E1E] p-3 text-[#00C805] font-['JetBrains_Mono']">$0.30</td>
                        <td className="border border-[#1E1E1E] p-3 text-[#A0A0A0]">$63M</td>
                        <td className="border border-[#1E1E1E] p-3 text-[#A0A0A0]">$1.35M</td>
                      </tr>
                      <tr>
                        <td className="border border-[#1E1E1E] p-3 text-white font-semibold">Scale</td>
                        <td className="border border-[#1E1E1E] p-3 text-[#A0A0A0]">8.0M</td>
                        <td className="border border-[#1E1E1E] p-3 text-[#00C805] font-['JetBrains_Mono']">$0.357</td>
                        <td className="border border-[#1E1E1E] p-3 text-[#A0A0A0]">$75M</td>
                        <td className="border border-[#1E1E1E] p-3 text-[#A0A0A0]">$2.86M</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-center text-sm text-[#A0A0A0] mb-8">
                  <strong className="text-white">Total:</strong> 19M YLDR (9.05%) | <strong className="text-white">Target Raise:</strong> ~$5.09M
                </p>

                <div className="bg-[rgba(255,208,0,0.15)] border-l-4 border-[#FFD000] p-4 rounded my-6">
                  <div className="font-semibold text-[#FFD000] mb-2">📋 Pre-TGE Disclosure</div>
                  <p className="text-sm text-[#A0A0A0] m-0">Full allocation breakdown will be published <strong className="text-white">30 days before TGE</strong>. All team and strategic allocations follow 1-year cliff + 3-year monthly vesting.</p>
                </div>
              </section>
            )}

          </div>
        </main>
      </body>
    </html>
  );
}
