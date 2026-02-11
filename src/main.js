// 設定：分類模板（可被使用者覆寫）
function defaultCategories() {
    return [
        // Google Workspace (G Suite) 優先排序
        {
            key: 'gdocs', label: 'Google Docs', enabled: true,
            matchers: [{ type: 'regex', value: 'docs\\.google\\.com\\/document' }],
            iconUrl: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon-2023q4.ico'
        },
        {
            key: 'gsheets', label: 'Google Sheets', enabled: true,
            matchers: [{ type: 'regex', value: 'docs\\.google\\.com\\/spreadsheets' }],
            iconUrl: 'https://ssl.gstatic.com/docs/spreadsheets/spreadsheets_2023q4.ico'
        },
        {
            key: 'gslides', label: 'Google Slides', enabled: true,
            matchers: [{ type: 'regex', value: 'docs\\.google\\.com\\/presentation' }],
            iconUrl: 'https://ssl.gstatic.com/docs/presentations/images/favicon-2023q4.ico'
        },
        {
            key: 'gcal', label: 'Google Meet', enabled: false,
            matchers: [{ type: 'domain', value: 'meet.google.com' }]
        },
        {
            key: 'youtube', label: 'YouTube', enabled: false,
            matchers: [{ type: 'domain', value: 'youtube.com' }, { type: 'domain', value: 'www.youtube.com' }, { type: 'domain', value: 'youtu.be' }],
            iconUrl: 'https://www.youtube.com/s/desktop/9123e71c/img/favicon_32x32.png'
        },
        {
            key: 'gcp', label: 'Google Cloud', enabled: false,
            matchers: [
                { type: 'domain', value: 'console.cloud.google.com' },
                { type: 'domain', value: 'cloud.google.com' }
            ]
        },
        {
            key: 'aws', label: 'AWS', enabled: true,
            matchers: [
                { type: 'regex', value: '(^|\\.)aws\\.amazon\\.com|console\\.aws\\.amazon\\.com' }
            ]
        },
        {
            key: 'azure', label: 'Azure', enabled: false,
            matchers: [
                { type: 'domain', value: 'portal.azure.com' },
                { type: 'domain', value: 'azure.microsoft.com' }
            ]
        },

        // 任務追蹤與協作工具
        {
            key: 'clickup', label: 'ClickUp', enabled: false,
            matchers: [{ type: 'domain', value: 'clickup.com' }, { type: 'domain', value: 'app.clickup.com' }],
            iconUrl: 'https://app-cdn.clickup.com/assets/favicons/favicon-32x32.png'
        },
        {
            key: 'jira', label: 'Jira', enabled: false,
            matchers: [{ type: 'regex', value: '\\.atlassian\\.net' }, { type: 'regex', value: 'jira\\.' }]
        },
        {
            key: 'linear', label: 'Linear', enabled: false,
            matchers: [{ type: 'domain', value: 'linear.app' }]
        },
        {
            key: 'asana', label: 'Asana', enabled: false,
            matchers: [{ type: 'domain', value: 'asana.com' }, { type: 'domain', value: 'app.asana.com' }]
        },
        {
            key: 'trello', label: 'Trello', enabled: false,
            matchers: [{ type: 'domain', value: 'trello.com' }]
        },

        // 版本控制與開發工具
        {
            key: 'gitlab', label: 'GitLab', enabled: true,
            matchers: [{ type: 'regex', value: 'gitlab\\.com|\\.gitlab\\.' }]
        },
        {
            key: 'github', label: 'GitHub', enabled: false,
            matchers: [{ type: 'domain', value: 'github.com' }, { type: 'domain', value: 'gist.github.com' }]
        },

        // 設計與協作工具
        {
            key: 'figma', label: 'Figma', enabled: true,
            matchers: [{ type: 'domain', value: 'figma.com' }]
        },
        {
            key: 'miro', label: 'Miro', enabled: false,
            matchers: [{ type: 'domain', value: 'miro.com' }]
        },

        // 知識管理與筆記
        {
            key: 'notion', label: 'Notion', enabled: false,
            matchers: [{ type: 'domain', value: 'notion.so' }, { type: 'domain', value: 'www.notion.so' }]
        },
    ];
}

const DEFAULT_SETTINGS = {
    perCategoryLimit: 12,
    recentDays: 60,
    sortBy: 'latest', // 'latest' | 'smart'
    ui: { fixHeightEnabled: true, colCount: 3, privacyCurtainEnabled: false, privacyCurtainLocked: false },
    pinned: {},
    shortcuts: [], // [{url, title, favicon}]
    categories: defaultCategories()
};

// DOM refs
const $grid = document.getElementById('grid');
const $search = document.getElementById('search');
const $refreshBtn = document.getElementById('refreshBtn');
const $settingsBtn = document.getElementById('settingsBtn');
const $curtainBtn = document.getElementById('curtainBtn');
const $settingsDialog = document.getElementById('settingsDialog');
const $limitInput = document.getElementById('limitInput');
const $daysInput = document.getElementById('daysInput');
const $sortSelect = document.getElementById('sortSelect');
const $colCountSelect = document.getElementById('colCountSelect');

// 分類管理（UI）
const $categoriesUI = document.getElementById('categoriesUI');
const $addCategoryBtn = document.getElementById('addCategoryBtn');
const $resetCategoriesUIButton = document.getElementById('resetCategoriesUIButton');
const $saveCategoriesUIButton = document.getElementById('saveCategoriesUIButton');

const $focusDialog = document.getElementById('focusDialog');
const $focusList = document.getElementById('focusList');
const $focusDot = document.getElementById('focusDot');
const $focusCloseBtn = document.getElementById('focusCloseBtn');
const $langSelect = document.getElementById('langSelect');

// Shortcuts
const $shortcutsContainer = document.getElementById('shortcutsContainer');
const $shortcutsScroll = document.getElementById('shortcutsScroll');
const $shortcutsLeftBtn = document.getElementById('shortcutsLeftBtn');
const $shortcutsRightBtn = document.getElementById('shortcutsRightBtn');
const $addShortcutBtn = document.getElementById('addShortcutBtn');
const $addShortcutDialog = document.getElementById('addShortcutDialog');
const $shortcutUrlInput = document.getElementById('shortcutUrlInput');
const $shortcutCancelBtn = document.getElementById('shortcutCancelBtn');
const $shortcutConfirmBtn = document.getElementById('shortcutConfirmBtn');

let STATE = {
    settings: DEFAULT_SETTINGS,
    items: [], // 原始歷史：{title, url, lastVisitTime, visitCount}
    filtered: [], // 過濾後（符合分類）
    cats: {}, // 最新一次 categorize 結果
    focusKey: null,
};

// Storage helpers（含深度合併）
function deepMerge(base, patch) {
    if (!patch) return JSON.parse(JSON.stringify(base));
    const out = Array.isArray(base) ? [...base] : { ...base };
    for (const k of Object.keys(patch)) {
        if (patch[k] && typeof patch[k] === 'object' && !Array.isArray(patch[k])) {
            out[k] = deepMerge(base[k] || {}, patch[k]);
        } else {
            out[k] = patch[k];
        }
    }
    return out;
}

function loadSettings() {
    return new Promise(resolve => {
        if (!chrome?.storage?.local) return resolve(DEFAULT_SETTINGS);
        chrome.storage.local.get(['settings'], res => {
            let s = deepMerge(DEFAULT_SETTINGS, res.settings || {});
            // 若缺 categories 或為空，補上預設
            if (!Array.isArray(s.categories) || s.categories.length === 0) s.categories = defaultCategories();
            // 兼容舊版（沒有 ui/sortBy）
            if (!s.ui) s.ui = { fixHeightEnabled: true, colCount: 3 };
            if (!s.sortBy) s.sortBy = 'latest';
            // 確保有 shortcuts 陣列
            if (!Array.isArray(s.shortcuts)) s.shortcuts = [];

            // 確保有 privacyCurtainLocked 屬性
            if (typeof s.ui.privacyCurtainLocked === 'undefined') {
                s.ui.privacyCurtainLocked = false;
            }

            // 如果門簾被鎖定，則每次初始化時都啟用門簾
            if (s.ui.privacyCurtainLocked) {
                s.ui.privacyCurtainEnabled = true;
            }

            resolve(s);
        });
    });
}
function saveSettings(settings) {
    return new Promise(resolve => {
        if (!chrome?.storage?.local) return resolve();
        chrome.storage.local.set({ settings }, resolve);
    });
}

// URL 工具
function getFavicon(url) {
    try { const u = new URL(url); return `${u.origin}/favicon.ico`; } catch { return ''; }
}

function getHostname(url) {
    try { return new URL(url).hostname; } catch { return ''; }
}

function getFallbackFavicon(url) {
    const host = getHostname(url);
    if (!host) return defaultIconDataUri();
    return `https://www.google.com/s2/favicons?sz=32&domain=${encodeURIComponent(host)}`;
}

function defaultIconDataUri() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" rx="3" fill="#5b6b7c"/><path d="M8 3a5 5 0 100 10 5 5 0 000-10z" fill="#cfd8e3"/></svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function applyColumnCount(n) {
    n = Math.max(1, Math.min(4, parseInt(n || 3, 10)));
    if ($grid) {
        $grid.style.setProperty('--col', String(n));
    }
}

// 分類管理（UI）輔助
function slugify(s = '') { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }

function genUniqueKey(base, existing) {
    let k = slugify(base) || 'category';
    let i = 1, c = k;
    while (existing.has(c)) c = `${k}-${i++}`;
    return c;
}

function renderCategoriesUI(cats = []) {
    if (!$categoriesUI) return;
    $categoriesUI.innerHTML = '';
    for (const cat of cats) {
        const div = document.createElement('div');
        div.className = 'cat';
        div.dataset.key = cat.key;
        div.style.border = '1px solid var(--stroke)';
        div.style.borderRadius = '10px';
        div.style.padding = '8px';
        div.style.display = 'grid';
        div.style.gap = '6px';

        const enabled = cat.enabled !== false ? 'checked' : '';
        const matchers = Array.isArray(cat.matchers) ? cat.matchers : [];
        const matcherRows = matchers.map(m => `
      <div class="matcher" style="display:flex; gap:8px; align-items:center;">
        <select class="m-type" style="width:110px; padding:6px 8px; border-radius:8px; border:1px solid var(--stroke); background: rgba(255,255,255,0.06); color:var(--text);">
          <option value="domain" ${m.type === 'domain' ? 'selected' : ''}>domain</option>
          <option value="prefix" ${m.type === 'prefix' ? 'selected' : ''}>prefix</option>
          <option value="regex" ${m.type === 'regex' ? 'selected' : ''}>regex</option>
        </select>
        <input class="m-value" type="text" value="${escapeHtml(m.value || '')}" placeholder="${t('matcherValue')}" style="flex:1; padding:6px 8px; border-radius:8px; border:1px solid var(--stroke); background: rgba(255,255,255,0.06); color:var(--text);" />
        <button type="button" class="btn remove-matcher">${getSvgIcon('dash')}</button>
      </div>
    `).join('');

        div.innerHTML = `
      <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
        <input type="checkbox" class="cat-enabled" ${enabled} />
        <input type="text" class="cat-label" value="${escapeHtml(cat.label || '')}" placeholder="${t('categoryLabel')}" style="flex:1 1 160px; padding:6px 8px; border-radius:8px; border:1px solid var(--stroke); background: rgba(255,255,255,0.06); color:var(--text);" />
        <input type="text" class="cat-key" value="${escapeHtml(cat.key || '')}" placeholder="${t('categoryKey')}" title="僅限小寫英數與 -，需唯一" style="flex:0 0 160px; padding:6px 8px; border-radius:8px; border:1px solid var(--stroke); background: rgba(255,255,255,0.06); color:var(--text);" />
        <input type="url" class="cat-icon" value="${escapeHtml(cat.iconUrl || '')}" placeholder="${t('categoryIcon')}" style="flex:1 1 220px; min-width:220px; padding:6px 8px; border-radius:8px; border:1px solid var(--stroke); background: rgba(255,255,255,0.06); color:var(--text);" />
        <div style="display:flex; gap:6px;">
          <button type="button" class="btn cat-up" title="${t('btnMoveUp')}">${getSvgIcon('chevronUp')}</button>
          <button type="button" class="btn cat-down" title="${t('btnMoveDown')}">${getSvgIcon('chevronDown')}</button>
          <button type="button" class="btn cat-delete" title="${t('btnDeleteCategory')}">${getSvgIcon('trash')}</button>
        </div>
      </div>
      <div class="matchers" style="display:grid; gap:6px;">
        ${matcherRows}
        <div><button type="button" class="btn add-matcher">${t('btnAddMatcher')}</button></div>
      </div>
    `;
        $categoriesUI.appendChild(div);
    }
}

function readCategoriesFromUI() {
    if (!$categoriesUI) return [];
    const out = [];
    const used = new Set();
    for (const el of $categoriesUI.querySelectorAll('.cat')) {
        const enabled = el.querySelector('.cat-enabled')?.checked ?? true;
        let key = (el.querySelector('.cat-key')?.value || '').trim();
        const label = (el.querySelector('.cat-label')?.value || '').trim();
        const iconUrl = (el.querySelector('.cat-icon')?.value || '').trim();
        if (!label) throw new Error('存在未填標題的分類');
        key = slugify(key || label);
        if (!key) throw new Error('存在無效 key 的分類');
        if (used.has(key)) throw new Error('分類 key 重複：' + key);
        used.add(key);
        const matchers = [];
        for (const m of el.querySelectorAll('.matcher')) {
            const type = m.querySelector('.m-type')?.value || 'domain';
            const value = (m.querySelector('.m-value')?.value || '').trim();
            if (!value) continue;
            matchers.push({ type, value });
        }
        const obj = { key, label, enabled, matchers };
        if (iconUrl) obj.iconUrl = iconUrl;
        out.push(obj);
    }
    return out;
}

// 排序分數（智慧排序）
function rankScore(item) {
    const now = Date.now();
    const recency = Math.max(0, 1 - (now - item.lastVisitTime) / (1000 * 60 * 60 * 24 * 90));
    const freq = Math.log(1 + (item.visitCount || 1)) / Math.log(10);
    const titleBoost = /dashboard|project|board|task|issue|merge|doc|sheet|slide|console|compute|s3|ec2|rds/i.test(item.title || '') ? 0.15 : 0;
    return recency * 0.6 + freq * 0.4 + titleBoost;
}

// 分類比對
function matchUrl(url, matchers = []) {
    for (const m of matchers) {
        const v = m.value || '';
        try {
            if (m.type === 'regex') {
                const re = new RegExp(v, 'i');
                if (re.test(url)) return true;
            } else if (m.type === 'domain') {
                const host = getHostname(url);
                if (!host) continue;
                if (host === v || host.endsWith('.' + v)) return true;
            } else if (m.type === 'prefix') {
                if (url.startsWith(v)) return true;
            }
        } catch { /* 忽略單筆錯誤 */ }
    }
    return false;
}

// 以使用者設定做分類（每個 item 僅屬於第一個命中的分類）
function categorize(items) {
    const cats = {};
    const order = (STATE.settings.categories || []).filter(c => c.enabled !== false);
    for (const c of order) cats[c.key] = [];

    for (const it of items) {
        const url = it.url || '';
        for (const c of order) {
            if (matchUrl(url, c.matchers)) { cats[c.key].push(it); break; }
        }
    }

    // 排序與截斷
    for (const c of order) {
        const list = cats[c.key] || [];
        list.sort((a, b) => {
            // 釘選置頂
            const pa = STATE.settings.pinned[a.url] ? 1 : 0;
            const pb = STATE.settings.pinned[b.url] ? 1 : 0;
            if (pa !== pb) return pb - pa;
            if (STATE.settings.sortBy === 'smart') return rankScore(b) - rankScore(a);
            // latest
            return (b.lastVisitTime || 0) - (a.lastVisitTime || 0);
        });
        cats[c.key] = list.slice(0, STATE.settings.perCategoryLimit);
    }
    STATE.cats = cats;
    return cats;
}

function escapeHtml(s = '') {
    return s.replace(/[&<>"']/g, c => ({ '&': '&', '<': '<', '>': '>', '"': '"', "'": '&#39;' }[c]));
}

function formatDays(ts) {
    if (!ts) return '未知時間';
    const days = Math.max(0, Math.floor((Date.now() - ts) / (1000 * 60 * 60 * 24)));
    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    return `${days}d`;
}

async function fetchHistory() {
    const days = STATE.settings.recentDays;
    const startTime = Date.now() - days * 24 * 60 * 60 * 1000;
    const results = await new Promise(resolve => {
        if (!chrome?.history?.search) return resolve([]);
        chrome.history.search({ text: '', startTime, maxResults: 5000 }, resolve);
    });

    const map = new Map();
    for (const r of results) {
        const url = r.url;
        if (!url) continue;
        if (!/^https?:\/\//i.test(url)) continue;
        const prev = map.get(url);
        if (prev) {
            prev.visitCount = (prev.visitCount || 1) + (r.visitCount || 1);
            prev.lastVisitTime = Math.max(prev.lastVisitTime || 0, r.lastVisitTime || 0);
            prev.title = prev.title || r.title;
        } else {
            map.set(url, {
                url,
                title: r.title || '',
                lastVisitTime: r.lastVisitTime || 0,
                visitCount: r.visitCount || 1
            });
        }
    }
    STATE.items = [...map.values()];
    // 僅保留可能屬於任一分類的項，做初步過濾
    const order = (STATE.settings.categories || []).filter(c => c.enabled !== false);
    STATE.filtered = STATE.items.filter(it => order.some(c => matchUrl(it.url, c.matchers)));
}

function renderListItems($container, list, opts = {}) {
    $container.innerHTML = '';
    for (const it of list) {
        const pinActive = !!STATE.settings.pinned[it.url];
        const el = document.createElement('a');
        el.className = 'item';
        el.href = it.url;
        el.target = '_blank';
        el.rel = 'noreferrer';
        el.innerHTML = `
      <div class="meta">
        <div class="favicon"><img src="${getFavicon(it.url)}" alt=""></div>
        <div style="min-width:0;">
          <span class="titleline" title="${escapeHtml(it.title || it.url)}">${escapeHtml(it.title || it.url)}</span>
          <span class="urlline" title="${escapeHtml(it.url)}">${escapeHtml(it.url.replace(/^https?:\/\//, ''))}</span>
        </div>
      </div>
      <div class="actions">
        <span class="chip">${formatDays(it.lastVisitTime)} • ${it.visitCount || 1} visit</span>
        <button class="pin ${pinActive ? 'active' : ''}" title="固定/取消固定" type="button" data-url="${encodeURIComponent(it.url)}">
        <span style="color:#df5656">${getSvgIcon('pin')}</span>
        </button>
      </div>
    `;
        // 圖示 fallback：優先使用分類自定圖示，再用網站 favicon，最後用內建 SVG
        const $img = el.querySelector('.favicon img');
        if ($img) {
            const candidates = [];
            const catIcon = opts.catIconUrl;
            if (catIcon) candidates.push(catIcon);
            candidates.push(getFavicon(it.url));
            candidates.push(getFallbackFavicon(it.url));
            candidates.push(defaultIconDataUri());
            let idx = 0;
            const tryNext = () => {
                if (idx >= candidates.length) return;
                const src = candidates[idx++];
                $img.src = src;
            };
            $img.onerror = tryNext;
            tryNext();
        }
        $container.appendChild(el);
    }
}

function renderGrid(cats, query = '') {
    $grid.innerHTML = '';
    const q = query.trim().toLowerCase();
    const order = (STATE.settings.categories || []).filter(c => c.enabled !== false);

    for (const cat of order) {
        const list = cats[cat.key] || [];
        const filtered = q
            ? list.filter(it => (it.title || '').toLowerCase().includes(q) || (it.url || '').toLowerCase().includes(q))
            : list;
        if (!filtered.length) continue;

        const card = document.createElement('section');
        card.className = `card ${cat.key}`;
        const count = filtered.length;

        const countText = t('cardItemCount').replace('{count}', count);
        card.innerHTML = `
      <div class="card-header">
        <div class="card-title">
          <span class="dot"></span>
          <span>${cat.label}</span>
          <span class="tag">${countText}</span>
        </div>
        <div class="actions">
          <button class="btn focus-btn" type="button" data-key="${cat.key}" title="聚焦檢視">
          ${getSvgIcon('enlarge')}
          </button>
        </div>
      </div>
      <div class="list-container">
        <div class="list"></div>
      </div>
    `;

        const $listContainer = card.querySelector('.list-container');
        const $list = card.querySelector('.list');

        // 固定高度永遠啟用：最多顯示 N 筆，溢位滾動；若實際 < N，則高度自然收縮
        {
            const n = Math.max(1, Number(STATE.settings.perCategoryLimit || 5));
            $list.style.maxHeight = `calc(var(--row-h) * ${n})`;
            $list.style.overflow = 'auto';
        }

        renderListItems($list, filtered, { catIconUrl: cat.iconUrl || '' });

        // 將門簾加到 list-container 而非 list 內部
        if (STATE.settings.ui?.privacyCurtainEnabled) {
            const curtain = makeCurtain();
            $listContainer.appendChild(curtain);
        }

        $grid.appendChild(card);
    }
}

function getCategoryFullList(key) {
    const order = (STATE.settings.categories || []).filter(c => c.enabled !== false);
    const cat = order.find(c => c.key === key);
    if (!cat) return [];
    const list = STATE.filtered.filter(it => matchUrl(it.url, cat.matchers));
    list.sort((a, b) => {
        const pa = STATE.settings.pinned[a.url] ? 1 : 0;
        const pb = STATE.settings.pinned[b.url] ? 1 : 0;
        if (pa !== pb) return pb - pa;
        if (STATE.settings.sortBy === 'smart') return rankScore(b) - rankScore(a);
        return (b.lastVisitTime || 0) - (a.lastVisitTime || 0);
    });
    return list;
}

async function refreshAndRender() {
    await fetchHistory();
    const cats = categorize(STATE.filtered);
    renderGrid(cats, $search.value);
}

function updateCurtainBtnLabel() {
    // 根據門簾狀態和鎖定狀態決定顯示的圖標
    const curtainEnabled = !!STATE.settings.ui?.privacyCurtainEnabled;
    const curtainLocked = !!STATE.settings.ui?.privacyCurtainLocked;

    if ($curtainBtn) {
        // 如果鎖定，顯示 lock icon；如果啟用門簾，顯示 lock icon；否則顯示 unlock icon
        const icon = (curtainLocked || curtainEnabled) ? getSvgIcon('lock') : getSvgIcon('unlock');
        $curtainBtn.innerHTML = icon;
        $curtainBtn.title = t('btnCurtain');
    }
}

function makeCurtain() {
    const div = document.createElement('div');
    div.className = 'curtain';
    const hint = document.createElement('span');
    hint.className = 'curtain-hint';
    hint.textContent = t('msgCurtainHint');
    div.appendChild(hint);
    div.addEventListener('click', (e) => { e.stopPropagation(); openAllCurtains(); });
    return div;
}

function applyCurtainToAll() {
    document.querySelectorAll('#grid .card .list-container').forEach(($l) => {
        if (!$l.querySelector(':scope > .curtain')) $l.appendChild(makeCurtain());
    });
}

function removeCurtainFromAll() {
    document.querySelectorAll('#grid .card .list-container .curtain').forEach(el => el.remove());
}

function openAllCurtains() {
    // 點擊門簾時，只打開門簾，不改變 lock 狀態
    removeCurtainFromAll();
}

// 初始化 icons
function initializeIcons() {
    if ($refreshBtn) $refreshBtn.innerHTML = getSvgIcon('refresh');
    if ($curtainBtn) $curtainBtn.innerHTML = getSvgIcon('unlock');
    if ($settingsBtn) $settingsBtn.innerHTML = getSvgIcon('settings');
    if ($focusCloseBtn) $focusCloseBtn.innerHTML = getSvgIcon('x');
    if ($addShortcutBtn) $addShortcutBtn.innerHTML = getSvgIcon('plus');
    if ($shortcutsLeftBtn) $shortcutsLeftBtn.innerHTML = getSvgIcon('chevronLeft');
    if ($shortcutsRightBtn) $shortcutsRightBtn.innerHTML = getSvgIcon('chevronRight');
}

// 初始化語言
function initializeLanguage() {
    const currentLang = getCurrentLanguage();
    if ($langSelect) $langSelect.value = currentLang;
    updateUIText();
}

// Shortcuts 相關函數
async function extractFaviconFromPage(url) {
    try {
        // 嘗試從頁面 HTML 中提取 favicon
        const htmlResponse = await fetch(url, {
            mode: 'no-cors',
            cache: 'force-cache'
        }).catch(() => null);
        
        if (!htmlResponse) return null;
        
        const html = await htmlResponse.text().catch(() => '');
        if (!html) return null;
        
        const baseUrl = new URL(url);
        
        // 優先級順序的 favicon 類型
        const faviconPatterns = [
            // 標準 icon
            /<link[^>]*rel=["']icon["'][^>]*href=["']([^"']+)["']/i,
            /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']icon["']/i,
            // shortcut icon
            /<link[^>]*rel=["']shortcut icon["'][^>]*href=["']([^"']+)["']/i,
            /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']shortcut icon["']/i,
            // apple-touch-icon
            /<link[^>]*rel=["']apple-touch-icon(?:-precomposed)?["'][^>]*href=["']([^"']+)["']/i,
            /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']apple-touch-icon(?:-precomposed)?["']/i,
            /<link[^>]*rel=["']bookmark["'][^>]*href=["']([^"']+)["']/i,
            /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']bookmark["']/i,
            // 通用 link 標籤（任何包含 favicon 的 href）
            /<link[^>]*href=["']([^"']*favicon[^"']*)["']/i,
            /<link[^>]*href=["']([^"']*icon[^"']*)["']/i,
        ];
        
        // 嘗試每個模式
        for (const pattern of faviconPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                let faviconUrl = match[1];
                
                // 轉換相對 URL 為絕對 URL
                if (!faviconUrl.startsWith('http')) {
                    faviconUrl = faviconUrl.startsWith('/') 
                        ? `${baseUrl.origin}${faviconUrl}`
                        : `${baseUrl.origin}/${faviconUrl}`;
                }
                
                return faviconUrl;
            }
        }
        
        return null;
    } catch (err) {
        return null;
    }
}

function getFirstEnglishLetter(text) {
    if (!text) return '?';
    const match = text.match(/[a-zA-Z]/);
    return match ? match[0].toUpperCase() : '?';
}

function createLetterIcon(text) {
    const letter = getFirstEnglishLetter(text);
    const colors = ['#7cc3ff', '#ad7cff', '#ffc47c', '#7cffad', '#ff7c9c'];
    const colorIndex = text.charCodeAt(0) % colors.length;
    const color = colors[colorIndex];
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="18" fill="${color}" opacity="0.3"/>
        <circle cx="18" cy="18" r="17" fill="none" stroke="${color}" stroke-width="1" opacity="0.5"/>
        <text x="18" y="22" font-size="16" font-weight="bold" text-anchor="middle" fill="${color}">${letter}</text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function renderShortcuts() {
    if (!$shortcutsScroll) return;
    $shortcutsScroll.innerHTML = '';
    const shortcuts = STATE.settings.shortcuts || [];
    
    for (let index = 0; index < shortcuts.length; index++) {
        const sc = shortcuts[index];
        const div = document.createElement('div');
        div.className = 'shortcut-icon';
        div.title = sc.title || sc.url;
        div.dataset.url = sc.url;
        div.dataset.index = index;
        div.draggable = true;
        
        const img = document.createElement('img');
        img.alt = sc.title || 'shortcut';
        img.className = 'shortcut-img';
        
        // 優先級：已儲存的 favicon > 網站 origin/favicon.ico > DuckDuckGo > 預設 icon
        const faviconCandidates = [
            sc.favicon,
            `${new URL(sc.url).origin}/favicon.ico`,
            `https://icons.duckduckgo.com/ip3/${encodeURIComponent(getHostname(sc.url))}.ico`,
            defaultIconDataUri()
        ].filter(Boolean);
        
        let faviconIndex = 0;
        const tryNextFavicon = () => {
            if (faviconIndex >= faviconCandidates.length) {
                // 所有 favicon 都失敗，顯示字母 icon
                img.src = createLetterIcon(sc.title || sc.url);
                return;
            }
            img.src = faviconCandidates[faviconIndex++];
        };
        
        img.onerror = tryNextFavicon;
        tryNextFavicon();
        
        const removeBtn = document.createElement('div');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '×';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeShortcut(sc.url);
        });
        
        div.appendChild(img);
        div.appendChild(removeBtn);
        
        // 拖拽事件
        div.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', index);
            div.style.opacity = '0.5';
        });
        
        div.addEventListener('dragend', (e) => {
            div.style.opacity = '1';
        });
        
        div.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            div.style.borderColor = 'var(--accent)';
        });
        
        div.addEventListener('dragleave', (e) => {
            div.style.borderColor = 'var(--stroke)';
        });
        
        div.addEventListener('drop', async (e) => {
            e.preventDefault();
            div.style.borderColor = 'var(--stroke)';
            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
            const toIndex = index;
            
            if (fromIndex !== toIndex) {
                // 交換順序
                const temp = shortcuts[fromIndex];
                shortcuts[fromIndex] = shortcuts[toIndex];
                shortcuts[toIndex] = temp;
                STATE.settings.shortcuts = shortcuts;
                await saveSettings(STATE.settings);
                renderShortcuts();
            }
        });
        
        // 點擊打開連結（不是拖拽時）
        div.addEventListener('click', (e) => {
            if (e.target !== removeBtn) {
                window.open(sc.url, '_blank');
            }
        });
        
        $shortcutsScroll.appendChild(div);
    }
    
    updateShortcutsNavButtons();
}

function updateShortcutsNavButtons() {
    if (!$shortcutsScroll) return;
    const canScrollLeft = $shortcutsScroll.scrollLeft > 0;
    const canScrollRight = $shortcutsScroll.scrollLeft < $shortcutsScroll.scrollWidth - $shortcutsScroll.clientWidth - 5;
    const hasOverflow = $shortcutsScroll.scrollWidth > $shortcutsScroll.clientWidth;
    
    if ($shortcutsLeftBtn) {
        $shortcutsLeftBtn.disabled = !canScrollLeft;
        $shortcutsLeftBtn.style.display = hasOverflow ? 'flex' : 'none';
    }
    if ($shortcutsRightBtn) {
        $shortcutsRightBtn.disabled = !canScrollRight;
        $shortcutsRightBtn.style.display = hasOverflow ? 'flex' : 'none';
    }
}

function scrollShortcuts(direction) {
    if (!$shortcutsScroll) return;
    const scrollAmount = 150;
    $shortcutsScroll.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
    });
    setTimeout(updateShortcutsNavButtons, 300);
}

async function addShortcut(url) {
    try {
        // 自動補充 protocol
        let normalizedUrl = url.trim();
        if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
            normalizedUrl = 'https://' + normalizedUrl;
        }
        
        const urlObj = new URL(normalizedUrl);
        const shortcuts = STATE.settings.shortcuts || [];
        
        // 檢查是否已存在（使用正規化後的 URL）
        if (shortcuts.some(s => s.url === normalizedUrl)) {
            alert(t('shortcutInvalid'));
            return;
        }
        
        // 獲取網站標題（嘗試從 history 或使用 hostname）
        let title = '';
        const hostname = urlObj.hostname;
        const historyItem = STATE.items.find(it => it.url === normalizedUrl);
        if (historyItem) {
            title = historyItem.title || hostname;
        } else {
            title = hostname;
        }
        
        // 嘗試自動提取 favicon
        let favicon = null;
        try {
            favicon = await extractFaviconFromPage(normalizedUrl);
        } catch (err) {
            // 提取失敗，favicon 保持 null
        }
        
        // 如果沒有提取到 favicon，嘗試標準位置
        if (!favicon) {
            favicon = `${urlObj.origin}/favicon.ico`;
        }
        
        shortcuts.push({ url: normalizedUrl, title, favicon });
        STATE.settings.shortcuts = shortcuts;
        await saveSettings(STATE.settings);
        renderShortcuts();
        alert(t('shortcutAdded'));
    } catch (err) {
        alert(t('shortcutInvalid'));
        console.log(err);
    }
}

async function removeShortcut(url) {
    const shortcuts = STATE.settings.shortcuts || [];
    STATE.settings.shortcuts = shortcuts.filter(s => s.url !== url);
    await saveSettings(STATE.settings);
    renderShortcuts();
    alert(t('shortcutRemoved'));
}

// 更新 UI 文本
function updateUIText() {
    // 更新 header
    document.querySelector('h1').textContent = t('appName');
    document.querySelector('.sub').textContent = t('appSubtitle');

    // 更新搜尋框
    $search.placeholder = t('searchPlaceholder');

    // 更新按鈕 title
    $refreshBtn.title = t('btnSync');
    $settingsBtn.title = t('btnSettings');

    // 更新 footer
    document.querySelector('.footer').textContent = t('footerText');

    // 更新 settings dialog 文本
    const settingsTitle = document.getElementById('settingsTitle');
    if (settingsTitle) settingsTitle.textContent = t('settingsTitle');

    const settingsGeneralLegend = document.getElementById('settingsGeneralLegend');
    if (settingsGeneralLegend) settingsGeneralLegend.textContent = t('settingsGeneral');

    const settingsCategoryLimitLabel = document.getElementById('settingsCategoryLimitLabel');
    if (settingsCategoryLimitLabel) settingsCategoryLimitLabel.textContent = t('settingsCategoryLimit');

    const settingsRecentDaysLabel = document.getElementById('settingsRecentDaysLabel');
    if (settingsRecentDaysLabel) settingsRecentDaysLabel.textContent = t('settingsRecentDays');

    const settingsSortModeLabel = document.getElementById('settingsSortModeLabel');
    if (settingsSortModeLabel) settingsSortModeLabel.textContent = t('settingsSortMode');

    const sortLatestOption = document.getElementById('sortLatestOption');
    if (sortLatestOption) sortLatestOption.textContent = t('settingsSortLatest');

    const sortSmartOption = document.getElementById('sortSmartOption');
    if (sortSmartOption) sortSmartOption.textContent = t('settingsSortSmart');

    const settingsColCountLabel = document.getElementById('settingsColCountLabel');
    if (settingsColCountLabel) settingsColCountLabel.textContent = t('settingsColCount');

    const colCount1Option = document.getElementById('colCount1Option');
    if (colCount1Option) colCount1Option.textContent = t('colCount1');

    const colCount2Option = document.getElementById('colCount2Option');
    if (colCount2Option) colCount2Option.textContent = t('colCount2');

    const colCount3Option = document.getElementById('colCount3Option');
    if (colCount3Option) colCount3Option.textContent = t('colCount3');

    const colCount4Option = document.getElementById('colCount4Option');
    if (colCount4Option) colCount4Option.textContent = t('colCount4');

    const langLabel = document.getElementById('langLabel');
    if (langLabel) langLabel.textContent = t('settingsLanguage');

    const settingsCancelBtn = document.getElementById('settingsCancelBtn');
    if (settingsCancelBtn) settingsCancelBtn.textContent = t('btnCancel');

    const settingsSaveBtn = document.getElementById('settingsSaveBtn');
    if (settingsSaveBtn) settingsSaveBtn.textContent = t('btnSave');

    const settingsCategoryManagementSummary = document.getElementById('settingsCategoryManagementSummary');
    if (settingsCategoryManagementSummary) settingsCategoryManagementSummary.textContent = t('settingsCategoryManagement');

    const addCategoryBtn = document.getElementById('addCategoryBtn');
    if (addCategoryBtn) addCategoryBtn.textContent = t('btnAddCategory');

    const resetCategoriesUIButton = document.getElementById('resetCategoriesUIButton');
    if (resetCategoriesUIButton) resetCategoriesUIButton.textContent = t('btnResetCategories');

    const saveCategoriesUIButton = document.getElementById('saveCategoriesUIButton');
    if (saveCategoriesUIButton) saveCategoriesUIButton.textContent = t('btnSaveCategories');

    const focusCloseBtn = document.getElementById('focusCloseBtn');
    if (focusCloseBtn) focusCloseBtn.textContent = t('btnBack');

    // 更新 shortcuts dialog
    const addShortcutTitle = document.getElementById('addShortcutTitle');
    if (addShortcutTitle) addShortcutTitle.textContent = t('shortcutsTitle');
    
    if ($shortcutUrlInput) $shortcutUrlInput.placeholder = t('shortcutUrlPlaceholder');
    if ($shortcutCancelBtn) $shortcutCancelBtn.textContent = t('btnCancel');
    if ($shortcutConfirmBtn) $shortcutConfirmBtn.textContent = t('btnAddShortcut');

    // 更新 curtain button
    updateCurtainBtnLabel();
}

async function init() {
    STATE.settings = await loadSettings();

    // 初始化 icons 和語言
    initializeIcons();
    initializeLanguage();

    // 初始 UI 值
    $limitInput.value = STATE.settings.perCategoryLimit;
    $daysInput.value = STATE.settings.recentDays;
    if ($sortSelect) $sortSelect.value = STATE.settings.sortBy || 'latest';
    if ($colCountSelect) $colCountSelect.value = String(STATE.settings.ui.colCount || 3);
    if ($categoriesUI) renderCategoriesUI(STATE.settings.categories);
    applyColumnCount(STATE.settings.ui.colCount || 3);
    updateCurtainBtnLabel();
    
    // 初始化 shortcuts
    renderShortcuts();

    await refreshAndRender();

    // 搜尋輸入
    $search.addEventListener('input', () => {
        const cats = categorize(STATE.filtered);
        renderGrid(cats, $search.value);
    });

    // 同步
    $refreshBtn.addEventListener('click', async () => {
        $refreshBtn.disabled = true;
        try { await refreshAndRender(); }
        finally { $refreshBtn.disabled = false; }
    });

    // 固定高度永遠開啟（移除切換）

    // 設定開關
    $settingsBtn.addEventListener('click', () => { $settingsDialog.showModal(); });

    // 語言切換（在設定中）
    $langSelect?.addEventListener('change', (e) => {
        const lang = e.target.value;
        setLanguage(lang);
        updateUIText();
        // 重新渲染 grid 以更新文本
        const cats = categorize(STATE.filtered);
        renderGrid(cats, $search.value);
    });

    // 門簾開關按鈕 - 切換鎖定狀態或打開/關閉門簾
    $curtainBtn?.addEventListener('click', async () => {
        const isLocked = STATE.settings.ui.privacyCurtainLocked;

        if (isLocked) {
            // 如果已鎖定，點擊則解鎖並打開所有門簾
            STATE.settings.ui.privacyCurtainLocked = false;
            STATE.settings.ui.privacyCurtainEnabled = true;
            applyCurtainToAll();
        } else {
            // 如果未鎖定，點擊則切換門簾顯示/隱藏
            STATE.settings.ui.privacyCurtainEnabled = !STATE.settings.ui.privacyCurtainEnabled;
            if (STATE.settings.ui.privacyCurtainEnabled) {
                applyCurtainToAll();
            } else {
                removeCurtainFromAll();
            }
        }

        await saveSettings(STATE.settings);
        updateCurtainBtnLabel();
    });

    // Shortcuts 事件監聽
    $addShortcutBtn?.addEventListener('click', () => {
        $shortcutUrlInput.value = '';
        $addShortcutDialog.showModal();
        $shortcutUrlInput.focus();
    });

    $shortcutCancelBtn?.addEventListener('click', () => {
        $addShortcutDialog.close('cancel');
    });

    $shortcutConfirmBtn?.addEventListener('click', async () => {
        const url = $shortcutUrlInput.value.trim();
        if (url) {
            await addShortcut(url);
            $addShortcutDialog.close('confirm');
        }
    });

    $shortcutUrlInput?.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const url = $shortcutUrlInput.value.trim();
            if (url) {
                await addShortcut(url);
                $addShortcutDialog.close('confirm');
            }
        }
    });

    $shortcutsLeftBtn?.addEventListener('click', () => scrollShortcuts('left'));
    $shortcutsRightBtn?.addEventListener('click', () => scrollShortcuts('right'));

    $shortcutsScroll?.addEventListener('scroll', updateShortcutsNavButtons);
    window.addEventListener('resize', updateShortcutsNavButtons);

    // 點擊對話框外的空白區關閉
    $settingsDialog.addEventListener('click', (e) => {
        const rect = $settingsDialog.getBoundingClientRect();
        const inDialog = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
        if (!inDialog) $settingsDialog.close('cancel');
    });

    // Add shortcut modal 點擊外部關閉
    $addShortcutDialog?.addEventListener('click', (e) => {
        const rect = $addShortcutDialog.getBoundingClientRect();
        const inDialog = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
        if (!inDialog) $addShortcutDialog.close('cancel');
    });

    // 欄位數即時變更
    $colCountSelect?.addEventListener('change', (e) => {
        const n = parseInt(e.target.value || '3', 10);
        applyColumnCount(n);
    });

    // 分類管理（UI）事件
    $addCategoryBtn?.addEventListener('click', () => {
        const arr = readCategoriesFromUI();
        const keys = new Set(arr.map(c => c.key));
        const key = genUniqueKey('custom', keys);
        arr.push({ key, label: '新分類', enabled: true, matchers: [{ type: 'domain', value: '' }] });
        renderCategoriesUI(arr);
    });
    $resetCategoriesUIButton?.addEventListener('click', () => {
        renderCategoriesUI(defaultCategories());
    });
    $saveCategoriesUIButton?.addEventListener('click', async () => {
        try {
            const arr = readCategoriesFromUI();
            if (!arr.length) throw new Error('至少需要一個分類');
            // 驗證唯一 key
            const set = new Set();
            for (const c of arr) {
                if (set.has(c.key)) throw new Error('分類 key 重複：' + c.key);
                set.add(c.key);
            }
            STATE.settings.categories = arr;
            await saveSettings(STATE.settings);
            await refreshAndRender();
            alert('分類已儲存');
        } catch (err) {
            alert('分類設定有誤：' + (err?.message || err));
        }
    });

    $categoriesUI?.addEventListener('click', (e) => {
        const catEl = e.target.closest('.cat');
        if (!catEl) return;
        const key = catEl.dataset.key;
        if (e.target.closest('.add-matcher')) {
            const arr = readCategoriesFromUI();
            const idx = arr.findIndex(c => c.key === key);
            if (idx >= 0) { arr[idx].matchers.push({ type: 'domain', value: '' }); renderCategoriesUI(arr); }
        } else if (e.target.closest('.remove-matcher')) {
            const mEl = e.target.closest('.matcher');
            const type = mEl?.querySelector('.m-type')?.value;
            const value = mEl?.querySelector('.m-value')?.value;
            const arr = readCategoriesFromUI();
            const idx = arr.findIndex(c => c.key === key);
            if (idx >= 0) {
                const i2 = arr[idx].matchers.findIndex(m => m.type === type && m.value === value);
                if (i2 >= 0) arr[idx].matchers.splice(i2, 1);
                renderCategoriesUI(arr);
            }
        } else if (e.target.closest('.cat-delete')) {
            const arr = readCategoriesFromUI().filter(c => c.key !== key);
            renderCategoriesUI(arr);
        } else if (e.target.closest('.cat-up') || e.target.closest('.cat-down')) {
            const arr = readCategoriesFromUI();
            const idx = arr.findIndex(c => c.key === key);
            if (idx >= 0) {
                const dir = e.target.closest('.cat-up') ? -1 : 1;
                const j = idx + dir;
                if (j >= 0 && j < arr.length) {
                    const tmp = arr[idx];
                    arr[idx] = arr[j];
                    arr[j] = tmp;
                    renderCategoriesUI(arr);
                }
            }
        }
    });

    // 設定套用（關閉時觸發）
    $settingsDialog.addEventListener('close', async () => {
        if ($settingsDialog.returnValue === 'confirm') {
            const perCategoryLimit = Math.max(3, Math.min(100, parseInt($limitInput.value || 12, 10)));
            const recentDays = Math.max(1, Math.min(365, parseInt($daysInput.value || 60, 10)));
            const sortBy = ($sortSelect?.value === 'smart') ? 'smart' : 'latest';
            const colCount = Math.max(1, Math.min(4, parseInt($colCountSelect?.value || 3, 10)));


            // 採用 UI 版本的分類設定
            try {
                if ($categoriesUI) {
                    const arr = readCategoriesFromUI();
                    if (Array.isArray(arr) && arr.length) STATE.settings.categories = arr;
                }
            } catch { /* ignore */ }

            STATE.settings.perCategoryLimit = perCategoryLimit;
            STATE.settings.recentDays = recentDays;
            STATE.settings.sortBy = sortBy;
            STATE.settings.ui.colCount = colCount;


            await saveSettings(STATE.settings);
            applyColumnCount(colCount);
            await refreshAndRender();
        }
    });

    // 釘選切換（事件委派）
    $grid.addEventListener('click', async (e) => {
        const btn = e.target.closest('.pin');
        if (!btn) return;
        e.preventDefault();
        const url = decodeURIComponent(btn.dataset.url);
        const active = !!STATE.settings.pinned[url];
        if (active) delete STATE.settings.pinned[url]; else STATE.settings.pinned[url] = true;
        await saveSettings(STATE.settings);
        const cats = categorize(STATE.filtered);
        renderGrid(cats, $search.value);
    });

    // 聚焦模式（事件委派）
    $grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.focus-btn');
        if (!btn) return;
        const key = btn.dataset.key;
        openFocus(key);
    });

    $focusCloseBtn?.addEventListener('click', () => $focusDialog.close('cancel'));
    // 聚焦清單 pin 切換：避免開啟連結
    $focusList?.addEventListener('click', async (e) => {
        const btn = e.target.closest('.pin');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        const url = decodeURIComponent(btn.dataset.url);
        const active = !!STATE.settings.pinned[url];
        if (active) delete STATE.settings.pinned[url]; else STATE.settings.pinned[url] = true;
        await saveSettings(STATE.settings);
        const key = STATE.focusKey;
        const order = (STATE.settings.categories || []).filter(c => c.enabled !== false);
        const cat = order.find(c => c.key === key);
        if (cat) {
            const list = getCategoryFullList(cat.key);
            renderListItems($focusList, list, { catIconUrl: cat.iconUrl });
        }
    });
    $focusDialog?.addEventListener('close', () => {
        // 關閉後不需特別動作
    });
}

function openFocus(key) {
    const order = (STATE.settings.categories || []).filter(c => c.enabled !== false);
    const cat = order.find(c => c.key === key);
    if (!cat) return;
    STATE.focusKey = key;
    // dot 顏色沿用 key class 寫在 style 上
    const temp = document.createElement('div');
    temp.className = `card ${cat.key}`;
    document.body.appendChild(temp);
    const dotColor = getComputedStyle(temp.querySelector(':scope .dot') || temp).backgroundColor;
    document.body.removeChild(temp);
    if ($focusDot) $focusDot.style.background = dotColor || '';

    const list = getCategoryFullList(key);
    renderListItems($focusList, list, { catIconUrl: cat.iconUrl || '' });
    if (!$focusDialog.open) $focusDialog.showModal();
}

// Boot
if (typeof chrome !== 'undefined' && chrome.history) {
    init();
} else {
    // Preview mode (no chrome API)
    console.warn('Preview mode - chrome APIs not available');
    STATE.settings = DEFAULT_SETTINGS;
    STATE.filtered = [
        { title: 'AWS Console - EC2', url: 'https://console.aws.amazon.com/ec2/v2/home', lastVisitTime: Date.now() - 3600e3, visitCount: 12 },
        { title: 'GitLab - Project A', url: 'https://gitlab.com/org/project', lastVisitTime: Date.now() - 86400e3 * 2, visitCount: 8 },
        { title: 'Figma - UI Kit', url: 'https://www.figma.com/file/abc/UI-Kit', lastVisitTime: Date.now() - 86400e3 * 4, visitCount: 5 },
        { title: 'Document Spec', url: 'https://docs.google.com/document/d/xxx', lastVisitTime: Date.now() - 86400e3 * 3, visitCount: 9 },
        { title: 'Budget Sheet', url: 'https://docs.google.com/spreadsheets/d/yyy', lastVisitTime: Date.now() - 86400e3 * 5, visitCount: 6 },
        { title: 'Q4 Slides', url: 'https://docs.google.com/presentation/d/zzz', lastVisitTime: Date.now() - 86400e3 * 7, visitCount: 3 }
    ];
    // 預設分類
    STATE.settings.categories = defaultCategories();
    const cats = categorize(STATE.filtered);
    renderGrid(cats, '');
}
