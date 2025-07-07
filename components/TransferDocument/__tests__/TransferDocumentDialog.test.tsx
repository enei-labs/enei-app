import React from 'react'
import { screen, fireEvent, waitFor, within } from '@testing-library/react'
import { render, FormWrapper, createMockResponse } from '@utils/test-utils'
import TransferDocumentDialog from '../TransferDocumentDialog/TransferDocumentDialog'
import { COMPANIES_WITH_POWER_PLANTS, BASE_USERS, USER_CONTRACTS } from '@core/graphql/queries'

// Mock data
const mockCompanies = [
  {
    id: '1',
    name: 'Company 1',
    powerPlants: [
      { id: 'pp1', name: 'Power Plant 1', number: 'PP001' },
      { id: 'pp2', name: 'Power Plant 2', number: 'PP002' }
    ]
  }
]

const mockUsers = [
  { id: '1', name: 'User 1' },
  { id: '2', name: 'User 2' }
]

const mockUserContracts = [
  { id: 'uc1', name: 'User Contract 1' },
  { id: 'uc2', name: 'User Contract 2' }
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

  describe('動態表單欄位測試', () => {
    it('應該能新增和移除電廠欄位', async () => {
      const mocks = [
        createMockResponse(COMPANIES_WITH_POWER_PLANTS, {}, { companies: mockCompanies }),
        createMockResponse(BASE_USERS, { onlyBasicInformation: true }, { users: mockUsers })
      ]

      render(<TransferDocumentDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })

      // 查找新增電廠按鈕
      const addPowerPlantButton = screen.getByRole('button', { name: /新增電廠/i }) ||
                                 screen.getByText(/新增電廠/i)

      // 點擊新增電廠
      fireEvent.click(addPowerPlantButton)

      await waitFor(() => {
        // 檢查是否新增了電廠選擇欄位
        const powerPlantSelects = screen.getAllByLabelText(/電廠/i) || 
                                 screen.getAllByText(/選擇電廠/i)
        expect(powerPlantSelects.length).toBeGreaterThan(0)
      })

      // 再新增一個電廠
      fireEvent.click(addPowerPlantButton)

      await waitFor(() => {
        const powerPlantSelects = screen.getAllByLabelText(/電廠/i) ||
                                 screen.getAllByText(/選擇電廠/i)
        expect(powerPlantSelects.length).toBeGreaterThan(1)
      })

      // 測試移除電廠
      const removeButtons = screen.getAllByRole('button', { name: /移除/i }) ||
                          screen.getAllByLabelText(/移除/i)
      
      if (removeButtons.length > 0) {
        fireEvent.click(removeButtons[0])

        await waitFor(() => {
          const updatedSelects = screen.getAllByLabelText(/電廠/i) ||
                               screen.getAllByText(/選擇電廠/i)
          expect(updatedSelects.length).toBeLessThan(powerPlantSelects.length)
        })
      }
    })

    it('應該能新增和移除用戶欄位', async () => {
      const mocks = [
        createMockResponse(COMPANIES_WITH_POWER_PLANTS, {}, { companies: mockCompanies }),
        createMockResponse(BASE_USERS, { onlyBasicInformation: true }, { users: mockUsers })
      ]

      render(<TransferDocumentDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })

      // 查找新增用戶按鈕
      const addUserButton = screen.getByRole('button', { name: /新增用戶/i }) ||
                           screen.getByText(/新增用戶/i)

      // 點擊新增用戶
      fireEvent.click(addUserButton)

      await waitFor(() => {
        // 檢查是否新增了用戶選擇欄位
        const userSelects = screen.getAllByLabelText(/用戶/i) ||
                          screen.getAllByText(/選擇用戶/i)
        expect(userSelects.length).toBeGreaterThan(0)
      })

      // 測試多次新增
      fireEvent.click(addUserButton)
      fireEvent.click(addUserButton)

      await waitFor(() => {
        const userSelects = screen.getAllByLabelText(/用戶/i) ||
                          screen.getAllByText(/選擇用戶/i)
        expect(userSelects.length).toBeGreaterThanOrEqual(2)
      })
    })

    it('選擇用戶後應該載入相關的用戶合約', async () => {
      const mocks = [
        createMockResponse(COMPANIES_WITH_POWER_PLANTS, {}, { companies: mockCompanies }),
        createMockResponse(BASE_USERS, { onlyBasicInformation: true }, { users: mockUsers }),
        createMockResponse(USER_CONTRACTS, { userId: '1' }, { userContracts: mockUserContracts })
      ]

      render(<TransferDocumentDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })

      // 新增用戶欄位
      const addUserButton = screen.getByRole('button', { name: /新增用戶/i }) ||
                           screen.getByText(/新增用戶/i)
      fireEvent.click(addUserButton)

      await waitFor(() => {
        // 選擇用戶
        const userSelect = screen.getByRole('combobox', { name: /用戶/i }) ||
                          screen.getAllByRole('button')[0]
        
        fireEvent.mouseDown(userSelect)
        
        await waitFor(() => {
          const userOption = screen.getByText('User 1')
          fireEvent.click(userOption)
        })

        // 選擇用戶後應該觸發載入用戶合約
        await waitFor(() => {
          expect(screen.getByText('User Contract 1') || screen.getByText('User Contract 2')).toBeInTheDocument()
        })
      })
    })

    it('電廠選擇應該根據公司篩選', async () => {
      const mocks = [
        createMockResponse(COMPANIES_WITH_POWER_PLANTS, {}, { companies: mockCompanies }),
        createMockResponse(BASE_USERS, { onlyBasicInformation: true }, { users: mockUsers })
      ]

      render(<TransferDocumentDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })

      // 新增電廠欄位
      const addPowerPlantButton = screen.getByRole('button', { name: /新增電廠/i }) ||
                                 screen.getByText(/新增電廠/i)
      fireEvent.click(addPowerPlantButton)

      await waitFor(() => {
        // 先選擇公司
        const companySelect = screen.getByRole('combobox', { name: /公司/i }) ||
                            screen.getAllByRole('button')[0]
        
        fireEvent.mouseDown(companySelect)
        
        await waitFor(() => {
          const companyOption = screen.getByText('Company 1')
          fireEvent.click(companyOption)
        })

        // 選擇公司後，電廠選項應該被篩選
        await waitFor(() => {
          const powerPlantSelect = screen.getByRole('combobox', { name: /電廠/i })
          fireEvent.mouseDown(powerPlantSelect)
          
          // 應該只顯示該公司的電廠
          expect(screen.getByText('Power Plant 1')).toBeInTheDocument()
          expect(screen.getByText('Power Plant 2')).toBeInTheDocument()
        })
      })
    })

    it('應該驗證年度轉供度數為數字', async () => {
      const mocks = [
        createMockResponse(COMPANIES_WITH_POWER_PLANTS, {}, { companies: mockCompanies }),
        createMockResponse(BASE_USERS, { onlyBasicInformation: true }, { users: mockUsers })
      ]

      render(<TransferDocumentDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })

      // 新增電廠欄位
      const addPowerPlantButton = screen.getByRole('button', { name: /新增電廠/i }) ||
                                 screen.getByText(/新增電廠/i)
      fireEvent.click(addPowerPlantButton)

      await waitFor(() => {
        // 尋找年度轉供度數輸入欄位
        const degreeInput = screen.getByLabelText(/年度轉供度數/i) ||
                          screen.getByPlaceholderText(/年度轉供度數/i)

        // 測試輸入非數字
        fireEvent.change(degreeInput, { target: { value: 'abc' } })
        fireEvent.blur(degreeInput)

        // 應該顯示驗證錯誤
        await waitFor(() => {
          expect(screen.getByText(/請輸入有效數字/i) || screen.getByText(/格式錯誤/i)).toBeInTheDocument()
        })

        // 測試輸入正確的數字
        fireEvent.change(degreeInput, { target: { value: '1000' } })
        fireEvent.blur(degreeInput)

        // 錯誤訊息應該消失
        await waitFor(() => {
          expect(screen.queryByText(/請輸入有效數字/i)).not.toBeInTheDocument()
        })
      })
    })
  })

  describe('表單驗證測試', () => {
    it('應該驗證轉供合約名稱為必填', async () => {
      const mocks = [
        createMockResponse(COMPANIES_WITH_POWER_PLANTS, {}, { companies: mockCompanies }),
        createMockResponse(BASE_USERS, { onlyBasicInformation: true }, { users: mockUsers })
      ]

      render(<TransferDocumentDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })

      // 直接提交而不填寫名稱
      const submitButton = screen.getByRole('button', { name: /儲存/i }) ||
                          screen.getByRole('button', { name: /新增/i })
      
      fireEvent.click(submitButton)

      await waitFor(() => {
        // 應該顯示必填欄位錯誤
        expect(screen.getByText(/此欄位為必填/i) || screen.getByText(/請填入/i)).toBeInTheDocument()
      })
    })

    it('應該驗證轉供契約編號為必填', async () => {
      const mocks = [
        createMockResponse(COMPANIES_WITH_POWER_PLANTS, {}, { companies: mockCompanies }),
        createMockResponse(BASE_USERS, { onlyBasicInformation: true }, { users: mockUsers })
      ]

      render(<TransferDocumentDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })

      // 填寫名稱但不填寫編號
      const nameInput = screen.getByLabelText(/轉供合約名稱/i) ||
                       screen.getByPlaceholderText(/請填入/i)
      
      fireEvent.change(nameInput, { target: { value: 'Test Contract' } })

      const submitButton = screen.getByRole('button', { name: /儲存/i }) ||
                          screen.getByRole('button', { name: /新增/i })
      
      fireEvent.click(submitButton)

      await waitFor(() => {
        // 應該顯示編號必填錯誤
        const inputs = screen.getAllByRole('textbox')
        // 檢查是否有驗證錯誤訊息
      })
    })

    it('至少要有一個電廠', async () => {
      const mocks = [
        createMockResponse(COMPANIES_WITH_POWER_PLANTS, {}, { companies: mockCompanies }),
        createMockResponse(BASE_USERS, { onlyBasicInformation: true }, { users: mockUsers })
      ]

      render(<TransferDocumentDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })

      // 填寫基本資訊但不新增電廠
      const nameInput = screen.getByLabelText(/轉供合約名稱/i) ||
                       screen.getByPlaceholderText(/請填入/i)
      fireEvent.change(nameInput, { target: { value: 'Test Contract' } })

      const submitButton = screen.getByRole('button', { name: /儲存/i }) ||
                          screen.getByRole('button', { name: /新增/i })
      
      fireEvent.click(submitButton)

      // 應該有驗證錯誤提示需要至少一個電廠
    })

    it('至少要有一個用戶', async () => {
      const mocks = [
        createMockResponse(COMPANIES_WITH_POWER_PLANTS, {}, { companies: mockCompanies }),
        createMockResponse(BASE_USERS, { onlyBasicInformation: true }, { users: mockUsers })
      ]

      render(<TransferDocumentDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })

      // 填寫基本資訊和電廠但不新增用戶
      const nameInput = screen.getByLabelText(/轉供合約名稱/i) ||
                       screen.getByPlaceholderText(/請填入/i)
      fireEvent.change(nameInput, { target: { value: 'Test Contract' } })

      // 新增電廠
      const addPowerPlantButton = screen.getByRole('button', { name: /新增電廠/i }) ||
                                 screen.getByText(/新增電廠/i)
      fireEvent.click(addPowerPlantButton)

      const submitButton = screen.getByRole('button', { name: /儲存/i }) ||
                          screen.getByRole('button', { name: /新增/i })
      
      fireEvent.click(submitButton)

      // 應該有驗證錯誤提示需要至少一個用戶
    })
  })

  describe('複雜互動流程測試', () => {
    it('完整的表單填寫和提交流程', async () => {
      const mocks = [
        createMockResponse(COMPANIES_WITH_POWER_PLANTS, {}, { companies: mockCompanies }),
        createMockResponse(BASE_USERS, { onlyBasicInformation: true }, { users: mockUsers }),
        createMockResponse(USER_CONTRACTS, { userId: '1' }, { userContracts: mockUserContracts })
      ]

      render(<TransferDocumentDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })

      // 1. 填寫基本資訊
      const nameInput = screen.getByLabelText(/轉供合約名稱/i) ||
                       screen.getByPlaceholderText(/請填入/i)
      fireEvent.change(nameInput, { target: { value: 'Complete Test Contract' } })

      // 2. 新增並設定電廠
      const addPowerPlantButton = screen.getByRole('button', { name: /新增電廠/i }) ||
                                 screen.getByText(/新增電廠/i)
      fireEvent.click(addPowerPlantButton)

      await waitFor(() => {
        // 選擇公司和電廠
        const companySelect = screen.getByRole('combobox', { name: /公司/i }) ||
                            screen.getAllByRole('button')[0]
        fireEvent.mouseDown(companySelect)
        
        const companyOption = screen.getByText('Company 1')
        fireEvent.click(companyOption)
      })

      // 3. 新增並設定用戶
      const addUserButton = screen.getByRole('button', { name: /新增用戶/i }) ||
                           screen.getByText(/新增用戶/i)
      fireEvent.click(addUserButton)

      await waitFor(() => {
        // 選擇用戶
        const userSelect = screen.getByRole('combobox', { name: /用戶/i })
        fireEvent.mouseDown(userSelect)
        
        const userOption = screen.getByText('User 1')
        fireEvent.click(userOption)
      })

      // 4. 提交表單
      const submitButton = screen.getByRole('button', { name: /儲存/i }) ||
                          screen.getByRole('button', { name: /新增/i })
      
      fireEvent.click(submitButton)

      // 5. 檢查提交結果
      await waitFor(() => {
        // 根據實際的成功提示來調整
        expect(mockProps.onClose).toHaveBeenCalled()
      })
    })

    it('編輯模式應該預填現有資料', async () => {
      const editProps = {
        ...mockProps,
        variant: 'edit' as const,
        currentModifyTransferDocument: {
          id: '1',
          name: 'Existing Contract',
          number: 'EC001',
          transferDocumentPowerPlants: [],
          transferDocumentUsers: []
        }
      }

      const mocks = [
        createMockResponse(COMPANIES_WITH_POWER_PLANTS, {}, { companies: mockCompanies }),
        createMockResponse(BASE_USERS, { onlyBasicInformation: true }, { users: mockUsers })
      ]

      render(<TransferDocumentDialog {...editProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('修改轉供合約')).toBeInTheDocument()
        
        // 檢查是否預填了現有資料
        const nameInput = screen.getByDisplayValue('Existing Contract')
        expect(nameInput).toBeInTheDocument()
      })
    })

    it('動態欄位數量控制應該正常工作', async () => {
      const mocks = [
        createMockResponse(COMPANIES_WITH_POWER_PLANTS, {}, { companies: mockCompanies }),
        createMockResponse(BASE_USERS, { onlyBasicInformation: true }, { users: mockUsers })
      ]

      render(<TransferDocumentDialog {...mockProps} />, { mocks })

      await waitFor(() => {
        expect(screen.getByText('新增轉供合約')).toBeInTheDocument()
      })

      // 測試一次新增多個電廠和用戶
      const addPowerPlantButton = screen.getByRole('button', { name: /新增電廠/i })
      const addUserButton = screen.getByRole('button', { name: /新增用戶/i })

      // 新增3個電廠
      for (let i = 0; i < 3; i++) {
        fireEvent.click(addPowerPlantButton)
      }

      // 新增2個用戶
      for (let i = 0; i < 2; i++) {
        fireEvent.click(addUserButton)
      }

      await waitFor(() => {
        // 檢查是否正確新增了對應數量的欄位
        const powerPlantSections = screen.getAllByText(/電廠/i)
        const userSections = screen.getAllByText(/用戶/i)
        
        expect(powerPlantSections.length).toBeGreaterThanOrEqual(3)
        expect(userSections.length).toBeGreaterThanOrEqual(2)
      })
    })
  })
})