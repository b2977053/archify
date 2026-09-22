
    (function () {
      'use strict';
      var recipes = JSON.parse(document.getElementById('guide-data').textContent);
      var types = ["architecture","workflow","sequence","dataflow","lifecycle"];
      var colors = { architecture:'#0891b2', workflow:'#047857', sequence:'#6d28d9', dataflow:'#b45309', lifecycle:'#be123c' };
      var language = ArchifySiteLanguage.read();
      var activeType = 'all';
      var lastRecipe = null;
      var copy = {
        en: {
          navGuide:'Guide',navProof:'Proof Lab',navStart:'Start',navInstall:'Install Skill',versionLabel:'Scenario guide / development / v[[ARCHIFY_VERSION]]',eyebrow:'Question-first diagramming', headline:'Choose the question.<br>Get the <em>right diagram.</em>', lede:'Describe what your audience needs to understand. Archify recommends one bounded visual recipe—plus the evidence it must contain, when not to use it, and a prompt you can copy.',
          metricRecipes:'real-world<br>recipes',metricModes:'typed diagram<br>modes',metricRuntime:'runtime<br>dependencies',chooserTitle:'What must the diagram explain?',chooserBody:'Write a situation, not a diagram type. Specific system facts produce a stronger recommendation.',placeholder:'Example: Show an API request with JWT auth, a Redis cache miss, database fallback, and async tracing.',recommend:'Recommend a recipe →',clear:'Clear',libraryEyebrow:'Recipe library',libraryTitle:'Eleven small, opinionated starting points.',libraryBody:'Each recipe answers one technical question. That boundary keeps the result legible, reviewable, and honest about missing evidence.',footerLeft:'Generated from the same recipe source as the Archify CLI.',all:'All recipes',recommended:'Recommended recipe',use:'Use when',avoid:'Avoid when',must:'Evidence to include',presentation:'Presentation',prompt:'Copy-ready prompt',copyPrompt:'Copy prompt',copied:'Copied',alternatives:'Other possible fits:',confidence:'confidence',open:'Open recipe',proofReady:'Verified proof',proofLink:'Open verified example ↗',
          samples:[['API + cache miss','Show an API request with JWT auth, a Redis cache miss, database fallback, and async tracing.'],['Kafka + DLQ','Map Kafka topics, ordered processors, consumer groups, replay, state stores, and the dead-letter queue.'],['Incident response','Show how responders detect, triage, mitigate, escalate, communicate, and verify recovery.']]
        },
        zh: {
          navGuide:'場景指南',navProof:'驗證作品集',navStart:'快速上手',navInstall:'安裝技能',versionLabel:'場景指南 / 開發版 / v[[ARCHIFY_VERSION]]',eyebrow:'先問題，後圖表',headline:'先選對問題，<br>再得到<em>對的圖。</em>',lede:'描述受眾真正需要理解的內容。Archify 會推薦一個有邊界的視覺配方，同時給出證據清單、禁用條件和可複製提示詞。',
          metricRecipes:'個真實場景<br>配方',metricModes:'種類型化<br>圖表模式',metricRuntime:'個運行時<br>依賴',chooserTitle:'這張圖必須解釋什麼？',chooserBody:'寫清場景，不要只寫圖表類型。系統事實越具體，推薦越可靠。',placeholder:'例如：展示帶 JWT 鑑權、Redis 緩存未命中、資料庫回退和異步追蹤的 API 請求。',recommend:'推薦配方 →',clear:'清空',libraryEyebrow:'配方庫',libraryTitle:'十一個小而專的起點。',libraryBody:'每個配方只回答一個技術問題。清晰的邊界讓圖更易讀、可評審，也不會掩蓋證據缺口。',footerLeft:'網頁與 Archify CLI 使用同一份配方數據生成。',all:'全部配方',recommended:'推薦配方',use:'適合',avoid:'不要這樣用',must:'必須包含的證據',presentation:'表現建議',prompt:'可直接複製的提示詞',copyPrompt:'複製提示詞',copied:'已複製',alternatives:'其他可能：',confidence:'置信度',open:'打開配方',proofReady:'已驗證成品',proofLink:'打開驗證成品 ↗',
          samples:[['API + 緩存未命中','展示帶 JWT 鑑權、Redis 緩存未命中、資料庫回退和異步追蹤的 API 請求。'],['Kafka + 死信','梳理 Kafka Topic、有序處理器、消費者組、重放、狀態存儲和死信隊列。'],['事故處置','展示響應者如何發現、分診、緩解、升級、溝通並驗證恢復。']]
        }
      };

      function t(key) { return copy[language][key]; }
      function local(recipe) { return Object.assign({}, recipe, recipe[language]); }
      function normalize(value) { return String(value || '').normalize('NFKC').toLowerCase().replace(/[\s_]+/g,' ').trim(); }
      function rank(query) {
        var text = normalize(query);
        return recipes.map(function (recipe,index) {
          var score = 0, matched = [];
          if (text === recipe.id || text === recipe.id.replace(/-/g,' ')) { score = 100; matched = [recipe.id]; }
          else recipe.signals.forEach(function (signal) { if (text.includes(normalize(signal[0]))) { score += signal[1]; matched.push(signal[0]); } });
          return { recipe:recipe, score:score, matched:matched, index:index };
        }).sort(function (a,b) { return b.score - a.score || a.index - b.index; });
      }
      function recommendation(query) {
        var ranked = rank(query), winner = ranked[0].score > 0 ? ranked[0] : { recipe:recipes[0], score:0, matched:[] };
        return { recipe:winner.recipe, confidence:winner.score >= 14 ? 'high' : winner.score >= 7 ? 'medium' : 'low', alternatives:ranked.filter(function (entry) { return entry.recipe.id !== winner.recipe.id && entry.score > 0; }).slice(0,2) };
      }
      function escapeHtml(value) { var node = document.createElement('span'); node.textContent = String(value); return node.innerHTML; }
      function renderSamples() {
        document.getElementById('samples').innerHTML = t('samples').map(function (sample) { return '<button class="chip" type="button" data-query="'+escapeHtml(sample[1])+'">'+escapeHtml(sample[0])+'</button>'; }).join('');
      }
      function renderFilters() {
        var labels = {"en":{"architecture":"Architecture","workflow":"Workflow","sequence":"Sequence","dataflow":"Data flow","lifecycle":"Lifecycle"},"zh":{"architecture":"架構圖","workflow":"工作流","sequence":"時序圖","dataflow":"數據流","lifecycle":"生命周期"}};
        document.getElementById('filters').innerHTML = ['all'].concat(types).map(function (type) { return '<button class="filter '+(activeType === type ? 'active':'')+'" type="button" data-filter="'+type+'">'+escapeHtml(type === 'all' ? t('all') : labels[language][type])+'</button>'; }).join('');
      }
      function renderCards() {
        var visible = recipes.filter(function (recipe) { return activeType === 'all' || recipe.type === activeType; });
        document.getElementById('cards').innerHTML = visible.map(function (raw) {
          var recipe = local(raw);
          return '<button class="card" type="button" data-recipe="'+recipe.id+'" style="--type-color:'+colors[recipe.type]+'"><span class="card-type">'+escapeHtml(recipe.type)+'</span><h3>'+escapeHtml(recipe.title)+'</h3><p class="card-question">'+escapeHtml(recipe.question)+'</p><p class="card-summary">'+escapeHtml(recipe.summary)+'</p><span class="card-foot"><span>'+escapeHtml(recipe.presentation.preset)+' · '+escapeHtml(recipe.presentation.motion)+'</span><span>'+escapeHtml(recipe.proof ? t('proofReady') : t('open'))+' ↗</span></span></button>';
        }).join('');
      }
      function renderResult(rawRecipe, confidence, alternatives) {
        var recipe = local(rawRecipe);
        lastRecipe = rawRecipe;
        var alt = alternatives || [];
        var html = '<div class="result-main"><div><span class="result-kicker">'+escapeHtml(t('recommended'))+' · '+escapeHtml(confidence)+' '+escapeHtml(t('confidence'))+'</span><h3>'+escapeHtml(recipe.title)+'</h3><p class="result-question">'+escapeHtml(recipe.question)+'</p><p class="result-summary">'+escapeHtml(recipe.summary)+'</p>'+(recipe.proof ? '<a class="proof-link" href="gallery.html#proof-'+encodeURIComponent(recipe.proof)+'">'+escapeHtml(t('proofLink'))+'</a>' : '')+'</div><div class="boundary"><div class="boundary-item"><small>'+escapeHtml(t('use'))+'</small><p>'+escapeHtml(recipe.useWhen)+'</p></div><div class="boundary-item avoid"><small>'+escapeHtml(t('avoid'))+'</small><p>'+escapeHtml(recipe.avoidWhen)+'</p></div></div></div>';
        html += '<div class="result-grid"><div class="checklist"><div class="mini-heading">'+escapeHtml(t('must'))+'</div><ul>'+recipe.include.map(function (item) { return '<li>'+escapeHtml(item)+'</li>'; }).join('')+'</ul><div class="presentation"><span class="tag">'+escapeHtml(recipe.type)+'</span><span class="tag">'+escapeHtml(recipe.presentation.preset)+'</span><span class="tag">'+escapeHtml(recipe.presentation.motion)+'</span><span class="tag">views '+escapeHtml(recipe.presentation.views)+'</span></div></div>';
        html += '<div class="prompt-box"><div class="prompt-bar"><div class="mini-heading" style="margin:0">'+escapeHtml(t('prompt'))+'</div><button class="copy" id="copy-prompt" type="button">'+escapeHtml(t('copyPrompt'))+'</button></div><p class="prompt-text">'+escapeHtml(recipe.prompt)+'</p></div></div>';
        if (alt.length) html += '<div class="alternatives">'+escapeHtml(t('alternatives'))+alt.map(function (entry) { var item=local(entry.recipe); return '<button type="button" data-alt="'+item.id+'">'+escapeHtml(item.title)+' ['+item.type+']</button>'; }).join('')+'</div>';
        var result = document.getElementById('result');
        result.innerHTML = html;
        result.classList.add('visible');
      }
      function runRecommendation() {
        var query = document.getElementById('scenario').value.trim();
        if (!query) { document.getElementById('scenario').focus(); return; }
        var picked = recommendation(query);
        renderResult(picked.recipe,picked.confidence,picked.alternatives);
      }
      function applyLanguage(next) {
        language = ArchifySiteLanguage.write(next);
        document.documentElement.lang = language === 'zh' ? 'zh-TW' : 'en';
        document.getElementById('language').textContent = language === 'zh' ? 'EN' : '中文';
        document.getElementById('language').setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切換到中文');
        document.querySelectorAll('[data-en][data-zh]').forEach(function (node) { node.textContent=node.getAttribute(language === 'zh' ? 'data-zh' : 'data-en'); });
        document.querySelectorAll('[data-i18n]').forEach(function (node) { node.textContent=t(node.dataset.i18n); });
        document.querySelectorAll('[data-i18n-html]').forEach(function (node) { node.innerHTML=t(node.dataset.i18nHtml); });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (node) { node.placeholder=t(node.dataset.i18nPlaceholder); });
        renderSamples(); renderFilters(); renderCards();
        if (lastRecipe) renderResult(lastRecipe,'selected',[]);
      }
      async function copyPrompt() {
        if (!lastRecipe) return;
        var text = local(lastRecipe).prompt, button = document.getElementById('copy-prompt');
        try { await navigator.clipboard.writeText(text); } catch (_) {
          var area=document.createElement('textarea'); area.value=text; document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove();
        }
        button.textContent=t('copied'); setTimeout(function () { if (button.isConnected) button.textContent=t('copyPrompt'); },1200);
      }
      document.getElementById('recommend').addEventListener('click',runRecommendation);
      document.getElementById('clear').addEventListener('click',function () { document.getElementById('scenario').value=''; document.getElementById('result').classList.remove('visible'); lastRecipe=null; });
      document.getElementById('language').addEventListener('click',function () { applyLanguage(language === 'en' ? 'zh':'en'); });
      document.getElementById('scenario').addEventListener('keydown',function (event) { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') runRecommendation(); });
      document.getElementById('samples').addEventListener('click',function (event) { var chip=event.target.closest('[data-query]'); if (!chip) return; document.getElementById('scenario').value=chip.dataset.query; runRecommendation(); });
      document.getElementById('filters').addEventListener('click',function (event) { var filter=event.target.closest('[data-filter]'); if (!filter) return; activeType=filter.dataset.filter; renderFilters(); renderCards(); });
      document.getElementById('cards').addEventListener('click',function (event) { var card=event.target.closest('[data-recipe]'); if (!card) return; var recipe=recipes.find(function (item) { return item.id === card.dataset.recipe; }); renderResult(recipe,'selected',[]); document.getElementById('result').scrollIntoView({behavior:'smooth',block:'center'}); });
      document.getElementById('result').addEventListener('click',function (event) { if (event.target.id === 'copy-prompt') copyPrompt(); var alt=event.target.closest('[data-alt]'); if (alt) renderResult(recipes.find(function (item) { return item.id === alt.dataset.alt; }),'selected',[]); });
      applyLanguage(language);
    }());
