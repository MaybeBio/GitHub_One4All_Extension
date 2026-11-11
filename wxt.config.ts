import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'GitHub One4All',
    description:
      'One menu for DeepWiki, GitDiagram, Gitingest, online IDEs and 30+ tools on any GitHub repository.',
    permissions: ['storage', 'tabs'],
    host_permissions: ['https://github.com/*', 'https://api.github.com/*'],
    action: {
      default_title: 'GitHub One4All',
      default_icon: {
        16: 'icon/16.png',
        32: 'icon/32.png',
        48: 'icon/48.png',
        128: 'icon/128.png',
      },
    },
  },
});
