import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yieldr v3 (design review)',
  robots: { index: false, follow: false },
};

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
