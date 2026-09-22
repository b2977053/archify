# Archify：可信首次交付的最小實現切片

> 調研日期：2026-07-22（Asia/Shanghai）
>
> 口徑：只對一手資料與當前源碼作結論；`事實`、`推斷`、`建議`分開書寫。
>
> 目標邊界：同時改善首次交付的語義正確性、視覺質量和可驗證性；不增加圖類型、視覺預設、移動端產品面或託管平臺。

## 結論

**建議只做一個縱向切片：`Trustworthy First Delivery v1`。**

它包含同一條交付鏈上的兩個不可拆開的門：

1. **無條件語義安全門**：任何 renderer-owned relationship 穿過無關的、不透明語義節點時，都必須 hard fail；不能再因為輸入沒有 `meta.quality_profile` 或 CLI `--quality` 而靜默放行。更嚴格的 X 交叉、短段、節奏等審美預算仍保持 profile-aware。
2. **有上限的最終像素覆核**：確定性 `render -> validate --json -> check` 全部通過後，若運行時能讀圖，則檢查最終瀏覽器成品與 canonical raster；最多做兩輪只針對已診斷問題的修正，每輪之後重跑全部確定性門。交付時明確報告：

   ```text
   validation: passed
   visual_review: passed
   correction_rounds: 0
   ```

   沒有圖像讀取能力時必須報告 `visual_review: skipped (image reader unavailable)`，不能猜測為 passed。

這仍是一個切片，而不是兩個功能：**第一張 renderer 草稿只是 candidate；第一張交給用戶的圖必須同時有語義安全、機器檢查和真實像素覆核的證據。** 它不需要新 schema、圖類型、preset、布局引擎、移動端狀態、服務端或運行時依賴。

## 為什麼是這一刀

| 目標 | 當前證據 | 這一個切片的直接作用 |
|---|---|---|
| 首次出圖正確性 | #24 證明 `api -> queue` 可因路徑藏在 `cache` 後而讀成 `cache -> queue`，且無 profile 的 `render` / `validate` / `check` 全部成功；維護者明確把它定性為 correctness issue，傾向 hard error | 無 profile 也執行 Clean Flow；錯誤不能再進入交付物 |
| 視覺質量 | #6 的核心反饋是箭頭混亂、不美觀；維護者也承認能力較弱的模型在複雜倉庫上不應明顯掉隊 | 機器門先擋住可判定的錯誤，最終像素覆核補足 clipping、層級、留白、標籤和暗/亮主題等機器尚未覆蓋的問題 |
| 降低返工與 token | #22 的報告明確說成本來自「溝通調整很多版」；維護者判斷不是 renderer 自身異常，而是代碼探索、模型/客戶端和迭代次數 | 只允許最多兩輪、只改已診斷位置；不把審美修正變成無上限自編輯循環 |
| 可驗證交付 | 當前 `validate --json` 已把臨時 render 與 artifact check 合併，返回 `checks` 和 `composition`；但視覺覆核沒有真實狀態 | 復用現有 JSON receipt，再補 `visual_review` 與真實 correction count，不引入新平臺 |

上述 issue 證據分別見 [#6](https://github.com/tt-a1i/archify/issues/6)、[#22](https://github.com/tt-a1i/archify/issues/22)、[#24](https://github.com/tt-a1i/archify/issues/24)；#24 的維護者定性與 hard-error 選擇見[該回復](https://github.com/tt-a1i/archify/issues/24#issuecomment-5029635230)。

## Archify 當前事實基線

### main 與已有能力

- **事實**：調研時遠端 `main` 是 [`6d5204d`](https://github.com/tt-a1i/archify/commit/6d5204d23dfa2cbf3dfff423beeb32250a3dc727)，最新 release / package 版本仍為 `v2.11.0`。
- **事實**：main 已有共享 `cleanFlowProblems()`，會報告關係集合索引、可選關係 ID、障礙 ID、首個相交 segment、2px clearance 與修復旋鈕；但函數在既無環境 profile、又無 IR profile 時立即返回空數組。因此這是**已實現但默認可繞過**的 correctness guard。見 [`geometry.mjs`](https://github.com/tt-a1i/archify/blob/6d5204d23dfa2cbf3dfff423beeb32250a3dc727/archify/renderers/shared/geometry.mjs#L44-L91)。
- **事實**：architecture renderer 已把 components 作為障礙集合傳入 Clean Flow，並有完整 `fromSide` / `toSide` / `route` / `via` 修復提示。見 [`render-architecture.mjs`](https://github.com/tt-a1i/archify/blob/6d5204d23dfa2cbf3dfff423beeb32250a3dc727/archify/renderers/architecture/render-architecture.mjs#L189-L238)。
- **事實**：architecture `auto` 當前固定選擇一個中點 X 的 H-V-H dogleg；它沒有比較另一種 dogleg，也沒有避障搜索。見 [`render-architecture.mjs`](https://github.com/tt-a1i/archify/blob/6d5204d23dfa2cbf3dfff423beeb32250a3dc727/archify/renderers/architecture/render-architecture.mjs#L294-L329)。
- **事實**：`validate` 會在臨時目錄 render，再運行 final HTML checker；成功的 `--json` 返回 `ok`、`checks` 和 `composition`。見 [`bin/archify.mjs`](https://github.com/tt-a1i/archify/blob/6d5204d23dfa2cbf3dfff423beeb32250a3dc727/archify/bin/archify.mjs#L267-L333)。
- **事實**：當前 SKILL 要求 read-schema -> author IR -> render -> validate -> targeted fix，也明確說明 composition gate 在無 profile 時保持 opt-in；現有 self-review checklist 主要檢查 DOM/幾何約束，並沒有最終像素 readback 狀態。見 [`SKILL.md`](https://github.com/tt-a1i/archify/blob/6d5204d23dfa2cbf3dfff423beeb32250a3dc727/archify/SKILL.md#L73-L81) 與 [`SKILL.md`](https://github.com/tt-a1i/archify/blob/6d5204d23dfa2cbf3dfff423beeb32250a3dc727/archify/SKILL.md#L326-L343)。
- **推斷**：因為隱藏在無關節點後會改變讀者看到的拓撲，這一條不是「審美偏好」。把它留在 opt-in profile 後面，和其他 profile-less 兼容策略混為一談了。

### issues 與 PR 的當前狀態

#### #6：箭頭混亂

- **事實**：[#6](https://github.com/tt-a1i/archify/issues/6) 仍 open，報告來自真實倉庫與真實 agent 生成圖；維護者回復稱強模型能生成效果好的圖，但也明確說複雜倉庫中不應讓能力較弱的模型表現不足。
- **推斷**：繼續只增強 prompt 或展示強模型樣例，不能給低能力模型提供確定性下限。機械安全門與最終像素門更接近問題本體。

#### #14 與 PR #28：CJK 寬度

- **事實**：[#14](https://github.com/tt-a1i/archify/issues/14) 的措辭是 「may be inaccurate」 / 「likely contributed」；報告者也承認部分 overlap 可能來自坐標放置。它是值得修的 P2，但當前證據沒有證明它是 #6 / #22 / #24 的共同根因。
- **事實**：main 的 `FULLWIDTH_RE` 用一個寬區間覆蓋 U+2E80–U+A4CF，並已有 ASCII、Han、混排、補充平面漢字和 emoji 測試。見 [`utils.mjs`](https://github.com/tt-a1i/archify/blob/6d5204d23dfa2cbf3dfff423beeb32250a3dc727/archify/renderers/shared/utils.mjs#L145-L153) 與 [`geometry.test.mjs`](https://github.com/tt-a1i/archify/blob/6d5204d23dfa2cbf3dfff423beeb32250a3dc727/archify/test/geometry.test.mjs#L400-L408)。
- **事實**：open 的 [PR #28](https://github.com/tt-a1i/archify/pull/28) 把該寬區間拆成顯式 Unicode ranges，並新增 Han、CJK punctuation、fullwidth、Hangul 與混排單測；head `22eb5c8` 當時沒有任何 GitHub check run。
- **事實**：PR #28 的新 ranges 不等價於 main：它漏掉 main 會按雙寬處理的 Hiragana `あ` (U+3042)、Katakana `ア` (U+30A2)、Hangul Compatibility Jamo `ㄱ` (U+3131) 和 Katakana Phonetic Extension `ㇰ` (U+31F0)。因此 「all CJK blocks」 的 PR 描述並不成立。改動見 [`utils.mjs@22eb5c8`](https://github.com/tt-a1i/archify/blob/22eb5c84e917c677c17e1d3c22bee63a811225ce/archify/renderers/shared/utils.mjs#L145-L155)，新增測試見 [`geometry.test.mjs@22eb5c8`](https://github.com/tt-a1i/archify/blob/22eb5c84e917c677c17e1d3c22bee63a811225ce/archify/test/geometry.test.mjs#L400-L418)。
- **建議**：PR #28 不要原樣併入本切片。先補 Kana、Bopomofo / compatibility Jamo 等回歸矩陣，並用真實瀏覽器字體棧的 measured-vs-estimated fixture 證明問題；它應作為獨立、可回滾的小修復。

#### #22：多輪打磨消耗 token

- **事實**：[#22](https://github.com/tt-a1i/archify/issues/22) 已按「未發現 Archify renderer / validator 異常 token 消耗」關閉；用戶明確說消耗發生在多輪溝通與細節打磨，維護者把主要成本定位到代碼探索、模型/客戶端與迭代次數。
- **推斷**：Archify 不應該承諾控制模型探索成本，但可以控制自身交付循環不無限擴張：確定性檢查優先、針對性修正、兩輪上限、無法看圖則如實 skipped。

#### #24 與 PR #30：靜默錯誤拓撲

- **事實**：[#24](https://github.com/tt-a1i/archify/issues/24) 給出 3 個組件、1 條 connection 的最小復現；`api -> queue` 的 auto route 穿過 `cache`，由於箭頭先畫、opaque component 後畫，成品視覺上像 `cache -> queue`。報告中的無 profile `render`、`validate`、`check` 全部成功。
- **事實**：維護者明確回復「correctness issue rather than cosmetic one」，並選擇 hard render / validate error，而不是 warning。見[維護者回復](https://github.com/tt-a1i/archify/issues/24#issuecomment-5029635230)。
- **事實**：open 的 [PR #30](https://github.com/tt-a1i/archify/pull/30) 是 test-only；reject case 主動加了 `quality_profile: standard`，PR 描述還明確記錄：省略 profile 時同一文檔當前仍能成功 render。它證明 main 上的 gate 能識別路徑，但默認交付仍可繞過。
- **建議**：本切片應吸收 #24 的 exact auto-route repro 與安全 `via` workaround，但測試必須省略 profile，鎖定「默認也 hard fail」的新語義。

## 三個官方倉庫的一手機制對照

對照快照：

- [`yizhiyanhua-ai/fireworks-tech-graph@50c819d`](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/tree/50c819d68fd4fee330b3010988cd13e98b678d44)
- [`Agents365-ai/drawio-skill@6f33563`](https://github.com/Agents365-ai/drawio-skill/tree/6f33563adce24450003d1cb61111ebbcc5579f28)
- [`ahmedkhaleel2004/gitdiagram@20eea55`](https://github.com/ahmedkhaleel2004/gitdiagram/tree/20eea559377fe3f110ac630856351382c4b5fcab)

### fireworks-tech-graph

**事實**

- 它把 geometry / composition 約束做成所有 style 共用的 executable contract，而不是靠 style 文檔宣稱；showcase 明確約束零 crossing / bridge、每邊最多兩 bend、stretch <= 1.35、segment >= 16px、node gap >= 40px、container gutter >= 20px、label clearance >= 4px。見 [`composition-quality-contract.md`](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/blob/50c819d68fd4fee330b3010988cd13e98b678d44/references/composition-quality-contract.md#L7-L26)。
- 它明確規定：成功 render 但沒有通過 geometry + composition 兩個 gate 仍只是 draft。見[同一 contract 的 validation 段](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/blob/50c819d68fd4fee330b3010988cd13e98b678d44/references/composition-quality-contract.md#L75-L85)。
- 它把第一張 render 當 candidate：先確定性檢查，再讀回 PNG，最多兩輪針對性修正；無法讀圖時明確報告 skipped。見 [`README.md`](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/blob/50c819d68fd4fee330b3010988cd13e98b678d44/README.md#L157-L189) 與 [`SKILL.md`](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/blob/50c819d68fd4fee330b3010988cd13e98b678d44/SKILL.md#L77-L98)。
- 它用真實 validator tests 覆蓋 path-vs-rect、edge crossing、reserved region、clipping、label clearance 與 composition budgets，而不是只測 XML parse。見 [`test_validate_svg.py`](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/blob/50c819d68fd4fee330b3010988cd13e98b678d44/tests/test_validate_svg.py#L49-L104) 與 [`test_geometry_contracts.py`](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/blob/50c819d68fd4fee330b3010988cd13e98b678d44/tests/test_geometry_contracts.py#L160-L192)。

**可借鑑**

- 「第一張 render 是 candidate」以及 deterministic-first、perceptual-second 的順序。
- 最大兩輪 targeted correction 與 truthful `passed` / `skipped` receipt。
- 同 topology fixture 鎖定 geometry metrics，避免把 style 變化誤當結構進步。

**明確不借鑑**

- 不擴成 12 styles、14 UML types、vendor icon catalogue 或 GIF contract。
- 不引入 CairoSVG / Puppeteer 到 zero-install core。
- 不把所有質量壓成一個不透明分數；保留具體 violation、關係、segment 與坐標。

### Agents365-ai/drawio-skill

**事實**

- 它先用 `validate.py` 檢查 duplicate/reserved IDs、broken parents、dangling endpoints、invalid geometry、sibling overlap、waypointed edge-through-node 與 edge crossing；`--strict` 可把 warnings 升為失敗，`--score` 只用於比較同一 graph 的 layout variants。見 [`validate.py`](https://github.com/Agents365-ai/drawio-skill/blob/6f33563adce24450003d1cb61111ebbcc5579f28/skills/drawio-skill/scripts/validate.py#L212-L238) 與 [`validate.py`](https://github.com/Agents365-ai/drawio-skill/blob/6f33563adce24450003d1cb61111ebbcc5579f28/skills/drawio-skill/scripts/validate.py#L241-L336)。
- 它在確定性 lint 後導出 draft PNG，視覺自檢 edge-shape overlap、stacked edges、clipped labels、off-canvas、missing connections 與 label overlap；每次修復都重導出、重讀，最多兩輪。見 [`SKILL.md`](https://github.com/Agents365-ai/drawio-skill/blob/6f33563adce24450003d1cb61111ebbcc5579f28/skills/drawio-skill/SKILL.md#L125-L161)。
- 它對單元素問題做 targeted edit，保留此前 layout tuning；到用戶 review loop 才允許更長互動，並有五輪 safety valve。見 [`SKILL.md`](https://github.com/Agents365-ai/drawio-skill/blob/6f33563adce24450003d1cb61111ebbcc5579f28/skills/drawio-skill/SKILL.md#L163-L187)。

**可借鑑**

- 把視覺缺陷分成明確 taxonomy，而不是籠統說「看看好不好看」。
- 確定性 lint 必須早於、且優先於 vision。
- 每輪只修已診斷的坐標、尺寸、label、route、spacing 或 viewBox。

**明確不借鑑**

- 不切換到 `mxCell` XML，不依賴 draw.io desktop / Electron 或 Graphviz。
- 不照搬 5 輪用戶 feedback loop 到自動交付環；本切片上限仍是兩輪。
- 不照搬其 score 為跨圖質量指標；該倉庫自己也限定它只能比較同一 graph。

### GitDiagram

**事實**

- 它先從 repo tree + README 生成不超過 650 詞、帶 exact repo-relative paths 的 architecture brief，再讓第二階段只返回 bounded graph schema。見 [`prompts.ts`](https://github.com/ahmedkhaleel2004/gitdiagram/blob/20eea559377fe3f110ac630856351382c4b5fcab/src/server/generate/prompts.ts#L1-L50)。
- graph IR 上限為 10 groups / 34 nodes / 48 edges，graph planning 最多 3 次；schema 限制 ID、文本、shape、edge style 與 path。見 [`graph.ts`](https://github.com/ahmedkhaleel2004/gitdiagram/blob/20eea559377fe3f110ac630856351382c4b5fcab/src/features/diagram/graph.ts#L7-L90)。
- 每次 model graph 都會驗證 duplicate IDs、group membership、真實 repo path 與 edge endpoints；失敗時把 previous graph、file tree 與精確 validation feedback 送回下一次，最多三次。見 [`server/generate/graph.ts`](https://github.com/ahmedkhaleel2004/gitdiagram/blob/20eea559377fe3f110ac630856351382c4b5fcab/src/server/generate/graph.ts#L90-L175) 與 [`graph-planner.ts`](https://github.com/ahmedkhaleel2004/gitdiagram/blob/20eea559377fe3f110ac630856351382c4b5fcab/src/server/generate/graph-planner.ts#L72-L225)。
- 通過的 IR 再由 deterministic compiler 轉 Mermaid；成功 artifact 與 terminal audit 被持久化。README 對整條 pipeline 有一致描述。見 [`README.md`](https://github.com/ahmedkhaleel2004/gitdiagram/blob/20eea559377fe3f110ac630856351382c4b5fcab/README.md#L49-L59)。

**可借鑑**

- validator 的精確 feedback 進入下一輪，而不是整圖重新猜。
- retry 必須 bounded，receipt 應記錄實際 attempts / corrections。
- 對「從倉庫畫圖」的更高階後續，可把節點與關係綁定到真實 source path；但這是 semantic provenance 的下一切片，不應塞進本輪 geometry / perceptual gate。

**明確不借鑑**

- 不用 Mermaid / ELK 替換 Archify 的 typed renderer 與 exact geometry。
- 不引入 R2、Redis、quota、provider、SSE 或 web persistence。
- 不原樣照搬 34-node / 48-edge 上限；Archify 的複雜度預算應按 diagram type / profile 校準。
- 不在本輪給所有 Archify schema 新增 source-path 欄位；這會把一個可小步驗證的交付門擴大為跨五類 IR 的 provenance 遷移。

## 建議實現邊界

### 代碼與契約

1. 在共享 `cleanFlowProblems()` 中移除「沒有 profile 就跳過」的 early return；source / target exemption、container / lifeline intentional pass-through 語義保持不變。
2. profile 仍只控制審美更強的規則：proper X crossing、short / micro segment、route rhythm 等。不要藉機把所有 profile-less legacy artifact 變成 hard failure。
3. 在 `SKILL.md` 增加 perceptual delivery gate：最終 HTML + canonical raster、明確 defect taxonomy、最多兩輪、每輪重跑確定性門、如實 receipt。
4. 不增加新 CLI command 或 receipt sidecar。v1 復用現有 `validate --json` 作為機器證據；handoff receipt 只補圖像覆核狀態與輪次。

### 不在本輪實現

- obstacle-aware A* / ELK / Graphviz auto-router；hard fail + 現有 `via` / side hints 先建立正確性下限。將來如果要做，應該只在當前 `auto` 路徑確實撞障礙時比較少量 deterministic dogleg candidates，避免無謂改動 golden geometry。
- 自動審美打分、跨圖排行榜或「100 分」聲明。
- repo path provenance / explanation planner；它很有價值，但應獨立設計 schema 與 evidence contract。
- PR #28 的當前 regex patch；先補完字符覆蓋與真實字體測量證據。
- 新 preset、圖類型、vendor icon、mobile UI、託管服務、瀏覽器依賴或後臺 daemon。

## 測試與驗收

### 必須自動化

1. **共享單測**：無 `profile`、無 `ARCHIFY_QUALITY_PROFILE` 時，relationship 穿過無關節點仍返回一條 `clean-flow/edge-through-node`；source / target boxes 仍豁免。
2. **#24 exact regression**：使用 issue 中 3 components / 1 auto connection，省略 `quality_profile`：
   - `render` 與 `validate` 必須 non-zero；
   - stderr 必須包含 diagram type、`connections[0]`、`api -> queue`、`cache`、首個 segment、2px clearance 與 `fromSide` / `toSide` / `via` 修復提示；
   - issue 給出的安全 `via` workaround 必須通過。
3. **邊界保護**：profile-less 的 unrelated proper X crossing、route rhythm 等仍按原 compatibility 語義處理；本輪只能把 edge-through-node 升為 universal correctness failure。
4. **五 renderer 語義保護**：現有 workflow / architecture / dataflow / lifecycle Clean Flow fixtures 全綠；sequence lifeline、activation、segment 與各種 container 仍保持 intentional pass-through。
5. **交付契約測試**：鎖定 SKILL 中 deterministic-first、最終像素檢查、最多 2 輪、每輪重跑、`passed` / `skipped`、真實 correction count，以及「vision 不得覆蓋 deterministic failure」。
6. 在 `archify/` 運行 `npm test`。
7. 因 `SKILL.md` 是發布物，運行 `scripts/build-zip.sh /tmp/fresh.zip`，將解壓內容與 `archify.zip` 比較；準備發布時重建並提交 archive，不能只改源碼樹。

### 必須人工 / agent 視覺驗收

用最終 browser artifact 和 canonical PNG 檢查至少一個 architecture 成品：

- 無隱藏在 component 後、會改變 topology 讀法的路徑；
- 無 clipping、node / label overlap、stacked edges、legend 遮擋；
- 主路徑、次要路徑與 boundaries 層級清楚，留白均衡；
- CJK 與 ASCII 混排的 label 可讀；
- light / dark 都可辨識；
- 若做過修正，最多兩輪且每輪後 `validate --json` 仍通過。

### 完成標準

- #24 profile-less repro 從「靜默成功」變為「可操作的 hard failure」；安全 route 通過。
- `npm test` 與 ZIP freshness gate 通過。
- 最終 handoff 同時給出機器 validation receipt、`visual_review` 真實狀態和 correction count。
- 無 schema / preset / diagram type / mobile / hosted surface / runtime dependency 增量。

## 風險與後續

- **兼容性風險（已知且有意）**：過去靠 paint order 隱藏錯誤路徑的 profile-less v1 文件會開始失敗。建議在 release notes 中明確標為 semantic correctness fix，而不是普通 composition tightening。
- **誤報風險**：共享 obstacle 集合必須繼續只包含 opaque semantic nodes；container、lane、stage、lifeline、activation 等 intentional pass-through geometry 不得誤塞進來。
- **視覺覆核不可機器證明**：v1 的 `visual_review` 是真實執行狀態，不是假裝客觀的視覺分數；無 image reader 必須 skipped。後續若需要可審計 artifact，可單獨設計截圖 hash / evidence path，而不是把服務端存儲帶入本輪。
- **下一優先級**：本切片穩定後，再評估「只在當前 auto dogleg 撞障礙時比較 H-V-H / V-H-V 兩個候選」的 renderer-owned 小路由優化；它可減少一次人工 `via` 修正，但不應搶在 universal correctness gate 之前。
