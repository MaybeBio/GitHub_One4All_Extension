export interface ActionMount {
  parent: Element;
  reference: Element | null;
  tag: 'li' | 'div';
}

export function findActionMount(doc: Document = document): ActionMount | null {
  const list = doc.querySelector('ul[data-testid="repo-header-actions"]');
  if (list) return { parent: list, reference: list.firstElementChild, tag: 'li' };

  const rawActions = doc.querySelector('.react-blob-header-edit-and-raw-actions');
  if (rawActions?.parentElement) {
    return { parent: rawActions.parentElement, reference: rawActions, tag: 'div' };
  }

  const codeHeader = doc.querySelector('.react-code-view-header-element--wide');
  if (codeHeader?.parentElement) {
    return { parent: codeHeader.parentElement, reference: null, tag: 'div' };
  }

  const pagehead = doc.querySelector('.pagehead-actions');
  if (pagehead) return { parent: pagehead, reference: pagehead.firstElementChild, tag: 'li' };

  const details = doc.querySelector('#repository-details-container ul');
  if (details) return { parent: details, reference: details.firstElementChild, tag: 'li' };

  return null;
}

export function readDomVisibility(doc: Document = document): boolean | null {
  const meta = doc.querySelector('meta[name="octolytics-dimension-repository_public"]');
  const content = meta?.getAttribute('content');
  if (content === 'true') return false;
  if (content === 'false') return true;

  const scope = doc.querySelector('#repository-container-header, .pagehead, header') ?? doc;
  const badges = scope.querySelectorAll(
    '[data-testid="repo-visibility-label"], [data-testid="repository-visibility"], .repo-visibility',
  );
  for (const badge of badges) {
    const text = badge.textContent?.trim().toLowerCase();
    if (text === 'private') return true;
    if (text === 'public') return false;
  }
  return null;
}
