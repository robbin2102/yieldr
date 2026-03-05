import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';
import type { Metadata } from 'next';
import { ProvidersLayout } from './ProvidersLayout';

export const metadata: Metadata = {
  title: 'Yieldr - Every Trader Gets a Quant',
  description: 'Every DeFi trader gets a personal AI quant. Discover alpha, monitor positions 24/7, and pre-empt moves before they happen.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
    apple: '/apple-icon.png',
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