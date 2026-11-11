import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'Repo Tools for GitHub',
    description:
      'Open any public GitHub repository in DeepWiki, GitDiagram, Gitingest, GitMCP, online IDEs and 30+ derived tools.',
    permissions: ['storage', 'tabs'],
    host_permissions: ['https://github.com/*', 'https://api.github.com/*'],
    action: {
      default_title: 'Repo Tools',
      default_icon: {
        16: 'icon/16.png',
        32: 'icon/32.png',
        48: 'icon/48.png',
        128: 'icon/128.png',
      },
    },
  },
});
