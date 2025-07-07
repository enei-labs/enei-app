import React, { useState } from 'react'
import { Button, Box, Typography } from '@mui/material'

interface ErrorTriggerProps {
  message?: string
}

const ErrorTrigger: React.FC<ErrorTriggerProps> = ({ message = '測試錯誤邊界' }) => {
  const [shouldThrow, setShouldThrow] = useState(false)
  
  if (shouldThrow) {
    throw new Error(message)
  }
  
  return (
    <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        開發工具：錯誤邊界測試元件
      </Typography>
      <Button 
        variant="outlined" 
        color="error" 
        size="small"
        onClick={() => setShouldThrow(true)}
      >
        觸發錯誤
      </Button>
    </Box>
  )
}

export default ErrorTrigger