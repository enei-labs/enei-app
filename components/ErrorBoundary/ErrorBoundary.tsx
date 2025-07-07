import React, { Component, ReactNode } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { toast } from 'react-toastify'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    toast.error('發生未預期的錯誤，請重新整理頁面')
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            系統發生錯誤
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
            請重新整理頁面或聯絡系統管理員
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
          >
            重新整理
          </Button>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary