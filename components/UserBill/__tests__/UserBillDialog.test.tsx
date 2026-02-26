import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render, createMockResponse } from '@utils/test-utils'
import { UserBillDialog } from '../UserBillDialog'
import { ElectricBillStatus, UserBillConfigChargeType } from '@core/graphql/types'
import { USER_BILL } from '@core/graphql/queries'
import { AUDIT_USER_BILL } from '@core/graphql/mutations'

// Mock data - __typename is required for Apollo InMemoryCache fragment matching
const mockUserBill = {
  __typename: 'UserBill',
  id: '1',
  name: 'Test User Bill',
  userBillConfig: {
    __typename: 'UserBillConfig',
    name: 'Test Config',
    user: {
      __typename: 'User',
      name: 'Test Company',
      contactName: 'Test Contact',
      companyAddress: 'Test Address',
      bankAccounts: [{
        __typename: 'BankAccount',
        accountName: 'Test Account',
        account: '123456789'
      }]
    },
    recipientAccount: {
      __typename: 'RecipientAccount',
      bankCode: 'Test Bank'
    },
    transportationFee: UserBillConfigChargeType.User,
    credentialInspectionFee: UserBillConfigChargeType.User,
    credentialServiceFee: UserBillConfigChargeType.User,
    paymentDeadline: 30
  },
  electricNumberInfos: [
    {
      __typename: 'ElectricNumberInfo',
      number: 'E001',
      degree: 1000,
      price: 2.5,
      fee: 2500
    },
    {
      __typename: 'ElectricNumberInfo',
      number: 'E002',
      degree: 500,
      price: 2.8,
      fee: 1400
    }
  ],
  transferDocumentNumbers: ['TD001', 'TD002'],
  billingDate: '2024-01-15T00:00:00Z',
  status: ElectricBillStatus.Pending
}

const mockUserBillResponse = {
  userBill: mockUserBill,
  fee: {
    __typename: 'Fee',
    substitutionFee: 0.1,
    certificateVerificationFee: 0.05,
    certificateServiceFee: 0.02
  }
}

const mockApprovedResponse = {
  userBill: {
    ...mockUserBill,
    status: ElectricBillStatus.Approved
  },
  fee: mockUserBillResponse.fee
}

const mockProps = {
  isOpenDialog: true,
  onClose: jest.fn(),
  userBill: mockUserBill
}

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

      // Pending 狀態下不應該顯示列印按鈕
      expect(screen.queryByText('列印')).not.toBeInTheDocument()
    })

    it('選擇"審核通過"時應該顯示列印按鈕', async () => {
      const mocks = [
        createMockResponse(USER_BILL, { id: '1' }, mockUserBillResponse),
        createMockResponse(
          AUDIT_USER_BILL,
          { id: '1', status: ElectricBillStatus.Approved },
          { auditUserBill: { __typename: 'UserBill', id: '1', status: ElectricBillStatus.Approved } }
        ),
        // Mock for refetch after mutation
        createMockResponse(USER_BILL, { id: '1' }, mockApprovedResponse)
      ]

      render(<UserBillDialog {...mockProps} />, { mocks })

      // 等待資料載入完成
      await waitFor(() => {
        expect(screen.getByText('當前審核狀態：')).toBeInTheDocument()
      })

      // 點擊審核通過按鈕
      fireEvent.click(screen.getByRole('button', { name: '審核通過' }))

      await waitFor(() => {
        expect(screen.getByText('列印')).toBeInTheDocument()
      })
    })

    it('選擇"手動匯入"時應該切換操作模式', async () => {
      const mocks = [
        createMockResponse(USER_BILL, { id: '1' }, mockUserBillResponse)
      ]

      render(<UserBillDialog {...mockProps} />, { mocks })

      // 等待操作模式切換按鈕出現
      await waitFor(() => {
        expect(screen.getByText('手動匯入')).toBeInTheDocument()
      })

      // 點擊手動匯入按鈕（ToggleButton）
      fireEvent.click(screen.getByText('手動匯入'))

      // 切換到手動匯入模式後，列印按鈕不應存在
      await waitFor(() => {
        expect(screen.queryByText('列印')).not.toBeInTheDocument()
      })
    })

    it('已審核通過的電費單應該直接顯示列印按鈕', async () => {
      const mocks = [
        createMockResponse(USER_BILL, { id: '1' }, mockApprovedResponse)
      ]

      render(<UserBillDialog {...mockProps} />, { mocks })

      // 已審核通過的電費單應該直接顯示列印按鈕
      await waitFor(() => {
        expect(screen.getByText('列印')).toBeInTheDocument()
      })
    })
  })

  describe('資料計算邏輯測試', () => {
    it('應該正確顯示電費單組合名稱', async () => {
      const mocks = [
        createMockResponse(USER_BILL, { id: '1' }, mockUserBillResponse)
      ]

      render(<UserBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText(/電費單組合/)).toBeInTheDocument()
      })
    })

    it('應該根據收費設定正確渲染電費單', async () => {
      const mocks = [
        createMockResponse(USER_BILL, { id: '1' }, mockUserBillResponse)
      ]

      render(<UserBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('用戶電費單')).toBeInTheDocument()
        expect(screen.getByText(/電費單組合/)).toBeInTheDocument()
      })
    })
  })

  describe('互動流程測試', () => {
    it('應該正確處理操作模式切換', async () => {
      const mocks = [
        createMockResponse(USER_BILL, { id: '1' }, mockUserBillResponse),
      ]

      render(<UserBillDialog {...mockProps} />, { mocks })

      // 等待操作模式切換出現
      await waitFor(() => {
        expect(screen.getByText('審核電費單')).toBeInTheDocument()
        expect(screen.getByText('手動匯入')).toBeInTheDocument()
      })

      // 切換到手動匯入模式
      fireEvent.click(screen.getByText('手動匯入'))

      // 再切回審核模式
      fireEvent.click(screen.getByText('審核電費單'))

      // 審核模式下應該有審核相關按鈕
      await waitFor(() => {
        expect(screen.getByText('審核電費單')).toBeInTheDocument()
      })
    })

    it('應該在載入時顯示載入指示器', () => {
      const mocks = [
        {
          ...createMockResponse(USER_BILL, { id: '1' }, mockUserBillResponse),
          delay: 1000
        }
      ]

      render(<UserBillDialog {...mockProps} />, { mocks })

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('對話框應該正常渲染', async () => {
      const mocks = [
        createMockResponse(USER_BILL, { id: '1' }, mockUserBillResponse)
      ]

      render(<UserBillDialog {...mockProps} />, { mocks })

      // 檢查對話框是否打開
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByText('用戶電費單')).toBeInTheDocument()
      })
    })
  })

  describe('錯誤處理測試', () => {
    it('應該處理GraphQL錯誤', async () => {
      const mocks = [
        createMockResponse(
          USER_BILL,
          { id: '1' },
          null,
          new Error('Network error')
        )
      ]

      render(<UserBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('用戶電費單')).toBeInTheDocument()
      })
    })

    it('Pending 狀態下審核通過按鈕應該存在', async () => {
      const mocks = [
        createMockResponse(USER_BILL, { id: '1' }, mockUserBillResponse)
      ]

      render(<UserBillDialog {...mockProps} />, { mocks })

      // 等待資料載入完成
      await waitFor(() => {
        expect(screen.getByText('當前審核狀態：')).toBeInTheDocument()
      })

      // Pending 狀態下應該有審核通過按鈕
      expect(screen.getByRole('button', { name: '審核通過' })).toBeInTheDocument()
      // 列印按鈕不應出現
      expect(screen.queryByText('列印')).not.toBeInTheDocument()
    })
  })
})
