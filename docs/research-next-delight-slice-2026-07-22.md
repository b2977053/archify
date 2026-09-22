# Archify 下一增長切片研究：Last-Good Live Preview

日期：2026-07-22（Asia/Shanghai）
Archify 基線：`main@440e16d`；開放中的 [PR #44](https://github.com/tt-a1i/archify/pull/44) `@212639b` 已加入 opt-in Editable Source Capsule，五項遠端檢查全綠。**本建議只依賴 `main` 已有的 Atomic Delivery 與 Verified Open，可從 `main@440e16d` 獨立落地，不以 PR #44 合併為前置。**
上遊快照：Fireworks `50c819d`、draw.io MCP `c3fcfa5`、GitDiagram `20eea55`、D2 `2446e24`、Markmap `99fc93e`、Mermaid Live Editor `f8836bb`。

## 結論

下一刀推薦 **Last-Good Live Preview（保留最後有效成品的本地實時預覽）**：

```bash
archify preview <type> <input.json> \
  [--quality standard|showcase] [--no-open]
```

它在僅監聽 `127.0.0.1` 的隨機埠打開一個桌面預覽頁；輸入 JSON 變化後，先走 Archify 現有 renderer、composition gate 與 artifact checker，**只有完整通過才刷新瀏覽器**。非法或半寫入輸入只顯示精確診斷，上一份已驗證圖繼續留在畫布上。修復後自動恢復。

這是當前最合適的「好用 + 穩定 + 可展示」切片：D2 和 Mermaid Live Editor 已證明實時反饋是文本製圖的核心體驗；而 Archify 此前推遲 preview 所缺的 Atomic Delivery 與 Verified Open 前置條件現在已經在 `main` 具備。它改善的是作者從「改 JSON」到「看見可信結果」的循環，不再給已經很豐富的成品 Viewer 增加一個控制項，也不讀取或依賴 PR #44 的 Source Capsule。

## 一手事實，不按 Star 數抄功能

截至本次核驗，GitHub API 顯示 Fireworks 約 9.2k Star、draw.io MCP 約 4.9k、GitDiagram 約 15.8k、D2 約 24.7k、Markmap 約 13.0k、Mermaid Live Editor 約 6.7k。Star 只說明分發規模，不是採用整套架構的理由。

### Fireworks：視覺寬度必須被共同質量合同約束

- 當前 README 展示 12 種風格、四個工程語義 profile、14 類 UML 映射、offline HTML 和 GIF motion；真正可遷移的不是「12」這個數字，而是所有風格共用 geometry、text-fit、routing 與 motion gate。[README](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/blob/50c819d68fd4fee330b3010988cd13e98b678d44/README.md#L43-L150) · [composition contract](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/blob/50c819d68fd4fee330b3010988cd13e98b678d44/references/composition-quality-contract.md#L1-L75)
- v1.2.0 保留靜態 1920px PNG regression baselines，並在發布門中運行 12 風格、852 項 Chromium compatibility comparisons；可選 GIF 才引入 Chromium/FFmpeg，靜態路徑不被拖重。[v1.2.0 release](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/releases/tag/v1.2.0)
- Archify 已吸收這條紀律：三 preset 同拓撲、Semantic Sigils、有限 motion、確定性/感知式交付門。因此下一步不應再擴 style catalogue。

### D2 與 Mermaid Live Editor：即時反饋是作者體驗，但監聽和重渲並不簡單

- D2 Quickstart 的 `d2 --watch in.d2 out.svg` 會打開瀏覽器，並隨源文件變化 live reload。[D2 README](https://github.com/terrastruct/d2/blob/2446e247b6d7d5b9395a1ae8ad1e9c2641231035/README.md#L111-L124)
- D2 的 watcher 並非一次簡單 `fs.watch`：源碼明確警告文件通知 API 容易丟事件，另做修改時間補查、寫入 burst 合併、重試與 WebSocket 廣播。[watch.go](https://github.com/terrastruct/d2/blob/2446e247b6d7d5b9395a1ae8ad1e9c2641231035/d2cli/watch.go#L211-L329) 瀏覽器端在收到新 SVG 時才替換畫布，錯誤另行顯示。[watch.js](https://github.com/terrastruct/d2/blob/2446e247b6d7d5b9395a1ae8ad1e9c2641231035/d2cli/static/watch.js#L1-L55)
- Mermaid Live Editor把實時 edit/preview、SVG 保存和 viewer/edit links 列為核心功能。[README](https://github.com/mermaid-js/mermaid-live-editor/blob/f8836bb1540cf00090f529d776a958c557f24522/README.md#L4-L17) 其 E2E 明確測試複雜圖延遲更新、非法輸入不進入圖而進入錯誤面。[diagramUpdate.spec.ts](https://github.com/mermaid-js/mermaid-live-editor/blob/f8836bb1540cf00090f529d776a958c557f24522/tests/diagramUpdate.spec.ts#L3-L43) 當前 open issue #1892 也記錄了逐鍵重渲造成卡頓的用戶信號，說明 debounce 是穩定要求而非錦上添花。[issue #1892](https://github.com/mermaid-js/mermaid-live-editor/issues/1892)

### GitDiagram：代碼圖的高價值後續是可核驗來源，不是 Mermaid 本身

- GitDiagram 的第一階段要求 architecture brief 中的核心組件綁定 1–3 個真實 repo-relative paths；第二階段才產出有上限的 graph schema。[prompts.ts](https://github.com/ahmedkhaleel2004/gitdiagram/blob/20eea559377fe3f110ac630856351382c4b5fcab/src/server/generate/prompts.ts#L1-L50)
- Graph node 的 `path` 會先對真實 file tree 校驗；失敗會把精確 feedback 送入有界重試。[graph validation](https://github.com/ahmedkhaleel2004/gitdiagram/blob/20eea559377fe3f110ac630856351382c4b5fcab/src/server/generate/graph.ts#L90-L175) 通過後，compiler 才生成指向 GitHub blob/tree 的 click link。[deterministic compiler](https://github.com/ahmedkhaleel2004/gitdiagram/blob/20eea559377fe3f110ac630856351382c4b5fcab/src/server/generate/graph.ts#L323-L409)
- 這使「Node → source evidence」值得進入候選，但 Archify 若沒有 revision、private repo 與 opt-in privacy 合同，不能只複製可點擊外觀。

### draw.io MCP：編輯迴路很順，但其編輯器/格式矩陣不是 Archify 的邊界

- 官方倉庫提供 inline MCP App、打開 draw.io 的 MCP Tool、原生 `.drawio` Skill + CLI、零安裝項目指令四條路徑；導出 SVG/PNG/PDF 時可以嵌入 XML，讓產物繼續在 draw.io 編輯。[README](https://github.com/jgraph/drawio-mcp/blob/c3fcfa5a7227e873e9ee51451b54c291d81b0099/README.md#L7-L71)
- MCP App 的價值是把預覽放到創作入口附近並保留 `Open in draw.io` 的後路。[MCP App README](https://github.com/jgraph/drawio-mcp/blob/c3fcfa5a7227e873e9ee51451b54c291d81b0099/mcp-app-server/README.md#L1-L43)
- PR #44 已為 Archify 提供更符合自身 IR 的 Source JSON 交接；再做 draw.io XML round-trip 會形成第二套真相和編輯器依賴。

### Markmap：小而可組合的 Viewer 值得學，mindmap/插件擴張不值得現在學

- Markmap 把 view package 與 transform package 分開以降低不需要瀏覽器側能力時的安裝體積；toolbar 只保留 zoom、fit、recursive toggle 和 dark mode 等少量動作。[markmap-view README](https://github.com/markmap/markmap/blob/99fc93e6efd4a1df01260232d818fb57955d71df/packages/markmap-view/README.md) · [toolbar source](https://github.com/markmap/markmap/blob/99fc93e6efd4a1df01260232d818fb57955d71df/packages/markmap-toolbar/src/toolbar.tsx#L55-L117)
- 它的 README 同時列出 VS Code、Vim/Neovim、Emacs 與 MCP 集成。[README](https://github.com/markmap/markmap/blob/99fc93e6efd4a1df01260232d818fb57955d71df/README.md#L1-L27) 對 Archify 的當前啟發是保持 preview 與生成 artifact 解耦，不是立刻做 mindmap 或插件矩陣。

## Archify 已有 / 缺口映射

| 競品中的有效模式 | Archify 當前狀態 | 真正缺口 |
|---|---|---|
| Offline artifact、pan/zoom/theme/export | 已有，並且 Viewer 交互遠多於競品 | 無需繼續疊普通 Viewer 控制項 |
| 多視覺語言 + 統一 gate | 已有 Classic / Signal Flow / Blueprint、Semantic Sigils、同拓撲回歸 | 不缺第四 preset；缺的是讓作者更快看到每次改動 |
| Candidate → validate → verified output | 已有 schema/layout/composition/artifact checks、perceptual gate、Atomic Delivery | 無需另造成功語義；preview 應復用它 |
| 交付後立即看見 | 已有 `deliver --open` | 只打開一次；源改變後仍要重複命令 |
| 繼續編輯 | PR #44 提供 opt-in Source JSON | 已解決 portable handoff；沒有必要造全編輯器 |
| 實時 edit/preview | 沒有 | **本輪最清晰缺口** |
| Node → verified repo evidence | 沒有 | 高價值，但需要獨立 provenance/privacy 合同 |
| 平臺/IDE 插件 | Skill + CLI + 靜態 HTML 已足夠分發 | 暫不擴平臺矩陣 |

## 候選切片

| 候選 | 用戶價值 | 穩定風險 | 必須限制的實現邊界 | 可驗證證據 | 決策 |
|---|---|---|---|---|---|
| **A. Last-Good Live Preview** | 改 JSON 後自動看到新圖；壞輸入時不丟上一張好圖；明顯縮短創作循環，也適合錄製一個強 README 演示 | 中：常駐進程、埠、文件替換、重渲抖動、退出清理 | 新建 `preview` 命令；僅 `127.0.0.1` + 隨機埠；內容摘要輪詢/有界 debounce；復用既有 gate；成功才換 artifact；零依賴、無持久化、無 artifact 注入 | 五類型初始預覽；有效→有效、有效→無效→修復；原子替換與快速 burst；舊 artifact SHA 保持；埠/進程/臨時目錄清理；真實瀏覽器無 console error | **現在做** |
| **B. Repo Evidence Passport** | 聚焦一個節點即可打開或複製對應源碼證據，讓代碼庫圖從「看起來對」升級到「可追證」 | 中高：路徑真實性、commit 漂移、私倉洩露、URL scheme、五 schema 遷移和交互衝突 | 必須 revision-pinned；repo-relative path 經真實 tree 校驗；默認關閉；只進 Passport，不把 node click 改成導航；private/offline fail closed | 臨時 repo 驗證存在/不存在路徑；commit 固定；惡意 URL/路徑拒絕；默認 HTML/exports 不洩漏 | **下一階段設計，不塞進 preview** |
| **C. 一個工程語義合同：deployment ownership** | 雲部署圖能明確 Region/VPC/ownership 與跨邊界機制，提升評審可信度 | 中低：規則過度擬合或讓弱模型更難通過 | 只做 architecture 的一個 opt-in profile；驗證現有欄位能證明的事實；不添 renderer/type/style | 正反 fixture；每條錯誤指向確切實體和修復欄位；legacy 圖不變；Proof Lab 單場景證明 | **穩定型後續** |
| **D. Machine Visual Evidence Bundle** | 將最終 PNG/關鍵 WebM 幀與 receipt 綁定，回歸更可審計 | 中高：Chrome/字體/OS 像素差異、包體與運行時間 | 可選 CI/maintainer gate，不進 zero-install core；只存可復現實證，不發明審美分數 | 固定環境尺寸/像素非空/布局 bounds/有限 perceptual threshold；靜態路徑無瀏覽器仍可交付 | **先不做用戶特性** |

## 推薦切片的嚴格合同

### 命令和狀態

1. `preview` 是獨立的交互命令，不給 `deliver` 增加 `--watch`，避免把一次性交付變成長生命周期進程。
2. 默認只監聽 IPv4 loopback `127.0.0.1`，讓作業系統分配空閒埠；不接受 `0.0.0.0`、LAN host、上傳或公網 URL。
3. `--no-open` 只用於無 GUI、自動化測試或用戶已自行打開 URL；否則復用 Verified Open 的安全參數數組和失敗回退。
4. Preview shell 與被預覽 artifact 分離。artifact 仍是普通自包含 Archify HTML；preview runtime、reload token、錯誤 banner、source path 和埠都不能寫進 canonical HTML/SVG/圖片/WebM。
5. 首次輸入合法時，只有 renderer + composition + checker 全部通過後才發布 revision 1。首次輸入非法時仍打開 status shell，但不偽造空圖或成功 receipt。
6. 後續修改以**文件內容摘要**去重，不只信 mtime，也不依賴單次 `fs.watch` 事件；使用約 300–500ms 的有界穩定窗口吸收編輯器的 truncate/write/rename burst。
7. 每一代只允許一個候選。新一代到達時讓舊的未發布候選失效；遲到的舊結果永遠不能覆蓋更新結果。
8. 候選在臨時目錄完成現有 render/check，成功後原子替換 preview 的 last-good artifact，再遞增 revision。失敗只更新診斷，不替換 iframe，不覆蓋用戶指定輸出。
9. 錯誤面必須報告 generation、stage 與當前 validator/checker 原文摘要，並明確 `Showing last verified revision N`；修復後自動清除。不要只顯示紅點或「render failed」。
10. 頁面刷新只發生於 verified revision 變化；相同 bytes、chmod、無關目錄變化和失敗重試不得讓瀏覽器閃爍。
11. `SIGINT` / `SIGTERM`、瀏覽器未打開、埠錯誤和輸入刪除都要有明確退出/等待語義；退出後 server、timer、child process 與臨時目錄必須歸零。
12. Preview 默認保持 Source Capsule 關閉；源碼本來就在本機。不要把 PR #44 的 portable handoff 與本地創作循環混成一個默認隱私面。

### 建議最小 UI

- 畫布佔主位，直接 iframe/呈現最後一份 verified HTML。
- 右上角只保留一個小狀態：`Verified · rev 3`、`Checking…` 或 `Needs fix · showing rev 3`。
- 失敗展開一個可複製診斷區；不彈 modal，不遮住整張上一份好圖。
- 不做原始碼編輯器、文件樹、terminal、drag/drop、history timeline 或多文件 workspace。
- 不開展移動端專項；桌面 1280×720 是主要驗收面。

## 驗收證據

### 自動化

1. 五種 diagram type 均能啟動 preview 並拿到 revision 1；artifact 通過現有 checker。
2. 一份合法輸入修改為另一份合法輸入：只有新候選完整通過後 revision 才增加，瀏覽器讀取的新 title/node 與輸入一致。
3. 合法 → JSON 半寫入 → schema 錯誤 → showcase composition 錯誤：每次都保持上一份 artifact 的精確 SHA-256，status 指向真實 stage。
4. 修復失敗輸入後自動恢復，錯誤清空且只增加一次 revision。
5. 10 次快速寫入、truncate/write、同名臨時文件 rename、mtime 相同但 bytes 不同，都只發布最終穩定內容；相同 bytes 不重複刷新。
6. 並發慢候選被更新候選取代時，遲到結果無法 commit。
7. Server 僅接受固定 GET/HEAD endpoints；拒絕 traversal、任意文件讀取、寫請求和外部 Host；響應不回顯絕對 source path。
8. `--no-open`、opener 失敗、隨機埠衝突、輸入刪除/恢復、SIGINT/SIGTERM 和異常退出均無懸掛進程或 temp residue。
9. 從不含 `node_modules`/tests 的 ZIP Skill 副本運行，零依賴合同保持。
10. 全量 `npm test`、WebM/Share Card/Route Share Card smoke、ZIP freshness、package smoke 與 `git diff --check` 全綠。

### 內置瀏覽器

1. 用一個真實 architecture 或 workflow fixture 啟動 preview，確認第一次出現的是 verified artifact，不是閃爍的空殼。
2. 改 title、一個 node label 與一條 route，觀察一次有界刷新；確認主題、Style、Finder、Focus、Route、Presentation 與 Export 仍可用。
3. 寫入非法 JSON 和會觸發 showcase gate 的合法 JSON，確認舊圖不消失、錯誤可讀且沒有 console error。
4. 修復後確認自動恢復，狀態回到 `Verified`，新圖與輸入吻合。
5. 驗證 preview shell、錯誤狀態和 reload revision 不進入 SVG/PNG/WebM/Share Card/Source JSON。
6. 關閉進程後 URL 立即不可用，臨時目錄清空；不做移動端專項。

## 明確拒絕或推遲

- **第四/第五 preset、12-style 追數、vendor icon catalogue**：Archify 已有三種同拓撲視覺語言和 sigils；新增目錄會成倍擴大主題、導出、動效與截圖矩陣，卻不縮短創作循環。
- **全量 UML / mindmap 類型擴張**：當前五種 typed renderer 的價值是清晰語義和強 gate；不要把競品「類型數量」當增長 KPI。
- **WYSIWYG、拖拽、draw.io XML round-trip、Open in editor**：會把 generator + viewer 變成第二個通用編輯器，並產生雙格式真相。PR #44 的 opt-in Source JSON 已是更小、更真實的可編輯交接。
- **Mermaid 式壓縮源碼 share URL / 託管保存**：需要 hosted decoder、URL/XSS/長度、隱私與持久化合同；Archify 的一個 HTML 文件已經是更強的離線分享邊界。
- **公網 repo ingestion / GitDiagram 克隆**：會引入 provider 成本、token、quota、緩存、私倉憑據和濫用面。Repo Evidence Passport 可在本地、revision-pinned 的小合同中另做。
- **Obsidian、VS Code、瀏覽器擴展、MCP 平臺矩陣**：Markmap/draw.io 已證明分發寬度有價值，但現在會把維護預算從核心首次成功路徑分散出去。
- **依賴原生 file watcher 或 WebSocket 作為唯一真相**：D2 源碼已經展示其複雜度。Archify 應用內容摘要輪詢 + debounce + generation token，server 只做本地預覽，不引入新 npm 依賴。
- **獨立移動端產品**：保持現有 contained fallback；preview 是桌面創作工具，不把手機布局加入驗收門。

## 為什麼現在做

此前不做 watch 是對的：當時沒有統一 commit point、last-known-good 語義和安全 opener。現在 `main@440e16d` 的 [Atomic Delivery、Verified Open 與當前 Viewer 合同](../ROADMAP.md) 已經建立。Live Preview 可以只做 orchestration：監聽輸入、調用既有可信管線、成功才刷新，壞候選永不汙染成品。PR #44 的 portable editing handoff 與本切片正交；無論它先合併、後合併或暫緩，preview 合同都不變。

這比新增另一個 Viewer 「亮點」更能讓用戶喜歡：第一次成功更快，弱模型或人工微調的每輪反饋更短，演示也更直觀；同時它不改變 JSON IR、五 renderer、布局、美術、導出或分享邊界。下一階段再評估 Repo Evidence Passport，前提是先寫清 revision、真實路徑、private repo 與 opt-in privacy 合同。
