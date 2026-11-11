// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { findActionMount, readDomVisibility } from '../utils/dom';

beforeEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});

describe('findActionMount', () => {
  it('prefers the current repo header actions list', () => {
    document.body.innerHTML = `
      <ul class="pagehead-actions"><li>legacy</li></ul>
      <ul data-testid="repo-header-actions"><li>star</li></ul>
    `;
    const mount = findActionMount(document);
    expect(mount?.tag).toBe('li');
    expect(mount?.parent.getAttribute('data-testid')).toBe('repo-header-actions');
  });

  it('mounts beside the blob raw/download actions', () => {
    document.body.innerHTML = `
      <div class="sticky"><div class="react-blob-header-edit-and-raw-actions"></div></div>
    `;
    const mount = findActionMount(document);
    expect(mount?.tag).toBe('div');
    expect(mount?.reference?.className).toBe('react-blob-header-edit-and-raw-actions');
  });

  it('appends to the code view header on tree pages', () => {
    document.body.innerHTML = `
      <div class="row"><div class="react-code-view-header-element--wide"></div></div>
    `;
    const mount = findActionMount(document);
    expect(mount?.tag).toBe('div');
    expect(mount?.reference).toBeNull();
  });

  it('falls back to pagehead-actions', () => {
    document.body.innerHTML = '<ul class="pagehead-actions"><li>star</li></ul>';
    expect(findActionMount(document)?.parent.className).toBe('pagehead-actions');
  });

  it('falls back to the repository details container', () => {
    document.body.innerHTML = '<div id="repository-details-container"><ul><li>star</li></ul></div>';
    expect(findActionMount(document)?.parent.tagName).toBe('UL');
  });

  it('returns null outside a repo header', () => {
    document.body.innerHTML = '<main><p>profile</p></main>';
    expect(findActionMount(document)).toBeNull();
  });
});

describe('readDomVisibility', () => {
  it('reads the octolytics meta tag', () => {
    document.head.innerHTML = '<meta name="octolytics-dimension-repository_public" content="true" />';
    expect(readDomVisibility(document)).toBe(false);
    document.head.innerHTML = '<meta name="octolytics-dimension-repository_public" content="false" />';
    expect(readDomVisibility(document)).toBe(true);
  });

  it('reads the repository visibility label', () => {
    document.body.innerHTML = `
      <div id="repository-container-header">
        <span data-testid="repo-visibility-label">Private</span>
      </div>
    `;
    expect(readDomVisibility(document)).toBe(true);
    document.body.innerHTML = `
      <div id="repository-container-header">
        <span data-testid="repo-visibility-label">Public</span>
      </div>
    `;
    expect(readDomVisibility(document)).toBe(false);
  });

  it('returns null when no signal is present', () => {
    document.body.innerHTML = '<header><nav>menu</nav></header>';
    expect(readDomVisibility(document)).toBeNull();
  });
});
