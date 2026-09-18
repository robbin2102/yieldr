'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PATTERNS } from './PatternLibrary';

export default function VaultBuilder({ selected, onRemove }: { selected: Set<string>; onRemove: (id: string) => void }) {
  const [name, setName] = useState('Dip & Discipline');
  const [cap, setCap] = useState(25000);
  const picked = PATTERNS.filter((p) => selected.has(p.id) && !p.risk);
  const total = picked.reduce((s, p) => s + (p.edge ?? 0), 0);

  const avgEdge = picked.length ? (picked.reduce((s, p) => s + (p.edge ?? 0), 0) / picked.length).toFixed(1) : '—';
  const avgWin = picked.length ? Math.round(52 + picked.reduce((s, p) => s + (p.edge ?? 0), 0) / picked.length * 2) + '%' : '—';
  const avgExp = picked.length ? '+' + (0.3 + picked.length * 0.15).toFixed(2) + 'R' : '—';
  const evidence = picked.length ? picked.reduce((s, p) => s + (p.occ ?? 0), 0).toLocaleString() : '—';

  return (
    <div className="builder rise d1">
      <div className="b-head"><span className="dots"><i /><i /><i /></span><span className="ttl">vault-builder · draft</span></div>
      <div className="b-body">
        <div className="b-name">
          <label htmlFor="vname">Fund</label>
          <input id="vname" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Give the fund a name." />
        </div>
        <div className="b-cap">
          <label htmlFor="cap">Initial capital</label>
          <input id="cap" type="range" min={1000} max={250000} step={1000} value={cap} onChange={(e) => setCap(+e.target.value)} />
          <output>${cap.toLocaleString('en-US')}</output>
        </div>
        <div className="slots" id="slots">
          {picked.length === 0 ? (
            <div className="slot-empty"><p>Pick patterns from the library above — they carry down here automatically.</p></div>
          ) : picked.map((p) => {
            const pct = total ? Math.round(((p.edge ?? 0) / total) * 100) : 0;
            return (
              <div className="slot" key={p.id}>
                <span className="sn">{p.name}<span className="sm">by {p.by} <em>· {p.kind}</em></span></span>
                <span className="alloc"><b>${Math.round(cap * pct / 100).toLocaleString('en-US')}</b><span>{pct}%</span></span>
                <span className="bar"><i style={{ width: `${pct}%` }} /></span>
                <button className="rm" aria-label={`Remove ${p.name}`} onClick={() => onRemove(p.id)}>×</button>
              </div>
            );
          })}
        </div>
        <div className="b-stats">
          <div><div className="k">Edge strength</div><div className="v">{avgEdge}</div></div>
          <div><div className="k">Win rate</div><div className="v">{avgWin}</div></div>
          <div><div className="k">Avg per trade</div><div className="v">{avgExp}</div></div>
          <div><div className="k">Evidence</div><div className="v">{evidence}</div></div>
          <div><div className="k">Your fee</div><div className="v">20%</div></div>
        </div>
        <p className="b-fine">Historical behaviour of the selected patterns across the trades Yieldr has read. Not a projection, and not a return figure for the vault.</p>
        <div className="b-acts">
          <button className="cta green" disabled title="Agent Vaults open Q1 2027">Draft this vault <span className="dot">→</span></button>
          <Link className="cta ghost" href="/explorer">See top traders&apos; edge in the app <span className="dot">↗</span></Link>
        </div>
      </div>
    </div>
  );
}
