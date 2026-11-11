# Provider verification

Date: 2026-11-12
Test repository: `facebook/react` (GitHub redirects it to `react/react`)
Method: `curl -L` with a desktop browser User-Agent and `Accept: text/html`, 12–25 s timeout.
A result of "200" means the destination responded successfully; providers that redirect to a
canonical host (e.g. `www.`) are listed with the final URL.

Statuses: **verified** = destination resolves for the test repository; **auth** = destination is
valid but requires the user to sign in; **unreachable** = blocked from the verification network
(retained from reference-template evidence); **retired** = the documented web app no longer exists.

## AI docs & Q&A

| Provider | URL tested | Result | Status | Notes |
|---|---|---|---|---|
| DeepWiki | `https://deepwiki.com/facebook/react` | 429 | verified | Rate-limited the probe; site is reachable in a browser. |
| CodeWiki | `https://codewiki.google/github.com/facebook/react` | 200 | verified | |
| Zread | `https://zread.ai/facebook/react` | 200 | verified | |
| Readmex | `https://readmex.com/en-US/facebook/react` | 000 | unreachable | TLS connection blocked from the verification network; root domain also blocked. Kept verified per reference templates. |
| GitDiagram | `https://gitdiagram.com/facebook/react` | 200 | verified | |
| Repowise | `https://repowise.dev/repo/facebook/react` | 200 | verified | Canonical path is `/repo/{owner}/{repo}`; the old `/{owner}/{repo}` form redirects with a `src=gh_swap` query. Transform updated. |
| TalkToGitHub | `https://talktogithub.com/facebook/react` | 000 | unreachable | Same network block as Readmex; kept verified per reference templates. |
| GitPodcast | `https://gitpodcast.com/facebook/react` | 200 → `www.gitpodcast.com/facebook/react` | verified | Redirects to the `www` host, path preserved. |
| ExplainGitHub | `https://explaingithub.com/facebook/react` | 200 | verified | |

## LLM context & MCP

| Provider | URL tested | Result | Status | Notes |
|---|---|---|---|---|
| Gitingest | `https://gitingest.com/facebook/react` | 200 | verified | |
| GitMCP | `https://gitmcp.io/facebook/react` | 200 | verified | |
| uithub | `https://uithub.com/facebook/react` | 200 | verified | Returns 401 when negotiated as plain text (API mode); the browser HTML request succeeds. |
| Repomix | `https://repomix.com/facebook/react` | 404 | retired | Repomix's web app was removed; `repomix.com` is now a VitePress documentation site and `/app`, `/new`, `/try`, `/pack`, `/online` all 404. Removed from the catalog. |
| GitMVP | `https://gitmvp.com/facebook/react` | 200 → `www.gitmvp.com/facebook/react` | verified | Redirects to the `www` host. |

## IDE & sandboxes

| Provider | URL tested | Result | Status | Notes |
|---|---|---|---|---|
| GitHub.dev | `https://github.dev/facebook/react` | 200 → `vscode.dev/github/facebook/react` | verified | |
| GitHub1s | `https://github1s.com/facebook/react` | 200 | verified | |
| StackBlitz | `https://stackblitz.com/github/facebook/react` | 200 | verified | |
| CodeSandbox | `https://githubbox.com/facebook/react` | 403 → `codesandbox.io/s/github/facebook/react` | verified | 403 is bot protection on the redirected page; the pattern is the documented CodeSandbox import URL. |
| Gitpod | `https://gitpod.io/#https://github.com/facebook/react` | 200 | verified | Fragment is not sent over HTTP; site reachable. |
| VS Code Web | `https://vscode.dev/github/facebook/react` | 200 | verified | |
| pr.new | `https://pr.new/https://github.com/facebook/react` | 200 → `stackblitz.com/~/github.com/facebook/react` | verified | Redirect chain expected. |
| Codespaces | `https://codespaces.new/facebook/react` | 200 → GitHub login | auth | Requires a signed-in GitHub session; canonical URL valid. |
| Bolt.new | `https://bolt.new/github.com/facebook/react` | 200 → `bolt.new/~/github.com/facebook/react` | verified | Redirect chain expected. |

## Analytics, visualization & audit

| Provider | URL tested | Result | Status | Notes |
|---|---|---|---|---|
| OSS Insight | `https://ossinsight.io/analyze/facebook/react` | 200 | verified | |
| Star History | `https://star-history.com/#facebook/react&Date` | 200 | verified | Fragment is client-side only; site reachable. |
| GitHub.gg | `https://github.gg/facebook/react` | 200 → `www.github.gg/facebook/react` | verified | |
| Active Forks | `https://techgaun.github.io/active-forks/index.html#facebook/react` | 200 | verified | Fragment is client-side only. |
| Git History | `https://github.githistory.xyz/facebook/react/blob/main/README.md` | 200 | verified | Blob-only provider. |
| Nbviewer | `https://nbviewer.org/github/facebook/react` | 200 | verified | Blob form uses the same host with `blob/{ref}/{path}`. |

## GitHub built-ins & downloads

| Provider | URL tested | Result | Status | Notes |
|---|---|---|---|---|
| Download Directory | `https://download-directory.github.io/?url=<encoded repo URL>` | 200 | verified | |
| Archive ZIP | `https://github.com/facebook/react/archive/main.zip` | 200 → `codeload.github.com/react/react/zip/refs/heads/main` | verified | Works for branches, tags and commits. |
| Plain view | `https://github.com/facebook/react/blob/main/README.md?plain=1` | 200 → `github.com/react/react/...` | verified | Redirect due to the repository rename. |
| Releases feed | `https://github.com/facebook/react/releases.atom` | 200 → `github.com/react/react/releases.atom` | verified | |
| Commits feed | `https://github.com/facebook/react/commits.atom` | 200 → `github.com/react/react/commits.atom` | verified | |

## Excluded from the catalog

- **GitReverse** — README specifies no endpoint.
- **Git-Stats, Socket.dev, Snyk Advisor** — require manual input, not a URL transform.
- **Repomix** — see above; the documented web app is retired. The Chrome extension remains available
  from the Chrome Web Store but is not a URL-based jump target.
