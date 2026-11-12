<div align="center">
  <img src="public/icon/128.png" width="84" height="84" alt="GitHub One4All icon" />
  <h1>GitHub One4All</h1>
  <p><strong>一个按钮，打开 33 个 GitHub 仓库衍生工具。</strong></p>
  <p>DeepWiki · GitDiagram · Gitingest · 在线 IDE · 数据面板 · 文件历史</p>

  <p>
    <img alt="Manifest V3" src="https://img.shields.io/badge/Manifest-V3-4285F4?logo=googlechrome&logoColor=white" />
    <img alt="WXT" src="https://img.shields.io/badge/WXT-0.21-67D55E" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" />
    <img alt="Chromium" src="https://img.shields.io/badge/platform-Chromium-333?logo=googlechrome&logoColor=white" />
    <img alt="33 tools" src="https://img.shields.io/badge/tools-33-EA4AAA" />
  </p>
</div>

---

仓库页头会多出一个 `🚀 One4All ▾` 按钮。点开是按分类组织的工具菜单，链接根据当前仓库、分支和文件路径实时生成。扩展不收集数据、不需要 token，只把仓库 URL 交给目标站点。

## 特性

- **33 个内置工具**：AI 文档、LLM 上下文、在线 IDE、数据分析、GitHub 内置，五类分组。
- **搜索与开关**：菜单实时过滤；设置页逐项开关、添加自定义站点、恢复默认。
- **页面感知**：文件级工具只在 `blob` 页出现；目录下载只在根目录和 `tree` 页出现。
- **分支消歧**：正确处理 `feature/x` 这类含斜杠的分支名。
- **私有仓库隐藏**：非公开仓库和非仓库页面不注入按钮。
- **SPA 兼容**：GitHub 路由切换后自动重建按钮，无重复节点；支持深色模式。
- **实时同步**：设置写入 `storage.sync`，已打开页面立即更新。

## 安装

从 [Releases](https://github.com/MaybeBio/GitHub_One4All_Extension/releases/latest) 下载最新 zip，解压后打开 `chrome://extensions`，启用开发者模式，点击「加载已解压的扩展程序」，选择解压出的文件夹。

自行构建需要 Node.js 18+：

```bash
npm install
npm run build
```

构建结果在 `.output/chrome-mv3`，`npm run zip` 可生成分发包。

## 使用

1. 打开任意公开仓库，例如 `github.com/facebook/react`。
2. 点击 `🚀 One4All ▾`，搜索或直接选择工具。
3. 点击扩展图标打开设置，可开关工具或添加自定义站点。

自定义站点支持 `{owner}` / `{repo}` 占位符，必须使用 `https://`：

```text
https://example.com/{owner}/{repo}
```

## 内置工具

| 分类 | 工具 |
| --- | --- |
| AI 文档 | DeepWiki · CodeWiki · Zread · Readmex · GitDiagram · Repowise · TalkToGitHub · GitPodcast · ExplainGitHub |
| LLM 上下文 | Gitingest · GitMCP · uithub · GitMVP |
| 在线 IDE | GitHub.dev · GitHub1s · StackBlitz · CodeSandbox · Gitpod · VS Code Web · pr.new · Codespaces · Bolt.new |
| 数据分析 | OSS Insight · Star History · GitHub.gg · Active Forks · Git History · Nbviewer |
| GitHub 内置 | Download Directory · Archive ZIP · Plain view · Releases feed · Commits feed |

`Git History`、`Plain view` 仅文件页可用；`Nbviewer` 支持根目录和文件页；目录下载仅在根目录或 `tree` 页可用。

## 开发

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 开发模式，自动重载 |
| `npm run build` | 构建到 `.output/chrome-mv3` |
| `npm run zip` | 打包扩展 |
| `npm test` | Vitest，41 个用例 |
| `npm run typecheck` | 类型检查 |

新增工具只需在 `utils/providers/` 对应分类中追加一条 `Provider` 记录，无需改 UI。注入锚点和可见性判断集中在 `utils/dom.ts`，GitHub 改版时优先检查这里。

## 隐私

- 私有仓库不显示按钮；非仓库页面不注入。
- 不读取仓库内容，不使用 token；除仓库 URL 外不向第三方发送信息。
- 权限仅 `storage`、`tabs`，主机权限为 `github.com` 与 `api.github.com`。

## 未收录

Repomix（Web 应用已下线）、GitReverse（无 URL 规则）、Git-Stats / Socket.dev / Snyk Advisor（需手动输入）。
