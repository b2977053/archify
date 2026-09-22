# Archify 下一輪「穩定優先、用戶可見、利於增長」切片研究

> 研究日期：2026-07-23
> 本地基線：`codex/reach-share-card` @ `13d58c406dc4d1449c9761deae039ba78ec403fc`
> 資料邊界：Archify 當前代碼與公開 issues，以及 Fireworks Tech Graph、GitNexus、GitDiagram、Cursor 和 `skills` CLI 的第一方 README、文檔或倉庫頁面。

## 結論先行

下一輪唯一推薦：**Structured Repair Receipt（結構化修復回執）**。

它不是再加一種圖、再加一個動畫或再加一個 Viewer 面板，而是讓 `validate --json` 和 `deliver --json` 在失敗時也輸出穩定、可解析、帶精確證據與受支持修復旋鈕的 JSON。Agent 不必從 Node 堆棧和多行英文錯誤中猜「應該改哪個對象、哪條線、哪個欄位」，因此弱模型和不同客戶端也更容易在最多兩輪內完成準確修復。

這是當前最符合三項約束的交集：

- **穩定優先**：不降低任何現有質量門檻，不自動改圖，只把現有確定性證據變成可靠協議。
- **用戶可見**：用戶會直接感受到首張圖更容易成功、失敗解釋更清楚、來回調整更少。
- **利於增長**：它改善不同模型/Agent 客戶端上的一致性，比繼續堆視覺功能更能降低「裝了但第一次沒畫好」的流失。

## 1. 先排除已經完成的能力

本研究按當前本地分支而不是舊版 `main` 判斷。以下能力已經存在，不應包裝成「下一步新功能」：

- Atomic Verified Delivery：同目錄候選文件、完整檢查、單次原子替換，失敗保留舊成品。
- `deliver --open`：只在驗證並提交成功後打開最終 HTML。
- Last-Good Live Preview：候選失敗時保留上一份通過驗證的成品。
- canonical Share Card、Route Share Card、Reach Share Card。
- Authored Reachability、Semantic Passport、revision-pinned Verified Source Passport。
- 11 個有界場景配方、Start 頁面、Proof Lab、五種 typed diagram mode。
- 最多兩輪的 Perceptual Delivery Gate，以及 `validation / visual_review / correction_rounds` 的誠實交付說明。

第一方依據：當前 [README](../README.md)、[ROADMAP](../ROADMAP.md)、[SKILL](../archify/SKILL.md)，以及已推送的 [`13d58c4` 基線提交](https://github.com/tt-a1i/archify/commit/13d58c406dc4d1449c9761deae039ba78ec403fc)。

因此，Fireworks 的「有界視覺覆核」、GitDiagram 的「倉庫到圖」、GitNexus 的「路徑/影響分析」等概念不能不經核對就再次列為 Archify 缺失項。

## 2. 當前公開反饋揭示的真實痛點

### 2.1 弱模型/不同 Agent 的首輪構圖質量仍不穩定

公開 [issue #6](https://github.com/tt-a1i/archify/issues/6) 使用 opencode + DeepSeek 生成架構圖和 workflow，反饋箭頭混亂且觀感差。Archify 已合入 `composition/ambiguous-corridor` 這一具體確定性門檻，但維護者在 [進展回復](https://github.com/tt-a1i/archify/issues/6#issuecomment-5041845293) 中明確保留該 issue，因為「弱模型構圖」大於單一 corridor 規則。

這說明下一步不該簡單繼續增加視覺樣式；更重要的是讓不同能力的 Agent 都能理解失敗證據並做小範圍、可驗證的修復。

### 2.2 多輪調整的成本對用戶真實可感

[issue #22](https://github.com/tt-a1i/archify/issues/22) 報告了長時間、多輪細節調整帶來的高 token 消耗。維護者最終確認沒有證據表明 Archify renderer 自身異常耗 token，主要成本來自客戶端、模型、倉庫探索和多輪修訂，因此該 issue 已關閉。

正確結論不是「Archify 要承諾節省所有 token」，而是：**Archify 能控制的部分，應讓每次確定性失敗都給 Agent 一份最短、最精確、無需猜測的修復協議**。這樣可以減少無效整圖重寫和重複解釋，但不能虛假承諾控制模型或倉庫探索成本。

### 2.3 已修復問題不應重複立項

- [issue #14](https://github.com/tt-a1i/archify/issues/14) 的 CJK/全形寬度邊界已由 #31 修復並加入回歸覆蓋。
- [issue #24](https://github.com/tt-a1i/archify/issues/24) 的「連線穿過無關節點、造成拓撲誤讀」已進入共享 Clean Flow 硬門檻與回歸覆蓋。

這些案例證明「可復現問題 → 確定性門檻 → 回歸測試」的路線有效。下一切片應增強這套路線上失敗信息的可消費性，而不是回到泛化的「自動美化」。

### 2.4 Cursor 是明確的增長入口，但不是本輪最高優先級

2026-07-23 新開的 [issue #46](https://github.com/tt-a1i/archify/issues/46) 表示社區成員已經為 Cursor 製作 Archify skill 並希望共同推進。Cursor 官方在 [2.4 changelog](https://cursor.com/changelog/2-4) 中確認 IDE 與 CLI 都支持 `SKILL.md` Agent Skills；`skills` CLI 的官方 [Supported Agents](https://github.com/vercel-labs/skills#supported-agents) 也已經列出 `cursor`，全局路徑為 `~/.cursor/skills/`。

所以 Cursor 值得做，但如果不先改善失敗回執，只擴大發行面也可能把同一首輪質量波動帶給更多用戶。

## 3. 同類項目值得吸收的，不是表面功能數量

### 3.1 Fireworks Tech Graph：把「首稿」當候選，並限制修復輪數

Fireworks 的官方 [Loop Engineering](https://github.com/yizhiyanhua-ai/fireworks-tech-graph#loop-engineering) 明確採用：確定性檢查 → PNG 視覺回讀 → 針對性修復 → 有界收斂；默認最多兩輪，無法讀取圖片時誠實報告 `visual_review: skipped`。其 [README](https://github.com/yizhiyanhua-ai/fireworks-tech-graph) 還用 12 套動圖樣例在首屏形成強視覺證明。

Archify 已經吸收了正確的「最多兩輪 + 不虛報視覺覆核」原則，因此不應再次把它當新功能。仍可繼續借鑑的是：**讓每輪修復輸入更結構化、最終狀態更可審計**。

### 3.2 GitDiagram：嚴格 AST、真實路徑校驗、聚焦反饋重試

GitDiagram 官方 [How generation works](https://github.com/ahmedkhaleel2004/gitdiagram#how-generation-works) 描述了嚴格、有限大小的 graph AST；服務端校驗 identifier、連通性、大小和每條倉庫路徑，並在模型輸出無效時用 focused feedback 重試。成功成品會持久化，重新打開無需再次調用模型。它的另一個增長優勢是極短入口：把 GitHub URL 裡的 `hub` 換成 `diagram` 即可開始。

Archify 不應複製其託管服務、R2、Redis 或 Mermaid 產品形態；值得吸收的是：**驗證失敗要成為聚焦、有限、機器可消費的反饋，而不是一段供 Agent 猜測的日誌**。

### 3.3 GitNexus：把結構工作前移，讓小模型少猜、少查詢

GitNexus 官方 [Why a Knowledge Graph](https://github.com/abhigyanpatwari/GitNexus#why-a-knowledge-graph) 把核心價值描述為預計算結構，使 Agent 用一次工具調用獲得完整上下文，並明確強調 token efficiency 與 smaller-model reliability。它的 [Quick Start](https://github.com/abhigyanpatwari/GitNexus#quick-start) 只有 `analyze` 和 `setup` 兩步；[Editor Setup](https://github.com/abhigyanpatwari/GitNexus#editor-setup) 則把 Cursor、Claude Code、Codex、OpenCode 等多客戶端支持放在主路徑。

Archify 不需要引入知識圖資料庫。可吸收的原則是：**把確定性知識放進工具回執，不要把解析錯誤、歸類失敗和選擇修復手段繼續外包給模型**。

## 4. 當前協議層的具體缺口

在本地基線 `13d58c4` 上核對 [CLI 實現](https://github.com/tt-a1i/archify/blob/13d58c406dc4d1449c9761deae039ba78ec403fc/archify/bin/archify.mjs)：

1. `validate --json` 只在成功後列印 JSON。輸入讀取、schema、layout 或 render 失敗時，會把 renderer stderr 原樣轉發；一次不存在文件的實測得到 **stdout 0 bytes、stderr 782 bytes 的 Node 堆棧**，退出碼為 1。
2. `deliver --json` 已經在失敗時維持一個 JSON envelope（這是正確基礎），但 `error` 仍是自由文本；沒有穩定的 `diagnostics[]` 來表示規則代碼、對象身份、測量證據和受支持修復欄位。
3. renderer 已經產生大量穩定規則標識與精確提示，例如 `clean-flow/edge-through-node`、`composition/proper-crossing`、`composition/ambiguous-corridor`、`composition/label-route-clearance`、`composition/micro-segment`。也就是說，Archify 並不缺檢測能力，缺的是從內部事實到外部 Agent 的**結構化錯誤協議**。
4. 當前 [SKILL 的 Perceptual Delivery Gate](https://github.com/tt-a1i/archify/blob/13d58c406dc4d1449c9761deae039ba78ec403fc/archify/SKILL.md#perceptual-delivery-gate) 已要求最多兩輪針對性修復，但如果確定性失敗只給自由文本，弱模型仍可能整圖重寫、選錯修復旋鈕或重複試錯。

這是真實、可復現、範圍有限的缺口，也能同時解釋 #6 的跨模型波動和 #22 中用戶對多輪調整的敏感。

## 5. 三個候選切片

| 候選 | 用戶/增長收益 | 主要風險 | 可測試性 |
|---|---|---|---|
| **A. Structured Repair Receipt** | 首次失敗更容易理解；Agent 能按對象與規則做局部修復；減少日誌猜測和無效整圖重寫；對所有客戶端和模型同時生效 | 若倉促用正則解析舊錯誤文本，協議會脆弱；若一次覆蓋所有錯誤類型，範圍會失控；需維護 JSON 向後兼容 | 很高：五種 mode 的 success/failure fixtures、stdout/stderr 契約、exact diagnostic schema、舊成品字節不變、安裝 ZIP smoke 都可確定性測試 |
| **B. First-class Cursor Onboarding** | 直接回應 #46；擴大可安裝人群；在 README/Start/landing 給出一條 Cursor 命令，縮短增長入口 | 文檔寫「支持」不等於不同 Cursor 模型都能穩定產出；若做 Cursor 專屬 skill 會造成分叉和維護漂移 | 高：臨時目錄安裝到 Cursor 路徑、`doctor`、五 mode 包裝 smoke、文檔生成一致性；真實模型效果只能另做非阻斷 benchmark |
| **C. First Diagram Reliability Scorecard** | 用公開樣例顯示「哪些客戶端/模型能在幾輪內通過」，建立信任，也為後續門檻提供數據 | 模型、版本、倉庫和費用使結果易漂移；若沒有先改善協議，benchmark 只會暴露問題而不解決問題 | 中：IR 與 artifact gates 可確定性復跑；模型/Agent 端到端結果必須時間戳化並與 CI 阻斷分離 |

## 6. 唯一推薦：Structured Repair Receipt

### 6.1 建議的有界範圍

第一期只做「失敗協議」，不做自動修圖：

1. `archify validate ... --json` 在成功與失敗時都只向 stdout 輸出一個 JSON 對象；失敗時不得洩漏 Node 堆棧到 stdout。
2. `archify deliver ... --json` 保持現有 envelope，並添加與 `validate` 共用的 `diagnostics` 合約。
3. 先覆蓋最常見、最有穩定標識的類別：input、schema、repository evidence、通用 layout，以及現有 Clean Flow / composition 規則；未知內部異常可保留一個 `internal/unclassified` fallback，但必須明確不可自動修復。
4. 每條 diagnostic 只包含已知事實與支持的修復旋鈕，例如：

```json
{
  "code": "clean-flow/edge-through-node",
  "severity": "error",
  "subject": {
    "collection": "connections",
    "index": 3,
    "id": "api-to-queue"
  },
  "evidence": {
    "obstacleId": "cache",
    "segmentIndex": 2,
    "clearancePx": 2
  },
  "supportedFixes": [
    "fromSide/toSide",
    "via",
    "route/channel",
    "node placement"
  ]
}
```

5. SKILL 只消費這些 diagnostics 來做局部修復，繼續遵守最多兩輪；不得因為有 JSON 就擴大重試預算。
6. 非 `--json` 模式繼續提供簡短人類可讀錯誤，但應從同一 diagnostic 對象格式化，避免兩套事實漂移。

### 6.2 實現時最重要的約束

- 不要對現有多行錯誤做長期正則解析；應在規則產生處保留結構化事實，再由邊界層格式化文本/JSON。
- `supportedFixes` 只能列出該 mode 真正支持的欄位或動作，不給模型「看起來合理但 schema 不接受」的建議。
- 成功 receipt 儘量保持兼容；若新增欄位，保持 additive，並用 schema/version 測試鎖定。
- `deliver` 的失敗仍必須刪除候選並保持舊成品逐字節不變。
- deterministic receipt 仍不代表 visual review；兩者必須繼續分開。

### 6.3 驗收門檻

- 五種 diagram mode 各至少一個成功和一個失敗 fixture。
- `validate --json` 的 input/schema/layout/check failure 均為有效 JSON，退出碼非零，stdout 只有一個對象，無 Node stack。
- `deliver --json` 與 `validate --json` 對同一失敗給出相同規則代碼和對象身份。
- 每條已知 diagnostic 都有規則代碼、severity、subject、evidence、supported fixes；未知錯誤明確標記，不偽造修復建議。
- 非 JSON 人類輸出繼續包含具體對象、閾值和修復提示。
- 失敗 delivery 保持舊成品 SHA-256/bytes 不變，候選目錄清理乾淨。
- `archify.zip` 零依賴安裝 smoke 通過；現有 `npm test`、WebM/瀏覽器 smoke 全綠。
- 用內置瀏覽器完成一次「失敗回執 → 一處局部修復 → verified artifact」的真實閉環；最終視覺覆核仍單獨記錄。

## 7. 明確非目標

本切片不做：

- 自動移動節點、自動改 route、自動重寫整份 JSON。
- 在 CLI 內調用 LLM、自動無限重試或承諾節省模型探索 token。
- 新 diagram type、新 visual preset、新 GIF/WebM 動效或新 Viewer 面板。
- D2/Mermaid engine 替換；當前問題是診斷協議，不是缺少另一個布局引擎。
- hosted upload、repository ingestion、帳號系統、遙測或雲端持久化。
- 移動端專項設計。
- blast radius、runtime causality 或 repository impact 推斷。
- 把 deterministic validation 冒充 perceptual visual review。
- 同一切片順帶做 Cursor 專屬 fork；Cursor onboarding 可作為緊隨其後的增長切片，共享同一 `SKILL.md`。

## 8. 推薦順序

1. 先完成 Structured Repair Receipt，並用當前 #6 類構圖失敗做一條真實閉環。
2. 再做 First-class Cursor Onboarding，藉助統一失敗協議擴大安裝面，而不是擴大不確定性。
3. 最後建立帶日期、客戶端/模型版本、correction rounds 和視覺覆核狀態的 Reliability Scorecard；把它當產品證據，不把隨機模型結果直接設為 CI 硬門檻。

這個順序吸收了同類項目最值得學習的共同點：Fireworks 的有界收斂、GitDiagram 的 focused feedback、GitNexus 的結構前移與多客戶端入口；同時保留 Archify 自己最強的差異化——離線、自包含、可驗證、讀圖交互豐富，而且不虛構證據。

## 第一方來源

- Archify 當前倉庫與 issues：[repository](https://github.com/tt-a1i/archify)、[#6](https://github.com/tt-a1i/archify/issues/6)、[#14](https://github.com/tt-a1i/archify/issues/14)、[#22](https://github.com/tt-a1i/archify/issues/22)、[#24](https://github.com/tt-a1i/archify/issues/24)、[#46](https://github.com/tt-a1i/archify/issues/46)
- Fireworks Tech Graph：[README](https://github.com/yizhiyanhua-ai/fireworks-tech-graph)、[Loop Engineering](https://github.com/yizhiyanhua-ai/fireworks-tech-graph#loop-engineering)
- GitNexus：[README](https://github.com/abhigyanpatwari/GitNexus)、[Quick Start](https://github.com/abhigyanpatwari/GitNexus#quick-start)、[Why a Knowledge Graph](https://github.com/abhigyanpatwari/GitNexus#why-a-knowledge-graph)、[Editor Setup](https://github.com/abhigyanpatwari/GitNexus#editor-setup)
- GitDiagram：[README](https://github.com/ahmedkhaleel2004/gitdiagram)、[How generation works](https://github.com/ahmedkhaleel2004/gitdiagram#how-generation-works)
- Cursor：[Cursor 2.4 Skills announcement](https://cursor.com/changelog/2-4)
- Vercel `skills` CLI：[README](https://github.com/vercel-labs/skills)、[Supported Agents](https://github.com/vercel-labs/skills#supported-agents)
