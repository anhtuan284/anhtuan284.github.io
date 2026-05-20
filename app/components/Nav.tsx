'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const sections = ['about', 'skills', 'experience', 'projects', 'education', 'contact'];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [active, setActive] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let resolved: 'light' | 'dark' | null = null;
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') resolved = stored;
    } catch {}
    setTheme(resolved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const els = sections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.2, 0.5, 1] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [isHome]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  const isDark = mounted
    ? theme === 'dark' ||
      (theme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
    : false;

  return (
    <nav className="topnav">
      <div className="topnav-inner">
        <Link href="/" className="brand">
          tba<span className="dot">.</span>dev
        </Link>
        <div className="topnav-right">
          <ul>
            {sections.map((id) => (
              <li key={id}>
                <Link href={`/#${id}`} data-active={isHome && active === id ? 'true' : undefined}>
                  {id}
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            title={mounted ? (isDark ? 'Switch to light' : 'Switch to dark') : 'Toggle theme'}
            suppressHydrationWarning
          >
            <span suppressHydrationWarning>{mounted ? (isDark ? '' : '') : ''}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
