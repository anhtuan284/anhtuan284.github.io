import { ImageResponse } from 'next/og';
import fs from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-static';
export const alt = 'Tuan Truong Bui Anh — Mobile engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function loadFont(family: string, axes: string) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family}:${axes}`;
  const css = await fetch(cssUrl, {
    headers: { 'User-Agent': 'Mozilla/4.0' },
  }).then((r) => r.text());
  const url = css.match(/src:\s*url\((https:\/\/[^)]+)\)/)?.[1];
  if (!url) throw new Error(`Font url not found for ${family} ${axes}`);
  return fetch(url).then((r) => r.arrayBuffer());
}

export default async function OG() {
  const [serif, serifBold, mono, portraitBuf] = await Promise.all([
    loadFont('Source+Serif+4', 'wght@400'),
    loadFont('Source+Serif+4', 'wght@600'),
    loadFont('JetBrains+Mono', 'wght@400'),
    fs.readFile(path.join(process.cwd(), 'public/portrait.png')),
  ]);
  const portrait = `data:image/png;base64,${portraitBuf.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          padding: '64px 72px',
          background: '#050505',
          color: '#fafafa',
          fontFamily: 'Source Serif 4',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            paddingRight: 48,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 20,
              letterSpacing: 2,
              color: '#a1a1a1',
              fontFamily: 'JetBrains Mono',
            }}
          >
            ▌ MOBILE_ENGINEER · HCMC · OPEN_TO_WORK
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                fontSize: 96,
                lineHeight: 1.15,
                letterSpacing: -3,
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
                fontSize: 26,
                color: '#a1a1a1',
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
              fontSize: 20,
              color: '#6b6b6b',
            }}
          >
            <span style={{ color: '#fafafa' }}>ttba.dev</span>
            <span>github · linkedin · mail</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 420,
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={portrait}
            alt=""
            width={420}
            height={420}
            style={{
              borderRadius: '50%',
              border: '1px solid #2a2a2a',
              objectFit: 'cover',
            }}
          />
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
