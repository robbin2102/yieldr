import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yieldr - The BlackRock of DeFi",
  description: "Invest & Earn with Top Asset Managers in Crypto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}