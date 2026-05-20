import type { Metadata } from 'next';
import { Source_Serif_4 } from 'next/font/google';
import './globals.css';

const serif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://anhtuan284.github.io'),
  title: {
    default: 'Tuan Truong Bui Anh',
    template: '%s — Tuan Truong Bui Anh',
  },
  description: 'Software developer based in Ho Chi Minh City — backend systems, ML pipelines, cross-platform apps.',
  authors: [{ name: 'Tuan Truong Bui Anh' }],
  openGraph: {
    title: 'Tuan Truong Bui Anh',
    description: 'Software developer based in Ho Chi Minh City.',
    url: 'https://anhtuan284.github.io',
    siteName: 'tba.dev',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Tuan Truong Bui Anh',
    description: 'Software developer based in Ho Chi Minh City.',
  },
  robots: { index: true, follow: true },
};

const themeInit = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={serif.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <link
          rel="preload"
          href="/fonts/jbm-nerd-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a href="#top" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
