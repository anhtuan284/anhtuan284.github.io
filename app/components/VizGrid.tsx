'use client';

import { useCallback, useEffect, useState } from 'react';

type Item = { caption: string; src?: string; placeholder?: string };

export default function VizGrid({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);

  const step = useCallback(
    (dir: 1 | -1) => {
      setOpen((cur) => {
        if (cur === null) return cur;
        const imgItems = items.map((it, i) => (it.src ? i : -1)).filter((i) => i >= 0);
        if (imgItems.length === 0) return null;
        const pos = imgItems.indexOf(cur);
        const next = (pos + dir + imgItems.length) % imgItems.length;
        return imgItems[next];
      });
    },
    [items]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close, step]);

  const active = open !== null ? items[open] : null;

  return (
    <>
      <div className="viz-grid">
        {items.map((v, i) => (
          <figure key={i} className={`viz${v.src ? ' has-img' : ''}`}>
            <div
              className="viz-frame"
              role={v.src ? 'button' : undefined}
              tabIndex={v.src ? 0 : -1}
              onClick={() => v.src && setOpen(i)}
              onKeyDown={(e) => {
                if (v.src && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  setOpen(i);
                }
              }}
            >
              {v.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.src} alt={v.caption} loading="lazy" />
              ) : (
                <span className="viz-ph">{v.placeholder}</span>
              )}
            </div>
            <figcaption>{v.caption}</figcaption>
          </figure>
        ))}
      </div>

      {active && active.src ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          onClick={close}
        >
          <button className="lb-btn lb-close" onClick={close} aria-label="Close">
            {''}
          </button>
          <button
            className="lb-btn lb-prev"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous"
          >
            {''}
          </button>
          <button
            className="lb-btn lb-next"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next"
          >
            {''}
          </button>
          <figure className="lb-stage" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.src} alt={active.caption} />
            <figcaption>{active.caption}</figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
