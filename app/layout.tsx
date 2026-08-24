import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';
import type { Metadata } from 'next';
import { ProvidersLayout } from './ProvidersLayout';

const TITLE = 'Yieldr — Agent Stack for Onchain Funds';
const DESCRIPTION = 'Discover your edge, convert it into a fund. The Quant Agent grades your onchain entries, exits, and sizing — join the waitlist to be first in when it launches.';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.yieldr.org'),
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#000000', color: '#FFFFFF' }}>
        <ProvidersLayout>{children}</ProvidersLayout>
      </body>
    </html>
  );
}