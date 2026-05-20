import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '../../components/Nav';
import Pager from '../../components/Pager';
import VizGrid from '../../components/VizGrid';
import { getProject, projects } from '../../data/projects';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title} — Tuan Truong Bui Anh`,
    description: p.tagline,
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  return (
    <>
      <Nav />
      <main id="top">
        <p className="crumb">
          <Link href="/#projects">{'← back to projects'}</Link>
        </p>

        <header className="proj-hero">
          <p className="eyebrow">
            {p.status} · {p.year}
            {p.role ? ` · ${p.role}` : ''}
          </p>
          <h1>{p.title}</h1>
          <p className="tagline">
            <em>{p.tagline}</em>
          </p>
          {p.team ? <p className="team-line">{p.team}</p> : null}
          <div className="proj-hero-foot">
            {p.repo ? (
              <a href={p.repo} target="_blank" rel="noopener noreferrer" className="ext">
                {''} View repository
              </a>
            ) : (
              <span className="ext-disabled">{''} Internal project — no public repo</span>
            )}
            {p.extraLinks?.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="ext">
                {''} {l.label}
              </a>
            ))}
          </div>
        </header>

        <section>
          <h2>Overview</h2>
          <p>{p.overview}</p>
          {p.highlights ? (
            <ul className="highlights">
              {p.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          ) : null}
        </section>

        <section>
          <h2>Architecture</h2>
          <p>{p.architecture.description}</p>
          <pre className="diagram" aria-label="architecture diagram">
            {p.architecture.diagram}
          </pre>
        </section>

        <section>
          <h2>Solution</h2>
          <ul className="solution-list">
            {p.solution.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Visualization</h2>
          <VizGrid items={p.visualization} />
        </section>

        <section>
          <h2>Tech Stack</h2>
          <div className="proj-stack big">
            {p.stack.map((s) => (
              <span key={s.label} className="chip">
                {s.ico ? <span className="ico">{s.ico}</span> : null}
                {s.label}
              </span>
            ))}
          </div>
        </section>

        <Pager slug={p.slug} />

        <footer>
          <p>
            <Link href="/#projects">{'← back to projects'}</Link>
          </p>
          <p className="sig">© {new Date().getFullYear()} tba.dev</p>
        </footer>
      </main>
    </>
  );
}
