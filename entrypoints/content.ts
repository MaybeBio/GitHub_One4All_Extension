import '../assets/content.css';
import { getEnabledProviders } from '../utils/providers/catalog';
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type CustomProvider,
  type Provider,
  type UrlContext,
} from '../utils/providers/types';
import { findActionMount } from '../utils/dom';
import { parseRepo, resolveRefFromDom, withResolvedRef } from '../utils/repo';
import { filterProviders } from '../utils/search';
import { loadState, subscribeState } from '../utils/storage';
import { isRepoPublic } from '../utils/visibility';

const BUTTON_ATTR = 'data-repo-tools-btn';

function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0] ?? '';
  if (words.length === 1) return Array.from(first).slice(0, 2).join('').toUpperCase();
  return words
    .map((word) => Array.from(word)[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default defineContentScript({
  matches: ['https://github.com/*/*'],
  runAt: 'document_idle',

  async main(ctx) {
    let enabledMap: Record<string, boolean> = {};
    let customs: CustomProvider[] = [];
    let currentContext: UrlContext | null = null;
    let refreshToken = 0;
    let lastUrl = location.href;
    let debounceTimer: ReturnType<typeof setTimeout> | undefined;
    let warnedMissingMount = false;

    function providerUrl(provider: Provider, context: UrlContext): string | null {
      try {
        return provider.url(context);
      } catch {
        return null;
      }
    }

    function closePanel(): void {
      const panel = document.querySelector<HTMLElement>(`[${BUTTON_ATTR}] .repo-tools-panel`);
      const button = document.querySelector<HTMLButtonElement>(`[${BUTTON_ATTR}] .repo-tools-btn`);
      if (panel) panel.hidden = true;
      button?.setAttribute('aria-expanded', 'false');
    }

    function removeButton(): void {
      document.querySelector(`[${BUTTON_ATTR}]`)?.remove();
      currentContext = null;
    }

    function renderList(list: HTMLElement, query: string): void {
      if (!currentContext) return;
      const context = currentContext;
      const enabled = getEnabledProviders(customs, enabledMap);
      const filtered = filterProviders(enabled, query);
      const fragment = document.createDocumentFragment();
      let count = 0;

      for (const category of CATEGORY_ORDER) {
        const items = filtered
          .filter((provider) => provider.category === category)
          .map((provider) => ({ provider, url: providerUrl(provider, context) }))
          .filter((item): item is { provider: Provider; url: string } => item.url !== null);
        if (items.length === 0) continue;

        const header = document.createElement('div');
        header.className = 'repo-tools-group';
        header.textContent = CATEGORY_LABELS[category];
        fragment.appendChild(header);

        for (const { provider, url } of items) {
          const link = document.createElement('a');
          link.className = 'repo-tools-item';
          link.href = url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.setAttribute('role', 'menuitem');

          const badge = document.createElement('span');
          badge.className = 'repo-tools-badge';
          badge.textContent = initials(provider.name);

          const name = document.createElement('span');
          name.className = 'repo-tools-name';
          name.textContent = provider.name;

          const description = document.createElement('span');
          description.className = 'repo-tools-desc';
          description.textContent = provider.description;

          link.append(badge, name, description);
          link.addEventListener('click', () => closePanel());
          fragment.appendChild(link);
          count += 1;
        }
      }

      list.replaceChildren(fragment);
      if (count === 0) {
        const empty = document.createElement('div');
        empty.className = 'repo-tools-empty';
        empty.textContent =
          filtered.length === 0 ? 'No tools match' : 'No tools available on this page';
        list.appendChild(empty);
      }
    }

    function refreshMenu(): void {
      const list = document.querySelector<HTMLElement>(`[${BUTTON_ATTR}] .repo-tools-list`);
      if (!list) return;
      const search = document.querySelector<HTMLInputElement>(`[${BUTTON_ATTR}] .repo-tools-search`);
      renderList(list, search?.value ?? '');
    }

    function buildButton(tag: 'li' | 'div'): HTMLElement {
      const item = document.createElement(tag);
      item.setAttribute(BUTTON_ATTR, '1');
      item.className = 'repo-tools-li';

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'repo-tools-btn btn btn-sm';
      button.setAttribute('aria-haspopup', 'menu');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Open Repo Tools');
      button.innerHTML =
        '<span class="repo-tools-rocket" aria-hidden="true">🚀</span> Repo Tools <span class="repo-tools-caret" aria-hidden="true">▾</span>';

      const panel = document.createElement('div');
      panel.className = 'repo-tools-panel';
      panel.setAttribute('role', 'menu');
      panel.hidden = true;

      const searchWrap = document.createElement('div');
      searchWrap.className = 'repo-tools-search-wrap';
      const search = document.createElement('input');
      search.type = 'search';
      search.className = 'repo-tools-search';
      search.placeholder = 'Search tools…';
      search.setAttribute('aria-label', 'Search tools');
      searchWrap.appendChild(search);

      const list = document.createElement('div');
      list.className = 'repo-tools-list';

      search.addEventListener('input', () => renderList(list, search.value));

      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const open = panel.hidden;
        panel.hidden = !open;
        button.setAttribute('aria-expanded', String(open));
        if (open) {
          renderList(list, search.value);
          search.focus();
        }
      });

      panel.append(searchWrap, list);
      item.append(button, panel);
      return item;
    }

    function inject(context: UrlContext): void {
      currentContext = context;
      if (getEnabledProviders(customs, enabledMap).length === 0) {
        removeButton();
        return;
      }

      const existing = document.querySelector<HTMLElement>(`[${BUTTON_ATTR}]`);
      if (existing) {
        refreshMenu();
        return;
      }

      const mount = findActionMount();
      if (!mount) {
        if (!warnedMissingMount) {
          console.debug('[repo-tools] no repository header anchor found; skipping injection');
          warnedMissingMount = true;
        }
        return;
      }
      warnedMissingMount = false;
      mount.parent.insertBefore(buildButton(mount.tag), mount.reference);
    }

    async function refresh(): Promise<void> {
      const token = ++refreshToken;
      const parsed = parseRepo(location.href, navigator.language);
      if (!parsed) {
        removeButton();
        return;
      }

      let context = parsed.context;
      if (parsed.tail) {
        const resolved = resolveRefFromDom(context.owner, context.repo, parsed.tail, document);
        if (resolved) context = withResolvedRef(context, resolved, parsed.tail);
      } else {
        const ref = resolveRefFromDom(context.owner, context.repo, '', document);
        if (ref) context = { ...context, ref };
      }

      const isPublic = await isRepoPublic(context.owner, context.repo);
      if (token !== refreshToken) return;
      if (!isPublic) {
        removeButton();
        return;
      }
      inject(context);
    }

    function scheduleRefresh(delay = 100): void {
      if (debounceTimer !== undefined) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        void refresh();
      }, delay);
    }

    const onDocumentClick = (event: MouseEvent): void => {
      const root = document.querySelector<HTMLElement>(`[${BUTTON_ATTR}]`);
      if (!root) return;
      if (!root.contains(event.target as Node)) closePanel();
    };

    const onDocumentKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') closePanel();
    };

    const initial = await loadState();
    enabledMap = initial.enabledProviders;
    customs = initial.customProviders;

    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onDocumentKeyDown);

    const unsubscribe = subscribeState((next) => {
      enabledMap = next.enabledProviders;
      customs = next.customProviders;
      if (getEnabledProviders(customs, enabledMap).length === 0) {
        removeButton();
        return;
      }
      if (document.querySelector(`[${BUTTON_ATTR}]`)) {
        refreshMenu();
      } else {
        scheduleRefresh(0);
      }
    });

    const observer = new MutationObserver(() => {
      if (document.querySelector(`[${BUTTON_ATTR}]`)) return;
      if (!parseRepo(location.href, navigator.language)) return;
      scheduleRefresh(150);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    const onNavigation = (): void => {
      if (location.href === lastUrl) return;
      lastUrl = location.href;
      closePanel();
      scheduleRefresh();
    };

    history.pushState = function (...args: Parameters<typeof history.pushState>) {
      originalPushState.apply(history, args);
      onNavigation();
    };
    history.replaceState = function (...args: Parameters<typeof history.replaceState>) {
      originalReplaceState.apply(history, args);
      onNavigation();
    };
    window.addEventListener('popstate', onNavigation);

    ctx.onInvalidated(() => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', onNavigation);
      document.removeEventListener('click', onDocumentClick);
      document.removeEventListener('keydown', onDocumentKeyDown);
      observer.disconnect();
      unsubscribe();
      if (debounceTimer !== undefined) clearTimeout(debounceTimer);
      removeButton();
    });

    await refresh();
  },
});
