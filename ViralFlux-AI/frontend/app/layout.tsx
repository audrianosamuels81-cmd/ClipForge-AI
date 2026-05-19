import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'ViralFlux AI — Turn Long Videos Into Viral Shorts',
    template: '%s | ViralFlux AI',
  },
  description:
    'AI-powered platform that transforms long-form content into viral short-form clips for TikTok, Reels, and YouTube Shorts. Used by creators, podcasters, and agencies worldwide.',
  keywords: [
    'AI video editing',
    'short form content',
    'TikTok clips',
    'Instagram Reels',
    'YouTube Shorts',
    'viral clips',
    'AI content creation',
  ],
  openGraph: {
    title: 'ViralFlux AI — Turn Long Videos Into Viral Shorts',
    description:
      'AI-powered platform that transforms long-form content into viral short-form clips.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ViralFlux AI',
    description: 'Turn Long Videos Into Viral Shorts with AI',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
