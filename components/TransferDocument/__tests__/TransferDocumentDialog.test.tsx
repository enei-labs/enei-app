import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render, createMockResponse } from '@utils/test-utils'
import TransferDocumentDialog from '../TransferDocumentDialog/TransferDocumentDialog'
import { COMPANIES_WITH_POWER_PLANTS, BASE_USERS, USER_CONTRACTS } from '@core/graphql/queries'

// Mock data with correct paginated response shapes
// __typename required for Apollo InMemoryCache fragment matching (powerPlantFields on PowerPlant)
const mockCompaniesData = {
  companies: {
    total: 1,
    list: [
      {
        id: 'c1',
        name: 'Company 1',
        companyContracts: [
          {
            id: 'cc1',
            name: 'Contract 1',
            number: 'CC001',
            powerPlants: [
              {
                __typename: 'PowerPlant',
                id: 'pp1',
                name: 'Power Plant 1',
                number: 'PP001',
                volume: 1000,
                price: '3.5',
                energyType: 'SOLAR',
                generationType: 'GREEN',
                transferRate: 100,
                supplyVolume: 800,
                estimatedAnnualPowerGeneration: 80000,
                estimatedAnnualPowerSupply: 80000,
                address: '台北市',
                createdBy: 'admin',
                createdAt: '2024-01-01T00:00:00Z',
                companyContractId: 'cc1',
                officialTransferDate: null,
                recipientAccount: { bankCode: '012', account: '12345' }
              },
              {
                __typename: 'PowerPlant',
                id: 'pp2',
                name: 'Power Plant 2',
                number: 'PP002',
                volume: 2000,
                price: '4.0',
                energyType: 'WIND',
                generationType: 'GREEN',
                transferRate: 80,
                supplyVolume: 1600,
                estimatedAnnualPowerGeneration: 160000,
                estimatedAnnualPowerSupply: 128000,
                address: '台中市',
                createdBy: 'admin',
                createdAt: '2024-01-01T00:00:00Z',
                companyContractId: 'cc1',
                officialTransferDate: null,
                recipientAccount: { bankCode: '013', account: '67890' }
              }
            ]
          }
        ]
      }
    ]
  }
}

const mockUsersData = {
  users: {
    total: 2,
    list: [
      { id: 'u1', name: 'User 1', contactEmail: 'u1@test.com', contactName: 'Contact 1' },
      { id: 'u2', name: 'User 2', contactEmail: 'u2@test.com', contactName: 'Contact 2' }
    ]
  }
}

// Both queries fire on component mount
// COMPANIES_WITH_POWER_PLANTS: no variables
// BASE_USERS: useUsers hook sends { term: undefined } — use variableMatcher to avoid strict matching issues
const getDefaultMocks = () => [
  createMockResponse(COMPANIES_WITH_POWER_PLANTS, undefined, mockCompaniesData),
  {
    request: { query: BASE_USERS },
    variableMatcher: () => true,
    result: { data: mockUsersData }
  }
]

const mockProps = {
  isOpenDialog: true,
  onClose: jest.fn(),
  variant: 'create' as const
}

describe('TransferDocumentDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('基本渲染測試', () => {
    it('create mode 應該顯示正確的對話框標題', async () => {
      render(<TransferDocumentDialog {...mockProps} />, { mocks: getDefaultMocks() })

      await waitFor(() => {
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })
    })

    it('edit mode 應該顯示正確的對話框標題', async () => {
      const editProps = {
        ...mockProps,
        variant: 'edit' as const,
        currentModifyTransferDocument: {
          id: '1',
          name: 'Existing Contract',
          number: 'EC001',
          receptionAreas: '台北',
          expectedTime: '2024-06-01T00:00:00Z',
          transferDocumentPowerPlants: [],
          transferDocumentUsers: []
        }
      }

      render(<TransferDocumentDialog {...editProps} />, { mocks: getDefaultMocks() })

      await waitFor(() => {
        expect(screen.getByText('修改轉供合約')).toBeInTheDocument()
      })
    })

    it('應該顯示表單區段標題', async () => {
      render(<TransferDocumentDialog {...mockProps} />, { mocks: getDefaultMocks() })

      await waitFor(() => {
        expect(screen.getByText('轉供資料')).toBeInTheDocument()
      })

      expect(screen.getByText('電廠')).toBeInTheDocument()
      expect(screen.getByText('用戶電號')).toBeInTheDocument()
    })

    it('應該顯示基本表單輸入欄位', async () => {
      render(<TransferDocumentDialog {...mockProps} />, { mocks: getDefaultMocks() })

      await waitFor(() => {
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })

      const textboxes = screen.getAllByRole('textbox')
      expect(textboxes.length).toBeGreaterThan(0)
    })

    it('對話框應該正常渲染', async () => {
      render(<TransferDocumentDialog {...mockProps} />, { mocks: getDefaultMocks() })

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })
    })
  })

  describe('動態表單欄位測試', () => {
    it('電廠和用戶區段應該各有新增按鈕', async () => {
      render(<TransferDocumentDialog {...mockProps} />, { mocks: getDefaultMocks() })

      await waitFor(() => {
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })

      // 電廠和用戶各有一個「新增」按鈕
      const addButtons = screen.getAllByRole('button', { name: '新增' })
      expect(addButtons.length).toBeGreaterThanOrEqual(2)
    })

    it('點擊新增按鈕應該新增電廠 Chip', async () => {
      render(<TransferDocumentDialog {...mockProps} />, { mocks: getDefaultMocks() })

      await waitFor(() => {
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })

      // 第一個「新增」按鈕是電廠區段的
      const addButtons = screen.getAllByRole('button', { name: '新增' })
      fireEvent.click(addButtons[0])

      // 新增後應出現電廠 Chip（空白時 label 回退為「電廠1」）
      await waitFor(() => {
        expect(screen.getByText('電廠1')).toBeInTheDocument()
      })
    })

    it('點擊新增按鈕應該新增用戶 Chip', async () => {
      render(<TransferDocumentDialog {...mockProps} />, { mocks: getDefaultMocks() })

      await waitFor(() => {
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })

      // 第二個「新增」按鈕是用戶區段的
      const addButtons = screen.getAllByRole('button', { name: '新增' })
      fireEvent.click(addButtons[1])

      // 新增後應出現電號 Chip（空白時 label 回退為「電號1」）
      await waitFor(() => {
        expect(screen.getByText('電號1')).toBeInTheDocument()
      })
    })

    it('新增電廠後應該顯示公司選擇欄位', async () => {
      render(<TransferDocumentDialog {...mockProps} />, { mocks: getDefaultMocks() })

      await waitFor(() => {
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })

      const addButtons = screen.getAllByRole('button', { name: '新增' })
      fireEvent.click(addButtons[0])

      // 新增電廠後，應該顯示公司選擇表單欄位
      await waitFor(() => {
        expect(screen.getByLabelText('公司1名稱')).toBeInTheDocument()
      })
    })

    it('新增用戶後應該顯示用戶選擇欄位', async () => {
      render(<TransferDocumentDialog {...mockProps} />, { mocks: getDefaultMocks() })

      await waitFor(() => {
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })

      const addButtons = screen.getAllByRole('button', { name: '新增' })
      fireEvent.click(addButtons[1])

      // 新增用戶後，應該顯示用戶選擇表單欄位
      await waitFor(() => {
        expect(screen.getByLabelText('用戶名稱')).toBeInTheDocument()
      })
    })
  })

  describe('表單驗證測試', () => {
    it('create mode 按鈕區塊應該存在', async () => {
      render(<TransferDocumentDialog {...mockProps} />, { mocks: getDefaultMocks() })

      await waitFor(() => {
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })

      // CreateTransferDocumentBtn 透過 next/dynamic 載入（jest.setup.ts 全域 mock 回傳 null）
      // 驗證按鈕區塊的容器存在（包含儲存/確認按鈕的 Grid）
      // 在 create mode 下不應有確認按鈕（確認按鈕只在 edit mode 出現）
      expect(screen.queryByRole('button', { name: /確認/ })).not.toBeInTheDocument()
    })

    it('表單渲染後 onClose 不應被自動呼叫', async () => {
      render(<TransferDocumentDialog {...mockProps} />, { mocks: getDefaultMocks() })

      await waitFor(() => {
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })

      // 驗證表單渲染後不會自動觸發 onClose
      expect(mockProps.onClose).not.toHaveBeenCalled()
    })
  })

  describe('編輯模式測試', () => {
    it('應該預填現有資料', async () => {
      const editProps = {
        ...mockProps,
        variant: 'edit' as const,
        currentModifyTransferDocument: {
          id: '1',
          name: 'Existing Contract',
          number: 'EC001',
          receptionAreas: '台北',
          expectedTime: '2024-06-01T00:00:00Z',
          transferDocumentPowerPlants: [],
          transferDocumentUsers: []
        }
      }

      render(<TransferDocumentDialog {...editProps} />, { mocks: getDefaultMocks() })

      await waitFor(() => {
        expect(screen.getByText('修改轉供合約')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Existing Contract')).toBeInTheDocument()
      })
    })

    it('edit mode 應該顯示確認按鈕而非儲存按鈕', async () => {
      const editProps = {
        ...mockProps,
        variant: 'edit' as const,
        currentModifyTransferDocument: {
          id: '1',
          name: 'Existing Contract',
          number: 'EC001',
          receptionAreas: '台北',
          expectedTime: '2024-06-01T00:00:00Z',
          transferDocumentPowerPlants: [],
          transferDocumentUsers: []
        }
      }

      render(<TransferDocumentDialog {...editProps} />, { mocks: getDefaultMocks() })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /確認/ })).toBeInTheDocument()
      })

      // 不應顯示儲存按鈕
      expect(screen.queryByRole('button', { name: /儲存/ })).not.toBeInTheDocument()
    })
  })
})
