import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import { LanguageProvider } from '@/context/LanguageContext';
import Splash from '@/components/Splash';
import './globals.css';

const cormorant = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-cormorant', weight: ['400', '600'], style: ['normal', 'italic'] });
const jost = Jost({ subsets: ['latin'], variable: '--font-jost', weight: ['300', '400', '500', '600'] });

export const metadata: Metadata = {
  title: 'Psychic Central — Your Complete Cosmic Blueprint',
  description: 'A unified reading across Western Astrology, Vedic Astrology, Bazi Four Pillars, and Numerology.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        <Splash />
        <div className="splash-content">
          <LanguageProvider>{children}</LanguageProvider>
        </div>
      </body>
    </html>
  );
}
