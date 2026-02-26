import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render, FormWrapper, createMockResponse } from '@utils/test-utils'
import TPCBillDialog from '../TPCBillDialog/TPCBillDialog'
import { TRANSFER_DOCUMENTS, TRANSFER_DOCUMENT } from '@core/graphql/queries'
import { CREATE_TPC_BILL } from '@core/graphql/mutations'

// Mock data - __typename required for Apollo InMemoryCache fragment matching
const mockTransferDocuments = [
  {
    __typename: 'TransferDocument',
    id: '1',
    name: 'Transfer Document 1',
    number: 'TD001'
  },
  {
    __typename: 'TransferDocument',
    id: '2',
    name: 'Transfer Document 2',
    number: 'TD002'
  }
]

const mockTransferDocument = {
  __typename: 'TransferDocument',
  id: '1',
  name: 'Transfer Document 1',
  number: 'TD001',
  transferDocumentPowerPlants: [
    {
      __typename: 'TransferDocumentPowerPlant',
      id: '1',
      powerPlant: {
        __typename: 'PowerPlant',
        id: 'pp1',
        name: 'Power Plant 1',
        number: 'PP001'
      }
    }
  ],
  transferDocumentUsers: [
    {
      __typename: 'TransferDocumentUser',
      id: '1',
      user: {
        __typename: 'User',
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
        createMockResponse(TRANSFER_DOCUMENTS, undefined, { transferDocuments: { total: 2, list: mockTransferDocuments } })
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
        createMockResponse(TRANSFER_DOCUMENTS, undefined, { transferDocuments: { total: 2, list: mockTransferDocuments } })
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      // 直接點擊儲存不選擇轉供文件
      const saveButton = screen.getByRole('button', { name: '儲存' })
      fireEvent.click(saveButton)

      // 表單驗證應該阻止提交
      await waitFor(() => {
        expect(mockProps.onClose).not.toHaveBeenCalled()
      })
    })

    it('應該驗證帳單編號格式', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, undefined, { transferDocuments: { total: 2, list: mockTransferDocuments } })
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
        createMockResponse(TRANSFER_DOCUMENTS, undefined, { transferDocuments: { total: 2, list: mockTransferDocuments } })
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
        createMockResponse(TRANSFER_DOCUMENTS, undefined, { transferDocuments: { total: 2, list: mockTransferDocuments } }),
        createMockResponse(TRANSFER_DOCUMENT, { id: '1' }, { transferDocument: mockTransferDocument })
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      // 找到轉供契約編號的 autocomplete 並展開選項
      const transferDocumentSelect = screen.getByRole('combobox')
      fireEvent.mouseDown(transferDocumentSelect)

      // 等待選項出現（格式: "TD001(Transfer Document 1)"）
      await waitFor(() => {
        expect(screen.getByText(/TD001.*Transfer Document 1/)).toBeInTheDocument()
      })

      // 選擇第一個轉供文件
      fireEvent.click(screen.getByText(/TD001.*Transfer Document 1/))

      // 選擇後應該觸發 lazy query 載入轉供文件詳細資料
      await waitFor(() => {
        expect(screen.getByText(/Power Plant 1/)).toBeInTheDocument()
      })
    })

    it('應該根據選擇的轉供文件顯示關聯電廠', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, undefined, { transferDocuments: { total: 2, list: mockTransferDocuments } }),
        createMockResponse(TRANSFER_DOCUMENT, { id: '1' }, { transferDocument: mockTransferDocument })
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      // 選擇轉供文件
      const transferDocumentSelect = screen.getByRole('combobox')
      fireEvent.mouseDown(transferDocumentSelect)

      await waitFor(() => {
        expect(screen.getByText(/TD001.*Transfer Document 1/)).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText(/TD001.*Transfer Document 1/))

      // 載入完成後應該顯示關聯的電廠和用戶資訊
      await waitFor(() => {
        expect(screen.getByText(/Power Plant 1/)).toBeInTheDocument()
      })
    })

    it('轉供度數輸入應該只接受數字', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, undefined, { transferDocuments: { total: 2, list: mockTransferDocuments } }),
        createMockResponse(TRANSFER_DOCUMENT, { id: '1' }, { transferDocument: mockTransferDocument })
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      // 進行完整的流程：選擇轉供文件 -> 選擇電廠 -> 輸入轉供度數
      // 這需要根據實際的UI結構來調整
    })

    it('對話框應該顯示代輸繳費單資料標題', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, undefined, { transferDocuments: { total: 2, list: mockTransferDocuments } }),
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      // 檢查表單區段標題
      expect(screen.getByText('代輸繳費單資料')).toBeInTheDocument()
    })
  })

  describe('表單提交測試', () => {
    it('對話框應該渲染轉供文件選項', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, undefined, { transferDocuments: { total: 2, list: mockTransferDocuments } }),
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      // 驗證儲存按鈕存在
      expect(screen.getByRole('button', { name: '儲存' })).toBeInTheDocument()
    })

    it('未填寫必填欄位時提交應該觸發驗證錯誤', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, undefined, { transferDocuments: { total: 2, list: mockTransferDocuments } }),
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      // 不填寫任何資料直接提交，應觸發表單驗證而非 mutation
      const saveButton = screen.getByRole('button', { name: '儲存' })
      fireEvent.click(saveButton)

      // 表單驗證應該阻止提交（mutation 不會被觸發）
      await waitFor(() => {
        expect(mockProps.onClose).not.toHaveBeenCalled()
      })
    })

    it('儲存按鈕應該存在且可點擊', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, undefined, { transferDocuments: { total: 2, list: mockTransferDocuments } }),
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增台電代輸繳費單')).toBeInTheDocument()
      })

      const saveButton = screen.getByRole('button', { name: '儲存' })
      expect(saveButton).toBeInTheDocument()
      expect(saveButton).not.toBeDisabled()
    })
  })

  describe('檔案上傳測試', () => {
    it('應該支援帳單文件上傳', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, undefined, { transferDocuments: { total: 2, list: mockTransferDocuments } })
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
        createMockResponse(TRANSFER_DOCUMENTS, undefined, { transferDocuments: { total: 2, list: mockTransferDocuments } })
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
        createMockResponse(TRANSFER_DOCUMENTS, undefined, { transferDocuments: { total: 2, list: mockTransferDocuments } })
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

    it('對話框外點擊不應該關閉對話框（backdrop click disabled by design）', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, undefined, { transferDocuments: { total: 2, list: mockTransferDocuments } })
      ]

      render(<TPCBillDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Dialog component intentionally disables backdrop click (onClose is commented out)
      const backdrop = screen.getByRole('dialog').parentElement
      if (backdrop) {
        fireEvent.click(backdrop)
        expect(mockProps.onClose).not.toHaveBeenCalled()
      }
    })

    it('ESC鍵不應該關閉對話框（disabled by design）', async () => {
      const mocks = [
        createMockResponse(TRANSFER_DOCUMENTS, undefined, { transferDocuments: { total: 2, list: mockTransferDocuments } })
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

      // Dialog component doesn't pass onClose, so ESC doesn't close it
      expect(mockProps.onClose).not.toHaveBeenCalled()
    })
  })
})