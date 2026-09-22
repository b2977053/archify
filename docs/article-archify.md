# 讓 AI 畫架構圖不難。難的是決定不畫什麼。

> [!IMPORTANT]
> 這是基於 Archify v2.6 的歷史文章，用於保留當時的設計背景，不代表當前功能、命令或產品邊界。最新能力與安裝方式以 [README](../README.md) 為準；仍然有效的架構取捨以 [ROADMAP](../ROADMAP.md) 為準。

![Archify cover — 左邊自動布局死路，右邊手動布局活路](article-cover.jpg)

一條命令：

```
node renderers/architecture/render-architecture.mjs web-app.json web-app.html
```

跑完你會得到一個獨立的 HTML 文件。打開瀏覽器，深色/淺色一鍵切換。PNG、JPEG、WebP、SVG 四種導出，4x 原生光柵化，複製到剪貼板就能貼進 Notion 或 GitHub README。

看起來只是一張架構圖。但打開瀏覽器你會注意到，這圖不是均勻的方格陣列。

Auth Provider 飄在 AWS 區域的左上角外面——它不是 AWS 的資源。S3 放在 CloudFront 下方而非旁邊——這是層級關係，不是同級關係。security-group 的虛線邊界精確地畫在 30px padding 處。

這些不是樣式。是布局。

---

**Archify 是一個讓 Claude 用自然語言畫技術架構圖的 Skill**。支持五種圖表類型——Architecture（系統架構）、Workflow（工作流水線）、Sequence（調用時序）、Data Flow（數據管線）、Lifecycle（狀態機）。每種都有獨立的 JSON Schema、獨立的渲染器、獨立的布局規則檢查。項目從 Cocoon AI 的 v1 分支重寫而來，目前 v2.6，MIT 協議。

但這篇文章關心的不是功能列表。我關心的是一個設計決策——Archify 明確拒絕了自動布局引擎。而且這個拒絕不是"我們還沒做"，是"我們實驗驗證了，這條路不通"。

---

## 一個實驗：換 CSS 不換布局，能差多遠？

Archify 的 Roadmap 裡有一段不常出現在開源項目中的文字：

> **Auto-layout (dagre / elk-js) is a dead end for archify.**

為了驗證這個判斷，作者做了一個盲測實驗。

原始實驗用了五張真實 Mermaid 流程圖，每張渲染三個版本：

- **版本 A**：原生 Mermaid，dagre 布局，默認主題。
- **版本 B**：同樣 dagre 布局，但換上 archify 的深色配色、JetBrains Mono 字體、slate-900 背景。布局不動——只換皮。
- **版本 C**：archify 手動布局——Claude 分配語義類（`c-frontend`、`c-backend`、`c-security` 等），手動擺放坐標，archify CSS 是最後一步。

原始 15 張截圖打亂、去標籤，盲評 1-10 分。2026-09-01 因其中兩個來源倉庫沒有可核驗的再分發許可，當前倉庫已移除這兩組輸入和衍生物，僅保留 3 圖、9 張截圖；因此原始 5 圖實驗無法再從當前 HEAD 完整復現。

結論寫在 `experiments/v3-mermaid-validation/RESULT.md` 裡，只一行：

> **C looks good; A and B both don't look good. B is not meaningfully better than A.**

換 CSS 不換布局，審美差距**無法彌合**。B 不比 A 更好看。一張均勻網格塗上更好的顏色，仍然是一張均勻網格。

![三列盲測對比：A=原生Mermaid 4分 · B=Mermaid+archify CSS 4分 · C=archify手動布局 9分](article-experiment.jpg)

這就是為什麼 ROADMAP.md 裡用了"dead end"這種詞——不是因為 dagre 或 elk-js 不好，而是因為 Archify 的審美**不來自配色，來自空間敘事**。Auth Provider 為什麼放在外面？S3 為什麼比 CloudFront 低 30px？虛線邊界為什麼是 30/50 padding？這些都是 Claude 的判斷。去掉布局判斷，就去了產品骨頭。

相應的，Roadmap 裡 P1（Mermaid 解析器引入 dagre 自動布局）打了 **KILLED**。P3（end-to-end 解析管線）、P4（IR → Mermaid 輸出、C4 輸入）同樣。

另外一個要命的問題也在 Roadmap 裡寫清楚了：

> **"Prettier Mermaid renderer" is already taken.** lukilabs/beautiful-mermaid 有 15 套主題（Tokyo Night、Catppuccin、Nord、Dracula），8.1k stars。Mermaid 11.14 自己加了 Neo/Redux 主題、ELK 布局、Hand Drawn 風格。做"更好看的 Mermaid"是已經被佔領的賽道。

Archify 選的是一條更窄但更硬的路：**讓 Claude 做信息架構決策，而不只是往布局引擎的輸出上刷 CSS。**

---

## 不是"人類在環"，是"判斷在環"

![Archify 渲染管線：自然語言 → Claude 推斷空間關係 → JSON IR + Schema 驗證 → 類型化渲染器 + 布局規則檢查 → 獨立 HTML](article-pipeline.jpg)

這句話你可能在別的 AI 工具文章裡看過："人機協作"、"人類在迴路中"。太模糊了——誰在迴路裡？做了什麼事？

Archify 的迴路裡有一個具體的決策者：Claude。它做一件事——**從語義推斷空間關係**。

舉個例子。你要畫一個 Web 應用架構：

```
用戶說：AWS 上跑著 Next.js 前端、Go 後端和 PostgreSQL。
前端通過 CloudFront 分發，緩存打在 S3 上。
所有流量經過 WAF，auth 走獨立 Identity Provider。
```

dagre 會怎麼做：六個節點排成兩行三列。整齊、均勻、無聊。

Claude 的答案——當 Archify 讓它自己決定坐標時：S3 放在 CloudFront 下方而非旁邊，因為"緩存打在 S3 上"意味著**層級關係**而非**同級關係**。Identity Provider 故意浮在 AWS region 邊界外面，因為它不是 AWS 的資源。WAF 畫在整個入口處。PostgreSQL 和 Go backend 靠得更近，因為它們高頻交互。

這不是配色問題。這是**對"誰依賴誰"、"誰在外面"、"什麼應該靠在一起"的空間翻譯**。

![左：dagre 均勻網格 · 右：Claude 語義布局 —— auth 浮出邊界、S3 在 CDN 下方、backend 靠緊 database](article-layout-compare.jpg)

這個設計哲學在 Archify 的架構上有個精確的落點：**類型化渲染器不是自動布局引擎**。

Workflow、Sequence、Dataflow、Lifecycle 四種模式的渲染器有預定義的 lane/stage/row 網格。它們告訴你哪些坐標是合法的——但是 Claude 仍然決定把哪個節點放進哪個泳道、哪個階段、主路徑上放哪些步、連接線走哪條 route。渲染器給的是約束，不是解。

舉個具體的例子——layout-rules.test.mjs 裡的一條斷言：

```
節點重疊 → 報錯："/nodes/3 (label: 'Data Cache') overlaps /nodes/5 (label: 'CDN Edge')"
標籤越界 → 報錯並給出數值閾值
跨泳道重疊 → 報錯並命名兩邊的泳道名
```

這四種錯誤的返回格式不是隨意寫的。它們的格式專門服務於一件事——**讓 LLM 能自我修復**。每條錯誤消息包含 JSON path、違規的兩個對象名、超出的數值或合法範圍。Claude 讀到這種錯誤後，可以自己修正 JSON 並重新渲染，不需要人介入。

不是"人類在環"。是"判斷在環"。人類提供的是判斷——API 架構師理解"Identity Provider 不是 AWS 資源"——AI 負責執行判斷（選坐標、定距離、調間距）並接受約束檢查。

---

## 決心不做什麼，比做了什麼更難

翻 Archify 的 ROADMAP.md 和 CHANGELOG，最驚訝的不是它做了什麼，是它**公開拒絕了多少東西**。

| 被拒絕的功能 | 理由 |
|---|---|
| dagre / elk-js 自動布局 | 實驗證明 auto-layout + CSS 不比原生 Mermaid 更好 |
| Mermaid 解析器管線 | 同上的實驗結論 |
| `?exportScale=N` URL 參數 | 誘導用戶選低質量的縮放下採樣，而項目已經有 4x 原生光柵化 |
| gzip+base64 分享連結 | XSS 向量，URL 長度限制，大家已經接受了"發 HTML 文件" |
| 色盲安全調色板 | 維護負擔過重，CSS 變量系統使下遊 fork 在約 30 行內就能完成 |
| 縮放/平移 UI | 瀏覽器原生雙指縮放和 Cmd+滾輪已經可用 |
| 字體嵌入光柵導出 | 每文件增加約 150KB，收益有限 |
| PDF 導出按鈕 | Cmd+P 自帶列印樣式表（`@page landscape`） |
| 多語言 UI | 保持界面極簡，國際化交給下遊 |

這些決策每一項都帶著成本意識。gzip+base64 分享聽起來方便——但一旦做了，就要一直維護 XSS 防護，還要處理 URL 長度在各個平臺上的表現差異。"發 HTML 文件"在今天已經很自然了——Slack 傳文件、GitHub 上傳、郵件附件——再疊一層 base64 包裝，增加的複雜度買回來的便利微乎其微。

另一類決策更有意思——"我們已經有了更好的替代方案"。4x 原生光柵化比 `?exportScale=N` 質量好得多；瀏覽器 Cmd+P 比內置 PDF 按鈕穩定得多；CSS 變量系統比硬編碼調色板靈活得多。**做了新東西，就可以不維護舊方案。**

Archify 在這件事上極其誠實。沒有任何一項被拒絕的功能掛著"未來考慮"的標籤。砍了就砍了，理由寫清楚，不留後路。

這種誠實在中國開源項目裡少見。大部分項目 Roadmap 裡堆滿了"計劃中"、"考慮中"，Archify 的 Roadmap 卻有一整節的 **KILLED**。

![九塊"墓碑"——被明確拒絕的 9 個功能，每塊寫明理由](article-killed.jpg)

---

## 什麼情況下它會失效

Archify 的布局哲學有一個硬前提：**負責做布局判斷的那個人（或 AI）真的理解架構語義**。

當圖太大時，這個前提會崩。一個 30 節點的微服務拓撲、橫跨 3 個 region 的部署圖——Claude 會在中間某個節點處丟失全局結構，開始隨機分配坐標。它不會再被語義驅使，只是機械地在 viewBox 裡填滿剩餘空間。這種時候，dagre 的均勻網格反而更好——至少它不出錯。

第二類失效場景是：用戶自己描述不清楚。"幫我畫個架構圖"——然後就沒了。Archify 的 SKILL.md 在開頭就告訴你，Claude 需要問清楚：組件類型、拓撲關係、安全邊界、主要數據流。如果用戶說不清楚，問出來的圖也不會有信息架構。

第三類失效更微妙：當圖的審美**不需要空間敘事**時，Archify 的所有設計都變成了過度設計。一個 4 步驟的審批流畫在泳道裡很清爽，但為了它走 JSON IR → schema 驗證 → renderer 的全套流程，不如直接在 Excalidraw 裡拖四個方塊。

Archify 不適用於"所有圖"。它適用於**那些組件之間的空間關係本身就攜帶信息的圖**。

---

## 那麼，Archify 真正值得學習的是什麼？

不是配色系統。不是 4x 導出。甚至不是五種圖表類型——類型會繼續增加。

值得看的是三件事。

**第一，一個 AI 工具的設計哲學可以小到"一個實驗結果"。**

Archify 拒絕 auto-layout 不是哲學討論——是先跑了一個 5 張圖的盲測，結果 B 不比 A 好，然後 ROADMAP 裡所有跟 dagre 相關的任務集體被殺。設計決策不是從觀點出發的，是從一堆截圖和評分的表格出發的。這比任何關於"AI 工具該怎麼設計"的方法論都可信。

**第二，"知道自己不是什麼"比"知道自己是什麼"更值錢。**

"Prettier Mermaid renderer is already taken" —— 這句話省了至少三個月的工作。Archify 不跟 beautiful-mermaid 比配色、不跟 Mermaid 11.14 比 Hand Drawn 風格。它選了一個更窄的賽道：信息架構。你畫的是架構圖，配色只是最後一步，布局才是主角——而布局是 Claude 的理解，不是 dagre 的均勻網格。

**第三，對 AI 來說，"約束"和"自由"不是對立的。**

Archify 的渲染器給你一個 lane/stage 網格（約束），但讓你決定每個節點進哪個泳道、每個連接走哪條路由（自由）。Schema 驗證會卡你格式（約束），但錯誤消息格式被專門設計成 Claude 能自動修復（自由）。如果你想讓 Claude 穩定在一條特定的布局路徑上，給它一個比"隨便畫"更窄的系統。

---

Archify 的 JSON IR 從第一天就強制聲明 `schema_version`。最初五種圖都固定為 `schema_version: 1`；現在 Workflow 是明確的例外：v1 繼續合法並保持舊版固定布局，v2 則顯式選擇新的可讀性編譯器。其他四種圖仍固定為 v1。打破性變更觸發版本號升級，舊版本永遠合法。

這一行比它前面 200 行的 SKILL.md 都更能說明問題。

因為這個欄位承認了一件事：今天最好的布局判斷，明天可能就不是最好的了。版本號是給未來留的退路——**在不知道明天會更好的情況下，先保證今天不會更差。**
