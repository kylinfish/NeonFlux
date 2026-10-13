# 設定匯出 / 匯入(備份還原) — 設計文件

**日期:** 2026-08-04
**狀態:** 已核准設計,待實作

## 目標

讓使用者能**匯出設定成 JSON 檔備份、之後匯入還原**,主要解決「重裝擴充後所有自訂分類規則與釘選網址都要重寫」的痛點。

## 資料模型

所有可攜設定存在 `chrome.storage.local` 的單一 `settings` 物件:
- `categories[]`(含 `matchers` 的 domain/prefix/regex 規則)— 使用者在意的「網址規則」
- `pinned`(釘選網址 map)— 使用者在意的「釘選」
- 其他偏好:`perCategoryLimit`、`recentDays`、`sortBy`、`ui.*`
- 註:語言存在 `localStorage`(`neonflux-lang`),**不屬於** settings 備份範圍。

## 設計決定(已確認)

- **匯出範圍**:整個 `settings` 物件(完整備份,已涵蓋分類規則 + 釘選)。
- **匯入行為**:**完全取代**(還原備份),覆寫前跳 `confirm` 確認。
- **免新增權限**:export 用 Blob + `<a download>`;import 用 `<input type=file>` + `FileReader`。

## 檔案格式

```json
{
  "app": "NeonFlux",
  "type": "settings-backup",
  "version": 1,
  "exportedAt": "<ISO8601>",
  "settings": { /* 整個 settings 物件 */ }
}
```
下載檔名:`neonflux-backup-YYYY-MM-DD.json`

## 改動範圍

### `src/newtab.html`
- 設定對話框(`#settingsDialog`)一般區塊內、`settings-actions` 之前,新增「備份 / 還原」列:
  - `#settingsBackupLabel` 標籤
  - `#exportSettingsBtn`(`type="button"`)、`#importSettingsBtn`(`type="button"`)
  - `#importSettingsFile`(隱藏 `<input type="file" accept=".json,application/json">`)
- 按鈕務必 `type="button"`,避免在 `<form method="dialog">` 內觸發送出而關閉對話框。

### `src/main.js`
- 常數:`BACKUP_APP='NeonFlux'`、`BACKUP_TYPE='settings-backup'`、`BACKUP_VERSION=1`。
- `exportSettings()`:包 metadata → `JSON.stringify(payload, null, 2)` → Blob → anchor download → `revokeObjectURL`。失敗 `alert(msgExportError)`。
- `isValidBackup(obj)`:須為物件、含 `settings` 物件且 `settings.categories` 為陣列;若有 `type` 則須等於 `settings-backup`。
- `applyImportedSettings(imported)`:`deepMerge(DEFAULT_SETTINGS, imported)` 補齊 → 缺 categories 補 `defaultCategories()` → 寫 `STATE.settings` + `saveSettings` → 重新填設定欄位(limit/days/sort/colCount/normalize/categoriesUI)+ `applyColumnCount` + `refreshAndRender`。
- `importSettingsFromFile(file)`:`FileReader` 讀文字 → `JSON.parse`(失敗提示 `msgImportInvalid`)→ `isValidBackup` 驗證 → `confirm(msgImportConfirm)` → `applyImportedSettings` → `alert(msgImportSuccess)`。
- `init()` 綁定:匯出鈕 → `exportSettings`;匯入鈕 → 觸發隱藏 file input;file input `change` → `importSettingsFromFile`,並清空 `value` 以允許重選同檔。
- `updateUIText()`:補上三個新元素的 i18n 文字。

### `src/i18n.js`(zh + en)
新增鍵:`settingsBackup`、`btnExportSettings`、`btnImportSettings`、`msgImportConfirm`、`msgImportSuccess`、`msgImportError`、`msgImportInvalid`、`msgExportError`。

### 發版整理(併入未發布的 v1.2.0)
- `FEATURES.md`:v1.2.0 節點加一條 `Added`(設定匯出/匯入)。
- `intro/public/release.html`:v1.2.0 節點(zh+en)加 `added` section(設定匯出/匯入)。

## 不做(YAGNI)

- 不做合併匯入、不做選擇性欄位匯出、不做雲端同步。
- 語言偏好不納入備份。

## 驗收標準

1. 設定對話框有「匯出設定 / 匯入設定」兩個按鈕(中英文皆正確)。
2. 匯出下載 `neonflux-backup-YYYY-MM-DD.json`,內容含完整 settings。
3. 匯入合法備份 → 確認 → 分類/釘選/偏好全部還原、主畫面即時更新。
4. 匯入壞檔或格式不符 → 明確錯誤提示、不改動現有設定。
5. 覆寫前一定先 `confirm`。
6. `main.js`、`release.html` 內嵌 JS 通過語法檢查。
