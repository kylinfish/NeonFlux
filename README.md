# NeonFlux

> 自定義歷史紀錄分類的 Chrome Extension  
> 將瀏覽行為整理成工作流，讓新分頁更聚焦、更可用。

[![Version](https://img.shields.io/badge/version-1.1.0-4ea1ff)](./src/manifest.json)
[![Platform](https://img.shields.io/badge/platform-Chrome-7ce0b4)](https://chromewebstore.google.com/detail/neonflux/npmcfbnpmpiphenjnmlcgacbmdgcpacb)
[![License](https://img.shields.io/badge/license-Private-ffc86b)](#)

## Links

- Intro Website: https://neonflux-web.web.app/
- Chrome Extension: https://chromewebstore.google.com/detail/neonflux/npmcfbnpmpiphenjnmlcgacbmdgcpacb
- Release Logs: https://neonflux-web.web.app/release.html

## Highlights

- 自動分類瀏覽記錄（可自訂 matcher 規則）
- URL 分組切換（可忽略 query params）
- 設定面板與分類編輯器（進階管理）
- 停用分類保護（淡化 + 防誤觸）
- 隱私門簾與聚焦檢視
- 中英文介面切換

## Repo Structure

```text
NeonFlux/
├── src/      # Extension 主程式（newtab、main、manifest）
├── intro/    # 官網與說明頁（intro / privacy / release logs）
└── FEATURES.md
```

## Local Development

1. 開啟 `chrome://extensions/`
2. 啟用 Developer mode
3. Load unpacked 指向本 repo 的 `src/`
4. 直接開啟 `intro/public/index.html` 預覽介紹網站

## Release Notes Workflow

1. 更新 `src/manifest.json` 版本號（SemVer）
2. 更新 `intro/public/release.html` 的版本節點（最新放最上面）
3. Commit + Tag（例：`v1.1.0`）
4. Push：`git push origin main --tags`

---

Made with focus on privacy-first local workflow.
