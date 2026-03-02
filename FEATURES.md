# NeonFlux - Features Overview

## Core Features

### 1. 自動分類瀏覽記錄
- **自動分類**: 根據預設或自訂規則自動將瀏覽記錄分類
- **支援的分類**: Google Workspace (Docs, Sheets, Slides)、AWS、GitLab、Figma、Jira、Linear、Asana 等
- **自訂分類**: 使用者可新增、編輯、刪除分類，支援 domain、prefix、regex 三種匹配規則
- **分類管理**: 進階設定中可管理所有分類的啟用狀態、圖示、匹配規則

### 2. 智慧排序與篩選
- **排序模式**: 
  - 最新在前：按訪問時間排序
  - 智慧排序：結合訪問時間、訪問次數、標題關鍵字的複合排序
- **搜尋功能**: 即時搜尋標題或 URL
- **時間篩選**: 只顯示近 N 天的瀏覽記錄
- **釘選功能**: 可釘選常用連結置頂

### 3. 隱私門簾
- **投影模式**: 適合在會議或演講時使用，隱藏敏感的瀏覽記錄
- **門簾鎖定**: 可鎖定門簾狀態，下次載入時自動啟用
- **快速切換**: 一鍵開啟/關閉隱私門簾

### 4. 快速連結 (Shortcuts) ⭐ NEW
- **快速新增**: 簡單的 modal 介面，只需輸入 URL
- **自動 Favicon 提取**: 
  - 自動從頁面 HTML 提取 favicon
  - 支援多種 favicon 標籤格式（icon、shortcut icon、apple-touch-icon、bookmark 等）
  - 多層級 fallback：DuckDuckGo、Google Favicon API、預設 icon
- **智慧字母 Icon**: 無法載入圖片時，自動顯示網站標題的第一個英文字母
  - 彩色背景，根據標題自動選擇顏色
  - 提供視覺識別
- **拖拽排序**: 直接拖拽 shortcut icon 調整順序
- **快速刪除**: Hover 時顯示刪除按鈕，點擊即可移除
- **持久化儲存**: 所有 shortcut 儲存在 Chrome storage 中

### 5. 聚焦檢視
- **完整列表**: 點擊分類卡片的「聚焦」按鈕查看該分類的完整列表
- **全屏顯示**: 專注於單一分類的所有連結
- **保留功能**: 在聚焦檢視中仍可釘選/取消釘選連結

### 6. 多語言支援
- **中文 (繁體)**: 完整的繁體中文介面
- **英文**: 完整的英文介面
- **動態切換**: 在設定中即時切換語言

### 7. 自訂設定
- **分類顯示數量**: 調整每個分類最多顯示的連結數
- **時間範圍**: 選擇只顯示最近多少天的記錄
- **欄位數**: 調整主頁面的欄位數（1-4 欄）
- **排序方式**: 選擇排序模式（最新在前/智慧排序）

### 8. 本機儲存
- **隱私優先**: 所有資料儲存在本機，不上傳到雲端
- **Chrome Storage**: 使用 Chrome 的本機儲存 API
- **跨裝置同步**: 如果啟用 Chrome 同步，設定會自動同步

## UI/UX Features

### 設計特色
- **玻璃態設計**: 毛玻璃效果的現代化介面
- **液態背景**: 動畫漸變背景，營造流動感
- **響應式設計**: 完美適配各種螢幕尺寸
- **平滑動畫**: 所有互動都有流暢的過渡效果

### 操作特色
- **鍵盤快捷鍵**: 
  - `/` 快速聚焦搜尋框
  - `Enter` 在 shortcut modal 中新增連結
- **拖拽互動**: Shortcut 可拖拽排序
- **Hover 反饋**: 所有可互動元素都有視覺反饋
- **滾動導航**: Shortcut 超過寬度時自動顯示左右滑動按鈕

## Technical Features

### 資料處理
- **去重**: 自動合併相同 URL 的多次訪問
- **標題提取**: 優先使用瀏覽記錄中的標題，無則使用域名
- **URL 正規化**: 自動補充 protocol（http/https）

### Favicon 提取
- **多層級提取**:
  1. 頁面 HTML 中的 link 標籤
  2. 網站 origin 的 `/favicon.ico`
  3. DuckDuckGo icon 服務
  4. Google Favicon API
  5. 預設 SVG icon 或字母 icon
- **支援的標籤類型**:
  - `rel="icon"`
  - `rel="shortcut icon"`
  - `rel="apple-touch-icon"`
  - `rel="apple-touch-icon-precomposed"`
  - `rel="bookmark"`
  - 通用 favicon/icon 路徑

### 效能優化
- **快取**: 使用 `force-cache` 模式快取 favicon 請求
- **非同步載入**: Favicon 提取不阻塞 UI
- **懶加載**: 只在需要時提取 favicon

## Permissions

- **history**: 讀取瀏覽記錄
- **storage**: 儲存使用者設定和 shortcut
- **tabs**: 獲取標籤資訊（用於 shortcut 功能）

## File Structure

```
NeonFlux/
├── newtab.html          # 主 UI 和樣式
├── main.js              # 核心邏輯和事件處理
├── i18n.js              # 多語言翻譯
├── icons.js             # SVG 圖標定義
├── manifest.json        # Chrome 擴充功能配置
├── icon.png             # 應用圖標
├── icon_white.png       # 深色模式圖標
├── FEATURES.md          # 功能說明（本檔案）
└── UPDATE_SUMMARY.txt   # 更新摘要
```

## Version History

### 2026-02 更新（from `c04c03308e960b`）

#### Added
- URL 分組開關：新增「合併相同路徑（忽略參數）」設定，可切換是否把 query 參數視為同一筆紀錄（`3b9d3c5`）。
- Footer 評分連結：新增 Chrome Web Store「給 5 星好評」入口，支援中英文文案（`afb1853`）。
- 停用分類視覺回饋：分類停用時在設定面板以淡化樣式顯示（`d82844c`）。

#### Changed
- 設定面板 UI 全面改版，提升可讀性與操作密度（`293bc95`）。
- 分類編輯器版面優化，含欄位排列與互動結構調整（`9ff8d33`）。
- 取消 `chrome_url_overrides`，改為點擊工具列 icon 開新分頁開啟 NeonFlux，並同步移除「設為預設新分頁」設定（`67e9d3d`）。

#### Removed
- 移除 Shortcuts（快速連結）整體功能與相關 UI/邏輯（`b5d6d97`）。

#### Fixed
- 停用分類卡片會阻擋誤觸操作，只保留啟用切換可互動（`8e8b880`）。

### v1.0.0 - Initial Release
- 自動分類瀏覽記錄
- 智慧排序和搜尋
- 隱私門簾
- 多語言支援
- 本機儲存

### v1.1.0 - Shortcuts Feature
- 快速連結功能
- 自動 Favicon 提取
- 智慧字母 Icon
- 拖拽排序
- 增強的 favicon 識別

## Future Enhancements

- [ ] 雲端同步選項
- [ ] 自訂主題顏色
- [ ] 分類圖標自訂
- [ ] 連結預覽
- [ ] 分類統計
- [ ] 匯出/匯入設定
- [ ] 快捷鍵自訂
