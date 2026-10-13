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
    ui: {
        fixHeightEnabled: true,
        colCount: 3,
        privacyCurtainEnabled: false,
        privacyCurtainLocked: false,
        normalizeGroupEnabled: true,
    },
    pinned: {},
    categories: defaultCategories()
};

// DOM refs
const $grid = document.getElementById('grid');
const $gridWrap = document.getElementById('gridWrap');
const $gridPrevBtn = document.getElementById('gridPrevBtn');
const $gridNextBtn = document.getElementById('gridNextBtn');
const $search = document.getElementById('search');
const $refreshBtn = document.getElementById('refreshBtn');
const $settingsBtn = document.getElementById('settingsBtn');
const $curtainBtn = document.getElementById('curtainBtn');
const $layoutBtn = document.getElementById('layoutBtn');
const $settingsDialog = document.getElementById('settingsDialog');
const $limitInput = document.getElementById('limitInput');
const $daysInput = document.getElementById('daysInput');
const $sortSelect = document.getElementById('sortSelect');
const $layoutWidthGroup = document.getElementById('layoutWidthGroup');
const $layoutModeGroup = document.getElementById('layoutModeGroup');
const $themeSwatches = document.getElementById('themeSwatches');
const $colCountRow = document.getElementById('colCountRow');
const $colCountSelect = document.getElementById('colCountSelect');
const $layoutResetBtn = document.getElementById('layoutResetBtn');
const $normalizeGroupToggle = document.getElementById('normalizeGroupToggle');

// 分類管理（UI）
const $categoriesUI = document.getElementById('categoriesUI');
const $addCategoryBtn = document.getElementById('addCategoryBtn');
const $resetCategoriesUIButton = document.getElementById('resetCategoriesUIButton');
const $catFilter = document.getElementById('catFilter');
const $settingsSaveBtn = document.getElementById('settingsSaveBtn');

const $focusDialog = document.getElementById('focusDialog');
const $focusList = document.getElementById('focusList');
const $focusDot = document.getElementById('focusDot');
const $focusCloseBtn = document.getElementById('focusCloseBtn');
const $langSelect = document.getElementById('langSelect');

let STATE = {
    settings: DEFAULT_SETTINGS,
    items: [], // 原始歷史：{title, url, lastVisitTime, visitCount}
    filtered: [], // 過濾後（符合分類）
    cats: {}, // 最新一次 categorize 結果
    focusKey: null,
    layoutDraft: null, // 編輯排版中的草稿 layout；null 表示非編輯模式
};

// 目前顯示的軌數（設定對話框中可即時預覽，故不直接讀 settings）
let CURRENT_COLS = 3;

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
            if (typeof s.ui.normalizeGroupEnabled === 'undefined') {
                s.ui.normalizeGroupEnabled = true;
            }

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

// 設定備份 / 還原
const BACKUP_APP = 'NeonFlux';
const BACKUP_TYPE = 'settings-backup';
const BACKUP_VERSION = 1;

// 匯出整個 settings 物件成 JSON 檔（含分類規則與釘選），純前端下載、免權限
function exportSettings() {
    try {
        const payload = {
            app: BACKUP_APP,
            type: BACKUP_TYPE,
            version: BACKUP_VERSION,
            exportedAt: new Date().toISOString(),
            settings: STATE.settings,
        };
        const json = JSON.stringify(payload, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `neonflux-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
        alert(t('msgExportError') + (err?.message || err));
    }
}

// 驗證匯入內容是否為合法的 NeonFlux 備份
function isValidBackup(obj) {
    if (!obj || typeof obj !== 'object') return false;
    if (obj.type && obj.type !== BACKUP_TYPE) return false;
    const s = obj.settings;
    if (!s || typeof s !== 'object') return false;
    if (!Array.isArray(s.categories)) return false;
    return true;
}

// 完全取代目前設定（還原備份），並即時套用到 UI
async function applyImportedSettings(imported) {
    // 編輯排版中匯入：先放棄草稿，否則匯入的排版會被草稿蓋過
    await exitLayoutEdit(false);
    // 用 DEFAULT_SETTINGS 補齊缺欄位（容錯 / 版本漂移），與 loadSettings 行為一致
    const merged = deepMerge(DEFAULT_SETTINGS, imported);
    if (!Array.isArray(merged.categories) || merged.categories.length === 0) {
        merged.categories = defaultCategories();
    }
    STATE.settings = merged;
    await saveSettings(merged);
    applyTheme(merged.ui?.theme);

    // 重新填入設定欄位
    $limitInput.value = merged.perCategoryLimit;
    $daysInput.value = merged.recentDays;
    if ($sortSelect) $sortSelect.value = merged.sortBy || 'latest';
    if ($normalizeGroupToggle) $normalizeGroupToggle.checked = !!merged.ui?.normalizeGroupEnabled;
    if ($categoriesUI) renderCategoriesUI(merged.categories);
    applyLayoutMode();
    await refreshAndRender();
}

// 讀取備份檔 → 解析 → 驗證 → 確認覆寫 → 套用
function importSettingsFromFile(file) {
    const reader = new FileReader();
    reader.onload = async () => {
        let parsed;
        try {
            parsed = JSON.parse(String(reader.result));
        } catch {
            alert(t('msgImportInvalid'));
            return;
        }
        if (!isValidBackup(parsed)) {
            alert(t('msgImportInvalid'));
            return;
        }
        if (!confirm(t('msgImportConfirm'))) return;
        try {
            await applyImportedSettings(parsed.settings);
            alert(t('msgImportSuccess'));
        } catch (err) {
            alert(t('msgImportError') + (err?.message || err));
        }
    };
    reader.onerror = () => alert(t('msgImportError') + (reader.error?.message || 'read error'));
    reader.readAsText(file);
}

// URL 工具
function getFavicon(url) {
    try { const u = new URL(url); return `${u.origin}/favicon.ico`; } catch { return ''; }
}

function getHostname(url) {
    try { return new URL(url).hostname; } catch { return ''; }
}

function normalizeUrlForGroup(url) {
    if (!STATE.settings.ui?.normalizeGroupEnabled) return url;
    try {
        const u = new URL(url);
        return `${u.origin}${u.pathname}`;
    } catch {
        return url;
    }
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

function isFreeLayout() {
    return resolveLayoutMode(STATE.settings.ui) === 'free';
}

// 依模式套用 body class 與欄數：經典用 colCount（1–4），自由排版用 trackCols（軌道寬度）
function applyLayoutMode() {
    const ui = STATE.settings.ui || {};
    const free = isFreeLayout();
    document.body.classList.toggle('mode-grid', !free);
    applyColumnCount(free ? (ui.trackCols || ui.colCount || 3) : Math.min(4, ui.colCount || 3));
}

function applyColumnCount(n) {
    n = clampColCount(n);
    CURRENT_COLS = n;
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

// 分類管理手風琴：目前展開的分類 key（同時只展開一個）
let OPEN_CAT_KEY = null;

// 設定對話框中的排版模式（按「儲存」才套用）；欄位數只在經典模式顯示
function setLayoutModeField(mode) {
    if (!$layoutModeGroup) return;
    $layoutModeGroup.dataset.value = mode;
    $layoutModeGroup.querySelectorAll('button[data-mode]').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    if ($colCountRow) $colCountRow.hidden = mode !== 'grid';
}

// 主題色塊（縮圖：底色 + 兩顆光球）：點擊即預覽（只改 data-theme），按「儲存」才寫入，「取消」還原
function renderThemeSwatches(active) {
    if (!$themeSwatches) return;
    $themeSwatches.dataset.value = active;
    $themeSwatches.innerHTML = Object.entries(THEMES).map(([key, c]) => {
        const name = t('theme' + key[0].toUpperCase() + key.slice(1));
        return `<button type="button" class="theme-swatch${key === active ? ' active' : ''}" data-theme-key="${key}" role="radio" aria-checked="${key === active}" title="${name}">
          <i style="--sw-accent: ${c.accent}; background: radial-gradient(circle at 30% 28%, ${c.blobs[0]} 0 18%, transparent 62%), radial-gradient(circle at 74% 74%, ${c.blobs[1]} 0 14%, transparent 60%), ${c.bg}"></i><span>${name}</span>
        </button>`;
    }).join('');
}

function setCategoryFilter(filter) {
    if (!$categoriesUI) return;
    $categoriesUI.dataset.filter = filter;
    $catFilter?.querySelectorAll('button[data-filter]').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
}

function renderCategoriesUI(cats = []) {
    if (!$categoriesUI) return;
    $categoriesUI.innerHTML = '';
    for (const cat of cats) {
        const div = document.createElement('div');
        div.className = 'cat';
        div.dataset.key = cat.key;

        const enabled = cat.enabled !== false ? 'checked' : '';
        const matchers = Array.isArray(cat.matchers) ? cat.matchers : [];
        const matcherRows = matchers.map(m => `
      <div class="matcher">
        <select class="m-type" style="width:110px;">
          <option value="domain" ${m.type === 'domain' ? 'selected' : ''}>domain</option>
          <option value="prefix" ${m.type === 'prefix' ? 'selected' : ''}>prefix</option>
          <option value="regex" ${m.type === 'regex' ? 'selected' : ''}>regex</option>
        </select>
        <input class="m-value" type="text" value="${escapeHtml(m.value || '')}" placeholder="${t('matcherValue')}" style="flex:1;" />
        <button type="button" class="btn remove-matcher">${getSvgIcon('dash')}</button>
      </div>
    `).join('');

        const ruleCount = matchers.filter(m => m.value).length;
        div.innerHTML = `
      <div class="cat-header">
        <input type="checkbox" class="cat-enabled settings-switch cat-toggle" ${enabled} />
        <span class="cat-name">${escapeHtml(cat.label || cat.key || '')}</span>
        <span class="cat-meta">${t('catRuleCount').replace('{count}', ruleCount)}</span>
        <div class="cat-actions">
          <button type="button" class="btn cat-up" title="${t('btnMoveUp')}">${getSvgIcon('chevronUp')}</button>
          <button type="button" class="btn cat-down" title="${t('btnMoveDown')}">${getSvgIcon('chevronDown')}</button>
          <button type="button" class="btn cat-delete" title="${t('btnDeleteCategory')}">${getSvgIcon('trash')}</button>
        </div>
        <span class="cat-chevron">${getSvgIcon('chevronDown')}</span>
      </div>
      <div class="cat-body">
      <div class="cat-fields">
        <input type="text" class="cat-label" value="${escapeHtml(cat.label || '')}" placeholder="${t('categoryLabel')}" />
        <input type="text" class="cat-key" value="${escapeHtml(cat.key || '')}" placeholder="${t('categoryKey')}" title="僅限小寫英數與 -，需唯一" />
        <input type="url" class="cat-icon" value="${escapeHtml(cat.iconUrl || '')}" placeholder="${t('categoryIcon')}" />
      </div>
      <div class="matchers">
        ${matcherRows}
        <div class="matcher-actions"><button type="button" class="btn add-matcher">${t('btnAddMatcher')}</button></div>
      </div>
      </div>
    `;
        div.dataset.enabled = cat.enabled !== false ? '1' : '0';
        div.classList.toggle('open', cat.key === OPEN_CAT_KEY);
        // 標題列即時反映名稱
        const $name = div.querySelector('.cat-name');
        div.querySelector('.cat-label')?.addEventListener('input', (e) => { $name.textContent = e.target.value || cat.key; });
        const $toggle = div.querySelector('.cat-enabled');
        $toggle?.addEventListener('change', () => {
            div.dataset.enabled = $toggle.checked ? '1' : '0';
        });
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
        const url = it.matchUrl || it.url || '';
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
        const normalizedUrl = normalizeUrlForGroup(url);
        const prev = map.get(normalizedUrl);
        if (prev) {
            prev.visitCount = (prev.visitCount || 1) + (r.visitCount || 1);
            const prevTime = prev.lastVisitTime || 0;
            const nextTime = r.lastVisitTime || 0;
            if (nextTime >= prevTime) {
                prev.lastVisitTime = nextTime;
                prev.title = r.title || prev.title;
                prev.matchUrl = url;
            } else {
                prev.lastVisitTime = prevTime;
            }
        } else {
            map.set(normalizedUrl, {
                url: normalizedUrl,
                matchUrl: url,
                title: r.title || '',
                lastVisitTime: r.lastVisitTime || 0,
                visitCount: r.visitCount || 1
            });
        }
    }
    STATE.items = [...map.values()];
    // 僅保留可能屬於任一分類的項，做初步過濾
    const order = (STATE.settings.categories || []).filter(c => c.enabled !== false);
    STATE.filtered = STATE.items.filter(it => {
        const url = it.matchUrl || it.url || '';
        return order.some(c => matchUrl(url, c.matchers));
    });
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

// 目前生效的排版：編輯中用草稿，否則用已儲存的 layout（皆經 normalize）
function currentLayout() {
    const enabledKeys = (STATE.settings.categories || []).filter(c => c.enabled !== false).map(c => c.key);
    const source = STATE.layoutDraft || STATE.settings.ui?.layout;
    return normalizeLayout(source, enabledKeys, CURRENT_COLS);
}

function renderGrid(cats, query = '') {
    if (isFreeLayout()) renderTrackGrid(cats, query);
    else renderClassicGrid(cats, query);
}

// 經典欄位：依分類順序排入 N 欄，沒有紀錄的分類隱藏
function renderClassicGrid(cats, query = '') {
    $grid.innerHTML = '';
    $grid.classList.remove('has-overflow');
    const q = query.trim().toLowerCase();
    for (const cat of (STATE.settings.categories || []).filter(c => c.enabled !== false)) {
        const card = renderCard(cat, cats, q, false, true);
        if (card) $grid.appendChild(card);
    }
    updateScrollHints();
}

function renderTrackGrid(cats, query = '') {
    const scrollLeft = $grid.scrollLeft;
    $grid.innerHTML = '';
    const editing = !!STATE.layoutDraft;
    const q = editing ? '' : query.trim().toLowerCase();
    const order = (STATE.settings.categories || []).filter(c => c.enabled !== false);
    const catByKey = new Map(order.map(c => [c.key, c]));
    const layout = currentLayout();

    layout.tracks.forEach((keys, trackIdx) => {
        const $track = document.createElement('div');
        $track.className = 'track';
        $track.dataset.track = String(trackIdx);
        $track.dataset.hint = t('layoutDropHint');
        for (const key of keys) {
            const card = renderCard(catByKey.get(key), cats, q, editing);
            if (card) $track.appendChild(card);
        }
        const empty = !$track.querySelector('.card');
        // 非編輯模式：空軌不佔位置
        if (empty && !editing) return;
        if (editing) {
            $track.classList.toggle('is-empty', empty);
            // 只剩一軌時不可刪
            if (layout.tracks.length > 1) {
                $track.insertAdjacentHTML('afterbegin',
                    `<button class="btn track-remove" type="button" title="${t('btnRemoveTrack')}">${getSvgIcon('x')}</button>`);
            }
        }
        $grid.appendChild($track);
    });

    if (editing) {
        $grid.insertAdjacentHTML('beforeend',
            `<button class="track-add" type="button" title="${t('btnAddTrack')}">${getSvgIcon('plus')}</button>`);
    }
    // 軌數超過一畫面可顯示的數量 → 露邊提示（CSS has-overflow）
    $grid.classList.toggle('has-overflow', $grid.querySelectorAll(':scope > .track').length > CURRENT_COLS);
    $grid.scrollLeft = scrollLeft;
    updateScrollHints();
}

// 左右箭頭：只在該方向還有內容時顯示
function updateScrollHints() {
    if (!$gridPrevBtn || !$gridNextBtn) return;
    if (!isFreeLayout()) { $gridPrevBtn.hidden = $gridNextBtn.hidden = true; return; }
    $gridPrevBtn.hidden = $grid.scrollLeft <= 2;
    $gridNextBtn.hidden = $grid.scrollLeft + $grid.clientWidth >= $grid.scrollWidth - 2;
}

function scrollByTrack(dir) {
    const $first = $grid.querySelector(':scope > .track');
    const step = $first ? $first.offsetWidth + 16 : $grid.clientWidth;
    $grid.scrollBy({ left: dir * step, behavior: 'smooth' });
}

function renderCard(cat, cats, q, editing, hideEmpty = false) {
    if (!cat) return null;
    const list = cats[cat.key] || [];
    const filtered = q
        ? list.filter(it => (it.title || '').toLowerCase().includes(q) || (it.url || '').toLowerCase().includes(q))
        : list;
    // 只有搜尋時才隱藏 0 筆的分類；否則照 layout 顯示（含剛啟用、尚無紀錄的分類）
    if (!filtered.length && (q || hideEmpty) && !editing) return null;

    const card = document.createElement('section');
    card.className = `card ${cat.key}`;
    card.dataset.key = cat.key;
    if (editing) card.draggable = true;
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

    // 寬螢幕由軌道平分高度；窄螢幕（單欄）退回最多顯示 N 筆的高度
    const n = Math.max(1, Number(STATE.settings.perCategoryLimit || 5));
    $list.style.setProperty('--list-max', `calc(var(--row-h) * ${n})`);

    if (filtered.length) {
        renderListItems($list, filtered, { catIconUrl: cat.iconUrl || '' });
    } else {
        $list.innerHTML = `<div class="list-empty">${t('cardEmpty')}</div>`;
    }

    // 將門簾加到 list-container 而非 list 內部
    if (STATE.settings.ui?.privacyCurtainEnabled) {
        const curtain = makeCurtain();
        $listContainer.appendChild(curtain);
    }

    return card;
}

// 排版編輯模式
function enterLayoutEdit() {
    STATE.layoutDraft = currentLayout();
    document.body.classList.add('layout-editing');
    updateLayoutWidthButtons();
    updateLayoutBtn();
    renderGrid(STATE.cats, $search.value);
}

async function exitLayoutEdit(save) {
    if (!STATE.layoutDraft) return;
    if (save) {
        STATE.settings.ui.layout = STATE.layoutDraft;
        STATE.settings.ui.trackCols = CURRENT_COLS;
        await saveSettings(STATE.settings);
    } else {
        applyLayoutMode(); // 取消：還原軌道寬度
    }
    STATE.layoutDraft = null;
    document.body.classList.remove('layout-editing');
    updateLayoutBtn();
    renderGrid(STATE.cats, $search.value);
}

// 軌道寬度（一畫面顯示幾軌）：編輯中即時預覽，按「完成」才儲存
function setLayoutWidth(n) {
    applyColumnCount(n);
    updateLayoutWidthButtons();
    renderGrid(STATE.cats, $search.value);
}

function updateLayoutWidthButtons() {
    $layoutWidthGroup?.querySelectorAll('button[data-cols]').forEach(b => b.classList.toggle('active', Number(b.dataset.cols) === CURRENT_COLS));
}

// 重置排版：回到依分類順序輪流分配（仍需按「完成」才儲存）
function resetLayoutDraft() {
    if (!STATE.layoutDraft) return;
    const enabledKeys = (STATE.settings.categories || []).filter(c => c.enabled !== false).map(c => c.key);
    STATE.layoutDraft = normalizeLayout(null, enabledKeys, CURRENT_COLS);
    renderGrid(STATE.cats, $search.value);
}

function addTrack() {
    if (!STATE.layoutDraft) return;
    STATE.layoutDraft.tracks.push([]);
    renderGrid(STATE.cats, $search.value);
    $grid.scrollTo({ left: $grid.scrollWidth, behavior: 'smooth' });
}

function removeTrack(idx) {
    const tracks = STATE.layoutDraft?.tracks;
    // 有卡片的軌不能刪，避免分類從畫面消失
    if (!tracks || tracks.length <= 1 || tracks[idx]?.length) return;
    tracks.splice(idx, 1);
    renderGrid(STATE.cats, $search.value);
}

function updateLayoutBtn() {
    if (!$layoutBtn) return;
    const editing = !!STATE.layoutDraft;
    $layoutBtn.classList.toggle('active', editing);
    $layoutBtn.innerHTML = editing ? `${getSvgIcon('columns')}<span>${t('btnLayoutDone')}</span>` : getSvgIcon('columns');
    $layoutBtn.title = editing ? t('btnLayoutDone') : t('btnLayoutEdit');
}

// 拖曳：dragover 時直接移動卡片 DOM，dragend 時從 DOM 讀回草稿
function initLayoutDrag() {
    let $dragging = null;

    $grid.addEventListener('dragstart', (e) => {
        if (!STATE.layoutDraft) return;
        $dragging = e.target.closest?.('.card');
        if (!$dragging) return;
        $gridWrap?.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', $dragging.dataset.key || '');
        $dragging.classList.add('dragging');
    });

    $grid.addEventListener('dragover', (e) => {
        if (!$dragging) return;
        // 拖到左右邊緣時自動橫向捲動，才能放到畫面外的軌道
        const rect = $grid.getBoundingClientRect();
        if (e.clientX > rect.right - 60) $grid.scrollLeft += 20;
        else if (e.clientX < rect.left + 60) $grid.scrollLeft -= 20;
        const $track = e.target.closest('.track');
        if (!$track) return;
        e.preventDefault();
        const after = Array.from($track.querySelectorAll(':scope > .card:not(.dragging)'))
            .find(card => {
                const r = card.getBoundingClientRect();
                return e.clientY < r.top + r.height / 2;
            });
        if (after) {
            if ($dragging.nextSibling !== after) $track.insertBefore($dragging, after);
        } else if ($track.lastElementChild !== $dragging) {
            $track.appendChild($dragging);
        }
        $grid.querySelectorAll(':scope > .track').forEach(el => el.classList.toggle('is-empty', !el.querySelector('.card')));
    });

    $grid.addEventListener('drop', (e) => { if ($dragging) e.preventDefault(); });

    $grid.addEventListener('dragend', () => {
        if (!$dragging) return;
        $dragging.classList.remove('dragging');
        $gridWrap?.classList.remove('dragging');
        $dragging = null;
        STATE.layoutDraft = readLayoutFromTracks($grid.querySelectorAll(':scope > .track'));
        renderGrid(STATE.cats, $search.value);
    });

    $grid.addEventListener('click', (e) => {
        if (!STATE.layoutDraft) return;
        if (e.target.closest('.track-add')) return addTrack();
        const $remove = e.target.closest('.track-remove');
        if ($remove) removeTrack(Number($remove.closest('.track').dataset.track));
    });
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
    if ($gridPrevBtn) $gridPrevBtn.innerHTML = getSvgIcon('chevronLeft');
    if ($gridNextBtn) $gridNextBtn.innerHTML = getSvgIcon('chevronRight');
}

// 初始化語言
function initializeLanguage() {
    const currentLang = getCurrentLanguage();
    if ($langSelect) $langSelect.value = currentLang;
    updateUIText();
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
    if ($gridPrevBtn) $gridPrevBtn.title = t('btnScrollPrev');
    if ($gridNextBtn) $gridNextBtn.title = t('btnScrollNext');
    $settingsBtn.title = t('btnSettings');

    // 更新 footer
    const footerText = document.getElementById('footerText');
    if (footerText) footerText.textContent = t('footerText');
    const rateLink = document.getElementById('rateLink');
    if (rateLink) rateLink.textContent = t('footerRate');

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

    const settingsNormalizeGroupLabel = document.getElementById('settingsNormalizeGroupLabel');
    if (settingsNormalizeGroupLabel) settingsNormalizeGroupLabel.textContent = t('settingsNormalizeGroup');

    const settingsThemeLabel = document.getElementById('settingsThemeLabel');
    if (settingsThemeLabel) settingsThemeLabel.textContent = t('settingsTheme');

    // 排版模式 / 欄位數
    for (const [id, key] of [['settingsLayoutModeLabel', 'settingsLayoutMode'], ['layoutModeGrid', 'layoutModeGrid'],
        ['layoutModeFree', 'layoutModeFree'], ['settingsColCountLabel', 'settingsColCount'],
        ['colCount1Option', 'colCount1'], ['colCount2Option', 'colCount2'], ['colCount3Option', 'colCount3'], ['colCount4Option', 'colCount4']]) {
        const el = document.getElementById(id);
        if (el) el.textContent = t(key);
    }

    // 排版工具列
    for (const [id, key] of [['layoutWidthLabel', 'layoutWidth'], ['layoutWidth2', 'layoutWidthWide'], ['layoutWidth3', 'layoutWidthNormal'],
        ['layoutWidth4', 'layoutWidthNarrow'], ['layoutWidth5', 'layoutWidthNarrower'], ['layoutHint', 'layoutHint'], ['layoutResetBtn', 'btnLayoutReset']]) {
        const el = document.getElementById(id);
        if (el) el.textContent = t(key);
    }

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

    // 分類管理工具列
    for (const [id, key] of [['catFilterAll', 'catFilterAll'], ['catFilterEnabled', 'catFilterEnabled'],
        ['catFilterDisabled', 'catFilterDisabled'], ['catOrderHint', 'catOrderHint']]) {
        const el = document.getElementById(id);
        if (el) el.textContent = t(key);
    }

    const settingsBackupLabel = document.getElementById('settingsBackupLabel');
    if (settingsBackupLabel) settingsBackupLabel.textContent = t('settingsBackup');

    const exportSettingsBtn = document.getElementById('exportSettingsBtn');
    if (exportSettingsBtn) exportSettingsBtn.textContent = t('btnExportSettings');

    const importSettingsBtn = document.getElementById('importSettingsBtn');
    if (importSettingsBtn) importSettingsBtn.textContent = t('btnImportSettings');

    const focusCloseBtn = document.getElementById('focusCloseBtn');
    if (focusCloseBtn) focusCloseBtn.textContent = t('btnBack');


    // 更新 curtain button
    updateCurtainBtnLabel();
    updateLayoutBtn();
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
    if ($normalizeGroupToggle) $normalizeGroupToggle.checked = !!STATE.settings.ui.normalizeGroupEnabled;
    if ($normalizeGroupToggle) $normalizeGroupToggle.checked = !!STATE.settings.ui.normalizeGroupEnabled;
    if ($categoriesUI) renderCategoriesUI(STATE.settings.categories);
    applyLayoutMode();
    applyTheme(STATE.settings.ui.theme); // 以 storage 為準，同步回 localStorage
    updateCurtainBtnLabel();
    
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
    $settingsBtn.addEventListener('click', () => {
        // 每次開啟都以已儲存的分類為準（上次按取消的修改不殘留）
        if ($categoriesUI) renderCategoriesUI(STATE.settings.categories);
        setLayoutModeField(resolveLayoutMode(STATE.settings.ui));
        renderThemeSwatches(resolveTheme(STATE.settings.ui.theme));
        if ($colCountSelect) $colCountSelect.value = String(Math.min(4, STATE.settings.ui.colCount || 3));
        $settingsDialog.showModal();
    });

    // 編輯排版：按鈕切換進入 / 完成，Esc 取消
    $layoutBtn?.addEventListener('click', () => {
        if (STATE.layoutDraft) exitLayoutEdit(true); else enterLayoutEdit();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape' || !STATE.layoutDraft) return;
        if ($settingsDialog.open || $focusDialog?.open) return;
        exitLayoutEdit(false);
    });
    initLayoutDrag();
    $layoutWidthGroup?.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-cols]');
        if (btn) setLayoutWidth(Number(btn.dataset.cols));
    });
    $layoutResetBtn?.addEventListener('click', resetLayoutDraft);

    // 橫向捲動提示
    $gridPrevBtn?.addEventListener('click', () => scrollByTrack(-1));
    $gridNextBtn?.addEventListener('click', () => scrollByTrack(1));
    $grid.addEventListener('scroll', updateScrollHints, { passive: true });
    window.addEventListener('resize', updateScrollHints);

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

    // 點擊對話框外的空白區關閉
    $settingsDialog.addEventListener('click', (e) => {
        const rect = $settingsDialog.getBoundingClientRect();
        const inDialog = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
        if (!inDialog) $settingsDialog.close('cancel');
    });

    // 分類管理（UI）事件
    $addCategoryBtn?.addEventListener('click', () => {
        const arr = readCategoriesFromUI();
        const keys = new Set(arr.map(c => c.key));
        const key = genUniqueKey('custom', keys);
        arr.push({ key, label: '新分類', enabled: true, matchers: [{ type: 'domain', value: '' }] });
        OPEN_CAT_KEY = key;
        setCategoryFilter('all');
        renderCategoriesUI(arr);
        // 捲到新分類並聚焦名稱
        const $new = $categoriesUI.querySelector(`.cat[data-key="${key}"]`);
        $new?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        $new?.querySelector('.cat-label')?.select();
    });
    $resetCategoriesUIButton?.addEventListener('click', () => {
        renderCategoriesUI(defaultCategories());
    });
    $themeSwatches?.addEventListener('click', (e) => {
        const btn = e.target.closest('.theme-swatch');
        if (!btn) return;
        renderThemeSwatches(btn.dataset.themeKey);
        document.documentElement.dataset.theme = btn.dataset.themeKey; // 預覽
    });
    $layoutModeGroup?.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-mode]');
        if (btn) setLayoutModeField(btn.dataset.mode);
    });
    $catFilter?.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-filter]');
        if (btn) setCategoryFilter(btn.dataset.filter);
    });
    // 單一儲存：分類設定有誤時擋下關閉，避免無聲丟失
    $settingsSaveBtn?.addEventListener('click', (e) => {
        try {
            if ($categoriesUI && !readCategoriesFromUI().length) throw new Error(t('msgCategoryAtLeastOne'));
        } catch (err) {
            e.preventDefault();
            alert(t('msgCategoriesError') + (err?.message || err));
        }
    });

    // 設定備份 / 還原事件
    const $exportSettingsBtn = document.getElementById('exportSettingsBtn');
    const $importSettingsBtn = document.getElementById('importSettingsBtn');
    const $importSettingsFile = document.getElementById('importSettingsFile');
    $exportSettingsBtn?.addEventListener('click', () => exportSettings());
    $importSettingsBtn?.addEventListener('click', () => $importSettingsFile?.click());
    $importSettingsFile?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) importSettingsFromFile(file);
        e.target.value = ''; // 允許重複選擇同一檔案
    });

    $categoriesUI?.addEventListener('click', (e) => {
        const catEl = e.target.closest('.cat');
        if (!catEl) return;
        const key = catEl.dataset.key;
        // 點標題列（非開關 / 按鈕）展開或收合
        if (e.target.closest('.cat-header') && !e.target.closest('input, button')) {
            OPEN_CAT_KEY = catEl.classList.contains('open') ? null : key;
            $categoriesUI.querySelectorAll('.cat').forEach(el => el.classList.toggle('open', el.dataset.key === OPEN_CAT_KEY));
            return;
        }
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


            // 採用 UI 版本的分類設定
            try {
                if ($categoriesUI) {
                    const arr = readCategoriesFromUI();
                    if (Array.isArray(arr) && arr.length) STATE.settings.categories = arr;
                }
            } catch { /* ignore */ }

            // 排版模式切換：編輯中的草稿先放棄
            const layoutMode = $layoutModeGroup?.dataset.value || resolveLayoutMode(STATE.settings.ui);
            if (layoutMode !== resolveLayoutMode(STATE.settings.ui)) await exitLayoutEdit(false);
            STATE.settings.ui.layoutMode = layoutMode;
            STATE.settings.ui.theme = applyTheme($themeSwatches?.dataset.value || STATE.settings.ui.theme);
            if ($colCountSelect) STATE.settings.ui.colCount = Math.max(1, Math.min(4, parseInt($colCountSelect.value || 3, 10)));
            applyLayoutMode();

            STATE.settings.perCategoryLimit = perCategoryLimit;
            STATE.settings.recentDays = recentDays;
            STATE.settings.sortBy = sortBy;
            if ($normalizeGroupToggle) {
                STATE.settings.ui.normalizeGroupEnabled = !!$normalizeGroupToggle.checked;
            }
            await saveSettings(STATE.settings);
            await refreshAndRender();
        } else {
            applyTheme(STATE.settings.ui.theme); // 取消：還原主題預覽
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
