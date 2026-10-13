# 安裝即取代預設新分頁 — 設計文件

**日期:** 2026-08-03
**狀態:** 已核准設計,待實作

## 目標

安裝 NeonFlux 後,**自動接管 Chrome 預設新分頁** —— 每個新分頁(Ctrl+T、開新視窗)直接載入 NeonFlux 完整儀表板。**不詢問、不讓使用者選、不提供關閉設定**。

這等於重新啟用先前 commit `67e9d3d` 移除的 `chrome_url_overrides` 行為。

## 背景

目前 NeonFlux 僅透過點擊工具列圖示開啟(`background.js` 的 `chrome.action.onClicked`),不接管新分頁。歷史上 commit `67e9d3d` 曾刻意移除 `chrome_url_overrides` 與「設為預設新分頁」設定。本次需求為反轉該決定,並以「安裝即生效、無選項」的最簡形式實作。

## 技術限制(已與使用者確認接受)

- `chrome_url_overrides.newtab` 是 manifest 靜態宣告,**全有全無**,無法在執行期開關。
- 接管後使用者**無法在擴充功能內關閉**,只能停用整個擴充功能。
- Chrome Web Store 對接管新分頁的擴充功能有**額外審查**。日後若審查或使用者反彈,需再次移除。

## 改動範圍

### 1. `src/manifest.json`(核心)
- 新增:
  ```json
  "chrome_url_overrides": { "newtab": "newtab.html" }
  ```
- 版本號 bump:`1.1.0` → `1.2.0`(SemVer,新增使用者可見功能)。

### 2. `src/background.js`
- **不改動**。`chrome.action.onClicked` 開新分頁的行為與 override 並存無衝突(點圖示開的新分頁本來就是 NeonFlux)。

### 3. `src/newtab.html` / `src/main.js`
- **不改動**。無需新增任何「取代新分頁」的設定開關或提示 modal(需求已明確不讓使用者選)。

### 4. `FEATURES.md`
- 在版本歷史新增 v1.2.0 節點,記錄「重新啟用預設新分頁接管(`chrome_url_overrides`)」。

### 5. `intro/public/release.html`
- 在 `releases.zh` 與 `releases.en` 陣列**最前面**各插入一個 v1.2.0 節點(`status: 'latest'`),分類為 `changed`(重新啟用預設新分頁接管)。
- 將舊的 v1.1.0 節點 `status: 'latest'` 改為 `'stable'`。
- 更新 hero meta chips:`metaUpdated` 日期、`metaTotal` 版本節點數、`metaRange`(視情況)。

## 不做(YAGNI)

- 不加安裝後歡迎/教學 modal。
- 不加「設為/取消預設新分頁」的設定選項。
- 不加極簡模式或 opt-out 落點頁。

## 驗收標準

1. Load unpacked 載入 `src/` 後,開新分頁顯示 NeonFlux 完整儀表板。
2. 點工具列圖示仍能開啟 NeonFlux 新分頁(行為不變)。
3. `manifest.json` 版本為 `1.2.0`。
4. `release.html` 最新節點為 v1.2.0 且頁面正常渲染(中英文皆可)。
5. `FEATURES.md` 版本歷史含 v1.2.0。

## 發布流程(依 README)

1. 更新 `manifest.json` 版本號 ✅(本次含)
2. 更新 `release.html` 版本節點 ✅(本次含)
3. Commit + Tag(`v1.2.0`)—— 交由使用者於核准後執行
4. Push:`git push origin main --tags` —— 交由使用者執行
