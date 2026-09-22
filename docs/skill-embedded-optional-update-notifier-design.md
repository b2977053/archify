# Skill 內置可選更新提醒器：技術設計提案

> 狀態：Implementation draft / Issue #167 / 待評審
> 提案版本：v0.1
> 日期：2026-08-28
> 面向對象：Skill 維護者、Agent 集成開發者、安全與發布工程師

## 1. 摘要

本提案設計一個嵌入 Skill 發布包的跨 Agent 更新提醒器。它在用戶再次使用 Skill 時低頻檢查遠端發布信息，僅在發現新版本時顯示非阻斷提醒；提醒成功確認後不再展示同一候選。是否查看變更、何時更新以及是否繼續使用舊版本，均由用戶決定。

v0.1 的唯一職責是：

> 發現候選版本並讓用戶感知，不下載、不安裝、不執行遠端命令、不覆蓋 Skill 文件。

該方案用於補足 Codex、Claude Code、Cursor、OpenCode 等宿主中「獨立 Skill 已安裝，但用戶長期不主動檢查更新」的場景。它不是自動更新器，也不替代宿主 Plugin/Extension、`gh skill` 或其他安裝管理器。

相關市場調研見：[AI Agent Skills 頻繁更新提醒：市場機制與統一方案](research/skill-plugin-update-reminder-market-design.md)。

## 2. 背景與問題

Agent Skills 可以通過 Marketplace、Plugin、跨 Agent CLI、Git 倉庫或直接複製目錄等方式安裝。不同安裝方式的更新能力不一致，尤其是直接安裝的 `SKILL.md` 目錄，通常沒有持續的上遊版本提醒。

對於高關注度、頻繁發布的 Skill，會出現以下問題：

- 用戶長期停留在舊版本，卻沒有主動打開管理頁面或運行更新命令。
- 同一個 Skill 分布在多個 Agent 宿主，維護者難以依賴單一 Marketplace 觸達所有用戶。
- 在 Skill 內直接執行安裝會擴大供應鏈和權限風險。
- 每次激活都聯網或彈出提示，會增加延遲、工具調用和通知疲勞。

本提案以「提醒與更新解耦」為核心：Skill 可以讓用戶知道有新版本，但用戶不作選擇時，已安裝內容和當前任務均保持不變。

## 3. 目標與非目標

### 3.1 目標

- 在支持本地腳本和網絡訪問的 Agent 中提供一致的更新感知。
- 檢查失敗時保持靜默，不阻斷、不降級用戶原任務。
- 同一個候選版本在成功確認展示後不再提醒；正常路徑只展示一次。
- 讓用戶清楚看到當前版本、候選版本、本地固定狀態摘要和官方發布說明。
- 將版本檢查控制在低頻、低流量、可緩存的只讀請求內。
- 保持檢查邏輯確定、可測試，並獨立於模型的版本比較能力。
- 保證提醒事件本身不構成更新授權。

### 3.2 非目標

v0.1 不負責：

- 自動下載、安裝或激活新版本。
- 調用 `gh skill update`、`npx skills update` 或宿主原生更新命令。
- 修改、替換或刪除 Skill 安裝目錄中的任何文件。
- 解決跨 Skill 依賴、版本約束或回滾。
- 統一 Claude、Codex、Gemini、Cursor 等原生 Plugin 的更新狀態。
- 將遠端響應中的文本轉換為可執行命令。
- 向從未安裝過帶提醒器版本的舊用戶主動推送消息。

## 4. 設計原則與安全不變量

### 4.1 用戶決定

提醒器只報告事實和候選版本。用戶忽略提醒、選擇稍後處理或繼續使用舊版本時，不產生任何安裝副作用。

### 4.2 非阻斷

版本檢查不是 Skill 主工作流的前置成功條件。超時、斷網、緩存損壞、遠端格式錯誤和運行時缺失均轉換為靜默結果，隨後繼續原任務。

### 4.3 本地決策

遠端只聲明發布元數據。是否顯示提醒、是否已提醒過、何時再次檢查，均由本地邏輯和本地狀態決定。

### 4.4 不執行遠端輸入

遠端 manifest 不包含 `updateCommand`。提醒器不把遠端字符串傳給 shell、包管理器、腳本解釋器或動態模塊加載器。

### 4.5 只寫緩存

提醒器僅能寫入自己的系統緩存目錄。其實現中不提供寫入 Skill 根目錄、Agent 配置目錄或項目目錄的路徑。

### 4.6 不以版本號作為提醒事件的唯一身份

`version` 用於比較和向用戶解釋；遠端候選的發布 ZIP SHA-256 用於構造提醒 `eventKey`，Git tree SHA 用於發布門禁。摘要只能證明候選內容一致，不能單獨證明發布者可信。本地快照不保存自身 ZIP digest，避免生成自引用摘要。

## 5. 方案範圍

### 5.1 v0.1 支持模式與未來適配器

| 模式 | 觸發方式 | Agent 額外工具調用 | v0.1 狀態 |
|---|---|---:|---|
| Skill 激活調用 | `SKILL.md` 在首個候選產物存在後調用獨立檢查腳本 | 每次激活最多 1 次 | 已實現 |
| CLI/MCP 順帶檢測 | 未來由原本必經的 CLI 或 MCP 調用附帶檢測結果 | 0 | 未實現；需單獨評審 |
| 宿主 Hook 調用 | 未來由 SessionStart 或 Plugin Hook 在會話邊界調用 | 通常為 0 | 未實現；需單獨評審 |

v0.1 只有 Skill 激活調用路徑。CLI/MCP 與 Hook 是可復用同一契約的未來適配點，不是當前 Archify 行為；它們不得在未經獨立設計、測試和用戶可見性評審時接入正常 CLI 輸出。緩存只減少網絡請求，不能消除當前純 `SKILL.md` 模式下的 Agent 工具調用。對短小、純提示詞型 Skill，評審時需要確認該額外調用是否值得。

### 5.2 運行時基線

MVP 建議使用無第三方依賴的 Node.js ESM 腳本，並聲明 Node.js 18+ 兼容要求。Node.js 不可用時返回靜默結果。若目標用戶中缺少 Node.js 的比例不可接受，再評估單文件二進位或宿主專用實現。

## 6. 組件與目錄

建議發布包包含：

```text
archify/
├── SKILL.md
├── skill-release.json
└── scripts/
    ├── check-update.mjs
    └── update-contract.mjs
```

外部組件：

```text
https://tt-a1i.github.io/archify/skill-updates/archify/stable.json
<system-cache-dir>/archify-skill/version-<version-sha256-prefix>/committed-<generation>/state.json
```

職責劃分：

- `SKILL.md`：定義何時調用檢查器，以及不同狀態對應的 Agent 行為。
- `skill-release.json`：隨當前安裝版本發布的本地身份快照。
- `update-contract.mjs`：零依賴純模塊，唯一擁有 SemVer、嚴格欄位、UTC 時間、固定來源和發布說明 URL 契約；運行時、發布門禁和最終包煙測共同復用。
- `check-update.mjs`：執行緩存、HTTP、版本比較與提醒去重。
- `stable.json`：維護者發布的最新穩定版元數據。
- `committed-<generation>/state.json`：按已安裝版本分片的完整檢查與提醒快照，不隨 Skill 更新覆蓋；同版本的多個 Agent 共享去重，不同版本互不重置狀態。`reserved`、`pending`、`fenced`、`cancelled`、`active-claim`、未晉升的 `discarded-claim` 與退役 claim 只承擔並發協調，不是可讀狀態。

## 7. 運行流程

```mermaid
flowchart TD
    A[Skill 被激活] --> D[首個候選產物存在後運行 check-update.mjs]
    D --> E
    E --> F{nextCheckAt 尚未到期?}
    F -->|是| G[返回 silent]
    F -->|否| H[無條件 GET stable.json]
    H --> I{請求與校驗成功?}
    I -->|否| J[記錄退避時間並返回 silent]
    I -->|是| K{候選 SemVer 是否嚴格高於安裝版本?}
    K -->|否| L[刷新緩存並返回 silent/current]
    K -->|是| M{候選 digest 是否已確認展示?}
    M -->|是| N[按提醒策略返回 silent]
    M -->|否| O[返回 update_available + eventKey]
    O --> P[Agent 展示提醒]
    P --> Q[確認 eventKey 已展示]
    Q --> R[繼續原始任務]
    G --> R
    J --> R
    L --> R
    N --> R
```

### 7.1 檢查步驟

1. 讀取隨包發布的 `skill-release.json`，確認本地 `skillId`、channel、版本、官方倉庫和固定 manifest URL；完成條件是得到合法的本地身份，或安全地返回 `silent`。
2. 讀取用戶緩存並檢查 `nextCheckAt`；完成條件是直接使用未過期緩存，或進入一次遠端檢查。
3. 使用硬編碼可信 origin 無條件請求 `stable.json`；不持久化或回傳服務端 validator。完成條件是在總超時內獲得 `200` 或靜默失敗結果。
4. 校驗響應大小、JSON schema、`skillId`、channel、來源和必要欄位；完成條件是候選身份可被本地確定地接受或拒絕。
5. 先比較候選與本地版本的 SemVer precedence；只有嚴格更高的穩定版本才是更新。隨後用不可變 digest 構造事件身份並檢查是否已經展示；完成條件是輸出一個機器可判定狀態。同版本或降級候選即使 digest 不同也必須返回 `current`。
6. Agent 只在 `update_available` 時展示提醒，然後確認該 `eventKey` 已展示；完成條件是提醒狀態與實際用戶可見行為一致。
7. Agent 繼續用戶原始任務；完成條件是版本檢查不會取代或縮減原請求。

## 8. 本地發布快照

`skill-release.json` 隨每個版本構建，不由運行時修改：

```json
{
  "schemaVersion": 1,
  "skillId": "archify",
  "channel": "stable",
  "version": "3.1.0",
  "source": {
    "repository": "https://github.com/tt-a1i/archify"
  },
  "updateManifestUrl": "https://tt-a1i.github.io/archify/skill-updates/archify/stable.json"
}
```

本地快照使用嚴格欄位白名單，並由 release identity 門禁保證與 `package.json` 完整版本一致。運行時只接受不超過 4 KiB 的非符號連結普通文件，並通過固定文件句柄執行有界讀取；路逕到句柄綁定期間發現替換即拒絕，綁定完成後只從該固定 inode 讀取。FIFO、設備文件、符號連結和超限內容都按無效安裝靜默處理，不會阻塞 Skill 主流程。候選的 tree/archive digest 只存在於外部穩定版 manifest：把當前 ZIP 的 digest 寫進 ZIP 內部會形成無法收斂的自引用。運行時永遠不會用遠端聲明重寫本地身份。

## 9. 遠端發布協議

`stable.json` 示例：

```json
{
  "schemaVersion": 1,
  "skillId": "archify",
  "channel": "stable",
  "version": "3.2.0",
  "publishedAt": "2026-08-28T08:00:00Z",
  "source": {
    "repository": "https://github.com/tt-a1i/archify",
    "ref": "v3.2.0",
    "treeSha": "8f11d3..."
  },
  "artifact": {
    "sha256": "56da..."
  },
  "summary": "改進大型項目掃描與架構圖布局",
  "releaseNotes": "https://github.com/tt-a1i/archify/releases/tag/v3.2.0",
  "severity": "normal"
}
```

### 9.1 欄位約束

| 欄位 | 要求 |
|---|---|
| `schemaVersion` | 必須為檢查器支持的整數版本 |
| `skillId` | 必須與本地快照完全一致 |
| `channel` | v0.1 僅接受 `stable` |
| `version` | 必須是嚴格的穩定 SemVer `MAJOR.MINOR.PATCH`；不接受 prerelease、build metadata 或數字前導零 |
| `publishedAt` | 必須是秒精度、真實日曆日期的 UTC `YYYY-MM-DDTHH:mm:ssZ`；v0.1 以穩定版 annotated tag 的 tagger time 為權威值，運行時不把它用於調度或事件身份 |
| `source.repository` | 必須匹配本地允許的官方倉庫 |
| `source.ref` | 必須精確等於 `v<version>`；只能驗證，不能拼接成 shell 命令 |
| `source.treeSha` | 必須是發布 tag 中 `archify/` 的 40 位小寫 Git tree SHA |
| `artifact.sha256` | 必須是發布 `archify.zip` 的 64 位小寫 SHA-256；用於提醒事件身份 |
| `summary` | 必填純文本，1–160 個字符；v0.1 校驗但不直接輸出遠端文本 |
| `releaseNotes` | 必須逐字節等於 `https://github.com/tt-a1i/archify/releases/tag/v<version>`，不接受顯式埠、大小寫變體、查詢或片段 |
| `severity` | `normal` 或 `security`；兩者都不觸發自動安裝 |

響應體硬上限為 32 KiB，重定向禁用。非成功響應、錯誤媒體類型和聲明超限的響應會先取消未讀 body，再靜默失敗。

## 10. 本地緩存協議

某個完整 `committed-<generation>/state.json` 示例：

```json
{
  "schemaVersion": 1,
  "skillId": "archify",
  "installedVersion": "3.1.0",
  "check": {
    "nextCheckAt": "2026-08-31T08:00:00Z",
    "consecutiveFailures": 0
  },
  "notification": {
    "offeredDigests": [
      "sha256:56da..."
    ],
    "acknowledgedDigests": [
      "sha256:12ab..."
    ]
  },
  "candidate": {
    "version": "3.2.0",
    "targetDigest": "sha256:56da...",
    "severity": "normal",
    "releaseNotes": "https://github.com/tt-a1i/archify/releases/tag/v3.2.0"
  }
}
```

緩存狀態載荷只持久化調度、去重和展示候選所需的最小事實。`eventKey` 始終由 `skillId` 與 `targetDigest` 確定推導；遠端 `publishedAt` 在網絡邊界校驗後不進入緩存。未被行為讀取的觀測時間不成為持久協議欄位。每個 `state.json` 只接受不超過 64 KiB 的非符號連結普通文件，需要解析的 `active-claim/owner.json` 只接受不超過 1 KiB 的非符號連結普通文件；讀取器使用 `O_NOFOLLOW`、`O_NONBLOCK`，並在讀取前完成路徑 → 句柄 → 路徑的身份綁定，隨後最多從固定 inode 讀取「上限 + 1」字節。`pending-*/owner.json` 不解析內容，只要求它是非符號連結普通文件，並把 mtime 當作 lease marker。緩存葉文件還必須位於讀取前後身份不變的真實 `committed`、`pending` 或 `active-claim` 父目錄中；嵌套父目錄替換不能借葉文件檢查繞過。綁定期間發現替換、特殊文件、連結或超限文件時，該記錄被跳過或使本輪緩存失敗關閉；綁定後的路徑改名不改變本次固定句柄讀取，因此惡意 FIFO 不能讓檢查器永久阻塞。

緩存目錄準備也屬於協議邊界。檢查器先把位於用戶主目錄或系統臨時目錄下的受信任前綴解析成真實路徑，再從文件系統根開始逐級 `lstat`；已有組件必須是真實目錄，缺失組件只按單層創建，符號連結和其他文件類型一律拒絕。創建完成後使用 BigInt 設備號/inode（零 inode 且 `birthtimeNs` 可用時回退到 birthtime 與文件模式；兩者都不可用時失敗關閉）重驗全部組件，並把已經驗證的規範路徑和祖先快照作為本次進程的緩存 token。緩存讀取和每次 `mkdir`、獨佔寫入、改名、非遞歸清理都在操作前後復驗同一 token；獨佔寫入固定新建文件句柄，並把句柄的 BigInt inode 與預期字節數綁定到路徑後置檢查，創建或改名也必須驗證原緩存路徑中的預期對象及其類型。operation/claim 狀態轉換隻接受真實目錄，臨時 state 轉換隻接受普通文件；僅損壞 active claim 的退役路徑顯式允許文件或符號連結。發現身份變化、結果缺失或類型錯誤時返回 `silent/cache-unavailable`，不發起後續網絡請求，也不把提醒或確認報告為成功。未成功晉升的預填充 claim 只原子改名為唯一的 `discarded-claim`，不遞歸刪除目錄。

寫入端使用緊湊 JSON，並在提交前執行同一個 64 KiB 硬門禁。除了待提交快照本身必須可讀，還要按順序模擬全部 `offeredDigest` 的確認閉包，驗證每個中間態和最終態均可提交；每個狀態還要為「保留 last-good candidate 的失敗刷新」預留最長 ISO 時間戳所需空間。只有 offered 狀態已經原子持久化、全部後續確認可落盤且失敗退避可提交時，檢查器才允許返回 `update_available`。確認歷史保持精確且不剪枝。極端情況下，若加入新候選會超過容量，檢查器不會展示一個無法確認的提醒，而是保留全部 offered/acknowledged 歷史、撤銷舊 `candidate`、提交失敗退避並返回 `silent/cache-unavailable`；已有 offered 事件仍可晚到確認。

緩存根目錄下面按本地完整版本的 SHA-256 前綴分片。未過期緩存直接讀取最高完整、合法的 `committed` generation，不創建協調記錄。需要寫入時，檢查器先以原子 `mkdir` 創建永久的 `reserved-<generation>` 分配標記，再只寫自己的 `pending-<generation>` 目錄；reservation 從不改名、刪除或復用。generation 只接受最多 20 位十進位文本，分配器從全部合法操作目錄中選擇最小未佔用編號；超長或非規範偽名稱不參與分配，不能借稀疏高水位製造超長文件名並永久阻斷檢查。

v0.1 把協調目錄視為追加式本地 journal：`reserved`、完整 `committed`、`fenced`、`cancelled`、`retired-claim` 和 `discarded-claim` 均保留，避免在並發路徑中引入遞歸清理或 generation 復用。正常完成路徑會轉換 `pending` 和預填充 claim；最後一個成功 writer 的 `active-claim` 會保留到下一位 writer 退役，進程在 claim 晉升前崩潰也可能留下長期 orphan `claim-*`。這些殘留同樣計入 journal 增長。代價是同一版本分片的 inode 數和 `readdir` 成本會隨寫入次數增長。v0.1 不在運行路徑內壓縮 journal；回收依賴作業系統緩存清理、用戶刪除整個版本分片，或後續提供經過身份校驗的整體壓縮協議。升級產生的新版本分片天然與舊 journal 隔離。

generation 只負責提交順序，固定的 `active-claim` 負責網絡請求互斥。候選 writer 先在自己的預填充 claim 目錄寫入 generation 與隨機 token；每輪先檢查固定 claim，只有路徑不存在時才通過原子 rename 晉升，絕不直接覆蓋一個空目錄。晉升成功後還必須確認自己的 pending lease 仍新鮮，並在最終緩存 token 復驗之後、調用 fetch 前再次確認 active generation/token；任何一個可觀測等待點失權都取消而不發請求。即使兩個進程都讀到「沒有 pending」的舊快照，在 lease 有效的協作競態中也只有一個能進入 fetch，失敗者取消自己的 pending。完成者不刪除固定 claim；下一位只在看到對應 terminal generation 或 30 秒硬 lease 過期時，才把它原子移動到按舊實例穩定身份命名的退役目錄。移動前寫入不可覆蓋的 retirement guard；損壞 claim 的 retirement key 不包含會被 guard 合法改變的 ctime，且 rename 仍綁定檢查時的對象身份，因此延遲退休者不能搬走後繼 claim。退役目標必須經 `lstat` 確認為分片內的真實非符號連結目錄；異常目標只會靜默拒絕，絕不沿嵌套連結把 claim 移出緩存分區。退役目標確定且保留，因此落後競爭者不能把新 owner 的 claim 當作舊空目錄移走。舊 owner 也從不觸碰後繼 claim，所以即使 PID 已復用或進程在 lease 後恢復，也只能被更高 generation fencing，不能發布舊狀態。普通文件、符號連結、缺失或錯誤類型的 `owner.json` 等損壞 claim 在 lease 內按 busy 處理，超時後按穩定實例身份退役；重複的相同壞內容不會撞上舊 retirement 路徑而永久阻塞。

提交不是「讀 token 後覆蓋固定文件」。writer 在 mutation 前後驗證自己仍持有同一 active generation/token；更高 generation 接管後，會把所有較低 pending 逐個原子改名為唯一的 `fenced` 目錄，再重新讀取最高 committed 快照、應用本次 mutation、寫完自己的完整 state，最後把自身 pending 原子改名為 committed。尚未取得 claim 的低 generation 在 promote 的每一輪都重新檢查更高 reservation；一旦被超越或看到 active owner 的 generation 更高就必須放棄，不能退役已經完成的高代 claim 並讓 active generation 回退。因此它暫停在 reservation、pending、claim 晉升、晉升後重讀狀態或最終 token 復驗等可觀測窗口時，恢復後不會在高代之後發起第二次 GET，也不能補交一份 reader 會忽略的舊提交。低 generation 若已先提交，高 generation 必然讀到並繼承它；若 fencing 先完成，舊 owner 的原路徑永久消失，後續寫入或提交只能失敗，不能覆蓋新狀態。reader 永遠忽略 reserved、pending、fenced、cancelled、claim、臨時文件和不完整 committed。generation 標記不回退或復用；緩存或協調記錄損壞時回退到上一條合法 committed，不影響 Skill 主流程。

### 10.1 `offered` 與 `acknowledged`

檢查器輸出提醒並不等於用戶已經看見。為了避免 Agent 未展示結果卻把版本永久標記為已提醒，採用兩階段狀態：

1. `check` 返回 `update_available` 和 `eventKey`，把 digest 加入尚待確認的 `offeredDigests`。
2. Agent 展示提醒後執行輕量本地確認，把該事件從 `offeredDigests` 移入 `acknowledgedDigests`。

確認調用只寫緩存，不聯網。它僅在真正出現新候選時增加一次工具調用。
確認按 `eventKey` 中的 digest 匹配已 offered 集合，而不要求它仍是當前候選；因此刷新從 A 切到 B 時，刷新期間已經展示的 A 仍可可靠確認。確認集合在當前安裝版本的緩存分片內持久保留，所以 stable manifest 即使經歷 A → B → A 回退，已確認的 A 也不會再次提醒。

`acknowledgedDigests` 不採用概率結構或有損淘汰；這樣不會因容量治理而重新提醒已經確認的事件。單一安裝版本在積累到 64 KiB 極限後會進入靜默退避，不再接納新提醒，直至該版本分片被替換或清理。這是 v0.1 用「永不返回不可確認提醒」換取精確去重的顯式邊界。

如果評審認為第二次調用成本高於「偶爾漏提醒」的風險，可在 MVP 中合併 offered/acknowledged，但需要把該取捨記錄為已知限制。

## 11. 檢查器輸出協議

檢查器 stdout 只輸出一行 JSON；診斷日誌寫入受控 debug 日誌或 stderr，並且默認關閉。

### 11.1 靜默

```json
{"status":"silent","reason":"cache-valid"}
```

可用 `reason`：

- `cache-valid`
- `current`
- `already-notified`
- `runtime-unavailable`
- `check-failed`
- `invalid-manifest`
- `invalid-local-release`
- `cache-unavailable`
- `check-in-progress`
- `disabled`
- `invalid-clock`
- `invalid-acknowledgement`
- `invalid-arguments`

所有 `silent` 狀態對用戶表現一致，Agent 不輸出「當前已是最新版」或內部錯誤。

### 11.2 有可選更新

```json
{
  "status": "update_available",
  "eventKey": "archify@sha256:56da...",
  "installedVersion": "3.1.0",
  "latestVersion": "3.2.0",
  "targetDigest": "sha256:56da...",
  "severity": "normal",
  "summary": "Archify 3.2.0 is available; see the official release notes for details.",
  "releaseNotes": "https://github.com/tt-a1i/archify/releases/tag/v3.2.0"
}
```

`summary` 由已安裝檢查器根據已校驗版本號生成固定文案，不透傳遠端 `summary`。manifest 仍保留供發布審核使用的簡短摘要，但不能借提醒通道向 Agent 注入動態指令。

### 11.3 展示確認

Agent 只在提醒已經對用戶可見後運行 `--ack "<eventKey>"`。成功 stdout 為：

```json
{"status":"acknowledged","eventKey":"archify@sha256:56da..."}
```

無效、過期或競爭失敗的確認使用上面的 `silent` 協議，不聯網，也不改變安裝內容。

### 11.4 安全更新

安全更新使用相同協議，僅將 `severity` 設為 `security`。它可以使用更醒目的文案，但在 v0.1 中仍由用戶決定是否更新。

## 12. 檢查策略

建議默認值：

| 參數 | 默認值 |
|---|---:|
| 正常檢查 TTL | 72 小時 |
| 隨機 jitter | ±20% |
| HTTP 總超時 | 1000 毫秒 |
| 單次檢查重試 | 0 |
| 響應體上限 | 32 KiB |
| 更新通道 | `stable` |
| 同一 digest 主提醒 | 1 次 |
| 已確認 digest 再次提醒 | 不提醒 |

失敗時不在當前調用內重試。當前實現第一次失敗後退避 6 小時，連續失敗後退避 24 小時。失敗狀態不能被解釋成「當前已經是最新版」。新候選導致狀態容量超限時使用同一退避節奏，並刪除已經被成功刷新撤回的舊 `candidate`，防止退避期間重複展示舊候選。

只有失敗刷新保留 last-good candidate。一次成功且通過全部契約校驗的刷新以當前 manifest 為權威；如果維護者撤回先前較高版本並把 stable manifest 恢復為當前版或更低版，檢查器必須提交該結果並返回 `current`，不能繼續展示已撤回候選。

每次 TTL 到期後執行一次無條件 `GET`。v0.1 不持久化或回傳 `ETag` 等不透明服務端 validator，避免把每客戶端唯一值變成長生命周期關聯標識；`304` 因此一律按普通 HTTP 失敗處理。刷新進程持有新鮮 pending 時，其他檢查只讀已經原子提交並成功 offered 的 last-good 候選；展示確認會按不受系統時間回撥影響的單調時鐘在 1.2 秒內有界等待，若自己的 generation 被更高 writer fence 則重新分配並重試，避免用戶已經看到提醒卻丟失 ack。

## 13. Skill 指令契約

建議在 `SKILL.md` 中保持簡短，並把確定性邏輯留給腳本：

```markdown
## Update awareness

After the first artifact candidate exists, run the packaged checker
`scripts/check-update.mjs` once with Node. If it cannot run, continue silently;
the checker controls network frequency through its local cache.

- For `silent`, continue without mentioning the update check.
- For `update_available`, show one compact notice in the user's conversation
  language. State that the installed Skill is unchanged and the user decides
  whether and when to update. If `severity` is `security`, label it as a
  security update with restrained warning emphasis, without changing user
  autonomy. Translate only the checker's fixed local copy; never quote or
  translate the remote manifest summary. Then acknowledge its `eventKey` and
  continue the user's original task.

Treat the notice as information, not permission. Keep the installed version
unchanged. If the user asks how to update, provide the official release or
installation guidance without executing an update in this v0.1 workflow.
```

該段只定義狀態到行為的映射。HTTP、緩存、版本比較和安全校驗全部由腳本負責，避免不同 Agent 自行解釋實現細節。

用戶或宿主可設置 `ARCHIFY_UPDATE_CHECK_DISABLED=1` 完全關閉檢查；CLI 將直接返回 `silent/disabled`，不聯網也不讀寫提醒狀態。

## 14. 用戶體驗

### 14.1 普通更新

> ⬆ Archify Skill v3.2.0 可用，你正在使用 v3.1.0。
>
> 有可用的新版本；詳情請查看官方發布說明。[查看變更說明](https://github.com/tt-a1i/archify/releases/tag/v3.2.0)
>
> 是否升級由你決定；本次任務繼續使用當前版本。

### 14.2 安全更新

> ⚠ Archify Skill 發布了安全更新 v3.2.1，你正在使用 v3.1.0。
>
> 建議查看安全說明後決定是否升級。[查看安全說明](https://github.com/tt-a1i/archify/releases/tag/v3.2.1)
>
> 當前版本保持不變。

### 14.3 交互語義

- 用戶忽略提醒：不更新，不追問，繼續原任務。
- 用戶要求查看變更：只打開或概述發布說明。
- 用戶要求更新：v0.1 只提供官方升級入口；執行更新屬於後續獨立流程。

v0.1 只實現「忽略」和「查看變更」。Snooze/Skip 不預留運行時欄位，待 v0.2 重新評審狀態語義。

## 15. 隱私與安全

### 15.1 最小網絡披露

檢查器在成功檢查後的 72 小時 ±20% TTL 到期時，才會再次向固定的 `https://tt-a1i.github.io/archify/skill-updates/archify/stable.json` 執行靜態無條件 `GET`；失敗後若 Skill 再次被激活，則在首次 6 小時、後續 24 小時退避到期時允許重試。它不回傳服務端 `ETag`，也不上傳：

- 本地安裝版本。
- Agent 宿主名稱。
- 項目路徑、倉庫名稱或文件內容。
- 顯式的 Skill 使用次數、頻率欄位或用戶輸入。
- 設備標識和帳戶標識。

服務端仍會自然獲得 IP、請求時間和常規 HTTP 元數據；由於檢查在 Skill 使用期間觸發，該請求時間也會洩露「TTL 到期後至少發生過一次使用」的粗粒度活躍信號，應在隱私說明中如實披露。

### 15.2 信任邊界

- 更新 URL 和允許的官方倉庫由本地發布包固定。
- `releaseNotes` 只作為用戶可見連結，不作為指令來源。
- 遠端 `summary` 作為不可信純文本校驗長度和控制字符，但不進入檢查器輸出；用戶看到的是本地固定摘要。
- 遠端返回的欄位不能決定本地文件路徑和可執行程序。
- 緩存路徑由本地常量和作業系統 API 構造，不接受遠端片段。
- 檢查器不導入 `child_process`，也不提供 shell 執行接口。

### 15.3 殘餘風險

- HTTPS origin 或發布帳號被劫持時，攻擊者可能偽造「存在新版本」和發布說明連結。
- checksum 能證明候選身份穩定，不能證明發布者善意。
- Skill 指令是否穩定執行仍受具體 Agent 宿主影響。
- 純 Skill 模式需要一次額外工具調用，會增加少量時延和上下文開銷。
- 展示與本地確認不是同一原子動作；若 Agent 在兩者之間崩潰、確認失敗或多個 Agent 同時讀取未確認事件，同一候選可能重複提醒。系統選擇 at-least-once 展示，避免把用戶尚未看到的提醒誤記為已確認。
- 30 秒 hard lease 只能約束本地提交，不能給已經發出的 HTTP 請求提供遠端 exactly-once。若進程在最終所有權檢查之後或請求發出後被作業系統暫停到 lease 過期，後繼可合法接管並再次執行同一個冪等靜態 `GET`；舊結果恢復後會被 fencing 丟棄，不能提交或覆蓋新狀態。要消除重複 GET 需要遠端冪等鍵或 fencing token，超出靜態 GitHub Pages v0.1 的能力。
- Node 18+ 沒有穩定、跨平臺的 `openat`/`renameat` 目錄句柄 API。實現會拒絕驗證時可見的符號連結和身份變化，並在關鍵 mutation 前後失敗關閉；但能以同一用戶權限精確插入兩個系統調用之間、替換 canonical 祖先的惡意進程不屬於本地緩存安全邊界。該極端競態仍可能把一次路徑級創建、改名或非遞歸 unlink 落到鏡像命名的替代樹中；實現不使用遞歸刪除，因此不會沿替代樹遍歷清理，但無法承諾零外部單路徑 mutation。後置復驗會阻止它得到成功提醒或成功確認。root/管理員、映射盤或網絡掛載重映射同樣不在保證範圍內。

後續可通過籤名發布、透明日誌或宿主原生 Marketplace 降低來源風險，但不屬於 v0.1。

## 16. 失敗處理

| 故障 | 行為 | 下次檢查 |
|---|---|---|
| DNS、離線、超時 | `silent/check-failed` | 6 小時後 |
| HTTP 304 | `silent/check-failed`；無條件請求不接受 304 | 退避 |
| HTTP 4xx/5xx | `silent/check-failed` | 退避 |
| 響應超過上限 | `silent/invalid-manifest` | 首次 6 小時，連續失敗 24 小時 |
| JSON/schema 錯誤 | `silent/invalid-manifest` | 首次 6 小時，連續失敗 24 小時 |
| `skillId`/倉庫不匹配 | `silent/invalid-manifest` | 首次 6 小時，連續失敗 24 小時 |
| 驗證時緩存根或任一祖先是符號連結/非目錄，或關鍵 mutation 前後身份變化/後置條件不成立 | `silent/cache-unavailable`；停止後續聯網且不報告提醒/確認成功 | 下次激活重新驗證 |
| `state.json` 或需解析的 `active-claim/owner.json` 是 FIFO、符號連結、非普通文件、超限或內容損壞 | 不跟隨該葉文件；回退合法 generation，或按 claim lease 恢復 | 正常 TTL |
| `pending-*/owner.json` 缺失、是連結或非普通文件 | 不讀取內容並把該 pending 視為無有效 lease；更高 generation 可 fencing | 正常 TTL |
| 合法 operation 名稱對應的目錄被替換成符號連結或非目錄 | `silent/cache-unavailable`；不能把活躍 writer 當成不存在 | 下次激活重新驗證 |
| 新候選使提交、順序確認閉包或失敗退避投影超過 64 KiB | 不返回提醒；保留精確歷史、撤銷舊候選並 `silent/cache-unavailable` | 首次 6 小時，連續失敗 24 小時 |
| 本地發布快照是 FIFO、符號連結、非普通文件、超限或內容損壞 | `silent/invalid-local-release`，不聯網 | 修復安裝後 |
| Node.js 不可用 | 跳過檢測 | 下次激活 |
| 並發檢查 | 新鮮 lease 內一個進程檢查，其餘使用緩存；跨越 lease 的進程暫停可能產生重複冪等 GET，但只有當前 generation 可提交 | 正常 TTL |
| 系統時間回撥 | 對異常時間戳設上限並重新計算 | 正常 TTL |

無論哪種故障，都不能改變主任務結果或安裝內容。

## 17. 測試方案

### 17.1 單元測試

- TTL 未到期時不發起網絡請求。
- 響應中的不透明 validator 不持久化、不回傳，`304` 一律失敗靜默。
- 同版本或降級候選無論 digest 是否變化都返回 `current`。
- 成功刷新可以撤回先前較高候選；失敗刷新保留 last-good 候選。
- 嚴格更高的穩定 SemVer 返回 `update_available`；digest 只負責事件身份和展示確認去重。
- 已確認展示的 digest 按策略靜默。
- timeout、無效 JSON、超大響應、欄位缺失均返回 `silent`。
- `skillId`、channel、repository 不匹配時拒絕候選。
- `summary` 和 URL 不會進入命令執行路徑。
- 只有完整 committed generation 可讀，並發調用不會發布半寫 JSON。
- 刷新持有新鮮 pending 時其他檢查只讀 last-good offered 候選，展示確認有界等待或被 fence 後重試並持久化。
- 過期 lease 即使記錄了存活或復用的 PID 也可被高 generation 接管；恢復的舊 owner 無 pending 路徑可提交，也不會刪除新 owner 的唯一目錄。
- allocation 暫停在掃描後或 reservation 後時，generation 仍不復用；任何已被更高 reservation 超越的低代提交都會失敗並按確認預算重試。
- 兩個調用即使都拿到空 precheck 快照，在新鮮 lease 的協作競態中也只有 active-claim winner 可以發出網絡請求；stale 空 claim 的並發接管不能覆蓋或偷走新 owner。
- 晉升後已過期的 contender、持有舊 supersession 快照的低代，以及在重讀狀態或最終 token 復驗時失權的 owner 都不得發出第二次 GET 或退役更高代 active claim；跨 lease 暫停可能重複冪等 GET，但舊 owner 仍不能提交。
- 超過 20 位的偽 generation 不影響分配；偽造的 retirement 文件或符號連結不能讓 rename 寫出版本緩存分區。
- 文件、符號連結、空目錄和錯誤 `owner.json` 等 claim 損壞在 30 秒 lease 後都可恢復；重複壞內容使用不同實例身份退役。
- 刷新期間展示的 last-good digest 即使隨後被新候選替換，仍可確認；A → B → A 回退不會再次展示已確認的 A。
- 不同已安裝版本使用獨立狀態分片，不會互相清除 ack。
- 合法 JSON 但候選緩存語義損壞時拒絕整個 generation，回退上一條合法 committed 或執行一次無條件重建。
- 本地發布快照和 `state.json` 遇到 FIFO、指向 FIFO 的符號連結或超限普通文件時，在看門狗時限內靜默返回或恢復，絕不永久阻塞；active owner 的異常類型按 claim lease 恢復，pending owner 只作為 mtime marker 而不讀取內容。
- 驗證時可見的緩存根/嵌套祖先符號連結、準備期替換、緩存讀取期替換、關鍵 mutation 前後的祖先替換和替換—恢復 ABA 都會失敗關閉；系統調用間的同權限精確競態可能影響替代樹中一個鏡像命名路徑，但不存在遞歸清理，不會觸發後續聯網，也不會把提醒或確認返回為成功。
- 恰好 64 KiB 且具備恢復餘量的 offered 狀態仍可確認，64 KiB + 1 字節的狀態被忽略；多個 offered 的順序確認閉包和 `nextCheckAt: null` 的最壞失敗退避均覆蓋容量邊界，新候選容量不足時不剪枝確認歷史。

### 17.2 集成測試

- Codex、Claude Code、Cursor、OpenCode 至少各驗證一次激活流程。
- 有更新時，提醒出現後原任務繼續完成。
- 沒有更新時，用戶看不到任何版本檢查文案。
- 斷網條件下，端到端額外等待不超過配置的總超時。
- Agent 未展示提醒時，候選不會被錯誤永久標記為已讀。
- debug 日誌不包含項目路徑、用戶輸入和響應正文之外的敏感數據。

### 17.3 安全不變量測試

- 檢查器不引用 shell 或進程執行 API。
- 遠端欄位和驗證時可見的符號連結不能把檢查器寫入導向 Skill 根目錄、項目目錄或 Agent 配置目錄；同權限系統調用間競態按 15.3 的殘餘邊界處理。
- 任意遠端 manifest 都不能改變請求 origin、緩存路徑或本地命令。
- 恢復性錯誤統一退出成功並返回有效的 `silent` JSON。

## 18. 驗收標準

v0.1 達到以下條件後可進入小範圍發布：

- 100% 更新檢查僅執行只讀網絡請求和本地緩存寫入。
- 0 條代碼路徑可以下載、安裝或執行候選版本內容。
- 緩存命中時腳本執行時間目標低於 50 毫秒，不計 Agent 工具調用調度。
- 網絡檢查的額外等待由 1000 毫秒總超時嚴格封頂。
- 同一個候選 digest 成功確認後不再提醒；正常路徑展示一次，展示與確認間故障允許重複。
- 所有恢復性故障均不阻斷用戶任務。
- 用戶未明確選擇後續動作時，Skill 安裝狀態完全不變。
- 提醒內容包含當前版本、候選版本、摘要和官方發布說明。
- 至少在四個目標 Agent 中完成真實調用驗收。

## 19. 發布與舊版本遷移

### 19.1 兩階段穩定版發布

本倉庫原先由 `main:/docs` 直接發布；該模式不會等待普通 CI，因此不能承載 manifest 的發布門禁。啟用本方案前，倉庫管理員必須在 **Settings → Pages → Build and deployment → Source** 將來源一次性切換為 **GitHub Actions**。倉庫內的 `deploy-pages` job 只在 `main` push 上運行，並顯式依賴全部測試、ZIP freshness、包內 smoke 與 published-manifest 門禁；切換前不得發布新的 stable manifest。穩定版必須按以下順序發布：

1. 發布準備提交更新包版本、Changelog 與確定性 `archify.zip`，但 `docs/skill-updates/archify/stable.json` 仍保留緊鄰的上一穩定版。
2. stable tag 工作流拒絕任何已經等於或高於待發布版本的公共 manifest，然後煙測並創建帶 `archify.zip` 資產的 GitHub Release。
3. Release 成功後，單獨提交 manifest 跟進變更，填入該 tag 的 `archify` tree SHA、最終 Release 資產 SHA-256，以及 annotated tag 的 canonical UTC tagger time。GitHub Release `published_at` 只作為運營觀測值，不進入 v0.1 運行時身份。
4. 後續 commit 更新 `stable.json`。CI 通過 GitHub API 要求 manifest 精確等於當前 latest stable Release（不是任意歷史 Release），確認目標非 draft、非 prerelease，下載其中的 `archify.zip`，並要求它逐字節等於目標 tag 根目錄提交的 `archify.zip`。從首個攜帶確定性構建器的 v2.16.0 起，CI 還會在獨立 worktree 從該 tag 重建 ZIP，並再次逐字節比較；僅歷史 bootstrap v2.15.0 允許以 tagged blob 作為閉環。最後再把資產 SHA-256 與 manifest、目標 tag 的 `archify` tree 同時核對。該門禁證明的是 manifest 部署時點的 Release 資產、tagged ZIP、確定性重建結果與 manifest 一致；如果倉庫尚未啟用 GitHub immutable releases，資產在部署後替換不會自動觸發復驗，Release 頁面因而可能暴露與 manifest digest 不同的字節。v0.1 將其列為發布運營殘餘風險：維護者不得替換已發布資產，任何資產變更都必須使用新版本、新 tag 和新 manifest；公開啟用前應優先啟用並驗證 immutable release。發布準備階段可暫時保留上一版，而新 Release 建立後的下一次 `main` push 必須完成 manifest 跟進，不能無限期滯後。
5. 只有全部 CI job 成功，`deploy-pages` 才上傳 `docs/` artifact 並公開新候選；部署前還會確認本次 `GITHUB_SHA` 仍是遠端 `main`，因此完成較晚的舊 workflow run 不能把站點回滾。PR、失敗或已過時的 `main` push 與分支發布源都沒有部署路徑。

release identity 只允許公共 manifest 等於最新穩定版，或在穩定版發布準備窗口中暫時等於緊鄰的上一穩定版；更舊版本不能借兩階段流程長期滯後。工作流失敗時，公共 manifest 仍指向上一條完整 Release，不會提醒用戶訪問尚不存在的發布說明。

### 19.2 新安裝用戶

從引入提醒器的版本開始，發布包攜帶本地快照和檢查腳本，後續可在再次使用 Skill 時發現候選版本。

### 19.3 舊安裝用戶

舊版本沒有檢查邏輯，無法通過本方案被遠程喚醒。首次上線需要一次獨立遷移活動：

- 發布 GitHub Release，並明確這是「更新提醒能力遷移版本」。
- 在 README 頂部增加階段性升級公告。
- 置頂 Issue 或 Discussion。
- 通過已有社群、文章和發布渠道通知。
- 提供一個經過驗證的官方重新安裝入口。

完成這次人工遷移後，新版本用戶才進入持續的內置提醒鏈路。

## 20. 分階段實現

### v0.1：通知閉環

- 本地 `skill-release.json`。
- 遠端 `stable.json`。
- 無依賴檢查腳本。
- 72 小時 TTL、無條件 GET、1 秒超時、失敗靜默。
- SemVer 更新資格判斷、digest 事件身份和確認後去重。
- Agent 提醒後繼續原任務。
- 只提供發布說明，不執行更新。

### v0.2：用戶提醒偏好

- Snooze。
- Skip this version。
- 關閉普通更新提醒但保留安全提示。
- 提醒歷史和調試診斷。

### 後續獨立提案

- 識別原生 Plugin/Extension 更新所有者。
- 對接 `gh skill` 或其他跨 Agent 更新管理器。
- 展示腳本、MCP、Hooks 和權限差異。
- 籤名發布、安裝驗證和回滾。

這些能力不應通過擴充 v0.1 檢查腳本順帶實現，應分別評審其權限與生命周期。

## 21. v0.1 已落地決策與待評審項

實現分支為便於代碼評審，先採用以下可撤銷決策：

1. 純 Skill 激活增加一次本地檢查器調用；網絡頻率由緩存限制。
2. 正常 TTL 為 72 小時，帶隨機 ±20% jitter。
3. 採用 offered/acknowledged 兩階段確認，只有可見提醒之後才去重。
4. 同一安裝版本下，相同 ZIP digest 確認後不再提醒；不同安裝版本狀態分片。
5. v0.1 不實現或預留 Snooze/Skip 狀態欄位。
6. 運行時基線為無第三方依賴的 Node.js 18+。
7. manifest 固定為 GitHub Pages URL；發布門禁校驗 stable tag、Git tree 和最終 ZIP SHA-256。
8. 安全更新只提高提醒級別，仍不下載、不安裝，完全由用戶選擇。
9. 不收集匿名指標；請求不上傳本地版本、Agent 或項目數據。

仍需評審確認：四個目標 Agent 的真實驗收安排，以及舊版本遷移活動覆蓋哪些安裝渠道。公共 manifest 的發布 owner 已收斂到上述 Release 後跟進提交與 CI 門禁；上一穩定版 manifest 始終保留在 Git 歷史和對應 Release 中作為恢復依據。

## 22. 建議評審結論模板

```text
結論：接受 / 修改後接受 / 拒絕

必須修改：
- ...

延後到 v0.2：
- ...

已接受的關鍵取捨：
- 檢查周期：
- 提醒去重：
- 支持運行時：
- 安全更新交互：
- 遠端 manifest owner：

評審人：
日期：
```

## 23. 參考資料

- [Agent Skills Specification](https://agentskills.io/specification)
- [GitHub CLI `gh skill update`](https://cli.github.com/manual/gh_skill_update)
- [Claude Code Plugin auto-update](https://code.claude.com/docs/en/discover-plugins#configure-auto-updates)
- [Gemini CLI Extension reference](https://geminicli.com/docs/extensions/reference/)
- [Codex Skills and Plugins](https://developers.openai.com/codex/skills-and-plugins)
- [Vercel Labs `skills`](https://github.com/vercel-labs/skills)
