# Archify 編圖實踐手冊

Archify 首先是面向 Agent 的 Skill。普通用戶只需向支持 Skill 的 Agent 描述想要的圖；不必學習 Schema，也不必自己運行 `validate`、`inspect` 或 `deliver`。

下面的手工流程面向集成、貢獻和排錯。命令假設你位於倉庫的 `archify/` 目錄，或已經安裝好的 Archify Skill 根目錄。

## 1. 檢查安裝

Archify 要求 Node.js 18 或更高版本。開始編圖前先運行 doctor：

```bash
node bin/archify.mjs doctor
```

如果通過兼容 npm 的 Skill 工具安裝，可以執行：

```bash
npx skills add tt-a1i/archify -g
```

## 2. 選擇圖表類型

根據讀者需要回答的問題選擇類型：

| 類型 | 適合說明 | 可從這裡開始 |
| --- | --- | --- |
| `architecture` | 組件、服務、存儲和邊界 | `examples/web-app.architecture.json` |
| `workflow` | 有序工作、審批、分支和 Runbook | `examples/agent-tool-call.workflow.json` |
| `sequence` | 調用、返回、緩存未命中和時序 | `examples/cache-miss-request.sequence.json` |
| `dataflow` | 數據移動、轉換和消費者 | `examples/product-analytics.dataflow.json` |
| `lifecycle` | 狀態、重試、等待和終態 | `examples/agent-run.lifecycle.json` |

不確定類型時，可以詢問內置場景指南：

```bash
node bin/archify.mjs guide "展示帶 Redis 緩存未命中的 API 請求" --json --lang zh
```

指南會推薦類型並返回配方，但不會替你創建圖。

## 3. 編寫邊界清楚的源文件

從一個明確故事開始。第一張圖建議只保留約 8–12 個主要節點、一條主路徑，以及確實能幫助解釋問題的分支。相比複製大型生成成品，直接參考倉庫內示例更穩妥。

每個源文件都需要 `schema_version`、`diagram_type`、`meta.title`，以及對應 Renderer 要求的結構數組。精確欄位和允許值請閱讀 [Schema 說明](../archify/schemas/README.md)。

如果要生成基於倉庫證據的 Architecture 圖，需要在 JSON 中加入固定版本的倉庫元數據和源碼範圍，再把本地倉庫路徑傳給命令：

```bash
node bin/archify.mjs validate architecture path/to/diagram.json \
  --repo-root path/to/repository --quality showcase --json
```

Archify 會校驗 Git 遠端、commit、blob 和請求的代碼行。無法驗證倉庫或版本時，不要添加源碼證據。

## 4. 先校驗，再交付

探索階段可以使用 `standard`，正式成品或倉庫內證明建議使用 `showcase`：

```bash
node bin/archify.mjs validate architecture examples/web-app.architecture.json \
  --quality showcase --json
```

成功時，JSON 回執包含成品檢查和構圖摘要。失敗時，回執包含 `stage` 和 `diagnostics[]`；只修復被點名的對象，並優先使用 `supportedFixes` 中列出的修複方式。退出碼非零時，絕不能描述為校驗成功。

Architecture 圖需要檢查布局時，可以使用 Renderer 的機器可讀布局輸出：

```bash
node bin/archify.mjs inspect architecture path/to/diagram.json
```

`inspect` 當前只支持 Architecture，適合診斷信息指向線路或擺放問題時使用。

## 5. 交付可信成品

`render` 適合快速本地輸出；當文件要交給別人、用於發布或作為 CI 產物時，請使用 `deliver`：

```bash
node bin/archify.mjs deliver architecture examples/web-app.architecture.json \
  web-app.html --quality showcase --json
```

`deliver` 會凍結輸入字節，在目標文件同目錄生成候選文件，運行最終成品檢查，並且只在全部門禁通過後替換目標。回執包含源文件和成品的 SHA-256 哈希。只有需要立即本地打開時才加 `--open`：

```bash
node bin/archify.mjs deliver architecture examples/web-app.architecture.json \
  web-app.html --quality showcase --open --json
```

要比較兩份 Architecture 快照，請使用 `compare`。它會在 HTML 旁邊寫入 sidecar 回執：

```bash
node bin/archify.mjs compare architecture base.json head.json \
  architecture-delta.html --quality showcase --json
```

`compare` 首次讀取兩份輸入後，會使用捕獲的原始字節進行校驗、計算回執哈希並生成差異；之後原文件的變化不會影響本次比較。非法原始欄位仍會在規範化之前被拒絕。

## 6. 檢查最終文件

確定性校驗不會在真實瀏覽器中運行 Viewer。如果環境有 Chrome 或 Chromium，請對剛剛交付的 HTML 收集自動化瀏覽器證據：

```bash
node bin/archify.mjs visual-check web-app.html --json
```

這份回執只證明有限範圍內的運行時表現，並不批准視覺質量。仍需單獨檢查 HTML 或生成的截圖。記錄補充性的手工瀏覽器工作時必須遵循[交付契約](../archify/references/delivery-contract.md)；不受約束的目檢只影響視覺覆核結論。

自動化瀏覽器證據的規範覆蓋、成品綁定、視覺覆核狀態和交付回執欄位請參閱交付契約。編圖不變量和有上限的修復循環請參閱 [Skill 契約](../archify/SKILL.md)。
