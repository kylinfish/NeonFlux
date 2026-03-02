# intro Firebase 操作

只記錄 `intro/` 的本機開發與部署指令。

正式網址：
- https://neonflux-web.web.app/

## 1) 進入目錄

```bash
cd intro
```

## 2) 本機開發（Firebase Hosting Emulator）

```bash
firebase emulators:start --only hosting
```

啟動後通常可用：
- http://127.0.0.1:5000

## 3) 確認目前 Firebase 專案

```bash
firebase use
cat ../.firebaserc
```

切換專案（如果需要）：

```bash
firebase use <project-id>
```

## 4) Deploy 到正式環境

```bash
firebase deploy --only hosting
```

## 5) Deploy 到 Preview Channel（可選）

```bash
firebase hosting:channel:deploy <channel-name>
```

例如：

```bash
firebase hosting:channel:deploy staging
```
