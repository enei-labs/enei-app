# Cursor 開發指南

## 專案概述

ENEI App - 基於 Next.js 15.3.4 的能源管理系統，採用 TypeScript + Apollo Client + Material-UI 技術棧，使用 pnpm 包管理器。

## 編輯器配置

### 1. Cursor 擴展建議

#### 必裝擴展
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "apollographql.vscode-apollo",
    "ms-vscode.vscode-json",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-jest"
  ]
}
```

#### GraphQL 支援
- **Apollo GraphQL**: 提供 schema 驗證和自動完成
- **GraphQL**: 語法高亮和 IntelliSense

#### 測試支援
- **Jest**: 測試運行和調試
- **Jest Snippets**: 快速測試模板

### 2. Cursor 設置

#### workspace settings (.vscode/settings.json)
```json
{
  "typescript.preferences.preferTypeOnlyAutoImports": true,
  "typescript.suggest.autoImports": true,
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "apollo.telemetryEnabled": false,
  "apollo/gql": {
    "tagName": "gql",
    "schemas": ["./core/graphql/schema.graphql"]
  },
  "emmet.includeLanguages": {
    "typescript": "typescriptreact",
    "javascript": "javascriptreact"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "path-intellisense.mappings": {
    "@components": "${workspaceRoot}/components",
    "@core": "${workspaceRoot}/core",
    "@utils": "${workspaceRoot}/utils",
    "@config": "${workspaceRoot}/config",
    "@styles": "${workspaceRoot}/styles",
    "@public": "${workspaceRoot}/public"
  }
}
```

## Cursor AI 使用指南

### 1. 程式碼生成模式

#### 組件生成
```typescript
// @cursor: 生成一個 UserBill 功能的對話框組件
// 需要包含: 表單驗證、GraphQL mutation、Material-UI、TypeScript 接口

interface UserBillDialogProps {
  isOpenDialog: boolean
  onClose: () => void
  userBill?: UserBill
  variant: 'create' | 'edit'
}

export const UserBillDialog: React.FC<UserBillDialogProps> = ({
  isOpenDialog,
  onClose,
  userBill,
  variant
}) => {
  // Cursor 會根據專案模式生成完整組件
}
```

#### 測試生成
```typescript
// @cursor: 為 UserBillDialog 生成測試，包含條件顯示邏輯測試
describe('UserBillDialog', () => {
  describe('條件顯示邏輯測試', () => {
    // Cursor 會生成完整的測試套件
  })
})
```

### 2. 重構建議

#### 使用 Cursor 進行自動重構
```typescript
// @cursor: 將這個組件重構為使用 React Hook Form
// 原本使用 useState 的表單，改為 useForm + Controller 模式

// 選取組件程式碼，使用 Cmd+K 重構
```

#### 類型安全改進
```typescript
// @cursor: 為這個組件添加完整的 TypeScript 類型定義
// 包含 Props 接口、GraphQL 類型、表單資料類型

// Cursor 會自動推導並添加類型
```

### 3. 程式碼審查模式

#### 使用 Cursor Chat 進行程式碼審查
```
@cursor: 請審查這個組件的程式碼品質，檢查：
1. TypeScript 類型安全性
2. React 最佳實踐
3. 性能優化機會
4. 錯誤處理
5. 測試覆蓋率

建議具體的改進方案。
```

## 智能程式碼建議

### 1. 組件模式識別

Cursor 會自動識別專案中的模式：

#### Dialog 組件模式
```typescript
// Cursor 學習到的模式:
// 1. 使用 DialogErrorBoundary 包裝
// 2. GraphQL hooks 用於資料獲取
// 3. React Hook Form 用於表單處理
// 4. Material-UI 組件庫
// 5. 中文業務術語

// 當你開始輸入時，Cursor 會建議完整的模式
const UserBillDialog = () => {
  // Cursor 自動建議: DialogErrorBoundary, useForm, GraphQL hooks
}
```

#### Panel 組件模式
```typescript
// Cursor 識別的 Panel 模式:
// 1. Table + Pagination
// 2. Search + Filter
// 3. Action buttons
// 4. Loading states

const UserBillPanel = () => {
  // Cursor 建議完整的 Panel 架構
}
```

### 2. GraphQL 模式

#### 查詢建議
```typescript
// 輸入 "const { data" 時，Cursor 會建議:
const { data, loading, error } = useUserBill(userBillId)

// 輸入 "gql`" 時，Cursor 會根據 schema 建議查詢結構
export const USER_BILL = gql`
  query userBill($id: UUID!) {
    userBill(id: $id) {
      // Cursor 自動建議 fragment
      ...userBillFields
    }
  }
`
```

#### Mutation 模式
```typescript
// Cursor 學習到的 mutation 模式:
const [auditUserBill, { loading }] = useAuditUserBill({
  onCompleted: () => {
    toast.success('審核成功')
    onClose()
  },
  onError: (error) => {
    toast.error('審核失敗')
    console.error(error)
  }
})
```

### 3. 測試模式建議

```typescript
// Cursor 識別的測試模式:
describe('UserBillDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('條件顯示邏輯測試', () => {
    it('應該根據審核狀態顯示對應的操作按鈕', async () => {
      const mocks = [
        createMockResponse(USER_BILL, variables, response)
      ]
      
      render(<UserBillDialog {...props} />, { mocks })
      
      await waitFor(() => {
        expect(screen.getByText('審核通過')).toBeInTheDocument()
      })
    })
  })
})
```

## 專案特定提示

### 1. 路徑別名智能提示

配置 Cursor 理解專案的路徑別名：

```typescript
// 輸入 "@comp" 時自動補全為 "@components/"
import { UserBillDialog } from '@components/UserBill'

// 輸入 "@core/g" 時自動補全 GraphQL 路徑
import { USER_BILL } from '@core/graphql/queries'
```

### 2. pnpm 命令整合

#### 配置 Tasks (tasks.json)
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "dev",
      "type": "shell",
      "command": "pnpm",
      "args": ["dev"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "test",
      "type": "shell",
      "command": "pnpm",
      "args": ["test"],
      "group": "test"
    },
    {
      "label": "build",
      "type": "shell",
      "command": "pnpm",
      "args": ["build"],
      "group": "build"
    },
    {
      "label": "codegen",
      "type": "shell",
      "command": "pnpm",
      "args": ["codegen"],
      "group": "build"
    }
  ]
}
```

### 3. 調試配置

#### Launch Configuration (launch.json)
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Next.js: debug client-side",
      "type": "pwa-chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Jest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## Cursor 快捷鍵和工作流程

### 1. 常用快捷鍵

| 功能 | 快捷鍵 | 說明 |
|------|--------|------|
| Cursor Chat | `Cmd + L` | 開啟 AI 對話 |
| 程式碼生成 | `Cmd + K` | 基於提示生成程式碼 |
| 智能重構 | `Cmd + Shift + L` | AI 輔助重構 |
| 檔案搜尋 | `Cmd + P` | 快速開啟檔案 |
| 全專案搜尋 | `Cmd + Shift + F` | 搜尋程式碼 |
| Git 集成 | `Ctrl + Shift + G` | Git 面板 |

### 2. AI 輔助工作流程

#### 新功能開發
1. **Chat**: `@cursor 我需要開發一個新的 TransferDocument 功能，包含 CRUD 操作`
2. **生成**: 使用 `Cmd + K` 生成組件結構
3. **完善**: 透過 Chat 完善實作細節
4. **測試**: 生成對應的測試檔案
5. **重構**: 使用 AI 優化程式碼品質

#### 問題解決
1. **錯誤分析**: 選取錯誤訊息，使用 `Cmd + K` 請求解決方案
2. **調試**: 使用 Chat 分析問題根因
3. **修復**: AI 輔助生成修復程式碼
4. **驗證**: 運行測試確認修復效果

## 最佳實踐

### 1. AI 提示技巧

#### 具體且詳細的提示
```
❌ 不好的提示: "幫我寫一個組件"

✅ 好的提示: "根據專案現有的 UserBillDialog 模式，為 TransferDocument 功能生成一個對話框組件，需要包含:
1. TypeScript 接口定義
2. GraphQL hooks 整合
3. React Hook Form 表單處理
4. Material-UI 組件
5. 錯誤處理和 toast 通知
6. 中文 UI 文字"
```

#### 上下文感知提示
```
✅ 好的提示: "這個組件需要遵循專案中 components/UserBill/UserBillDialog.tsx 的相同模式，
包括相同的 prop 結構、錯誤處理方式和 GraphQL 整合模式。"
```

### 2. 程式碼審查建議

使用 Cursor 進行程式碼審查時的檢查清單：

```
@cursor: 請審查以下方面:
□ TypeScript 類型安全性
□ React Hooks 使用規範
□ GraphQL 查詢優化
□ 錯誤處理完整性
□ 性能優化機會
□ 測試覆蓋率
□ 可維護性
□ 符合專案編碼規範
```

### 3. 專案維護

#### 定期優化
```
@cursor: 分析整個專案的技術債務，提供優化建議:
1. 重複程式碼識別
2. 性能瓶頸分析
3. 類型安全改進
4. 測試覆蓋率提升
5. 依賴更新建議
```

## 故障排除

### 1. Cursor AI 無法理解專案結構

**解決方案**:
1. 確保 `.cursorrules` 檔案包含專案結構說明
2. 在對話中提供更多上下文
3. 使用 `@` 符號引用具體檔案

### 2. 路徑別名無法解析

**解決方案**:
1. 檢查 `tsconfig.json` 路徑配置
2. 重啟 TypeScript 服務: `Cmd + Shift + P` → "Restart TypeScript Server"
3. 確保 workspace settings 中的路徑映射正確

### 3. GraphQL 智能提示失效

**解決方案**:
1. 確保安裝 Apollo GraphQL 擴展
2. 檢查 schema 檔案路徑
3. 運行 `pnpm codegen` 更新類型定義

### 4. 測試無法運行

**解決方案**:
1. 檢查 Jest 配置
2. 確保路徑別名在 jest.config.js 中正確映射
3. 使用 `pnpm test` 而非 `npm test`

## 結論

Cursor 結合這個 Next.js + TypeScript + GraphQL 專案能提供強大的開發體驗。關鍵是：

1. **正確配置編輯器和擴展**
2. **使用具體和上下文感知的 AI 提示**
3. **遵循專案既有的程式碼模式**
4. **善用 pnpm 和專案工具鏈**
5. **定期使用 AI 進行程式碼審查和優化**

透過這些配置和實踐，可以大幅提升開發效率和程式碼品質。