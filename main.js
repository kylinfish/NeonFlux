// Categories definition with matching rules
const CATEGORY_RULES = [
    { key: 'aws', label: 'AWS', match: url => /(^|\.)aws\.amazon\.com|console\.aws\.amazon\.com/i.test(url) },
    { key: 'gitlab', label: 'GitLab', match: url => /gitlab\.com|\.gitlab\./i.test(url) },
    { key: 'figma', label: 'Figma', match: url => /figma\.com/i.test(url) },
    { key: 'clickup', label: 'ClickUp', match: url => /clickup\.com/i.test(url) },
    { key: 'gdocs', label: 'Google Docs', match: url => /docs\.google\.com\/document/i.test(url) },
    { key: 'gsheets', label: 'Google Sheets', match: url => /docs\.google\.com\/spreadsheets/i.test(url) },
    { key: 'gslides', label: 'Google Slides', match: url => /docs\.google\.com\/presentation/i.test(url) },
    { key: 'gcal', label: 'Google Calendar', match: url => /calendar\.google\.com/i.test(url) },
];

const DEFAULT_SETTINGS = { perCategoryLimit: 12, recentDays: 60, pinned: {} };

const $grid = document.getElementById('grid');
const $search = document.getElementById('search');
const $refreshBtn = document.getElementById('refreshBtn');
const $settingsBtn = document.getElementById('settingsBtn');
const $settingsDialog = document.getElementById('settingsDialog');
const $limitInput = document.getElementById('limitInput');
const $daysInput = document.getElementById('daysInput');

let STATE = {
    settings: DEFAULT_SETTINGS,
    items: [], // {title, url, lastVisitTime, visitCount}
    filtered: [],
};

// Storage helpers
function loadSettings() {
    return new Promise(resolve => {
        if (!chrome?.storage?.local) return resolve(DEFAULT_SETTINGS);
        chrome.storage.local.get(['settings'], res => {
            resolve(Object.assign({}, DEFAULT_SETTINGS, res.settings || {}));
        });
    });
}
function saveSettings(settings) {
    return new Promise(resolve => {
        if (!chrome?.storage?.local) return resolve();
        chrome.storage.local.set({ settings }, resolve);
    });
}

function getFavicon(url) {
    try {
        const u = new URL(url);
        return `${u.origin}/favicon.ico`;
    } catch { return ''; }
}

function rankScore(item) {
    // Heuristic: combine visitCount and recency
    const now = Date.now();
    const recency = Math.max(0, 1 - (now - item.lastVisitTime) / (1000*60*60*24*90)); // in last 90 days
    const freq = Math.log(1 + (item.visitCount || 1)) / Math.log(10);
    const titleBoost = /dashboard|project|board|task|issue|merge|doc|sheet|slide|console|compute|s3|ec2|rds/i.test(item.title || '') ? 0.15 : 0;
    return recency * 0.6 + freq * 0.4 + titleBoost;
}

function categorize(items) {
    const cats = {};
    CATEGORY_RULES.forEach(c => cats[c.key] = []);
    for (const it of items) {
        const url = it.url || '';
        for (const c of CATEGORY_RULES) {
            if (c.match(url)) { cats[c.key].push(it); break; }
        }
    }
    // Sort and cap
    for (const key in cats) {
        cats[key].sort((a,b) => (STATE.settings.pinned[b.url] ? 1:0) - (STATE.settings.pinned[a.url] ? 1:0) || rankScore(b) - rankScore(a));
        cats[key] = cats[key].slice(0, STATE.settings.perCategoryLimit);
    }
    return cats;
}

function renderGrid(cats, query = '') {
    $grid.innerHTML = '';
    const q = query.trim().toLowerCase();
    const entries = CATEGORY_RULES.map(c => [c, cats[c.key]]);

    for (const [cat, list] of entries) {
        const filtered = q
            ? list.filter(it => (it.title||'').toLowerCase().includes(q) || (it.url||'').toLowerCase().includes(q))
            : list;
        if (!filtered.length) continue;

        const card = document.createElement('section');
        card.className = `card ${cat.key}`;
        const count = filtered.length;

        card.innerHTML = `
            <div class="card-header">
              <div class="card-title">
                <span class="dot"></span>
                <span>${cat.label}</span>
                <span class="tag">共 ${count} 項</span>
              </div>
            </div>
            <div class="list"></div>
          `;
        const $list = card.querySelector('.list');

        for (const it of filtered) {
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
                  <span class="urlline" title="${escapeHtml(it.url)}">${escapeHtml(it.url.replace(/^https?:\/\//,''))}</span>
                </div>
              </div>
              <div class="actions">
                <span class="chip">${formatDays(it.lastVisitTime)} • ${it.visitCount||1} visit</span>
                <button class="pin ${pinActive ? 'active':''}" title="固定/取消固定" type="button" data-url="${encodeURIComponent(it.url)}">📌</button>
              </div>
            `;
            $list.appendChild(el);
        }

        $grid.appendChild(card);
    }
}

function escapeHtml(s='') {
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function formatDays(ts) {
    if (!ts) return '未知時間';
    const days = Math.max(0, Math.floor((Date.now() - ts) / (1000*60*60*24)));
    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    return `${days}d`;
}

async function fetchHistory() {
    const days = STATE.settings.recentDays;
    const startTime = Date.now() - days * 24 * 60 * 60 * 1000;
    const results = await new Promise(resolve => {
        chrome.history.search({
            text: '',
            startTime,
            maxResults: 5000
        }, resolve);
    });

    // Merge visit count by URL
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
    STATE.filtered = STATE.items.filter(it => CATEGORY_RULES.some(c => c.match(it.url)));
}

async function refreshAndRender() {
    await fetchHistory();
    const cats = categorize(STATE.filtered);
    renderGrid(cats, $search.value);
}

async function init() {
    STATE.settings = await loadSettings();
    $limitInput.value = STATE.settings.perCategoryLimit;
    $daysInput.value = STATE.settings.recentDays;

    await refreshAndRender();

    // Search shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== $search) {
            e.preventDefault();
            $search.focus();
            $search.select();
        }
    });
    $search.addEventListener('input', () => {
        const cats = categorize(STATE.filtered);
        renderGrid(cats, $search.value);
    });

    // Refresh
    $refreshBtn.addEventListener('click', async () => {
        $refreshBtn.disabled = true;
        $refreshBtn.textContent = '同步中...';
        try { await refreshAndRender(); }
        finally {
            $refreshBtn.disabled = false;
            $refreshBtn.textContent = '同步瀏覽記錄';
        }
    });

    // Settings open
    $settingsBtn.addEventListener('click', () => {
        $settingsDialog.showModal();
    });

    // Settings apply
    $settingsDialog.addEventListener('close', async () => {
        if ($settingsDialog.returnValue === 'confirm') {
            const perCategoryLimit = Math.max(3, Math.min(50, parseInt($limitInput.value || 12, 10)));
            const recentDays = Math.max(1, Math.min(365, parseInt($daysInput.value || 60, 10)));
            STATE.settings.perCategoryLimit = perCategoryLimit;
            STATE.settings.recentDays = recentDays;
            await saveSettings(STATE.settings);
            await refreshAndRender();
        }
    });

    // Delegate pin toggle
    $grid.addEventListener('click', async (e) => {
        const btn = e.target.closest('.pin');
        if (!btn) return;
        e.preventDefault();
        const url = decodeURIComponent(btn.dataset.url);
        const active = !!STATE.settings.pinned[url];
        if (active) delete STATE.settings.pinned[url];
        else STATE.settings.pinned[url] = true;
        await saveSettings(STATE.settings);
        // Re-render to move pins to top
        const cats = categorize(STATE.filtered);
        renderGrid(cats, $search.value);
    });
}

// Boot
if (typeof chrome !== 'undefined' && chrome.history) {
    init();
} else {
    // Preview mode (no chrome API)
    console.warn('Preview mode - chrome APIs not available');
    STATE.settings = DEFAULT_SETTINGS;
    STATE.filtered = [
        { title:'AWS Console - EC2', url:'https://console.aws.amazon.com/ec2/v2/home', lastVisitTime: Date.now()-3600e3, visitCount: 12 },
        { title:'GitLab - Project A', url:'https://gitlab.com/org/project', lastVisitTime: Date.now()-86400e3*2, visitCount: 8 },
        { title:'Figma - UI Kit', url:'https://www.figma.com/file/abc/UI-Kit', lastVisitTime: Date.now()-86400e3*4, visitCount: 5 },
        { title:'ClickUp - Tasks', url:'https://app.clickup.com/123/board', lastVisitTime: Date.now()-86400e3*1, visitCount: 21 },
        { title:'Document Spec', url:'https://docs.google.com/document/d/xxx', lastVisitTime: Date.now()-86400e3*3, visitCount: 9 },
        { title:'Budget Sheet', url:'https://docs.google.com/spreadsheets/d/yyy', lastVisitTime: Date.now()-86400e3*5, visitCount: 6 },
        { title:'Q4 Slides', url:'https://docs.google.com/presentation/d/zzz', lastVisitTime: Date.now()-86400e3*7, visitCount: 3 },
        { title:'Google Calendar', url:'https://calendar.google.com/calendar/u/0/r', lastVisitTime: Date.now()-3600e3*5, visitCount: 14 }
    ];
    const cats = categorize(STATE.filtered);
    renderGrid(cats, '');
}
