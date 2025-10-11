// app/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');
    
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus('🎉 You\'re on the waitlist! Welcome to the future of DeFi.');
        setEmail('');
      } else {
        setStatus(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('Error! Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
        }} />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="text-center max-w-5xl mx-auto">
          {/* Logo Animation */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-50 animate-pulse" />
            <h1 className="relative text-[5rem] sm:text-[7rem] md:text-[9rem] font-bold leading-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient">
                Yieldr
              </span>
            </h1>
          </div>
          
          <p className="text-xl sm:text-2xl md:text-3xl mb-4 text-gray-100 font-light">
            Invest & Earn with Top Asset Managers in Crypto
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-base sm:text-lg text-gray-400">The BlackRock of DeFi, built with</span>
            <span className="text-2xl animate-pulse">❤️</span>
            <span className="text-base sm:text-lg text-gray-400">on</span>
            <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 font-semibold">
              Base
            </span>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                $0M+
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">TVL Soon</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                0%
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">Avg APY</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                0+
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">Managers</div>
            </div>
          </div>
          
          {/* Email Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder-gray-500"
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="group relative px-8 py-4 rounded-2xl font-semibold transition-all disabled:opacity-50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-transform group-hover:scale-110" />
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? 'Joining...' : 'Join Waitlist'}
                {!isLoading && (
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
              </span>
            </button>
          </form>

          {/* Status Message */}
          {status && (
            <div className={`mb-8 p-4 rounded-xl backdrop-blur-md ${
              status.includes('🎉') 
                ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
            }`}>
              {status}
            </div>
          )}
          
          {/* Launch Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium">Launching January 2025</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Next-Gen DeFi Asset Management
            </span>
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🔐',
                title: 'On-Chain Verification',
                description: 'Every trade, every return, verified on the blockchain. No fake screenshots.',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: '🤖',
                title: 'Smart Wallet Automation',
                description: 'Set it and forget it. Smart wallets execute trades automatically.',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: '📊',
                title: 'Real-Time Analytics',
                description: 'Live positions, P&L tracking, and performance metrics updated instantly.',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: '🎯',
                title: 'Curated Managers',
                description: 'Only the best traders with proven track records make it to our platform.',
                gradient: 'from-orange-500 to-red-500'
              },
              {
                icon: '💎',
                title: 'Base Native',
                description: 'Built on Base for low fees, fast transactions, and Coinbase security.',
                gradient: 'from-indigo-500 to-purple-500'
              },
              {
                icon: '🚀',
                title: 'Copy Trading 2.0',
                description: 'Not just copying trades, but entire strategies with risk management.',
                gradient: 'from-pink-500 to-rose-500'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center">
        <p className="text-gray-500 text-sm">
          © 2025 Yieldr · The Future of DeFi Asset Management
        </p>
      </footer>
    </main>
  );
}