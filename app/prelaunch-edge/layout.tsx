import type { Metadata } from 'next';

const TITLE = 'Reserve Your Edge — Yieldr Genesis Access';
const DESCRIPTION = 'Lock Genesis pricing before Quant Agent launches in Q4 2026. One payment today, 1x–2x back in tokens at TGE — pay nothing else until Quant Terminal ships.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/prelaunch-edge',
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

export default function PrelaunchEdgeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
