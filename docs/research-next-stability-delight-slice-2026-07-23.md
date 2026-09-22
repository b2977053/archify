# Archify 下一輪穩定與驚喜切片：Deployment Ownership Contract

研究日期：2026-07-23（Asia/Shanghai）

Archify 已提交基線：[`codex/cursor-onboarding@a73047b`](https://github.com/tt-a1i/archify/tree/a73047b27e3b423fc8ab6ebd1ac84fd4ecb2e782)

上遊固定快照：Fireworks [`50c819d`](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/tree/50c819d68fd4fee330b3010988cd13e98b678d44)、GitDiagram [`041d2fe`](https://github.com/ahmedkhaleel2004/gitdiagram/tree/041d2feb4a9b1593dcf3bde2ca5b9ae7659becb9)、GitNexus [`cdbdf21`](https://github.com/abhigyanpatwari/GitNexus/tree/cdbdf219dce797e51cdeb8cfa386e77ab2d35628)、Agents365 drawio-skill [`6f33563`](https://github.com/Agents365-ai/drawio-skill/tree/6f33563adce24450003d1cb61111ebbcc5579f28)。

> 本文只把上述已提交版本作為 Archify 事實基線。研究期間工作區有其他任務並發修改，因此未提交內容不作為「已經具備」的證據。

## 結論

下一刀推薦只做一個產品能力：**Architecture 內可選、選擇後 fail-closed 的 `deployment-ownership` 工程語義合同**。

```json
{
  "meta": {
    "engineering_profile": "deployment-ownership"
  }
}
```

它不增加第六種圖、不增加第四套風格、不增加 Viewer 面板，也不引入雲廠商圖標。它把 Archify 已經能畫、但目前只能靠作者自覺填寫的四類事實變成可執行合同：

1. 運行組件的負責人；
2. Region 與私有網絡歸屬；
3. 有狀態組件是否處於私有範圍；
4. 穿越 Region / 私有網絡的關係是否命名了真實機制。

這比繼續加動畫更「穩定優先」，又比純 CI 工作更容易讓用戶一眼看見價值：一張合格的部署圖會天然出現 owner tags、區域邊界、私有範圍與具名 crossing，不再只是好看的通用拓撲。

**壓力測試後的排序：**

1. **現在：Deployment Ownership Contract**，同時把無依賴安裝 smoke 擴到 Ubuntu / macOS / Windows 作為發行門。
2. **下一階段：Architecture Delta / PR Proof**；它很有增長潛力，但 before/after 幾何、刪除節點、缺失穩定 ID 與導出合同尚需獨立設計。
3. **以後再評估：Story-specific motion / GIF**；當前 Archify 已有有限 motion、Guided Story、WebM 與 README GIF，不應先擴第二套媒體系統。

## 1. Archify 真實基線：視覺證明已經有，語義合同還沒有

Archify 當前已經有五種 typed renderer、三套同拓撲 preset、Guided Story、Finder、Focus、Route、Reach、Lens、Share / Route / Reach Card、WebM、revision-pinned source evidence、Atomic Delivery、Last-Good Preview、Structured Repair Receipt，以及 Cursor / Codex / Claude Code / OpenCode 共用的一個 Skill。當前 [README](https://github.com/tt-a1i/archify/blob/a73047b27e3b423fc8ab6ebd1ac84fd4ecb2e782/README.md#L11-L24) 和 [PRODUCT](https://github.com/tt-a1i/archify/blob/a73047b27e3b423fc8ab6ebd1ac84fd4ecb2e782/PRODUCT.md#L13-L37) 已把產品邊界寫得很清楚：交互必須來自 authored / verified evidence，默認交付仍是自包含文件。

更關鍵的是，Proof Lab 已經有一張很強的 `Production Deployment Ownership` 成品：

- 組件已有 `tag`，能展示 `platform`、`app team`、`data team`、`SRE` 等歸屬；
- `region` 與 `security-group` 已表達區域和私有網絡；
- cards 已經總結 runtime ownership、named crossings 與 operational evidence；
- Guided Views 已能講 request boundary、state ownership 與 async operations。

這些事實可在當前 [production-deployment fixture](https://github.com/tt-a1i/archify/blob/a73047b27e3b423fc8ab6ebd1ac84fd4ecb2e782/archify/examples/production-deployment.architecture.json#L1-L69) 中直接看到。

但 committed schema 仍把它們當普通可選內容：

- `meta` 沒有工程 profile；
- `components[].tag` 是可選 string，空字符串也能過 schema；
- `boundaries` 只定義 `region` / `security-group` 與 `wraps`，沒有成員歸屬合同；
- `connections[].label` 可選，因此跨邊界關係可以不命名。

見當前 [Architecture schema](https://github.com/tt-a1i/archify/blob/a73047b27e3b423fc8ab6ebd1ac84fd4ecb2e782/archify/schemas/architecture.schema.json#L8-L151)。所以當前狀態是：**Archify 有一張部署歸屬樣例，但沒有能力保證下一張部署歸屬圖仍然回答了同樣的問題。** 這是本切片要關閉的真實缺口。

## 2. 四個一手同類項目：值得吸收、已經具備、不要複製

### 2.1 Fireworks Tech Graph：真正領先的是工程 profile，不是「12 套皮膚」

Fireworks 的公開首頁同時展示 12 個 style、14 類 UML 映射、offline HTML 與 GIF motion；但它更值得借鑑的部分是：v1.1.0 把 C4、cloud deployment、event transit、ops review 各自做成了不同的 semantic contract，而不是只給通用圖換顏色。[v1.1.0 release](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/releases/tag/v1.1.0) 明確列出 deployment ownership、event rails、Golden Signals、critical paths 等被驗證的事實。

Cloud Fabric 的一手合同尤其直接：

- 至少一個 Region boundary；
- 每個節點有 deployment membership；
- 每個跨 deployment edge 必須有非空 mechanism；
- boundary parent 必須無環、節點必須留在 assigned deployment 內；
- 缺少部署證據時退回 generic architecture，不能編造歸屬。

見 [Cloud Fabric required contract](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/blob/50c819d68fd4fee330b3010988cd13e98b678d44/references/style-10-cloud-fabric.md#L31-L54) 與 [composition / fallback rules](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/blob/50c819d68fd4fee330b3010988cd13e98b678d44/references/style-10-cloud-fabric.md#L56-L84)。它還用真實反例測試 unknown icons、boundary cycles、boundary gap 與 duplicate IDs，並要求四個工程 profile 在 showcase 下得到 100-point composition report。[semantic contract tests](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/blob/50c819d68fd4fee330b3010988cd13e98b678d44/tests/test_semantic_contracts.py#L61-L101) · [render contract tests](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/blob/50c819d68fd4fee330b3010988cd13e98b678d44/tests/test_semantic_contracts.py#L168-L195)

**值得吸收**

- 風格與工程事實分離：profile 選擇的是「這張圖必須回答什麼」，不是「看起來像什麼」。
- profile 默認不啟用；一旦顯式啟用，缺失事實 hard fail。
- 先做一個經過真實場景證明的 profile，不同時鋪開 C4 / Event / Ops 三個合同。

**Archify 已經具備**

- versioned typed IR、確定性 geometry/composition gates、兩輪有界 visual review、offline HTML、靜態輸出、有限 motion 與 motion readback。
- 三套 preset 共用 geometry；沒有必要靠 style 數量追趕。

**不要複製**

- 12 styles、14 UML mappings、vendor icon manifest 與 per-style motion schedule。
- GIF 的 FFmpeg / Chromium / Puppeteer 依賴進入 zero-install core。Fireworks 自己也把 GIF 標為可選依賴；靜態路徑可獨立工作。[v1.2.0 release](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/releases/tag/v1.2.0)
- GitHub stable `1.2.0` 與 npm legacy `1.0.4` 的發行漂移；Archify 的 ZIP、文檔與實現必須由同一 gate 鎖定。

### 2.2 GitDiagram：把一眼入口和真實路徑校驗學過來，不把 SaaS 搬過來

GitDiagram 的一句話入口仍然極強：把 GitHub URL 中的 `hub` 換成 `diagram`。它也把 interactive source links、streaming generation、private repositories 與 PNG / Mermaid export 放在 README 第一屏。[GitDiagram README](https://github.com/ahmedkhaleel2004/gitdiagram/blob/041d2feb4a9b1593dcf3bde2ca5b9ae7659becb9/README.md#L6-L21)

更重要的是，其生成鏈並不把模型輸出直接當成圖：先限制 repository tree，模型輸出 size-bounded graph AST，再校驗 identifier、connectivity、limits 與每個真實 repository path，失敗只給 focused feedback；之後才 deterministic compile、sanitize、persist。[How generation works](https://github.com/ahmedkhaleel2004/gitdiagram/blob/041d2feb4a9b1593dcf3bde2ca5b9ae7659becb9/README.md#L49-L59)

**值得吸收**

- 入口必須容易記；Archify 當前 artifact footer → Start 頁已經承擔這件事，不需要新服務。
- profile 失敗必須指出準確組件 / boundary / connection 與受支持修復，而不是泛化為「部署圖不完整」。
- 1200×630 social card 是有效增長面；Archify 已經具備並應讓新 proof 直接受益。GitDiagram 自身也用固定 1200×630 Open Graph card contract。[social image source](https://github.com/ahmedkhaleel2004/gitdiagram/blob/041d2feb4a9b1593dcf3bde2ca5b9ae7659becb9/src/server/og/cards.tsx#L5-L15)

**Archify 已經具備**

- revision-pinned source evidence、真實 repository case、bounded correction、結構化 repair receipt、Share Card 與 artifact-to-install 轉化入口。

**不要複製**

- Vercel、R2、Upstash Redis、quota、PostHog、private token 與 hosted persistence。GitDiagram 的 README 明確這些是它的生產架構。[production architecture](https://github.com/ahmedkhaleel2004/gitdiagram/blob/041d2feb4a9b1593dcf3bde2ca5b9ae7659becb9/README.md#L23-L47)
- Mermaid 作為 Archify 的 canonical IR 或通用 auto-layout；兩者產品邊界不同。

### 2.3 GitNexus：只有做過真實 code indexing，才能說 impact / blast radius

GitNexus 的核心並不是「圖更炫」，而是先索引代碼，再預計算 dependency、call chain、cluster 與 execution flow。它公開提供 `impact`、`trace`、`detect_changes`、route map、shape check 等工具，並把 blast radius 與 confidence 建立在 knowledge graph 上。[GitNexus README](https://github.com/abhigyanpatwari/GitNexus/blob/cdbdf219dce797e51cdeb8cfa386e77ab2d35628/README.md#L97-L158)

這反而強化 Archify 的邊界：Authored Reach 可以叫 authored reachability，不能借一個 deployment profile 偷換成 runtime impact、availability、failover correctness 或 blast radius。profile 只能驗證 JSON 是否完整、自洽，不能證明雲上真的這樣部署。

GitNexus 另一個值得直接學習的地方是測試分層：完整套件留在 Ubuntu，Windows / macOS 只跑 platform-sensitive subset，覆蓋 path separator、CRLF、filesystem、real CLI spawn、native loading；CI 再單列 packaged-install smoke。[GitNexus cross-platform testing](https://github.com/abhigyanpatwari/GitNexus/blob/cdbdf219dce797e51cdeb8cfa386e77ab2d35628/TESTING.md#L83-L120)

**值得吸收**

- 只在證據邊界允許時使用強詞；profile receipt 不得聲稱 verified deployment。
- Ubuntu 跑全量，macOS / Windows 跑小而真實的無依賴 package smoke。

**Archify 已經具備**

- 作者關係上的 Route / Reach，以及明確「不叫 impact」的產品約束。
- 本地單文件交付，不需要資料庫才能讀圖。

**不要複製**

- knowledge graph、native database、MCP server、embedding、cross-repo contract registry 與 Web UI bridge。
- GitNexus 採用 PolyForm Noncommercial；這裡只學習產品與測試模式，不搬代碼進入 MIT Archify。

### 2.4 Agents365 drawio-skill：Architecture Delta 很強，但不應擠進本輪

drawio-skill 目前的強項已經不只是畫圖：它有 code / IaC / SQL import、Graphviz auto-layout、`.drawio` validator、self-check、visual review、diagram diff、PR diff、architecture time-lapse、interactive HTML 與 animated flow SVG。[official README feature map](https://github.com/Agents365-ai/drawio-skill/blob/6f33563adce24450003d1cb61111ebbcc5579f28/README.md#L153-L266)

其中最值得 Archify 後續研究的是：

- `drawiodiff.py` 把 added / removed / changed 做成一眼可見的 architecture drift；
- `prdiff.py` 為 PR 生成 base / head / diff PNG 與 Markdown report；
- `relabel.py` / `restyle.py` 保持 layout、styles、IDs 不動。

這些能力和 Archify 的 typed stable IDs、Share Card、revision evidence 很匹配，**Architecture Delta 是清晰的 P1**。

但它不適合作為當前最小切片：兩份 IR 的 viewBox 與位置可能不同；removed node 在 after geometry 中沒有位置；connection 可能沒有 authored ID；changed 要區分語義、文案、位置與視覺 preset；canonical export、Share Card、guided state 與 deep link 都要定義新語義。若只做一個顏色 overlay，會把一個真正的 change-review 產品縮水成「diff 配色」。

**值得吸收**

- 把 Architecture Delta 作為獨立 RFC：先定義可比性、stable ID、geometry ownership 與 machine receipt，再接 PR Card。

**Archify 已經具備**

- layout-preserving presets、typed identity、Chapter Delta（同一 artifact 內的 authored view 對比）、Share Cards、self-contained viewer 與兩輪視覺覆核。

**不要複製**

- `.drawio` XML、draw.io desktop、Graphviz、10,000+ icon catalogue、37 個鬆散腳本與 general-purpose editor surface。
- 僅為「動起來」複製 looping marching ants。Archify 的 motion 必須有限、由讀者控制、靜態含義完整。

## 3. 決策矩陣

| 候選 | 用戶第一眼價值 | 穩定風險 | 是否復用現有能力 | 決策 |
|---|---:|---:|---:|---|
| **Deployment Ownership Contract** | 高：owner、Region、private scope、named crossing 都直接進入畫布 | **低到中**：只在顯式 profile 下新增確定性語義 gate | **高**：復用 Architecture、tag、boundaries、labels、receipt、現有 proof | **現在做** |
| Cross-platform package smoke | 不直接改變成品，但明顯降低發布風險 | 低 | 高：復用 ZIP、doctor、五 mode validate | **作為本切片發行門，不包裝成產品特性** |
| Architecture Delta / PR Proof | 很高：變更評審與社交卡都強 | 中到高：兩份幾何與 removed identity 合同尚未建立 | 中 | 下一獨立切片 |
| Story-specific WebM / GIF | 高，但當前已經有 Story、WebM 與 README GIF | 中到高：媒體兼容、幀語義、包體與第二 encoder | 中 | 推遲 |
| 第四 preset / 更多 UML / vendor icons | 高展示寬度，低核心差異化 | 高：回歸矩陣與授權面擴大 | 低 | 不做 |
| Structural-scope / 更多 Viewer 控制項 | 中；已有 Guide、Radar、Lens、Route、Reach、Story | 中：交互 ownership 更擁擠 | 低 | 不做 |

## 4. 推薦切片的嚴格合同

### 4.1 觸發與兼容

1. 只給 Architecture `meta` 增加一個可選枚舉：`engineering_profile: "deployment-ownership"`。
2. 沒有該欄位時，schema、renderer、HTML、SVG、exports 與 receipt 保持既有語義；未命中 profile 的 golden artifacts 必須 byte-stable。
3. 其他四種 diagram type 不接受該欄位，不能靜默忽略。
4. 顯式選擇 profile 後，下列語義缺失均為 hard error，不因 `standard` / `showcase` 降級成 warning。`quality_profile` 管 composition，`engineering_profile` 管事實完整性，兩者不可混用。

### 4.2 只復用現有欄位

不要新增 `owner`、`deployment_id`、`network_id`、`mechanism` 或 vendor icon 欄位。本輪只解釋現有欄位：

| 事實 | 現有欄位 |
|---|---|
| Owner | `components[].tag` |
| Region | `boundaries[kind="region"].wraps` |
| Private scope | `boundaries[kind="security-group"].wraps` |
| Stateful component | `components[].type === "database"` |
| Boundary mechanism | `connections[].label` |

這樣 profile 是對現有視覺語言的「truth floor」，不是第二套 Architecture schema。

### 4.3 確定性規則

1. 至少一個 `region` 和至少一個 `security-group` boundary。
2. 每個非 `external` component 必須有 trim 後非空的 `tag`，且必須恰好屬於一個 Region。外部參與者可以在 Region 外；profile 不強迫用戶給客戶或第三方系統偽造內部 owner。
3. 每個 `security-group` 的所有成員必須屬於同一個 Region。若一個 private scope 橫跨 Region，必須拆成兩個 boundary；不能靠同名 label 暗示共享。
4. 每個 `database` component 必須至少屬於一個 `security-group`，並因規則 2 同時屬於恰好一個 Region。該規則只證明「作者明確把 state 放進 private scope」，不證明 encryption、HA、backup 或 failover。
5. 為每個 component 構造確定性的 boundary membership set，成員以 boundary collection index 標識，label 只用於診斷。若 connection 的 source / target membership sets 在任一 Region 或 security-group 上不同，它就是 crossing。
6. 每個 crossing 的 `label.trim()` 必須非空；該文本承擔協議或機制，例如 `HTTPS`、`mTLS`、`inter-region WAL`、`peering`。validator 不猜 label 內容是否真實，只拒絕「無名穿越」。
7. same-membership relationship、自環、完全位於一個 private scope 內的關係不因本 profile 強制 label；普通 Architecture 仍保留原兼容語義。
8. 重複、未知 component ID 繼續由現有 schema/layout identity gate 處理；profile validator 不寫第二套 endpoint resolver。

### 4.4 診斷與 receipt

建議穩定規則代碼：

- `architecture/deployment-owner-required`
- `architecture/deployment-region-required`
- `architecture/deployment-region-membership`
- `architecture/deployment-private-scope-required`
- `architecture/deployment-private-region-conflict`
- `architecture/deployment-crossing-mechanism-required`

每條 diagnostic 必須包含 collection index、可用的 stable ID、boundary kind / label、實際 membership，以及只支持當前 schema 的修復，例如 `components[].tag`、`boundaries[].wraps`、`connections[].label`。不得建議新欄位或自動移動節點。

成功的 `validate --json` / `deliver --json` receipt 可以增加 `engineeringProfile: "deployment-ownership"`；措辭必須是 profile **passed**，不能是 `deploymentVerified`。若同時有 revision-pinned repository evidence，兩份 receipt 並列存在，也不能推斷 repository source 等於 live cloud deployment。

### 4.5 視覺合同

- profile 本身不增加第四 preset、vendor logo、cloud glyph、懸浮面板或裝飾動畫。
- 「一眼可見」來自被強制完整的現有 owner tag、Region/private boundary 與 crossing label。
- 可在 canonical SVG root 增加機器可讀 `data-engineering-profile="deployment-ownership"`，但不要為了顯示 profile 另加可能撞標題的 stamp。
- Classic、Signal Flow、Blueprint 與 dark/light 必須共享相同語義與 geometry；profile 不參與坐標計算。
- Focus、Route、Reach、Lens、Story 與 Share Cards 直接繼承同一 authored graph，不增加 profile-specific viewer state。

## 5. 最小但不縮水的實現面

必須包含：

1. Architecture schema 的可選 profile enum 與預編譯 validator 更新；
2. 一個純確定性 Architecture semantic validator，復用現有 Structured Repair Receipt；
3. 當前 production-deployment source 升級為正向 fixture，並補精確反例；
4. `validate` / `deliver` receipt 公開 profile passed 狀態；
5. SKILL、schema reference、README/CHANGELOG/ROADMAP 的窄說明；
6. 重建 `archify.zip`，並讓同一 package smoke 在 Ubuntu / macOS / Windows 跑最小靜態子集；
7. 內置瀏覽器對真實 deployment proof 做桌面驗收。

明確不做：

- 新 diagram type、renderer、layout algorithm、auto-fix、owner inference、cloud discovery 或 IaC parser；
- vendor icons、C4 multi-page、編輯器、GitHub App、hosted sharing、telemetry、storage；
- impact / availability / DR correctness / blast-radius 聲明；
- GIF encoder、第二套 motion runtime或移動端產品；
- 順手實現 Event Transit、Ops Pulse 或 Architecture Delta。

## 6. 六條可驗證驗收門禁

1. **兼容門：** profile-less Architecture 與其餘四個 mode 的 representative golden output 在實現前後 byte-identical；所有現有 schemas、render/check/deliver 與 deep-link/export tests 繼續通過。
2. **正向門：** production-deployment fixture 顯式選擇 profile，`validate --json` 與 `deliver --json` 通過；receipt 精確報告 `engineeringProfile`，相同輸入重複運行的 HTML SHA-256 相同，三 preset 的 canonical relationship geometry 相同。
3. **反向門：** mutation matrix 分別刪除 owner tag、region、security-group、database private membership、製造 multi-region membership、刪除每一種 crossing label；每個 case 非零退出，只返回對應穩定 diagnostic、精確 subject/evidence/supported fixes，且 Atomic Delivery 保留舊成品 SHA-256。
4. **邊界數學門：** outside→Region、Region→Region、public→private、private→public 必須識別為 crossing；same Region/same private、自環與同 membership 的邊不誤報；security-group 跨 Region 必須 fail closed。測試不依賴 boundary label 唯一或 DOM 幾何位置。
5. **載體與瀏覽器門：** 在 1280×720 內置瀏覽器中檢查 Classic / Signal Flow / Blueprint、dark/light、Presentation、Finder、Focus、Route、Reach 與一個 Guided Story；owner、Region/private、state、crossing labels 第一眼可讀，console warning/error 為 0。PNG、dual-theme SVG、WebM、Share / Route / Reach Card 保持非空、無 viewer residue；不開展移動端專項。
6. **發行門：** Ubuntu 跑全量 `npm test` 與 WebM/Chrome/FFmpeg smoke；Ubuntu / macOS / Windows 從 committed ZIP 解壓後，不安裝 dependencies，運行 `doctor`、五 mode `validate` 與一個 deployment profile render/check。ZIP freshness、README EN mirror、`git diff --check` 全綠。

## 7. 為什麼 Architecture Delta 不是現在

Architecture Delta 是本輪研究中唯一比「再做一個 viewer 小功能」更強的後續候選。drawio-skill 已經證明 diff / PR report / time-lapse 很有傳播力；GitNexus 的 `detect_changes` 也證明開發者願意圍繞變化而不是靜態全景工作。

但 Archify 必須先回答這些問題，才能不縮水：

1. 兩份 IR 的 diagram type、schema version、repository revision 與 quality profile 怎樣判定可比？
2. 沒有 authored relationship ID 時，是 fail closed，還是允許 collection index？
3. removed node 用 before 坐標還是在 after 畫布中保留 ghost slot？
4. 節點只移動、只改文案、改 kind、改 source evidence，分別屬於 semantic change 還是 layout change？
5. canonical output 是 after graph + overlay、side-by-side，還是獨立 Delta Card？
6. Route / Reach / Story / Share Card 在 diff state 下讀取哪一個 graph？

這些不是實現細節，而是產品真相。現在倉促做會得到一個好看的紅綠 overlay，卻不能成為可信 PR Proof。Deployment Ownership Contract 則已經有現成 fixture、欄位、視覺語言、repair protocol 與完整導出面，能用更小風險把「樣例自律」升級成「產品保證」。

## 8. 推薦實施順序

1. 落地 `deployment-ownership` profile 與六條門禁；先在現有 production deployment proof 中證明。
2. 合併後觀察真實 Agent 是否能一次填全 owner / membership / mechanism；若失敗，改 Start recipe 與 diagnostics，不放鬆合同。
3. 單獨寫 Architecture Delta RFC，先凍結 comparison receipt 和 geometry ownership，再實現 PR Card。
4. 只有當現有 WebM / README GIF 的傳播數據證明格式受限時，再評估可選 GIF；不改變 zero-install static core。

## 一手來源

- Archify committed baseline：[repository](https://github.com/tt-a1i/archify/tree/a73047b27e3b423fc8ab6ebd1ac84fd4ecb2e782)、[README](https://github.com/tt-a1i/archify/blob/a73047b27e3b423fc8ab6ebd1ac84fd4ecb2e782/README.md)、[Architecture schema](https://github.com/tt-a1i/archify/blob/a73047b27e3b423fc8ab6ebd1ac84fd4ecb2e782/archify/schemas/architecture.schema.json)、[deployment proof source](https://github.com/tt-a1i/archify/blob/a73047b27e3b423fc8ab6ebd1ac84fd4ecb2e782/archify/examples/production-deployment.architecture.json)
- Fireworks Tech Graph：[README](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/blob/50c819d68fd4fee330b3010988cd13e98b678d44/README.md)、[Cloud Fabric contract](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/blob/50c819d68fd4fee330b3010988cd13e98b678d44/references/style-10-cloud-fabric.md)、[semantic tests](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/blob/50c819d68fd4fee330b3010988cd13e98b678d44/tests/test_semantic_contracts.py)、[v1.1.0](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/releases/tag/v1.1.0)、[v1.2.0](https://github.com/yizhiyanhua-ai/fireworks-tech-graph/releases/tag/v1.2.0)
- GitDiagram：[README](https://github.com/ahmedkhaleel2004/gitdiagram/blob/041d2feb4a9b1593dcf3bde2ca5b9ae7659becb9/README.md)、[social card source](https://github.com/ahmedkhaleel2004/gitdiagram/blob/041d2feb4a9b1593dcf3bde2ca5b9ae7659becb9/src/server/og/cards.tsx)
- GitNexus：[README](https://github.com/abhigyanpatwari/GitNexus/blob/cdbdf219dce797e51cdeb8cfa386e77ab2d35628/README.md)、[TESTING](https://github.com/abhigyanpatwari/GitNexus/blob/cdbdf219dce797e51cdeb8cfa386e77ab2d35628/TESTING.md)
- Agents365 drawio-skill：[README](https://github.com/Agents365-ai/drawio-skill/blob/6f33563adce24450003d1cb61111ebbcc5579f28/README.md)、[v1.34.0](https://github.com/Agents365-ai/drawio-skill/releases/tag/v1.34.0)
