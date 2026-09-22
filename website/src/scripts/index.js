
  /* ══════════════════════════════════════
     i18n strings
  ══════════════════════════════════════ */
  const LANGS = {
    en: {
      'nav-guide':'Guide','nav-gallery':'Proof Lab','nav-start':'Start','nav-install':'Install Skill',
      'hero-badge':'Agent Skill &nbsp;·&nbsp; development &nbsp;·&nbsp; v[[ARCHIFY_VERSION]]',
      'hero-h1':'From plain English<br>to architecture <em>you can trust.</em>',
      'hero-sub':'Describe your system in chat. Archify generates a polished, explorable HTML diagram — with progressive MAP → READ → FULL detail, a semantic camera, path-aware stories, motion, and ultra-crisp export built in.',
      'hero-cta':'Choose the right diagram','hero-gallery':'Explore proof gallery',
      'proof-live':'Live proof','proof-status':'Generated, checked, interactive','proof-receipt':'Real gallery artifact · 9/9 validation checks','proof-open':'Open artifact','proof-hint':'Play a story that follows the current authored moment, then pin and share that exact node.',
      'rail-label':'Live specimens — select to load',
      'stat-types':'Diagram types','stat-presets':'Visual presets','stat-themes':'Coordinated themes','stat-export':'Native export scale','stat-deps':'Dependencies',
      'label-types':'Diagram Types',
      'types-h2':'Five ways to see your system.',
      'types-body':'Architecture, workflows, sequences, data flows, or state machines — describe what you need and Archify picks the right visual language.',
      'label-gallery':'Index',
      'types-more':'Browse the full proof gallery','types-more-sub':'Live artifacts · every preset · every type',
      'arch-h':'Architecture',
      'arch-p':'System components, cloud resources, databases, caches, services, security groups, and the connections between them.',
      'arch-li1':'AWS / GCP / Azure infra','arch-li2':'Microservices topology','arch-li3':'Security boundaries','arch-li4':'Network layout',
      'wf-h':'Workflow',
      'wf-p':'Swim-lane processes with semantic nodes and anchored edges — approval gates, async branches, and observability paths, lane by lane.',
      'seq-h':'Sequence',
      'seq-p':'API call chains, request lifecycles, cache fallback paths, auth checks, async traces — who calls whom, in what order, and what returns.',
      'flow-h':'Data Flow',
      'flow-p':'Data pipelines, ETL/ELT, analytics events, PII isolation, warehouse sync, lineage, and downstream consumers — with governance boundaries.',
      'life-h':'Lifecycle',
      'life-p':'State machines, object lifecycles, run/order/deployment status transitions — with wait states, retries, cancellation, and terminal outcomes.',
      'label-features':'Features',
      'features-h2':'Production-ready output,<br>zero configuration.',
      'f1-h':'Four visual identities','f1-p':'Classic, Signal Flow, Blueprint, and Editorial share one geometry contract. Every preset includes coordinated dark/light themes and exports cleanly.','f1-tag':'4 PRESETS · 2 THEMES',
      'f2-h':'Ultra-crisp 4× export','f2-p':'PNG, JPEG, WebP — all rasterized natively at up to 4× source resolution by the browser. No upsampling blur. Sharp on retina displays, slides, and print.','f2-tag':'PNG · JPEG · WEBP',
      'f3-h':'Dual-theme SVG','f3-p':"The SVG export ships with both variable sets plus a @media prefers-color-scheme rule. Drop one file into a GitHub README — it follows the reader's theme.",'f3-tag':'VECTOR · SELF-THEMED',
      'f4-h':'Copy to clipboard','f4-p':'One button puts a PNG straight on your clipboard. Paste directly into Slack, Notion, GitHub, or Figma — no intermediate save step.','f4-tag':'INSTANT SHARE',
      'f5-h':'Self-contained HTML','f5-p':'One HTML file. Zero dependencies, no server, no runtime. Open it in any browser and it works. Share by attaching it to an email or PR comment.','f5-tag':'ZERO DEPS',
      'f6-h':'Iterate by chat','f6-p':'"Add Redis", "move auth to the left", "use emerald for the API" — refine in natural language. No diagram editor to learn.','f6-tag':'CONVERSATIONAL',
      'f7-h':'Inspect and play real routes','f7-p':'Route Journey keeps the complete authored path visible while you inspect any stop or play one finite, reader-controlled pass over each exact incoming relationship.','f7-tag':'INSPECT · PLAY · PAUSE',
      'f8-h':'Anticipate and share the exact story moment','f8-p':'Story Horizon distinguishes the exact next stop, while Semantic Story Carrier shows whether its one authored relationship is a call, data, event, security, or state transition. Pin any beat or share the same stable moment.','f8-tag':'FOLLOW · ANTICIPATE · SHARE',
      'export-label':'Export formats',
      'exp-png':'Transparent · 4× native','exp-jpg':'Theme bg · 4× native','exp-webp':'Small · 4× native','exp-svg':'Vector · dual-theme','exp-webm':'Motion · browser-native','exp-clip-fmt':'Clipboard','exp-clip':'Copy PNG · instant paste',
      'label-palette':'Design System',
      'palette-h2':'A semantic color language for infrastructure.',
      'palette-body':'Seven component types. Each with coordinated dark and light variants that switch together via the theme toggle.',
      'chip-frontend':'Frontend','chip-frontend-use':'Client apps, browsers, mobile, UI',
      'chip-backend':'Backend','chip-backend-use':'Services, APIs, workers, daemons',
      'chip-database':'Database','chip-database-use':'DBs, caches, stores, AI/ML',
      'chip-cloud':'Cloud','chip-cloud-use':'Managed services, infra',
      'chip-security':'Security','chip-security-use':'Auth, secrets, guards',
      'chip-bus':'Message Bus','chip-bus-use':'Kafka, RabbitMQ, SNS',
      'chip-external':'External','chip-external-use':'Users, 3rd parties, generic',
      'label-qs':'Quick Start',
      'qs-h2':'Up and running<br>in three steps.',
      'qs-body':'One checked Skill for Cursor, Claude Code, Codex, and OpenCode. Their switcher generates exact commands; for Raven, extract archify.zip into ~/.raven/workspace/skills, which yields ~/.raven/workspace/skills/archify.',
      'step1-h':'Install in one command','step1-p':'Run <code>npx skills add tt-a1i/archify -g</code>, or open the <a href="start.html?agent=cursor&amp;type=architecture">agent-aware quick start</a> for an exact Cursor, Codex, Claude Code, or OpenCode command. Raven is not a switcher target; for a manual ZIP install, extract archify.zip into <code>~/.raven/workspace/skills</code>, which yields <code>~/.raven/workspace/skills/archify</code>.',
      'step2-h':'Describe your system','step2-p':'Describe components, connections, and cloud services — or ask your agent to analyze the repository first.',
      'step3-h':'Ask your agent to draw it','step3-p':'Tell your agent to use Archify. It generates a self-contained HTML file you can open in any browser and refine in chat.',
      'kbd-label':'Keyboard shortcuts','kbd-guide':'Diagram guide','kbd-theme':'Toggle theme','kbd-find':'Find node / route endpoint','kbd-route':'Trace, inspect, and play a route','kbd-radar':'Semantic radar','kbd-lens':'Compare semantic kinds','kbd-present':'Presentation stage','kbd-export':'Open export menu','kbd-focus':'Focus node','kbd-views':'Guided views','kbd-play':'Play story','kbd-zoom':'Reading depth / reset','kbd-nav':'Navigate menu','kbd-close':'Close menu',
      'footer-meta':'development &nbsp;·&nbsp; v[[ARCHIFY_VERSION]] &nbsp;·&nbsp; MIT License<br>Based on Cocoon-AI/architecture-diagram-generator',
      'cta-h':'Describe it once.<br><em>Share the map.</em>',
      'cta-sub':'One command installs the checked skill for Cursor, Claude Code, Codex, or OpenCode — and your next diagram is a chat message away.',
      'cta-install':'Install the skill',
      'footer-changelog':'Changelog','footer-license':'License'
    },
    zh: {
      'nav-guide':'場景指南','nav-gallery':'驗證作品集','nav-start':'快速上手','nav-install':'安裝技能',
      'hero-badge':'Agent 技能 &nbsp;·&nbsp; 開發版 &nbsp;·&nbsp; v[[ARCHIFY_VERSION]]',
      'hero-h1':'用自然語言，<br>生成<em>可信的架構圖。</em>',
      'hero-sub':'在對話中描述你的系統，Archify 生成精美、可探索的 HTML 技術圖——信息會按 MAP → READ → FULL 漸進展開，並內置語義鏡頭、路徑故事、動態效果和超清導出。',
      'hero-cta':'選擇合適的圖','hero-gallery':'查看驗證作品集',
      'proof-live':'實時成品','proof-status':'自動生成 · 檢查通過 · 可交互','proof-receipt':'真實作品集成品 · 9/9 項驗證通過','proof-open':'打開完整成品','proof-hint':'播放會跟隨當前作者時刻的故事，再釘住並分享這個精確節點。',
      'rail-label':'實時標本 · 點擊加載',
      'stat-types':'圖表類型','stat-presets':'視覺預設','stat-themes':'深淺主題','stat-export':'原生導出倍率','stat-deps':'外部依賴',
      'label-types':'圖表類型',
      'types-h2':'五種方式，讀懂你的系統。',
      'types-body':'架構圖、工作流、時序圖、數據流圖、狀態機——描述需求，Archify 自動選擇最合適的可視化語言。',
      'label-gallery':'索引',
      'types-more':'瀏覽完整作品集','types-more-sub':'實時成品 · 全部預設 · 全部圖型',
      'arch-h':'架構圖',
      'arch-p':'系統組件、雲資源、資料庫、緩存、服務、安全組及其連接關係，一圖清晰呈現。',
      'arch-li1':'AWS / GCP / Azure 基礎設施','arch-li2':'微服務拓撲','arch-li3':'安全邊界','arch-li4':'網絡布局',
      'wf-h':'工作流圖',
      'wf-p':'泳道式流程：語義化節點與錨定連線——審批門、異步分支、觀測路徑，逐泳道清晰鋪開。',
      'seq-h':'時序圖',
      'seq-p':'API 調用鏈、請求生命周期、緩存回退路徑、鑑權檢查、異步追蹤——誰調用誰、順序如何、返回什麼。',
      'flow-h':'數據流圖',
      'flow-p':'數據管道、ETL/ELT、分析事件、PII 隔離、數倉同步、數據血緣及下遊消費者——附治理邊界。',
      'life-h':'生命周期圖',
      'life-p':'狀態機、對象生命周期、運行/訂單/部署狀態流轉——含等待態、重試、取消和終態。',
      'label-features':'功能特性',
      'features-h2':'生產級輸出，<br>零配置。',
      'f1-h':'四套視覺身份','f1-p':'Classic、Signal Flow、Blueprint 和 Editorial 共用同一套幾何契約；每套都提供協調的深淺主題並保持乾淨導出。','f1-tag':'4 套預設 · 2 套主題',
      'f2-h':'超清 4× 導出','f2-p':'PNG、JPEG、WebP——由瀏覽器以最高 4 倍解析度原生柵格化，無上採樣模糊。視網膜屏、幻燈片、印刷均清晰。','f2-tag':'PNG · JPEG · WEBP',
      'f3-h':'雙主題 SVG','f3-p':'SVG 導出同時內置深色和淺色變量集，並附 @media prefers-color-scheme 規則。放入 GitHub README，自動跟隨讀者主題。','f3-tag':'矢量 · 自適應主題',
      'f4-h':'複製到剪貼板','f4-p':'一鍵將 PNG 寫入剪貼板，直接粘貼到 Slack、Notion、GitHub 或 Figma，無需手動保存。','f4-tag':'即時分享',
      'f5-h':'獨立 HTML 文件','f5-p':'單個 HTML 文件，零依賴、無需伺服器或構建工具，任意瀏覽器打開即用。作為附件發郵件或貼 PR 評論均可。','f5-tag':'零依賴',
      'f6-h':'對話式迭代','f6-p':'「加一個 Redis」「把鑑權移到左邊」「API 用綠色」——用自然語言精調，無需學習任何圖形編輯器。','f6-tag':'對話驅動',
      'f7-h':'檢查並播放真實路徑','f7-p':'Route Journey 始終保留完整作者路徑，可逐站檢查，也可沿每條精確入向關係播放一次由讀者控制的有限旅程。','f7-tag':'檢查 · 播放 · 暫停',
      'f8-h':'跟隨並分享精確故事時刻','f8-p':'Story Horizon 指出唯一下一站，Semantic Story Carrier 則說明這條真實關係傳遞的是調用、數據、事件、安全還是狀態變化；任意 beat 都可釘住或穩定分享。','f8-tag':'跟隨 · 釘住 · 分享',
      'export-label':'導出格式',
      'exp-png':'透明底 · 4× 解析度','exp-jpg':'主題背景 · 4× 解析度','exp-webp':'體積小 · 4× 解析度','exp-svg':'矢量 · 雙主題','exp-webm':'動態 · 瀏覽器原生','exp-clip-fmt':'剪貼板','exp-clip':'複製 PNG · 即時粘貼',
      'label-palette':'設計系統',
      'palette-h2':'為基礎設施而生的語義色彩系統。',
      'palette-body':'七種組件類型，各有深色與淺色協調變體，隨主題切換同步變換。',
      'chip-frontend':'前端','chip-frontend-use':'客戶端、瀏覽器、移動端、UI',
      'chip-backend':'後端','chip-backend-use':'服務、API、Worker、守護進程',
      'chip-database':'資料庫','chip-database-use':'資料庫、緩存、存儲、AI/ML',
      'chip-cloud':'雲服務','chip-cloud-use':'託管服務、基礎設施',
      'chip-security':'安全','chip-security-use':'鑑權、密鑰、安全網關',
      'chip-bus':'消息總線','chip-bus-use':'Kafka、RabbitMQ、SNS',
      'chip-external':'外部系統','chip-external-use':'用戶、第三方、通用外部',
      'label-qs':'快速開始',
      'qs-h2':'三步上手，<br>即刻運行。',
      'qs-body':'同一份經過檢查的 Skill 可用於 Cursor、Claude Code、Codex 和 OpenCode，切換器會生成準確命令；Raven 採用 ZIP 手動安裝：將 archify.zip 解壓到 ~/.raven/workspace/skills，解壓後會得到 ~/.raven/workspace/skills/archify。',
      'step1-h':'一條命令安裝','step1-p':'運行 <code>npx skills add tt-a1i/archify -g</code>，或打開<a href="start.html?agent=cursor&amp;type=architecture">可切換 Agent 的快速開始頁</a>，獲取準確的 Cursor、Codex、Claude Code 或 OpenCode 命令。Raven 不屬於切換器目標；請將 archify.zip 解壓到 <code>~/.raven/workspace/skills</code>，解壓後會得到 <code>~/.raven/workspace/skills/archify</code>。',
      'step2-h':'描述你的系統','step2-p':'描述組件、連接關係和雲服務，也可以先讓 agent 分析代碼倉庫。',
      'step3-h':'讓 agent 繪製','step3-p':'告訴 agent 使用 Archify，它會生成可在任意瀏覽器打開的單文件 HTML，並可繼續在對話中迭代。',
      'kbd-label':'鍵盤快捷鍵','kbd-guide':'圖表指南','kbd-theme':'切換主題','kbd-find':'查找節點 / 路徑端點','kbd-route':'探查、檢查並播放路徑','kbd-radar':'語義雷達','kbd-lens':'對比語義類型','kbd-present':'演示舞臺','kbd-export':'打開導出菜單','kbd-focus':'聚焦節點','kbd-views':'引導視圖','kbd-play':'播放故事','kbd-zoom':'閱讀層級 / 復位','kbd-nav':'菜單導航','kbd-close':'關閉菜單',
      'footer-meta':'開發版 &nbsp;·&nbsp; v[[ARCHIFY_VERSION]] &nbsp;·&nbsp; MIT 許可證<br>基於 Cocoon-AI/architecture-diagram-generator',
      'cta-h':'描述一次，<br><em>分享這張圖。</em>',
      'cta-sub':'一條命令即可為 Cursor、Claude Code、Codex 或 OpenCode 安裝經過檢查的技能——你的下一張架構圖，只差一句對話。',
      'cta-install':'安裝技能',
      'footer-changelog':'更新日誌','footer-license':'許可證'
    }
  };

  const PROOFS = {
    signal: {
      artifact: 'gallery/artifacts/agent-tool-call.workflow.html',
      view: 'happy-path',
      iframeTitle: { en: 'Agent Tool Call live Archify proof', zh: '智能體工具調用 Archify 實時成品' },
      name: { en: 'Agent Tool Call', zh: '智能體工具調用' },
      meta: { en: 'Workflow · Signal Flow · 12 nodes · 11 edges', zh: '工作流 · Signal Flow · 12 節點 · 11 條關係' },
      title: { en: 'Agent Tool Call — policy, execution, recovery, and evidence', zh: '智能體工具調用——策略、執行、恢復與證據閉環' }
    },
    blueprint: {
      artifact: 'gallery/artifacts/production-deployment.architecture.html',
      view: 'request-boundary',
      iframeTitle: { en: 'Production Deployment live Archify proof', zh: '生產部署架構 Archify 實時成品' },
      name: { en: 'Production Deployment', zh: '生產部署' },
      meta: { en: 'Architecture · Blueprint · 12 nodes · 12 edges', zh: '架構圖 · Blueprint · 12 節點 · 12 條關係' },
      title: { en: 'Production Deployment — regions, ownership, state, and audit', zh: '生產部署——區域、歸屬、狀態與審計邊界' }
    },
    classic: {
      artifact: 'gallery/artifacts/cache-miss.sequence.html',
      view: 'cache-fallback',
      iframeTitle: { en: 'Cache Miss Request live Archify proof', zh: '緩存未命中請求 Archify 實時成品' },
      name: { en: 'Cache Miss', zh: '緩存未命中' },
      meta: { en: 'Sequence · Classic · 7 participants · 12 messages', zh: '時序圖 · Classic · 7 個參與者 · 12 條消息' },
      title: { en: 'Cache Miss — authentication, fallback, return, and trace', zh: '緩存未命中——鑑權、回退、返回與追蹤' }
    }
  };

  let lang = ArchifySiteLanguage.read();
  let activeProof = 'signal';
  const btnLang = document.getElementById('btn-lang');
  const proofStage = document.getElementById('hero-proof-stage');
  const proofFrame = document.getElementById('hero-proof-frame');
  const proofPanel = document.getElementById('hero-proof-panel');
  const proofOpen = document.getElementById('proof-open');
  const proofMeta = document.getElementById('proof-meta');
  const proofTitle = document.getElementById('proof-title');

  function proofEmbedUrl(proof, { play = false } = {}) {
    const playback = play ? '&play=1' : '';
    return `${proof.artifact}?embed=1${playback}&theme=dark#view=${encodeURIComponent(proof.view)}`;
  }

  function fillRail() {
    document.querySelectorAll('.spec-card').forEach(card => {
      const proof = PROOFS[card.dataset.proof];
      if (!proof) return;
      card.querySelector('.spec-name').textContent = proof.name[lang];
      card.querySelector('.spec-meta').textContent = proof.meta[lang];
    });
  }

  function renderProof(key, { focus = false, deliberate = false } = {}) {
    const proof = PROOFS[key];
    if (!proof) return;
    activeProof = key;
    document.querySelectorAll('.spec-card').forEach(tab => {
      const selected = tab.dataset.proof === key;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    const selectedTab = document.querySelector(`.spec-card[data-proof="${key}"]`);
    proofPanel.setAttribute('aria-labelledby', selectedTab.id);
    proofOpen.href = `${proof.artifact}?present=1&play=1#view=${encodeURIComponent(proof.view)}`;
    proofMeta.textContent = proof.meta[lang];
    proofTitle.textContent = proof.title[lang];
    proofFrame.title = proof.iframeTitle[lang];
    if (proofFrame.dataset.proof !== key) {
      if (deliberate) proofStage.dataset.proofPlayback = 'deliberate';
      proofStage.classList.add('is-loading');
      proofFrame.dataset.proof = key;
      proofFrame.src = proofEmbedUrl(proof, { play: deliberate });
    }
  }

  proofFrame.addEventListener('load', () => {
    proofStage.classList.remove('is-loading');
  });
  document.querySelectorAll('.spec-card').forEach(tab => {
    tab.addEventListener('click', () => renderProof(tab.dataset.proof, { deliberate: true }));
    tab.addEventListener('keydown', event => {
      const tabs = [...document.querySelectorAll('.spec-card')];
      const current = tabs.indexOf(tab);
      let next = current;
      if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      renderProof(tabs[next].dataset.proof, { focus: true, deliberate: true });
    });
  });

  function applyLang(l) {
    lang = ArchifySiteLanguage.write(l);
    document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';
    btnLang.textContent = lang === 'zh' ? 'EN' : '中文';
    btnLang.setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切換到中文');
    const dict = LANGS[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = dict[el.dataset.i18n];
      if (v !== undefined) el.innerHTML = v;
    });
    fillRail();
    renderProof(activeProof);
    document.getElementById('code-en').style.display = lang === 'en' ? '' : 'none';
    document.getElementById('code-zh').style.display = lang === 'zh' ? '' : 'none';
  }

  btnLang.addEventListener('click', () => applyLang(lang === 'en' ? 'zh' : 'en'));
  applyLang(lang);

  /* ══ Intersection observer ══ */
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold:.12, rootMargin:'0px 0px -40px 0px' });
    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
  } else {
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
  }
