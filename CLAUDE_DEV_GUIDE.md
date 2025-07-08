# Claude 開發指南

## 專案概述

這是一個基於 Next.js 15.3.4 的能源管理系統，使用 TypeScript、Apollo Client 和 Material-UI 構建。專案採用 pnpm 作為包管理器，具有完整的 GraphQL 架構和測試覆蓋。

## 技術棧

- **框架**: Next.js 15.3.4 + React 18.3.1
- **語言**: TypeScript 5.3.3 (strict mode)
- **包管理器**: pnpm
- **狀態管理**: Apollo Client 3.9.4
- **UI 庫**: Material-UI 5.15.9
- **表單處理**: React Hook Form 7.50.1 + Yup 1.3.3
- **測試**: Jest 29.7.0 + React Testing Library 16.3.0
- **GraphQL**: Code Generation + Fragment-based queries

## 專案結構

```
enei-app/
├── components/           # 可重用組件
│   ├── [Feature]/       # 功能模組
│   │   ├── [Feature].tsx
│   │   ├── [Feature]Dialog.tsx
│   │   ├── [Feature]Panel.tsx
│   │   └── __tests__/
├── core/                # 核心邏輯
│   ├── graphql/         # GraphQL schema, queries, mutations
│   └── context/         # React Context
├── utils/               # 工具函數
│   └── hooks/           # 自定義 hooks
├── pages/               # Next.js 頁面
├── config/              # 配置文件
└── styles/              # 全局樣式
```

## 開發規範

### 1. 組件命名與組織

#### 命名慣例
- **組件**: PascalCase (UserBill, IndustryBill, TPCBill)
- **文件**: 與組件名相同 (UserBill.tsx)
- **Dialog 組件**: [Feature]Dialog.tsx
- **Panel 組件**: [Feature]Panel.tsx
- **Button 組件**: [Action][Feature]Btn.tsx

#### 文件組織
```typescript
// ✅ 正確的組件結構
components/UserBill/
├── UserBill.tsx                    // 主組件
├── UserBillDialog.tsx              // 對話框組件
├── UserBillPanel.tsx               // 面板組件
├── UserBillConfigDialog/           // 子功能
│   ├── UserBillConfigDialog.tsx
│   └── FormData.ts
└── __tests__/                      // 測試文件
    └── UserBillDialog.test.tsx
```

### 2. TypeScript 使用規範

#### 類型定義
```typescript
// ✅ 組件 Props 接口
interface UserBillDialogProps {
  isOpenDialog: boolean
  onClose: () => void
  userBill: UserBill
}

// ✅ GraphQL 生成的類型
import { UserBill, ElectricBillStatus } from '@core/graphql/types'

// ✅ 自定義業務類型
interface FormData {
  billNumber: string
  billingDate: Date
  status: ElectricBillStatus
}
```

#### 路徑別名
使用 tsconfig.json 中定義的路徑別名：
```typescript
import { UserBillDialog } from '@components/UserBill'
import { USER_BILL } from '@core/graphql/queries'
import { useUserBill } from '@utils/hooks/queries'
import { theme } from '@config/theme'
```

### 3. GraphQL 模式

#### 查詢結構
```typescript
// ✅ Fragment-based queries
export const USER_BILL = gql`
  ${USER_BILL_FIELDS}
  query userBill($id: UUID!) {
    userBill(id: $id) {
      ...userBillFields
    }
  }
`

// ✅ 自定義 Hook
export const useUserBill = (id: string) => {
  return useQuery<{ userBill: UserBill, fee: Fee }>(USER_BILL, {
    variables: { id },
    skip: !id,
  })
}
```

#### Mutation 模式
```typescript
// ✅ Mutation with cache update
export const useAuditUserBill = () => {
  return useMutation<
    { auditUserBill: UserBill }, 
    { id: string, status: ElectricBillStatus }
  >(AUDIT_USER_BILL, {
    update(cache, { data }) {
      // 更新緩存邏輯
    }
  })
}
```

### 4. 表單處理規範

#### React Hook Form + Yup
```typescript
// ✅ 表單驗證 Schema
const schema = yup.object({
  billNumber: yup.string().required('帳單編號為必填'),
  billingDate: yup.date().required('計費日期為必填'),
  status: yup.string().oneOf(Object.values(ElectricBillStatus))
})

// ✅ 表單組件
const FormComponent = () => {
  const { control, handleSubmit, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      billNumber: '',
      billingDate: new Date(),
      status: ElectricBillStatus.Pending
    }
  })

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="billNumber"
        control={control}
        render={({ field, fieldState }) => (
          <InputText
            {...field}
            label="帳單編號"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
    </FormWrapper>
  )
}
```

### 5. 測試規範

#### 測試結構
```typescript
describe('UserBillDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('條件顯示邏輯測試', () => {
    it('應該根據審核狀態顯示對應的操作按鈕', async () => {
      const mocks = [
        createMockResponse(USER_BILL, { id: '1' }, mockUserBillResponse)
      ]

      render(<UserBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('用戶電費單')).toBeInTheDocument()
      })
    })
  })
})
```

#### 測試工具
```typescript
// ✅ 使用專案的測試工具
import { render, createMockResponse } from '@utils/test-utils'

// ✅ Mock GraphQL 響應
const mocks = [
  createMockResponse(
    USER_BILL,
    { id: '1' },
    { userBill: mockUserBill, fee: mockFee }
  )
]
```

### 6. 錯誤處理

#### Error Boundaries
```typescript
// ✅ 頁面級錯誤邊界
<PageErrorBoundary>
  <UserBillPanel />
</PageErrorBoundary>

// ✅ 對話框級錯誤邊界
<DialogErrorBoundary>
  <UserBillDialog />
</DialogErrorBoundary>
```

#### GraphQL 錯誤處理
```typescript
// ✅ 在自定義 hook 中處理錯誤
export const useCreateUserBill = () => {
  return useMutation(CREATE_USER_BILL, {
    onError: (error) => {
      console.error('Failed to create user bill:', error)
      toast.error('建立用戶電費單失敗')
    },
    onCompleted: () => {
      toast.success('建立用戶電費單成功')
    }
  })
}
```

## 開發工作流程

### 1. 開發環境設置
```bash
# 安裝依賴
pnpm install

# 啟動開發服務器
pnpm dev

# 生成 GraphQL 類型
pnpm codegen
```

### 2. 測試命令
```bash
# 運行所有測試
pnpm test

# 監視模式
pnpm test:watch

# 測試覆蓋率
pnpm test:coverage
```

### 3. 構建部署
```bash
# 類型檢查
pnpm run lint

# 構建生產版本
pnpm run build

# 啟動生產服務器
pnpm start
```

## 性能優化建議

### 1. 組件優化
```typescript
// ✅ 使用 useMemo 優化計算
const totalFee = useMemo(() => {
  return electricNumbers.reduce((sum, item) => sum + item.fee, 0)
}, [electricNumbers])

// ✅ 使用 useCallback 優化函數
const handleSubmit = useCallback((data: FormData) => {
  auditUserBill({ variables: { ...data } })
}, [auditUserBill])
```

### 2. GraphQL 優化
```typescript
// ✅ 使用 Fragment 避免重複
const USER_BILL_FIELDS = gql`
  fragment userBillFields on UserBill {
    id
    name
    status
    billingDate
  }
`

// ✅ 分頁查詢
export const useUserBills = (page: number = 0, limit: number = 10) => {
  return useQuery(USER_BILLS, {
    variables: { 
      offset: page * limit, 
      limit 
    },
    fetchPolicy: 'cache-and-network'
  })
}
```

## 常見問題和解決方案

### 1. GraphQL 類型錯誤
```bash
# 重新生成類型
pnpm codegen

# 檢查 schema 是否更新
```

### 2. 測試失敗
```typescript
// ✅ 確保正確的 GraphQL import
import { USER_BILL } from '@core/graphql/queries'  // ✅ 正確
import { GET_USER_BILL } from '@utils/hooks/queries'  // ❌ 錯誤
```

### 3. 路徑別名問題
檢查 `tsconfig.json` 和 `jest.config.js` 中的路徑映射是否一致。

### 4. pnpm 相關問題
```bash
# 清理緩存
pnpm store prune

# 重新安裝依賴
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 最佳實踐

1. **始終使用 TypeScript strict mode**
2. **保持組件單一職責**
3. **使用 Fragment-based GraphQL queries**
4. **為所有組件編寫測試**
5. **使用 Error Boundaries 處理錯誤**
6. **遵循既定的命名慣例**
7. **使用 pnpm 而非 npm/yarn**
8. **定期運行 lint 和測試**

## 參考資源

- [Next.js 文檔](https://nextjs.org/docs)
- [Apollo Client 文檔](https://www.apollographql.com/docs/react/)
- [Material-UI 文檔](https://mui.com/)
- [React Hook Form 文檔](https://react-hook-form.com/)
- [Jest 文檔](https://jestjs.io/docs/getting-started)
- [pnpm 文檔](https://pnpm.io/)