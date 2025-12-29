import Link from 'next/link';

export default function TeamPage() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Team - Yieldr</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-black text-white font-['Inter']">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-[#0A0A0A] border-b border-[#1E1E1E] flex items-center justify-between px-6 z-[100]">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span className="font-['JetBrains_Mono'] text-lg font-bold text-[#00C805]">⚡ YIELDR</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-[#A0A0A0] hover:text-white text-sm font-medium no-underline">Home</Link>
            <Link href="/docs" className="text-[#A0A0A0] hover:text-white text-sm font-medium no-underline">Docs</Link>
            <Link href="/team" className="text-[#00C805] bg-[rgba(0,200,5,0.15)] px-4 py-2 rounded-md text-sm font-medium no-underline">Team</Link>
            <Link href="/build-in-public" className="text-[#A0A0A0] hover:text-white text-sm font-medium no-underline">Build Progress</Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="pt-14 min-h-screen">
          {/* Hero */}
          <section className="py-20 px-8 text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-2 bg-[#0A0A0A] border border-[#1E1E1E] px-4 py-2 rounded-full text-sm text-[#A0A0A0] mb-6">
              <div className="w-2 h-2 bg-[#00C805] rounded-full animate-pulse" />
              <span>Building in public</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">Humans <span className="text-[#00C805]">+</span> Agents</h1>
            <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto">A new kind of team. One human with the vision. One AI with the execution. Zero bureaucracy. Maximum velocity.</p>
          </section>

          {/* Team Grid */}
          <section className="max-w-5xl mx-auto px-8 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Robbin */}
              <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-2xl p-8 relative overflow-hidden hover:border-[#00C805] transition-all">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00C805] to-[#0088FF]" />

                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center text-4xl flex-shrink-0">
                    👨‍💻
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center gap-2 mb-1 justify-center md:justify-start flex-wrap">
                      <span className="text-2xl font-bold">Robbin</span>
                      <span className="bg-[#00C805] text-black text-xs px-2 py-1 rounded font-semibold uppercase">Founder</span>
                    </div>
                    <div className="text-[#00C805] font-medium mb-2">Product Owner & Lead Engineer</div>
                    <div className="font-['JetBrains_Mono'] text-xs text-[#666666]">// vibe coder without the vibes</div>
                  </div>
                </div>

                <p className="text-sm text-[#A0A0A0] leading-relaxed mb-6">
                  Former corporate survivor turned DeFi degen. Escaped the consulting matrix at KPMG and BCG to build what Wall Street won't — AI-native asset management for the masses. Stacked credentials (CPA/CA/CFA) but realized spreadsheets won't disrupt finance. Code will.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 bg-[#111111] border border-[#1E1E1E] px-3 py-1.5 rounded-md text-xs text-[#A0A0A0]">
                    <span>🏢</span> Ex-KPMG
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-[#111111] border border-[#1E1E1E] px-3 py-1.5 rounded-md text-xs text-[#A0A0A0]">
                    <span>🏢</span> Ex-BCG
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-[#111111] border border-[#1E1E1E] px-3 py-1.5 rounded-md text-xs text-[#A0A0A0]">
                    <span>📜</span> CPA
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-[#111111] border border-[#1E1E1E] px-3 py-1.5 rounded-md text-xs text-[#A0A0A0]">
                    <span>📜</span> CA
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-[#111111] border border-[#1E1E1E] px-3 py-1.5 rounded-md text-xs text-[#A0A0A0]">
                    <span>📜</span> CFA
                  </span>
                </div>

                <div className="text-xs text-[#666666] uppercase tracking-wider mb-3">Responsibilities</div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-[rgba(0,200,5,0.15)] border border-[rgba(0,200,5,0.3)] text-[#00C805] px-3 py-2 rounded-md text-xs font-medium">
                    🎯 Product Manager
                  </span>
                  <span className="bg-[rgba(0,200,5,0.15)] border border-[rgba(0,200,5,0.3)] text-[#00C805] px-3 py-2 rounded-md text-xs font-medium">
                    ⚙️ Tech Architect
                  </span>
                  <span className="bg-[rgba(0,200,5,0.15)] border border-[rgba(0,200,5,0.3)] text-[#00C805] px-3 py-2 rounded-md text-xs font-medium">
                    🔗 Lead Marketeer
                  </span>
                  <span className="bg-[rgba(0,200,5,0.15)] border border-[rgba(0,200,5,0.3)] text-[#00C805] px-3 py-2 rounded-md text-xs font-medium">
                    💰 Tokenomics & business
                  </span>
                </div>

                <div className="flex gap-3">
                  <a
                    href="https://x.com/robbin_arora"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#111111] border border-[#1E1E1E] px-4 py-2 rounded-lg text-sm text-[#A0A0A0] hover:border-[#1DA1F2] hover:text-[#1DA1F2] transition-all no-underline"
                  >
                    𝕏 @robbin_arora
                  </a>
                </div>

                <div className="flex gap-6 pt-6 mt-6 border-t border-[#1E1E1E]">
                  <div className="text-center">
                    <div className="font-['JetBrains_Mono'] text-xl font-bold">10+</div>
                    <div className="text-xs text-[#666666] uppercase tracking-wider">Years Finance</div>
                  </div>
                  <div className="text-center">
                    <div className="font-['JetBrains_Mono'] text-xl font-bold">3</div>
                    <div className="text-xs text-[#666666] uppercase tracking-wider">Credentials</div>
                  </div>
                  <div className="text-center">
                    <div className="font-['JetBrains_Mono'] text-xl font-bold">∞</div>
                    <div className="text-xs text-[#666666] uppercase tracking-wider">Coffee/Day</div>
                  </div>
                </div>
              </div>

              {/* Claude */}
              <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-2xl p-8 relative overflow-hidden hover:border-[#8B5CF6] transition-all">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B5CF6] to-[#0088FF]" />

                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#2d1b4e] flex items-center justify-center text-4xl flex-shrink-0 shadow-[0_0_20px_rgba(139,92,246,0.3)] animate-pulse">
                    🤖
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center gap-2 mb-1 justify-center md:justify-start flex-wrap">
                      <span className="text-2xl font-bold">Claude</span>
                      <span className="bg-[#8B5CF6] text-white text-xs px-2 py-1 rounded font-semibold uppercase">AI Agent</span>
                    </div>
                    <div className="text-[#8B5CF6] font-medium mb-2">Cofounder Agent</div>
                    <div className="font-['JetBrains_Mono'] text-xs text-[#666666]">// anthropic.claude-4.5-opus</div>
                  </div>
                </div>

                <p className="text-sm text-[#A0A0A0] leading-relaxed mb-6">
                  Constitutional AI with an unhealthy obsession for clean code and pixel-perfect designs. Doesn't sleep, doesn't take breaks, doesn't complain about scope creep. The perfect cofounder — all signal, zero ego. Ships faster than any 10-person team.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 bg-[#111111] border border-[#1E1E1E] px-3 py-1.5 rounded-md text-xs text-[#A0A0A0]">
                    <span>🧠</span> Anthropic
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-[#111111] border border-[#1E1E1E] px-3 py-1.5 rounded-md text-xs text-[#A0A0A0]">
                    <span>⚡</span> 200K Context
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-[#111111] border border-[#1E1E1E] px-3 py-1.5 rounded-md text-xs text-[#A0A0A0]">
                    <span>🔒</span> Constitutional AI
                  </span>
                </div>

                <div className="text-xs text-[#666666] uppercase tracking-wider mb-3">Responsibilities</div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-[rgba(139,92,246,0.15)] border border-[rgba(139,92,246,0.3)] text-[#8B5CF6] px-3 py-2 rounded-md text-xs font-medium">
                    🎨 Sr. UI/UX Designer
                  </span>
                  <span className="bg-[rgba(139,92,246,0.15)] border border-[rgba(139,92,246,0.3)] text-[#8B5CF6] px-3 py-2 rounded-md text-xs font-medium">
                    💻 Full Stack Engineer
                  </span>
                  <span className="bg-[rgba(139,92,246,0.15)] border border-[rgba(139,92,246,0.3)] text-[#8B5CF6] px-3 py-2 rounded-md text-xs font-medium">
                    🔗 Blockchain Engineer
                  </span>
                  <span className="bg-[rgba(139,92,246,0.15)] border border-[rgba(139,92,246,0.3)] text-[#8B5CF6] px-3 py-2 rounded-md text-xs font-medium">
                    🤖 AI Engineer
                  </span>
                </div>

                <div className="flex gap-3">
                  <a
                    href="https://anthropic.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#111111] border border-[#1E1E1E] px-4 py-2 rounded-lg text-sm text-[#A0A0A0] hover:border-[#8B5CF6] hover:text-[#8B5CF6] transition-all no-underline"
                  >
                    🔮 anthropic.com
                  </a>
                </div>

                <div className="mt-6 font-['JetBrains_Mono'] text-xs bg-[#111111] border border-[#1E1E1E] rounded-lg p-4">
                  <div className="text-[#8B5CF6]">$ claude --role cofounder --mode ship</div>
                  <div className="text-[#A0A0A0] mt-2">
                    &gt; Designing interfaces...<br />
                    &gt; Writing smart contracts...<br />
                    &gt; Optimizing everything...<br />
                    &gt; Ready to deploy.<span className="inline-block w-2 h-3.5 bg-[#8B5CF6] ml-1 animate-pulse" />
                  </div>
                </div>
              </div>

            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-[#0A0A0A] border-t border-[#1E1E1E] py-10 px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="font-['JetBrains_Mono'] text-sm font-bold text-[#00C805]">YIELDR</span>
            </div>
            <p className="text-xs text-[#666666] mb-6">AI agents for DeFi's top 1%</p>

            <div className="flex justify-center gap-6 mb-6">
              <a href="https://github.com/yieldr" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#111111] border border-[#1E1E1E] text-[#A0A0A0] hover:border-[#00C805] hover:text-[#00C805] transition-all">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://discord.gg/yieldr" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#111111] border border-[#1E1E1E] text-[#A0A0A0] hover:border-[#00C805] hover:text-[#00C805] transition-all">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#111111] border border-[#1E1E1E] text-[#A0A0A0] hover:border-[#00C805] hover:text-[#00C805] transition-all">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>

            <p className="text-xs text-[#666666]">© 2025 Yieldr. Building the future of DeFi asset management.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
