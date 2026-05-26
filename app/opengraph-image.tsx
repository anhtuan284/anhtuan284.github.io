import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const alt = 'Tuan Truong Bui Anh — Mobile engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function loadFont(family: string, weight: number) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`;
  const css = await fetch(cssUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    },
  }).then((r) => r.text());
  const url = css.match(/src:\s*url\((https:\/\/[^)]+)\)/)?.[1];
  if (!url) throw new Error(`Font url not found for ${family} ${weight}`);
  return fetch(url).then((r) => r.arrayBuffer());
}

export default async function OG() {
  const [serif, serifBold, mono] = await Promise.all([
    loadFont('Source+Serif+4', 400),
    loadFont('Source+Serif+4', 600),
    loadFont('JetBrains+Mono', 400),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#050505',
          color: '#fafafa',
          fontFamily: 'Source Serif 4',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            letterSpacing: 2,
            color: '#a1a1a1',
            fontFamily: 'JetBrains Mono',
          }}
        >
          ▌ MOBILE_ENGINEER · HCMC · OPEN_TO_WORK
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              fontSize: 128,
              lineHeight: 1,
              letterSpacing: -4,
              fontWeight: 600,
            }}
          >
            <span>Tuan&nbsp;</span>
            <span
              style={{
                backgroundImage: 'linear-gradient(90deg, #fafafa, #6b6b6b)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Truong Bui&nbsp;
            </span>
            <span>Anh.</span>
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 30,
              color: '#a1a1a1',
              maxWidth: 980,
              lineHeight: 1.35,
            }}
          >
            Mobile engineer in HCMC. Flutter + Firebase at PITEK. Backend, ML, mobile.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'JetBrains Mono',
            fontSize: 22,
            color: '#6b6b6b',
          }}
        >
          <span style={{ color: '#fafafa' }}>ttba.dev</span>
          <span>github · linkedin · mail</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Source Serif 4', data: serif, weight: 400, style: 'normal' },
        { name: 'Source Serif 4', data: serifBold, weight: 600, style: 'normal' },
        { name: 'JetBrains Mono', data: mono, weight: 400, style: 'normal' },
      ],
    },
  );
}
