# 主題配色（Themes）— 設計文件

**日期:** 2026-10-13
**狀態:** 已核准設計，待 spec review（使用者審閱中）

## 目標

讓使用者從 5 組**深色**主題中挑選配色。每組主題改變背景色調、3 顆漂浮光球與強調色；卡片玻璃質感與分類色點不變。

## 設計決定（已確認）

- **5 組，全部深色**；不做淺色 / 跟隨系統。
- **做法**：CSS 自訂屬性 token + `<html data-theme="…">`，每組主題只覆寫 token。
- **切換位置**：設定 › 一般「主題」列，5 個色塊按鈕；點擊即預覽，「儲存」寫入、「取消」還原。
- **預設**：`neon`（現行配色，視覺不變）。

## 色盤

| key | 名稱 | `--bg` | 背景光暈 g1 / g2 / g3 | 光球 b1 / b2 / b3 | `--accent` | `--text` | `--muted` | 光球透明度 |
|---|---|---|---|---|---|---|---|---|
| `neon` | Neon Flux 霓虹流 | `#0b0f14` | `#142032` / `#1a2440` / `#0e1626` | `124,195,255` / `173,124,255` / `255,180,124` | `#7cc3ff` | `#e9eef6` | `#b6c2d0` | 0.8 |
| `aurora` | Aurora 極光 | `#06110f` | `#0b2a24` / `#0d1f33` / `#071a17` | `94,242,176` / `79,209,255` / `155,123,255` | `#5ef2b0` | `#e6f6f0` | `#a8c4bb` | 0.8 |
| `sakura` | Sakura Night 夜櫻 | `#120a12` | `#2a1226` / `#1e1530` / `#1a0e18` | `255,126,182` / `195,155,255` / `255,180,162` | `#ff8cc6` | `#f6eaf1` | `#cdb3c2` | 0.8 |
| `graphite` | Graphite 石墨 | `#0c0c0e` | `#18181c` / `#141418` / `#101012` | `170,170,180` / `120,120,130` / `200,200,205` | `#d4d4d8` | `#ededef` | `#a1a1aa` | 0.35 |
| `matcha` | Matcha 抹茶 | `#0b0f0a` | `#18241a` / `#22231a` / `#121a12` | `150,200,110` / `220,205,150` / `110,170,140` | `#a8d48a` | `#eef2e8` | `#b4bda8` | 0.6 |

對比（WCAG，對 `--bg`）：`--text` 16.5–17.2:1、`--muted` 7.6–10.6:1、`--accent` 9.1–13.5:1，皆高於 AA（4.5:1）。

## Token 化範圍（`src/newtab.html`）

新增 token（於 `:root` 定義 neon 值，`[data-theme="x"]` 覆寫）：
- `--bg`、`--bg-glow-1/2/3`（`html, body` 三層 radial 背景）
- `--blob-1/2/3`（RGB 三元組，`.blob` / `.b2` / `.b3`）、`--blob-opacity`（`.bg-blobs`）
- `--accent`、`--accent-rgb`；`--text`、`--muted`、`--stroke`、`--glass`、`--settings-*` 依主題微調
- 寫死的 `124,195,255`（24 處）→ `var(--accent-rgb)`；設定面板的暖色光暈 `255,196,124`（4 處）→ `var(--blob-3)`

不動：白色半透明疊層 `rgba(255,255,255,x)`、陰影黑色、分類色點 `--aws` 等、紅色刪除按鈕。

## 儲存與載入

- `settings.ui.theme`（`neon | aurora | sakura | graphite | matcha`），export / import 自動帶上。
- **防閃爍**：`chrome.storage` 為非同步，另存 `localStorage['neonflux-theme']`。`src/theme.js` 於 `<head>` **同步**載入（無 `defer`；MV3 禁止 inline script），載入當下即從 localStorage 設定 `data-theme`，早於第一次繪製。
- 寫入時機：設定「儲存」、匯入設定、`loadSettings` 完成時（以 storage 為準同步回 localStorage）。

## 模組

- `src/theme.js`（新，`<head>` 同步載入）：`THEMES`（key → 色塊用的 bg / accent）、`resolveTheme(name)`（未知值 → `'neon'`）、`applyTheme(name)`（設 `data-theme` + 寫 localStorage）；檔案載入時立即 `applyTheme(localStorage)`。
- `src/main.js`：設定對話框主題列（預覽 / 儲存 / 取消還原）、匯入後套用。
- `src/i18n.js`：「主題」與 5 組名稱（中英）。

## 測試

- `test/theme.test.js`：`resolveTheme` 對已知 / 未知 / 空值。
- 瀏覽器（stub chrome API）：5 組各截圖；預覽後取消會還原；儲存後重新載入無閃爍（`data-theme` 在 `DOMContentLoaded` 前已設定）。
