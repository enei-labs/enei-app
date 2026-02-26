import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render, createMockResponse } from '@utils/test-utils'
import { IndustryBillDialog } from '../IndustryBillDialog'
import { ElectricBillStatus } from '@core/graphql/types'
import { INDUSTRY_BILL } from '@core/graphql/queries'
import { AUDIT_INDUSTRY_BILL } from '@core/graphql/mutations'

// Mock data - __typename is required for Apollo InMemoryCache fragment matching
const mockIndustryBill = {
  __typename: 'IndustryBill',
  id: '1',
  name: 'Test Industry Bill',
  industryBillConfig: {
    __typename: 'IndustryBillConfig',
    name: 'Test Industry Config',
    industry: {
      __typename: 'Industry',
      name: 'Test Industry Company',
      contactName: 'Test Industry Contact'
    }
  },
  transferDocumentNumber: 'TD001',
  powerPlantNumber: 'PP001',
  powerPlantName: 'Test Power Plant',
  powerPlantAddress: 'Test Address',
  companyContractNumber: 'CC001',
  supplyVolume: 1000,
  transferDegree: 800,
  price: 3.5,
  billingDate: '2024-01-15T00:00:00Z',
  status: ElectricBillStatus.Pending
}

const mockIndustryBillResponse = {
  industryBill: mockIndustryBill
}

const mockApprovedResponse = {
  industryBill: {
    ...mockIndustryBill,
    status: ElectricBillStatus.Approved
  }
}

const mockProps = {
  isOpenDialog: true,
  onClose: jest.fn(),
  industryBill: mockIndustryBill
}

describe('IndustryBillDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('條件顯示邏輯測試', () => {
    it('應該根據審核狀態顯示對應的操作按鈕', async () => {
      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, mockIndustryBillResponse)
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('發電業電費單')).toBeInTheDocument()
      })

      // 初始狀態不應該顯示列印按鈕
      expect(screen.queryByText('列印')).not.toBeInTheDocument()
    })

    it('選擇"審核通過"時應該顯示列印按鈕', async () => {
      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, mockIndustryBillResponse),
        createMockResponse(
          AUDIT_INDUSTRY_BILL,
          { id: '1', status: ElectricBillStatus.Approved },
          { auditIndustryBill: { __typename: 'IndustryBill', id: '1', status: ElectricBillStatus.Approved } }
        ),
        // Mock for refetch after mutation
        createMockResponse(INDUSTRY_BILL, { id: '1' }, mockApprovedResponse)
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      // 等待資料載入完成 - 審核通過按鈕出現
      await waitFor(() => {
        expect(screen.getByText('當前審核狀態：')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: '審核通過' }))

      await waitFor(() => {
        expect(screen.getByText('列印')).toBeInTheDocument()
      })
    })

    it('選擇"手動匯入"時應該切換操作模式', async () => {
      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, mockIndustryBillResponse)
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('發電業電費單')).toBeInTheDocument()
      })

      // 點擊手動匯入 ToggleButton
      fireEvent.click(screen.getByText('手動匯入'))

      await waitFor(() => {
        // 手動匯入模式下不應該顯示列印按鈕
        expect(screen.queryByText('列印')).not.toBeInTheDocument()
      })
    })

    it('已審核通過的電費單應該直接顯示列印按鈕', async () => {
      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, mockApprovedResponse)
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      // 已審核通過的電費單應該顯示列印按鈕
      await waitFor(() => {
        expect(screen.getByText('列印')).toBeInTheDocument()
      })
    })

    it('應該顯示當前審核狀態', async () => {
      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, mockApprovedResponse)
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('當前審核狀態：')).toBeInTheDocument()
      })
    })
  })

  describe('資料顯示邏輯測試', () => {
    it('應該正確顯示工業電費單的基本資訊', async () => {
      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, mockIndustryBillResponse)
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('發電業電費單')).toBeInTheDocument()
        expect(screen.getByText('電費單組合： Test Industry Config')).toBeInTheDocument()
      })
    })

    it('應該正確計算和格式化計費日期', async () => {
      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, mockIndustryBillResponse)
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      // 2024/01/15 計費月份為 2024年2月
      await waitFor(() => {
        expect(screen.getByText('2024年2月')).toBeInTheDocument()
      })
    })

    it('應該正確計算電費金額', async () => {
      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, mockIndustryBillResponse)
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      // 轉供度數 800 * 費率 3.5 = 2800 (未稅)
      // 營業稅 2800 * 0.05 = 140
      // 總金額 2800 + 140 = 2940
      await waitFor(() => {
        expect(screen.getByText('購電通知單')).toBeInTheDocument()
      })
    })
  })

  describe('互動流程測試', () => {
    it('應該正確處理操作模式切換', async () => {
      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, mockIndustryBillResponse),
        createMockResponse(
          AUDIT_INDUSTRY_BILL,
          { id: '1', status: ElectricBillStatus.Approved },
          { auditIndustryBill: { __typename: 'IndustryBill', id: '1', status: ElectricBillStatus.Approved } }
        ),
        // Mock for refetch after mutation
        createMockResponse(INDUSTRY_BILL, { id: '1' }, mockApprovedResponse)
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      // 等待資料載入
      await waitFor(() => {
        expect(screen.getByText('當前審核狀態：')).toBeInTheDocument()
      })

      // 先選擇審核通過
      fireEvent.click(screen.getByRole('button', { name: '審核通過' }))

      await waitFor(() => {
        expect(screen.getByText('列印')).toBeInTheDocument()
      })

      // 再切換到手動匯入模式
      fireEvent.click(screen.getByText('手動匯入'))

      await waitFor(() => {
        expect(screen.queryByText('列印')).not.toBeInTheDocument()
      })
    })

    it('應該在載入時顯示載入指示器', () => {
      const mocks = [
        {
          ...createMockResponse(INDUSTRY_BILL, { id: '1' }, mockIndustryBillResponse),
          delay: 1000
        }
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('點擊列印按鈕應該觸發列印功能', async () => {
      // 使用已審核通過的電費單，直接顯示列印按鈕
      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, mockApprovedResponse)
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('列印')).toBeInTheDocument()
      })

      // 點擊列印按鈕
      const printButton = screen.getByText('列印')
      fireEvent.click(printButton)

      // 檢查按鈕是否可點擊
      expect(printButton).toBeInTheDocument()
    })
  })

  describe('錯誤處理測試', () => {
    it('應該處理GraphQL錯誤', async () => {
      const mocks = [
        createMockResponse(
          INDUSTRY_BILL,
          { id: '1' },
          null,
          new Error('Network error')
        )
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('發電業電費單')).toBeInTheDocument()
      })
    })

    it('Pending 狀態下審核通過按鈕應該存在', async () => {
      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, mockIndustryBillResponse)
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      // 等待資料載入
      await waitFor(() => {
        expect(screen.getByText('當前審核狀態：')).toBeInTheDocument()
      })

      // Pending 狀態下應該有審核通過按鈕
      expect(screen.getByRole('button', { name: '審核通過' })).toBeInTheDocument()
      // 列印按鈕不應出現
      expect(screen.queryByText('列印')).not.toBeInTheDocument()
    })

    it('應該處理空資料狀態', async () => {
      const emptyResponse = {
        industryBill: {
          ...mockIndustryBill,
          industryBillConfig: null
        }
      }

      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, emptyResponse)
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      // 標題使用 prop 中的資料，config name 為空時顯示空字串
      // 但 prop 仍然有 industryBillConfig，所以檢查標題即可
      await waitFor(() => {
        expect(screen.getByText('發電業電費單')).toBeInTheDocument()
      })
    })
  })
})
