// 設定：分類模板（可被使用者覆寫）
function defaultCategories() {
  return [
    {
      key: 'aws', label: 'AWS', enabled: true,
      matchers: [
        { type: 'regex', value: '(^|\\.)aws\\.amazon\\.com|console\\.aws\\.amazon\\.com' }
      ]
    },
    {
      key: 'gitlab', label: 'GitLab', enabled: true,
      matchers: [ { type: 'regex', value: 'gitlab\\.com|\\.gitlab\\.' } ]
    },
    {
      key: 'gdocs', label: 'Google Docs', enabled: true,
      matchers: [ { type: 'regex', value: 'docs\\.google\\.com\\/document' } ]
    },
    {
      key: 'gslides', label: 'Google Slides', enabled: true,
      matchers: [ { type: 'regex', value: 'docs\\.google\\.com\\/presentation' } ]
    },
    {
      key: 'gsheets', label: 'Google Sheets', enabled: true,
      matchers: [ { type: 'regex', value: 'docs\\.google\\.com\\/spreadsheets' } ]
    },
    {
      key: 'figma', label: 'Figma', enabled: true,
      matchers: [ { type: 'domain', value: 'figma.com' } ]
    }
  ];
}

const DEFAULT_SETTINGS = {
  perCategoryLimit: 12,
  recentDays: 60,
  sortBy: 'latest', // 'latest' | 'smart'
  ui: { fixHeightEnabled: true, maxVisiblePerGroup: 5 },
  pinned: {},
  categories: defaultCategories()
};

// DOM refs
const $grid = document.getElementById('grid');
const $search = document.getElementById('search');
const $refreshBtn = document.getElementById('refreshBtn');
const $settingsBtn = document.getElementById('settingsBtn');
const $toggleFixBtn = null;
const $settingsDialog = document.getElementById('settingsDialog');
const $limitInput = document.getElementById('limitInput');
const $daysInput = document.getElementById('daysInput');
const $sortSelect = document.getElementById('sortSelect');
const $fixHeightCheckbox = null;
const $maxVisibleInput = document.getElementById('maxVisibleInput');
const $categoriesTextarea = document.getElementById('categoriesTextarea');
const $resetCategoriesBtn = document.getElementById('resetCategoriesBtn');
const $saveCategoriesBtn = document.getElementById('saveCategoriesBtn');

const $focusDialog = document.getElementById('focusDialog');
const $focusList = document.getElementById('focusList');
const $focusTitle = document.getElementById('focusTitle');
const $focusDot = document.getElementById('focusDot');
const $focusCloseBtn = document.getElementById('focusCloseBtn');

let STATE = {
  settings: DEFAULT_SETTINGS,
  items: [], // 原始歷史：{title, url, lastVisitTime, visitCount}
  filtered: [], // 過濾後（符合分類）
  cats: {}, // 最新一次 categorize 結果
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
      if (!s.ui) s.ui = { fixHeightEnabled: true, maxVisiblePerGroup: 5 };
      if (!s.sortBy) s.sortBy = 'latest';
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

// 排序分數（智慧排序）
function rankScore(item) {
  const now = Date.now();
  const recency = Math.max(0, 1 - (now - item.lastVisitTime) / (1000*60*60*24*90));
  const freq = Math.log(1 + (item.visitCount || 1)) / Math.log(10);
  const titleBoost = /dashboard|project|board|task|issue|merge|doc|sheet|slide|console|compute|s3|ec2|rds/i.test(item.title || '') ? 0.15 : 0;
  return recency * 0.6 + freq * 0.4 + titleBoost;
}

// 分類比對
function matchUrl(url, matchers=[]) {
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
    list.sort((a,b) => {
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

function escapeHtml(s='') {
  return s.replace(/[&<>"']/g, c => ({'&':'&','<':'<','>':'>','"':'"',"'":'&#39;'}[c]));
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

function renderListItems($container, list) {
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
          <span class="urlline" title="${escapeHtml(it.url)}">${escapeHtml(it.url.replace(/^https?:\/\//,''))}</span>
        </div>
      </div>
      <div class="actions">
        <span class="chip">${formatDays(it.lastVisitTime)} • ${it.visitCount||1} visit</span>
        <button class="pin ${pinActive ? 'active':''}" title="固定/取消固定" type="button" data-url="${encodeURIComponent(it.url)}">📌</button>
      </div>
    `;
    // 圖示 fallback：/favicon.ico 失敗時改用 Google S2，再失敗用內建 SVG
    const $img = el.querySelector('.favicon img');
    if ($img) {
      $img.onerror = () => {
        $img.onerror = () => {
          $img.onerror = null;
          $img.src = defaultIconDataUri();
        };
        $img.src = getFallbackFavicon(it.url);
      };
    }
    $container.appendChild(el);
  }
}

function renderGrid(cats, query='') {
  $grid.innerHTML = '';
  const q = query.trim().toLowerCase();
  const order = (STATE.settings.categories || []).filter(c => c.enabled !== false);

  for (const cat of order) {
    const list = cats[cat.key] || [];
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
        <div class="actions">
          <button class="btn focus-btn" type="button" data-key="${cat.key}" title="聚焦檢視">⛶</button>
        </div>
      </div>
      <div class="list"></div>
    `;

    const $list = card.querySelector('.list');
    // 固定高度永遠啟用：最多顯示 N 筆，溢位滾動；若實際 < N，則高度自然收縮
    {
      const n = Math.max(1, Number(STATE.settings.ui.maxVisiblePerGroup||5));
      $list.style.maxHeight = `calc(var(--row-h) * ${n})`;
      $list.style.overflow = 'auto';
    }

    renderListItems($list, filtered);
    $grid.appendChild(card);
  }
}

function getCategoryFullList(key) {
  const order = (STATE.settings.categories || []).filter(c => c.enabled !== false);
  const cat = order.find(c => c.key === key);
  if (!cat) return [];
  const list = STATE.filtered.filter(it => matchUrl(it.url, cat.matchers));
  list.sort((a,b) => {
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

function updateFixToggleLabel() {
  const on = !!STATE.settings.ui?.fixHeightEnabled;
  if ($toggleFixBtn) $toggleFixBtn.textContent = `固定高度: ${on ? '開' : '關'}`;
}

async function init() {
  STATE.settings = await loadSettings();

  // 初始 UI 值
  $limitInput.value = STATE.settings.perCategoryLimit;
  $daysInput.value = STATE.settings.recentDays;
  if ($sortSelect) $sortSelect.value = STATE.settings.sortBy || 'latest';
  if ($fixHeightCheckbox) $fixHeightCheckbox.checked = !!STATE.settings.ui.fixHeightEnabled;
  if ($maxVisibleInput) $maxVisibleInput.value = STATE.settings.ui.maxVisiblePerGroup || 5;
  if ($categoriesTextarea) $categoriesTextarea.value = JSON.stringify(STATE.settings.categories, null, 2);
  updateFixToggleLabel();

  await refreshAndRender();

  // 快捷鍵聚焦搜尋
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== $search) { e.preventDefault(); $search.focus(); $search.select(); }
    if (e.key === 'Escape' && $focusDialog?.open) { $focusDialog.close('cancel'); }
  });

  // 搜尋輸入
  $search.addEventListener('input', () => {
    const cats = categorize(STATE.filtered);
    renderGrid(cats, $search.value);
  });

  // 同步
  $refreshBtn.addEventListener('click', async () => {
    $refreshBtn.disabled = true; $refreshBtn.textContent = '同步中...';
    try { await refreshAndRender(); }
    finally { $refreshBtn.disabled = false; $refreshBtn.textContent = '同步瀏覽記錄'; }
  });

  // 固定高度永遠開啟（移除切換）

  // 設定開關
  $settingsBtn.addEventListener('click', () => { $settingsDialog.showModal(); });

  // 設定：分類重置
  $resetCategoriesBtn?.addEventListener('click', () => {
    $categoriesTextarea.value = JSON.stringify(defaultCategories(), null, 2);
  });
  // 設定：分類儲存（不關閉視窗）
  $saveCategoriesBtn?.addEventListener('click', async () => {
    try {
      const value = JSON.parse($categoriesTextarea.value);
      if (!Array.isArray(value)) throw new Error('必須是陣列');
      // 簡單驗證欄位
      for (const c of value) {
        if (!c.key || !c.label) throw new Error('每個分類需包含 key 與 label');
        if (!Array.isArray(c.matchers)) c.matchers = [];
        if (typeof c.enabled === 'undefined') c.enabled = true;
      }
      STATE.settings.categories = value;
      await saveSettings(STATE.settings);
      await refreshAndRender();
      alert('分類已儲存');
    } catch (err) {
      alert('分類 JSON 無法解析：' + (err?.message || err));
    }
  });

  // 設定套用（關閉時觸發）
  $settingsDialog.addEventListener('close', async () => {
    if ($settingsDialog.returnValue === 'confirm') {
      const perCategoryLimit = Math.max(5, Math.min(200, parseInt($limitInput.value || 12, 10)));
      const recentDays = Math.max(1, Math.min(365, parseInt($daysInput.value || 60, 10)));
      const sortBy = ($sortSelect?.value === 'smart') ? 'smart' : 'latest';
      const maxVisible = Math.max(3, Math.min(20, parseInt($maxVisibleInput.value || 5, 10)));
      // 也嘗試套用分類 JSON（若可解析）
      try {
        if ($categoriesTextarea?.value) {
          const value = JSON.parse($categoriesTextarea.value);
          if (Array.isArray(value) && value.length) STATE.settings.categories = value;
        }
      } catch { /* ignore */ }

      STATE.settings.perCategoryLimit = perCategoryLimit;
      STATE.settings.recentDays = recentDays;
      STATE.settings.sortBy = sortBy;
      STATE.settings.ui.maxVisiblePerGroup = maxVisible;

      await saveSettings(STATE.settings);
      await refreshAndRender();
      updateFixToggleLabel();
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
  $focusDialog?.addEventListener('close', () => {
    // 關閉後不需特別動作
  });
}

function openFocus(key) {
  const order = (STATE.settings.categories || []).filter(c => c.enabled !== false);
  const cat = order.find(c => c.key === key);
  if (!cat) return;
  $focusTitle.textContent = cat.label;
  // dot 顏色沿用 key class 寫在 style 上
  const temp = document.createElement('div');
  temp.className = `card ${cat.key}`;
  document.body.appendChild(temp);
  const dotColor = getComputedStyle(temp.querySelector(':scope .dot') || temp).backgroundColor;
  document.body.removeChild(temp);
  if ($focusDot) $focusDot.style.background = dotColor || '';

  const list = getCategoryFullList(key);
  renderListItems($focusList, list);
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
    { title:'AWS Console - EC2', url:'https://console.aws.amazon.com/ec2/v2/home', lastVisitTime: Date.now()-3600e3, visitCount: 12 },
    { title:'GitLab - Project A', url:'https://gitlab.com/org/project', lastVisitTime: Date.now()-86400e3*2, visitCount: 8 },
    { title:'Figma - UI Kit', url:'https://www.figma.com/file/abc/UI-Kit', lastVisitTime: Date.now()-86400e3*4, visitCount: 5 },
    { title:'Document Spec', url:'https://docs.google.com/document/d/xxx', lastVisitTime: Date.now()-86400e3*3, visitCount: 9 },
    { title:'Budget Sheet', url:'https://docs.google.com/spreadsheets/d/yyy', lastVisitTime: Date.now()-86400e3*5, visitCount: 6 },
    { title:'Q4 Slides', url:'https://docs.google.com/presentation/d/zzz', lastVisitTime: Date.now()-86400e3*7, visitCount: 3 }
  ];
  // 預設分類
  STATE.settings.categories = defaultCategories();
  const cats = categorize(STATE.filtered);
  renderGrid(cats, '');
}
