import React, { Suspense } from 'react'
import ErrorBoundary from './ErrorBoundary'
import { Box, CircularProgress, Typography } from '@mui/material'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
  loading?: React.ReactNode
}

const DynamicErrorBoundary = ({ children, fallback, loading }: Props) => {
  const defaultLoading = (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
      <CircularProgress size={20} />
      <Typography variant="body2" sx={{ ml: 1 }}>
        載入中...
      </Typography>
    </Box>
  )

  const defaultFallback = (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="body2" color="error">
        動態載入元件時發生錯誤
      </Typography>
    </Box>
  )

  return (
    <ErrorBoundary fallback={fallback || defaultFallback}>
      <Suspense fallback={loading || defaultLoading}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

export default DynamicErrorBoundary