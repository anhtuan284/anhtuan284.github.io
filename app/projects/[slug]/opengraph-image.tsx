import { ImageResponse } from 'next/og';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getProject, projects } from '../../data/projects';

export const dynamic = 'force-static';
export const alt = 'Project case study — Tuan Truong Bui Anh';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

async function loadFont(family: string, axes: string) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family}:${axes}`;
  const css = await fetch(cssUrl, {
    headers: { 'User-Agent': 'Mozilla/4.0' },
  }).then((r) => r.text());
  const url = css.match(/src:\s*url\((https:\/\/[^)]+)\)/)?.[1];
  if (!url) throw new Error(`Font url not found for ${family} ${axes}`);
  return fetch(url).then((r) => r.arrayBuffer());
}

export default async function ProjectOG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) {
    return new ImageResponse(<div style={{ display: 'flex' }}>404</div>, { ...size });
  }

  const [serif, serifBold, mono] = await Promise.all([
    loadFont('Source+Serif+4', 'wght@400'),
    loadFont('Source+Serif+4', 'wght@600'),
    loadFont('JetBrains+Mono', 'wght@400'),
  ]);

  let coverSrc: string | undefined;
  if (p.cover && /\.(png|jpe?g|webp)$/i.test(p.cover)) {
    try {
      const buf = await fs.readFile(path.join(process.cwd(), 'public', p.cover.replace(/^\//, '')));
      const ext = path.extname(p.cover).slice(1).toLowerCase().replace('jpg', 'jpeg');
      coverSrc = `data:image/${ext};base64,${buf.toString('base64')}`;
    } catch {}
  }

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
            ▌ {p.status.toUpperCase()} · {p.year}
            {p.role ? ` · ${p.role.toUpperCase()}` : ''}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                display: 'flex',
                fontSize: 72,
                lineHeight: 1.1,
                letterSpacing: -2,
                fontWeight: 600,
              }}
            >
              {p.title}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 26,
                color: '#a1a1a1',
                lineHeight: 1.35,
                fontStyle: 'italic',
              }}
            >
              {p.tagline}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {p.stack.slice(0, 6).map((s) => (
                <div
                  key={s.label}
                  style={{
                    display: 'flex',
                    padding: '6px 12px',
                    border: '1px solid #2a2a2a',
                    borderRadius: 6,
                    fontSize: 18,
                    fontFamily: 'JetBrains Mono',
                    color: '#fafafa',
                  }}
                >
                  {s.label}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              fontFamily: 'JetBrains Mono',
              fontSize: 20,
              color: '#6b6b6b',
            }}
          >
            <span style={{ color: '#fafafa' }}>ttba.dev</span>
            <span style={{ marginLeft: 18 }}>/ projects / {p.slug}</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 380,
            flexShrink: 0,
          }}
        >
          {coverSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverSrc}
              alt=""
              width={380}
              height={380}
              style={{
                borderRadius: 16,
                border: '1px solid #2a2a2a',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                width: 380,
                height: 380,
                borderRadius: 16,
                border: '1px solid #2a2a2a',
                background: 'linear-gradient(135deg, #111, #050505)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'JetBrains Mono',
                fontSize: 22,
                color: '#6b6b6b',
                letterSpacing: 2,
              }}
            >
              {p.slug.toUpperCase()}
            </div>
          )}
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
