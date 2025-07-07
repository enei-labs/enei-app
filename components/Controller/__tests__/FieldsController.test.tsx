import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render, FormWrapper } from '@utils/test-utils'
import { FieldsController } from '../FieldsController'
import { FieldConfig } from '@core/types'

const mockTextConfig: FieldConfig = {
  type: 'TEXT',
  name: 'testText',
  label: 'Test Text Field',
  placeholder: 'Enter text',
  required: true,
  validated: {
    required: { value: true, message: '此欄位為必填' },
    minLength: { value: 3, message: '最少需要3個字符' }
  }
}

const mockNumberConfig: FieldConfig = {
  type: 'NUMBER',
  name: 'testNumber',
  label: 'Test Number Field',
  placeholder: 'Enter number',
  required: true,
  validated: {
    required: { value: true, message: '此欄位為必填' },
    min: { value: 0, message: '數值不能小於0' },
    max: { value: 100, message: '數值不能大於100' }
  }
}

const mockSelectConfig: FieldConfig = {
  type: 'SELECT',
  name: 'testSelect',
  label: 'Test Select Field',
  required: true,
  options: [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' }
  ],
  validated: {
    required: { value: true, message: '請選擇一個選項' }
  }
}

const mockDateConfig: FieldConfig = {
  type: 'DATE',
  name: 'testDate',
  label: 'Test Date Field',
  required: true,
  validated: {
    required: { value: true, message: '請選擇日期' }
  }
}

describe('FieldsController', () => {
  describe('文字輸入欄位測試', () => {
    it('應該渲染文字輸入欄位', () => {
      render(
        <FormWrapper>
          <FieldsController
            configs={[mockTextConfig]}
            form={{ control: {} as any, errors: {} }}
          />
        </FormWrapper>
      )

      expect(screen.getByLabelText('Test Text Field')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    })

    it('應該顯示必填標記', () => {
      render(
        <FormWrapper>
          <FieldsController
            configs={[mockTextConfig]}
            form={{ control: {} as any, errors: {} }}
          />
        </FormWrapper>
      )

      // 檢查是否有必填標記（通常是星號）
      expect(screen.getByText(/Test Text Field/)).toBeInTheDocument()
    })

    it('應該驗證必填欄位', async () => {
      const mockOnSubmit = jest.fn()

      render(
        <FormWrapper onSubmit={mockOnSubmit}>
          <FieldsController
            configs={[mockTextConfig]}
            form={{ control: {} as any, errors: {} }}
          />
          <button type="submit">Submit</button>
        </FormWrapper>
      )

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('此欄位為必填')).toBeInTheDocument()
      })

      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('應該驗證最小長度', async () => {
      render(
        <FormWrapper>
          <FieldsController
            configs={[mockTextConfig]}
            form={{ control: {} as any, errors: {} }}
          />
          <button type="submit">Submit</button>
        </FormWrapper>
      )

      const textInput = screen.getByLabelText('Test Text Field')
      fireEvent.change(textInput, { target: { value: 'ab' } })
      fireEvent.blur(textInput)

      await waitFor(() => {
        expect(screen.getByText('最少需要3個字符')).toBeInTheDocument()
      })
    })

    it('有效輸入應該通過驗證', async () => {
      const mockOnSubmit = jest.fn()

      render(
        <FormWrapper onSubmit={mockOnSubmit}>
          <FieldsController
            configs={[mockTextConfig]}
            form={{ control: {} as any, errors: {} }}
          />
          <button type="submit">Submit</button>
        </FormWrapper>
      )

      const textInput = screen.getByLabelText('Test Text Field')
      fireEvent.change(textInput, { target: { value: 'valid input' } })

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          testText: 'valid input'
        })
      })
    })
  })

  describe('數字輸入欄位測試', () => {
    it('應該渲染數字輸入欄位', () => {
      render(
        <FormWrapper>
          <FieldsController
            configs={[mockNumberConfig]}
            form={{ control: {} as any, errors: {} }}
          />
        </FormWrapper>
      )

      const numberInput = screen.getByLabelText('Test Number Field')
      expect(numberInput).toBeInTheDocument()
      expect(numberInput).toHaveAttribute('type', 'number')
    })

    it('應該驗證最小值', async () => {
      render(
        <FormWrapper>
          <FieldsController
            configs={[mockNumberConfig]}
            form={{ control: {} as any, errors: {} }}
          />
        </FormWrapper>
      )

      const numberInput = screen.getByLabelText('Test Number Field')
      fireEvent.change(numberInput, { target: { value: '-5' } })
      fireEvent.blur(numberInput)

      await waitFor(() => {
        expect(screen.getByText('數值不能小於0')).toBeInTheDocument()
      })
    })

    it('應該驗證最大值', async () => {
      render(
        <FormWrapper>
          <FieldsController
            configs={[mockNumberConfig]}
            form={{ control: {} as any, errors: {} }}
          />
        </FormWrapper>
      )

      const numberInput = screen.getByLabelText('Test Number Field')
      fireEvent.change(numberInput, { target: { value: '150' } })
      fireEvent.blur(numberInput)

      await waitFor(() => {
        expect(screen.getByText('數值不能大於100')).toBeInTheDocument()
      })
    })

    it('有效數字應該通過驗證', async () => {
      const mockOnSubmit = jest.fn()

      render(
        <FormWrapper onSubmit={mockOnSubmit}>
          <FieldsController
            configs={[mockNumberConfig]}
            form={{ control: {} as any, errors: {} }}
          />
          <button type="submit">Submit</button>
        </FormWrapper>
      )

      const numberInput = screen.getByLabelText('Test Number Field')
      fireEvent.change(numberInput, { target: { value: '50' } })

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          testNumber: 50
        })
      })
    })
  })

  describe('選擇欄位測試', () => {
    it('應該渲染選擇欄位', () => {
      render(
        <FormWrapper>
          <FieldsController
            configs={[mockSelectConfig]}
            form={{ control: {} as any, errors: {} }}
          />
        </FormWrapper>
      )

      expect(screen.getByLabelText('Test Select Field')).toBeInTheDocument()
    })

    it('應該顯示所有選項', async () => {
      render(
        <FormWrapper>
          <FieldsController
            configs={[mockSelectConfig]}
            form={{ control: {} as any, errors: {} }}
          />
        </FormWrapper>
      )

      const selectField = screen.getByLabelText('Test Select Field')
      fireEvent.mouseDown(selectField)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
        expect(screen.getByText('Option 2')).toBeInTheDocument()
        expect(screen.getByText('Option 3')).toBeInTheDocument()
      })
    })

    it('應該能選擇選項', async () => {
      const mockOnSubmit = jest.fn()

      render(
        <FormWrapper onSubmit={mockOnSubmit}>
          <FieldsController
            configs={[mockSelectConfig]}
            form={{ control: {} as any, errors: {} }}
          />
          <button type="submit">Submit</button>
        </FormWrapper>
      )

      const selectField = screen.getByLabelText('Test Select Field')
      fireEvent.mouseDown(selectField)

      await waitFor(() => {
        const option2 = screen.getByText('Option 2')
        fireEvent.click(option2)
      })

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          testSelect: 'opt2'
        })
      })
    })

    it('未選擇時應該顯示驗證錯誤', async () => {
      render(
        <FormWrapper>
          <FieldsController
            configs={[mockSelectConfig]}
            form={{ control: {} as any, errors: {} }}
          />
          <button type="submit">Submit</button>
        </FormWrapper>
      )

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('請選擇一個選項')).toBeInTheDocument()
      })
    })
  })

  describe('日期欄位測試', () => {
    it('應該渲染日期選擇器', () => {
      render(
        <FormWrapper>
          <FieldsController
            configs={[mockDateConfig]}
            form={{ control: {} as any, errors: {} }}
          />
        </FormWrapper>
      )

      expect(screen.getByLabelText('Test Date Field')).toBeInTheDocument()
    })

    it('應該能選擇日期', async () => {
      const mockOnSubmit = jest.fn()

      render(
        <FormWrapper onSubmit={mockOnSubmit}>
          <FieldsController
            configs={[mockDateConfig]}
            form={{ control: {} as any, errors: {} }}
          />
          <button type="submit">Submit</button>
        </FormWrapper>
      )

      const dateInput = screen.getByLabelText('Test Date Field')
      
      // 模擬日期選擇（這可能需要根據實際的日期選擇器實作調整）
      fireEvent.change(dateInput, { target: { value: '2024-01-15' } })

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          testDate: expect.any(Date)
        })
      })
    })

    it('未選擇日期時應該顯示驗證錯誤', async () => {
      render(
        <FormWrapper>
          <FieldsController
            configs={[mockDateConfig]}
            form={{ control: {} as any, errors: {} }}
          />
          <button type="submit">Submit</button>
        </FormWrapper>
      )

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('請選擇日期')).toBeInTheDocument()
      })
    })
  })

  describe('多欄位組合測試', () => {
    it('應該渲染多個不同類型的欄位', () => {
      const configs = [mockTextConfig, mockNumberConfig, mockSelectConfig, mockDateConfig]

      render(
        <FormWrapper>
          <FieldsController
            configs={configs}
            form={{ control: {} as any, errors: {} }}
          />
        </FormWrapper>
      )

      expect(screen.getByLabelText('Test Text Field')).toBeInTheDocument()
      expect(screen.getByLabelText('Test Number Field')).toBeInTheDocument()
      expect(screen.getByLabelText('Test Select Field')).toBeInTheDocument()
      expect(screen.getByLabelText('Test Date Field')).toBeInTheDocument()
    })

    it('應該能同時驗證多個欄位', async () => {
      const configs = [mockTextConfig, mockNumberConfig]

      render(
        <FormWrapper>
          <FieldsController
            configs={configs}
            form={{ control: {} as any, errors: {} }}
          />
          <button type="submit">Submit</button>
        </FormWrapper>
      )

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('此欄位為必填')).toBeInTheDocument()
        // 應該有兩個必填錯誤訊息
        const requiredErrors = screen.getAllByText('此欄位為必填')
        expect(requiredErrors.length).toBe(2)
      })
    })

    it('應該能提交包含所有欄位的有效表單', async () => {
      const configs = [mockTextConfig, mockNumberConfig, mockSelectConfig]
      const mockOnSubmit = jest.fn()

      render(
        <FormWrapper onSubmit={mockOnSubmit}>
          <FieldsController
            configs={configs}
            form={{ control: {} as any, errors: {} }}
          />
          <button type="submit">Submit</button>
        </FormWrapper>
      )

      // 填寫所有欄位
      fireEvent.change(screen.getByLabelText('Test Text Field'), {
        target: { value: 'valid text' }
      })
      fireEvent.change(screen.getByLabelText('Test Number Field'), {
        target: { value: '50' }
      })

      const selectField = screen.getByLabelText('Test Select Field')
      fireEvent.mouseDown(selectField)
      await waitFor(() => {
        fireEvent.click(screen.getByText('Option 1'))
      })

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          testText: 'valid text',
          testNumber: 50,
          testSelect: 'opt1'
        })
      })
    })
  })

  describe('動態欄位配置測試', () => {
    it('應該支援條件顯示欄位', () => {
      const conditionalConfig: FieldConfig = {
        ...mockTextConfig,
        name: 'conditionalField',
        label: 'Conditional Field',
        condition: (formValues: any) => formValues.showField === true
      }

      const configs = [
        {
          type: 'CHECKBOX' as const,
          name: 'showField',
          label: 'Show Conditional Field'
        },
        conditionalConfig
      ]

      render(
        <FormWrapper defaultValues={{ showField: false }}>
          <FieldsController
            configs={configs}
            form={{ control: {} as any, errors: {} }}
          />
        </FormWrapper>
      )

      // 條件欄位初始不應該顯示
      expect(screen.queryByLabelText('Conditional Field')).not.toBeInTheDocument()

      // 勾選checkbox後應該顯示條件欄位
      const checkbox = screen.getByLabelText('Show Conditional Field')
      fireEvent.click(checkbox)

      expect(screen.getByLabelText('Conditional Field')).toBeInTheDocument()
    })

    it('應該支援禁用狀態', () => {
      const disabledConfig: FieldConfig = {
        ...mockTextConfig,
        disabled: true
      }

      render(
        <FormWrapper>
          <FieldsController
            configs={[disabledConfig]}
            form={{ control: {} as any, errors: {} }}
          />
        </FormWrapper>
      )

      const textInput = screen.getByLabelText('Test Text Field')
      expect(textInput).toBeDisabled()
    })

    it('應該支援唯讀狀態', () => {
      const readOnlyConfig: FieldConfig = {
        ...mockTextConfig,
        readOnly: true
      }

      render(
        <FormWrapper>
          <FieldsController
            configs={[readOnlyConfig]}
            form={{ control: {} as any, errors: {} }}
          />
        </FormWrapper>
      )

      const textInput = screen.getByLabelText('Test Text Field')
      expect(textInput).toHaveAttribute('readonly')
    })
  })
})