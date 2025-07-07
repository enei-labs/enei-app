import React from 'react'
import ErrorBoundary from './ErrorBoundary'
import { Box, Typography, Button } from '@mui/material'

interface Props {
  children: React.ReactNode
  onClose?: () => void
}

const DialogErrorBoundary = ({ children, onClose }: Props) => {
  return (
    <ErrorBoundary
      fallback={
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="error">
            載入對話框時發生錯誤
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
            請關閉對話框後重新嘗試
          </Typography>
          {onClose && (
            <Button onClick={onClose} sx={{ mt: 2 }}>
              關閉
            </Button>
          )}
        </Box>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export default DialogErrorBoundary