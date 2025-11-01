# ✅ 手動匯入電費單功能 - 前端 UI 實作完成

## 🎉 完成總結

手動匯入電費單的前端 UI 已 **100% 完成**！所有列表頁、詳情頁和相關組件已實作並整合完畢。

---

## 📦 已完成的檔案清單

### 1. GraphQL Fragments 更新 (2 files)

- ✅ `core/graphql/fragment/userBillFields.ts` - 新增 4 個欄位
- ✅ `core/graphql/fragment/industryBillFields.ts` - 新增 4 個欄位

**新增的 GraphQL 欄位**:
```graphql
billSource                # 電費單來源
originalFileDownloadUrl   # 原始檔案下載 URL
importedBy                # 匯入者 ID
importedAt                # 匯入時間
```

---

### 2. 新增 UI 組件 (3 files)

#### ✅ `components/ElectricBill/BillStatusBadge.tsx`
**功能**: 電費單狀態標籤組件
- 顯示不同狀態的彩色 Chip
- 狀態包括: MANUAL(手動匯入)、DRAFT(草稿)、PENDING(待審核)、APPROVED(已審核)、REJECTED(已拒絕)
- 特殊處理: 已審核的手動匯入顯示為 "已審核 (手動)"

```typescript
<BillStatusBadge
  status="MANUAL"
  billSource="MANUAL_IMPORT"
/>
```

#### ✅ `components/ElectricBill/BillSourceTag.tsx`
**功能**: 電費單來源標籤組件
- 手動匯入: 橙色 outline chip with Upload icon
- 自動生成: 藍色 outline chip with AutoAwesome icon
- 自動處理舊資料(沒有 billSource 的視為自動生成)

```typescript
<BillSourceTag billSource="MANUAL_IMPORT" />
```

#### ✅ `components/ElectricBill/ManualImportInfoCard.tsx`
**功能**: 手動匯入資訊卡片
- 只在 `billSource === 'MANUAL_IMPORT'` 時顯示
- 顯示內容:
  - 匯入者 (Person icon)
  - 匯入時間 (AccessTime icon)
  - 原始檔案下載按鈕 (Download icon)
- 黃色背景卡片 (#fff9e6)
- Grid 佈局,響應式設計

```typescript
<ManualImportInfoCard
  billSource="MANUAL_IMPORT"
  originalFileDownloadUrl="https://..."
  importedBy="admin-123"
  importedAt="2025-01-15T10:30:00Z"
/>
```

---

### 3. 更新列表頁組件 (2 files)

#### ✅ `components/UserBill/UserBillPanel.tsx`
**更新內容**:
- Import 新的組件: `BillStatusBadge`, `BillSourceTag`
- 新增 3 個表格欄位:
  1. **狀態** - 使用 `BillStatusBadge` 取代純文字
  2. **來源** - 顯示 `BillSourceTag`
  3. **原始檔案** - 下載按鈕 (僅手動匯入時有)

**表格欄位順序**:
```
電費單名稱 | 狀態 | 來源 | 原始檔案 | 檢視/審核
```

#### ✅ `components/IndustryBill/IndustryBillPanel.tsx`
**更新內容**: (與 UserBillPanel 相同)
- Import 新的組件: `BillStatusBadge`, `BillSourceTag`
- 新增 3 個表格欄位
- 下載按鈕點擊時阻止事件冒泡 (`e.stopPropagation()`)

---

### 4. 更新詳情頁組件 (2 files)

#### ✅ `components/UserBill/UserBillDialog.tsx`
**更新內容**:
- Import `ManualImportInfoCard` 組件
- 在電費單標題和內容之間插入 `ManualImportInfoCard`
- 使用 `data?.userBill` 傳入完整資料

**位置**:
```tsx
<Typography>電費單組合： {userBill.userBillConfig?.name}</Typography>

{/* 手動匯入資訊卡片 - 新增 */}
<ManualImportInfoCard ... />

<PrintWrapper ... />
```

#### ✅ `components/IndustryBill/IndustryBillDialog.tsx`
**更新內容**: (與 UserBillDialog 相同)
- Import `ManualImportInfoCard` 組件
- 在電費單標題和內容之間插入資訊卡片

---

## 🎨 UI/UX 特性

### 狀態 Badge 顏色配置
| 狀態 | 顏色 | 標籤文字 |
|------|------|---------|
| MANUAL | Purple (secondary) | 手動匯入 |
| DRAFT | Grey (default) | 草稿 |
| PENDING | Orange (warning) | 待審核 |
| APPROVED | Green (success) | 已審核 |
| APPROVED + MANUAL_IMPORT | Green (outlined) | 已審核 (手動) |
| REJECTED | Red (error) | 已拒絕 |

### 來源 Tag 圖標
| 來源 | 顏色 | 圖標 | 標籤文字 |
|------|------|------|---------|
| MANUAL_IMPORT | Orange (warning) | Upload | 手動匯入 |
| AUTO_GENERATED | Blue (info) | AutoAwesome | 自動生成 |
| null (舊資料) | Blue (info) | AutoAwesome | 自動生成 |

### 響應式設計
- 資訊卡片使用 Grid 佈局
- 桌面: 3 欄 (匯入者、匯入時間、原始檔案)
- 平板/手機: 自動換行

---

## 🔧 技術實作細節

### 1. GraphQL 資料流

```
userBills/industryBills Query
    ↓
使用 userBillFields/industryBillFields Fragment
    ↓
自動包含: billSource, originalFileDownloadUrl, importedBy, importedAt
    ↓
組件接收並顯示
```

### 2. 下載按鈕實作

```typescript
<Button
  onClick={(e) => {
    e.stopPropagation();  // 防止觸發行點擊事件
    window.open(url, '_blank');  // 新視窗開啟 (pre-signed URL)
  }}
>
  下載
</Button>
```

### 3. 條件渲染

```typescript
// 只在手動匯入時顯示下載按鈕
{rowData.originalFileDownloadUrl ? (
  <Button>下載</Button>
) : (
  <Typography>-</Typography>
)}

// 只在手動匯入時顯示資訊卡片
{billSource === 'MANUAL_IMPORT' && (
  <ManualImportInfoCard ... />
)}
```

---

## 📸 UI 預覽

### 列表頁面
```
┌─────────────────────────────────────────────────────────────────────┐
│ 用戶電費單 - 2025-01                                                  │
├─────────────────────────────────────────────────────────────────────┤
│ 電費單名稱       │ 狀態       │ 來源       │ 原始檔案     │ 檢視/審核 │
├─────────────────────────────────────────────────────────────────────┤
│ 2025-01-公司A   │ [手動匯入]  │ [手動匯入]  │ [下載]      │   [📋]   │
│ 2025-01-公司B   │ [已審核]    │ [自動生成]  │     -       │   [📋]   │
│ 2025-01-公司C   │ [已審核(手)] │ [手動匯入]  │ [下載]      │   [📋]   │
└─────────────────────────────────────────────────────────────────────┘
```

### 詳情頁面 (手動匯入)
```
┌─────────────────────────────────────────────────────────────────┐
│ 用戶電費單                                                        │
│ 電費單組合: 測試公司                                               │
├─────────────────────────────────────────────────────────────────┤
│ 📤 手動匯入資訊                          [黃色背景卡片]           │
│                                                                 │
│ 👤 匯入者          ⏰ 匯入時間              📄 原始檔案            │
│ admin-001        2025-01-15 10:30      [下載 Excel]            │
└─────────────────────────────────────────────────────────────────┘
│ [電費單詳細內容...]                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 部署與測試

### 1. GraphQL Codegen (必須執行)

更新 fragments 後需要重新生成 TypeScript types:

```bash
cd /Users/jaychou/anneal-energy/enei-app
pnpm run codegen
```

這會更新 `core/graphql/types.ts`,新增:
```typescript
export interface UserBill {
  // ... 既有欄位
  billSource?: string | null;
  originalFileDownloadUrl?: string | null;
  importedBy?: string | null;
  importedAt?: string | null;
}
```

### 2. 開發環境測試

```bash
pnpm run dev
```

訪問頁面:
- 用戶電費單列表: `http://localhost:3000/electric-bill/user-bill?month=2025-01`
- 發電業電費單列表: `http://localhost:3000/electric-bill/industry-bill?month=2025-01`

### 3. 測試檢查清單

#### 列表頁測試
- [ ] 狀態 Badge 顯示正確顏色和文字
- [ ] 來源 Tag 顯示正確 (手動匯入/自動生成)
- [ ] 手動匯入的電費單顯示「下載」按鈕
- [ ] 自動生成的電費單顯示「-」
- [ ] 點擊下載按鈕可開啟新視窗下載檔案
- [ ] 點擊下載按鈕不會觸發行點擊事件

#### 詳情頁測試
- [ ] 手動匯入的電費單顯示黃色資訊卡片
- [ ] 自動生成的電費單不顯示資訊卡片
- [ ] 資訊卡片顯示正確的匯入者、時間、下載按鈕
- [ ] 時間格式正確 (yyyy-MM-dd HH:mm:ss)
- [ ] 下載按鈕可正常下載檔案

#### 響應式測試
- [ ] 手機版 (< 768px): 資訊卡片垂直排列
- [ ] 平板版 (768px - 1024px): 部分欄位換行
- [ ] 桌面版 (> 1024px): 所有欄位水平排列

---

## 📊 檔案統計

| 類別 | 數量 | 說明 |
|------|------|------|
| 新建檔案 | 3 | BillStatusBadge, BillSourceTag, ManualImportInfoCard |
| 更新檔案 | 6 | 2 Fragments + 2 Panels + 2 Dialogs |
| 程式碼行數 | ~400 lines | 新增 UI 組件 + 更新 |
| 涵蓋率 | 100% | 用戶電費單 + 發電業電費單 |

---

## 🔄 資料流示意圖

```
Backend (API)
    ↓
GraphQL Schema 定義新欄位
    ↓
Fragment 更新 (userBillFields/industryBillFields)
    ↓
Queries 自動包含新欄位
    ↓
Components 接收完整資料
    ↓
┌──────────────────────────────────────┐
│  UserBillPanel / IndustryBillPanel   │
│  - BillStatusBadge                   │
│  - BillSourceTag                     │
│  - Download Button                   │
└──────────────────────────────────────┘
    ↓ (點擊檢視)
┌──────────────────────────────────────┐
│  UserBillDialog / IndustryBillDialog │
│  - ManualImportInfoCard              │
│  - 完整電費單詳情                      │
└──────────────────────────────────────┘
```

---

## 🎯 後續建議

### 1. 使用者體驗優化
- [ ] 新增「批次下載」功能 (選擇多個手動匯入的電費單)
- [ ] 下載時顯示 Loading 狀態
- [ ] 新增檔案預覽功能 (點擊預覽按鈕在 Modal 中顯示)
- [ ] 匯入者顯示真實姓名 (目前只有 ID)

### 2. 篩選與搜尋
- [ ] 新增「來源」篩選器 (手動匯入 / 自動生成)
- [ ] 新增「匯入日期範圍」篩選
- [ ] 支援按匯入者篩選

### 3. 統計與報表
- [ ] Dashboard 顯示手動匯入統計
- [ ] 每月手動匯入次數圖表
- [ ] 匯入者排行榜

### 4. 權限控管
- [ ] 只有特定角色可以看到「原始檔案」欄位
- [ ] 下載檔案需要權限檢查

### 5. 效能優化
- [ ] 虛擬滾動 (大量電費單時)
- [ ] 圖片/檔案 lazy loading
- [ ] 下載 URL cache (避免重複請求 pre-signed URL)

---

## 📞 支援與問題排查

### 常見問題

**Q1: 為什麼 GraphQL 查詢沒有返回新欄位?**

A: 確認已執行 `pnpm run codegen` 並重啟開發伺服器。

**Q2: BillStatusBadge 顯示錯誤?**

A: 檢查 `billSource` 型別是否正確傳入,應該是 `'AUTO_GENERATED' | 'MANUAL_IMPORT' | null`

**Q3: 下載按鈕無反應?**

A: 檢查:
1. `originalFileDownloadUrl` 是否有值
2. URL 是否有效 (pre-signed URL 1小時過期)
3. 瀏覽器是否阻擋彈出視窗

**Q4: 資訊卡片不顯示?**

A: 確認 `billSource === 'MANUAL_IMPORT'`,自動生成的電費單不會顯示

---

## 🎊 完成日期

**2025-01-XX** - 手動匯入電費單前端 UI 完整實作完成！

所有組件已實作並整合到列表頁和詳情頁,可以開始進行測試和部署。

---

## 📝 檔案清單總覽

### 新增檔案
```
enei-app/
└── components/
    └── ElectricBill/
        ├── BillStatusBadge.tsx          [新增]
        ├── BillSourceTag.tsx            [新增]
        └── ManualImportInfoCard.tsx     [新增]
```

### 更新檔案
```
enei-app/
├── core/
│   └── graphql/
│       └── fragment/
│           ├── userBillFields.ts        [更新]
│           └── industryBillFields.ts    [更新]
└── components/
    ├── UserBill/
    │   ├── UserBillPanel.tsx            [更新]
    │   └── UserBillDialog.tsx           [更新]
    └── IndustryBill/
        ├── IndustryBillPanel.tsx        [更新]
        └── IndustryBillDialog.tsx       [更新]
```

---

## 🌟 總結

這次實作完成了:

✅ **3 個新的 UI 組件** - 高度可複用,遵循 Material-UI 設計規範
✅ **6 個檔案更新** - 無縫整合到現有程式碼
✅ **完整的手動匯入 UI 流程** - 從列表到詳情頁
✅ **響應式設計** - 支援桌面、平板、手機
✅ **TypeScript 類型安全** - 完整的型別定義
✅ **使用者友善** - 直觀的視覺設計和互動

可以開始測試了! 🚀
