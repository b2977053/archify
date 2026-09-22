const RAW_RECIPES = [
  {
    id: 'system-overview', type: 'architecture', proof: 'web-app',
    presentation: { preset: 'classic', motion: 'static', views: 'optional' },
    start: {
      en: { descriptionPrompt: 'Use Archify to turn this plain-language system description into a high-level architecture diagram: [describe the users, core components, primary path, external dependencies, and boundaries]. No repository is required. Ask only for missing facts that would materially change the diagram, mark any remaining unknowns instead of inventing them, and keep one obvious primary path across 8–12 core components.' },
      zh: { descriptionPrompt: '用 Archify 把下面這段自然語言系統描述畫成高層架構圖：[在這裡描述用戶、核心組件、主要路徑、外部依賴和邊界]。不需要代碼庫。只追問會實質影響圖的缺失信息，其餘不確定內容要標明而不是編造；保留 8–12 個核心組件和一條一眼可見的主路徑。' },
    },
    signals: [['system overview', 12], ['architecture', 10], ['components', 6], ['services', 4], ['repository', 5], ['trust boundary', 8], ['架構', 10], ['系統總覽', 12], ['組件', 6], ['服務', 4], ['倉庫', 5], ['信任邊界', 8]],
    en: {
      title: 'System overview', question: 'What exists, who owns it, and how is it connected?',
      summary: 'A bounded map of core components, external dependencies, primary paths, and trust boundaries.',
      useWhen: 'Onboarding, design reviews, repository orientation, or explaining a service landscape.',
      avoidWhen: 'The audience needs exact call order, state transitions, or row-level data lineage.',
      include: ['8–12 core components', 'one primary path', 'external dependencies', 'trust boundaries'],
      prompt: 'Analyze this repository, then use Archify to create a high-level architecture diagram. Show 8–12 core runtime components, one primary request or data path, external dependencies, ownership or trust boundaries, and put supporting detail in cards instead of adding more edges.',
    },
    zh: {
      title: '系統總覽', question: '系統裡有什麼、歸誰負責、彼此如何連接？',
      summary: '用一張有邊界的圖展示核心組件、外部依賴、主路徑和信任邊界。',
      useWhen: '適合新人上手、方案評審、倉庫梳理和服務全景說明。',
      avoidWhen: '如果重點是精確調用順序、狀態流轉或欄位級血緣，請換其他配方。',
      include: ['8–12 個核心組件', '一條主路徑', '外部依賴', '歸屬或信任邊界'],
      prompt: '分析這個倉庫，然後用 Archify 生成高層系統架構圖。展示 8–12 個核心運行時組件、一條主要請求或數據路徑、外部依賴、歸屬或信任邊界；支持性細節放進卡片，不要繼續堆連線。',
    },
  },
  {
    id: 'deployment-ownership', type: 'architecture', proof: 'deployment-ownership',
    presentation: { preset: 'blueprint', motion: 'trace', views: 'recommended' },
    signals: [['deployment topology', 14], ['region', 7], ['vpc', 9], ['cluster', 6], ['availability zone', 8], ['ownership', 7], ['cloud deployment', 12], ['部署拓撲', 14], ['區域', 6], ['集群', 6], ['可用區', 8], ['資源歸屬', 9], ['跨區', 8]],
    en: {
      title: 'Deployment ownership', question: 'Where does each workload run, and what crosses a boundary?',
      summary: 'A deployment-focused map of regions, networks, clusters, workloads, stores, and cross-boundary mechanisms.',
      useWhen: 'Cloud reviews, production readiness, multi-region planning, or infrastructure ownership handoffs.',
      avoidWhen: 'Deployment facts are unknown or the real question is application behavior rather than placement.',
      include: ['regions and networks', 'workload ownership', 'stateful services', 'named boundary crossings'],
      prompt: 'Use Archify to draw the production deployment topology. Group resources by region, network, cluster, and owner; show workloads and stateful services; label every cross-boundary mechanism. Do not invent deployment facts—mark unknown areas explicitly. If the user wants a fail-closed deployment review, ask before setting meta.engineering_profile to deployment-ownership; otherwise leave the engineering profile unset.',
    },
    zh: {
      title: '部署與歸屬', question: '每個工作負載運行在哪裡，哪些連接跨越了邊界？',
      summary: '圍繞 Region、網絡、集群、工作負載、存儲和跨邊界機制組織部署圖。',
      useWhen: '適合雲上評審、生產就緒、多區域規劃和基礎設施交接。',
      avoidWhen: '部署事實不清楚，或真正問題是應用行為而不是資源位置時不要使用。',
      include: ['區域與網絡', '工作負載歸屬', '有狀態服務', '明確的跨邊界機制'],
      prompt: '用 Archify 繪製生產部署拓撲。按區域、網絡、集群和負責人分組，展示工作負載與有狀態服務，並標註每一種跨邊界機制。不要編造部署事實，不確定的區域要明確標出。如果用戶需要失敗即阻斷的部署評審，先徵得確認，再把 meta.engineering_profile 設為 deployment-ownership；否則不要啟用工程畫像。',
    },
  },
  {
    id: 'agent-tool-call', type: 'workflow', proof: 'agent-tool-call',
    presentation: { preset: 'signal-flow', motion: 'trace', views: 'recommended' },
    start: {
      en: { descriptionPrompt: 'Use Archify workflow mode to turn this description into a diagram: [paste the actors, main steps, decisions, approvals, and exception paths]. Use lanes for distinct owners, keep one unmistakable happy path, and mark missing ownership or unresolved branches instead of inventing them.' },
      zh: { descriptionPrompt: '用 Archify 工作流模式把下面的描述畫成圖：[粘貼參與者、主要步驟、決策、審批和異常路徑]。不同負責方使用獨立泳道，保留一條明確的成功主路徑，缺失的負責人或未定分支要標明而不是編造。' },
    },
    signals: [['agent tool call', 16], ['tool call', 12], ['approval gate', 10], ['human in the loop', 9], ['mcp', 7], ['planner', 6], ['agent loop', 10], ['智能體工具調用', 16], ['工具調用', 12], ['審批門', 10], ['人在迴路', 9], ['規劃器', 6], ['智能體循環', 10]],
    en: {
      title: 'Agent tool-call loop', question: 'How does an agent plan, get permission, act, recover, and report?',
      summary: 'A lane-based agent loop with policy gates, tool execution, exception recovery, evidence, and final response.',
      useWhen: 'Explaining agent runtimes, MCP/tool orchestration, approvals, retries, or observability.',
      avoidWhen: 'The goal is only to show static agent components or exact API message timing.',
      include: ['request and planning', 'policy or approval gate', 'tool execution', 'exception and evidence paths'],
      prompt: 'Use Archify workflow mode to explain this agent tool-call loop. Separate user surface, agent runtime, policy boundary, exception handling, tool execution, and observability into lanes. Make the successful path primary and show approval, retry, blocked, and evidence paths explicitly.',
    },
    zh: {
      title: '智能體工具調用', question: '智能體如何規劃、獲批、執行、恢復並匯報？',
      summary: '用泳道表達策略門、工具執行、異常恢復、證據和最終回復。',
      useWhen: '適合解釋 Agent Runtime、MCP/工具編排、審批、重試和可觀測性。',
      avoidWhen: '如果只想看靜態組件，或重點是精確 API 消息時序，請換其他配方。',
      include: ['請求與規劃', '策略或審批門', '工具執行', '異常與證據路徑'],
      prompt: '用 Archify 工作流模式解釋這段智能體工具調用。把用戶界面、Agent Runtime、策略邊界、異常處理、工具執行和可觀測性分成泳道；突出成功主路徑，並明確展示審批、重試、阻塞和證據路徑。',
    },
  },
  {
    id: 'delivery-workflow', type: 'workflow', proof: 'delivery-workflow',
    presentation: { preset: 'classic', motion: 'trace', views: 'optional' },
    signals: [['ci/cd', 14], ['release workflow', 14], ['deployment pipeline', 11], ['pull request', 7], ['staging', 7], ['rollback', 8], ['發布流程', 14], ['流水線', 9], ['上線', 7], ['預發', 7], ['回滾', 8], ['審批發布', 10]],
    en: {
      title: 'Delivery workflow', question: 'How does a change move safely from commit to production?',
      summary: 'A delivery flow with build, checks, environments, approvals, smoke tests, rollback, and ownership lanes.',
      useWhen: 'CI/CD design, release reviews, deployment governance, or onboarding developers to delivery.',
      avoidWhen: 'The question is where infrastructure runs or what states a deployment object can occupy.',
      include: ['trigger and build', 'blocking checks', 'approval and environments', 'rollback and verification'],
      prompt: 'Use Archify workflow mode to draw this delivery process from commit to production. Separate developer, CI, approval, environment, and exception lanes; mark blocking checks, smoke tests, ownership, and the rollback path. Keep one unmistakable happy path.',
    },
    zh: {
      title: '研發交付流程', question: '一次變更如何安全地從提交走到生產？',
      summary: '展示構建、檢查、環境、審批、冒煙、回滾和負責人泳道。',
      useWhen: '適合 CI/CD 設計、發布評審、部署治理和研發新人上手。',
      avoidWhen: '如果重點是基礎設施位置或部署對象的狀態集合，請換架構圖或生命周期圖。',
      include: ['觸發與構建', '阻斷檢查', '審批與環境', '回滾與驗證'],
      prompt: '用 Archify 工作流模式繪製從代碼提交到生產發布的流程。拆分開發者、CI、審批、環境和異常泳道；標出阻斷檢查、冒煙測試、負責人和回滾路徑，並保留一條一眼可見的成功主路徑。',
    },
  },
  {
    id: 'incident-runbook', type: 'workflow', proof: 'incident-runbook',
    presentation: { preset: 'signal-flow', motion: 'trace', views: 'recommended' },
    signals: [['incident response', 15], ['runbook', 12], ['outage', 9], ['triage', 8], ['mitigation', 8], ['escalation', 7], ['事故處置', 15], ['故障', 9], ['應急預案', 12], ['排障', 9], ['緩解', 7], ['升級響應', 8]],
    en: {
      title: 'Incident runbook', question: 'How do responders detect, triage, mitigate, verify, and escalate?',
      summary: 'An operational workflow that separates signals, responders, mitigation, communications, and recovery proof.',
      useWhen: 'Incident playbooks, on-call handoffs, reliability reviews, and tabletop exercises.',
      avoidWhen: 'The audience needs live metrics or a post-incident component topology instead of response actions.',
      include: ['detection signal', 'triage owner', 'mitigation and rollback', 'verification and communication'],
      prompt: 'Use Archify workflow mode to turn this incident runbook into responder lanes. Show detection, triage, mitigation, escalation, communication, rollback, and recovery verification. Separate decision gates from actions and make missing ownership visible.',
    },
    zh: {
      title: '事故處置 Runbook', question: '響應者如何發現、分診、緩解、驗證並升級？',
      summary: '把信號、響應者、緩解動作、溝通和恢復證據拆成可執行流程。',
      useWhen: '適合故障預案、On-call 交接、穩定性評審和桌面演練。',
      avoidWhen: '如果受眾需要實時指標儀錶盤或事故後的組件拓撲，而不是響應動作，請換其他視圖。',
      include: ['發現信號', '分診負責人', '緩解與回滾', '恢復驗證與溝通'],
      prompt: '用 Archify 工作流模式把事故處置預案畫成響應者泳道。展示發現、分診、緩解、升級、溝通、回滾和恢復驗證；把決策門與操作分開，並讓缺失的負責人清晰可見。',
    },
  },
  {
    id: 'api-request', type: 'sequence', proof: 'cache-miss',
    presentation: { preset: 'classic', motion: 'trace', views: 'optional' },
    start: {
      en: { descriptionPrompt: 'Use Archify sequence mode to draw this interaction: [paste the participants, calls, returns, fallback, and asynchronous side effects]. Keep message order unambiguous, labels short, and unknown behavior explicit. No repository is required.' },
      zh: { descriptionPrompt: '用 Archify 時序模式繪製下面的交互：[粘貼參與者、調用、返回、回退和異步副作用]。確保消息順序無歧義、標籤簡短，並明確標註未知行為。不需要代碼庫。' },
    },
    signals: [['api request', 14], ['request response', 12], ['call chain', 11], ['cache miss', 13], ['jwt', 8], ['who calls whom', 12], ['api 請求', 14], ['請求響應', 12], ['調用鏈', 11], ['緩存未命中', 13], ['誰調用誰', 12], ['鑑權鏈路', 9]],
    en: {
      title: 'API request chain', question: 'Who calls whom, in what order, and what returns?',
      summary: 'A time-ordered request path with authentication, cache fallback, persistence, return traffic, and async trace.',
      useWhen: 'API documentation, debugging request latency, auth reviews, or explaining cache fallback.',
      avoidWhen: 'Order is unimportant and the audience only needs the stable service topology.',
      include: ['callers and callees', 'request and return messages', 'fallback or error path', 'async side effects'],
      prompt: 'Use Archify sequence mode to show this request from caller to final response. Include authentication, cache hit or miss, persistence fallback, return messages, and asynchronous trace or event emission. Keep message labels short and order unambiguous.',
    },
    zh: {
      title: 'API 請求鏈', question: '誰調用誰、順序如何、最終返回什麼？',
      summary: '按時間展示鑑權、緩存回退、持久化、返回流量和異步追蹤。',
      useWhen: '適合 API 文檔、請求耗時排查、鑑權評審和緩存回退說明。',
      avoidWhen: '如果順序不重要，受眾只需要穩定的服務拓撲，請用架構圖。',
      include: ['調用方與被調用方', '請求與返回消息', '回退或錯誤路徑', '異步副作用'],
      prompt: '用 Archify 時序模式展示從調用方到最終響應的完整請求。包含鑑權、緩存命中或未命中、持久化回退、返回消息，以及異步 Trace 或事件上報；消息標籤保持簡短，順序必須明確。',
    },
  },
  {
    id: 'async-roundtrip', type: 'sequence', proof: 'async-roundtrip',
    presentation: { preset: 'signal-flow', motion: 'trace', views: 'recommended' },
    signals: [['async roundtrip', 14], ['webhook', 10], ['callback', 10], ['acknowledgement', 8], ['timeout', 7], ['retry message', 8], ['異步回調', 14], ['回調', 10], ['確認消息', 8], ['超時', 7], ['消息重試', 9], ['webhook', 10]],
    en: {
      title: 'Async roundtrip', question: 'What happens after the initial request returns?',
      summary: 'A sequence view of enqueue, acknowledgement, background work, callbacks, retries, timeout, and final consistency.',
      useWhen: 'Webhooks, jobs, queues, payment callbacks, eventual consistency, or async API contracts.',
      avoidWhen: 'The primary question is topic topology and consumer ownership rather than time order.',
      include: ['initial acknowledgement', 'queue or scheduler', 'background work', 'callback, retry, and timeout'],
      prompt: 'Use Archify sequence mode to explain this asynchronous roundtrip. Show the initial acknowledgement, enqueue or scheduling step, background processing, callback or polling, retry and timeout behavior, and the point where the caller can observe final consistency.',
    },
    zh: {
      title: '異步往返鏈路', question: '初始請求返回之後，後臺還會發生什麼？',
      summary: '按時間展示入隊、確認、後臺處理、回調、重試、超時和最終一致。',
      useWhen: '適合 Webhook、後臺任務、隊列、支付回調、最終一致和異步 API 契約。',
      avoidWhen: '如果重點是 Topic 拓撲和消費者歸屬，而不是時間順序，請用事件數據流配方。',
      include: ['初始確認', '隊列或調度器', '後臺處理', '回調、重試與超時'],
      prompt: '用 Archify 時序模式解釋這段異步往返鏈路。展示初始確認、入隊或調度、後臺處理、回調或輪詢、重試與超時，以及調用方何時能觀察到最終一致結果。',
    },
  },
  {
    id: 'data-lineage', type: 'dataflow', proof: 'product-analytics',
    presentation: { preset: 'classic', motion: 'trace', views: 'recommended' },
    signals: [['data lineage', 15], ['etl', 12], ['warehouse', 9], ['pii', 11], ['governance', 9], ['analytics pipeline', 12], ['數據血緣', 15], ['數據管道', 11], ['數倉', 9], ['治理', 9], ['隱私數據', 10], ['用戶同意', 9]],
    en: {
      title: 'Data lineage', question: 'Where does data come from, how does it change, and who consumes it?',
      summary: 'A governed path from sources through consent, transforms, sensitive stores, warehouse, and consumers.',
      useWhen: 'Analytics architecture, ETL/ELT review, PII assessment, warehouse design, or model feature lineage.',
      avoidWhen: 'The audience needs request timing or operational task ownership rather than data assets.',
      include: ['sources and assets', 'transform stages', 'classification or consent', 'stores and consumers'],
      prompt: 'Use Archify dataflow mode to map this data lineage. Name every data asset and transform, show consent or classification boundaries, distinguish streaming from batch paths, and identify stores plus downstream consumers. Do not use unlabeled flows.',
    },
    zh: {
      title: '數據血緣', question: '數據從哪裡來、如何變化、最終被誰消費？',
      summary: '從來源經過同意、轉換、敏感存儲、數倉直到消費者的治理路徑。',
      useWhen: '適合分析架構、ETL/ELT 評審、PII 評估、數倉設計和特徵血緣。',
      avoidWhen: '如果受眾需要請求時序或操作負責人，而不是數據資產，請換其他配方。',
      include: ['數據來源與資產', '轉換階段', '分類或同意邊界', '存儲與消費者'],
      prompt: '用 Archify 數據流模式梳理這段數據血緣。為每個數據資產和轉換命名，展示用戶同意或數據分類邊界，區分流式與批處理路徑，並標明存儲和下遊消費者；所有數據流都必須有標籤。',
    },
  },
  {
    id: 'event-stream', type: 'dataflow', proof: 'event-stream',
    presentation: { preset: 'signal-flow', motion: 'trace', views: 'recommended' },
    start: {
      en: { descriptionPrompt: 'Use Archify dataflow mode to map this data journey: [paste the sources, data assets, transforms, stores, boundaries, and consumers]. Label every flow, distinguish streaming from batch where relevant, and mark unknown classifications or ownership instead of inventing them.' },
      zh: { descriptionPrompt: '用 Archify 數據流模式梳理下面的數據路徑：[粘貼來源、數據資產、轉換、存儲、邊界和消費者]。為每條數據流標註名稱，在有意義時區分流式與批處理，未知的分類或歸屬要標明而不是編造。' },
    },
    signals: [['event stream', 15], ['kafka topology', 14], ['topic', 8], ['consumer group', 11], ['dead letter', 10], ['dlq', 10], ['事件流', 15], ['kafka 拓撲', 14], ['主題', 7], ['消費者組', 11], ['死信', 10], ['事件地鐵圖', 12]],
    en: {
      title: 'Event-stream topology', question: 'Which events move through which topics, processors, groups, and failure paths?',
      summary: 'A stream map of producers, topics, ordered processors, consumer groups, state, replay, and DLQ.',
      useWhen: 'Kafka/event-platform design, stream processing reviews, ownership, replay, and failure handling.',
      avoidWhen: 'Topic names, consumer groups, and delivery semantics are not known—use a generic workflow instead.',
      include: ['producers and event names', 'topics and ordering', 'processors and consumer groups', 'state, replay, and DLQ'],
      prompt: 'Use Archify dataflow mode to draw this event-stream topology. Name producers, events, topics, ordered processors, consumer groups, state stores, replay paths, and the DLQ. Show ownership and delivery semantics only when supported by evidence.',
    },
    zh: {
      title: '事件流拓撲', question: '哪些事件經過哪些 Topic、處理器、消費者組和失敗路徑？',
      summary: '展示生產者、Topic、有序處理器、消費者組、狀態、重放和 DLQ。',
      useWhen: '適合 Kafka/事件平臺設計、流處理評審、歸屬、重放和失敗處理。',
      avoidWhen: '如果 Topic、消費者組和投遞語義都不清楚，請先用通用工作流，不要編造事件拓撲。',
      include: ['生產者與事件名', 'Topic 與順序', '處理器與消費者組', '狀態、重放與 DLQ'],
      prompt: '用 Archify 數據流模式繪製這段事件流拓撲。命名生產者、事件、Topic、有序處理器、消費者組、狀態存儲、重放路徑和 DLQ；只有在證據充分時才標註歸屬和投遞語義。',
    },
  },
  {
    id: 'object-lifecycle', type: 'lifecycle', proof: 'agent-run',
    presentation: { preset: 'classic', motion: 'trace', views: 'optional' },
    start: {
      en: { descriptionPrompt: 'Use Archify lifecycle mode to model this object: [paste its states, transition events, waits, retries, cancellation, and terminal outcomes]. Separate active, waiting, recoverable-failure, and terminal states, and never hide an ending. No repository is required.' },
      zh: { descriptionPrompt: '用 Archify 生命周期模式建模這個對象：[粘貼它的狀態、轉換事件、等待、重試、取消和終態]。分開執行、等待、可恢復失敗和終態，不要隱藏任何結束方式。不需要代碼庫。' },
    },
    signals: [['state machine', 15], ['object lifecycle', 14], ['status transition', 11], ['terminal state', 9], ['retry state', 8], ['狀態機', 15], ['生命周期', 13], ['狀態流轉', 11], ['終態', 9], ['等待態', 8], ['重試狀態', 8]],
    en: {
      title: 'Object lifecycle', question: 'Which states exist, what events move between them, and how does it end?',
      summary: 'A state model with active work, waits, retries, cancellation, failure, and explicit terminal outcomes.',
      useWhen: 'Tasks, orders, tickets, subscriptions, jobs, agent runs, or any durable object with status.',
      avoidWhen: 'The object has no durable state and the real question is participant interaction over time.',
      include: ['start and active states', 'event-labelled transitions', 'wait and retry states', 'all terminal outcomes'],
      prompt: 'Use Archify lifecycle mode to model this object. Separate main progress, waiting or interruption states, and terminal outcomes. Label transitions with events, include retry, cancellation, timeout, success, and failure where real, and never hide an ending.',
    },
    zh: {
      title: '對象生命周期', question: '有哪些狀態、什麼事件觸發流轉、最終如何結束？',
      summary: '展示執行、等待、重試、取消、失敗以及明確終態的狀態模型。',
      useWhen: '適合任務、訂單、工單、訂閱、作業、Agent Run 等帶持久狀態的對象。',
      avoidWhen: '對象沒有持久狀態，真正問題是參與者隨時間的交互時，請使用時序圖。',
      include: ['開始與執行態', '帶事件的轉換', '等待與重試態', '所有終態'],
      prompt: '用 Archify 生命周期模式建模這個對象。分開主進度、等待或中斷狀態和終態；用事件標註轉換，並在真實存在時展示重試、取消、超時、成功和失敗，不能隱藏任何結束方式。',
    },
  },
  {
    id: 'deployment-lifecycle', type: 'lifecycle', proof: 'deployment-lifecycle',
    presentation: { preset: 'signal-flow', motion: 'trace', views: 'recommended' },
    signals: [['deployment lifecycle', 15], ['release state', 10], ['promotion state', 9], ['approval status', 8], ['rollback state', 10], ['部署生命周期', 15], ['發布狀態', 10], ['晉級', 7], ['審批狀態', 8], ['回滾狀態', 10]],
    en: {
      title: 'Deployment lifecycle', question: 'What state is a release in, and what can happen next?',
      summary: 'A deployment state model covering queued, building, verifying, approval, promotion, rollback, and terminal outcomes.',
      useWhen: 'Release controllers, GitOps reconciliation, environment promotion, or deployment status APIs.',
      avoidWhen: 'The question is the human/CI sequence of delivery actions rather than the deployment object state.',
      include: ['queued and running states', 'verification and approval', 'promotion and rollback', 'success, failure, cancellation'],
      prompt: 'Use Archify lifecycle mode to model the deployment object. Show queued, building, verifying, waiting for approval, promoting, rolling back, and every terminal outcome. Label the events and guards that permit each transition.',
    },
    zh: {
      title: '部署生命周期', question: '一次發布當前處於什麼狀態，下一步可能發生什麼？',
      summary: '覆蓋排隊、構建、驗證、審批、晉級、回滾和終態的部署狀態模型。',
      useWhen: '適合發布控制器、GitOps 對帳、環境晉級和部署狀態 API。',
      avoidWhen: '如果重點是人員與 CI 的交付動作順序，而不是部署對象狀態，請用交付工作流。',
      include: ['排隊與執行態', '驗證與審批', '晉級與回滾', '成功、失敗與取消'],
      prompt: '用 Archify 生命周期模式建模部署對象。展示排隊、構建、驗證、等待審批、晉級、回滾以及所有終態，並標註允許每次狀態轉換的事件和守衛條件。',
    },
  },
];

export const SCENARIO_RECIPES = Object.freeze(RAW_RECIPES.map((recipe) => Object.freeze({
  ...recipe,
  presentation: Object.freeze({ ...recipe.presentation }),
  ...(recipe.start ? { start: Object.freeze({
    en: Object.freeze({ ...recipe.start.en }),
    zh: Object.freeze({ ...recipe.start.zh }),
  }) } : {}),
  signals: Object.freeze(recipe.signals.map((signal) => Object.freeze(signal.slice()))),
  en: Object.freeze({ ...recipe.en, include: Object.freeze(recipe.en.include.slice()) }),
  zh: Object.freeze({ ...recipe.zh, include: Object.freeze(recipe.zh.include.slice()) }),
})));

export function detectGuideLanguage(value = '') {
  return /[\u3400-\u9fff]/u.test(value) ? 'zh' : 'en';
}

export function startPromptsFor(recipe, lang = 'en') {
  const language = lang === 'zh' ? 'zh' : 'en';
  const copy = recipe[language];
  const descriptionPrompt = recipe.start?.[language]?.descriptionPrompt;
  if (!descriptionPrompt) {
    throw new Error(`Scenario recipe ${JSON.stringify(recipe.id)} does not define a ${language} start prompt.`);
  }
  const repositoryPrompt = recipe.type === 'architecture'
    ? copy.prompt
    : language === 'zh'
      ? `先檢查這個倉庫裡的相關證據，然後${copy.prompt}不要編造代碼無法支持的行為。`
      : `Inspect this repository for evidence, then ${copy.prompt.charAt(0).toLowerCase()}${copy.prompt.slice(1)} Do not invent behavior that the code does not support.`;
  return { descriptionPrompt, repositoryPrompt };
}

function normalized(value) {
  return String(value || '').normalize('NFKC').toLowerCase().replace(/[\s_]+/g, ' ').trim();
}

function localized(recipe, lang) {
  const copy = recipe[lang === 'zh' ? 'zh' : 'en'];
  return {
    id: recipe.id,
    type: recipe.type,
    proof: recipe.proof,
    presentation: { ...recipe.presentation },
    ...copy,
    include: copy.include.slice(),
  };
}

export function listScenarioRecipes(lang = 'en') {
  return SCENARIO_RECIPES.map((recipe) => localized(recipe, lang));
}

function scoreRecipe(recipe, query) {
  const text = normalized(query);
  if (!text) return { recipe, score: 0, matched: [] };
  if (text === recipe.id || text === recipe.id.replace(/-/g, ' ')) {
    return { recipe, score: 100, matched: [recipe.id] };
  }
  let score = 0;
  const matched = [];
  for (const [signal, weight] of recipe.signals) {
    if (text.includes(normalized(signal))) {
      score += weight;
      matched.push(signal);
    }
  }
  return { recipe, score, matched };
}

export function recommendScenario(query, options = {}) {
  const lang = options.lang === 'zh' || options.lang === 'en' ? options.lang : detectGuideLanguage(query);
  const ranked = SCENARIO_RECIPES.map((recipe) => scoreRecipe(recipe, query))
    .sort((left, right) => right.score - left.score || SCENARIO_RECIPES.indexOf(left.recipe) - SCENARIO_RECIPES.indexOf(right.recipe));
  const winner = ranked[0].score > 0 ? ranked[0] : { recipe: SCENARIO_RECIPES[0], score: 0, matched: [] };
  const confidence = winner.score >= 14 ? 'high' : winner.score >= 7 ? 'medium' : 'low';
  return {
    ok: true,
    mode: 'recommendation',
    lang,
    query: String(query || ''),
    confidence,
    matchedSignals: winner.matched.slice(),
    recommendation: localized(winner.recipe, lang),
    alternatives: ranked.filter((entry) => entry.recipe.id !== winner.recipe.id && entry.score > 0)
      .slice(0, 2)
      .map((entry) => ({ ...localized(entry.recipe, lang), score: entry.score })),
  };
}

export function formatScenarioList(lang = 'en') {
  const isZh = lang === 'zh';
  const heading = isZh
    ? `Archify 場景配方（${SCENARIO_RECIPES.length}）`
    : `Archify scenario recipes (${SCENARIO_RECIPES.length})`;
  const intro = isZh
    ? '先選擇你要回答的問題，再選擇圖表類型。可運行：archify guide "你的場景"'
    : 'Choose the question before the diagram type. Run: archify guide "your scenario"';
  return [heading, '', intro, '', ...listScenarioRecipes(lang).flatMap((recipe) => [
    `${recipe.id}  [${recipe.type}]  ${recipe.title}`,
    `  ${recipe.question}`,
  ])].join('\n');
}

export function formatScenarioRecommendation(result) {
  const isZh = result.lang === 'zh';
  const recipe = result.recommendation;
  const labels = isZh ? {
    heading: '推薦', question: '要回答的問題', use: '適合', avoid: '不要這樣用', include: '必須包含', presentation: '表現建議', prompt: '可直接複製的提示詞', alternatives: '其他可能', confidence: '置信度',
  } : {
    heading: 'Recommendation', question: 'Question answered', use: 'Use when', avoid: 'Avoid when', include: 'Must include', presentation: 'Presentation', prompt: 'Copy-ready prompt', alternatives: 'Other possible fits', confidence: 'Confidence',
  };
  const lines = [
    `${labels.heading}: ${recipe.title}  [${recipe.type}]`,
    `${labels.confidence}: ${result.confidence}`,
    `${labels.question}: ${recipe.question}`,
    '',
    `${labels.use}: ${recipe.useWhen}`,
    `${labels.avoid}: ${recipe.avoidWhen}`,
    `${labels.include}: ${recipe.include.join(isZh ? '、' : '; ')}`,
    `${labels.presentation}: ${recipe.presentation.preset} · ${recipe.presentation.motion} · views ${recipe.presentation.views}`,
    '',
    `${labels.prompt}:`,
    recipe.prompt,
  ];
  if (result.alternatives.length) {
    lines.push('', `${labels.alternatives}: ${result.alternatives.map((item) => `${item.title} [${item.type}]`).join(' · ')}`);
  }
  return lines.join('\n');
}

export function publicGuideData() {
  return SCENARIO_RECIPES.map((recipe) => ({
    ...localized(recipe, 'en'),
    en: recipe.en,
    zh: recipe.zh,
    signals: recipe.signals.map(([signal, weight]) => [signal, weight]),
  }));
}
