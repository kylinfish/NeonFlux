const test = require('node:test');
const assert = require('node:assert/strict');
const { majorMinor, isFeatureUpdate, shouldShowWhatsNew, releaseNotesUrl } = require('../src/version.js');

test('majorMinor 只取前兩段', () => {
    assert.equal(majorMinor('1.3.0'), '1.3');
    assert.equal(majorMinor('1.10.2'), '1.10');
    assert.equal(majorMinor('2'), '2.0');
    assert.equal(majorMinor(undefined), '0.0');
});

test('isFeatureUpdate：major / minor 變動才算', () => {
    assert.equal(isFeatureUpdate('1.2.0', '1.3.0'), true);
    assert.equal(isFeatureUpdate('1.3.0', '1.3.1'), false);
    assert.equal(isFeatureUpdate('1.9.0', '2.0.0'), true);
    assert.equal(isFeatureUpdate(undefined, '1.3.0'), false);
});

test('shouldShowWhatsNew：全新安裝不顯示，舊使用者顯示', () => {
    assert.equal(shouldShowWhatsNew(null, '1.3.0', false), false);
    assert.equal(shouldShowWhatsNew(null, '1.3.0', true), true);
    assert.equal(shouldShowWhatsNew('1.2.0', '1.3.0', true), true);
    assert.equal(shouldShowWhatsNew('1.3.0', '1.3.0', true), false);
    assert.equal(shouldShowWhatsNew('1.3.0', '1.3.2', true), false);
});

test('releaseNotesUrl 帶語言參數', () => {
    assert.match(releaseNotesUrl('en'), /release\.html\?lang=en$/);
    assert.match(releaseNotesUrl('zh'), /\?lang=zh$/);
    assert.match(releaseNotesUrl('fr'), /\?lang=zh$/);
});
