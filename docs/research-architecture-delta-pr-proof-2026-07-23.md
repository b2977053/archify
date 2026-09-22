# Architecture Delta / PR Proof：研究結論與實現合同

日期：2026-07-23（Asia/Shanghai）
Archify 基線：`codex/architecture-delta-proof@5302d2251ff2aaca56f7c08818ebe8421f41a6f3`

## 結論

下一項值得做的用戶可見切片是一個 **Architecture Delta**：給它兩份已經存在、已經通過 Archify 校驗的 `architecture` JSON，它生成一個離線、自包含、可驗證的 HTML，默認回答「架構事實改了什麼」，並可切換 Before / Delta / After。**PR Proof 是這個產物的使用場景，不是新的事實來源**；首版不訪問 GitHub、不拉取倉庫、不分析代碼影響，也不聲稱某個 PR 安全。

它成立的前提不是再加一種紅綠風格，而是先凍結四件事：

1. 只用穩定 ID 配對節點與關係，不按標籤、位置、類型或相似度猜測。
2. Delta 復用兩側已經驗證過的幾何；刪除項保留 baseline 的原位置，不重新布局整張聯合圖。
3. 「架構事實變化」「證據變化」「布局變化」「展示變化」分開計數，不能都壓成一個 `changed`。
4. 比較、渲染、檢查、提交和回執是一個 fail-closed 原子流程；證據不足時失敗或降級為 `authored`，不能顯示虛假的綠色通過。

## 一手證據

### Agents365 drawio-skill：證明評審入口有價值，也暴露了不能照抄的邊界

研究快照：[`Agents365-ai/drawio-skill@6f33563`](https://github.com/Agents365-ai/drawio-skill/tree/6f33563adce24450003d1cb61111ebbcc5579f28)。

- `drawiodiff.py` 默認用 draw.io cell ID 配對節點，並說明導入器產生的語義 ID 適合跨快照對齊；它也提供 `--by-label` 給隨機 ID 圖兜底。節點分為 added / removed / changed / same，關係按端點集合分為 added / removed / same。([source](https://github.com/Agents365-ai/drawio-skill/blob/6f33563adce24450003d1cb61111ebbcc5579f28/skills/drawio-skill/scripts/drawiodiff.py#L2-L31), [matching and output](https://github.com/Agents365-ai/drawio-skill/blob/6f33563adce24450003d1cb61111ebbcc5579f28/skills/drawio-skill/scripts/drawiodiff.py#L107-L160))
- 它把比較結果交給 Graphviz 重新布局，且明確丟棄容器、分組、邊標籤和原形狀，只保留一張扁平狀態圖。([source](https://github.com/Agents365-ai/drawio-skill/blob/6f33563adce24450003d1cb61111ebbcc5579f28/skills/drawio-skill/scripts/drawiodiff.py#L12-L28))
- `prdiff.py` 從兩個 Git ref 提取 changed `.drawio`，為修改文件生成 base / head / diff 三張 PNG，再匯總為 PR Markdown；新增或刪除文件只有存在的一側。([source](https://github.com/Agents365-ai/drawio-skill/blob/6f33563adce24450003d1cb61111ebbcc5579f28/skills/drawio-skill/scripts/prdiff.py#L2-L18), [pipeline](https://github.com/Agents365-ai/drawio-skill/blob/6f33563adce24450003d1cb61111ebbcc5579f28/skills/drawio-skill/scripts/prdiff.py#L30-L110))
- PR bot 用固定 HTML marker 更新同一條 sticky comment，避免每次 push 產生新評論；缺 draw.io CLI 時仍輸出文件清單但沒有圖片。([source](https://github.com/Agents365-ai/drawio-skill/blob/6f33563adce24450003d1cb61111ebbcc5579f28/skills/drawio-skill/references/pr-bot.md#L1-L25), [degradation and sticky comment](https://github.com/Agents365-ai/drawio-skill/blob/6f33563adce24450003d1cb61111ebbcc5579f28/skills/drawio-skill/references/pr-bot.md#L49-L62))

對 Archify 的含義：**吸收 base / delta / head 的評審信息架構和穩定 ID 原則；不吸收按標籤猜身份、全圖重排、扁平化容器、外部 draw.io / Graphviz 依賴和核心能力對 CLI 缺失的靜默降級。**

### GitNexus：事實變化與推斷影響必須分層

研究快照：[`abhigyanpatwari/GitNexus@cdbdf21`](https://github.com/abhigyanpatwari/GitNexus/tree/cdbdf219dce797e51cdeb8cfa386e77ab2d35628)。

- `detect_changes` 先把 Git diff hunk 映射到有 ID、文件和行範圍的已索引符號，再列出受影響執行流；其輸入明確區分 unstaged / staged / all / compare，並處理 linked worktree。([tool contract](https://github.com/abhigyanpatwari/GitNexus/blob/cdbdf219dce797e51cdeb8cfa386e77ab2d35628/gitnexus/src/mcp/tools.ts#L335-L371), [implementation](https://github.com/abhigyanpatwari/GitNexus/blob/cdbdf219dce797e51cdeb8cfa386e77ab2d35628/gitnexus/src/mcp/local/local-backend.ts#L4107-L4211))
- 當前 hunk parser 以 new-side range 建立變更範圍，純刪除 hunk 沒有 new-side 行時不會進入後續映射；這再次說明 Delta 必須直接解析 base 與 head 兩個完整模型，不能只消費 target-side touched symbols。([source](https://github.com/abhigyanpatwari/GitNexus/blob/cdbdf219dce797e51cdeb8cfa386e77ab2d35628/gitnexus/src/storage/git.ts#L516-L548))
- 它把 diff hunk 與符號範圍的重疊標為 `touched`，再單獨聚合執行流；查詢失敗會返回 `partial: true`，避免缺失數據偽裝成低風險。([source](https://github.com/abhigyanpatwari/GitNexus/blob/cdbdf219dce797e51cdeb8cfa386e77ab2d35628/gitnexus/src/mcp/local/local-backend.ts#L4213-L4335))
- `impact` 的 blast radius 是另一套合同，輸出 direct / transitive depth、process、module 和 LOW–CRITICAL / UNKNOWN；模糊目標會要求用 UID 消歧，而不是靜默挑一個。([tool contract](https://github.com/abhigyanpatwari/GitNexus/blob/cdbdf219dce797e51cdeb8cfa386e77ab2d35628/gitnexus/src/mcp/tools.ts#L432-L468), [risk calculation](https://github.com/abhigyanpatwari/GitNexus/blob/cdbdf219dce797e51cdeb8cfa386e77ab2d35628/gitnexus/src/mcp/local/local-backend.ts#L6075-L6123))

對 Archify 的含義：Architecture Delta 可以證明「輸入模型的哪些事實不同」，但沒有代碼知識圖、運行鏈和可信映射時，**不得**輸出 blast radius、風險等級、「will break」或「safe to merge」。若未來消費 GitNexus 回執，也必須把外部 impact 證據與本地 authored delta 分層展示。

### GitDiagram：路徑化診斷、有限審計值得吸收，模型重試不屬於 Delta

研究快照：[`ahmedkhaleel2004/gitdiagram@041d2fe`](https://github.com/ahmedkhaleel2004/gitdiagram/tree/041d2feb4a9b1593dcf3bde2ca5b9ae7659becb9)。

- GitDiagram 給驗證問題穩定 category、精確欄位 path 和 message，並檢查重複 node ID、未知 group、真實文件樹路徑、未知邊端點。([source](https://github.com/ahmedkhaleel2004/gitdiagram/blob/041d2feb4a9b1593dcf3bde2ca5b9ae7659becb9/src/server/generate/graph.ts#L12-L38), [validation](https://github.com/ahmedkhaleel2004/gitdiagram/blob/041d2feb4a9b1593dcf3bde2ca5b9ae7659becb9/src/server/generate/graph.ts#L90-L175))
- 圖規劃最多三次；失敗後只把上一份 raw graph 和精確 validation feedback 送入下一次，並為每次嘗試保存狀態、分類和反饋。([limits and audit shape](https://github.com/ahmedkhaleel2004/gitdiagram/blob/041d2feb4a9b1593dcf3bde2ca5b9ae7659becb9/src/features/diagram/graph.ts#L7-L21), [attempt audit](https://github.com/ahmedkhaleel2004/gitdiagram/blob/041d2feb4a9b1593dcf3bde2ca5b9ae7659becb9/src/features/diagram/graph.ts#L96-L138), [bounded planner](https://github.com/ahmedkhaleel2004/gitdiagram/blob/041d2feb4a9b1593dcf3bde2ca5b9ae7659becb9/src/server/generate/graph-planner.ts#L72-L225))
- 終態審計會去掉成功結果裡重複的大對象，失敗時保留原始輸出和驗證反饋，避免回執膨脹但不丟失失敗證據。([source](https://github.com/ahmedkhaleel2004/gitdiagram/blob/041d2feb4a9b1593dcf3bde2ca5b9ae7659becb9/src/server/generate/session-audit.ts#L36-L84))

對 Archify 的含義：復用現有 `schemaVersion: 1` repair receipt 的方向，新增 delta 專屬的 code / subject / evidence / supportedFixes；**不引入 LLM、重試、provider、SSE、R2/Redis 或託管狀態**。比較是純確定性操作，一次失敗就給出可修複診斷。

### 標準約束：模型 ID、差異種類、刪除佔位與 PR 基線

- The Open Group 的 ArchiMate Exchange XSD 為 element 與 relationship 分別建立 identifier key，並用 keyref 約束 relationship source / target；這說明架構交換合同把節點和關係身份都當作第一等事實。([official schema documentation](https://www.opengroup.org/xsd/archimate/3.0/html-model/))
- Eclipse EMF Compare 的默認 match phase 優先用對象標識符，差異分為 ADD / DELETE / CHANGE / MOVE；其圖形比較用 phantom placeholder 標出被刪除對象原來的位置。([developer guide](https://help.eclipse.org/latest/topic/org.eclipse.emf.compare.doc/help/developer/developer-guide.html), [user guide](https://eclipse.dev/emfcompare/documentation/latest/user/user-guide.html), [DifferenceKind API](https://help.eclipse.org/latest/topic/org.eclipse.emf.compare.doc/help/developer/javadoc/org/eclipse/emf/compare/DifferenceKind.html))
- GitHub PR 使用 three-dot comparison，以 merge base 到 topic head 表達「這個 PR 引入了什麼」；two-dot 是 base tip 與 head tip 的直接比較。([GitHub Docs](https://docs.github.com/en/pull-requests/reference/branches#three-dot-and-two-dot-git-diff-comparisons))
- Git 的 raw diff format 把 A/C/D/M/R 等狀態分開，並為 copy/rename 報告相似度分數；rename detection 本身是可配置的相似度推斷。因此 Archify 只有顯式穩定 ID 才能聲稱同一實體發生變化，不能把相似 label 當 rename。([Git diff format](https://git-scm.com/docs/diff-format.html), [git-diff](https://git-scm.com/docs/git-diff))
- RFC 8785 說明要對 JSON 做可重複哈希，必須先有不變的規範化表示和確定的屬性排序。Archify 不應聲稱兼容 JCS，除非實現並通過完整兼容測試；但 compare IR 必須採用同樣的「先規範化、再哈希」原則。([RFC 8785](https://www.rfc-editor.org/rfc/rfc8785.html))

## 凍結合同

以下規則是首版實現邊界。任何一條未滿足，都不能把產物稱為 Architecture Delta / PR Proof。

### 1. 可比較性

1. 兩個輸入都必須先獨立通過當前 `architecture` schema、關係、視圖、Clean Flow、composition 和已啟用 engineering profile 校驗；不能為了比較而放寬任何一側。
2. 兩側必須都是 `schema_version: 1`、`diagram_type: "architecture"`。類型或 schema 版本不同直接失敗。
3. 兩側至少有一個完全相同的 `components[].id`。零共享節點意味著沒有證據證明它們描述同一系統；返回 `delta/no-shared-component-id`，不把全圖猜成 remove + add。
4. `meta.repository` 兩側都存在時，規範化後的 repository URL 必須完全相同；不同倉庫返回 `delta/repository-mismatch`。只有一側有 repository 或兩側都沒有時仍可比較，但 `proofLevel` 必須是 `authored`。
5. 兩側 repository URL 相同且 revision 都是 40 位 SHA 時，`proofLevel` 可為 `revision-pinned`；這隻證明輸入聲明並通過了 Archify 既有 repository-evidence gate，不能稱為 GitHub PR、merge-base 或代碼影響驗證。
6. 首版命令只比較兩個本地 JSON 文件，不接受 Git ref、URL 或 PR number。未來若增加 Git wrapper，PR 模式必須把 baseline 解析為 merge-base（three-dot 語義），並把解析後的 base/head SHA 寫入回執，不能把 two-dot 偷換成 PR diff。

建議入口：

```text
archify compare architecture <base.json> <head.json> [output.html] [--json] [--repo-root path]
```

它不是第六種 diagram type，也不是普通 `render` 的默認行為。

### 2. 穩定節點與關係身份

- 節點身份只認 `components[].id`；ID 改名就是一個 removed + 一個 added。不得按 label、type、sources、row/col、位置或內容相似度推斷 rename。
- 關係身份只認 `connections[].id`。只要任一側存在無 ID connection，比較失敗並逐條報告 `delta/relationship-id-required`；不得退化為 `(from,to)`，因為平行關係、標籤變化和端點遷移都會使該鍵含糊。
- 相同 relationship ID 而 `from` 或 `to` 變化是 `topology` change；Delta 同時畫舊關係和新關係，並在回執中配成一項，不能只畫一條橙線掩蓋舊端點。
- 連接 ID 在每一側都必須唯一，端點必須存在。沿用既有 duplicate/dangling diagnostics，不新增靜默修復。
- 當前 boundary 沒有 ID。首版以精確 `(kind,label)` 作為**保守鍵**，只允許唯一鍵；重複鍵返回 `delta/boundary-key-ambiguous`。label 改名表現為 removed + added，不做 rename 推斷。若後續要支持可靠 boundary rename，再單獨給 schema 增加穩定 `id`，不能擴大首版猜測範圍。

### 3. 欄位變化分類

比較先把 object key、component/connection 順序和 set-like 欄位規範化，再按下表分類。數組原始順序不能製造節點/關係變化；`wraps` 和 `sources` 作為集合按規範鍵排序，`via` 和 Story `focus` 保持有序。

| 實體 | 分類 | 欄位 | 用戶含義 |
| --- | --- | --- | --- |
| component | `semantic` | `type`, `label`, `sublabel`, `tag` | 架構角色或說明變了 |
| component | `evidence` | `sources` | 源碼證據綁定變了，不等於組件本身變了 |
| component | `geometry` | `row`, `col`, `pos`, `size` | moved/resized；不計入架構 changed |
| connection | `topology` | `from`, `to` | 關係端點變了；同時展示舊/新關係 |
| connection | `semantic` | `label`, `variant` | 關係機制或含義變了 |
| connection | `geometry` | `fromSide`, `toSide`, `route`, `via`, `labelAt`, `labelDx`, `labelDy`, `labelSegment`, `width` | rerouted/restyled；不計入架構 changed |
| boundary | `scope` | `kind`, `label`, `wraps` | 部署/安全範圍變了 |
| boundary | `geometry` | `pad` | 僅容器留白變了 |
| provenance | `provenance` | `meta.repository` | 輸入證據級別或 revision 變了 |
| presentation | `presentation` | `meta.title`, `subtitle`, `animation`, `visual_preset`, `quality_profile`, `engineering_profile`, `views`, `viewBox`, `layout`, `cards` | 讀圖、校驗或敘事呈現變了 |
| ignored | — | `meta.output` | 本地輸出路徑不屬於圖的事實，也不得影響 artifact hash |

實體的主狀態優先級固定為：`added` / `removed` → `changed`（topology、semantic、scope）→ `evidence-changed` → `moved` 或 `rerouted` → `same`。一項可以同時帶多個 classification，但 headline count 每個實體只計一次。

純 geometry / presentation change 必須與架構 change 分欄；「換了坐標」不能顯示為「服務職責改變」。同理，source path 調整不能自動推斷成運行影響。

### 4. 刪除項與聯合幾何

1. Before 使用 base 自己已經驗證的幾何；After 使用 head 自己已經驗證的幾何。
2. Delta 的主層是 head。added 用 head bbox/route；removed 用 base bbox/route，作為帶 `−` 文本標記的虛線 phantom，保持 baseline 原位置。
3. shared component 若幾何改變，Delta 保留 head 實體，同時在 base 位置畫輕量 `MOVE FROM` phantom；不得重新布局聯合圖，也不得把移動後的 head 節點拉回舊位置。
4. removed connection、舊端點版本和所有連接到 removed component 的關係都使用 base route。新增關係使用 head route。相同 ID 但端點變化時舊關係為 `−`、新關係為 `+`。
5. 聯合 viewBox 是 base/head 已驗證 viewBox 的確定性併集加固定 margin；坐標保持原值。不得為「好看」對 removed 節點做避讓，因為那會偽造它原來的位置。
6. removed phantom 在 head layer 後面，透明但仍有文本/線型/符號差異；added `+`、changed `~`、removed `−`、moved `↔` 必須不依賴顏色。
7. 若 removed 與 added 恰好重疊，保持真實幾何並在 receipt 分列兩項；視覺上用雙描邊和符號區分，不猜測 replacement/rename。
8. 首版只做靜態、即時切換，不增加循環動畫。Still / reduced motion 與普通模式信息等價。

這直接吸收 EMF Compare 的 deleted phantom 思路，同時保留 Archify 最強的「作者幾何是真相」邊界。

### 5. 確定性輸出與回執

- 比較器是純函數：相同已解析輸入 → 相同 compare IR；不得讀取當前時間、絕對路徑、Git 狀態、網絡、隨機數或 locale 排序。
- 所有 ID、changed field JSON Pointer、diagnostic 和 receipt 數組按 Unicode code-point 順序穩定排序；不能依賴輸入數組順序、對象插入順序或文件系統順序。
- 每側同時記錄 `rawSha256` / bytes（證明精確輸入）與 `semanticSha256`（對規範化 compare IR 哈希）。語義等價但空白、object key 或實體數組順序不同的輸入，raw hash 可不同，semantic hash 和 HTML 必須相同。
- canonical form 是版本化的 Archify contract（例如 `canonicalVersion: 1`）。除非實現 RFC 8785 全部要求並用官方向量驗證，否則文檔只稱「deterministic canonical JSON」，不稱 JCS-compliant。
- 成功 `--json` 回執最小形狀：

```json
{
  "schemaVersion": 1,
  "ok": true,
  "command": "compare",
  "type": "architecture",
  "comparatorVersion": 1,
  "completeness": "complete",
  "proofLevel": "authored",
  "base": { "rawSha256": "…", "semanticSha256": "…", "bytes": 0 },
  "head": { "rawSha256": "…", "semanticSha256": "…", "bytes": 0 },
  "summary": {
    "components": { "added": 0, "changed": 0, "evidenceChanged": 0, "removed": 0, "moved": 0 },
    "connections": { "added": 0, "changed": 0, "removed": 0, "rerouted": 0 },
    "boundaries": { "added": 0, "changed": 0, "removed": 0 },
    "presentationChanged": false
  },
  "changes": {
    "components": [{ "id": "api", "status": "changed", "classifications": ["semantic"], "changedFields": ["/label"] }],
    "connections": [],
    "boundaries": []
  },
  "artifact": { "sha256": "…", "bytes": 0 },
  "validation": { "checksPassed": 0, "checkCount": 0 }
}
```

- 回執不嵌入完整 base/head object，不放 generatedAt，不複製成功 artifact 內已有的大對象。失敗回執保留精確 code、side、JSON path/subject、measured evidence 和 supported fixes。
- compare 必須像當前 `deliver` 一樣在輸出旁生成唯一 candidate，完成 base/head validation、delta validation、artifact check 與 hash 後再原子替換；任何失敗刪除 candidate、保留舊 target。

### 6. Share Card 語義

Share Card 固定從 canonical Delta 狀態生成，不取決於用戶當前停在 Before 還是 After。它只回答「模型聲明發生了什麼」，不是審批結論。

- 標題：head `meta.title` + `Architecture Delta`。
- 主統計：components 與 connections 分別顯示 `+ added · ~ changed · − removed`；boundary scope 單獨一行。
- `moved` / `rerouted` / presentation-only 只放次級統計，不混進 `~ changed`。
- 同 repo + 雙 revision 時顯示 `REV <base-short> → <head-short>` 與 `REVISION-PINNED INPUTS`；否則顯示 `AUTHORED SNAPSHOTS`。
- 絕不顯示 `SAFE`, `LOW RISK`, `MERGEABLE`, `NO IMPACT`, `VERIFIED PR`。零變化寫 `No authored architecture changes`，不是綠色安全認證。
- 使用 `+ / ~ / − / ↔`、文字與線型共同編碼，顏色只是輔助；靜態 PNG/分享圖與 HTML headline counts 必須來自同一個 compare IR。
- 默認不寫 repository URL、絕對路徑或 source path，避免分享卡洩露本地/私倉信息。

## 必須失敗或明確降級的情況

| 情況 | 行為 |
| --- | --- |
| 任一輸入 JSON/schema/diagram validation 失敗 | non-zero；side-specific repair receipt；不寫 artifact |
| diagram type 或 schema version 不同 | `delta/type-mismatch` 或 `delta/schema-version-mismatch` |
| 零 shared component ID | `delta/no-shared-component-id` |
| 雙方 repository URL 不同 | `delta/repository-mismatch` |
| 只有一側 repository evidence | 允許，但 `proofLevel: authored`，並記錄 provenance change |
| connection 缺 ID、重複 ID、dangling endpoint | fail-closed；不按端點或 label 猜 |
| boundary `(kind,label)` 在任一側重複 | `delta/boundary-key-ambiguous` |
| 同 connection ID 改端點 | 允許，分類為 topology；舊/新兩條都畫 |
| node ID 改名、label 相同 | removed + added；不推斷 rename |
| removed 與 added 同位置 | 保持重疊事實，用雙描邊/符號和 receipt 區分 |
| 只有 geometry / presentation change | 成功，但 headline architecture counts 為零，次級欄說明 layout/presentation change |
| compare 過程內部只獲得部分結果 | 失敗；首版本地純比較沒有可接受的 `partial success` |
| artifact checker 或 atomic commit 失敗 | non-zero；舊輸出保持字節不變 |

## 不複製什麼

1. **Agents365 的 `--by-label`**：重複 label 會摺疊，rename/同名組件會被錯配。Archify 寧可給出修復提示，也不猜身份。
2. **Graphviz 全圖重排 diff**：它適合扁平摘要，但會讓未變節點位移、刪除位置丟失，破壞 reviewer 的空間記憶。
3. **扁平化容器、丟邊標籤和換統一矩形**：region/security-group、機制標籤和 semantic sigil 是 Archify 的事實，不是裝飾。
4. **缺渲染器時仍發布「proof」**：文件清單可作普通 CI 信息，但 Architecture Delta artifact 必須完整校驗後才成功。
5. **GitNexus 風險分數和 blast-radius 文案**：沒有代碼圖與執行流證據時，這些都是過度聲明。
6. **GitDiagram 的 LLM 修復循環與託管狀態**：Delta 不需要模型、provider、quota、SSE、R2、Redis 或私倉 token。
7. **EMF Compare 的 proximity/content matcher 與三方 merge UI**：首版只做 two-snapshot exact-ID review，不做衝突解決、merge 或相似度配對。
8. **GitHub bot / sticky comment / Action**：它們是未來消費者，不應進入 core comparator；先把離線 HTML 與機器回執做對。
9. **新的移動端產品、全屏 dashboard 或第二套 viewer**：繼續沿用現有桌面畫布和 contained fallback，只新增一個緊湊的 Before / Delta / After 控制與狀態 legend。

## 最小用戶可見實現建議

第一版只交付一個窄而完整的垂直切片：

1. 新增零依賴 `archify compare architecture base.json head.json output.html --json [--repo-root path]`。
2. 復用現有 architecture loader、schema、engineering profile、renderer、artifact checker、atomic delivery 和 share-card pipeline。
3. 新增純 `compareArchitecture(base, head)`，輸出凍結的 versioned compare IR；renderer 只消費 IR，不在 DOM 中重新推斷差異。
4. HTML 默認 Delta，頂部現有控制區內放一個緊湊三段切換 `Before | Delta | After` 和 `Δ +A ~C −R`；不增加側欄。
5. Delta 以 head 為主層，overlay base removed/moved geometry；所有狀態有文本/符號/線型，不依賴色。
6. Finder 可顯示已有節點，首版不新增 status filter；Story/Focus/Reach/Route 只在當前 Before 或 After 完整狀態工作，Delta overlay 不製造新的可導航語義節點。
7. canonical export、print 與 Share Card 固定到完整、靜態的 Delta 狀態；運行時選擇和動畫狀態不進入 hash。
8. Skill 必須先問用戶選擇 base/head，並說明 relationship ID 是比較前置；不把 compare 設為普通 architecture 生成的默認能力。

這個切片已經足夠形成對外價值：用戶可以把一份真正自包含、可審計的架構變更圖放進 PR、issue 或設計評審，而 Archify 仍保持離線、穩定、零依賴和不過度聲明。

## 驗收門

### 合同與確定性

1. same inputs 連續運行三次，HTML、canonical compare IR、semantic hashes、summary、changes 順序和 artifact SHA-256 字節完全一致；receipt 不含時間、絕對路徑或隨機值。
2. 只改變 JSON 空白、object key 順序、components/connections 順序、`wraps`/`sources` set 順序，raw hash 可變，但 semantic hash、delta summary 與 HTML 不變。
3. 所有 failure table 場景都有精確穩定 code、side、path/subject、evidence 和 supportedFixes；失敗不覆蓋已有 target，也不殘留 candidate。

### 身份與語義

4. node rename fixture 必須輸出 one removed + one added；同 label 不得配對。duplicate label fixture 結果相同。
5. missing relationship ID 必須失敗；parallel relationships 用獨立 ID 正確比較；同 ID 改端點同時顯示舊/新關係並只計一個 changed relationship。
6. semantic、evidence、scope、geometry、presentation fixtures 各自只進入正確 bucket；pure move/reroute 不增加 architecture changed count。
7. repository same/different/one-sided/absent 四組 fixture 分別得到正確 proofLevel 或 failure；沒有任何 fixture出現風險或 mergeability 文案。

### 幾何與視覺

8. removed node、removed edge、moved shared node、端點變化關係、同位置 remove+add、跨 region/security-group 六組 fixture 保留準確 base/head 坐標；Delta 不執行聯合 auto-layout。
9. Blueprint / Signal Flow / Classic 三 preset，深淺主題各做 1280×720 桌面截圖；`+ ~ − ↔`、文字、虛線/雙描邊都清楚，標籤無新碰撞，phantom 不遮住 head 主層。
10. Before / Delta / After 滑鼠和鍵盤切換即時穩定；Still、reduced motion、print、embed 與普通模式語義等價；控制不進入 print/embed。
11. Share Card 的 counts、proof label、短 revision 與 compare receipt 完全一致；零變化顯示 `No authored architecture changes`，不顯示安全結論。

### 回歸與發布

12. 沒有調用 compare 的普通 architecture artifacts 保持 golden byte-compatible；五種現有 diagram type、Viewer、Finder、Focus、Reach、Route、Story、Share Card 不回歸。
13. 全量 `npm test`、WebM/Share Card smoke、gallery/guide/package freshness、ZIP installed smoke（Ubuntu/macOS/Windows）、`unzip -tq`、README mirror 與 `git diff --check` 全綠。
14. 用真實項目兩份 architecture snapshot 生成一次成品，在內置瀏覽器驗證 Before / Delta / After、主題、三 preset、Share Card、console zero error/warning；最多兩輪聚焦修正，並把失敗→修復→通過回執寫進 acceptance record。

## 推薦順序

先實現 compare IR、身份診斷和確定性回執；再做聯合幾何；最後接三態 viewer 與 Share Card。不要先畫一張好看的紅綠圖再倒推合同——那會把最難修的身份與刪除幾何問題固化到 UI 中。
