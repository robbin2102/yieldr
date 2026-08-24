import type { Metadata } from 'next';

const TITLE = 'Build in Public — Yieldr';
const DESCRIPTION = 'Real treasury data, live trading performance, and weekly build logs — Yieldr, built solo and in public.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/build-in-public',
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

export default function BuildInPublicLayout({ children }: { children: React.ReactNode }) {
  return children;
}
