import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '@utils/test-utils'
import FieldsController from '../FieldsController'
import FieldConfig from '@core/types/fieldConfig'
import { useForm, FormProvider } from 'react-hook-form'

// Wrapper that provides a real react-hook-form control to FieldsController
const TestWrapper = ({
  configs,
  defaultValues = {},
  onSubmit = jest.fn(),
}: {
  configs: FieldConfig[]
  defaultValues?: any
  onSubmit?: (data: any) => void
}) => {
  const methods = useForm({ defaultValues })
  const { control, formState: { errors } } = methods

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FieldsController
          configs={configs}
          form={{ control, errors }}
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  )
}

const mockTextConfig: FieldConfig = {
  type: 'TEXT',
  name: 'testText',
  label: 'Test Text Field',
  placeholder: 'Enter text',
  required: true,
}

const mockNumberConfig: FieldConfig = {
  type: 'NUMBER',
  name: 'testNumber',
  label: 'Test Number Field',
  placeholder: 'Enter number',
  required: true,
}

const mockSelectConfig: FieldConfig = {
  type: 'SINGLE_SELECT',
  name: 'testSelect',
  label: 'Test Select Field',
  required: true,
  options: [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' },
  ],
}

const mockDateConfig: FieldConfig = {
  type: 'DATE',
  name: 'testDate',
  label: 'Test Date Field',
  required: false,
}

const mockTextareaConfig: FieldConfig = {
  type: 'TEXTAREA',
  name: 'testTextarea',
  label: 'Test Textarea Field',
  placeholder: 'Enter long text',
  required: false,
}

describe('FieldsController', () => {
  describe('文字輸入欄位測試', () => {
    it('應該渲染文字輸入欄位', () => {
      render(<TestWrapper configs={[mockTextConfig]} />)

      // MUI renders label text in multiple places (label + legend)
      expect(screen.getAllByText('Test Text Field').length).toBeGreaterThan(0)
    })

    it('應該顯示必填標記', () => {
      render(<TestWrapper configs={[mockTextConfig]} />)

      // 必填欄位應顯示紅色星號
      expect(screen.getAllByText('*').length).toBeGreaterThan(0)
    })

    it('應該渲染帶 placeholder 的輸入欄位', () => {
      render(<TestWrapper configs={[mockTextConfig]} />)

      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    })

    it('必填欄位未填寫時提交應該顯示驗證錯誤', async () => {
      const mockOnSubmit = jest.fn()

      render(<TestWrapper configs={[mockTextConfig]} onSubmit={mockOnSubmit} />)

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('此為必填欄位')).toBeInTheDocument()
      })

      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  describe('數字輸入欄位測試', () => {
    it('應該渲染數字輸入欄位', () => {
      render(<TestWrapper configs={[mockNumberConfig]} />)

      expect(screen.getAllByText('Test Number Field').length).toBeGreaterThan(0)
    })
  })

  describe('下拉選擇欄位測試', () => {
    it('應該渲染選擇欄位', () => {
      render(<TestWrapper configs={[mockSelectConfig]} />)

      expect(screen.getAllByText('Test Select Field').length).toBeGreaterThan(0)
    })
  })

  describe('日期欄位測試', () => {
    it('應該渲染日期選擇器', () => {
      render(<TestWrapper configs={[mockDateConfig]} />)

      expect(screen.getAllByText('Test Date Field').length).toBeGreaterThan(0)
    })
  })

  describe('文字區域欄位測試', () => {
    it('應該渲染文字區域', () => {
      render(<TestWrapper configs={[mockTextareaConfig]} />)

      expect(screen.getAllByText('Test Textarea Field').length).toBeGreaterThan(0)
    })
  })

  describe('多欄位組合測試', () => {
    it('應該渲染多個不同類型的欄位', () => {
      const configs = [mockTextConfig, mockNumberConfig, mockDateConfig]

      render(<TestWrapper configs={configs} />)

      expect(screen.getAllByText('Test Text Field').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Test Number Field').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Test Date Field').length).toBeGreaterThan(0)
    })

    it('應該能同時驗證多個必填欄位', async () => {
      const configs = [mockTextConfig, mockNumberConfig]

      render(<TestWrapper configs={configs} />)

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      fireEvent.click(submitButton)

      await waitFor(() => {
        const requiredErrors = screen.getAllByText('此為必填欄位')
        expect(requiredErrors.length).toBe(2)
      })
    })
  })

  describe('hint 提示文字測試', () => {
    it('應該顯示 hint 提示文字', () => {
      const configWithHint: FieldConfig = {
        ...mockTextConfig,
        hint: '這是提示文字',
      }

      render(<TestWrapper configs={[configWithHint]} />)

      expect(screen.getByText('這是提示文字')).toBeInTheDocument()
    })

    it('沒有 hint 時不應該顯示提示文字', () => {
      render(<TestWrapper configs={[mockTextConfig]} />)

      expect(screen.queryByText('這是提示文字')).not.toBeInTheDocument()
    })
  })

  describe('disabled 狀態測試', () => {
    it('應該支援禁用狀態', () => {
      const disabledConfig: FieldConfig = {
        ...mockTextConfig,
        disabled: true,
      }

      render(<TestWrapper configs={[disabledConfig]} />)

      const textInput = screen.getByPlaceholderText('Enter text')
      expect(textInput).toBeDisabled()
    })
  })
})
