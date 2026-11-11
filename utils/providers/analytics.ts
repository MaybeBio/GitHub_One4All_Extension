import type { Provider } from './types';
import { blobUrl, repoSlug } from './shared';

export const ANALYTICS_PROVIDERS: Provider[] = [
  {
    id: 'ossinsight',
    name: 'OSS Insight',
    category: 'analytics',
    description: 'Contributors, issues and trends',
    url: (ctx) => `https://ossinsight.io/analyze/${repoSlug(ctx)}`,
    enabledByDefault: true,
    verified: true,
  },
  {
    id: 'star-history',
    name: 'Star History',
    category: 'analytics',
    description: 'Star growth chart',
    url: (ctx) => `https://star-history.com/#${repoSlug(ctx)}&Date`,
    enabledByDefault: true,
    verified: true,
  },
  {
    id: 'github-gg',
    name: 'GitHub.gg',
    category: 'analytics',
    description: 'Quality and security dashboard',
    url: (ctx) => `https://github.gg/${repoSlug(ctx)}`,
    enabledByDefault: true,
    verified: true,
  },
  {
    id: 'active-forks',
    name: 'Active Forks',
    category: 'analytics',
    description: 'Most active forks of the repo',
    url: (ctx) => {
      const slug = repoSlug(ctx);
      return `https://techgaun.github.io/active-forks/index.html#${slug}`;
    },
    enabledByDefault: true,
    verified: true,
  },
  {
    id: 'git-history',
    name: 'Git History',
    category: 'analytics',
    description: 'Animated file history',
    url: (ctx) => {
      const blob = blobUrl(ctx);
      return blob ? blob.replace('https://github.com/', 'https://github.githistory.xyz/') : null;
    },
    enabledByDefault: true,
    verified: true,
  },
  {
    id: 'nbviewer',
    name: 'Nbviewer',
    category: 'analytics',
    description: 'Render Jupyter notebooks reliably',
    url: (ctx) => {
      const slug = repoSlug(ctx);
      const blob = blobUrl(ctx);
      if (blob) return blob.replace('https://github.com/', 'https://nbviewer.org/github/');
      return `https://nbviewer.org/github/${slug}`;
    },
    enabledByDefault: true,
    verified: true,
  },
];
