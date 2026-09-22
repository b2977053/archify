# Architecture Delta 之後的下一刀：Exact-ID Delta Review Navigator

研究日期：2026-07-23
Archify 基線：[`4aeb07b`](https://github.com/tt-a1i/archify/tree/4aeb07b379f09a8fc026df33e2402ad50ef9821e)

## 唯一推薦

下一項只做 **Exact-ID Delta Review Navigator（逐項架構變更審閱器）**：在現有 Architecture Delta HTML 內，把已經生成的確定性 change rows 變成可選擇的審閱步驟，並加入 `Previous / Review / Next / Overview`。用戶可以手動逐項看，也可以主動開始一次有限、不循環的審閱播放；每一步只突出 compare receipt 已經證明的那一個 component、connection 或 boundary，完整 Delta 仍留在原位作為上下文。

它不是第二個 diff 算法，也不是影響分析。它只把當前已經可信、但仍偏「總覽 + 表格」的 Delta 變成更容易講解和覆核的視覺審閱流程。

## 為什麼這是一個真實缺口

當前 Archify 已經明確發布下列能力，因此它們全部排除，不再包裝成「下一特性」：

- Last-Good Live Preview 已經有獨立、loopback-only、last-known-good 合同。([current Skill](https://github.com/tt-a1i/archify/blob/4aeb07b379f09a8fc026df33e2402ad50ef9821e/archify/SKILL.md#L84))
- revision-pinned Repository Evidence、HTML-only source beacons 已經存在。([current Skill](https://github.com/tt-a1i/archify/blob/4aeb07b379f09a8fc026df33e2402ad50ef9821e/archify/SKILL.md#L285-L311))
- Structured Repair Receipt 已覆蓋 input、schema、repository evidence、composition、artifact 和 delivery failures。([current Skill](https://github.com/tt-a1i/archify/blob/4aeb07b379f09a8fc026df33e2402ad50ef9821e/archify/SKILL.md#L88))
- Cursor onboarding、`deployment-ownership` profile 和 Architecture Delta 都已發布並帶回歸證據。([current changelog](https://github.com/tt-a1i/archify/blob/4aeb07b379f09a8fc026df33e2402ad50ef9821e/CHANGELOG.md#L8-L11))

Architecture Delta 當前已經：

1. 生成確定性 `Before / Delta / After` 三視圖；
2. 把 components、connections、boundaries 的變化排序成 exact change rows；
3. 顯示 counts、proof level、classifications 和 changed fields；
4. 嚴禁 risk、mergeability 或 verified-PR 結論。

但 current artifact 裡的 change rows 只是靜態 `<li>`；頂部只有視圖、preset 和 theme 控制，沒有 change-level selection、previous/next 或 review playback。([Delta renderer](https://github.com/tt-a1i/archify/blob/4aeb07b379f09a8fc026df33e2402ad50ef9821e/archify/delta/architecture-delta.mjs#L545-L580))

因此缺口不是「再生成一種圖」，而是：**當變化多於三四項時，審閱者怎樣不離開完整上下文，逐項確認每條已經證明的變化。**

## 一手資料結論

### Fireworks Tech Graph：借語義順序和固定場景，不借循環特效

Fireworks 的 motion contract 要求 metadata 不完整時 fail closed，不把已審核 motion 套到任意同風格拓撲；其通用規則是按 semantic order 展開，同時固定 nodes、labels、containers、marker geometry 和 camera。([motion input contract](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/blob/50c819d68fd4fee330b3010988cd13e98b678d44/references/motion-effects.md#L26-L36), [fixed-scene rules](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/blob/50c819d68fd4fee330b3010988cd13e98b678d44/references/motion-effects.md#L38-L52)) 它還把 repeated roles 用 exact `(role, stage, order)` 獨立尋址，並說明剝離 motion metadata 後應恢復原靜態幾何。([identity and static recovery](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/blob/50c819d68fd4fee330b3010988cd13e98b678d44/references/motion-effects.md#L251-L273))

**吸收：** Review Navigator 使用現有 receipt 的確定性順序、精確實體身份和一次性有限播放；選中時不移動或重排圖。
**不吸收：** 無限 GIF、ambient flow、任意 motion preset、對缺失身份的猜測。

### GitDiagram：交互必須落回已經校驗的結構

GitDiagram 的生成流程先得到 size-bounded graph AST，再驗證 identifiers、connectivity 和真實 repository paths，之後才 deterministic compile；最終交互節點仍指向已經驗證的 source path。([generation contract](https://github.com/ahmedkhaleel2004/gitdiagram/blob/041d2feb4a9b1593dcf3bde2ca5b9ae7659becb9/README.md#L49-L59)) 它也把「click component」和 PNG export 當作核心用戶行為，而不是讓交互重新解釋圖。([product surface](https://github.com/ahmedkhaleel2004/gitdiagram/blob/041d2feb4a9b1593dcf3bde2ca5b9ae7659becb9/README.md#L14-L21))

**吸收：** change row activation 只能定位到現有 validated DOM identity。
**不吸收：** hosted ingestion、LLM generation、storage、private-token flow。

### drawio-skill：PR summary 值得保留為下一候選，但不是本輪

drawio-skill 的 `prdiff.py` 會從 git refs 找出變化的 `.drawio`，輸出 base/head/diff PNG 和 Markdown report；沒有 draw.io CLI 時會明確降級為文件清單。([PR diff contract](https://github.com/Agents365-ai/drawio-skill/blob/6f33563adce24450003d1cb61111ebbcc5579f28/skills/drawio-skill/scripts/prdiff.py#L1-L18), [Markdown renderer](https://github.com/Agents365-ai/drawio-skill/blob/6f33563adce24450003d1cb61111ebbcc5579f28/skills/drawio-skill/scripts/prdiff.py#L114-L155)) 它的 underlying diagram diff 默認按 cell ID 對齊，但仍提供 `--by-label` 給隨機 ID 的手繪圖。([matching contract](https://github.com/Agents365-ai/drawio-skill/blob/6f33563adce24450003d1cb61111ebbcc5579f28/skills/drawio-skill/scripts/drawiodiff.py#L18-L31))

**吸收：** PR-friendly summary 確實有價值，應保留為後續獨立切片。
**不吸收：** label matching；Archify Delta 必須繼續 exact-ID、fail-closed。也不在本輪引入 git-ref parsing、Markdown asset hosting 或 CI comment publishing。

### GitNexus：不要把 authored Delta 偷換成 code impact

GitNexus 的 `impact`、`detect_changes` 和 process resources 建立在本地解析、knowledge graph、process trace 和 staleness checks 上。([tool contract](https://github.com/abhigyanpatwari/GitNexus/blob/cdbdf219dce797e51cdeb8cfa386e77ab2d35628/README.md#L136-L175)) Archify 的兩份 authored architecture snapshots 沒有這些事實來源。

**吸收：** 對證據來源和 freshness 的顯式區分。
**不吸收：** blast radius、affected process、confidence、risk level 或 safe-to-merge 文案。

## 兩個真正的新候選

| 候選 | 用戶價值 | 穩定性成本 | 當前判斷 |
|---|---|---|---|
| **A. Exact-ID Delta Review Navigator** | 很高：用戶在一個成品裡逐條檢查、講解和演示真實 change；不再靠眼睛在全圖和表格間來回找。 | 中低：只消費 embedded compare receipt 和已生成 SVG；新增的是一個有限 viewer state machine。 | **現在做。** 它是明顯可見的 delight，又不擴大事實邊界。 |
| **B. Deterministic CI/PR summary** | 中高：可把 counts 和 rows 放進 CI job summary 或 PR comment。 | 中：Markdown escaping、asset paths、base/head ref provenance、GitHub/CI host、private repo disclosure 和 publishing failure 都要獨立定義。 | **後做。** CLI 已經有 `--json` 和 sidecar receipt，機器可消費入口不為空；先把人類審閱體驗做好。 |

B 不是壞想法，但現在做它會讓核心能力先長出 CI/GitHub 邊界，用戶打開 Delta 後仍只能看靜態 rows。A 的新增事實面為零，且能立即在現有示例、README 演示和真實 PR review 中被看見。

## 凍結產品合同

### 1. 唯一事實源

Navigator 只讀當前 document 內唯一的 `#archify-compare-receipt`，並要求：

- JSON 可解析；
- `schemaVersion === 1`、`command === "compare"`；
- `completeness === "complete"`；
- `changes.components / connections / boundaries` 都是數組；
- 當前文檔恰好有一個 Delta canvas 和對應 SVG；
- 每個 change 能在 Delta SVG 中得到合同允許的 exact match。

任一條件失敗，Navigator 整體不可用並顯示 `Review unavailable · compare identity mismatch`；Before / Delta / After、details、theme 和 preset 仍可用。不得部分播放、模糊匹配或跳過壞 row 後聲稱完整。

### 2. 身份規則

- component：receipt `id` ↔ `data-node-id`；
- connection：receipt `id` ↔ `data-edge-id`；只把 path/line/polyline 與其 exact label/detail group 作為同一 change 的視覺集合；
- boundary：receipt `key` ↔ renderer 新增的 `data-delta-boundary-key`；該 key 仍是 compare 已經驗證唯一的 `(kind, label)`，不新增 schema ID；
- moved component、rerouted connection 和 changed boundary 可以有 before phantom 與 head form；同一 exact identity 的全部合法 form 一起被選中；
- 重複、缺失、錯誤 kind、錯誤 status 或 DOM/receipt classification 衝突全部 fail closed。

永遠不按 label、endpoint、geometry、鄰近關係或數組位置猜實體。

### 3. 順序

直接復用當前 `changeRows(receipt)` 的 codepoint-stable 順序；不要創建「更聰明」的 risk、severity 或 topology-first 排序。總數必須等於三類 changes 的合計，並與 details summary 一致。

格式化、object-key、entity-order、`wraps` / `sources` set-like reordering 已經不改變 Delta artifact；Navigator 不得破壞這一保證。([current deterministic tests](https://github.com/tt-a1i/archify/blob/4aeb07b379f09a8fc026df33e2402ad50ef9821e/archify/test/architecture-delta.test.mjs#L67-L75), [artifact stability tests](https://github.com/tt-a1i/archify/blob/4aeb07b379f09a8fc026df33e2402ad50ef9821e/archify/test/architecture-delta.test.mjs#L130-L177))

### 4. UX

保持一個 canvas，不增加第二張圖或側邊工作檯：

- Details summary 上方或現有 proof tools 內加入一個 compact review strip；
- native buttons：`Overview`、`Previous`、`Review/Pause/Replay`、`Next`；
- 一個穩定狀態文本：`03 / 11 · Relationship · publish-order · geometry`；
- 每個 change row 變成 native button 或含一個全行 button，顯示現有 symbol、kind、label、ID、classifications、fields；
- 手動 row/Previous/Next 選擇立即暫停播放，保持當前 exact change；
- `Overview` 清除 selection，恢復完整 Delta；
- Starting Review 是唯一可自動前進的入口，始終先切到 Delta view，從第一項開始，播放一次後停在最後一項；絕不自動開始或循環；
- 用戶切到 Before/After、聚焦任意 review control、頁面 hidden、print 或出現新 intent 時立即暫停，絕不自行恢復。

行按鈕採用一個 roving tab stop，支持 ArrowUp/ArrowDown、Home/End 移動焦點，Enter/Space 選擇；Previous/Next 激活後不移動按鈕焦點。若提供自動前進，W3C Carousel pattern 要求 keyboard focus 停止 rotation，且只有用戶再次觸發 control 才可恢復。([WAI-ARIA APG Carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/))

### 5. 視覺

- 完整圖、viewBox、node/edge/boundary geometry 和 paint order保持不變；
- 當前 change 為 full emphasis，其他 changed entities 收斂到可讀的 secondary opacity；unchanged context 繼續保留；
- selected state 同時使用 outline/pattern/symbol/文字狀態，不只靠顏色；
- moved/rerouted 的 from + to forms 同時可見，不製造「只有新位置」的假象；
- 不複製 node/edge 作為新的可見拓撲；允許一個無 marker、無 pointer events 的靜態 focus outline，但它必須來自 exact matched geometry，並在 clear/print 時刪除；
- manual selection 可以有一次不超過 160ms 的 opacity transition；Review 每步至少停留 1400ms；不移動 camera，不縮放，不平移，不閃爍。

`prefers-reduced-motion: reduce` 下取消 transition 和自動 Review，只保留完整手動 Previous/Next/row selection。該 media feature 的語義正是減少或替換非必要動畫。([MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion))

### 6. 狀態邊界

Navigator 狀態是 viewer-only：

- 不寫入 JSON IR、sidecar receipt、compare hashes、URL、history、localStorage 或 cookies；
- 不改變 Before / Delta / After 的原始 SVG markup；
- print 固定輸出完整 Delta，忽略 active step；
- 不加入 Share Card、PNG、WebM 或其他 export，本輪也不藉機補 export menu；
- 無新 dependency、server、GitHub API、telemetry 或 mobile product surface。

### 7. 文案邊界

允許：`Authored change 3 of 11`、`Revision-pinned inputs`、`Changed fields`、`No authored architecture changes`。
禁止：`impact`、`blast radius`、`affected`、`risk`、`safe`、`mergeable`、`verified PR`、`breaking`，除非未來存在獨立、明確的代碼事實合同。

## 明確不做

- 不做 CI action、PR bot、GitHub comment、status check 或 asset hosting；
- 不接收 git refs，不自動選擇 base；
- 不做 label/endpoints fuzzy identity；
- 不做 risk/severity scoring、affected-process 推斷或測試建議；
- 不做 diff editing、accept/reject、approval workflow；
- 不做 infinite autoplay、ambient particles、GIF/WebM 導出；
- 不復用普通 diagram 的 Story/Route/Camera state machine；Delta Navigator 擁有自己的小型、單一 owner；
- 不做移動端產品；只保證現有桌面 proof 不產生頁面橫向溢出。

## 自動化穩定門

實施必須先寫失敗測試，再滿足以下門：

1. pure identity resolver 覆蓋 component、connection、boundary、added、removed、changed、moved、rerouted 和 zero-change；
2. missing / duplicate / conflicting DOM identity 統一 fail closed，且不會只跳過某一 row；
3. row count、step count、summary count 與 embedded receipt 完全一致；
4. stable order 在輸入格式、object key、entity order、set-like order 改動後不變；
5. Overview 不留下 `data-delta-review-*`、inline style、outline clone、timer 或 `aria-current`；
6. Review 只運行一次，最後停止；replace/pause/hidden/print/reduced-motion 使舊 timer token 失效；
7. manual activation、keyboard focus、view switch 都停止自動前進且不會 auto-resume；
8. print 強制完整 Delta，禁止 toolbar、selection dimming 和 runtime overlay；
9. forbidden claims audit 繼續通過；
10. current Delta artifact bytes仍然 deterministic；只有功能實現本身造成一次受控 golden 更新；
11. `npm test`、`npm run test:webm`、installed ZIP package smoke、`unzip -t`、`git diff --check` 全綠；
12. 不修改普通五 renderer 的 canonical exports、Route/Reach cards、WebM 或 Story behavior。

## 內置瀏覽器驗收

在 `examples/checkout-platform-delta.html` 的桌面視口完成：

1. 冷啟動仍是 Delta overview，無選中 row、無 timer、無 console warning/error；
2. 點擊一個 component change：exact row 獲得 `aria-current="step"`，只有相同 `data-node-id` 的合法 Delta forms 成為 current；
3. 點擊一個 connection change：path、對應 label/detail 同步突出，不命中同 endpoints 的另一條 edge；
4. moved node 同時保留 move-from 和 moved form；rerouted edge 同時保留 old/new route；
5. boundary row 只匹配同一個 exact boundary key；
6. Previous/Next、row click、Arrow/Home/End、Enter/Space 行為一致；焦點始終可見；
7. Review 從第一項開始、一次走完、停在最後；Pause 保留當前靜態事實，Replay 只有用戶點擊後才重新開始；
8. 播放期間聚焦 row、切 Before/After、隱藏頁面或按 Pause 後不再前進；
9. 瀏覽器模擬 reduced motion：Review 不自動運行，手動 navigation 完整可用；
10. Overview 清除所有 runtime state，DOM/SVG fingerprint 回到激活前；
11. Classic / Signal Flow / Blueprint × dark / light 都能區分 selected、other change、unchanged context；
12. 1280×720 與 1440×900 無頁面橫向溢出，controls 不遮住圖或 exact change list；
13. `window.print()` / print preview 只呈現完整 Delta，沒有 review chrome 或 selection residue；
14. 動態篡改一個 ID 或製造 duplicate 後，Navigator 顯示明確 unavailable，三視圖和靜態 change list 仍可讀，絕不 fuzzy-match。

## 成功判斷

成功不是「多了一個 Play 按鈕」。成功是審閱者可以從 Overview 開始，用完全相同的 authored facts 逐項走完一份複雜 Delta；隨時暫停、返回全圖、切 Before/After，都不會丟失上下文或得到新的推斷。實現前後 compare receipt、stable IDs、三視圖和禁用風險結論的真相合同保持不變。

完成這一刀之後，再單獨評估 B：從 sidecar receipt 生成 deterministic Markdown/CI summary。那一輪必須獨立凍結 git provenance、private path disclosure、asset publication、Markdown escaping 和 publishing failure，不能借本輪 Navigator 順手帶入。
