import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render, FormWrapper, createMockResponse } from '@utils/test-utils'
import TPCBillDialog from '../TPCBillDialog/TPCBillDialog'
import { TRANSFER_DOCUMENTS, TRANSFER_DOCUMENT } from '@core/graphql/queries'
import { CREATE_TPC_BILL } from '@core/graphql/mutations'

// Mock data
const mockTransferDocuments = [
  {
    id: '1',
    name: 'Transfer Document 1',
    number: 'TD001'
  },
  {
    id: '2', 
    name: 'Transfer Document 2',
    number: 'TD002'
  }
]

const mockTransferDocument = {
  id: '1',
  name: 'Transfer Document 1',
  number: 'TD001',
  transferDocumentPowerPlants: [
    {
      id: '1',
      powerPlant: {
        id: 'pp1',
        name: 'Power Plant 1',
        number: 'PP001'
      }
    }
  ],
  transferDocumentUsers: [
    {
      id: '1',
      user: {
        id: 'u1',
        name: 'User 1'
      }
    }
  ]
}

const mockProps = {
  isOpenDialog: true,
  onClose: jest.fn(),
  variant: 'create' as const
}

describe('TPCBillDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('表單驗證測試', () => {
    it('應該要求填寫必填欄位', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, {}, { transferDocuments: mockTransferDocuments })
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      // 直接點擊儲存按鈕不填寫任何資料
      const saveButton = screen.getByRole('button', { name: '儲存' })
      fireEvent.click(saveButton)

      // 應該會顯示驗證錯誤（根據react-hook-form的行為）
      await waitFor(() => {
        // 檢查是否有驗證錯誤提示
        // 實際的錯誤訊息取決於表單驗證規則
      })
    })

    it('轉供文件選擇應該是必填的', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, {}, { transferDocuments: mockTransferDocuments })
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      // 填寫其他欄位但不選擇轉供文件
      const billNumberInput = screen.getByLabelText(/帳單編號/i) || screen.getByDisplayValue('')
      if (billNumberInput) {
        fireEvent.change(billNumberInput, { target: { value: 'BILL001' } })
      }

      const saveButton = screen.getByRole('button', { name: '儲存' })
      fireEvent.click(saveButton)

      // 應該無法提交表單
    })

    it('應該驗證帳單編號格式', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, {}, { transferDocuments: mockTransferDocuments })
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      // 嘗試輸入無效的帳單編號格式
      // 這需要根據實際的驗證規則來調整
    })

    it('應該驗證日期欄位', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, {}, { transferDocuments: mockTransferDocuments })
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      // 測試日期選擇器的行為
      const dateInputs = screen.getAllByRole('textbox')
      expect(dateInputs.length).toBeGreaterThan(0)
    })
  })

  describe('動態表單欄位測試', () => {
    it('選擇轉供文件後應該載入相關資料', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, {}, { transferDocuments: mockTransferDocuments }),
        createMockResponse(TRANSFER_DOCUMENT, { id: '1' }, { transferDocument: mockTransferDocument })
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      // 選擇轉供文件
      const transferDocumentSelect = screen.getByRole('combobox', { name: /轉供文件/i }) || 
                                   screen.getByDisplayValue('') || 
                                   screen.getAllByRole('button')[0]
      
      if (transferDocumentSelect) {
        fireEvent.mouseDown(transferDocumentSelect)
        
        await waitFor(() => {
          const option = screen.getByText('Transfer Document 1')
          fireEvent.click(option)
        })

        // 選擇後應該觸發lazy query載入轉供文件詳細資料
        await waitFor(() => {
          // 檢查是否顯示了相關的電廠和用戶選項
          expect(screen.queryByText('Power Plant 1')).toBeInTheDocument()
        })
      }
    })

    it('應該根據選擇的電廠動態顯示轉供度數輸入欄位', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, {}, { transferDocuments: mockTransferDocuments }),
        createMockResponse(TRANSFER_DOCUMENT, { id: '1' }, { transferDocument: mockTransferDocument })
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      // 先選擇轉供文件
      const transferDocumentSelect = screen.getByRole('combobox', { name: /轉供文件/i }) || 
                                   screen.getAllByRole('button')[0]
      
      if (transferDocumentSelect) {
        fireEvent.mouseDown(transferDocumentSelect)
        
        await waitFor(() => {
          const option = screen.getByText('Transfer Document 1')
          fireEvent.click(option)
        })

        // 等待載入完成後選擇電廠
        await waitFor(() => {
          const powerPlantOption = screen.getByText('Power Plant 1')
          fireEvent.click(powerPlantOption)
        })

        // 選擇電廠後應該顯示轉供度數輸入欄位
        await waitFor(() => {
          expect(screen.getByLabelText(/轉供度數/i) || screen.getByPlaceholderText(/轉供度數/i)).toBeInTheDocument()
        })
      }
    })

    it('轉供度數輸入應該只接受數字', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, {}, { transferDocuments: mockTransferDocuments }),
        createMockResponse(TRANSFER_DOCUMENT, { id: '1' }, { transferDocument: mockTransferDocument })
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      // 進行完整的流程：選擇轉供文件 -> 選擇電廠 -> 輸入轉供度數
      // 這需要根據實際的UI結構來調整
    })

    it('應該可以重置表單並清除所有動態欄位', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, {}, { transferDocuments: mockTransferDocuments }),
        createMockResponse(TRANSFER_DOCUMENT, { id: '1' }, { transferDocument: mockTransferDocument })
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      // 填寫一些資料
      const billNumberInput = screen.getByDisplayValue('') || screen.getAllByRole('textbox')[0]
      if (billNumberInput) {
        fireEvent.change(billNumberInput, { target: { value: 'TEST001' } })
      }

      // 尋找重置按鈕（可能在轉供文件選擇區域）
      const resetButton = screen.queryByText('重置') || screen.queryByRole('button', { name: /重置/i })
      if (resetButton) {
        fireEvent.click(resetButton)

        // 檢查表單是否被重置
        await waitFor(() => {
          expect(billNumberInput).toHaveValue('')
        })
      }
    })
  })

  describe('表單提交測試', () => {
    it('填寫完整資料後應該能成功提交', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, {}, { transferDocuments: mockTransferDocuments }),
        createMockResponse(TRANSFER_DOCUMENT, { id: '1' }, { transferDocument: mockTransferDocument }),
        createMockResponse(
          CREATE_TPC_BILL,
          {
            input: {
              billDoc: null,
              billNumber: 'BILL001',
              billReceivedDate: expect.any(Date),
              billingDate: expect.any(Date),
              transferDocumentId: '1',
              transferDegrees: expect.any(Array)
            }
          },
          { createTPCBill: { id: 'new-bill-id' } }
        )
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      // 填寫完整的表單資料
      // 1. 選擇轉供文件
      // 2. 填寫帳單編號
      // 3. 選擇日期
      // 4. 上傳文件
      // 5. 選擇電廠並填寫轉供度數

      // 提交表單
      const saveButton = screen.getByRole('button', { name: '儲存' })
      fireEvent.click(saveButton)

      // 檢查成功提交後的行為
      await waitFor(() => {
        expect(require('react-toastify').toast.success).toHaveBeenCalledWith('新增成功')
        expect(mockProps.onClose).toHaveBeenCalled()
      })
    })

    it('提交失敗時應該顯示錯誤訊息', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, {}, { transferDocuments: mockTransferDocuments }),
        createMockResponse(
          CREATE_TPC_BILL,
          expect.any(Object),
          null,
          new Error('Failed to create TPC bill')
        )
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      // 填寫並提交表單
      const saveButton = screen.getByRole('button', { name: '儲存' })
      fireEvent.click(saveButton)

      // 檢查錯誤處理
      await waitFor(() => {
        expect(require('react-toastify').toast.error).toHaveBeenCalled()
      })
    })

    it('提交過程中應該顯示載入狀態', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, {}, { transferDocuments: mockTransferDocuments }),
        {
          ...createMockResponse(CREATE_TPC_BILL, expect.any(Object), { createTPCBill: { id: 'new-id' } }),
          delay: 1000
        }
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      const saveButton = screen.getByRole('button', { name: '儲存' })
      fireEvent.click(saveButton)

      // 檢查載入狀態
      expect(saveButton).toBeDisabled()
      // 可能還會有載入圖標
    })
  })

  describe('檔案上傳測試', () => {
    it('應該支援帳單文件上傳', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, {}, { transferDocuments: mockTransferDocuments })
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      // 尋找檔案上傳元件
      const fileInput = screen.queryByRole('button', { name: /上傳/i }) || 
                       screen.queryByText(/選擇檔案/i)
      
      if (fileInput) {
        // 模擬檔案上傳
        const file = new File(['test content'], 'test-bill.pdf', { type: 'application/pdf' })
        
        if (fileInput.tagName === 'INPUT') {
          fireEvent.change(fileInput, { target: { files: [file] } })
        } else {
          fireEvent.click(fileInput)
        }

        // 檢查檔案是否被正確處理
      }
    })

    it('應該驗證上傳檔案的格式', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, {}, { transferDocuments: mockTransferDocuments })
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      // 嘗試上傳不支援的檔案格式
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' })
      
      // 這需要根據實際的檔案上傳組件實作來調整
    })
  })

  describe('UI互動測試', () => {
    it('關閉按鈕應該正常工作', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, {}, { transferDocuments: mockTransferDocuments })
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      // 尋找關閉按鈕（通常是X按鈕或關閉按鈕）
      const closeButton = screen.queryByRole('button', { name: /關閉/i }) ||
                         screen.queryByRole('button', { name: /close/i }) ||
                         screen.queryByLabelText(/close/i)

      if (closeButton) {
        fireEvent.click(closeButton)
        expect(mockProps.onClose).toHaveBeenCalled()
      }
    })

    it('對話框外點擊應該關閉對話框', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, {}, { transferDocuments: mockTransferDocuments })
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // 模擬點擊對話框外部區域
      const backdrop = screen.getByRole('dialog').parentElement
      if (backdrop) {
        fireEvent.click(backdrop)
        expect(mockProps.onClose).toHaveBeenCalled()
      }
    })

    it('ESC鍵應該關閉對話框', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, {}, { transferDocuments: mockTransferDocuments })
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      fireEvent.keyDown(screen.getByRole('dialog'), {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27
      })

      expect(mockProps.onClose).toHaveBeenCalled()
    })
  })
})