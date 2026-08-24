import type { Metadata } from 'next';

const TITLE = 'Become an Early Subscriber — Yieldr Genesis Access';
const DESCRIPTION = 'Become an early Yieldr subscriber and lock Genesis pricing today. One payment now, nothing charged again until Quant Terminal launches — plus 1x–2x back in tokens at TGE.';

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
