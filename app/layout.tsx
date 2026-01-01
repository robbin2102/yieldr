import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';
import type { Metadata } from 'next';
import { ProvidersLayout } from './ProvidersLayout';

export const metadata: Metadata = {
  title: 'Yieldr - AI for DeFi\'s Top 1%',
  description: 'AI-powered DeFi asset management. Agents that help you become better investors, traders & fund managers onchain.',
  icons: {
    icon: '/favicon.ico',
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