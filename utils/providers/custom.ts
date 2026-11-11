import type { CustomProvider, Provider, UrlContext } from './types';

export function validateCustomTemplate(template: string): string | null {
  const value = template.trim();
  if (!value) return 'URL template is required.';
  if (!/^https:\/\//i.test(value)) return 'URL must start with https://';
  if (!value.includes('{owner}') && !value.includes('{repo}')) {
    return 'Add {owner} or {repo} to the template.';
  }
  return null;
}

export function buildCustomUrl(template: string, ctx: UrlContext): string {
  return template
    .replaceAll('{owner}', encodeURIComponent(ctx.owner))
    .replaceAll('{repo}', encodeURIComponent(ctx.repo));
}

export function customToProvider(custom: CustomProvider): Provider {
  return {
    id: custom.id,
    name: custom.name,
    category: 'custom',
    description: custom.description?.trim() || 'Custom tool',
    url: (ctx) => buildCustomUrl(custom.urlTemplate, ctx),
    enabledByDefault: true,
    verified: true,
  };
}

export function createCustomProvider(name: string, urlTemplate: string): CustomProvider {
  const slug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 24) || 'tool';
  return {
    id: `custom-${slug}-${Date.now().toString(36)}`,
    name: name.trim(),
    urlTemplate: urlTemplate.trim(),
  };
}
