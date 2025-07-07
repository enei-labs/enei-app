import React from 'react'
import ErrorBoundary from './ErrorBoundary'
import { Box, Typography, Button } from '@mui/material'
import { useRouter } from 'next/router'

interface Props {
  children: React.ReactNode
}

const PageErrorBoundary = ({ children }: Props) => {
  const router = useRouter()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <ErrorBoundary
      fallback={
        <Box sx={{ p: 4, textAlign: 'center', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h5" color="error" sx={{ mb: 2 }}>
            頁面載入時發生錯誤
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            很抱歉，此頁面暫時無法正常顯示
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="outlined" onClick={handleGoBack}>
              返回上一頁
            </Button>
            <Button variant="contained" onClick={() => window.location.reload()}>
              重新整理
            </Button>
          </Box>
        </Box>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export default PageErrorBoundary