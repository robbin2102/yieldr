import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Yieldr - AI for DeFi\'s Top 1%',
  description: 'AI-powered DeFi asset management. Agents that help you become better investors, traders & fund managers onchain.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}