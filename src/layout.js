// 軌道式排版（Track Layout）
// layout = { tracks: [['gdocs'], ['gitlab', 'jira'], ...] }，每軌為分類 key 陣列（由上而下）
// 軌數不限，超出一畫面可顯示的軌數時橫向滾動

// 一畫面顯示軌數（軌道寬度）：1–5
function clampColCount(n) {
    return Math.max(1, Math.min(5, parseInt(n || 3, 10) || 3));
}

// 依目前啟用分類補齊 / 清理 layout（純函式，不改動輸入）
// 軌數由使用者自行增減；initialCols 只用於舊使用者（無 layout）的初始分配
function normalizeLayout(layout, enabledKeys = [], initialCols = 3) {
    const enabled = new Set(enabledKeys);
    const seen = new Set();

    // 舊使用者：無 layout → 依分類順序輪流分配
    if (!layout || !Array.isArray(layout.tracks) || layout.tracks.length === 0) {
        const n = clampColCount(initialCols);
        const tracks = Array.from({ length: n }, () => []);
        enabledKeys.forEach((k, i) => tracks[i % n].push(k));
        return { tracks };
    }

    // 移除停用 / 刪除 / 重複的 key
    const tracks = layout.tracks.map(track => (Array.isArray(track) ? track : []).filter(k => {
        if (!enabled.has(k) || seen.has(k)) return false;
        seen.add(k);
        return true;
    }));

    // 新分類：放到卡片最少的那一軌最下面
    for (const k of enabledKeys) {
        if (seen.has(k)) continue;
        seen.add(k);
        let target = tracks[0];
        for (const t of tracks) if (t.length < target.length) target = t;
        target.push(k);
    }

    return { tracks };
}

// 從 DOM 讀回 layout：每個 .track 內 .card 的 data-key 順序
function readLayoutFromTracks(trackEls) {
    return {
        tracks: Array.from(trackEls, el =>
            Array.from(el.querySelectorAll(':scope > .card'), card => card.dataset.key).filter(Boolean)
        ),
    };
}

if (typeof module !== 'undefined') {
    module.exports = { normalizeLayout, readLayoutFromTracks, clampColCount };
}
