# NeonFlux - 新增功能說明

## 🌐 多語言支援

NeonFlux 現在支援中文和英文介面切換。

### 語言切換
- 在 header 右側點擊「中文」或「English」按鈕即可切換語言
- 語言偏好會自動保存到本機儲存
- 所有 UI 文本都會即時更新

### 支援的語言
- **中文 (繁體)** - 預設語言
- **English** - 英文介面

---

## 🎨 輕量級 Icon 系統

所有 emoji icons 已替換為輕量級 SVG icons（基於 Feather Icons）。

### 使用的 Icons
- **刷新** - 同步瀏覽記錄
- **解鎖/鎖定** - 隱私門簾控制
- **設定** - 打開設定對話框
- **鍵盤** - 快捷鍵提示
- **X** - 關閉對話框
- **上/下箭頭** - 分類排序
- **垃圾桶** - 刪除分類
- **加號** - 新增規則

### Icon 優勢
- ✅ 輕量級 SVG 格式
- ✅ 可自訂顏色和大小
- ✅ 高清晰度顯示
- ✅ 快速載入

---

## ⌨️ 快捷鍵功能

### 新增快捷鍵
- **Command+Shift+Y** (Mac) / **Ctrl+Shift+Y** (Windows/Linux) - 獨立開啟 NeonFlux 新分頁
- **/** - 聚焦搜尋框
- **Esc** - 關閉聚焦檢視

### 快捷鍵提示
- 點擊 header 右側的「⌨️」按鈕查看所有快捷鍵
- 首次使用時會自動顯示快捷鍵提示

---

## 🔧 設定新增項目

### 新增設定選項
- **設為預設新分頁** - 勾選後，NeonFlux 會成為瀏覽器的預設新分頁

---

## 📁 新增文件

### i18n.js
- 多語言翻譯配置
- 提供 `t(key)` 函數獲取翻譯文本
- 提供 `getCurrentLanguage()` 和 `setLanguage(lang)` 函數

### icons.js
- SVG icons 定義
- 提供 `getSvgIcon(name)` 函數獲取 SVG
- 提供 `createIconButton()` 和 `createIcon()` 輔助函數

### background.js
- Extension icon 點擊事件處理
- 快捷鍵命令事件處理

---

## 🚀 使用方式

### 切換語言
1. 打開 NeonFlux 新分頁
2. 在 header 右側點擊「中文」或「English」
3. UI 會立即更新為選定的語言

### 查看快捷鍵
1. 點擊 header 右側的「⌨️」按鈕
2. 會彈出快捷鍵提示對話框

### 獨立開啟 NeonFlux
- 按下 **Command+Shift+Y** (Mac) 或 **Ctrl+Shift+Y** (Windows/Linux)
- 或點擊 Extension bar 中的 NeonFlux 圖示

---

## 📝 翻譯內容

所有 UI 文本都已翻譯成中文和英文，包括：
- 按鈕標籤
- 設定項目
- 對話框標題
- 提示訊息
- 快捷鍵說明

---

## 🔄 更新日誌

### v1.0.0 - 多語言和 Icon 系統
- ✅ 新增中英文介面切換
- ✅ 替換所有 emoji 為 SVG icons
- ✅ 新增快捷鍵提示功能
- ✅ 新增「設為預設新分頁」設定
- ✅ 新增 Extension icon 點擊事件
- ✅ 新增 Command+Shift+Y 快捷鍵
