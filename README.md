除了你提到的 DeepWiki 和 GitDiagram，目前还有十几个支持通过直接替换 URL 域名或路径即可一键跳转的 GitHub 衍生网站，涵盖 AI 知识库、提示词提取、云端运行环境和项目数据分析四大类。

1. AI 文档与知识库解析（替代或补充 DeepWiki）

这类网站会自动读取仓库代码，生成结构化的 Wiki 文档、解释视图并支持对话问答：
• Google Code Wiki。将 ://github.com 替换为 codewiki.google/://github.com，由 Google 提供的代码知识库，对公开仓库的更新同步速度极快。
• Zread。将 ://github.com 替换为 zread.ai/owner/repo，支持全中文深度代码解读与架构梳理。
• Repowise。将 ://github.com 替换为 repowise.dev/owner/repo，基于代码依赖图谱和 Git 提交历史构建架构 Wiki 与代码健康度分析。
• TalkToGitHub。在仓库路径前加上 ://talktogithub.com，直接进入面向该代码库的对话式 AI 问答页面。 [1] (https://www.linkedin.com/pulse/5-tools-supercharge-your-workflow-mahdi-r-b000f), [2] (https://repowise.dev/blog/comparisons/deepwiki-alternatives), [3] (https://zread.ai/coderamp-labs/gitingest)

2. LLM 上下文与 MCP 协议转换（替代或补充 Gitingest）

这类网站把整个代码库扁平化提取为纯文本或接入大模型工具链：
• Gitingest。将 hub 替换为 ingest（即 ://gitingest.com），一键将整个仓库转化为带目录树和 Token 统计的纯文本，方便直接复制喂给大模型。
• GitMCP。将 ://github.com 替换为 gitmcp.io/owner/repo，瞬间为该仓库生成一个远程 MCP（Model Context Protocol）服务器地址，可直接接入 Claude Code、Cursor 等本地 AI 工具。
• GitReverse。支持通过 URL 替换将仓库转换为结构化的 AI 上下文提示词。 [1] (https://www.instagram.com/reel/Dfe0IBwCpCy/), [2] (https://92nodes.com/blog/github-url-tricks-repository-tools), [3] (https://github.com/coderamp-labs/gitingest), [4] (https://www.linkedin.com/pulse/5-tools-supercharge-your-workflow-mahdi-r-b000f)

3. 在线编辑器与即时沙盒运行环境

无需本地克隆和配置环境，直接在浏览器中阅读或运行代码：
• GitHub.dev。将 github.com 替换为 github.dev（或直接在页面按键盘句号键 .），打开官方网页版 VS Code 编辑器。
• GitHub1s。将 github.com 替换为 github1s.com，一秒加载只读版网页 VS Code 界面，适合纯阅读代码。
• StackBlitz。访问 stackblitz.com/github/owner/repo，在浏览器中直接启动完整的 Node.js/前端运行沙盒并预览效果。
• CodeSandbox。将 github.com 替换为 githubbox.com，同样可将前端或全栈项目一键导入云端沙盒运行。
• Gitpod。在完整 GitHub 网址前加上 gitpod.io/#（例如 gitpod.io/#https://github.com），启动带完整 Linux 终端的云端开发环境。 [1] (https://medium.com/@vondevelopment/stop-clicking-around-use-these-github-link-hacks-753b350d5159), [2] (https://92nodes.com/blog/github-url-tricks-repository-tools), [3] (https://www.instagram.com/reel/DfcU1m0I0rO/)

4. 可视化分析与数据统计

• Star History。访问 ://star-history.com，查看该仓库历史 Star 增长曲线并支持多项目对比。
• GitHub 文件历史视图（内置技巧）。在任意具体文件的 URL 中，将 /blob/ 替换为 /blame/，可逐行查看代码作者与提交历史；将 github.com 替换为 github.githistory.xyz，则可播放该文件的可视化演变时间轴。 [1] (https://medium.com/@vondevelopment/stop-clicking-around-use-these-github-link-hacks-753b350d5159)

如何把这些网站全部聚合到一个按钮里？

由于没有任何一款现成扩展能同时覆盖上述所有冷门或新出的站点，最高效的做法是使用 Tampermonkey（油猴） 配合自定义脚本，在 GitHub 仓库右上角生成一个“衍生工具聚合下拉菜单”。
如果你希望自己掌控列表、随时增减新网站，可以直接新建一个油猴脚本，粘贴以下代码即可在所有仓库页面生效：
你可以使用 Tampermonkey（油猴） 脚本在 GitHub 页面右上角注入一个聚合下拉菜单，一键直达上述各类衍生工具。
完整油猴脚本代码如下（你可以根据需求自由增减列表）：
可以通过编写 Tampermonkey（油猴）脚本，在 GitHub 页面右上角注入一个聚合下拉菜单，一键直达 DeepWiki、GitDiagram、CodeWiki、Zread、Gitingest、GitMCP 等衍生工具。 [1] (https://www.instagram.com/reel/DfcU1m0I0rO/)
相关脚本代码及使用详情可参考 Instagram。 [1] (https://www.instagram.com/reel/DfcU1m0I0rO/)
(注：上述第三方 AI 解析和运行工具均仅适用于公开仓库，请勿向任何第三方网站提供包含敏感信息的私有仓库访问令牌。) [1] (https://www.instagram.com/reel/DfcU1m0I0rO/), [2] (https://92nodes.com/blog/github-url-tricks-repository-tools)
如果你想为这个油猴脚本增加快捷键呼出（例如按 Alt + J 直接弹出菜单）或支持自动适配深色/浅色主题微调，我可以继续帮你优化这段脚本代码。需要加上吗？



除了之前提到的主流站点，还有一批同样支持直接修改或替换域名/路径即可跳转的实用 GitHub 衍生网站，涵盖 AI 提示词逆向、源码透视分析、安全审计、云端环境以及数据统计五个方向：

1. 仓库转 AI 上下文与逆向提示词（替代或补充 Gitingest）

这类工具专注于把代码库打包成适合喂给大模型（LLM）的纯文本、API 接口或复刻提示词：
• uithub。将 github.com 替换为 uithub.com（即 ://uithub.com），瞬间生成纯净的 LLM 就绪文本，支持通过 URL 参数过滤文件后缀或直接通过 curl 获取仓库内容。
• Repomix。将 github.com 替换为 repomix.com，自动将整个仓库打包为结构化的单文件（支持 XML、Markdown 格式）并计算 Token 消耗量。
• GitMVP。将 github.com 中的 hub 替换为 mvp（即 ://gitmvp.com），逆向工程整个项目的架构与逻辑，生成可直接复制给 AI 编程助手用来复刻该项目的提示词。
• ExplainGitHub。在任意仓库 URL 中将 github 替换为 explaingithub，直接打开面向该代码库的问答交互界面，快速拆解核心模块逻辑。

2. 项目深度透视、指标分析与安全体检

这类网站通过解析提交历史、社区活跃度和依赖结构，为你提供仓库的“X光体检报告”：
• OSS Insight。在仓库路径前加上 ossinsight.io/analyze/（例如 ossinsight.io/analyze/owner/repo），全面展示该仓库的贡献者分布、Issue/PR 响应速度、编程语言构成以及历史趋势。
• Git-Stats。访问 gitstats.me 并输入仓库或用户名，分析开源项目的代码提交频率与贡献度统计。
• Socket.dev / Snyk Advisor。对于前端或 Python 等包含包管理依赖的仓库，在对应平台输入仓库名即可扫描第三方依赖是否存在供应链投毒、许可证风险或安全漏洞。

3. 在线 IDE 与一键 PR / 沙盒环境（补充 GitHub.dev）

除了网页版 VS Code，这些域名替换技巧可以直接启动云端容器或快捷创建开发会话：
• vscode.dev。在完整 GitHub 网址前加上 vscode.dev/（即 vscode.dev/https://github.com），调用微软官方网页版 VS Code 打开项目。
• pr.new。在完整 GitHub 网址前加上 pr.new/（例如 pr.new/://github.com），自动启动 StackBlitz 云端环境并直接创建一个可用于提交 Pull Request 的修改分支。
• codespaces.new。在浏览器地址栏直接输入 codespaces.new/owner/repo，一键为指定仓库启动 GitHub 官方云端开发容器（Codespaces）。

4. 代码可视化与极简预览工具

• GitHistory。在打开具体某一个代码文件时，将网址中的 github.com 替换为 github.githistory.xyz，以时间轴动画形式直观回放该文件自创建以来的每一次修改对比。
• Active Forks。将 github.com 替换为 techgaun.github.io/active-forks/index.html#owner/repo，当原项目长期无人维护时，快速找出全网最新、提交最活跃的 Fork 分支。
• Nbviewer。对于包含 Jupyter Notebook（.ipynb）的仓库，将 github.com 替换为 nbviewer.org/github，解决 GitHub 原生渲染大型 Notebook 经常加载失败或图表不显示的问题。

实用小贴士：如何零成本管理这么多后缀？

由于衍生网站更新迭代很快，除了安装油猴脚本，你还可以直接在浏览器的 “搜索引擎管理” 中添加自定义快捷关键词：
1. 打开浏览器设置 -> 搜索引擎 -> 管理搜索引擎和网站搜索。
2. 添加新条目，例如将关键词设为 gw，网址格式填为 https://deepwiki.com；或将关键词设为 gd，网址填为 https://gitdiagram.com。
3. 以后在浏览器地址栏输入 gd 空格 owner/repo 并回车，就能直接跳转到对应衍生页面，完全不依赖任何网页端注入插件。

除了前面提到的工具，还有一批同样可以通过替换域名或拼接路径直接跳转的 GitHub 衍生网站。这些工具涵盖多模态转换、AI 构建器导入、仓库体检面板以及本地目录下载等细分场景： [1] (https://www.youtube.com/watch?v=r28zCDxEH0I), [2] (https://www.youtube.com/watch?v=GINTfprgC7Y)

1. 多模态解读与 AI 应用构建器

• GitPodcast（仓库转音频播客）。将网址中的 github.com 替换为 gitpodcast.com（即 ://gitpodcast.com），系统会自动分析代码库并生成一段双人对话式的音频播客，适合在通勤或休息时用听觉快速了解项目结构。 [1] (https://www.youtube.com/watch?v=GINTfprgC7Y)
• Bolt.new（一键导入 AI 全栈构建器）。在完整 GitHub 网址前加上 bolt.new/（或将 github.com 替换为 bolt.new/~/github.com），可直接把仓库导入 StackBlitz 旗下的 Bolt AI 编程环境中，直接通过自然语言对话修改代码并预览部署。 [1] (https://www.youtube.com/watch?v=GINTfprgC7Y)
• GitHub.gg（仓库控制面板与质量评估）。将 github.com 替换为 github.gg（即 github.gg/owner/repo），提供一站式的仓库评估仪表盘，支持一键生成代码质量评分、基础安全扫描报告以及面向 AI 的复制文本。 [1] (https://www.youtube.com/watch?v=GINTfprgC7Y)

2. 无需 Git 的局部下载与文件直达技巧

• Download Directory（仅下载仓库中的单个子文件夹）。当你只想下载大型仓库里的某一个子目录而不想克隆整个项目时，只需复制该子文件夹的完整网址，将其中的 github.com 替换为 download-directory.github.io?url= 即可自动打包成 ZIP 下载。 [1] (https://www.youtube.com/watch?v=r28zCDxEH0I)
• 仓库全量快照直链（内置URL技巧）。在任意仓库主页链接后直接拼接 /archive/refs/heads/main.zip（或将 main 改为对应分支名如 master），无需点击页面上的 Code -> Download ZIP 即可直接触发压缩包下载。 [1] (https://www.youtube.com/watch?v=r28zCDxEH0I)
• Raw 纯文本与指定行号高亮（内置URL技巧）。在具体代码文件的 URL 末尾加上 ?plain=1 可强制以纯文本格式渲染（跳过 Markdown 或 Jupyter 的富文本渲染）；在末尾加上 #L10-L25 则可直接定位并高亮第 10 到 25 行代码。 [1] (https://www.youtube.com/watch?v=r28zCDxEH0I)

3. 开发者画像与订阅监控

• GitHub Readme Stats / Profile Summary。将用户名拼接到开源统计卡片域名后，可生成某个开发者或组织的语言偏好、提交热力图与综合评级看板。
• Release / Commit 订阅源（内置URL技巧）。在任意仓库的 /releases 或 /commits 网址末尾直接加上 .atom（例如 ://github.com），即可直接获取标准的 RSS/Atom 订阅链接，方便接入各类自动化监控或阅读器跟踪版本更新。 [1] (https://www.youtube.com/watch?v=r28zCDxEH0I)

聚合所有衍生站点的完整油猴脚本（可直接复制使用）

如果你希望在浏览任何 GitHub 仓库时，不用死记硬背这二三十个域名，可以直接在浏览器安装 Tampermonkey（油猴） 扩展，新建脚本并粘贴以下代码。它会在仓库右上角添加一个 “🚀 衍生工具” 悬停下拉菜单，包含全部常用跳转入口：
javascript
// ==UserScript==
// @name         GitHub 衍生工具全能聚合跳转菜单
// @namespace    http://tampermonkey.net
// @version      1.0
// @description  在 GitHub 仓库顶部注入下拉菜单，一键跳转 DeepWiki、GitDiagram、Zread、Gitingest、GitMCP 等 15+ 衍生网站
// @match        https://github.com*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const sites = [
        { category: '🤖 AI 文档与架构解析', items: [
            { name: 'DeepWiki (AI 百科问答)', fn: (u, r) => `https://deepwiki.com{u}/${r}` },
            { name: 'GitDiagram (交互架构图)', fn: (u, r) => `https://gitdiagram.com{u}/${r}` },
            { name: 'Google Code Wiki', fn: (u, r) => `https://codewiki.google{u}/${r}` },
            { name: 'Zread (中文深度解读)', fn: (u, r) => `https://zread.ai{u}/${r}` },
            { name: 'Repowise (依赖与健康度)', fn: (u, r) => `https://repowise.dev{u}/${r}` },
            { name: 'GitPodcast (转音频播客)', fn: (u, r) => `https://gitpodcast.com{u}/${r}` }
        ]},
        { category: '📦 LLM 上下文与 MCP', items: [
            { name: 'Gitingest (转纯文本提示词)', fn: (u, r) => `https://gitingest.com{u}/${r}` },
            { name: 'GitMCP (生成 MCP 服务)', fn: (u, r) => `https://gitmcp.io{u}/${r}` },
            { name: 'uithub (LLM 就绪文本)', fn: (u, r) => `https://uithub.com{u}/${r}` },
            { name: 'Repomix (单文件打包)', fn: (u, r) => `https://repomix.com{u}/${r}` },
            { name: 'GitMVP (逆向复刻提示词)', fn: (u, r) => `https://gitmvp.com{u}/${r}` }
        ]},
        { category: '💻 在线 IDE 与云端沙盒', items: [
            { name: 'GitHub.dev (网页 VS Code)', fn: (u, r) => `https://github.dev{u}/${r}` },
            { name: 'GitHub1s (极速只读预览)', fn: (u, r) => `https://github1s.com{u}/${r}` },
            { name: 'StackBlitz (前端运行沙盒)', fn: (u, r) => `https://stackblitz.com{u}/${r}` },
            { name: 'Bolt.new (AI 构建器导入)', fn: (u, r) => `https://bolt.new{u}/${r}` }
        ]},
        { category: '📊 数据分析与实用工具', items: [
            { name: 'OSS Insight (深度体检)', fn: (u, r) => `https://ossinsight.io{u}/${r}` },
            { name: 'Star History (Star 曲线)', fn: (u, r) => `https://star-history.com{u}/${r}` },
            { name: 'GitHub.gg (质量评估面板)', fn: (u, r) => `https://github.gg{u}/${r}` },
            { name: 'Active Forks (寻找活跃分支)', fn: (u, r) => `https://github.io{u}/${r}` }
        ]}
    ];

    function injectMenu() {
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        if (pathParts.length < 2) return;
        const [owner, repo] = pathParts;
        const ignored = ['settings', 'orgs', 'topics', 'trending', 'explore', 'marketplace', 'notifications'];
        if (ignored.includes(owner) || document.getElementById('gh-derived-tools-btn')) return;

        const targetContainer = document.querySelector('#repository-details-container ul.pagehead-actions') ||
                                document.querySelector('ul.pagehead-actions');
        if (!targetContainer) return;

        const li = document.createElement('li');
        li.id = 'gh-derived-tools-btn';
        li.style.position = 'relative';

        const btn = document.createElement('button');
        btn.className = 'btn btn-sm';
        btn.innerHTML = '🚀 衍生工具 ▾';
        btn.style.cursor = 'pointer';

        const dropdown = document.createElement('div');
        dropdown.style.cssText = `
            display: none; position: absolute; right: 0; top: 100%; z-index: 9999;
            min-width: 240px; max-height: 480px; overflow-y: auto;
            background: var(--bgColor-default, #ffffff);
            color: var(--fgColor-default, #1f2328);
            border: 1px solid var(--borderColor-default, #d0d7de);
            border-radius: 6px; box-shadow: 0 8px 24px rgba(140,149,159,0.2);
            padding: 6px 0; margin-top: 4px; font-size: 13px;
        `;

        sites.forEach(group => {
            const header = document.createElement('div');
            header.textContent = group.category;
            header.style.cssText = 'padding: 6px 12px 2px; font-weight: 600; font-size: 11px; opacity: 0.7;';
            dropdown.appendChild(header);

            group.items.forEach(site => {
                const a = document.createElement('a');
                a.textContent = site.name;
                a.href = site.fn(owner, repo);
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.style.cssText = 'display: block; padding: 5px 16px; color: inherit; text-decoration: none;';
                a.onmouseenter = () => { a.style.backgroundColor = 'var(--bgColor-muted, #f6f8fa)'; };
                a.onmouseleave = () => { a.style.backgroundColor = 'transparent'; };
                dropdown.appendChild(a);
            });
        });

        btn.onclick = (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        };
        document.addEventListener('click', () => { dropdown.style.display = 'none'; });

        li.appendChild(btn);
        li.appendChild(dropdown);
        targetContainer.prepend(li);
    }

    injectMenu();
    document.addEventListener('turbo:load', injectMenu);
})();
请谨慎使用此类代码。
如果你还想要针对特定细分领域（例如生物信息学/科研模型仓库的在线推理平台、Docker 镜像构建转换或命令行 CLI 批量调用这些站点的接口），可以随时告诉我你的具体偏好。

