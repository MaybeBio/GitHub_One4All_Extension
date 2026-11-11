import type { Provider } from './types';
import { repoSlug } from './shared';

export const CONTEXT_PROVIDERS: Provider[] = [
  {
    id: 'gitingest',
    name: 'Gitingest',
    category: 'context',
    description: 'Repository digest as plain text',
    url: (ctx) => `https://gitingest.com/${repoSlug(ctx)}`,
    enabledByDefault: true,
    verified: true,
  },
  {
    id: 'gitmcp',
    name: 'GitMCP',
    category: 'context',
    description: 'Remote MCP server for the repo',
    url: (ctx) => `https://gitmcp.io/${repoSlug(ctx)}`,
    enabledByDefault: true,
    verified: true,
  },
  {
    id: 'uithub',
    name: 'uithub',
    category: 'context',
    description: 'LLM-ready text of the repository',
    url: (ctx) => `https://uithub.com/${repoSlug(ctx)}`,
    enabledByDefault: true,
    verified: true,
  },
  {
    id: 'gitmvp',
    name: 'GitMVP',
    category: 'context',
    description: 'Reverse-engineered rebuild prompt',
    url: (ctx) => `https://gitmvp.com/${repoSlug(ctx)}`,
    enabledByDefault: true,
    verified: true,
  },
];
