#!/usr/bin/env bash
# 打包 Chrome Web Store 上傳用 zip：manifest.json 位於 zip 根目錄，只含已 commit 的 src/ 檔案
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ -n "$(git status --porcelain -- src)" ]]; then
  echo "src/ 有未 commit 的變更，請先 commit 再打包" >&2
  exit 1
fi

version=$(node -p "require('./src/manifest.json').version")
mkdir -p dist
out="dist/neonflux-${version}.zip"
git archive --format=zip -o "$out" HEAD:src
echo "$out"
