<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/archify-lockup-dark.svg" />
    <img src="docs/assets/archify-lockup-light.svg" alt="Archify" width="440" height="121" />
  </picture>
</p>
<h3 align="center">把你想理解、規劃或分享的事，變成可以互動的可視化作品。</h3>

<p align="center">從一個想法、一個問題或一份計劃開始。把它描述給 AI Agent，Archify 就能生成可以探索、修改和分享的交互式 HTML。從旅行行程、知識地圖到複雜系統，你都可以繼續擴展，做成自己需要的樣子。</p>

<p align="center">看看社區正在創造什麼，也想想你還能用它做些什麼。</p>

<p align="center">
  <a href="https://tt-a1i.github.io/archify/gallery.html"><strong>交互演示</strong></a> &nbsp;·&nbsp;
  <a href="#start"><strong>開始使用</strong></a> &nbsp;·&nbsp;
  <a href="https://tt-a1i.github.io/archify/guide.html"><strong>場景指南</strong></a> &nbsp;·&nbsp;
  <a href="#社區交流"><strong>社區交流</strong></a> &nbsp;·&nbsp;
  <a href="./README.md"><strong>English</strong></a>
</p>

<p align="center">
  <a href="https://trendshift.io/repositories/31352?utm_source=repository-badge&amp;utm_medium=badge&amp;utm_campaign=badge-repository-31352" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/repositories/31352" alt="tt-a1i/archify | Trendshift" width="250" height="55" /></a>
</p>

<p align="center">
  <a href="https://github.com/tt-a1i/archify/stargazers"><img src="https://img.shields.io/github/stars/tt-a1i/archify?style=flat-square&amp;color=E5B650&amp;logo=github&amp;label=Stars" alt="GitHub stars" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" alt="MIT License" /></a>
  <a href="archify/SKILL.md"><img src="https://img.shields.io/badge/Agent-Skill-7C3AED?style=flat-square" alt="Agent Skill" /></a>
  <a href="CHANGELOG.md#unreleased"><img src="https://img.shields.io/badge/version-2.17.0--dev.1-0891b2?style=flat-square" alt="Development version 2.17.0-dev.1" /></a>
</p>

<p align="center">
  <a href="https://tt-a1i.github.io/archify/"><img src="https://img.shields.io/badge/Website-0891B2?style=for-the-badge" alt="Archify website" /></a>
  <a href="https://discord.gg/6xWMjgCeUq"><img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&amp;logo=discord&amp;logoColor=white" alt="Join Archify on Discord" /></a>
  <a href="#社區交流"><img src="https://img.shields.io/badge/WeChat-07C160?style=for-the-badge&amp;logo=wechat&amp;logoColor=white" alt="Archify WeChat group" /></a>
  <a href="#社區交流"><img src="https://img.shields.io/badge/QQ-1688D8?style=for-the-badge&amp;logo=qq&amp;logoColor=white" alt="Archify QQ group" /></a>
  <a href="https://x.com/t20000622yy"><img src="https://img.shields.io/badge/Creator_on_X-181717?style=for-the-badge&amp;logo=x&amp;logoColor=white" alt="Follow the creator on X" /></a>
</p>

## 看看 Archify 能做什麼

<p align="center">
  <a href="https://tt-a1i.github.io/archify/gallery.html"><img src="docs/assets/archify-live-proof.gif" alt="三個經過驗證的 Archify 成品依次展示 Signal Flow、Blueprint 和 Classic 預設" width="960"/></a>
  <br/>
  <sub><strong>三個真實生成、校驗通過的成品。</strong> Signal Flow · Blueprint · Classic · <a href="https://tt-a1i.github.io/archify/gallery.html">打開可交互驗證作品集 ↗</a></sub>
</p>

**點擊上方預覽，打開真實交互成品。** GIF 展示效果，瀏覽器中的 HTML 才能點擊探索。

<a id="start"></a>

### 安裝，然後說出你的想法

支持 Cursor、Claude Code、Codex CLI 和 OpenCode；更多接入方式見下方安裝選項。

```bash
npx skills add tt-a1i/archify -g
```

把這句話發給你的 Agent：

```text
用 Archify 畫出一個網站的請求流程：瀏覽器請求 API，
API 優先讀取 Redis，緩存未命中時查詢 PostgreSQL 並回填緩存。
```

繼續說：「添加鑑權步驟」「突出緩存未命中的路徑」「切換淺色主題」。

**不需要綁定代碼庫：**從描述開始即可。也可以讓 Agent 閱讀倉庫，生成有源碼依據的架構圖。

[按 Agent 選擇安裝方式](https://tt-a1i.github.io/archify/start.html?agent=cursor&type=architecture) · [安裝細節與更新檢查](#快速開始)

## ❤️ 贊助夥伴

<table>
<tr>
  <td align="center" width="240"><a href="https://supercode.sh/?utm_source=archify"><img src="https://cdn.supercode.sh/sponsors/supercode-logo.png" alt="Supercode" width="200"/></a><br/><strong><a href="https://supercode.sh/?utm_source=archify">supercode.sh</a></strong></td>
  <td><a href="https://supercode.sh/?utm_source=archify">Supercode</a> 贊助 Archify，通過 Token 優化、精選 Skills 和規範驅動開發增強 Codex 與 Cursor。Archify 已入選 <a href="https://supercode.sh/en/skills/tt-a1i/archify/archify">Supercode Editor’s Choice</a> 技能。<br/><br/><a href="https://supercode.sh/en/skills/tt-a1i/archify/archify"><img src="https://supercode.sh/badges/editors-choice.svg" alt="Supercode Editor’s Choice — Archify" width="240" height="55"/></a></td>
</tr>
<tr><td align="center" width="240"><a href="https://github.com/EverMind-AI/Raven"><img src="docs/assets/sponsors/evermind-archify-raven.png" alt="Archify × Raven" width="200" /></a><br/><strong><a href="https://github.com/EverMind-AI">EverMind</a> · <a href="https://github.com/EverMind-AI/Raven">Raven</a></strong></td><td>感謝 EverMind 贊助 Archify。EverMind 專注 Agent 記憶基礎設施，旗下 <a href="https://github.com/EverMind-AI/Raven"><strong>Raven</strong></a> 已支持 Archify Skill，讓 Raven 工作流可以直接生成經過驗證的交互式系統地圖。</td></tr>
</table>

> 想贊助 Archify？[歡迎通過郵件聯繫我們。](mailto:2801884530@qq.com)

## 用圖把事情講明白

| 講清 Agent 如何調用工具 | 跟隨一次緩存回源請求 | 看清服務與資料庫的關係 |
|---|---|---|
| [![Agent 工作流正在播放一個作者章節](docs/assets/archify-demo-story.png)](https://tt-a1i.github.io/archify/gallery/artifacts/agent-tool-call.workflow.html?theme=dark&present=1&play=1#view=happy-path) | [![緩存未命中時從 Web App 到 Postgres 的路徑](docs/assets/archify-demo-route.png)](https://tt-a1i.github.io/archify/gallery/artifacts/cache-miss.sequence.html?theme=dark&present=1#route=web~db) | [![生產架構中後端與資料庫角色的真實關係](docs/assets/archify-demo-lens.png)](https://tt-a1i.github.io/archify/gallery/artifacts/production-deployment.architecture.html?theme=dark&present=1#lens=backend~database) |
| 按章節講解圖中定義的步驟。 | 點亮 Web App 到資料庫的路徑。 | 聚焦後端與資料庫之間已定義的連接。 |

[Proof Lab](https://tt-a1i.github.io/archify/gallery.html) 收錄全部 11 個倉庫內場景、JSON 源、命名視圖和校驗回執。

### 看懂一個真實代碼倉庫

<sub>CODE → DIAGRAM · 有源碼依據的系統地圖</sub>

[![根據公開倉庫 mco-org/mco 生成的 MCO 運行時架構圖](docs/assets/mco-runtime-share-card.png)](https://tt-a1i.github.io/archify/cases/mco-runtime.architecture.html?theme=dark&present=1#view=dispatch-path)

Archify 追蹤 [`mco-org/mco`](https://github.com/mco-org/mco) 的 `9f1a1cf` 版本並生成這張校驗地圖。**[打開成品 ↗](https://tt-a1i.github.io/archify/cases/mco-runtime.architecture.html?theme=dark&present=1#view=dispatch-path)** · [追蹤下遊 ↗](https://tt-a1i.github.io/archify/cases/mco-runtime.architecture.html?theme=dark#focus=router&reach=downstream) · [Typed Source](docs/cases/mco-runtime.architecture.json)

### 易於擴展，社區還在不斷創造新用法

<sub>COMMUNITY STORIES · 社區用戶提供的部分案例</sub>

**生成之後，還可以繼續創造。** Archify 開源，成品是獨立 HTML，你可以讓 Agent 在此基礎上繼續修改、接入連結、擴展交互，做出適合自己場景的作品。社區已經把它用到了團隊協作、旅行規劃、法律核驗、合同審查和故障復盤；下面只是其中一部分。

一位用戶從紙上手繪的多智能體架構開始，讓 Agent 生成交互圖，再通過對話加入 Kimi 執行池。另一些用戶讓 Agent 閱讀項目，把生成的架構圖帶進飛書或釘釘，繼續和團隊討論。

還有用戶把上海 CityWalk 攻略整理成了四天行程圖：按天切換路線，點擊節點查看地點信息，並跳轉高德地圖、小紅書和大眾點評。作者還擴展了到達打卡和停留記錄，讓一張路線圖變成旅途中可以實際使用的小工具。這些擴展由社區作者為該作品添加。

**[▶ 點擊體驗上海 CityWalk 交互版](https://tt-a1i.github.io/archify/cases/community/shanghai-citywalk.html)**

[![社區用戶創作的上海 CityWalk 四天行程圖](docs/assets/community/shanghai-citywalk.png)](https://tt-a1i.github.io/archify/cases/community/shanghai-citywalk.html)

**[▶ 點擊體驗交互版](https://tt-a1i.github.io/archify/cases/community/shanghai-citywalk.html)** · 切換 D1–D4 行程，點擊地點查看詳情。

<sub>社區作品 · 上海 CityWalk · 四天行程與地點連結</sub>

### 下載下來，親手點一點

成品是一個獨立的 HTML 文件。下載後用瀏覽器打開，即可使用該作品包含的節點詳情、路徑探索和章節演示，無需安裝 Archify。把 HTML 文件發給別人，交互也會一起保留；外部網站和地圖連結需要網絡。

**[打開上海 CityWalk 交互版 ↗](https://tt-a1i.github.io/archify/cases/community/shanghai-citywalk.html)** · **[下載 HTML ↓](https://github.com/tt-a1i/archify/raw/refs/heads/main/docs/cases/community/shanghai-citywalk.html)**

<sub>試試切換 D1–D4、點擊地點卡片，或打開地圖連結。行程中的時間和地點信息為作者創作時的記錄。</sub>

## 社區與關注

- **GitHub Trending 全球倉庫周榜第一。** [作者於 2026 年 9 月 1 日發布的榜單截圖](https://x.com/t20000622yy/status/2094656813576880285)，篩選為所有語言、This week。
- **量子位報導與人物採訪。** [項目報導](https://www.qbitai.com/2026/09/482469.html) · [開發者故事](https://www.qbitai.com/2026/09/488519.html)。
- **開發者社區推薦。** [midudev 分享](https://x.com/midudev/status/2094425974406320207)。

<sub>這裡選列部分公開報導、分享與歷史裡程碑；排名日期及來源見連結。</sub>

## 預覽

<details>
<summary>深淺主題、導出菜單與分享卡片</summary>

<p align="center"><img src="docs/assets/archify-readme-hero.png" alt="Archify — interactive diagrams" width="960" /></p>

同一張圖，兩套主題，一鍵切換：

| 深色 | 淺色 |
|---|---|
| ![深色主題](docs/assets/archify-dark.png) | ![淺色主題](docs/assets/archify-light.png) |

Export 菜單支持複製 PNG，並下載靜態或動態格式：

![導出菜單](docs/assets/archify-menu.png)

需要用於 README、Release 或社交平臺的標準 1200×630 圖片時，使用 **Copy Share Card**。

路徑解析後，**Export → Route Share Card** 會把真實路徑下載為 1200×630 PNG，並保留完整拓撲上下文。

![Route Share Card：突出 Users 到 API Server 的精確路徑，同時保留完整架構作為上下文](docs/assets/archify-route-share-card.png)

完成 authored `Upstream` 或 `Downstream` reach 後，**Export → Reach Share Card** 會捕獲這次閱讀結果，但不冒充運行時影響分析。

![MCO downstream Reach Share Card：展示從 Command Router 出發的已創作關係](docs/assets/mco-runtime-reach-share-card.png)

在本地打開 [`examples/web-app.html`](examples/web-app.html)，即可體驗完整 Viewer。

</details>

## 快速開始

**當前開發版本：** `v2.17.0-dev.1`。詳見[版本歷史](CHANGELOG.md#unreleased)。

### 1. 安裝

```bash
npx skills add tt-a1i/archify -g
```

<details>
<summary>更多安裝方式與更新檢查說明</summary>

顯式、非交互地安裝到 Cursor：

```bash
npx -y skills add tt-a1i/archify --skill archify --agent cursor --global --copy --yes
```

如果只想臨時體驗：

```bash
npx skills use tt-a1i/archify@archify --agent codex
```

DeepSeek Harness（社區集成、顯式啟用）：運行 `dsh plugin --profile web add @tt-a1i/archify-dsh@0.1.0`；參見[兼容範圍、限制與安全說明](integrations/deepseek-harness/README.md)。[Agent 切換器](https://tt-a1i.github.io/archify/start.html?agent=cursor&type=architecture)只為 `cursor`、`codex`、`claude-code` 和 `opencode` 生成命令。Raven 僅支持 ZIP 手動安裝：將 [`archify.zip`](archify.zip) 解壓到 `~/.raven/workspace/skills`，解壓後會得到 `~/.raven/workspace/skills/archify`；Raven 不屬於切換器目標。

安裝後的 Skill 包含一個低頻、失敗靜默的發布檢查，它最多只顯示可選更新提醒，絕不會自行下載或安裝更新。一次成功檢查後，下次網絡請求通常約在 72 小時（±20%）後發出；檢查失敗後，活躍使用可能在首次 6 小時、後續 24 小時退避到期時重試。請求只訪問 `https://tt-a1i.github.io/archify/skill-updates/archify/stable.json`。服務端會自然獲得 IP、請求時間和常規 HTTP 元數據；檢查器不會發送本地版本、Agent、項目數據、用戶輸入、帳戶/設備標識，也不會保存或回傳 ETag。是否更新以及何時更新始終由你決定。如需完全關閉檢查（包括網絡請求和提醒狀態寫入），請在 Agent 環境中設置 `ARCHIFY_UPDATE_CHECK_DISABLED=1`。

</details>

### 2. 直接從描述開始——不需要代碼庫

```text
用 Archify 畫出：Browser -> API -> Redis 緩存 -> PostgreSQL 回源。
```

需要源碼證據時，打開倉庫後改用：

```text
分析這個倉庫，然後使用 archify 生成一張高層運行時架構圖。
只保留 8–12 個核心組件，突出一條主要路徑，並標出外部依賴與信任邊界。
輔助信息放進說明卡片，不要繼續增加連線。
```

### 3. 在對話中細調

繼續說：`增加 Redis`、`把鑑權移到左側`、`突出回滾路徑`。Archify 會保留 Typed Source，只修改相關部分。

## 選擇合適的圖表

<details>
<summary>五種圖表、架構差異對比與示例</summary>


| 類型 | 最適合 | Prompt 中應包含 |
|---|---|---|
| **Architecture** | 組件、服務、存儲和系統邊界 | 範圍、核心組件、主要路徑 |
| **Workflow** | CI/CD、審批、工具調用、Runbook | 參與者、順序、分支、異常 |
| **Sequence** | API 調用、緩存回源、鑑權、異步鏈路 | 調用方、被調用方、返回、時序 |
| **Data Flow** | 數據管線、血緣、PII、下遊消費者 | 來源、轉換、存儲、邊界 |
| **Lifecycle** | 狀態、重試、等待、終態 | 狀態、事件、重試與取消路徑 |

做生產部署評審時，Architecture 可以按需啟用 `deployment-ownership`
工程畫像：負責人、單一區域歸屬、資料庫私有邊界或邊界穿越機制缺失時會直接阻斷。
它不會被靜默開啟，只校驗作者寫入的事實，不代表線上基礎設施已經核驗。可查看
[通過校驗的部署證明](https://tt-a1i.github.io/archify/gallery.html#proof-deployment-ownership)。

做設計或 PR 評審時，Architecture Delta 生成已校驗的 Before / Delta / After 和機器回執。精確選擇任一作者變更，或播放一次有限 Review；全程只讀，不推斷影響、風險或合併安全。

`node archify/bin/archify.mjs compare architecture base.json head.json architecture-delta.html --json`

[![Architecture Delta：展示作者明確寫出的新增、刪除、變化和移動](docs/assets/architecture-delta-proof.jpg)](examples/checkout-platform-delta.html)

不知道選哪一種？打開[交互式場景指南](https://tt-a1i.github.io/archify/guide.html)，或直接詢問零依賴 CLI：

```bash
node archify/bin/archify.mjs guide "展示帶 Redis 緩存未命中的 API 請求"
node archify/bin/archify.mjs guide "梳理 Kafka Topic、消費者組、重放和死信隊列" --json
```

Workflow 用泳道保持主路徑清晰：

![Workflow 示例](docs/assets/archify-workflow.png)

Sequence 解釋一次交互隨時間如何推進：

![Sequence 示例](docs/assets/archify-sequence.png)

Data Flow 突出數據移動和敏感邊界：

![Data Flow 示例](docs/assets/archify-dataflow.png)

Lifecycle 區分正常進展、等待、重試和終態：

![Lifecycle 示例](docs/assets/archify-lifecycle.png)

Architecture 示例：[`Web App`](examples/web-app.html) · [`Archify Pipeline`](examples/archify-repo.html) · [`Grid 布局`](examples/archify-repo-grid.html) · [`桌面 Agent`](examples/maka-architecture.html)

</details>

## 為什麼用 Archify

| 讀懂結構 | 邊看邊講 |
|---|---|
| 從代碼或描述出發，整理關鍵組件、流程和關係。 | 點擊節點、追蹤路徑、按章節展開複雜流程。 |
| **易於擴展** | **方便交付** |
| 保留可編輯源文件，也可基於開原始碼和 HTML 成品擴展自己的交互與用途。 | 分享獨立 HTML，或導出圖片、視頻與分享卡片。 |

<details>
<summary>這些體驗背後的工程能力</summary>


- **用布局判斷代替通用自動布局** —— Agent 根據故事選擇層級、留白、線路和強調關係；共享的自動端點會確定性展開，不再讓多支箭頭堆在同一個中點。
- **Typed JSON IR** —— 每種 Renderer 模式都有 Schema 和可復現的源文件。
- **原子交付前校驗** —— Schema、布局、HTML/SVG、線路和標籤到其他路徑的淨空檢查必須全部通過，Showcase 成品才會替換上一份可信結果。
- **失敗也有結構化修復回執** —— `validate --json` 和 `deliver --json` 會返回穩定規則碼、準確對象、測量證據和真正支持的修復旋鈕，不再讓 Agent 從 Node 堆棧或自由文本裡猜。
- **保留最後好圖的實時預覽** —— 可選桌面循環只監聽一個 JSON；只有最新候選通過全部門禁才刷新，半寫入或無效保存時繼續顯示上一份驗證成品。
- **交互不編造拓撲** —— 聚焦、上下遊可達範圍、精確路徑、角色對比和故事都復用作者定義的節點與關係，也不把圖上可達誤報成真實運行時影響。
- **只在需要時附源碼證據** —— 有證據的 Architecture 節點會顯示 `SRC n`，並可打開由 Git 校驗、固定到公開 commit 的文件與行號；普通成品不攜帶源碼信息。
- **結果默認便攜** —— 一個 HTML 文件即可分享；導出永遠是完整原圖，不攜帶臨時 Viewer 狀態。

Archify 不是通用繪圖編輯器，也不是 Mermaid 主題；它負責把技術意圖變成可交流的成品。

</details>

## 工作原理

<details>
<summary>生成、校驗、預覽與交付的技術細節</summary>

| 步驟 | 發生什麼 |
|---|---|
| **生成** | Agent 根據描述創建 Typed JSON IR。 |
| **校驗** | 內置 Validator 和布局規則檢查源文件；失敗時用機器可讀 JSON 指出準確的局部修復。 |
| **預覽（可選）** | 僅 loopback 的桌面會話監聽一個源文件，只刷新驗證版本；失敗時保留最後好圖。 |
| **交付** | 在目標同目錄生成並檢查候選；只有通過門禁的結果才原子替換目標文件，隨後可選用 `--open` 打開這個確切成品。 |
| **迭代** | Agent 修改源文件，不幹擾無關結構。 |

倉庫常用命令：

```bash
cd archify
node bin/archify.mjs doctor
node bin/archify.mjs demo /tmp/archify-demo
node bin/archify.mjs guide "展示 CI/CD 檢查、審批、部署和回滾"
node bin/archify.mjs validate workflow examples/agent-tool-call.workflow.json --quality showcase --json
node bin/archify.mjs preview workflow examples/agent-tool-call.workflow.json /tmp/workflow.html --quality showcase
node bin/archify.mjs deliver workflow examples/agent-tool-call.workflow.json /tmp/workflow.html --quality showcase --open --json
```

`preview` 是顯式啟用的桌面創作模式，不是默認後臺服務：它只在隨機埠監聽 `127.0.0.1`，只觀察指定 JSON，失敗時保留上一份驗證輸出，並通過 Ctrl-C 停止。測試或準備手動打開列印出的本地 URL 時可加 `--no-open`。生成的 HTML 不會攜帶 Preview Runtime。

`deliver --open` 適合一次性的本地交互交付。它默認關閉，並且只在驗證成品原子提交後執行；系統無法打開時，交付仍保持成功，JSON 只寫 stdout，stderr 會給出可手動打開的絕對路徑。

失敗時，`validate --json` 和 `deliver --json` 仍然只輸出一個 JSON 對象。讀取 `diagnostics[]`，只修改其中 `subject` 指向的對象，並使用 `supportedFixes` 列出的修複方式；不要整圖重寫，也不要突破 Skill 最多兩輪的聚焦修復上限。確定性診斷仍不等於視覺覆核。

動態和演示樣式需要顯式選擇：

```json
{
  "meta": {
    "locale": "zh-TW",
    "animation": "trace",
    "visual_preset": "signal-flow"
  }
}
```

不設置 `animation` 時結果完全靜態；`classic` 始終是默認視覺預設。設計評審、發布說明和技術文檔可以顯式選擇 `editorial`，獲得暖紙張與深墨色的編輯風格，同時保持幾何完全不變。將 `meta.locale` 設為 `en` 或 `zh-TW`，可選擇 `<html lang>`、默認圖例、無障礙文案和所有固定 Viewer UI。作者編寫的標題、節點、關係、章節和卡片不會被機器翻譯。未帶該欄位的舊文件仍然有效，並默認使用英文。對於其他任何創作語言，應省略 `meta.locale`、保持 authored content 使用用戶要求的語言，並主動告知用戶固定 Viewer UI 與 `<html lang>` 回退為英文，因此該成品不屬於完整本地化。

</details>

## 探索與分享

| 操作 | 控制方式 |
|---|---|
| 打開事實型 Diagram Guide | <kbd>?</kbd> |
| 查找並聚焦語義節點 | <kbd>/</kbd> |
| 追蹤作者定義的上遊 / 下遊可達範圍 | 聚焦節點 → `Upstream` / `Downstream` |
| 探查有向路徑並逐站檢查 | <kbd>R</kbd> 或「路徑」 |
| 對比一種或兩種語義角色 | <kbd>L</kbd> 或「透鏡」 |
| 打開實時全局雷達 | <kbd>M</kbd> 或「地圖」 |
| 播放故事 / 切換章節 | <kbd>P</kbd> / <kbd>[</kbd> <kbd>]</kbd> |
| 進入 Presentation Stage | <kbd>F</kbd> |
| 選擇視覺風格（<kbd>S</kbd> 循環）/ 切換主題 / 打開 Export | <kbd>S</kbd> / <kbd>T</kbd> / <kbd>E</kbd> |
| 縮放或復位 | <kbd>+</kbd> / <kbd>-</kbd> / <kbd>0</kbd> |

穩定連結可以恢復 `#focus=<id>`、`#focus=<id>&reach=upstream|downstream`、`#relation=<id>`、`#route=<source>~<target>`、`#lens=<kind>~<kind>` 和 `#view=<view-id>`。讀者觸發的動態有限運行、遵守 `prefers-reduced-motion`，並且不會進入標準導出。

完整生成與 Viewer 契約請查看 [`archify/SKILL.md`](archify/SKILL.md)。

## 安裝方式

| 使用位置 | 安裝位置或方法 | 能力 |
|---|---|---|
| **Raven** | ZIP 手動安裝：將 `archify.zip` 解壓到 `~/.raven/workspace/skills`，解壓後會得到 `~/.raven/workspace/skills/archify` | 完整 Renderer + Validation 工作流 |
| **Claude Code** | `~/.claude/skills/` 或 `.claude/skills/` | 完整 Renderer + Validation 工作流 |
| **Codex CLI** | `~/.agents/skills/` 或 `.agents/skills/` | 完整 Renderer + Validation 工作流 |
| **opencode** | `~/.config/opencode/skills/`、`.opencode/skills/` 或 `.agents/skills/` | 完整 Renderer + Validation 工作流 |
| **Claude.ai** | Settings → Capabilities → Skills 中上傳 `archify.zip` | 取決於沙箱是否提供 Node.js |
| **Project Knowledge** | 把 `archify.zip` 上傳到項目 | Prompt 驅動的 Architecture Fallback |
| **DeepSeek Harness** | 顯式啟用：`dsh plugin --profile web add @tt-a1i/archify-dsh@0.1.0`；調用：`Use the archify skill to map this repository's runtime architecture.`；卸載：`dsh plugin --profile web remove @tt-a1i/archify-dsh`。 | 面向開發者預覽版 `@deepseek-ai/dsh@0.1.0-rc.6` 的社區集成；Node `^22.19.0 \|\| >=24.0.0`；不是 DeepSeek 官方產品。沒有遙測；shell 文件不會自動進入 Web Produced Files，請返回精確工作區路徑。[詳情](integrations/deepseek-harness/README.md)。 |

## 參考與邊界

- [Schema 說明](archify/schemas/README.md)
- [Skill 與 Renderer 契約](archify/SKILL.md)
- [示例](archify/examples/)
- [Agent 編圖手冊](docs/authoring-cookbook.zh-TW.md) · [English](docs/authoring-cookbook.md)
- [版本歷史](CHANGELOG.md)
- [路線圖](ROADMAP.md)
- [自動生成的 Proof Lab](https://tt-a1i.github.io/archify/gallery.html)

自動 Mermaid Parser、通用自動布局、託管分享服務和 WYSIWYG 編輯器目前都不在產品範圍內。

## 社區交流

👋 **歡迎加入 Archify 社區！**

與其他用戶和開發者交流、分享想法、提出功能建議、報告問題、討論開發，並一起讓 Archify 變得更好。

- <img src="docs/assets/community/discord.svg" alt="" width="18" /> [加入 Discord](https://discord.gg/6xWMjgCeUq)
- <img src="docs/assets/community/wechat.svg" alt="" width="18" /> 微信群：掃描下方二維碼。微信群二維碼會定期失效；如二維碼已過期，請通過 Discord 或 QQ 聯繫管理員獲取最新二維碼。
- <img src="docs/assets/community/qq.svg" alt="" width="18" /> QQ 群：`1121948602`

<table>
<tr>
  <td align="center"><strong><img src="docs/assets/community/wechat.svg" alt="" width="18" /> 微信群</strong><br/><img src="docs/assets/community/wechat-qr.png" alt="Archify Official 微信群二維碼" width="300" height="300" /></td>
  <td align="center"><strong><img src="docs/assets/community/qq.svg" alt="" width="18" /> QQ 群</strong><br/><img src="docs/assets/community/qq-qr.png" alt="Archify Official QQ 群二維碼" width="300" height="300" /></td>
</tr>
</table>

## License

[MIT](LICENSE) —— 可以自由使用、修改和分發。

## 參與貢獻

歡迎提交 Issue、Pull Request 和真實場景圖。請先閱讀[貢獻指南](CONTRIBUTING.md)；遇到問題時使用可復現 Bug 表單，也可以通過[社區 Showcase 表單](https://github.com/tt-a1i/archify/issues/new?template=showcase.yml)提交已驗證成品。

較大的功能或行為調整請先通過 Issue 對齊價值、兼容邊界和非目標，再基於最新 `main` 開發。一個 PR 儘量只解決一個問題；核心代碼和回歸測試先行，生成物最後統一重建。Archify 堅持 Agent-first，優先完善穩定的機器可讀診斷和現有權威合同，避免新增容易與 CLI 漂移的重複說明。&nbsp;·&nbsp;[LINUX&nbsp;DO](https://linux.do)

## Star History

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tt-a1i/archify/star-history/assets/star-history-dark.svg" /><img alt="Star History" src="https://raw.githubusercontent.com/tt-a1i/archify/star-history/assets/star-history-light.svg" /></picture></p>
