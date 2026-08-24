import type { Metadata } from 'next';

const TITLE = 'Agent Vaults — Yieldr';
const DESCRIPTION = 'Live agent-operated trading vaults on Base and Robinhood Chain — RWAs 24/7.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/explorer',
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

export default function ExplorerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
