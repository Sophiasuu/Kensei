import type { Metadata, Viewport } from 'next';
import { Commissioner, Prata } from 'next/font/google';
import { LanguageProvider } from '@/context/LanguageContext';
import './globals.css';

const display = Prata({
  subsets: ['latin'],
  variable: '--font-brand-display',
  weight: ['400'],
});

const body = Commissioner({
  subsets: ['latin'],
  variable: '--font-brand-body',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Psychic Central | Ceremonial Multi-System Readings',
  description:
    'Instant ceremonial readings woven from Western astrology, Vedic astrology, Bazi, and numerology.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
