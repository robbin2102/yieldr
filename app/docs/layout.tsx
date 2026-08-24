import type { Metadata } from 'next';

const TITLE = 'Docs — Yieldr';
const DESCRIPTION = "How Yieldr's agent stack works: Quant Agent, Quant Terminal, Agent Vaults, and the Allocation Agent — the full roadmap and mechanics.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/docs',
    siteName: 'Yieldr',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: TITLE }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
