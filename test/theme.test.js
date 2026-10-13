const test = require('node:test');
const assert = require('node:assert/strict');
const { THEMES, DEFAULT_THEME, resolveTheme } = require('../src/theme.js');

test('5 組主題，預設為 neon', () => {
    assert.deepEqual(Object.keys(THEMES), ['neon', 'aurora', 'sakura', 'graphite', 'matcha']);
    assert.equal(DEFAULT_THEME, 'neon');
});

test('已知主題原樣回傳', () => {
    for (const k of Object.keys(THEMES)) assert.equal(resolveTheme(k), k);
});

test('未知 / 空值 / 原型屬性 → neon', () => {
    for (const v of ['ember', '', null, undefined, 'toString', '__proto__']) assert.equal(resolveTheme(v), 'neon');
});
