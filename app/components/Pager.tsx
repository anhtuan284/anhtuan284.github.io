import Link from 'next/link';
import { projects } from '../data/projects';

export default function Pager({ slug }: { slug: string }) {
  const i = projects.findIndex((p) => p.slug === slug);
  const prev = i > 0 ? projects[i - 1] : null;
  const next = i >= 0 && i < projects.length - 1 ? projects[i + 1] : null;

  return (
    <nav className="pager" aria-label="Project navigation">
      {prev ? (
        <Link href={`/projects/${prev.slug}/`} className="prev">
          <span className="pg-label">← Previous</span>
          <span className="pg-title">{prev.title}</span>
        </Link>
      ) : (
        <span className="empty" />
      )}
      {next ? (
        <Link href={`/projects/${next.slug}/`} className="next">
          <span className="pg-label">Next →</span>
          <span className="pg-title">{next.title}</span>
        </Link>
      ) : (
        <span className="empty" />
      )}
    </nav>
  );
}
