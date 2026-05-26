import type { Metadata } from 'next';
import { Source_Serif_4 } from 'next/font/google';
import './globals.css';
import CursorGlow from './components/CursorGlow';

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
  description:
    'Mobile engineer in Ho Chi Minh City. Building Flutter + Firebase at PITEK. Before that, RAG pipelines at Azera. I like picking up the thing I don\'t know yet.',
  authors: [{ name: 'Tuan Truong Bui Anh' }],
  openGraph: {
    title: 'Tuan Truong Bui Anh',
    description:
      'Mobile engineer in HCMC. Flutter + Firebase at PITEK. Backend, ML, mobile.',
    url: 'https://anhtuan284.github.io',
    siteName: 'ttba.dev',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tuan Truong Bui Anh',
    description: 'Mobile engineer in HCMC. Flutter + Firebase at PITEK.',
  },
  robots: { index: true, follow: true },
};

const themeInit = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={serif.variable} suppressHydrationWarning>
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
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
