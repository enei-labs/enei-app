import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { FormProvider, useForm } from 'react-hook-form'
import theme from '@config/theme'

interface AllTheProvidersProps {
  children: React.ReactNode
  mocks?: MockedResponse[]
}

const AllTheProviders = ({ children, mocks = [] }: AllTheProvidersProps) => {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </LocalizationProvider>
    </MockedProvider>
  )
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  mocks?: MockedResponse[]
}

const customRender = (
  ui: ReactElement,
  { mocks, ...options }: CustomRenderOptions = {}
) =>
  render(ui, {
    wrapper: ({ children }) => <AllTheProviders mocks={mocks}>{children}</AllTheProviders>,
    ...options,
  })

// Form wrapper for testing form components
interface FormWrapperProps {
  children: React.ReactNode
  defaultValues?: any
  onSubmit?: (data: any) => void
}

export const FormWrapper = ({ children, defaultValues = {}, onSubmit = jest.fn() }: FormWrapperProps) => {
  const methods = useForm({ defaultValues })
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  )
}

// Utility to create mock GraphQL responses
export const createMockResponse = (
  query: any,
  variables: any = {},
  data: any,
  error?: any
): MockedResponse => ({
  request: {
    query,
    variables,
  },
  result: error ? { errors: [error] } : { data },
})

// Utility to wait for component to update
export const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 0))

// Mock implementations for common hooks
export const mockHooks = {
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    reload: jest.fn(),
    query: {},
    pathname: '/',
    asPath: '/',
  }),
  
  useReactToPrint: () => jest.fn(),
  
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }