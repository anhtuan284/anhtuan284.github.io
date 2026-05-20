'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Project } from '../data/projects';

const FILTERS = ['All', 'Production', 'Research', 'Award', 'Archived'] as const;
type Filter = (typeof FILTERS)[number];

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>('All');

  const filtered = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.status === filter)),
    [projects, filter]
  );

  return (
    <>
      <div className="filter-bar" role="tablist" aria-label="Filter projects by status">
        {FILTERS.map((f) => {
          const count = f === 'All' ? projects.length : projects.filter((p) => p.status === f).length;
          if (f !== 'All' && count === 0) return null;
          return (
            <button
              key={f}
              type="button"
              className="filter-btn"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f} <span style={{ opacity: 0.6 }}>· {count}</span>
            </button>
          );
        })}
      </div>

      <div className="projects-grid">
        {filtered.map((p) => (
          <article key={p.slug} className="proj">
            {p.cover ? (
              <Link href={`/projects/${p.slug}/`} className="proj-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover} alt={p.title} loading="lazy" />
              </Link>
            ) : (
              <Link href={`/projects/${p.slug}/`} className="proj-cover empty">
                <span className="proj-cover-ph">{p.title}</span>
              </Link>
            )}
            <div className="proj-head">
              <div className="proj-head-text">
                <p className="proj-year">{p.year}</p>
                <h3 className="proj-title">
                  <Link href={`/projects/${p.slug}/`}>{p.title}</Link>
                </h3>
              </div>
              <span className="proj-status">{p.status}</span>
            </div>
            <p className="proj-blurb">{p.tagline}</p>
            <div className="proj-stack">
              {p.stack.slice(0, 6).map((s) => (
                <span key={s.label} className="chip">
                  {s.ico ? <span className="ico">{s.ico}</span> : null}
                  {s.label}
                </span>
              ))}
              {p.stack.length > 6 ? <span className="chip more">+{p.stack.length - 6}</span> : null}
            </div>
            <div className="proj-foot">
              <Link href={`/projects/${p.slug}/`}>{'→ '}case study</Link>
              {p.repo ? (
                <a href={p.repo} target="_blank" rel="noopener noreferrer">
                  {''} repo
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
