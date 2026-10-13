// 主題配色：<html data-theme="…"> 切換 CSS token（實際色值定義在 newtab.html）
// 此檔於 <head> 同步載入，載入當下即套用 localStorage 中的主題，避免開頁閃爍

const THEME_STORAGE_KEY = 'neonflux-theme';
const DEFAULT_THEME = 'neon';

// 設定頁色塊用的代表色：底色 / 強調色 / 兩顆主要光球
const THEMES = {
    neon: { bg: '#0b0f14', accent: '#7cc3ff', blobs: ['#7cc3ff', '#ad7cff'] },
    aurora: { bg: '#06110f', accent: '#5ef2b0', blobs: ['#5ef2b0', '#4fd1ff'] },
    sakura: { bg: '#120a12', accent: '#ff8cc6', blobs: ['#ff7eb6', '#c39bff'] },
    graphite: { bg: '#0c0c0e', accent: '#d4d4d8', blobs: ['#9a9aa4', '#5c5c66'] },
    matcha: { bg: '#0b0f0a', accent: '#a8d48a', blobs: ['#96c86e', '#dccd96'] },
};

function resolveTheme(name) {
    return Object.prototype.hasOwnProperty.call(THEMES, name) ? name : DEFAULT_THEME;
}

// 套用主題並同步到 localStorage（供下次開頁的同步載入使用）
function applyTheme(name) {
    const theme = resolveTheme(name);
    if (typeof document !== 'undefined') document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch { /* ignore */ }
    return theme;
}

if (typeof module !== 'undefined') {
    module.exports = { THEMES, DEFAULT_THEME, resolveTheme };
} else {
    let saved = null;
    try { saved = localStorage.getItem(THEME_STORAGE_KEY); } catch { /* ignore */ }
    document.documentElement.dataset.theme = resolveTheme(saved);
}
