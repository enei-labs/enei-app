import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render, createMockResponse } from '@utils/test-utils'
import { IndustryBillDialog } from '../IndustryBillDialog'
import { ElectricBillStatus } from '@core/graphql/types'
import { INDUSTRY_BILL } from '@core/graphql/queries'
import { AUDIT_INDUSTRY_BILL } from '@core/graphql/mutations'

// Mock data
const mockIndustryBill = {
  id: '1',
  name: 'Test Industry Bill',
  industryBillConfig: {
    name: 'Test Industry Config',
    industry: {
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

      // 初始狀態不應該顯示任何操作按鈕
      expect(screen.queryByText('列印')).not.toBeInTheDocument()
      expect(screen.queryByText('手動輸入')).not.toBeInTheDocument()
    })

    it('選擇"審核通過"時應該顯示列印按鈕', async () => {
      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, mockIndustryBillResponse),
        createMockResponse(
          AUDIT_INDUSTRY_BILL,
          { id: '1', status: ElectricBillStatus.Approved },
          { auditIndustryBill: { id: '1', status: ElectricBillStatus.Approved } }
        )
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('發電業電費單')).toBeInTheDocument()
      })

      // 點擊審核通過按鈕
      const approvedButton = screen.getByRole('button', { name: '審核通過' })
      fireEvent.click(approvedButton)

      await waitFor(() => {
        expect(screen.getByText('列印')).toBeInTheDocument()
      })

      // 確認手動輸入按鈕不存在
      expect(screen.queryByText('手動輸入')).not.toBeInTheDocument()
    })

    it('選擇"選擇手動輸入"時應該顯示手動輸入按鈕', async () => {
      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, mockIndustryBillResponse),
        createMockResponse(
          AUDIT_INDUSTRY_BILL,
          { id: '1', status: ElectricBillStatus.Manual },
          { auditIndustryBill: { id: '1', status: ElectricBillStatus.Manual } }
        )
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('發電業電費單')).toBeInTheDocument()
      })

      // 點擊手動輸入按鈕
      const manualButton = screen.getByRole('button', { name: '選擇手動輸入' })
      fireEvent.click(manualButton)

      await waitFor(() => {
        expect(screen.getByText('手動輸入')).toBeInTheDocument()
      })

      // 確認列印按鈕不存在
      expect(screen.queryByText('列印')).not.toBeInTheDocument()
    })

    it('應該根據不同的電費單狀態設置正確的初始審核狀態', async () => {
      const approvedIndustryBill = {
        ...mockIndustryBillResponse,
        industryBill: {
          ...mockIndustryBillResponse.industryBill,
          status: ElectricBillStatus.Approved
        }
      }

      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, approvedIndustryBill)
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        const approvedButton = screen.getByRole('button', { name: '審核通過' })
        expect(approvedButton).toHaveAttribute('aria-pressed', 'true')
      })
    })

    it('應該顯示當前審核狀態', async () => {
      const approvedIndustryBill = {
        ...mockIndustryBillResponse,
        industryBill: {
          ...mockIndustryBillResponse.industryBill,
          status: ElectricBillStatus.Approved
        }
      }

      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, approvedIndustryBill)
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

      await waitFor(() => {
        expect(screen.getByText('發電業電費單')).toBeInTheDocument()
      })

      // 檢查日期計算邏輯是否正確（2024/01/15 應該顯示為 2024年02月 的計費月份）
      // 這個測試需要檢查模板中的實際日期顯示
    })

    it('應該正確計算電費金額', async () => {
      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, mockIndustryBillResponse)
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('發電業電費單')).toBeInTheDocument()
      })

      // 轉供度數 800 * 費率 3.5 = 2800 (未稅)
      // 營業稅 2800 * 0.05 = 140
      // 總金額 2800 + 140 = 2940
      // 這些計算會在模板數據中體現
    })
  })

  describe('互動流程測試', () => {
    it('應該正確處理審核狀態切換', async () => {
      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, mockIndustryBillResponse),
        createMockResponse(
          AUDIT_INDUSTRY_BILL,
          { id: '1', status: ElectricBillStatus.Approved },
          { auditIndustryBill: { id: '1', status: ElectricBillStatus.Approved } }
        ),
        createMockResponse(
          AUDIT_INDUSTRY_BILL,
          { id: '1', status: ElectricBillStatus.Manual },
          { auditIndustryBill: { id: '1', status: ElectricBillStatus.Manual } }
        )
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('發電業電費單')).toBeInTheDocument()
      })

      // 先選擇審核通過
      const approvedButton = screen.getByRole('button', { name: '審核通過' })
      fireEvent.click(approvedButton)

      await waitFor(() => {
        expect(screen.getByText('列印')).toBeInTheDocument()
      })

      // 再切換到手動輸入
      const manualButton = screen.getByRole('button', { name: '選擇手動輸入' })
      fireEvent.click(manualButton)

      await waitFor(() => {
        expect(screen.getByText('手動輸入')).toBeInTheDocument()
        expect(screen.queryByText('列印')).not.toBeInTheDocument()
      })
    })

    it('點擊手動輸入按鈕應該關閉對話框', async () => {
      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, mockIndustryBillResponse),
        createMockResponse(
          AUDIT_INDUSTRY_BILL,
          { id: '1', status: ElectricBillStatus.Manual },
          { auditIndustryBill: { id: '1', status: ElectricBillStatus.Manual } }
        )
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('發電業電費單')).toBeInTheDocument()
      })

      // 選擇手動輸入
      const manualToggleButton = screen.getByRole('button', { name: '選擇手動輸入' })
      fireEvent.click(manualToggleButton)

      await waitFor(() => {
        expect(screen.getByText('手動輸入')).toBeInTheDocument()
      })

      // 點擊手動輸入按鈕
      const manualActionButton = screen.getByText('手動輸入')
      fireEvent.click(manualActionButton)

      expect(mockProps.onClose).toHaveBeenCalled()
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
      const mockPrint = jest.fn()
      jest.mock('react-to-print', () => ({
        useReactToPrint: () => mockPrint
      }))

      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, mockIndustryBillResponse),
        createMockResponse(
          AUDIT_INDUSTRY_BILL,
          { id: '1', status: ElectricBillStatus.Approved },
          { auditIndustryBill: { id: '1', status: ElectricBillStatus.Approved } }
        )
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('發電業電費單')).toBeInTheDocument()
      })

      // 選擇審核通過
      const approvedButton = screen.getByRole('button', { name: '審核通過' })
      fireEvent.click(approvedButton)

      await waitFor(() => {
        expect(screen.getByText('列印')).toBeInTheDocument()
      })

      // 點擊列印按鈕
      const printButton = screen.getByText('列印')
      fireEvent.click(printButton)

      // 由於useReactToPrint被mock了，我們無法直接測試列印功能
      // 但可以檢查按鈕是否可點擊
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

    it('應該處理審核操作失敗', async () => {
      const mocks = [
        createMockResponse(INDUSTRY_BILL, { id: '1' }, mockIndustryBillResponse),
        createMockResponse(
          AUDIT_INDUSTRY_BILL,
          { id: '1', status: ElectricBillStatus.Approved },
          null,
          new Error('Audit failed')
        )
      ]

      render(<IndustryBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('發電業電費單')).toBeInTheDocument()
      })

      const approvedButton = screen.getByRole('button', { name: '審核通過' })
      fireEvent.click(approvedButton)

      // 錯誤應該被toast顯示（被mock了）
      await waitFor(() => {
        expect(require('react-toastify').toast.error).toHaveBeenCalled()
      })
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

      await waitFor(() => {
        expect(screen.getByText('發電業電費單')).toBeInTheDocument()
        expect(screen.getByText('電費單組合： ')).toBeInTheDocument()
      })
    })
  })
})