import type { Metadata, Viewport } from 'next';
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
    default: 'Tuan Truong Bui Anh — Mobile Engineer · HCMC',
    template: '%s — Tuan Truong Bui Anh',
  },
  description:
    'Mobile engineer in Ho Chi Minh City. Building Flutter + Firebase at PITEK. Before that, RAG pipelines at Azera. I like picking up the thing I don\'t know yet.',
  authors: [{ name: 'Tuan Truong Bui Anh', url: 'https://anhtuan284.github.io' }],
  creator: 'Tuan Truong Bui Anh',
  publisher: 'Tuan Truong Bui Anh',
  applicationName: 'ttba.dev',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Tuan Truong Bui Anh — Mobile Engineer · HCMC',
    description:
      'Mobile engineer in HCMC. Flutter + Firebase at PITEK. Backend, ML, mobile.',
    url: 'https://anhtuan284.github.io',
    siteName: 'ttba.dev',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tuan Truong Bui Anh — Mobile Engineer · HCMC',
    description: 'Mobile engineer in HCMC. Flutter + Firebase at PITEK.',
    creator: '@tuantba',
    site: '@tuantba',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#050505' },
  ],
  colorScheme: 'dark light',
};

const themeInit = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Tuan Truong Bui Anh',
  alternateName: 'ttba',
  url: 'https://anhtuan284.github.io',
  image: 'https://anhtuan284.github.io/portrait.png',
  jobTitle: 'Mobile Engineer',
  worksFor: { '@type': 'Organization', name: 'PITEK Joint Stock Company' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Ho Chi Minh City Open University' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ho Chi Minh City',
    addressCountry: 'VN',
  },
  email: 'mailto:dev.atuan03@gmail.com',
  sameAs: [
    'https://github.com/anhtuan284',
    'https://www.linkedin.com/in/tuantba',
  ],
  knowsAbout: ['Flutter', 'Firebase', 'Dart', 'Mobile Engineering', 'RAG', 'Backend'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={serif.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
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
