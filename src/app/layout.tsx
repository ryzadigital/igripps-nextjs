import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'iGripps - Custom Football Socks for Football Clubs',
  description: 'Premium custom football socks with grip sole technology for football clubs. Professional quality, custom designs, fast turnaround.',
  keywords: ['football socks', 'grip socks', 'custom socks', 'Sydney football', 'sports socks'],
  authors: [{ name: 'iGripps' }],
  creator: 'iGripps',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'iGripps - Custom Football Socks',
    description: 'Premium custom football socks for football clubs, Sydney, low minumum order, fast turnaround.',
    url: 'https://igripps.com',
    siteName: 'iGripps',
    type: 'website',
    locale: 'en_AU',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#d1f286" />
      </head>
      <body className="font-sans bg-background text-foreground antialiased">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}