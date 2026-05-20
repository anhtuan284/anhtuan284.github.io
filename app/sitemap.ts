import type { MetadataRoute } from 'next';
import { projects } from './data/projects';

export const dynamic = 'force-static';

const BASE = 'https://anhtuan284.github.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...projects.map((p) => ({
      url: `${BASE}/projects/${p.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
