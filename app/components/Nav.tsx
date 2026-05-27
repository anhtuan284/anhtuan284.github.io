'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const sections = ['about', 'skills', 'experience', 'projects', 'education', 'contact'];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [active, setActive] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [localTime, setLocalTime] = useState<string>('');
  const progressRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const tick = () => {
      const t = new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setLocalTime(t);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

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

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (progressRef.current) {
        progressRef.current.style.setProperty('--scroll', `${pct * 100}%`);
      }
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  const isDark = mounted
    ? theme === 'dark' ||
      (theme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
    : true;

  return (
    <>
    <nav className={`topnav${menuOpen ? ' menu-open' : ''}`}>
      <div className="topnav-inner">
        <Link href="/" className="brand-stack" onClick={() => setMenuOpen(false)}>
          <span className="brand-avatar" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/avatar.png" alt="" />
          </span>
          <span className="brand-meta">
            <span className="brand">
              Tuan T<span className="dot">.</span>B<span className="dot">.</span>A
              <span className="dot">.</span>
            </span>
            <span className="brand-role" suppressHydrationWarning>
              Mobile Engineer · HCMC{localTime ? ` · ${localTime} GMT+7` : ''}
            </span>
          </span>
        </Link>
        <div className="topnav-right">
          <ul className="nav-links">
            {sections.map((id) => (
              <li key={id}>
                <Link href={`/#${id}`} data-active={isHome && active === id ? 'true' : undefined}>
                  <span className="nav-link-text">{id}</span>
                </Link>
              </li>
            ))}
          </ul>
          <a href="mailto:dev.atuan03@gmail.com" className="cta-btn">
            <span className="cta-label">get in touch</span>
            <span className="cta-arrow" aria-hidden="true">→</span>
          </a>
          <button
            type="button"
            className="theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            aria-pressed={isDark}
            title={mounted ? (isDark ? 'Switch to light' : 'Switch to dark') : 'Toggle theme'}
            suppressHydrationWarning
          >
            <span suppressHydrationWarning>{mounted ? (isDark ? '☼' : '☾') : '☾'}</span>
          </button>
          <button
            type="button"
            className="menu-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="menu-bar" aria-hidden="true" />
            <span className="menu-bar" aria-hidden="true" />
          </button>
        </div>
        <span ref={progressRef} className="scroll-progress" aria-hidden="true" />
      </div>
    </nav>
    <div
      id="mobile-nav"
      className={`mobile-nav${menuOpen ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!menuOpen}
    >
        <ul>
          {sections.map((id, i) => (
            <li key={id} style={{ ['--i' as string]: i } as React.CSSProperties}>
              <Link
                href={`/#${id}`}
                onClick={() => setMenuOpen(false)}
                data-active={isHome && active === id ? 'true' : undefined}
              >
                <span className="mobile-nav-num">{String(i + 1).padStart(2, '0')}</span>
                {id}
              </Link>
            </li>
          ))}
      </ul>
    </div>
    </>
  );
}
