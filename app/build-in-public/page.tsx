import Link from 'next/link';

export default function BuildInPublicPage() {
  return (
    <>
      <style>{`
        /* ── Build-in-Public Design System ── */
        .bip-wrap {
          --green: #00C805;
          --green-dim: rgba(0,200,5,0.08);
          --green-border: rgba(0,200,5,0.2);
          --yellow: #FFD000;
          --yellow-dim: rgba(255,208,0,0.08);
          --red: #FF4757;
          --red-dim: rgba(255,71,87,0.08);
          --blue: #2E8AF6;
          --purple: #A78BFA;
          --bg0: #000000;
          --bg1: #080808;
          --bg2: #0E0E0E;
          --bg3: #141414;
          --bg4: #1A1A1A;
          --bg5: #222222;
          --border: rgba(255,255,255,0.06);
          --border2: rgba(255,255,255,0.1);
          --t1: #F0F0F0;
          --t2: #8A8A8A;
          --t3: #4A4A4A;
          --t4: #2A2A2A;
          --fm: 'IBM Plex Mono', monospace;
          --fs: 'IBM Plex Sans', sans-serif;
          font-family: var(--fs);
          background: var(--bg0);
          color: var(--t1);
          min-height: 100vh;
        }
        .bip-wrap *,::-webkit-scrollbar { scrollbar-width: thin; }
        .bip-wrap ::-webkit-scrollbar { width: 3px; }
        .bip-wrap ::-webkit-scrollbar-thumb { background: var(--bg5); border-radius: 2px; }

        /* NAV */
        .bip-nav {
          height: 44px; background: var(--bg1); border-bottom: 1px solid var(--border);
          display: flex; align-items: center; padding: 0 20px;
          position: sticky; top: 0; z-index: 100;
        }
        .bip-logo {
          font-family: var(--fm); font-size: 0.78rem; font-weight: 700;
          color: var(--green); letter-spacing: 0.14em;
          padding-right: 16px; margin-right: 8px;
          border-right: 1px solid var(--border); flex-shrink: 0;
          text-decoration: none;
        }
        .bip-nav-links { display: flex; gap: 0; margin-left: 4px; }
        .bip-nav-link {
          font-size: 0.68rem; color: var(--t3); text-decoration: none;
          padding: 0 12px; height: 44px; display: flex; align-items: center;
          font-family: var(--fs); border-bottom: 2px solid transparent;
          transition: all 0.15s; letter-spacing: 0.01em;
        }
        .bip-nav-link:hover { color: var(--t2); text-decoration: none; }
        .bip-nav-link.active { color: var(--t1); border-bottom-color: var(--green); }
        .bip-nav-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
        .bip-nav-date { font-family: var(--fm); font-size: 0.57rem; color: var(--t4); }

        /* HERO */
        .bip-hero {
          border-bottom: 1px solid var(--border);
          padding: 48px 20px 40px; max-width: 900px; margin: 0 auto;
        }
        .bip-eyebrow-wrap {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--fm); font-size: 0.6rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.12em;
          color: var(--green); margin-bottom: 14px;
        }
        .bip-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--green); animation: bip-pulse 2.4s infinite; flex-shrink: 0;
        }
        @keyframes bip-pulse {
          0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(0,200,5,0.5); }
          50% { opacity: 0.6; box-shadow: 0 0 0 5px rgba(0,200,5,0); }
        }
        .bip-hero-title {
          font-size: clamp(1.7rem,5vw,2.5rem); font-weight: 700;
          letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 12px;
          font-family: var(--fs);
        }
        .bip-hero-title span { color: var(--green); }
        .bip-hero-desc { font-size: 0.8rem; color: var(--t2); line-height: 1.7; max-width: 580px; margin-bottom: 24px; }
        .bip-pills { display: flex; flex-wrap: wrap; gap: 7px; }
        .bip-pill {
          font-family: var(--fm); font-size: 0.56rem; padding: 3px 9px;
          background: var(--bg3); border: 1px solid var(--border2); border-radius: 3px; color: var(--t2);
        }
        .bip-pill.g { background: var(--green-dim); border-color: var(--green-border); color: var(--green); }

        /* MAIN */
        .bip-main { max-width: 900px; margin: 0 auto; padding: 0 20px 80px; }
        .bip-section { border-bottom: 1px solid var(--border); padding: 36px 0; }
        .bip-section:last-child { border-bottom: none; }
        .bip-sec-eyebrow {
          font-family: var(--fm); font-size: 0.55rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.14em; color: var(--green); margin-bottom: 5px;
        }
        .bip-sec-title { font-size: 1rem; font-weight: 700; color: var(--t1); letter-spacing: -0.01em; margin-bottom: 3px; }
        .bip-sec-sub { font-size: 0.7rem; color: var(--t3); line-height: 1.6; margin-bottom: 20px; }

        /* STAT GRID */
        .bip-stat-grid {
          display: grid; grid-template-columns: repeat(auto-fit,minmax(120px,1fr));
          gap: 1px; background: var(--border); border: 1px solid var(--border);
          border-radius: 6px; overflow: hidden; margin-bottom: 20px;
        }
        .bip-sc { background: var(--bg1); padding: 14px 16px; }
        .bip-sv {
          font-family: var(--fm); font-size: 1.25rem; font-weight: 700;
          color: var(--t1); line-height: 1; margin-bottom: 4px; letter-spacing: -0.02em;
        }
        .bip-sv.g { color: var(--green); } .bip-sv.r { color: var(--red); }
        .bip-sv.y { color: var(--yellow); } .bip-sv.d { color: var(--t3); }
        .bip-sl { font-size: 0.57rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.09em; color: var(--t3); }
        .bip-ss { font-size: 0.54rem; color: var(--t4); margin-top: 2px; font-family: var(--fm); }

        /* COMMIT BAR */
        .bip-commit-bar { margin-top: 16px; }
        .bip-cbar-label {
          font-family: var(--fm); font-size: 0.54rem; color: var(--t3);
          margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.1em;
        }
        .bip-cbar-track {
          height: 6px; background: var(--bg3); border-radius: 3px;
          overflow: hidden; display: flex; margin-bottom: 8px;
        }
        .bip-cbar-seg { height: 100%; }
        .bip-cb-oct { background: #2E8AF6; width: 15.6%; }
        .bip-cb-nov { background: #4CAF50; width: 17.5%; }
        .bip-cb-dec { background: #00C805; width: 22.5%; }
        .bip-cb-jan { background: #FFD000; width: 3.6%; }
        .bip-cb-feb { background: #FF9500; width: 4.4%; }
        .bip-cb-mar { background: #FF4757; width: 40%; }
        .bip-cbar-legend { display: flex; flex-wrap: wrap; gap: 12px; }
        .bip-cleg { display: flex; align-items: center; gap: 5px; font-family: var(--fm); font-size: 0.56rem; color: var(--t3); }
        .bip-cleg-dot { width: 7px; height: 7px; border-radius: 50%; }

        /* BADGE */
        .bip-badge {
          display: inline-flex; align-items: center; gap: 4px;
          font-family: var(--fm); font-size: 0.5rem; padding: 2px 7px;
          border-radius: 2px; font-weight: 600;
        }
        .bip-badge.done { background: var(--green-dim); border: 1px solid var(--green-border); color: var(--green); }
        .bip-badge.wip { background: var(--yellow-dim); border: 1px solid rgba(255,208,0,0.2); color: var(--yellow); }
        .bip-badge.planned { background: var(--bg3); border: 1px solid var(--border); color: var(--t3); }
        .bip-badge.milestone { background: rgba(167,139,250,0.08); border: 1px solid rgba(167,139,250,0.2); color: var(--purple); }

        /* TIMELINE */
        .bip-tl-month { margin-bottom: 28px; }
        .bip-tl-month-hdr {
          display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
          padding-bottom: 8px; border-bottom: 1px solid var(--border); flex-wrap: wrap;
        }
        .bip-tl-mname { font-size: 0.78rem; font-weight: 700; color: var(--t1); }

        /* VISION BOX */
        .bip-vision-box {
          padding: 12px 14px; background: var(--bg2); border-left: 2px solid var(--t4);
          border-radius: 0 4px 4px 0; margin-bottom: 10px;
          font-size: 0.65rem; color: var(--t3); line-height: 1.6;
        }
        .bip-vision-box strong { color: var(--t2); }

        /* MODULE LIST */
        .bip-mod-list { display: flex; flex-direction: column; gap: 2px; }
        .bip-mod {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 10px 12px; background: var(--bg1); border-radius: 4px;
          border: 1px solid transparent; transition: border-color 0.15s;
        }
        .bip-mod:hover { border-color: var(--border); }
        .bip-mod-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
        .bip-md-done { background: var(--green); }
        .bip-md-wip { background: var(--yellow); }
        .bip-md-plan { background: var(--t4); }
        .bip-mod-body { flex: 1; }
        .bip-mod-name { font-size: 0.72rem; font-weight: 600; color: var(--t1); margin-bottom: 1px; }
        .bip-mod-desc { font-size: 0.63rem; color: var(--t3); line-height: 1.5; }
        .bip-mod-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 5px; flex-wrap: wrap; gap: 6px;
        }
        .bip-mod-tags { display: flex; gap: 4px; flex-wrap: wrap; }
        .bip-mtag {
          font-family: var(--fm); font-size: 0.5rem; padding: 1px 6px;
          background: var(--bg3); border: 1px solid var(--border); border-radius: 2px; color: var(--t3);
        }
        .bip-mtag.avantis { background: rgba(46,138,246,0.08); border-color: rgba(46,138,246,0.2); color: var(--blue); }
        .bip-mtag.hl { background: rgba(46,138,246,0.08); border-color: rgba(46,138,246,0.2); color: var(--blue); }
        .bip-mtag.poly { background: rgba(167,139,250,0.08); border-color: rgba(167,139,250,0.2); color: var(--purple); }
        .bip-mtag.ai { background: var(--green-dim); border-color: var(--green-border); color: var(--green); }
        .bip-view-code {
          font-family: var(--fm); font-size: 0.52rem; color: var(--t3);
          text-decoration: none; transition: color 0.15s;
        }
        .bip-view-code:hover { color: var(--t2); text-decoration: none; }
        .bip-view-code-group { display: flex; gap: 10px; flex-wrap: wrap; }
        .bip-trading-result {
          display: flex; gap: 14px; margin-top: 6px;
          font-family: var(--fm); font-size: 0.6rem;
        }
        .bip-tr-lbl { color: var(--t3); }
        .bip-tr-pos { color: var(--green); }
        .bip-tr-neg { color: var(--red); }
        .bip-tr-zero { color: var(--t3); }

        /* LEDGER TABLE */
        .bip-ledger-wrap {
          background: var(--bg1); border: 1px solid var(--border);
          border-radius: 6px; overflow: hidden; margin-bottom: 12px;
          overflow-x: auto;
        }
        .bip-ledger { width: 100%; border-collapse: collapse; min-width: 400px; }
        .bip-ledger th {
          font-family: var(--fm); font-size: 0.54rem; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--t3); padding: 8px 12px;
          text-align: left; border-bottom: 1px solid var(--border); background: var(--bg2);
        }
        .bip-ledger th:not(:first-child) { text-align: right; }
        .bip-ledger td {
          font-size: 0.66rem; padding: 8px 12px; border-bottom: 1px solid var(--border);
          color: var(--t2); font-family: var(--fm);
        }
        .bip-ledger td:not(:first-child) { text-align: right; }
        .bip-ledger tr:last-child td { border-bottom: none; }
        .bip-ledger tr:hover td { background: var(--bg2); }
        .bip-ledger .bip-lcat td { color: var(--t3); font-size: 0.6rem; }
        .bip-ledger .bip-ltotal td { color: var(--t1); font-weight: 700; border-top: 1px solid var(--border2); }
        .bip-ledger .bip-lbal td { color: var(--yellow); font-weight: 700; }
        .bip-ledger .bip-lrec td { color: var(--green); }
        .bip-lneg { color: var(--red) !important; }
        .bip-lpos { color: var(--green) !important; }

        /* BALANCE STRIP */
        .bip-bstrip {
          display: flex; align-items: stretch; flex-wrap: wrap;
          background: var(--bg2); border: 1px solid var(--border);
          border-radius: 6px; overflow: hidden; margin-bottom: 20px;
        }
        .bip-bs { padding: 14px 20px; flex: 1; min-width: 110px; }
        .bip-bs-sep { width: 1px; background: var(--border); align-self: stretch; }
        .bip-bsl {
          font-size: 0.54rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--t3); font-family: var(--fm); margin-bottom: 4px;
        }
        .bip-bsv { font-family: var(--fm); font-size: 0.95rem; font-weight: 700; }
        .bip-bsv.g { color: var(--green); } .bip-bsv.r { color: var(--red); }
        .bip-bsv.y { color: var(--yellow); } .bip-bsv.w { color: var(--t1); } .bip-bsv.d { color: var(--t3); }
        .bip-bss { font-size: 0.54rem; color: var(--t4); margin-top: 2px; font-family: var(--fm); }

        /* NOTE */
        .bip-note {
          padding: 12px 14px; background: var(--bg2); border-left: 2px solid var(--t4);
          border-radius: 0 4px 4px 0; font-size: 0.62rem; color: var(--t3);
          line-height: 1.6; margin-top: 12px;
        }
        .bip-note strong { color: var(--t2); }
        .bip-note a { color: var(--t2); text-decoration: none; }
        .bip-note a:hover { color: var(--t1); }

        /* FOOTER */
        .bip-footer {
          border-top: 1px solid var(--border); padding: 24px 20px; text-align: center;
          font-family: var(--fm); font-size: 0.57rem; color: var(--t4); letter-spacing: 0.06em;
        }
        .bip-footer a { color: var(--t3); text-decoration: none; }
        .bip-footer a:hover { color: var(--t2); }
        .bip-footer-row { margin-bottom: 6px; }
        .bip-footer-note { margin-top: 8px; color: var(--t4); }

        /* RESPONSIVE */
        @media (max-width: 600px) {
          .bip-hero { padding: 32px 16px 28px; }
          .bip-main { padding: 0 16px 60px; }
          .bip-stat-grid { grid-template-columns: repeat(2,1fr); }
          .bip-bs { padding: 12px 14px; }
          .bip-nav-links { display: none; }
          .bip-bstrip { flex-direction: column; }
          .bip-bs-sep { width: 100%; height: 1px; align-self: auto; }
        }
      `}</style>

      <div className="bip-wrap">
        {/* ── Nav ── */}
        <nav className="bip-nav">
          <Link href="/" className="bip-logo">YLDR</Link>
          <div className="bip-nav-links">
            <Link href="/" className="bip-nav-link">Home</Link>
            <Link href="/docs" className="bip-nav-link">Docs</Link>
            <Link href="/team" className="bip-nav-link">Team</Link>
            <Link href="/build-in-public" className="bip-nav-link active">Build Progress</Link>
          </div>
          <div className="bip-nav-right">
            <span className="bip-nav-date">Mar 7, 2026</span>
          </div>
        </nav>

        {/* ── Hero ── */}
        <div className="bip-hero">
          <div className="bip-eyebrow-wrap">
            <div className="bip-live-dot" />
            Building in Public — Week 1 Mar 2026 · 110 commits shipped
          </div>
          <h1 className="bip-hero-title">Transparent development.<br /><span>No bullshit.</span></h1>
          <p className="bip-hero-desc">Real treasury data, real trading performance, real commit history. Every module, every expense, tracked openly from day one.</p>
          <div className="bip-pills">
            <span className="bip-pill g">Base Batches 002</span>
            <span className="bip-pill g">5 Months In</span>
            <span className="bip-pill">Delaware C-Corp</span>
            <span className="bip-pill">~275 Commits</span>
            <span className="bip-pill">2 Contributors</span>
          </div>
        </div>

        {/* ── Main ── */}
        <div className="bip-main">

          {/* ── 01 Overview ── */}
          <div className="bip-section">
            <div className="bip-sec-eyebrow">01 — Overview</div>
            <div className="bip-sec-title">By the numbers</div>
            <div className="bip-sec-sub">Running totals since October 2025.</div>
            <div className="bip-stat-grid">
              <div className="bip-sc"><div className="bip-sv">5</div><div className="bip-sl">Months Building</div></div>
              <div className="bip-sc"><div className="bip-sv">+62.5K</div><div className="bip-sl">Lines of Code</div><div className="bip-ss">from +28.7K in Dec</div></div>
              <div className="bip-sc"><div className="bip-sv g">+$14.1K</div><div className="bip-sl">Trading PnL</div><div className="bip-ss">Oct 25 – Feb 26</div></div>
              <div className="bip-sc"><div className="bip-sv">$5,000</div><div className="bip-sl">Base Grant</div><div className="bip-ss">Batches 002</div></div>
            </div>
            <div className="bip-sec-eyebrow" style={{marginTop:'20px',marginBottom:'8px'}}>Development Metrics</div>
            <div className="bip-stat-grid">
              <div className="bip-sc"><div className="bip-sv">~275</div><div className="bip-sl">Commits</div><div className="bip-ss">153 Oct–Dec + 122 Jan–Mar</div></div>
              <div className="bip-sc"><div className="bip-sv">60+</div><div className="bip-sl">Features</div></div>
              <div className="bip-sc"><div className="bip-sv">114+</div><div className="bip-sl">Bug Fixes</div></div>
              <div className="bip-sc"><div className="bip-sv">631</div><div className="bip-sl">Files</div><div className="bip-ss">394 source files</div></div>
              <div className="bip-sc"><div className="bip-sv">2</div><div className="bip-sl">Contributors</div></div>
              <div className="bip-sc"><div className="bip-sv">7</div><div className="bip-sl">Railway Services</div><div className="bip-ss">live in production</div></div>
            </div>
            <div className="bip-commit-bar">
              <div className="bip-cbar-label">Commits by month</div>
              <div className="bip-cbar-track">
                <div className="bip-cbar-seg bip-cb-oct" />
                <div className="bip-cbar-seg bip-cb-nov" />
                <div className="bip-cbar-seg bip-cb-dec" />
                <div className="bip-cbar-seg bip-cb-jan" />
                <div className="bip-cbar-seg bip-cb-feb" />
                <div className="bip-cbar-seg bip-cb-mar" />
              </div>
              <div className="bip-cbar-legend">
                <span className="bip-cleg"><div className="bip-cleg-dot" style={{background:'#2E8AF6'}} />Oct: 43</span>
                <span className="bip-cleg"><div className="bip-cleg-dot" style={{background:'#4CAF50'}} />Nov: 48</span>
                <span className="bip-cleg"><div className="bip-cleg-dot" style={{background:'#00C805'}} />Dec: 62</span>
                <span className="bip-cleg"><div className="bip-cleg-dot" style={{background:'#FFD000'}} />Jan: ~10</span>
                <span className="bip-cleg"><div className="bip-cleg-dot" style={{background:'#FF9500'}} />Feb: 12</span>
                <span className="bip-cleg"><div className="bip-cleg-dot" style={{background:'#FF4757'}} />Mar: 110</span>
              </div>
            </div>
          </div>

          {/* ── 02 Timeline ── */}
          <div className="bip-section">
            <div className="bip-sec-eyebrow">02 — Development Timeline</div>
            <div className="bip-sec-title">What shipped, when.</div>
            <div className="bip-sec-sub">Chronological build log from inception.</div>
            <div className="bip-tl">

              {/* March 2026 */}
              <div className="bip-tl-month">
                <div className="bip-tl-month-hdr">
                  <span className="bip-tl-mname">March 2026</span>
                  <span className="bip-badge done">✓ Complete</span>
                </div>
                <div className="bip-mod-list">
                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">Agent Monitoring System</div>
                    <div className="bip-mod-desc">Scheduled background worker evaluates user-defined monitoring tasks at configurable intervals. Claude Haiku evaluator analyzes tool-call output against user position context — generates alerts with severity (info / warning / critical) and per-indicator signal pills. manage_monitoring MCP tool lets the chat agent create/update/pause/delete tasks with full CRUD.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags"><span className="bip-mtag ai">Claude AI</span><span className="bip-mtag">MCP</span><span className="bip-mtag">LLM Tooling</span></div>
                      <div className="bip-view-code-group">
                        <a href="https://github.com/robbin2102/yieldr-app/commit/2b233c8" target="_blank" rel="noopener noreferrer" className="bip-view-code">DB + CRUD →</a>
                        <a href="https://github.com/robbin2102/yieldr-app/commit/bf51ec3" target="_blank" rel="noopener noreferrer" className="bip-view-code">Scheduler →</a>
                        <a href="https://github.com/robbin2102/yieldr-app/commit/4aad003" target="_blank" rel="noopener noreferrer" className="bip-view-code">MCP Tool →</a>
                        <a href="https://github.com/robbin2102/yieldr-app/tree/main/services/monitoring-scheduler" target="_blank" rel="noopener noreferrer" className="bip-view-code">Browse Service →</a>
                      </div>
                    </div>
                  </div></div>

                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">Agent Explorer + Agent Detail Pages</div>
                    <div className="bip-mod-desc">Agent cards with live status, signal pills, alert counts, last-run timestamps. Agent detail: hero stats, per-indicator "Current Market Read" panel (green/yellow/red signal dots), alerts history with indicator snapshots. Terminal-style redesign of the agent chat page.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags"><span className="bip-mtag">UI</span><span className="bip-mtag">Agents</span></div>
                      <div className="bip-view-code-group">
                        <a href="https://github.com/robbin2102/yieldr-app/commit/bf1036b" target="_blank" rel="noopener noreferrer" className="bip-view-code">Explorer + Detail →</a>
                        <a href="https://github.com/robbin2102/yieldr-app/commit/2dbb790" target="_blank" rel="noopener noreferrer" className="bip-view-code">Terminal Redesign →</a>
                        <a href="https://github.com/robbin2102/yieldr-app/tree/main/app/agents" target="_blank" rel="noopener noreferrer" className="bip-view-code">Browse Pages →</a>
                      </div>
                    </div>
                  </div></div>

                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">Agent Launch UI &amp; Onboarding Flow</div>
                    <div className="bip-mod-desc">Agent creation flow: name availability check, market selection (Perps / Predictions / Liquidity), wallet connect. Auto-redirect to agent chat for returning users. Wallet-first authentication.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags"><span className="bip-mtag">UI</span><span className="bip-mtag">Design</span></div>
                      <a href="https://github.com/robbin2102/yieldr-app/tree/main/app/demo" target="_blank" rel="noopener noreferrer" className="bip-view-code">Browse Pages →</a>
                    </div>
                  </div></div>

                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">Binance Derivatives Fetcher</div>
                    <div className="bip-mod-desc">8h settled funding rates + 1h predicted premium index (dual coverage). OI history at 15-minute granularity. Long/Short ratio tracking (global accounts + top positions). 7-day backfill on startup across all 100 tracked coins. Deployed to Railway.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags"><span className="bip-mtag">Railway</span><span className="bip-mtag">Data Infra</span></div>
                      <div className="bip-view-code-group">
                        <a href="https://github.com/robbin2102/yieldr-app/commit/5b3b15d" target="_blank" rel="noopener noreferrer" className="bip-view-code">View Code →</a>
                        <a href="https://github.com/robbin2102/yieldr-app/tree/main/services/binance-fetcher" target="_blank" rel="noopener noreferrer" className="bip-view-code">Browse Service →</a>
                      </div>
                    </div>
                  </div></div>

                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">AI Hedge Fund — Trader Profiler v2</div>
                    <div className="bip-mod-desc">Deep profiling of Polymarket traders: corrected win rate (closed + resolved open positions), cashFlow-based profit factor, ROCE per timeframe (1d/7d/15d/30d), PnL consistency scoring. Insider detection score, whale classification, category sub-leagues. Foundation for the bulk fund manager ranking pipeline.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags"><span className="bip-mtag ai">AI</span><span className="bip-mtag poly">Polymarket</span><span className="bip-mtag">Research</span></div>
                      <div className="bip-view-code-group">
                        <a href="https://github.com/robbin2102/yieldr-app/commit/fa03254" target="_blank" rel="noopener noreferrer" className="bip-view-code">View Code →</a>
                        <a href="https://github.com/robbin2102/yieldr-app/tree/main/scripts/ai-hedge-fund" target="_blank" rel="noopener noreferrer" className="bip-view-code">Browse Script →</a>
                      </div>
                    </div>
                  </div></div>
                </div>
              </div>

              {/* February 2026 */}
              <div className="bip-tl-month">
                <div className="bip-tl-month-hdr">
                  <span className="bip-tl-mname">February 2026</span>
                  <span className="bip-badge done">✓ Complete</span>
                  <span className="bip-badge milestone">🏆 Base Batches 002 Winner</span>
                </div>
                <div className="bip-vision-box"><strong>Product Vision (Feb 2026):</strong> An AI-native hedge fund platform with three agent roles — Quant, Trader, and PM — that level up every participant in DeFi. Retail users launch a Quant Agent to discover alpha, a Trader Agent to execute it, and a PM Agent to manage risk across their portfolio. Top traders launch onchain funds managed by agents: accept deposits, deploy capital within predefined risk parameters, and earn 2/20 hedge fund fees — entirely onchain.</div>
                <div className="bip-mod-list">
                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">Market Intelligence Service</div>
                    <div className="bip-mod-desc">Hourly technical data ingestion for top 100 crypto assets. TAAPI: 20+ indicators per coin (RSI, MACD, EMA 8/21/50/200, SMA, Bollinger Bands, ADX, Ichimoku, Supertrend, PSAR, Fibonacci, Squeeze Momentum, Swing High/Low, Pivot Points + 60 candlestick patterns). CoinGlass: liquidation data, taker volume, basis. Coinbase OHLCV candles. Daily macro: BTC/ETH ETF flows, Fear &amp; Greed, stablecoin mcap. Dynamic coin list: top 100 by OI (CoinGlass × TAAPI intersection). Deployed to Railway.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags"><span className="bip-mtag">Railway</span><span className="bip-mtag">LLM Tooling</span><span className="bip-mtag">Data Infra</span></div>
                      <div className="bip-view-code-group">
                        <a href="https://github.com/robbin2102/yieldr-app/commit/9170b00" target="_blank" rel="noopener noreferrer" className="bip-view-code">View Code →</a>
                        <a href="https://github.com/robbin2102/yieldr-app/tree/main/services/market-intelligence" target="_blank" rel="noopener noreferrer" className="bip-view-code">Browse Service →</a>
                      </div>
                    </div>
                  </div></div>

                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">MCP Server — Market Intelligence Tools (7 new tools)</div>
                    <div className="bip-mod-desc">get_market_snapshot (full technical + derivatives snapshot), fetch_live_indicator (real-time TAAPI on demand), get_macro_snapshot (ETF flows, Fear &amp; Greed, stablecoin mcap), get_funding_rate_history (8h settled), get_funding_rate_current (live + predicted 1h premium), get_derivatives_history (OI + L/S at 15m), get_coin_price (live spot). Full real-time market context for the AI agent.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags"><span className="bip-mtag">MCP</span><span className="bip-mtag ai">Claude AI</span><span className="bip-mtag">LLM Tooling</span></div>
                      <div className="bip-view-code-group">
                        <a href="https://github.com/robbin2102/yieldr-app/commit/0531350" target="_blank" rel="noopener noreferrer" className="bip-view-code">Macro + 3 tools →</a>
                        <a href="https://github.com/robbin2102/yieldr-app/commit/f892ff3" target="_blank" rel="noopener noreferrer" className="bip-view-code">Derivatives + Funding →</a>
                        <a href="https://github.com/robbin2102/yieldr-app/commit/2031f6d" target="_blank" rel="noopener noreferrer" className="bip-view-code">Price tool →</a>
                        <a href="https://github.com/robbin2102/yieldr-app/tree/main/services/mcp-server/src/tools/market" target="_blank" rel="noopener noreferrer" className="bip-view-code">Browse Tools →</a>
                      </div>
                    </div>
                  </div></div>

                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">Market Data Context Services (initial pipeline)</div>
                    <div className="bip-mod-desc">TAAPI bulk fetcher prototype with multi-batch candlestick pattern detection. Fibonacci/PSAR/Squeeze structure indicators via direct GET fallback. Per-coin test scripts. Foundation for the Market Intelligence Service above.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags"><span className="bip-mtag">LLM Tooling</span><span className="bip-mtag">Data Infra</span></div>
                      <div className="bip-view-code-group">
                        <a href="https://github.com/robbin2102/yieldr-app/commit/90c40be" target="_blank" rel="noopener noreferrer" className="bip-view-code">Multi-coin fetch →</a>
                        <a href="https://github.com/robbin2102/yieldr-app/commit/51cd4e2" target="_blank" rel="noopener noreferrer" className="bip-view-code">Structure indicators →</a>
                      </div>
                    </div>
                  </div></div>
                </div>
              </div>

              {/* January 2026 */}
              <div className="bip-tl-month">
                <div className="bip-tl-month-hdr">
                  <span className="bip-tl-mname">January 2026</span>
                  <span className="bip-badge done">✓ Complete</span>
                </div>
                <div className="bip-mod-list">
                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">Top Wallets Swap Monitoring</div>
                    <div className="bip-mod-desc">Avantis event listener: real-time on-chain trade event indexing (open/close/liquidation) via EventListener + EventCorrelator + MetricsComputer. Hyperliquid indexer: backfiller + live position tracking for top 1,500+ wallets.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags"><span className="bip-mtag">Base</span><span className="bip-mtag avantis">Avantis</span><span className="bip-mtag hl">Hyperliquid</span></div>
                      <div className="bip-view-code-group">
                        <a href="https://github.com/robbin2102/yieldr-app/tree/main/services/avantis-listener" target="_blank" rel="noopener noreferrer" className="bip-view-code">Avantis Listener →</a>
                        <a href="https://github.com/robbin2102/yieldr-app/tree/main/services/hyperliquid-indexer" target="_blank" rel="noopener noreferrer" className="bip-view-code">Hyperliquid Indexer →</a>
                      </div>
                    </div>
                  </div></div>

                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">Wallet Performance Metrics Service</div>
                    <div className="bip-mod-desc">Extended MetricsComputer: PnL consistency scoring, ROCE trending, trading-day frequency analysis. Per-wallet 30d metrics powering get_top_perp_traders MCP tool.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags"><span className="bip-mtag">Analytics</span><span className="bip-mtag">LLM Tooling</span></div>
                      <a href="https://github.com/robbin2102/yieldr-app/tree/main/services/mcp-server/src/tools/top-traders" target="_blank" rel="noopener noreferrer" className="bip-view-code">Browse Tools →</a>
                    </div>
                  </div></div>
                </div>
              </div>

              {/* December 2025 */}
              <div className="bip-tl-month">
                <div className="bip-tl-month-hdr">
                  <span className="bip-tl-mname">December 2025</span>
                  <span className="bip-badge done">✓ Complete</span>
                </div>
                <div className="bip-mod-list">
                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">Prediction Markets Monitoring</div>
                    <div className="bip-mod-desc">Top traders activity tracking on prediction markets.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags"><span className="bip-mtag poly">Polymarket</span></div>
                      <a href="https://github.com/robbin2102/yieldr-app/commit/d3f0549" target="_blank" rel="noopener noreferrer" className="bip-view-code">View Code →</a>
                    </div>
                  </div></div>
                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">Trending Tokens Service</div>
                    <div className="bip-mod-desc">Top 100 trending tokens monitoring on Base.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags"><span className="bip-mtag">Base</span><span className="bip-mtag">LLM Tooling</span></div>
                      <a href="https://github.com/robbin2102/yieldr-app/commit/b7c7986" target="_blank" rel="noopener noreferrer" className="bip-view-code">View Code →</a>
                    </div>
                  </div></div>
                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">Early Access Landing + Payments</div>
                    <div className="bip-mod-desc">Token purchase flow with wallet connect integration.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags" />
                      <a href="https://github.com/robbin2102/yieldr-app/commit/948e8e2" target="_blank" rel="noopener noreferrer" className="bip-view-code">View Code →</a>
                    </div>
                  </div></div>
                  <div className="bip-mod"><div className="bip-mod-dot bip-md-wip" /><div className="bip-mod-body">
                    <div className="bip-mod-name">AI Trading Test (Ongoing)</div>
                    <div className="bip-mod-desc">Continued $5K account testing with refined signals.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags"><span className="bip-mtag ai">Claude AI</span><span className="bip-mtag avantis">Avantis</span></div>
                    </div>
                    <div className="bip-trading-result">
                      <span className="bip-tr-lbl">Max DD:</span><span className="bip-tr-neg">−$450</span>
                      <span className="bip-tr-lbl" style={{marginLeft:'8px'}}>PnL (to date):</span><span className="bip-tr-pos">+$2,830</span>
                    </div>
                  </div></div>
                </div>
              </div>

              {/* November 2025 */}
              <div className="bip-tl-month">
                <div className="bip-tl-month-hdr">
                  <span className="bip-tl-mname">November 2025</span>
                  <span className="bip-badge done">✓ Complete</span>
                  <span className="bip-badge milestone">🏆 Base Batches 002 Finalist</span>
                </div>
                <div className="bip-vision-box"><strong>Product Vision (Nov 2025):</strong> AI-enabled decentralised asset management. Investors discover top traders and fund managers onchain. Traders validate performance, raise capital, and scale to fund management — powered by AI agents as the intelligence layer and smart contracts as the trust layer.</div>
                <div className="bip-mod-list">
                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">Real-time Trades Monitoring</div>
                    <div className="bip-mod-desc">Live trade feed service for top traders across perpetual protocols.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags"><span className="bip-mtag avantis">Avantis</span><span className="bip-mtag hl">Hyperliquid</span></div>
                      <a href="https://github.com/robbin2102/yieldr-app/commit/04b60e8" target="_blank" rel="noopener noreferrer" className="bip-view-code">View Code →</a>
                    </div>
                  </div></div>
                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">Performance Metrics Service</div>
                    <div className="bip-mod-desc">ROI, win rate, drawdown, Sharpe ratio calculations for trader ranking.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags"><span className="bip-mtag avantis">Avantis</span><span className="bip-mtag hl">Hyperliquid</span></div>
                      <a href="https://github.com/robbin2102/yieldr-app/commit/cb4b121" target="_blank" rel="noopener noreferrer" className="bip-view-code">View Code →</a>
                    </div>
                  </div></div>
                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">Liquidity Positions Analyzer</div>
                    <div className="bip-mod-desc">LP position tracking with IL calculations and fee earnings.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags"><span className="bip-mtag">Uniswap</span><span className="bip-mtag">Aerodrome</span></div>
                      <a href="https://github.com/robbin2102/yieldr-app/commit/703251b" target="_blank" rel="noopener noreferrer" className="bip-view-code">View Code →</a>
                    </div>
                  </div></div>
                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">AI Agents Architecture</div>
                    <div className="bip-mod-desc">Research and technical documentation for agent infrastructure.</div>
                    <div className="bip-mod-footer"><div className="bip-mod-tags"><span className="bip-mtag">Research</span></div></div>
                  </div></div>
                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">AI Trading Test (Continued)</div>
                    <div className="bip-mod-desc">$5K account with Claude AI + top trader signal integration.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags"><span className="bip-mtag ai">Claude AI</span><span className="bip-mtag avantis">Avantis</span></div>
                    </div>
                    <div className="bip-trading-result">
                      <span className="bip-tr-lbl">Max DD:</span><span className="bip-tr-zero">$0</span>
                      <span className="bip-tr-lbl" style={{marginLeft:'8px'}}>PnL:</span><span className="bip-tr-pos">+$11,847</span>
                    </div>
                  </div></div>
                </div>
              </div>

              {/* October 2025 */}
              <div className="bip-tl-month">
                <div className="bip-tl-month-hdr">
                  <span className="bip-tl-mname">October 2025</span>
                  <span className="bip-badge done">✓ Complete</span>
                  <span className="bip-badge milestone">🏆 Base Batches Submission</span>
                </div>
                <div className="bip-vision-box"><strong>Product Vision:</strong> Decentralized Asset Management. Investors discover top traders across perps &amp; liquidity markets and coinvest with them. Traders raise &amp; manage funds onchain with risk controls coded in smart contracts.</div>
                <div className="bip-mod-list">
                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">User Signup &amp; Onboarding</div>
                    <div className="bip-mod-desc">Wallet connection with automatic scanning for perps and liquidity positions.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags" />
                      <a href="https://github.com/robbin2102/yieldr-app/commit/516071e" target="_blank" rel="noopener noreferrer" className="bip-view-code">View Code →</a>
                    </div>
                  </div></div>
                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">Top Traders Indexing</div>
                    <div className="bip-mod-desc">Live position data indexing from perpetual protocols.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags"><span className="bip-mtag avantis">Avantis</span><span className="bip-mtag hl">Hyperliquid</span></div>
                      <a href="https://github.com/robbin2102/yieldr-app/commit/a729e9d" target="_blank" rel="noopener noreferrer" className="bip-view-code">View Code →</a>
                    </div>
                  </div></div>
                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">MVP v1.0 Deployment</div>
                    <div className="bip-mod-desc">Deployed on final day of submission (Oct 24).</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags"><span className="bip-mtag">GitHub</span></div>
                      <div className="bip-view-code-group">
                        <a href="https://github.com/robbin2102/yieldr-app/commit/50a4a07" target="_blank" rel="noopener noreferrer" className="bip-view-code">View Code →</a>
                        <a href="https://app.yieldr.org" target="_blank" rel="noopener noreferrer" className="bip-view-code">Legacy App →</a>
                      </div>
                    </div>
                  </div></div>
                  <div className="bip-mod"><div className="bip-mod-dot bip-md-done" /><div className="bip-mod-body">
                    <div className="bip-mod-name">AI Trading Test Launch</div>
                    <div className="bip-mod-desc">Claude AI-allocated $5K account for live perp trading validation.</div>
                    <div className="bip-mod-footer">
                      <div className="bip-mod-tags"><span className="bip-mtag ai">Claude AI</span><span className="bip-mtag avantis">Avantis</span></div>
                    </div>
                    <div className="bip-trading-result">
                      <span className="bip-tr-lbl">Max DD:</span><span className="bip-tr-neg">−$1,200</span>
                      <span className="bip-tr-lbl" style={{marginLeft:'8px'}}>PnL:</span><span className="bip-tr-pos">+$531</span>
                    </div>
                  </div></div>
                </div>
              </div>

            </div>{/* /tl */}
          </div>

          {/* ── 03 Roadmap ── */}
          <div className="bip-section">
            <div className="bip-sec-eyebrow">03 — Roadmap</div>
            <div className="bip-sec-title">What&apos;s next</div>
            <div className="bip-sec-sub">April – May 2026. No vaporware — only things actively being scoped.</div>
            <div className="bip-mod-list">
              <div className="bip-mod"><div className="bip-mod-dot bip-md-plan" /><div className="bip-mod-body">
                <div className="bip-mod-name">LLM Orchestration</div>
                <div className="bip-mod-desc">Bring all data modules together as a unified agent reasoning layer — market data, trader data, position context all flowing to a single decision-making agent.</div>
                <div className="bip-mod-footer"><div className="bip-mod-tags"><span className="bip-badge planned">Planned</span></div></div>
              </div></div>
              <div className="bip-mod"><div className="bip-mod-dot bip-md-plan" /><div className="bip-mod-body">
                <div className="bip-mod-name">Actionable Insights Engine</div>
                <div className="bip-mod-desc">Alpha generation from market + trader data combined. Move from &ldquo;here&apos;s what&apos;s happening&rdquo; to &ldquo;here&apos;s what to do about it.&rdquo;</div>
                <div className="bip-mod-footer"><div className="bip-mod-tags"><span className="bip-badge planned">Planned</span></div></div>
              </div></div>
              <div className="bip-mod"><div className="bip-mod-dot bip-md-plan" /><div className="bip-mod-body">
                <div className="bip-mod-name">AI Hedge Fund Pipeline</div>
                <div className="bip-mod-desc">Bulk trader profiling + fund manager ranking. Analyst, trader, and portfolio manager agents working in tandem. Trustless smart wallets (ERC-4337) for investor fund access.</div>
                <div className="bip-mod-footer"><div className="bip-mod-tags"><span className="bip-badge planned">Planned</span></div></div>
              </div></div>
              <div className="bip-mod"><div className="bip-mod-dot bip-md-plan" /><div className="bip-mod-body">
                <div className="bip-mod-name">YLDR Token Sale</div>
                <div className="bip-mod-desc">Tier 1 early access at $9M FDV. Token consumed by agent cycles — deflationary by design. No team/VC allocations until listing.</div>
                <div className="bip-mod-footer"><div className="bip-mod-tags"><span className="bip-badge planned">Planned</span></div></div>
              </div></div>
            </div>
          </div>

          {/* ── 04 AI Trading Performance ── */}
          <div className="bip-section">
            <div className="bip-sec-eyebrow">04 — AI Trading Performance</div>
            <div className="bip-sec-title">Live trading results</div>
            <div className="bip-sec-sub">The founder trades using Yieldr&apos;s own agent tooling on a live $5K account. Oct 2025 → present.</div>
            <div className="bip-bstrip">
              <div className="bip-bs"><div className="bip-bsl">Starting Capital</div><div className="bip-bsv w">$5,000</div><div className="bip-bss">Allocated Oct 2025</div></div>
              <div className="bip-bs-sep" />
              <div className="bip-bs"><div className="bip-bsl">Total PnL</div><div className="bip-bsv g">+$14,107</div><div className="bip-bss">Oct 25 – Feb 26</div></div>
              <div className="bip-bs-sep" />
              <div className="bip-bs"><div className="bip-bsl">Current Value</div><div className="bip-bsv g">$19,107</div><div className="bip-bss">as of Mar 2026</div></div>
              <div className="bip-bs-sep" />
              <div className="bip-bs"><div className="bip-bsl">All-time Max DD</div><div className="bip-bsv r">−$2,200</div><div className="bip-bss">Feb 2026</div></div>
            </div>
            <div className="bip-ledger-wrap">
              <table className="bip-ledger">
                <thead><tr><th>Month</th><th>PnL</th><th>Max DD</th><th>Balance</th></tr></thead>
                <tbody>
                  <tr><td>October 2025</td><td className="bip-lpos">+$531</td><td className="bip-lneg">−$1,200</td><td>$5,531</td></tr>
                  <tr><td>November 2025</td><td className="bip-lpos">+$11,847</td><td className="bip-lpos">$0</td><td>$17,378</td></tr>
                  <tr><td>December 2025</td><td className="bip-lpos">+$2,830</td><td className="bip-lneg">−$450</td><td>$19,677</td></tr>
                  <tr><td>January 2026</td><td className="bip-lpos">+$2,100</td><td className="bip-lneg">−$575</td><td>$21,777</td></tr>
                  <tr><td>February 2026</td><td className="bip-lneg">−$1,500</td><td className="bip-lneg">−$2,200</td><td>$19,107</td></tr>
                  <tr className="bip-ltotal"><td><strong>Total</strong></td><td className="bip-lpos"><strong>+$14,107</strong></td><td className="bip-lneg">−$2,200</td><td><strong>$19,107</strong></td></tr>
                </tbody>
              </table>
            </div>
            <div className="bip-note">All trades verifiable on-chain @Base · AI Trading Wallet: <a href="https://basescan.org/address/0x780BB763e1463D2236FEC780b7BD6ADb40AAa120" target="_blank" rel="noopener noreferrer">0x780BB763...Aa120</a> — owned by founder, used to fund project expense deficits.</div>
          </div>

          {/* ── 05 Treasury ── */}
          <div className="bip-section">
            <div className="bip-sec-eyebrow">05 — Treasury Accounting</div>
            <div className="bip-sec-title">Every dollar in and out.</div>
            <div className="bip-sec-sub">No investor capital. Bootstrapped from founder AI trading PnL and a Base grant.</div>
            <div className="bip-bstrip">
              <div className="bip-bs"><div className="bip-bsl">Total Expenses</div><div className="bip-bsv r">−$7,765</div><div className="bip-bss">Oct 25 – Feb 26</div></div>
              <div className="bip-bs-sep" />
              <div className="bip-bs"><div className="bip-bsl">Total Receipts</div><div className="bip-bsv g">+$5,000</div><div className="bip-bss">Base Batches Grant</div></div>
              <div className="bip-bs-sep" />
              <div className="bip-bs"><div className="bip-bsl">Avg Monthly Burn</div><div className="bip-bsv y">$1,553</div><div className="bip-bss">incl. hardware one-off</div></div>
              <div className="bip-bs-sep" />
              <div className="bip-bs"><div className="bip-bsl">Cash Balance</div><div className="bip-bsv r">−$2,765</div><div className="bip-bss">covered by founder</div></div>
            </div>
            <div className="bip-ledger-wrap">
              <table className="bip-ledger">
                <thead><tr><th>Category</th><th>Oct</th><th>Nov</th><th>Dec</th><th>Jan 26</th><th>Feb 26</th></tr></thead>
                <tbody>
                  <tr className="bip-lrec"><td>📥 Receipts</td><td>—</td><td>—</td><td className="bip-lpos">+$5,000</td><td>—</td><td>—</td></tr>
                  <tr className="bip-lcat"><td style={{paddingLeft:'20px'}}>Base Batches 002 Grant</td><td>—</td><td>—</td><td>$5,000</td><td>—</td><td>—</td></tr>
                  <tr><td>🤖 Claude Code</td><td className="bip-lneg">−$100</td><td className="bip-lneg">−$100</td><td className="bip-lneg">−$100</td><td className="bip-lneg">−$150</td><td className="bip-lneg">−$150</td></tr>
                  <tr><td>🗄️ Database</td><td className="bip-lneg">−$100</td><td className="bip-lneg">−$100</td><td className="bip-lneg">−$100</td><td className="bip-lneg">−$200</td><td className="bip-lneg">−$250</td></tr>
                  <tr><td>☁️ Servers</td><td className="bip-lneg">−$25</td><td className="bip-lneg">−$25</td><td className="bip-lneg">−$25</td><td className="bip-lneg">−$120</td><td className="bip-lneg">−$120</td></tr>
                  <tr><td>🏢 Office &amp; Utils</td><td className="bip-lneg">−$150</td><td className="bip-lneg">−$150</td><td className="bip-lneg">−$150</td><td className="bip-lneg">−$150</td><td className="bip-lneg">−$150</td></tr>
                  <tr><td>💻 Hardware</td><td>—</td><td className="bip-lneg">−$3,200</td><td>—</td><td className="bip-lneg">−$200</td><td>—</td></tr>
                  <tr className="bip-lcat"><td style={{paddingLeft:'20px'}}>Macbook + monitor terminals</td><td>—</td><td>−$3,200</td><td>—</td><td>−$200</td><td>—</td></tr>
                  <tr><td>👤 Payroll</td><td>$0</td><td>$0</td><td>$0</td><td>$0</td><td>$0</td></tr>
                  <tr><td>📢 Marketing</td><td>$0</td><td>$0</td><td>$0</td><td>$0</td><td>$0</td></tr>
                  <tr className="bip-ltotal"><td><strong>Monthly Net</strong></td><td className="bip-lneg">−$375</td><td className="bip-lneg">−$3,575</td><td className="bip-lpos">+$4,625</td><td className="bip-lneg">−$820</td><td className="bip-lneg">−$670</td></tr>
                  <tr className="bip-lbal"><td><strong>Running Balance</strong></td><td>−$375</td><td>−$3,950</td><td>+$675</td><td>−$145</td><td>−$815</td></tr>
                </tbody>
              </table>
            </div>
            <div className="bip-note">
              <strong>Note:</strong> Cash deficit covered by founder from AI trading PnL. Server costs increased Jan 26 with new Railway services. DB costs increased with Atlas → Railway migration complexity. Founder salary deferred. Treasury wallet: <a href="https://basescan.org/address/0xB56C6247F39A992dbcF172a4308386A23d0ea15C" target="_blank" rel="noopener noreferrer">0xB56C6247F39.....a15C</a>
            </div>
          </div>

        </div>{/* /main */}

        {/* ── Footer ── */}
        <footer className="bip-footer">
          <div className="bip-footer-row">DEED LABS CORP &nbsp;·&nbsp; DELAWARE C-CORP &nbsp;·&nbsp; BUILDING ON BASE</div>
          <div className="bip-footer-row">
            <a href="/">yieldr.xyz</a> &nbsp;·&nbsp;
            <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer">@yieldrdotorg</a> &nbsp;·&nbsp;
            <a href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer">GitHub</a> &nbsp;·&nbsp;
            <a href="https://discord.gg/k4XReWBT" target="_blank" rel="noopener noreferrer">Discord</a>
          </div>
          <div className="bip-footer-note">Updated monthly. All figures real. No sanitisation.</div>
        </footer>
      </div>
    </>
  );
}
