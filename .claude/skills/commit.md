---
name: commit
description: 當使用者說「commit」、「幫我寫 commit message」、「commit 訊息」、「寫個 commit」、「產生 commit」時自動使用。根據 git diff 產生符合 Conventional Commits 格式的繁體中文 commit message。
---

# Commit Message 產生器

## 步驟

1. 執行 `git diff --staged` 取得已暫存的變更
2. 若輸出為空，改執行 `git diff` 取得未暫存的變更
3. 分析變更內容，依照下方格式產生 commit message

## 格式

```
類型(範圍)：簡述
```

- **整句不超過 50 字**（繁體中文）
- **類型**（擇一）：
  - `feat`：新增功能
  - `fix`：修復錯誤
  - `refactor`：重構（不影響功能）
  - `docs`：文件變更
  - `test`：新增或修改測試
- **範圍**：受影響的模組或檔案名稱（小寫，例如 `bmi`、`auth`、`api`）
- **簡述**：用動詞開頭，說明「做了什麼」

## 範例

```
feat(bmi)：新增歷史紀錄功能
fix(auth)：修正登入時 token 未清除的問題
refactor(bmi)：將純函式抽出至 bmi-logic.js
test(bmi)：新增邊界值 E2E 測試案例
docs(readme)：補充安裝與執行說明
```

## 輸出規則

- 只輸出 commit message 本身，不加引號、不加說明
- 若變更橫跨多個模組，範圍可省略，例如：`refactor：統一錯誤處理邏輯`
- 若無任何 diff 可讀取，告知使用者目前沒有變更可以 commit
