import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';
import type { Metadata } from 'next';
import { ProvidersLayout } from './ProvidersLayout';

const TITLE = 'Yieldr — Agentic Trading Vaults';
const DESCRIPTION = 'AI agents trade prediction markets 24/7. Deposit into a vault and let the agent compound your returns. Live on Polymarket.';

export const metadata: Metadata = {
  metadataBase: new URL('https://yieldr.org'),
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
    url: 'https://yieldr.org/',
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