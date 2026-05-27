import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tuan Truong Bui Anh — Mobile Engineer',
    short_name: 'ttba.dev',
    description: 'Mobile engineer in HCMC. Flutter + Firebase at PITEK.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#050505',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/avatar.png', sizes: '144x144', type: 'image/png' },
    ],
  };
}
