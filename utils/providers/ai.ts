import type { Provider } from './types';
import { repoSlug } from './shared';

export const AI_PROVIDERS: Provider[] = [
  {
    id: 'deepwiki',
    name: 'DeepWiki',
    category: 'ai',
    description: 'AI-generated repository wiki and Q&A',
    url: (ctx) => `https://deepwiki.com/${repoSlug(ctx)}`,
    enabledByDefault: true,
    verified: true,
  },
  {
    id: 'codewiki',
    name: 'CodeWiki',
    category: 'ai',
    description: 'Google code wiki for the repository',
    url: (ctx) => `https://codewiki.google/github.com/${repoSlug(ctx)}`,
    enabledByDefault: true,
    verified: true,
  },
  {
    id: 'zread',
    name: 'Zread',
    category: 'ai',
    description: 'Chinese deep code walkthrough',
    url: (ctx) => `https://zread.ai/${repoSlug(ctx)}`,
    enabledByDefault: true,
    verified: true,
  },
  {
    id: 'readmex',
    name: 'Readmex',
    category: 'ai',
    description: 'Structured documentation for the repo',
    url: (ctx) => {
      const prefix = ctx.language.toLowerCase().startsWith('zh') ? '' : 'en-US/';
      return `https://readmex.com/${prefix}${repoSlug(ctx)}`;
    },
    enabledByDefault: true,
    verified: true,
  },
  {
    id: 'gitdiagram',
    name: 'GitDiagram',
    category: 'ai',
    description: 'Interactive architecture diagram',
    url: (ctx) => `https://gitdiagram.com/${repoSlug(ctx)}`,
    enabledByDefault: true,
    verified: true,
  },
  {
    id: 'repowise',
    name: 'Repowise',
    category: 'ai',
    description: 'Architecture wiki and code health',
    url: (ctx) => `https://repowise.dev/repo/${repoSlug(ctx)}`,
    enabledByDefault: true,
    verified: true,
  },
  {
    id: 'talktogithub',
    name: 'TalkToGitHub',
    category: 'ai',
    description: 'Chat with the repository',
    url: (ctx) => `https://talktogithub.com/${repoSlug(ctx)}`,
    enabledByDefault: true,
    verified: true,
  },
  {
    id: 'gitpodcast',
    name: 'GitPodcast',
    category: 'ai',
    description: 'Turn the repository into a podcast',
    url: (ctx) => `https://gitpodcast.com/${repoSlug(ctx)}`,
    enabledByDefault: true,
    verified: true,
  },
  {
    id: 'explaingithub',
    name: 'ExplainGitHub',
    category: 'ai',
    description: 'Q&A walkthrough of the codebase',
    url: (ctx) => `https://explaingithub.com/${repoSlug(ctx)}`,
    enabledByDefault: true,
    verified: true,
  },
];
