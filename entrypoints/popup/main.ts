import { browser } from 'wxt/browser';
import { createCustomProvider, validateCustomTemplate } from '../../utils/providers/custom';
import { getAllProviders } from '../../utils/providers/catalog';
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type CategoryId,
  type Provider,
} from '../../utils/providers/types';
import { parseRepo } from '../../utils/repo';
import type { ExtensionState } from '../../utils/state';
import { loadState, subscribeState } from '../../utils/storage';

const providerList = document.getElementById('provider-list') as HTMLDivElement;
const customList = document.getElementById('custom-list') as HTMLDivElement;
const form = document.getElementById('custom-form') as HTMLFormElement;
const nameInput = document.getElementById('custom-name') as HTMLInputElement;
const urlInput = document.getElementById('custom-url') as HTMLInputElement;
const errorText = document.getElementById('custom-error') as HTMLParagraphElement;
const resetButton = document.getElementById('reset') as HTMLButtonElement;
const repoChip = document.getElementById('repo-chip') as HTMLDivElement;

let state: ExtensionState = { enabledProviders: {}, customProviders: [] };

function isEnabled(provider: Provider): boolean {
  return provider.id in state.enabledProviders
    ? state.enabledProviders[provider.id] === true
    : provider.enabledByDefault;
}

async function save(partial: Record<string, unknown>): Promise<void> {
  try {
    await browser.storage.sync.set(partial);
  } catch {
    showError('Could not save settings. Try again.');
  }
}

function showError(message: string): void {
  errorText.textContent = message;
  errorText.hidden = false;
}

function hideError(): void {
  errorText.textContent = '';
  errorText.hidden = true;
}

function renderProviders(): void {
  const providers = getAllProviders(state.customProviders).filter(
    (provider) => provider.category !== 'custom',
  );
  const fragment = document.createDocumentFragment();

  for (const category of CATEGORY_ORDER) {
    if (category === 'custom') continue;
    const items = providers.filter((provider) => provider.category === category);
    if (items.length === 0) continue;

    const heading = document.createElement('h3');
    heading.className = 'group-title';
    heading.textContent = CATEGORY_LABELS[category as CategoryId];
    fragment.appendChild(heading);

    for (const provider of items) {
      const row = document.createElement('label');
      row.className = 'provider-row';

      const info = document.createElement('span');
      info.className = 'provider-info';

      const nameLine = document.createElement('span');
      nameLine.className = 'provider-name';
      nameLine.textContent = provider.name;
      if (!provider.verified) {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = 'Unverified';
        nameLine.appendChild(badge);
      }

      const description = document.createElement('span');
      description.className = 'provider-desc';
      description.textContent = provider.description;

      info.append(nameLine, description);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'switch';
      checkbox.checked = isEnabled(provider);
      checkbox.setAttribute('aria-label', `Enable ${provider.name}`);
      checkbox.addEventListener('change', () => {
        state.enabledProviders = {
          ...state.enabledProviders,
          [provider.id]: checkbox.checked,
        };
        void save({ enabledProviders: state.enabledProviders });
      });

      row.append(info, checkbox);
      fragment.appendChild(row);
    }
  }

  providerList.replaceChildren(fragment);
}

function renderCustom(): void {
  if (state.customProviders.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'muted small';
    empty.textContent = 'No custom tools yet.';
    customList.replaceChildren(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const custom of state.customProviders) {
    const row = document.createElement('div');
    row.className = 'custom-row';

    const info = document.createElement('span');
    info.className = 'provider-info';

    const name = document.createElement('span');
    name.className = 'provider-name';
    name.textContent = custom.name;

    const template = document.createElement('span');
    template.className = 'provider-desc mono';
    template.textContent = custom.urlTemplate;

    info.append(name, template);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'text-btn danger';
    remove.textContent = 'Remove';
    remove.setAttribute('aria-label', `Remove ${custom.name}`);
    remove.addEventListener('click', () => {
      state.customProviders = state.customProviders.filter((item) => item.id !== custom.id);
      void save({ customProviders: state.customProviders });
      renderCustom();
    });

    row.append(info, remove);
    fragment.appendChild(row);
  }
  customList.replaceChildren(fragment);
}

async function renderRepoChip(): Promise<void> {
  try {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    const parsed = tab?.url ? parseRepo(tab.url, navigator.language) : null;
    repoChip.textContent = parsed
      ? `${parsed.context.owner}/${parsed.context.repo}`
      : 'Open a GitHub repo to use Repo Tools';
    repoChip.classList.toggle('active', parsed !== null);
  } catch {
    repoChip.textContent = 'Open a GitHub repo to use Repo Tools';
    repoChip.classList.remove('active');
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  const template = urlInput.value.trim();

  if (!name) {
    showError('Name is required.');
    return;
  }
  const templateError = validateCustomTemplate(template);
  if (templateError) {
    showError(templateError);
    return;
  }

  hideError();
  const custom = createCustomProvider(name, template);
  state.customProviders = [...state.customProviders, custom];
  void save({ customProviders: state.customProviders });
  form.reset();
  renderCustom();
  nameInput.focus();
});

resetButton.addEventListener('click', () => {
  if (!confirm('Reset all Repo Tools settings? This clears custom tools.')) return;
  state = { enabledProviders: {}, customProviders: [] };
  void save({ enabledProviders: {}, customProviders: [] });
  renderProviders();
  renderCustom();
});

async function main(): Promise<void> {
  state = await loadState();
  renderProviders();
  renderCustom();
  await renderRepoChip();

  subscribeState((next) => {
    state = next;
    renderProviders();
    renderCustom();
  });
}

void main();
