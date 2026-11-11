# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project intent

Build a browser extension (Chrome/Chromium, Manifest V3) that injects a **"衍生工具" button + dropdown** into any GitHub repository page. Clicking the button opens a grouped menu of third-party GitHub-derived sites (DeepWiki, GitDiagram, Zread, Gitingest, GitMCP, GitHub.dev, OSS Insight, …), each resolved by transforming the current repository URL. Feature scope: comprehensive provider catalog, rich categories, pinning, per-provider toggles, custom providers, keyboard shortcut, dark mode.

`README.md` (Chinese) is the product spec and the authoritative list of sites. It also contains a sample Tampermonkey script — **that script contains several wrong URL builders** (see "URL pitfalls" below), so use the prose descriptions, not the code, as the source of truth.

## Repository state

- Greenfield: only `README.md` and `refers_template/` exist. No `package.json`, no source, no tests, and the root is **not a git repository**. Do not run git commands expecting history at the root.
- `refers_template/` holds three third-party extensions with their own nested `.git` directories. Treat them as **read-only references**; do not modify, build, or commit inside them.
- Recommended stack: **WXT + TypeScript + MV3**, mirroring `refers_template/chrome-extension-repowiki` (best-in-class reference). The other two templates are raw-MV3 JS and show the pre-WXT approach.

## Commands

No build system exists yet. Once scaffolded (WXT, as in `chrome-extension-repowiki/package.json`):

```bash
npm install
npm run dev      # wxt: build + watch + auto-reload
npm run build    # production build -> .output/chrome-mv3
npm run zip      # packaged zip for distribution
```

Load the extension via `chrome://extensions` → Developer mode → **Load unpacked** → `.output/chrome-mv3` (build output) or the source folder for the raw-JS templates.

The `git-repo-tools` and `github-tools-extension` references have no build step — load their folders unpacked directly.

**No test runner or linter is configured.** Verify manually: load unpacked, open a repo root, confirm the button appears; open the dropdown and each category; switch GitHub to dark mode; toggle a provider in the popup and confirm the page updates without reload; navigate between repos (SPA) and confirm no duplicate button; check `/issues`, `/settings`, `/marketplace` and a user profile show no button.

## Target architecture

Keep the provider catalog **declarative and data-driven** — adding a site must be a one-line registry entry, never new UI code.

```
entrypoints/
  content.ts        # injects button/dropdown into GitHub repo pages
  background.ts     # keyboard command, badge, tab/storage listeners
  popup/            # settings UI: toggles, pin, custom providers
utils/
  providers.ts      # provider registry + URL transforms + repo extraction
```

1. **Provider registry** (`utils/providers.ts`)
   - `WikiProvider { id, name, category, transform(ctx) => string, enabledByDefault, pinnedByDefault }`.
   - `transform` receives enough context to handle non-trivial sites, not just `{owner, repo}`: full current URL, current branch, and current path/file (needed by Git History, Nbviewer, Download Directory, archive ZIP, line-range links). Keep transforms pure — no network calls.
   - Keep the built-in list ordered by category; UI renders category headers in this order.

2. **Content script** (`entrypoints/content.ts`)
   - `matches: ['https://github.com/*/*']`; anchor to `ul[data-testid="repo-header-actions"]` (root pages), `.react-blob-header-edit-and-raw-actions` (blob pages), or `.react-code-view-header-element--wide` (tree pages), with legacy fallbacks `.pagehead-actions` and `#repository-details-container ul`. Current GitHub no longer renders `.pagehead-actions` and its code view has no shared header actions list; verify selectors against live HTML before relying on them.
   - Split-button pattern (RepoWiki): left half opens the pinned provider; chevron opens the dropdown; pin icon per row changes the default.
   - Deduplicate with a `data-*` attribute; remove and re-inject on URL change.
   - **SPA handling**: GitHub navigates via `turbo`/pushState. Patch `history.pushState`, listen for `popstate`, and observe the header with `MutationObserver`; in WXT, also clean up in `ctx.onInvalidated` (restore `pushState`, disconnect observer, remove document listeners/styles).
   - **Live settings sync**: read `storage.sync` on inject, subscribe to `storage.onChanged`, and re-inject when providers/pin/custom list change.
   - **Theme**: CSS custom properties with a light default, `@media (prefers-color-scheme: dark)` fallback, and `html[data-color-mode="dark"]` overrides (GitHub's explicit dark setting wins). Use `!important` where GitHub button styles conflict (see `git-repo-tools/content.css`). Respect `prefers-reduced-motion`.
   - Accessibility: `aria-label`, `aria-haspopup`, `aria-expanded`, keyboard-open/close, close on outside click.
   - **Non-repo pages**: require ≥2 path segments and skip reserved first segments — `settings`, `orgs`, `topics`, `trending`, `explore`, `marketplace`, `notifications`. `extractGithubRepo` regex: `^https://github\.com/([^/?#]+)/([^/?#]+)`.
   - **Private repositories**: never send credentials/tokens and do not auto-scrape private repo content; either hide the menu or show a warning. Third-party services only see the URL you open.

3. **Background service worker** (`entrypoints/background.ts`)
   - Keyboard command to open the pinned provider for the active repo tab (RepoWiki: `Alt+W`; GitRepoTools: `Alt+Shift+G`).
   - Badge showing the pinned provider's initials on GitHub tabs; update on `tabs.onUpdated` / `onActivated` / storage changes.
   - Optional message bridge for the content script; avoid per-tab state maps unless needed (the data-attribute guard is usually sufficient).

4. **Popup**
   - Repo chip for the active tab, toggle per provider (defaults from registry), pinned-provider selection, reset to defaults, and add/remove custom providers.
   - Custom provider form: `{ name, urlTemplate }` where `urlTemplate` supports `{owner}` / `{repo}` placeholders.
   - Persist all changes to `storage.sync`; content script picks them up live.

5. **Storage schema**
   - `enabledProviders: Record<providerId, boolean>` (missing key → `enabledByDefault`).
   - `pinnedProvider: string` (fallback to the first enabled provider if the pinned one is disabled).
   - `customProviders: Array<{ id, name, urlTemplate }>`.

## URL pitfalls (verified against README + templates)

- Sites differ in shape: some take `/{owner}/{repo}`, some prefix the full URL, some need a query/hash/path segment. Do not assume a single template.
- The README's Tampermonkey sample is wrong in several places: OSS Insight needs `/analyze/`; Active Forks is `techgaun.github.io/active-forks/index.html#owner/repo` (not `github.io`); Bolt.new and pr.new need the full `github.com` URL, not `owner/repo`; Star History and Download Directory rely on query/hash parameters.
- File-scoped tools (Git History, Nbviewer, line-range, `?plain=1`, Download Directory, archive ZIP) only make sense when the current page has the relevant context — compute from the current URL, and hide or fall back gracefully on the repo root.
- Verify each endpoint manually before shipping; mark README-only endpoints as unverified until tested.

## Provider catalog (from README.md)

Status: **verified** = present in a reference implementation; **README-only** = described in prose, endpoint should be confirmed.

### AI docs & Q&A
| Site | URL |
|---|---|
| DeepWiki | `https://deepwiki.com/{owner}/{repo}` (verified) |
| Google CodeWiki | `https://codewiki.google/github.com/{owner}/{repo}` (verified) |
| Zread | `https://zread.ai/{owner}/{repo}` (verified) |
| Readmex | `https://readmex.com/{lang}/{owner}/{repo}` — omit lang for Chinese, use `en-US/` otherwise (verified) |
| GitDiagram | `https://gitdiagram.com/{owner}/{repo}` (verified) |
| Repowise | `https://repowise.dev/repo/{owner}/{repo}` (verified; the bare `/{owner}/{repo}` form redirects) |
| TalkToGitHub | `https://talktogithub.com/{owner}/{repo}` (verified) |
| GitPodcast | `https://gitpodcast.com/{owner}/{repo}` (README-only) |
| ExplainGitHub | `https://explaingithub.com/{owner}/{repo}` (README-only, host inferred) |

### LLM context & MCP
| Site | URL |
|---|---|
| Gitingest | `https://gitingest.com/{owner}/{repo}` (verified) |
| GitMCP | `https://gitmcp.io/{owner}/{repo}` (verified) |
| uithub | `https://uithub.com/{owner}/{repo}` (README-only) |
| Repomix | removed — `repomix.com` is now a docs site; the README's web-app URL 404s |
| GitMVP | `https://gitmvp.com/{owner}/{repo}` (README-only) |
| GitReverse | endpoint not specified (README-only) |

### Online IDE & sandboxes
| Site | URL |
|---|---|
| GitHub.dev | `https://github.dev/{owner}/{repo}` (verified) |
| GitHub1s | `https://github1s.com/{owner}/{repo}` (README-only) |
| StackBlitz | `https://stackblitz.com/github/{owner}/{repo}` (verified) |
| CodeSandbox | `https://githubbox.com/{owner}/{repo}` or `https://codesandbox.io/s/github/{owner}/{repo}` (verified variants) |
| Gitpod | `https://gitpod.io/#https://github.com/{owner}/{repo}` (verified) |
| VS Code Web | `https://vscode.dev/github/{owner}/{repo}` (verified) |
| pr.new | `https://pr.new/https://github.com/{owner}/{repo}` (README-only) |
| Codespaces | `https://codespaces.new/{owner}/{repo}` (README-only) |
| Bolt.new | `https://bolt.new/github.com/{owner}/{repo}` (README-only) |

### Analytics, visualization & audit
| Site | URL |
|---|---|
| OSS Insight | `https://ossinsight.io/analyze/{owner}/{repo}` (README-only) |
| Star History | `https://star-history.com/#{owner}/{repo}&Date` (README-only, params need verification) |
| GitHub.gg | `https://github.gg/{owner}/{repo}` (README-only) |
| Active Forks | `https://techgaun.github.io/active-forks/index.html#{owner}/{repo}` (README-only) |
| Git History | `https://github.githistory.xyz/{owner}/{repo}/blob/{branch}/{path}` (README-only, file pages) |
| Nbviewer | `https://nbviewer.org/github/{owner}/{repo}/blob/{branch}/{path}` (README-only, notebooks) |
| Git-Stats | `gitstats.me` — manual input, no direct transform |
| Socket.dev / Snyk Advisor | dependency audit sites, manual input, no direct transform |

### GitHub built-ins & downloads
| Tool | Pattern |
|---|---|
| Download Directory | `https://download-directory.github.io/?url=<current folder URL>` |
| Archive ZIP | `https://github.com/{owner}/{repo}/archive/refs/heads/{branch}.zip` |
| Plain rendering | append `?plain=1` to a file URL |
| Line highlight | append `#L10-L25` to a file URL |
| Atom feeds | append `.atom` to `/releases` or `/commits` |
| VS Code shortcut | press `.` on a repo page (native, no URL) |

## Reference template map

- `refers_template/chrome-extension-repowiki/` — **preferred base**. WXT + TypeScript, split button, pinned provider, custom providers, dark-mode tokens, live storage sync, badge initials, `Alt+W` command, proper invalidation cleanup. Provider logic lives in `utils/providers.ts`.
- `refers_template/git-repo-tools/` — raw MV3. Useful for the settings popup + storage merge/reset flow, per-tab state in the background worker, and high-specificity CSS needed to override GitHub's button styles.
- `refers_template/github-tools-extension/` — minimal raw MV3. Useful for a draggable floating launcher and the `action.onClicked` + command → message pattern.
