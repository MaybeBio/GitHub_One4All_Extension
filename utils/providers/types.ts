export type CategoryId = 'ai' | 'context' | 'ide' | 'analytics' | 'builtin' | 'custom';

export type PageType = 'root' | 'tree' | 'blob';

export interface UrlContext {
  owner: string;
  repo: string;
  pageType: PageType;
  ref?: string;
  path?: string;
  repoUrl: string;
  language: string;
}

export interface Provider {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  url: (ctx: UrlContext) => string | null;
  enabledByDefault: boolean;
  verified: boolean;
}

export interface CustomProvider {
  id: string;
  name: string;
  description?: string;
  urlTemplate: string;
}

export const CATEGORY_ORDER: readonly CategoryId[] = [
  'ai',
  'context',
  'ide',
  'analytics',
  'builtin',
  'custom',
];

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  ai: 'AI docs & Q&A',
  context: 'LLM context & MCP',
  ide: 'IDE & sandbox',
  analytics: 'Analytics & visualization',
  builtin: 'GitHub built-ins',
  custom: 'Custom',
};
