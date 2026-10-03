import type { Metadata, Viewport } from 'next';
import { Cinzel, Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-cinzel',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Raja Rani 🤴👸 | Royal Multiplayer Game',
  description: 'Raja Rani (King & Queen) - Royal Indian Multiplayer Deduction Game for 5 to 30 players',
  icons: {
    icon: '/crown-favicon.svg',
    apple: '/crown-favicon.svg',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Raja Rani',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#B58A42',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${outfit.variable}`}>
      <body className="bg-beige text-royal-brown selection:bg-coral-reef selection:text-cream min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
