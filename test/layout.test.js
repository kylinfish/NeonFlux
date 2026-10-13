const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeLayout, resolveLayoutMode } = require('../src/layout.js');

test('無 layout 時依順序輪流分配到各軌', () => {
    const out = normalizeLayout(undefined, ['a', 'b', 'c', 'd', 'e'], 3);
    assert.deepEqual(out.tracks, [['a', 'd'], ['b', 'e'], ['c']]);
});

test('保留既有排列', () => {
    const layout = { tracks: [['a'], ['b', 'c'], ['d']] };
    assert.deepEqual(normalizeLayout(layout, ['a', 'b', 'c', 'd'], 3).tracks, [['a'], ['b', 'c'], ['d']]);
});

test('移除停用 / 刪除 / 重複的 key', () => {
    const layout = { tracks: [['a', 'x'], ['b', 'a'], ['c']] };
    assert.deepEqual(normalizeLayout(layout, ['a', 'b', 'c'], 3).tracks, [['a'], ['b'], ['c']]);
});

test('新分類放到卡片最少的軌', () => {
    const layout = { tracks: [['a', 'b'], ['c'], ['d', 'e']] };
    assert.deepEqual(normalizeLayout(layout, ['a', 'b', 'c', 'd', 'e', 'f'], 3).tracks, [['a', 'b'], ['c', 'f'], ['d', 'e']]);
});

test('軌數不受顯示欄數影響：超過時保留全部軌道', () => {
    const layout = { tracks: [['a'], ['b'], ['c'], ['d'], ['e']] };
    assert.deepEqual(normalizeLayout(layout, ['a', 'b', 'c', 'd', 'e'], 3).tracks, [['a'], ['b'], ['c'], ['d'], ['e']]);
});

test('保留使用者新增的空軌', () => {
    const layout = { tracks: [['a'], ['b'], []] };
    assert.deepEqual(normalizeLayout(layout, ['a', 'b'], 2).tracks, [['a'], ['b'], []]);
});

test('tracks 為空陣列時視為無 layout', () => {
    assert.deepEqual(normalizeLayout({ tracks: [] }, ['a', 'b'], 2).tracks, [['a'], ['b']]);
});

test('不改動輸入物件', () => {
    const layout = { tracks: [['a', 'x'], ['b']] };
    normalizeLayout(layout, ['a', 'b', 'c'], 1);
    assert.deepEqual(layout, { tracks: [['a', 'x'], ['b']] });
});

test('壞資料：track 非陣列視為空軌', () => {
    const layout = { tracks: [null, ['a']] };
    assert.deepEqual(normalizeLayout(layout, ['a', 'b'], 2).tracks, [['b'], ['a']]);
});

test('排版模式：新使用者預設經典欄位', () => {
    assert.equal(resolveLayoutMode({}), 'grid');
    assert.equal(resolveLayoutMode(undefined), 'grid');
});

test('排版模式：存過軌道排版、未設定模式 → 自由排版', () => {
    assert.equal(resolveLayoutMode({ layout: { tracks: [['a']] } }), 'free');
});

test('排版模式：明確設定優先於推斷', () => {
    assert.equal(resolveLayoutMode({ layoutMode: 'grid', layout: { tracks: [['a']] } }), 'grid');
    assert.equal(resolveLayoutMode({ layoutMode: 'free' }), 'free');
});
