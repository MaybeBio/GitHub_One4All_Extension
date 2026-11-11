# GitHub One4All Extension — Design

Date: 2026-11-11
Status: Approved for implementation planning

## 1. Goal and success criteria

A Chromium Manifest V3 extension that injects a single **`🚀 One4All ▾`** button into every public GitHub repository page. Clicking it opens a grouped, searchable dropdown that links to third-party GitHub-derived sites (DeepWiki, GitDiagram, Gitingest, GitMCP, GitHub.dev, OSS Insight, …) and a few GitHub built-in shortcuts, resolved from the current repository URL.

Success criteria:

- Exactly one button appears on public repo pages (`github.com/<owner>/<repo>` and its tab/file pages), including after SPA navigation.
- The menu contains all enabled providers, grouped by category, and can be filtered by search.
- Every provider marked `verified` opens its expected destination; unverified ones are visibly marked and disabled by default.
- No button on private repos or non-repo GitHub pages.
- Settings (enabled providers, custom providers) persist in `storage.sync` and update open GitHub tabs live.
- No console errors and no duplicate DOM nodes/listeners after repeated repo navigation.

## 2. Decisions

| Topic | Decision |
|---|---|
| Interaction | Single aggregate button + dropdown (not split button, not per-category buttons) |
| Menu | Grouped categories with headers + top search field; no two-level flyout |
| Catalog | Include all README sites; verify each during implementation; unverified default off |
| Language | Full English UI; provider names unchanged |
| Privacy | Hide button entirely on private repositories |
| Stack | WXT + TypeScript (strict), Manifest V3, Chromium only |
| Architecture | Single declarative provider catalog driving content script, search, and popup |
| Background | No background service worker in v1 |
| Extras | Settings popup + custom providers only; no favorites, hotkey, badge, remote catalog |

## 3. Architecture

```
entrypoints/
  content.ts              # injects button + menu into GitHub repo pages
  popup/
    index.html
    main.ts               # settings UI: toggles, custom providers, reset
utils/
  repo.ts                 # URL parsing, page type, ref/path resolution, visibility
  storage.ts             # storage.sync read/merge/subscribe helpers
  search.ts              # pure filter function
  providers/
    types.ts             # Provider, UrlContext, CategoryId, CustomProvider
    ai.ts
    context.ts
    ide.ts
    analytics.ts
    builtin.ts
    custom.ts            # merge/validate user-defined providers
    catalog.ts           # aggregates and exports the ordered catalog
```

Data flow:

1. Content script parses `owner`/`repo`/`pageType`/`ref`/`path` from `location`.
2. It resolves repository visibility. Private → stop; nothing is injected.
3. It loads `storage.sync` state, merges built-ins with custom providers, filters by enabled state, and injects the button.
4. On menu open, provider URLs are generated from the live `UrlContext`; search filters the rendered set.
5. Clicking an item opens the URL in a new tab and closes the menu.
6. Popup writes settings; `storage.onChanged` makes content scripts re-render without a page reload.
7. SPA navigation (patched `history.pushState` + `popstate` + `MutationObserver`) removes and re-injects the button.

No background worker: `action.default_popup` opens the settings UI directly. Popup queries the active tab for the repo chip using `tabs` permission.

## 4. Data model

```ts
type CategoryId = 'ai' | 'context' | 'ide' | 'analytics' | 'builtin' | 'custom';

interface UrlContext {
  owner: string;
  repo: string;
  pageType: 'root' | 'tree' | 'blob';
  ref?: string;        // current branch/tag/commit when resolvable
  path?: string;       // file or directory path after ref
  repoUrl: string;     // https://github.com/<owner>/<repo>
  language: string;    // navigator.language, injected so transforms stay pure/testable
}

interface Provider {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  url: (ctx: UrlContext) => string | null; // null = not applicable on this page
  enabledByDefault: boolean;
  verified: boolean;
}

interface CustomProvider {
  id: string;
  name: string;
  description?: string; // optional; menu shows the name alone when absent
  urlTemplate: string;  // supports {owner} and {repo}
}
```

`storage.sync` schema:

- `enabledProviders: Record<string, boolean>` — missing key falls back to `enabledByDefault`.
- `customProviders: CustomProvider[]` — merged after built-ins, category `custom`, enabled by default.

Visibility check caches in `storage.local` (accessible to content scripts without a background worker): `visibility:<owner>/<repo>` → `{ isPrivate: boolean, ts: number }`.

## 5. URL context and page applicability

- Parse `owner`/`repo` from `^https://github\.com/([^/?#]+)/([^/?#]+)`.
- Require at least two path segments and skip reserved first segments that are not repositories: `settings`, `orgs`, `topics`, `trending`, `explore`, `marketplace`, `notifications`, `sponsors`, `features`, `pricing`, `about`, `apps`, `site`, `collections`, `events`, `readme`, `security`, `enterprise`, `customer-stories`. Profiles (`/user`) fail the two-segment requirement.
- Page type from the first path segment after the repo: none → `root`, `tree` → `tree`, `blob` → `blob`.
- `ref`/`path` resolution: prefer the current ref exposed by GitHub's branch/ref UI in the page header; fall back to URL splitting only when unambiguous. Branch names may contain slashes, so URL-only parsing is not trusted.
- File-scoped providers (`Git History`, `Nbviewer`, `Plain view`) return `null` when `pageType !== 'blob'` or `ref`/`path` cannot be resolved.
- `Download Directory` needs a folder URL: use the current page URL on `tree`/`root` (strip query/hash), otherwise `repoUrl`.
- `Archive ZIP` requires a resolved `ref`; return `null` when absent. Do not guess `main`/`master`.
- All URLs are URL-encoded per segment where templates interpolate user-controlled `ref`/`path`.

## 6. Provider catalog

Initial `verified` flags reflect evidence from the reference templates only. During the verification pass, every row is opened against a known public repository (e.g. `facebook/react`) and flags are corrected in `docs/provider-verification.md`.

### AI docs & Q&A (`ai`)

| Provider | URL template | Applicability | Initial verified |
|---|---|---|---|
| DeepWiki | `https://deepwiki.com/{owner}/{repo}` | all | yes |
| CodeWiki | `https://codewiki.google/github.com/{owner}/{repo}` | all | yes |
| Zread | `https://zread.ai/{owner}/{repo}` | all | yes |
| Readmex | `https://readmex.com/{prefix}{owner}/{repo}` — `prefix` is empty when `ctx.language` starts with `zh`, otherwise `en-US/` | all | yes |
| GitDiagram | `https://gitdiagram.com/{owner}/{repo}` | all | yes |
| TalkToGitHub | `https://talktogithub.com/{owner}/{repo}` | all | yes |
| Repowise | `https://repowise.dev/{owner}/{repo}` | all | no |
| GitPodcast | `https://gitpodcast.com/{owner}/{repo}` | all | no |
| ExplainGitHub | `https://explaingithub.com/{owner}/{repo}` | all | no (host inferred) |

### LLM context & MCP (`context`)

| Provider | URL template | Applicability | Initial verified |
|---|---|---|---|
| Gitingest | `https://gitingest.com/{owner}/{repo}` | all | yes |
| GitMCP | `https://gitmcp.io/{owner}/{repo}` | all | yes |
| uithub | `https://uithub.com/{owner}/{repo}` | all | no |
| Repomix | `https://repomix.com/{owner}/{repo}` | all | no |
| GitMVP | `https://gitmvp.com/{owner}/{repo}` | all | no |

GitReverse is excluded: README gives no usable endpoint.

### IDE & sandboxes (`ide`)

| Provider | URL template | Applicability | Initial verified |
|---|---|---|---|
| GitHub.dev | `https://github.dev/{owner}/{repo}` | all | yes |
| GitHub1s | `https://github1s.com/{owner}/{repo}` | all | no |
| StackBlitz | `https://stackblitz.com/github/{owner}/{repo}` | all | yes |
| CodeSandbox | `https://githubbox.com/{owner}/{repo}` (alt `https://codesandbox.io/s/github/{owner}/{repo}`) | all | yes |
| Gitpod | `https://gitpod.io/#https://github.com/{owner}/{repo}` | all | yes |
| VS Code Web | `https://vscode.dev/github/{owner}/{repo}` | all | yes |
| pr.new | `https://pr.new/https://github.com/{owner}/{repo}` | all | no |
| Codespaces | `https://codespaces.new/{owner}/{repo}` | all | no |
| Bolt.new | `https://bolt.new/github.com/{owner}/{repo}` | all | no |

### Analytics & visualization (`analytics`)

| Provider | URL template | Applicability | Initial verified |
|---|---|---|---|
| OSS Insight | `https://ossinsight.io/analyze/{owner}/{repo}` | all | no |
| Star History | `https://star-history.com/#{owner}/{repo}&Date` | all | no |
| GitHub.gg | `https://github.gg/{owner}/{repo}` | all | no |
| Active Forks | `https://techgaun.github.io/active-forks/index.html#{owner}/{repo}` | all | no |
| Git History | `https://github.githistory.xyz/{owner}/{repo}/blob/{ref}/{path}` | blob only | no |
| Nbviewer | `https://nbviewer.org/github/{owner}/{repo}` (root) / `.../blob/{ref}/{path}` (blob) | root/blob | no |

Git-Stats, Socket.dev and Snyk Advisor are excluded: they require manual input, not a URL transform.

### GitHub built-ins (`builtin`)

| Tool | URL | Applicability | Initial verified |
|---|---|---|---|
| Download Directory | `https://download-directory.github.io/?url=<encoded folder URL>` | root/tree | no |
| Archive ZIP | `https://github.com/{owner}/{repo}/archive/{ref}.zip` (works for branches, tags, and commits) | needs resolved ref | no |
| Plain view | current blob URL without query/hash + `?plain=1` | blob | no |
| Releases feed | `https://github.com/{owner}/{repo}/releases.atom` | all | no |
| Commits feed | `https://github.com/{owner}/{repo}/commits.atom` | all | no |

## 7. UI specification

### Button and menu

- Inject `<li data-repo-tools-btn>` at the start of `.pagehead-actions`; visual style uses GitHub's `btn btn-sm`.
- Label: `🚀 One4All ▾`.
- Panel: width 320px, max-height 420px, anchored right under the button, z-index above GitHub chrome.
- When open: focus the search input; Esc, outside click, or a second button click closes it. Only one panel exists.
- Search: case-insensitive substring match over name, description, and category label; empty result shows “No tools match”.
- Rows: two-letter initials badge + provider name + muted short description; hover/active highlight; click opens a new tab via `window.open(url, '_blank', 'noopener,noreferrer')` and closes the panel.
- Group headers in catalog order; custom providers under “Custom”.
- Icon badges are generated from names — no remote favicon requests.

### Styling and accessibility

- CSS custom properties for all colors; light defaults, `html[data-color-mode="dark"]` overrides, `@media (prefers-color-scheme: dark)` fallback; `!important` where GitHub button rules conflict.
- Respect `prefers-reduced-motion`.
- `aria-haspopup="menu"`, `aria-expanded`, `aria-label` on the button; `role="menu"` on the panel; rows are focusable and close on `Escape`.
- Deduplicate by the `data-repo-tools-btn` attribute.

### Settings popup

- Header: extension name + repo chip (current repo or “Open a GitHub repo”).
- Per-category provider list with toggles; `verified: false` rows show an “Unverified” badge and start disabled.
- Custom providers: name + URL template form; validation requires `https://` and at least one `{owner}`/`{repo}` placeholder; invalid input shows an inline error and is not saved. Existing custom entries can be deleted.
- “Reset to defaults” restores the initial enabled/disabled state and clears custom providers after confirmation.
- Every change writes to `storage.sync` immediately and triggers live re-render via `storage.onChanged`.

## 8. Privacy and private repositories

- Never require or use a GitHub token; never read private repository content.
- Visibility detection, in order:
  1. Repo-header visibility badge/metadata rendered by GitHub.
  2. Conservative fallback: one unauthenticated `GET https://api.github.com/repos/{owner}/{repo}`; 200 → public, 404 → private/nonexistent; cache result per repo in `storage.local` for 1 hour to respect the unauthenticated rate limit.
  3. If no signal succeeds, treat as non-public and do not inject.
- Only the repository URL is ever passed to third-party sites, by opening it in a new tab. The extension itself makes no third-party network requests.
- Manifest permissions are limited to `storage` and `tabs`; host permissions are `https://github.com/*` and `https://api.github.com/*`. The API host permission exists solely for the visibility fallback above.

## 9. Error handling

- Missing `.pagehead-actions` (or selector drift): skip injection and log with `console.debug`; never retry-loop.
- `storage` unavailable: use in-memory defaults for the session.
- Invalid custom template: reject at input time; ignore invalid stored entries defensively.
- Unknown `ref`/`path`: hide the dependent provider instead of emitting a wrong URL.
- Isolate failures: a broken provider transform returns `null` rather than breaking menu construction.

## 10. Verification and testing

Automated (Vitest; pure functions plus jsdom tests for selector helpers, no browser API mocks):

- every provider transform for representative contexts (root/tree/blob, with/without ref);
- repo URL and page-type parsing;
- search filtering;
- custom template validation;
- storage default merging.

Provider reachability: `docs/provider-verification.md` table with provider, test repo, generated URL, HTTP/page result, date. Re-check before each release.

Manual smoke checklist:

1. Public repo root: one button, all enabled groups, search works, every verified provider opens.
2. SPA navigation across two repos and a file page: button updates, no duplicates, no console errors.
3. File page: Git History / Nbviewer / Plain view visible with correct path; hidden on repo root.
4. Private repo: no injection.
5. Non-repo pages (`/issues`, `/settings`, `/marketplace`, profiles, orgs): no injection.
6. Light and dark themes; narrow window; Esc/outside-click; no-results state.
7. Popup: toggle live updates, add/delete custom provider, invalid template rejected, reset works.
8. Repeated navigation: no leaked listeners, styles, or nodes.

## 11. Implementation order

1. Scaffold WXT + TypeScript strict; manifest permissions; empty entries.
2. Types, catalog (5 category files), repo/storage/search helpers.
3. Content injection, button, grouped menu, search, theme, SPA re-injection.
4. Visibility detection and private-repo hiding.
5. Settings popup, custom providers, live sync.
6. Provider verification pass; correct `verified` flags; write verification doc.
7. Vitest unit tests; manual smoke; production build and zip.

## 12. Out of scope (v1)

Global hotkey, favorites/pinning, action badge, background service worker, remote catalog updates, i18n/localization, analytics/telemetry, Firefox/Safari support.

## 13. Risks and mitigations

| Risk | Mitigation |
|---|---|
| GitHub DOM/selectors change | Stable anchor (`ul[data-testid="repo-header-actions"]`) with legacy fallbacks; jsdom selector tests; silent skip + debug log; verification checklist per release |
| Branch names containing `/` make ref/path ambiguous | Prefer page-header ref UI; if unresolved, hide dependent providers; never guess default branch |
| Unverified third-party endpoints are dead or redirect unexpectedly | Default disabled, “Unverified” badge, documented verification table |
| Unauthenticated API rate limit for visibility fallback | Cache per repo in `storage.local` for 1 h; DOM signal first |
| Menu overlapping GitHub UI on narrow screens | Max-height + scroll; right alignment; responsive width cap |
